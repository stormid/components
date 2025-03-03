import cookieBanner from '../../../src/index';
import toggle from '../../../../toggle/src/index';

const writeCookie = state => {
    document.cookie = [
        `${state.settings.name}=${btoa(JSON.stringify(state))};`,
        `expires=${(new Date(new Date().getTime() + (state.settings.expiry*24*60*60*1000))).toGMTString()};`,
        state.settings.path ? `path=${state.settings.path};` : '',
        state.settings.domain ? `domain=${state.settings.domain};` : '',
        state.settings.samesite ? `SameSite=${state.settings.samesite};` : '',
        state.settings.secure ? `secure` : ''
    ].join('');
};
    
const config = {
    name: '.Components.Dev.Consent',
    secure: false,
    euConsentTypes: {
        ad_storage: 'ads',
        ad_user_data: 'ads',
        ad_personalization: 'ads',
        analytics_storage: 'performance'
    },
    hideBannerOnFormPage: false,
    trapTab: true,
    necessary: [
        () => {
            writeCookie({
                settings: {
                    name: '.Test.NecessaryCookie',
                    expiry: 3
                },
                consent: '666',
            });
        }
    ],
    types: {
        performance: {
            // suggested: 1,
            title: 'Performance preferences',
            description: 'Performance cookies are used to measure the performance of our website and make improvements. Your personal data is not identified.',
            labels: {
                yes: 'Pages you visit and actions you take will be measured and used to improve the service',
                no: 'Pages you visit and actions you take will not be measured and used to improve the service'
            },
            fns: [
                () => {
                    // console.log('Performance fn');
                    writeCookie({
                        settings: {
                            name: '.Test.PerformanceCookie',
                            expiry: 3
                        },
                        consent: '666',
                    });
                },
                state => state.utils.renderIframe(),
                state => state.utils.gtmSnippet('12345666')
            ]
        },
        ads: {
            title: 'Personalised ads preferences',
            description: 'We work with advertising partners to show you ads for our products and services across the web.  You can choose whether we collect and share that data with our partners below. ',
            labels: {
                yes: 'Our partners might serve you ads knowing you have visited our website',
                no: 'Our partners will still serve you ads, but they will not know you have visited out website'
            },
            fns: [
                () => {
                    // console.log('Ads fn');
                    writeCookie({
                        settings: {
                            name: '.Test.AdsCookie',
                            expiry: 3
                        },
                        consent: '666',
                    });
                }
            ]
        }
    },
    bannerTemplate(model){
        return `<div role="region" aria-live="polite" aria-label="Cookies" class="${model.classNames.banner}">
            <div class="privacy-content">
                <div class="wrap">
                    <div class="col xs-12 privacy-banner__inner">
                        <!--googleoff: all-->
                        <div class="privacy-banner__content">
                            <div class="privacy-banner__title">Cookies</div>
                            <p class="privacy-banner__summary">This web service uses cookies to ensure it functions correctly, and to help gather analytics data which is used to help us improve the service.</p>
                            <p class="privacy-banner__summary">Find out more from our <a class="privacy-banner__link" rel="noopener noreferrer nofollow" href="/privacy">privacy policy</a> and <a class="privacy-banner__link" rel="noopener noreferrer nofollow" href="${model.policyURL}">cookie policy</a>.</p>
                        </div>
                        <div class="privacy-banner__actions">
                            <button type="button" class="privacy-banner__btn ${model.classNames.acceptBtn}">Accept all</button>
                            <button type="button" class="privacy-banner__btn ${model.classNames.rejectBtn}">Reject all</button>
                            <button type="button" class="privacy-banner__link js-toggle__preferences ${model.classNames.optionsBtn}">Your options</button>
                        </div>
                        <div id="preferences" class="privacy-banner__panel js-toggle-banner" data-toggle="js-toggle__preferences">
                            <p><button type="button" class="privacy-banner__btn-text ${model.classNames.acceptBtn}">Accept and close </button> or edit your choices below and click 'Save my choices'.</p>
                            <div class="privacy-banner__form-container"></div>
                        </div>
                        <!--googleon: all-->
                    </div>
                </div>
            </div>
        </div>`;
    },
    formTemplate(model){
        return `<form id="preferences-form" class="row ${model.settings.classNames.form}" novalidate>
                ${Object.keys(model.settings.types).map(type => `<div class="privacy-banner__row"><fieldset class="${model.settings.classNames.fieldset}">
                <legend class="${model.settings.classNames.legend}">
                    <span class="${model.settings.classNames.title}">${model.settings.types[type].title}</span>
                    <span class="${model.settings.classNames.description}">${model.settings.types[type].description}</span>
                </legend>
                <div class="privacy-banner__row">
                    <div class="relative">
                        <label class="privacy-banner__label">
                            <input
                                class="${model.settings.classNames.field}"
                                type="radio"
                                name="privacy-${type.split(' ')[0].replace(' ', '-')}"
                                value="1"
                                ${model.consent[type] === 1 ? ` checked` : ''}>
                            <span class="privacy-banner__label-text">Ok</span>
                            <span class="privacy-banner__label-description">${model.settings.types[type].labels.yes}</span>
                        </label>    
                    </div>
                </div>
                <div class="privacy-banner__row">
                    <div class="relative">
                        <label class="privacy-banner__label">
                            <input
                                class="${model.settings.classNames.field}"
                                type="radio"
                                name="privacy-${type.split(' ')[0].replace(' ', '-')}"
                                value="0"
                                ${model.consent[type] === 0 ? ` checked` : ''}>
                            <span class="privacy-banner__label-text">No</span>
                            <span class="privacy-banner__label-description">${model.settings.types[type].labels.no}</span>
                        </label>
                    </div>
                </div>
            </fieldset></div>`).join('')}
            <div class="privacy-banner__row">
                <button class="${model.settings.classNames.submitBtn}"${Object.keys(model.consent).length !== Object.keys(model.settings.types).length ? ` disabled` : ''}>Save my choices</button>
            </div>
        </form>`;
    }
};

window.addEventListener('DOMContentLoaded', () => {
    let bannerToggle;
    document.addEventListener('banner.show', () => [ bannerToggle ] = toggle('.js-toggle-banner'));
    document.addEventListener('banner.hide', () => bannerToggle.getState().isOpen && bannerToggle.startToggle());

    const banner = cookieBanner(config);

    [].slice.call(document.querySelectorAll('.js-preferences-update')).forEach(btn => btn.addEventListener('click', e => {
        if (banner.getState().bannerOpen) return;
        banner.showBanner();
        bannerToggle.startToggle();
    }));
});