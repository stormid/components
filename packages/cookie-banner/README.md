# Cookie banner

GDPR compliant cookie banner and consent form. Renders a cookie banner and a consent form based on configuration settings, and conditionally invokes cookie-reliant functionality based on user consent. 

---

## Usage
Cookie consent is based on categorising cookies and the functions that initialise them, dsribing them in a configuration object passed into the module at initialisition.

The cookie banner renders itself if no consent preferences are recorded in the browser. The consent form renders into a DOMElement with a particular className configurable options (classNames.formContainer).


Install the package
```
npm i -S @stormid/cookie-banner
```

Create a container element for the consent form
```
<div class="privacy-banner__form-container"></div>
```

Initialise the module (example configuration shown below)
```
import CookieBanner from '@stormid/cookie-banner';

CookieBanner.init({
    types: {
        'performance': {
            suggested: true, //set as pre-checked on consent form as a suggested response
            title: 'Performance preferences',
            description: 'Performance cookies are used to measure the performance of our website and make improvements. Your personal data is not identified.',
            labels: {
                yes: 'Pages you visit and actions you take will be measured and used to improve the service',
                no: 'Pages you visit and actions you take will not be measured and used to improve the service'
            },
            fns: [
                model => { 
                    //function that depends upon or creates a 'performance' cookie
                }
            ]
        },
        'ads': {
            title: 'Personalised ads preferences',
            description: 'We work with advertising partners to show you ads for our products and services across the web.  You can choose whether we collect and share that data with our partners below. ',
            labels: {
                yes: 'Our partners might serve you ads knowing you have visited our website',
                no: 'Our partners will still serve you ads, but they will not know you have visited out website'
            },
            fns: [
                model => { 
                    //function that depends upon or creates a 'performance' cookie
                }
            ]
        }
    }
});
```

## Options
```
{
    name: '.CookiePreferences', //name of the cookie set to record user consent
    path: '/', //path of the preferences cookie
    domain: window.location.hostname === 'localhost' ? '' : `.${removeSubdomain(window.location.hostname)}`, //domain of the preferences cookie, defaults to .<root-domain>
    secure: true, //preferences cookie secure
    samesite: 'lax', //preferences cookie samesite
    expiry: 365, //preferences cookie expiry in days
    types: {}, //types of cookie-dependent functionality 
    necessary: [], //cookie-dependent functionality that will always execute, for convenience only
    policyURL: '/cookie-policy', //URL to cookie policy page (location of cookie consent form) rendered in the banner
    classNames: {
        banner: 'privacy-banner',
        acceptBtn: 'privacy-banner__accept',
        submitBtn: 'privacy-banner__submit',
        field: 'privacy-banner__field',
        form: 'privacy-banner__form',
        fieldset: 'privacy-banner__fieldset',
        legend: 'privacy-banner__legend',
        formContainer: 'privacy-banner__form-container', //where the form is rendered
        formMessage: 'privacy-banner__form-msg',
        title: 'privacy-banner__form-title',
        description: 'privacy-banner__form-description'
    },
    savedMessage: 'Your settings have been saved.', //displayed after consent form update 
    bannerTemplate(model){
        return `<section role="dialog" aria-live="polite" aria-label="You privacy" class="${model.classNames.banner}">
            <div class="privacy-content">
                <div class="wrap">
                    <!--googleoff: all-->
                    <div class="privacy-banner__title">Cookies</div>
                    <p>We use cookies to improve your experience on our site and show you personalised advertising.</p>
                    <p>Find out more from our <a class="privacy-banner__link" rel="noopener noreferrer nofollow" href="/privacy-policy">privacy policy</a> and <a class="privacy-banner__link" rel="noopener noreferrer nofollow" href="${model.policyURL}">cookie policy</a>.</p>
                    <button class="btn btn--primary ${model.classNames.acceptBtn}">Accept and close</button>
                    <a class="privacy-banner__link" rel="noopener noreferrer nofollow" href="${model.policyURL}">Your options</a>
                    <!--googleon: all-->
                </div>
            </div>
        </section>`;
    },
    messageTemplate(model){
        return `<div class="${model.settings.classNames.formMessage}" aria-role="alert">${model.settings.savedMessage}</div>`
    },
    formTemplate(model){
        return `<form class="${model.settings.classNames.form}" novalidate>
                ${Object.keys(model.settings.types).map(type => `<fieldset class="${model.settings.classNames.fieldset}">
                <legend class="${model.settings.classNames.legend}">
                    <span class="${model.settings.classNames.title}">${model.settings.types[type].title}</span>
                    <span class="${model.settings.classNames.description}">${model.settings.types[type].description}</span>
                </legend>
                <div class="form-row">
                    <div class="relative">
                        <label class="privacy-banner__label">
                            <input
                                class="${model.settings.classNames.field}"
                                type="radio"
                                name="privacy-${type.split(' ')[0].replace(' ', '-')}"
                                value="1"
                                ${model.consent[type] === 1 ? ` checked` : ''}>
                            <span class="privacy-banner__label-text">I am OK with this</span>
                            <span class="privacy-banner__label-description">${model.settings.types[type].labels.yes}</span>
                        </label>    
                    </div>
                </div>
                <div class="form-row">
                    <div class="relative">
                        <label class="privacy-banner__label">
                            <input
                                class="${model.settings.classNames.field}"
                                type="radio"
                                name="privacy-${type.split(' ')[0].replace(' ', '-')}"
                                value="0"
                                ${model.consent[type] === 0 ? ` checked` : ''}>
                            <span class="privacy-banner__label-text">No thank you</span>
                            <span class="privacy-banner__label-description">${model.settings.types[type].labels.no}</span>
                        </label>    
                    </div>
                </div>
            </fieldset>`).join('')}
            <button class="${model.settings.classNames.submitBtn}"${Object.keys(model.consent).length === 0 ? ` disabled` : ''}>Save my settings</button>
        </form>`;
    }
}
```

## API
The Object returned from init exposes the interface
```
{
    getState, a Function that returns the current state Object
}
```

## Tests
```
npm t
```

## License
MIT
