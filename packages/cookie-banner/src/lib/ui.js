import { composeUpdateUIModel, shouldReturn, writeCookie, deleteCookies } from './utils';
import { TRIGGER_EVENTS } from './constants';
import { apply } from './consent';
import { setConsent, updateConsent } from './reducers';

export const initBanner = Store => state => {
    document.body.firstElementChild.insertAdjacentHTML('beforebegin', state.settings.bannerTemplate(composeUpdateUIModel(state)));
    const fields = [].slice.call(document.querySelectorAll(`.${state.settings.classNames.field}`));
    const banner = document.querySelector(`.${state.settings.classNames.banner}`);
    const btn = document.querySelector(`.${state.settings.classNames.btn}`);

    TRIGGER_EVENTS.forEach(ev => {
        btn.addEventListener(ev, e => {
            if(shouldReturn(e)) return;

            const consent = fields.reduce((acc, field) => { return acc[field.value] = field.checked, acc }, {});
            Store.update(
                setConsent,
                { consent },
                !consent.performance 
                ? [
                    deleteCookies,
                    writeCookie,
                    () => {
                        window.setTimeout(() => location.reload(), 60);
                    }
                ]
                : [
                    writeCookie,
                    apply(state.consent.performance ? 'remain' : 'remove'),
                    () => { 
                        banner.parentNode.removeChild(banner);
                        initUpdateBtn(Store)(state)
                    }
                ]
            );
        });
    });
};

export const initUpdateBtn = Store => state => {
    const updateBtnContainer = document.querySelector(`.${state.settings.classNames.updateBtnContainer}`);
    if(!updateBtnContainer) return;
    const updateBtn = document.querySelector(`.${state.settings.classNames.updateBtn}`);
    if(updateBtn) updateBtn.removeAttribute('disabled');
    else updateBtnContainer.innerHTML = state.settings.updateBtnTemplate(state.settings);
    const handler = e => {
        if(shouldReturn(e)) return;
        Store.update(updateConsent, {}, [ initBanner(Store), () => { 
            e.target.setAttribute('disabled', 'disabled');
            TRIGGER_EVENTS.forEach(ev => {
                e.target.removeEventListener(ev, handler);
            });
        }]);
    };

    TRIGGER_EVENTS.forEach(ev => {
        document.querySelector(`.${state.settings.classNames.updateBtn}`).addEventListener(ev, handler);
    });
};