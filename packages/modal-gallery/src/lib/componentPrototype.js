import { 
	overlay,
	overlayInner,
	item,
	details
} from './templates';

const KEY_CODES = {
		TAB: 9,
		ESC: 27,
		LEFT: 37,
		RIGHT: 39,
		ENTER: 13
	},
	TRIGGER_EVENTS = window.PointerEvent ? ['pointerdown', 'keydown'] : ['ontouchstart' in window ? 'touchstart' : 'click', 'keydown' ];

export default {
	init() {
		this.isOpen = false;
		this.current = false;
		this.imageCache = [];
		this.items[0].trigger && this.initTriggers();
		this.settings.preload && this.items.forEach((item, i) => { this.loadImage(i); });
		return this;
	},
	initTriggers(){
		this.items.forEach((item, i) => {
			TRIGGER_EVENTS.forEach(ev => {
				item.trigger.addEventListener(ev, e => {
					if((e.keyCode && e.keyCode !== KEY_CODES.ENTER) || (e.which && e.which === 3)) return;
					e.preventDefault();
					e.stopPropagation();
					this.open(i);
				});
			});
		});
	},
	initUI(i){
		this.DOMOverlay = document.body.appendChild(overlay());
		this.DOMOverlay.insertAdjacentHTML('beforeend', overlayInner(this.items.map(details).map(item).join('')));
		this.DOMItems = [].slice.call(this.DOMOverlay.querySelectorAll('.js-modal-gallery__item'));
		this.DOMTotals = this.DOMOverlay.querySelector('.js-gallery-totals');
		if(this.imageCache.length === this.items.length) this.imageCache.forEach((img, i) => { this.writeImage(i); });
		else this.loadImages(i);
		return this;
	},
	unmountUI(){
		this.DOMOverlay.parentNode.removeChild(this.DOMOverlay);
	},
	initButtons(){
		this.closeBtn = this.DOMOverlay.querySelector('.js-modal-gallery__close');
		this.closeBtn.addEventListener('click', this.close.bind(this));

		if (this.items.length < 2) {
			this.DOMOverlay.removeChild(this.DOMOverlay.querySelector('.js-modal-gallery__previous'));
			this.DOMOverlay.removeChild(this.DOMOverlay.querySelector('.js-modal-gallery__next'));
			return;
		}

		this.previousBtn = this.DOMOverlay.querySelector('.js-modal-gallery__previous');
		this.nextBtn = this.DOMOverlay.querySelector('.js-modal-gallery__next');

		TRIGGER_EVENTS.forEach(ev => {
			['previous', 'next'].forEach(type => {
				this[`${type}Btn`].addEventListener(ev, e => {
					if(e.keyCode && e.keyCode !== KEY_CODES.ENTER) return;
					this[type]();
				})
			});
		});
	},
	writeTotals() { this.DOMTotals.innerHTML = `${this.current + 1}/${this.items.length}`; },
	writeImage(i){
		let imageContainer = this.DOMItems[i].querySelector('.js-modal-gallery__img-container'),
			imageClassName = this.settings.scrollable ? 'modal-gallery__img modal-gallery__img--scrollable' : 'modal-gallery__img',
			srcsetAttribute = this.items[i].srcset ? ` srcset="${this.items[i].srcset}"` : '',
			sizesAttribute = this.items[i].sizes ? ` sizes="${this.items[i].sizes}"` : '';
		
		imageContainer.innerHTML = `<img class="${imageClassName}" src="${this.items[i].src}" alt="${this.items[i].title}"${srcsetAttribute}${sizesAttribute}>`;
		this.DOMItems[i].classList.remove('loading');
	},
	loadImage(i) {
		let img = new Image(),
			loaded = () => { 
				this.imageCache[i] = img;
				this.writeImage(i);
			};
		img.onload = loaded;
		img.src = this.items[i].src;
		img.onerror = () => {
			this.DOMItems[i].classList.remove('loading');
			this.DOMItems[i].classList.add('error');
		};
		if(img.complete) loaded();
	},
	loadImages(i){
		let indexes = [i];

		if(this.items.length > 1) indexes.push(i === 0 ? this.items.length - 1 : i - 1);
		if(this.items.length > 2) indexes.push(i === this.items.length - 1 ? 0 : i + 1);

		indexes.forEach(idx => {
			if(this.imageCache[idx] === undefined) {
				this.DOMItems[idx].classList.add('loading');
				this.loadImage(idx);
			}
		});

	},
	getFocusableChildren() {
		let focusableElements = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'];

		return [].slice.call(this.DOMOverlay.querySelectorAll(focusableElements.join(',')));
	},
	trapTab(e){
		let focusedIndex = this.focusableChildren.indexOf(document.activeElement);
		if(e.shiftKey && focusedIndex === 0) {
			e.preventDefault();
			this.focusableChildren[this.focusableChildren.length - 1].focus();
		} else {
			if(!e.shiftKey && focusedIndex === this.focusableChildren.length - 1) {
				e.preventDefault();
				this.focusableChildren[0].focus();
			}
		}
	},
	keyListener(e){
		if(!this.isOpen) return;

		switch (e.keyCode) {
		case KEY_CODES.ESC:
			e.preventDefault();
			this.toggle();
			break;
		case KEY_CODES.TAB:
			this.trapTab(e);
			break;
		case KEY_CODES.LEFT:
			this.previous();
			break;
		case KEY_CODES.RIGHT:
			this.next();
			break;
		default:
			break;
		}
	},
	incrementDecrement(fn){
		this.current !== false && this.DOMItems[this.current].classList.remove('active');
		this.current = fn();
		this.DOMItems[this.current].classList.add('active');
		this.loadImages(this.current);
		(this.items.length > 1 && this.settings.totals) && this.writeTotals();
	},
	previous(){ this.incrementDecrement(() => (this.current === 0 ? this.DOMItems.length - 1 : this.current - 1)); },
	next(){ this.incrementDecrement(() => (this.current === this.DOMItems.length - 1 ? 0 : this.current + 1)); },
	open(i){
		this.initUI(i);
		this.initButtons();
		this.focusableChildren = this.getFocusableChildren();
		document.addEventListener('keydown', this.keyListener.bind(this));
		this.lastFocused =  document.activeElement;
		this.focusableChildren.length && window.setTimeout(function(){this.focusableChildren[0].focus();}.bind(this), 0);
		this.DOMItems[i || 0].classList.add('active');
		this.toggle(i || 0);
	},
	close(){
		document.removeEventListener('keydown', this.keyListener.bind(this));
		this.lastFocused && this.lastFocused.focus();
		this.DOMItems[this.current].classList.remove('active');
		this.toggle(null);
		this.unmountUI();
	},
	toggle(i){
		this.isOpen = !this.isOpen;
		this.current = i;
		this.DOMOverlay.classList.toggle('active');
		this.DOMOverlay.setAttribute('aria-hidden', !this.isOpen);
		this.DOMOverlay.setAttribute('tabindex', this.isOpen ? '0' : '-1');
		this.settings.fullscreen && this.toggleFullScreen();
		(this.items.length > 1 && this.settings.totals) && this.writeTotals();
	},
	toggleFullScreen(){
		if(this.isOpen){
			this.DOMOverlay.requestFullscreen && this.DOMOverlay.requestFullscreen();
			this.DOMOverlay.webkitRequestFullscreen && this.DOMOverlay.webkitRequestFullscreen();
			this.DOMOverlay.mozRequestFullScreen && this.DOMOverlay.mozRequestFullScreen();
		} else {
			document.exitFullscreen && document.exitFullscreen();
			document.mozCancelFullScreen && document.mozCancelFullScreen();
			document.webkitExitFullscreen && document.webkitExitFullscreen();
		}
	}
};