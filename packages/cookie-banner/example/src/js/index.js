import cookieBanner from '../../../src/index';
import toggle from '../../../../toggle/src/index';
import SampleTemplates from './sample-templates';

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
    
const config = {...SampleTemplates, 
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