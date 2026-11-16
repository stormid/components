import { h, focusFirstInvalidField, updateMessageValues } from './index.js';
import { isCheckable, isMessage } from '../validator/utils.js';
import defaults from '../defaults/index.js';
import { ERROR_SUMMARY_CLASSNAMES } from '../constants/index.js';

//each form's summary and its items, keyed by group name. Held here rather than in state so the reducers
//don't track DOM nodes; a WeakMap so a form that is removed from the document isn't kept alive
const summaries = new WeakMap();

//each form's errorSummaryId element, if it has one: the summary is rendered into it rather than before the form
const containers = new WeakMap();
//the form each errorSummaryId element is in use by, so another form can't render into and clear it
const owners = new WeakMap();

const isEnabled = state => !!(state.settings && state.settings.errorSummary);

/**
 * Empties a node without innerHTML or replaceChildren, which older browsers don't support
 *
 * @param node [DOM node]
 */
const empty = node => {
    while (node.firstChild) node.removeChild(node.firstChild);
};

/**
 * Finds the element named by the errorSummaryId option, warning if it can't be used so the summary falls back to
 * being rendered before the form
 *
 * @param state [Object, validation state]
 *
 * @returns [DOM node|undefined]
 */
const resolveContainer = state => {
    const id = state.settings.errorSummaryId;
    if (id === undefined) return;
    if (!isMessage(id)) return console.warn('The errorSummaryId option must be a non-empty string, rendering the error summary before the form.');
    const container = document.getElementById(id);
    if (!container) return console.warn(`No element with the id '${id}' was found for the error summary, rendering it before the form.`);
    //rendering into an element that contains the form would empty the form out of the page
    if (container.contains(state.form)) return console.warn(`The element with the id '${id}' contains the form, so it can't be used for the error summary, rendering it before the form.`);
    const owner = owners.get(container);
    if (owner && owner !== state.form) return console.warn(`The element with the id '${id}' is already used for another form's error summary, rendering it before the form.`);
    owners.set(container, state.form);
    return container;
};

/**
 * Focuses a node that isn't natively focusable, as govuk-frontend does: a temporary tabindex makes it focusable,
 * and is removed on blur so that clicking the node later doesn't focus it
 *
 * @param node [DOM node]
 */
export const setFocus = node => {
    if (!node.hasAttribute('tabindex')) {
        node.setAttribute('tabindex', '-1');
        node.addEventListener('blur', () => node.removeAttribute('tabindex'), { once: true });
    }
    node.focus();
};

/**
 * The element to bring into view when a summary link is followed, so the question is visible and not just its input
 * (ported from govuk-frontend's ErrorSummary): the fieldset's legend for a radio or checkbox, or for another field
 * when the legend is within half a viewport of it (e.g. a date's day, month and year fields), otherwise the field's label
 *
 * @param field [DOM node]
 *
 * @returns [DOM node]
 */
export const findScrollTarget = field => {
    const fieldset = field.closest('fieldset');
    const legend = fieldset && fieldset.querySelector('legend');
    if (legend) {
        if (isCheckable(field)) return legend;
        const legendTop = legend.getBoundingClientRect().top;
        const fieldRect = field.getBoundingClientRect();
        if (fieldRect.height && window.innerHeight && fieldRect.top + fieldRect.height - legendTop < window.innerHeight / 2) return legend;
    }
    //compared by htmlFor rather than a label[for] selector, which an id containing a quote would break
    const label = field.id && Array.from(document.getElementsByTagName('label')).find(candidate => candidate.htmlFor === field.id);
    return label || field.closest('label') || field;
};

/**
 * Click handler for a summary link: focuses the field, scrolling its label or legend into view rather than the input
 *
 * @param field [DOM node] the field the link targets
 */
const followLink = field => event => {
    event.preventDefault();
    const target = findScrollTarget(field);
    //happy-dom/jsdom test doubles don't implement scrollIntoView
    if (target.scrollIntoView) target.scrollIntoView();
    field.focus({ preventScroll: true });
};

