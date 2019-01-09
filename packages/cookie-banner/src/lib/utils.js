import { TRIGGER_KEYCODES } from './constants';

//Modernizr cookie test
export const cookiesEnabled = () => {
    try {
        document.cookie = 'cookietest=1';
        const ret = document.cookie.indexOf('cookietest=') !== -1;
        document.cookie = 'cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT';
        return ret;
      }
      catch (e) {
        return false;
      }
};

export const writeCookie = state => document.cookie = [
    `${state.settings.name}=${JSON.stringify(Object.assign({}, state.consent, { intent: state.intent }))};`,
    `expires=${(new Date(new Date().getTime() + (state.settings.expiry*24*60*60*1000))).toGMTString()};`,
    `path=${state.settings.path};`,
    state.settings.domain ? `domain=${state.settings.domain}` : '',
    state.settings.secure ? `secure` : ''
].join('');

export const readCookie = settings => {
    const cookie = document.cookie.split('; ').map(part => ({ name: part.split('=')[0], value: part.split('=')[1] })).filter(part => part.name === settings.name)[0];
    return cookie !== undefined ? cookie : false;
};

const updateCookie = state => model => document.cookie = [
    `${model.name}=${model.value};`,
    `expires=${model.expiry};`,
    `path=${state.settings.path};`,
    state.settings.domain ? `domain=${state.settings.domain};` : '',
    state.settings.secure ? `secure` : ''
].join('');

export const deleteCookies = state => {
    document.cookie
        .split('; ')
        .map(part => ({ 
            name: part.split('=')[0],
            value: part.split('=')[1],
            expiry: 'Thu, 01 Jan 1970 00:00:01 GMT'
        }))
        .map(updateCookie(state));
};

export const composeUpdateUIModel = state => {
    return Object.assign({}, state.settings, {
        types: Object.keys(state.settings.types).reduce((acc, type) => {
            if(state.consent[type] !== undefined) {
                acc[type] = Object.assign({}, state.settings.types[type], {
                    checked: state.consent[type] !== undefined ? state.consent[type] : state.settings.types[type].checked
                });
            } else acc[type] = state.settings.types[type];
            return acc;
        }, {})
    })
};

export const shouldReturn = e => (!!e.keyCode && !~TRIGGER_KEYCODES.indexOf(e.keyCode) || (e.which && e.which === 3));