import { TRIGGER_EVENTS, TRIGGER_KEYCODES } from './constants';

const save = state => {
    window[state.settings.type].setItem(state.settings.name, state.settings.value);
};

const check = settings => {
    return window[settings.type].getItem(settings.name) === settings.value;
};

const dismiss = state => () => {
    save(state);
    state.settings.dismiss(state.banner);
};

const initListener = state => {
    TRIGGER_EVENTS.forEach(ev => {
        state.btn.addEventListener(ev, e => {
            (!e.keyCode || !!~TRIGGER_KEYCODES.indexOf(e.keyCode)) && dismiss(state)();
        });
    });
};

export default (sel, settings) => {
    const banner = document.querySelector(sel);
    if(window[settings.type] == undefined) return console.warn(`Browser does not suport ${settings.type}`);

    if(!check(settings)) {
        banner && banner.removeAttribute('hidden');
        !banner && document.body.firstElementChild.insertAdjacentHTML('beforebegin', settings.template(sel));
    } else {
        if(!!banner) banner.parentNode.removeChild(banner);
        return;
    }

    let state = {
        settings,
        banner: banner || document.querySelector(sel),
        btn: (banner || document.querySelector(sel)).querySelector(settings.closeBtnSelector)
    };
    state.btn && initListener(state);
    
    return { dismiss: dismiss(state) };
};