/**
 * The field a group's summary link targets: the first field in the group with an id (the first radio button or checkbox of a group)
 *
 * @param group [Object, validation group]
 *
 * @returns [DOM node|undefined]
 */
const findLinkTarget = group => group.fields.find(field => field.id);

/**
 * Removes the form's error summary, if one is rendered. If focus is in the summary, it moves to the form rather than being lost
 *
 * @param state [Object, validation state]
 */
export const removeErrorSummary = state => {
    const summary = summaries.get(state.form);
    if (!summary) return;
    summaries.delete(state.form);
    if (summary.node.contains(document.activeElement)) setFocus(state.form);
    //an errorSummaryId element belongs to the page, so it is emptied and hidden rather than removed
    if (summary.container) {
        empty(summary.node);
        summary.node.setAttribute('hidden', '');
    } else if (summary.node.parentNode) summary.node.parentNode.removeChild(summary.node);
};

/**
 * Removes the form's error summary when the instance is destroyed, and releases its errorSummaryId element,
 * so a new instance on the form doesn't render into it unless it is given its id again
 *
 * @param state [Object, validation state]
 */
export const destroyErrorSummary = state => {
    removeErrorSummary(state);
    const container = containers.get(state.form);
    if (!container) return;
    containers.delete(state.form);
    if (owners.get(container) === state.form) owners.delete(container);
};

/**
 * Removes a group's item from the summary. If focus is on its link, it moves to the next link, or the previous one
 *
 * @param summary [Object] the form's summary
 * @param groupName [String]
 */
const removeItem = (summary, groupName) => {
    const { item } = summary.items.get(groupName);
    summary.items.delete(groupName);
    if (item.contains(document.activeElement)) {
        const sibling = item.nextElementSibling || item.previousElementSibling;
        const link = sibling && sibling.querySelector('a');
        //with no link left to move to, focus moves to the summary, and from there to the form if the summary is removed
        if (link) link.focus();
        else setFocus(summary.node);
    }
    item.parentNode.removeChild(item);
};

/**
 * Tracks a server-rendered summary's links to the fields of a group as that group's items, so they are removed
 * when the group is fixed, and following one focuses the field
 *
 * @param state [Object, validation state]
 * @param node [DOM node] the server-rendered summary
 *
 * @returns [Map] the items, keyed by group name
 */
const adoptItems = (state, node) => {
    const items = new Map();
    Array.from(node.querySelectorAll('li a[href^="#"]')).forEach(link => {
        const id = decodeURIComponent(link.getAttribute('href').slice(1));
        Object.keys(state.groups).forEach(groupName => {
            const field = state.groups[groupName].fields.find(groupField => groupField.id === id);
            if (!field || items.has(groupName)) return;
            link.addEventListener('click', followLink(field));
            items.set(groupName, { item: link.closest('li') });
        });
    });
    return items;
};

/**
 * Sets up the summary when the instance is created. With the errorSummaryId option, the element it names is used:
 * if it contains server-rendered errors (any list item) they are taken over, otherwise it is hidden until there are errors.
 * Without it, a server-rendered summary immediately before the form (one with the error summary class) is taken over,
 * so that it is replaced on submit and removed on reset rather than left alongside the client's summary
 *
 * @param state [Object, validation state]
 */
export const adoptErrorSummary = state => {
    if (!isEnabled(state)) {
        if (state.settings && state.settings.errorSummaryId !== undefined) console.warn('The errorSummaryId option is ignored unless the errorSummary option is enabled.');
        return;
    }
    const container = resolveContainer(state);
    if (container) {
        containers.set(state.form, container);
        if (container.querySelector('li')) summaries.set(state.form, { node: container, items: adoptItems(state, container), container: true });
        else container.setAttribute('hidden', '');
        return;
    }
    const node = state.form.previousElementSibling;
    if (!node || !node.classList.contains(ERROR_SUMMARY_CLASSNAMES.SUMMARY)) return;
    summaries.set(state.form, { node, items: adoptItems(state, node) });
};

