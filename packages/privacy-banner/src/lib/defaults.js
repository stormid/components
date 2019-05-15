import { writeCookie } from './utils'; 

export default {
	name: '.PrivacyPreferences',
	path: '',
	domain: '',
	secure: true,
	expiry: 365,
	types: {
		'necessary': { fns: [] }
	},
	bannerTrigger: false,
	policyURL: '/cookie-policy',
	classNames: {
		banner: 'privacy-banner',
		acceptBtn: 'privacy-banner__accept',
		submitBtn: 'privacy-banner__submit',
		field: 'privacy-banner__field',
		updateBtnContainer: 'privacy-banner__update',
		updateBtn: 'privacy-banner__update-btn',
		form: 'privacy-banner__form',
		fieldset: 'privacy-banner__fieldset',
		legend: 'privacy-banner__legend',
		formContainer: 'privacy-banner__form-container',
		title: 'privacy-banner__form-title',
		description: 'privacy-banner__form-description'
	},
	updateBtnTemplate(model){
		return `<button class="${model.classNames.updateBtn}">Update privacy preferences</button>`
	},
	bannerTemplate(model){
		return `<section role="dialog" aria-live="polite" aria-label="You privacy" class="${model.classNames.banner}">
			<div class="privacy-content">
				<div class="wrap">
					<div class="row">
						<!--googleoff: all-->
						<div class="privacy-banner__title">Cookie</div>
						<p>We use cookies to improve your experience on our site and show you personalised advertising.</p>
						<p>Find out more from our <a class="privacy-banner__link" rel="noopener noreferrer nofollow" href="/privacy-policy">privacy policy</a> and <a class="privacy-banner__link" rel="noopener noreferrer nofollow" href="${model.policyURL}">cookie policy</a>.</p>
						<button class="${model.classNames.acceptBtn}">Accept and close</button>
						<a class="privacy-banner__link" rel="noopener noreferrer nofollow" href="${model.policyURL}">Your options</a>
						<!--googleon: all-->
					</div>
				</div>
			</div>
		</section>`;
	},
	formTemplate(model){
		return `<form class="${model.settings.classNames.form}">
				${Object.keys(model.settings.types).map(type => type === 'necessary' ? '' : `<fieldset class="${model.settings.classNames.fieldset}">
				<legend class="${model.settings.classNames.legend}">
					<span class="${model.settings.classNames.title}">${model.settings.types[type].title}</span>
					<span class="${model.settings.classNames.description}">${model.settings.types[type].description}</span>
				</legend>
				<div class="privacy-banner__row">
					<input
						name="privacy-${type.split(' ')[0].replace(' ', '-')}"
						id="privacy-banner__${type.split(' ')[0].replace(' ', '-')}-1"
						class="${model.settings.classNames.field}"
						value="1"
						type="radio"
						${model.consent[type] && Boolean(model.consent[type]) ? ` checked` : ''}>
					<label class="privacy-banner__label privacy-banner__label-yes" for="privacy-banner__${type.split(' ')[0].replace(' ', '-')}-1">
						<span class="privacy-banner__label-text">I am OK with this</span>
						<span class="privacy-banner__label-description">${model.settings.types[type].labels.yes}</span>
					</label>  
				</li>
				<div class="privacy-banner__row">
					<input
						name="privacy-${type.split(' ')[0].replace(' ', '-')}"
						id="privacy-banner__${type.split(' ')[0].replace(' ', '-')}-0"
						class="${model.settings.classNames.field}"
						value="0"
						type="radio"
						${model.consent[type] && !Boolean(model.consent[type]) ? ` checked` : ''}>
					<label class="privacy-banner__label privacy-banner__label-no" for="privacy-banner__${type.split(' ')[0].replace(' ', '-')}-0">
						<span class="privacy-banner__label-text">No thank you</span>
						<span class="privacy-banner__label-description">${model.settings.types[type].labels.no}</span>
					</label>  
				</li>
			</fieldset>`).join('')}
			<button class="${model.settings.classNames.submitBtn}"${Object.keys(model.consent).length === 1 ? ` disabled` : ''}>Save my settings</button>
		</form>`;
	}
};