# Cookie banner

GDPR compliant cookie banner and consent form.

Renders a cookie banner and a consent form based on configuration settings, and conditionally invokes cookie-reliant functionality based on user consent.

A WCAG and GDPR compliant example is available for reference at https://storm-ui-patterns.netlify.app/patterns/cookie-banner/.

---

## Usage
Cookie consent management works by categorising cookies and the functions that initialise them, describing them in a configuration object passed into the module at initialisition.

The cookie banner renders itself if no consent preferences are recorded in the browser, or if recorded consent categories do not match.


Install the package
```
npm i -S @stormid/cookie-banner
```

Create a container element for the consent form. The consent form renders into a DOMElement with a className matching the classNames.formContainer option.
```
<div class="privacy-banner__form-container"></div>
```

A page containing a cookie consent form should also include a visually hidden live region (role=alert) with a className matching the classNames.formAnnouncement option.
```
<div class="visually-hidden privacy-banner__form-announcement" role="alert"></div>
```

Initialise the module (example configuration shown below)
```
import banner from '@stormid/cookie-banner';

const cookieBanner = banner({
    types: {
        'performance': {
            title: 'Performance preferences',
            description: 'Performance cookies are used to measure the performance of our website and make improvements. Your personal data is not identified.',
            labels: {
                yes: 'Pages you visit and actions you take will be measured and used to improve the service',
                no: 'Pages you visit and actions you take will not be measured and used to improve the service'
            },
            fns: [
                state => { 
                    //function that depends upon or creates a 'performance' cookie
                },
                state => state.utils.gtmSnippet(<UA-CODE>)
            ]
        },
        'thirdParty': {
            title: 'Third party preferences',
            description: 'We work with third party partners to show you ads for our products and services across the web, and to serve video and audio content.  You can choose whether we collect and share that data with our partners below. ',
            labels: {
                yes: 'Our partners might know you have visited our website',
                no: 'Our partners will will not know you have visited out website but you cannot video third party video and audio content'
            },
            fns: [
                model => { 
                    //function that depends upon or creates a 'performance' cookie
                },
                state => state.utils.renderIframe(),
                state => state.utils.gtmSnippet(<UA-CODE>)
            ]
        }
    },
    bannerTemplate(model){
        return `<section role="dialog" aria-live="polite" aria-label="Your privacy" class="${model.classNames.banner}">
            <div class="privacy-content">
                <div class="wrap">
                    <!--googleoff: all-->
                    <div class="privacy-banner__title">Cookies</div>
                    <p>We use cookies to improve your experience on our site and show you personalised advertising.</p>
                    <p>Find out more from our <a class="privacy-banner__link" rel="noopener noreferrer nofollow" href="/privacy-policy">privacy policy</a> and <a class="privacy-banner__link" rel="noopener noreferrer nofollow" href="${model.policyURL}">cookie policy</a>.</p>
                    <button type="button" class="btn btn--primary ${model.classNames.acceptBtn}">Accept all</button>
                    <button type="button" class="btn btn--primary ${model.classNames.rejectBtn}">Reject all</button>
                    <a class="privacy-banner__link ${model.classNames.optionsBtn}" rel="noopener noreferrer nofollow" href="${model.policyURL}">Your options</a>
                    <!--googleon: all-->
                </div>
            </div>
        </section>`;
    },
    messageTemplate(model){
        return `<div class="${model.settings.classNames.formMessage}" aria-hidden="true">${model.settings.savedMessage}</div>`
    },
    formTemplate(model){
         return `<form id="preferences" class="${model.settings.classNames.form}" novalidate>
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
                                ${model.consent[type] === 1 ? `checked` : ''}>
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
                                ${model.consent[type] === 0 ? `checked` : ''}>
                            <span class="privacy-banner__label-text">No thank you</span>
                            <span class="privacy-banner__label-description">${model.settings.types[type].labels.no}</span>
                        </label>    
                    </div>
                </div>
            </fieldset>`).join('')}
            <button class="${model.settings.classNames.submitBtn}"${Object.keys(model.consent).length !== Object.keys(model.settings.types).length ? ` disabled` : ''}>Save my settings</button>
        </form>`;
    }
});
```

## Google EU consent mode
Optionally the banner also supports Google EU consent mode v2 https://developers.google.com/tag-platform/security/guides/consent, and can push user consent preferences to the dataLayer for Google libraries to use. All that is necessary to support Google consent mode is to map Google consent categories to the cookie categories in the configuration.

For example, to map the ad_storage, ad_user_data, and ad_personalisation to an 'ads' consent category defined in the banner config, add a `euConsentTypes` object to the configuration like this:
```
euConsentTypes: {
    ad_storage: 'Marketing',
    ad_user_data: 'Marketing',
    ad_personalization: 'Marketing',
    analytics_storage: 'Performance'
}
```

## Options
Full options that can be passed during initialisation:
```
{
    name: '.CookiePreferences', //name of the cookie set to record user consent
    path: '/', //path of the preferences cookie
    domain: window.location.hostname === 'localhost' ? '' : `.${removeSubdomain(window.location.hostname)}`, //domain of the preferences cookie, defaults to .<root-domain>
    secure: true, //preferences cookie secure
    samesite: 'lax', //preferences cookie samesite
    expiry: 365, //preferences cookie expiry in days
    types: {}, //types of cookie-dependent functionality
    euConsentTypes: {}, //map Google EU consent categories to types of cookie defined in 'types'
    necessary: [], //cookie-dependent functionality that will always execute, for convenience only
    policyURL: '/cookie-policy#preferences', //URL to cookie policy page (location of cookie consent form) rendered in the banner
    classNames: {
        banner: 'privacy-banner',
        acceptBtn: 'privacy-banner__accept',
        rejectBtn: 'privacy-banner__reject',
        submitBtn: 'privacy-banner__submit',
        field: 'privacy-banner__field',
        form: 'privacy-banner__form',
        fieldset: 'privacy-banner__fieldset',
        legend: 'privacy-banner__legend',
        formContainer: 'privacy-banner__form-container', //where the form is rendered
        formMessage: 'privacy-banner__form-msg',
        formAnnouncement: 'privacy-banner__form-announcement', //screen reader announcement
        title: 'privacy-banner__form-title',
        description: 'privacy-banner__form-description'
    },
    hideBannerOnFormPage: false, //don't show the banner when the user is on the same page as a consent form
    savedMessage: 'Your settings have been saved.', //displayed after consent form update,
    trapTab: false, //trap the user's keyboard tab within the banner when open
    bannerTemplate: null, //**This option is mandatory** - the banner will not initialise if this is not provided.  See below.
    formTemplate: null, //**This option is mandatory** - the banner will not initialise if this is not provided.  See below.
    messageTemplate(model){ 
       return `<div class="${model.settings.classNames.formMessage}" aria-hidden="true">${model.settings.savedMessage}</div>`
    } //A function which returns an HTML string to create the confirmation message.  Default HTML is provided as above.
}
```
## HTML templates

When using the cookie banner, you **must** provide suitable HTML templates for both the banner and the preferences form.  These should set via the config as the bannerTemplate and formTemplate options respectively.

The templates should take the form of a function which returns a valid HTML string.  The functions will be passed a 'model' which will expose the state of the cookie banner to help with rendering.  See the example config above as a startring point.

If these functions are not provided, the cookie banner will fail to initialise.

## Utility functions
There are two utility functions provided by the library that can be invoked following user consent.

### Render iframe
`state.utils.renderIframe`

Renders an iframe from a placeholder element with specific data attributes:

```
<div data-iframe-src="https://www.youtube.com/embed/qpLKTUQev30" data-iframe-title="Test video" data-iframe-height="1600px" data-iframe-width="900px">
    <p>Update your cookie preferences to view this content</p>
    <button class="js-preferences-update">Update</button>
