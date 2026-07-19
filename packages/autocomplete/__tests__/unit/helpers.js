import autocomplete from '../../src/index.js';

/**
 * A labelled, empty host node for the enhancer to take over. The id ties the
 * <label> to the input the component generates.
 */
export const host = (id = 'fruit', label = 'Fruit') => `<label for="${id}">${label}</label><div class="js-autocomplete" id="${id}"></div>`;

/**
 * Render markup into the document and enhance it, returning the first instance.
 * Suites layer their own defaults on top via the options argument.
 */
export const mount = (markup, options) => {
    document.body.innerHTML = markup;
    const [instance] = autocomplete('.js-autocomplete', options);
    return instance;
};

/** Set an input's value and fire the input event the component listens for. */
export const type = (input, value) => {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
};

/** Click the nth rendered option in a listbox. */
export const clickOption = (node, index) => node.querySelectorAll('[role="option"]')[index].dispatchEvent(new Event('click', { bubbles: true }));

/** The debounce delay is 200ms, so the default waits past it plus a tick for the resolved promise. */
export const wait = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

/** Capture events of a type dispatched anywhere under (and bubbling to) document. */
export const listen = eventType => {
    const events = [];
    document.addEventListener(eventType, e => events.push(e));
    return events;
};
