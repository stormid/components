export default {
	closeBtnSelector: '.js-banner__close',
	template(sel){
		return `<section${!!~sel.indexOf('#') ? `id="${sel.substr(1)}"` : ''} class="${!~sel.indexOf('#') ? sel.substr(1) : ''} banner" role="dialog" aria-live="polite" aria-labelledby="banner__title">
			<!--googleoff: all-->
			<div id="banner__title" class="banner__title">Demonstration environment only</div>
			<button class="banner__dismiss js-banner__close" aria-label="Dismiss">
				<svg class="banner__dismiss-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
					<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
					<path d="M0 0h24v24H0z" fill="none"/>
				</svg>
			</button>
			<!--googleon: all-->
		</section>`;
	},
	dismiss(banner){ banner.parentNode.removeChild(banner); },
	type: 'localStorage',//localStorage || sessionStorage
	name: '__STORMID_BANNER__',
	value: 'acknowledged',
	callback: null//banner node passed to a callback
};

