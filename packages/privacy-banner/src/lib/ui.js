import { shouldReturn, writeCookie, deleteCookies } from './utils';
import { TRIGGER_EVENTS } from './constants';
import { apply } from './consent';
import { fullConsent, setConsent, updateConsent } from './reducers';

export const initBanner = Store => state => {
    document.body.firstElementChild.insertAdjacentHTML('beforebegin', state.settings.bannerTemplate(state.settings));
    const banner = document.querySelector(`.${state.settings.classNames.banner}`);
    const acceptBtn = document.querySelector(`.${state.settings.classNames.acceptBtn}`);

    TRIGGER_EVENTS.forEach(ev => {
        acceptBtn.addEventListener(ev, e => {
            if(shouldReturn(e)) return;

            Store.update(
                fullConsent,
                Object.keys(state.settings.types).reduce((acc, type) => {
                    acc[type] = 1;
                    return acc;
                }, {}),
                [
                    writeCookie,
                    apply(Store),
                    removeBanner(banner),
                    // initUpdateBtn(Store),
                    initForm(Store)
                ]
            );
        });
    });
};

const removeBanner = banner => () => banner && banner.parentNode.removeChild(banner);

export const initForm = Store => state => {
    const formContainer = document.querySelector(`.${state.settings.classNames.formContainer}`);
    if(!formContainer) return;

    formContainer.innerHTML = state.settings.formTemplate(state);
    const form = document.querySelector(`.${state.settings.classNames.form}`);
    const banner = document.querySelector(`.${state.settings.classNames.banner}`);
    const button = document.querySelector(`.${state.settings.classNames.submitBtn}`);
    const groups = [].slice.call(document.querySelectorAll(`.${state.settings.classNames.field}`)).reduce((groups, field) => {
        const groupName = field.getAttribute('name').replace('privacy-', '');
        if(groups[groupName]) groups[groupName].push(field);
        else groups[groupName] = [field];
        return groups;
    }, {});
    const enableButton = e => {
        button.removeAttribute('disabled');
        form.removeEventListener('change', enableButton);
    };
    form.addEventListener('change', enableButton);
    
    form.addEventListener('submit', e => {
        e.preventDefault();
        Store.update(
            updateConsent,
            Object.keys(groups).reduce((acc, key) => {
                const value = form[`privacy-${key}`].value;
                if(value) acc[key] = parseInt(value);
                return acc;
            }, {}),
            [
                deleteCookies,
                writeCookie,
                apply(Store),
                removeBanner(banner),
            ]
        );
    });
};

// export const initUpdateBtn = Store => state => {
//     if(!state.settings.bannerTrigger) return;
//     const updateBtnContainer = document.querySelector(`.${state.settings.classNames.updateBtnContainer}`);
//     if(!updateBtnContainer) return;
//     const updateBtn = document.querySelector(`.${state.settings.classNames.updateBtn}`);
//     if(updateBtn) updateBtn.removeAttribute('disabled');
//     else updateBtnContainer.innerHTML = state.settings.updateBtnTemplate(state.settings);
//     const handler = e => {
//         if(shouldReturn(e)) return;
//         Store.update(updateConsent, {}, [ initBanner(Store), () => { 
//             e.target.setAttribute('disabled', 'disabled');
//             TRIGGER_EVENTS.forEach(ev => {
//                 e.target.removeEventListener(ev, handler);
//             });
//         }]);
//     };

//     TRIGGER_EVENTS.forEach(ev => {
//         document.querySelector(`.${state.settings.classNames.updateBtn}`).addEventListener(ev, handler);
//     });
// };