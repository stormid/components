import { emptyList, renderList, renderStatus, clearStatus, showList, hideList, setValue } from './dom';
import { areEqual, isPrintableKeyCode } from './utils';
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
        handleSpace(store, event);
        break;
    case 'enter':
        handleEnter(store, event);
        break;
    case 'escape':
        handleEscape(store);
        break;
    case 'tab':
        handleBlur(store, event);
        break;
    default:
        if (isPrintableKeyCode(event.keyCode)) handlePrintableKey(store, event);
        break;
    }
};

const handlePrintableKey = (store, event) => {
    const { dom } = store.getState();
    if (event.target !== dom.input) dom.input.focus();
};

const handleBlur = (store, event) => {
    const { dom, open, settings, options  } = store.getState();
    if (!open && event.target.parentElement !== dom.list) return;
    if (settings.confirmOnBlur) store.update({ ...store.getState(), selected: options[Number(event.target.getAttribute('aria-posinset'))-1], open: false  }, [ setValue, hideList, emptyList, renderStatus ]);
};

const handleEnter = (store, event) => {
    const { open, dom, options } = store.getState();
    if (!open && event.target.parentElement !== dom.list) return;
    event.preventDefault();
    store.update({ ...store.getState(), selected: options[Number(event.target.getAttribute('aria-posinset'))-1], open: false  }, [ setValue, hideList, emptyList, renderStatus ]);
};

const handleSpace = (store, event) => {
    const { open, dom, settings, options } = store.getState();
    //if event is fired from the input, and the list is closed, and it's there is no query, open it
    //if settings.list is empty then the options are being loaded dynamically, so do nothing
    if (event.target === dom.input && !open && !!settings.list && dom.input.value === '') {
        event.preventDefault();
        store.update({ ...store.getState(), options: settings.list, open: true }, [ renderList, clearStatus ]);
        return;
    }
    //if event is fired from an option, select it
    if (event.target.parentElement === dom.list) {
        event.preventDefault();
        store.update({ ...store.getState(), selected: options[Number(event.target.getAttribute('aria-posinset'))-1], open: false }, [ setValue, hideList, emptyList, renderStatus ]);
    }
};


const handleEscape = store => {
    const { open, dom } = store.getState();
    if (!open) return;
    document.activeElement.setAttribute('aria-selected', 'false');
    dom.input.focus();
    store.update({ ...store.getState(), open: false }, [ hideList, clearStatus ]);
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
    const { dom, open, settings  } = store.getState();
    if (dom.list.contains(document.activeElement) || dom.list.contains(event.relatedTarget)) return;
    if (open) {
        if (settings.clearOnBlur) dom.input.value = '';
        store.update({ ...store.getState(), open: false, ...(settings.clearOnBlur ? { options: [] } : {}) }, [ renderList, clearStatus ]);
    }
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
    if (results.length === 0 && areEqual(options, results)) return;
    if (results.length && areEqual(options, results)) {
        if (!open) store.update({ ...store.getState(), open: true }, [ showList ]);
        return;
    }
    store.update({ ...store.getState(), options: results, open: results.length > 0 }, [ renderList, renderStatus ]);
};

export const optionClick = store => event => {
    const { options } = store.getState();
    store.update({ ...store.getState(), selected: options[Number(event.target.getAttribute('aria-posinset'))-1], open: false }, [ setValue, hideList, emptyList, renderStatus ]);
};

export const optionBlur = store => event => {
    const { dom  } = store.getState();
    //if focus has moved outside of the list
        //close menu 
        //select current option
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