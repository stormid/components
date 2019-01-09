# Storm Cookie banner

Cookie banner that can categorise cookies and conditionally invoke cookie-reliant functionality based on user-consent.

[![npm version](https://badge.fury.io/js/@storm/cookie-banner.svg)](https://badge.fury.io/js/@storm/cookie-banner)


## Usage
Cookie management works by categorising cookies and the functions that initialise them, encapsulating them in a configuration object.

Cookies category names can be any valid String.

JS
```
npm i -S @storm/cookie-banner
```
Using es6 import
```
import CookieBanner from '@storm/cookie-banner';

CookieBanner.init({
    types: {
        'necessary': {
            fns: [
                model => { 
                    //function that depends upon or creates a 'necessary' cookie
                 }
            ]
        },
        'advertising and marketing': {
            checked: false,
            fns: [
                model => { 
                    //function that depends upon or creates an 'Advertising and marketing' cookie
                }
            ]
        }
    }
});

## Options
```
{
	name: 'CookiePreferences',
	path: '/',
	domain: '',
	secure: true,
	expiry: 365,
	types: {
		'necessary': {
			checked: true,
			disabled: true,
			fns: []
		}
	},
	policyURL: '/cookie-policy',
	classNames: {
		banner: 'preferences-banner',
		btn: 'preferences-banner__btn',
		field: 'preferences-banner__field',
		updateBtnContainer: 'preferences-banner__update',
		updateBtn: 'preferences-banner__update-btn'
	},
	updateBtnTemplate(model){
		return `<button class="${model.classNames.updateBtn}">Update cookie preferences</button>`
	},
	bannerTemplate(model){
		return `<section role="dialog" aria-live="polite" aria-label="Cookie consent" aria-describedby="preferences-banner__desc" class="${model.classNames.banner}">
			<div class="preferences-content">
				<div class="wrap">
					<div class="row">
						<!--googleoff: all-->
						<div id="preferences-banner__desc">
							<div class="preferences-banner__heading">This website uses cookies.</div>
							<p class="preferences-banner__text">We use cookies to analyse our traffic and to provide social media features. You can choose which categories of cookies you consent to, or accept our recommended settings.
							<a class="preferences-banner__link" rel="noopener noreferrer nofollow" href="${model.policyURL}"> Find out more about the cookies we use.</a></p>
							<ul class="preferences-banner__list">
								${Object.keys(model.types).map(type => `<li class="preferences-banner__list-item">
									<input id="preferences-banner__${type.split(' ')[0].replace(' ', '-')}" class="${model.classNames.field}" value="${type}" type="checkbox"${model.types[type].checked ? ` checked` : ''}${model.types[type].disabled ? ` disabled` : ''}>
									<label class="preferences-banner__label" for="preferences-banner__${type.split(' ')[0].replace(' ', '-')}">
										${type.substr(0, 1).toUpperCase()}${type.substr(1)} cookies
									</label>  
								</li>`).join('')}
							</ul>
						</div>
						<button class="${model.classNames.btn}">OK</button>
						<!--googleon: all-->
					</div>
				</div>
			</div>
		</section>`;
	}
}
```

## Tests
```
npm t
```

## Browser support
This is module has both es6 and es5 distributions. The es6 version should be used in a workflow that transpiles.

The es5 version depends unpon Object.assign so all evergreen browsers are supported out of the box, ie9+ is supported with polyfills. ie8+ will work with even more polyfils for Array functions and eventListeners.

## Dependencies
None

## License
MIT
