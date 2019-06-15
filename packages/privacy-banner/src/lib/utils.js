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

export const writeCookie = state => {
    document.cookie = [
        `${state.settings.name}=${JSON.stringify(state.consent)};`,
        `expires=${(new Date(new Date().getTime() + (state.settings.expiry*24*60*60*1000))).toGMTString()};`,
        state.settings.path ? `path=${state.settings.path}` : '',
        state.settings.domain ? `domain=${state.settings.domain}` : '',
        state.settings.secure ? `secure` : ''
    ].join('');
}

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

export const shouldReturn = e => (!!e.keyCode && !~TRIGGER_KEYCODES.indexOf(e.keyCode) || (e.which && e.which === 3));

export const composeTypes = opts => (acc, curr) => {
    if(acc[curr]) {
        acc[curr] = Object.assign({}, acc[curr], {
            fns: acc[curr].fns.concat(opts.types[curr].fns),
        });
    }  else acc[curr] = opts.types[curr];
    return acc;
};

export const noop = () => {};

export const isCheckable = field => (/radio|checkbox/i).test(field.type);

const hasValue = input => (input.value !== undefined && input.value !== null && input.value.length > 0);

export const groupValueReducer = (acc, input) => {
    if(!isCheckable(input) && hasValue(input)) acc = input.value;
    if(isCheckable(input) && input.checked) {
        if(Array.isArray(acc)) acc.push(input.value)
        else acc = [input.value];
    }
    return acc;
};