import { emptyList, renderList, renderStatus, clearStatus, showList, hideList, setValue } from './dom';
import { areEqual } from './utils';
import { KEYCODES } from './constants';

export const keydown = store => event => {
    switch (KEYCODES[event.keyCode]) {
    case 'up':
        handleUpArrow(store, event);
        break;
    case 'down':
        handleDownArrow(store, event);
        break;
    case 'space':
        // this.handleSpace(event);
        break;
    case 'enter':
        // this.handleEnter(event);
        break;
    case 'escape':
        handleEscape(store);
        break;
    case 'tab':
        // this.handleComponentBlur({
        //     query: this.state.query
        // });
        break;
    default:
        // if (isPrintableKeyCode(event.keyCode)) {
        //     this.handlePrintableKey(event);
        // }
        break;
    }
};

const handleEscape = store => {
    const { open, dom, settings } = store.getState();
    if (!open) return;
    document.activeElement.setAttribute('aria-selected', 'false');
    dom.input.focus();
    store.update({ ...store.getState(), open: false, ...(settings.clearOnBlur ? { options: [], selected: null } : {}) }, [ hideList, clearStatus ]);
};

const handleUpArrow = (store, event) => {
    event.preventDefault();
    const { dom, open } = store.getState();
    if (document.activeElement === dom.input || !open) return;
    document.activeElement.setAttribute('aria-selected', 'false');
    if (document.activeElement.previousElementSibling) {
        document.activeElement.previousElementSibling.focus();
        document.activeElement.setAttribute('aria-selected', 'true');
    } else dom.input.focus();
};

const handleDownArrow = (store, event) => {
    event.preventDefault();
    const { dom, open } = store.getState();
    if (!open || !document.activeElement.nextElementSibling) return;
    if (document.activeElement === dom.input && open) {
        dom.list.firstElementChild.focus();
    } else {
        document.activeElement.setAttribute('aria-selected', 'false');
        document.activeElement.nextElementSibling.focus();
    }
    document.activeElement.setAttribute('aria-selected', 'true');
};

export const inputFocus = store => event => {
    const { open, selected, settings } = store.getState();
    if (!event.target.value || (selected && settings.template(selected) === event.target.value)) return;
    if (!open) store.update({ ...store.getState(), open: true }, [ showList ]);
};

export const inputBlur = store => event => {
    const { dom, open  } = store.getState();
    if (dom.list.contains(document.activeElement) || dom.list.contains(event.relatedTarget)) return;
    if (open) store.update({ ...store.getState(), open: false }, [ hideList ]);
};

export const inputChange = store => event => {
    const { settings, open, options, selected } = store.getState();
    const value = event.target.value;
    if (selected && settings.template(selected) !== value) store.update({ ...store.getState(), selected: null }, [ clearStatus ]);
    if (value.length < settings.minlength) {
        if (open) store.update({ ...store.getState(), open: false }, [ hideList ]);
        if (options.length) store.update({ ...store.getState(), options: [] }, [ emptyList, renderStatus ]);
        return;
    }
    const results = settings.search(value);
    if (results.length && areEqual(options, results)) {
        if (!open) store.update({ ...store.getState(), open: true }, [ showList ]);
        return;
    }
    store.update({ ...store.getState(), options: results, open: true }, [ renderList, renderStatus ]);
};

export const optionClick = store => event => {
    const { options } = store.getState();
    store.update({ ...store.getState(), selected: options[Number(event.target.getAttribute('aria-posinset'))-1] }, [ setValue, hideList, emptyList, renderStatus ]);
};

export const optionBlur = store => event => {
    const { dom  } = store.getState();
    //remove highlight from option
};

export const optionMouseDown = event => {
    // Safari triggers focusOut before click, but if you
    // preventDefault on mouseDown, you can stop that from happening.
    // If this is removed, clicking on an option in Safari will trigger
    // `handleOptionBlur`, which closes the menu, and the click will
    // trigger on the element underneath instead.
    // See: http://stackoverflow.com/questions/7621711/how-to-prevent-blur-running-when-clicking-a-link-in-jquery
    event.preventDefault();
};