</div>
```
In the cookie banner configuration:
```
import cookieBanner from '@stormid/cookie-banner';

cookieBanner({
    ...lots of other config
    type: {
        thirdParty: [
            state => state.utils.renderIframe()
        ]
    }
})
```

### Google Tag Manager Snippet
`state.utils.gtmSnippet`

Invokes a GTM snippet to load the GTM library via an script element, just pass the Tag Manager ID/UA number as an argument

In the cookie banner configuration:
```
import cookieBanner from '@stormid/cookie-banner';

cookieBanner({
    ...lots of other config
    type: {
        thirdParty: [
            state => state.utils.gtmSnippet(`UA-1234-5678`)
        ]
    }
})
```


## API
The Object returned from initialisation exposes the interface
```
{
    getState, Function that returns the current state Object
    showBanner, Function to show the banner, accepts a callback function
    renderForm, Function to render the consent form
}
```

## Events

There are three custom events that an instance of the cookie banner dispatches:
- `banner.show` when the banner is displayed
- `banner.hide` when it is hidden
- `banner.consent` when consent is set or updated

The events are dispatched on the document. A reference to the getState function of the instance is contained in the custom event detail.

```
const instance = banner(options);

document.addEventListener('banner.show', e => {
    //e.g. initialise toggle for form-in-banner implementation
    const [ bannerToggle ] = toggle('.js-banner-toggle'); 
    const state = e.detail.getState();
    // do something with state if we want to
});

```

## Tests
```
npm t
```

## License
MIT