/**
 * Renders an error summary immediately before the form, replacing any previous one, listing a link to each
 * invalid group with its error message, in document order. role="alert" is on an inner container rather than the
 * focused summary, as an alert that is also focused can have its announcement cut short
 *
 * @param state [Object, validation state]
 */
export const renderErrorSummary = state => {
    if (!isEnabled(state)) return;
    removeErrorSummary(state);
    const container = containers.get(state.form);
    if (!container && !state.form.parentNode) return console.warn('The error summary cannot be rendered as the form has no parent node.');

    const invalidGroups = Object.keys(state.groups)
        .filter(groupName => !state.groups[groupName].valid && state.groups[groupName].errorMessages && state.groups[groupName].errorMessages.length)
        //groups are held in the order they were added (and integer-like names first), not document order
        // oxlint-disable-next-line unicorn/no-array-sort -- sorts the new array from filter(); toSorted() isn't supported by older browsers
        .sort((a, b) => state.groups[a].fields[0].compareDocumentPosition(state.groups[b].fields[0]) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
    if (!invalidGroups.length) return;

    let title = state.settings.errorSummaryTitle;
    if (!isMessage(title)) {
        console.warn(`The errorSummaryTitle option must be a non-empty string, using '${defaults.errorSummaryTitle}'.`);
        title = defaults.errorSummaryTitle;
    }

    const list = h('ul', { class: ERROR_SUMMARY_CLASSNAMES.LIST });
    const items = new Map();

    invalidGroups.forEach(groupName => {
        const group = state.groups[groupName];
        const target = findLinkTarget(group);
        if (!target) console.warn(`No field in validation group ${groupName} has an id for its error summary link to target.`);
        //the message as it was submitted: it isn't updated in real time, as changing the alert's content re-announces it
        const link = h('a', { href: target ? `#${target.id}` : '#' }, updateMessageValues(state, groupName));
        link.addEventListener('click', followLink(target || group.fields[0]));
        const item = h('li');
        item.appendChild(link);
        list.appendChild(item);
        items.set(groupName, { item });
    });

    const alert = h('div', { role: 'alert' });
    alert.appendChild(h('h2', { class: ERROR_SUMMARY_CLASSNAMES.TITLE }, title));
    alert.appendChild(list);
    if (container) {
        //removeErrorSummary has emptied it, unless it was never rendered into (e.g. on the first submit)
        empty(container);
        container.appendChild(alert);
        container.removeAttribute('hidden');
        summaries.set(state.form, { node: container, items, container: true });
        return;
    }
    const node = h('div', { class: ERROR_SUMMARY_CLASSNAMES.SUMMARY });
    node.appendChild(alert);
    state.form.parentNode.insertBefore(node, state.form);
    summaries.set(state.form, { node, items });
};

/**
 * Moves focus to the error summary, or if there isn't one (it's not enabled, or couldn't be rendered) to the first invalid field
 *
 * @param state [Object, validation state]
 */
export const focusErrorSummary = state => {
    const summary = summaries.get(state.form);
    if (summary) setFocus(summary.node);
    else focusFirstInvalidField(state);
};

/**
 * Brings the summary up to date as groups are validated individually (in real time, or via the API): removes the
 * items of groups that are now valid (or removed), and the summary once it has no items left.
 * New errors are not added, nor messages changed, as changing the alert's content re-announces it:
 * they are shown inline, and in the summary on the next submit
 *
 * @param state [Object, validation state]
 */
export const updateErrorSummary = state => {
    const summary = summaries.get(state.form);
    if (!summary) return;

    Array.from(summary.items.keys()).forEach(groupName => {
        if (!state.groups[groupName] || state.groups[groupName].valid) removeItem(summary, groupName);
    });

    //a server-rendered summary may have items that don't belong to a group, so the remaining items are counted in the DOM
    if (!summary.node.querySelector('li')) removeErrorSummary(state);
};
