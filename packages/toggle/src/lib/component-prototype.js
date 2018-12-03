const TRIGGER_EVENTS = ['click', 'keydown'],
      TRIGGER_KEYCODES = [13, 32],
	  FOCUSABLE_ELEMENTS = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'];

export default {
	init() {
		this.toggles = this.node.getAttribute('data-toggle') && [].slice.call(document.querySelectorAll('.' + this.node.getAttribute('data-toggle')));
		if(!this.toggles) return console.warn('Toggle cannot be initialised, no toggle buttons elements found'), false;
		
		this.isOpen = false;
		if(this.settings.focus) this.focusableChildren = this.getFocusableChildren();
		if(this.settings.trapTab) this.boundKeyListener = this.keyListener.bind(this);
		if(this.settings.closeOnBlur) this.boundFocusInListener = this.focusInListener.bind(this);
		this.classTarget = (!this.settings.local) ? document.documentElement : this.node.parentNode;
		this.statusClass = !this.settings.local ? `on--${this.node.getAttribute('id')}` : 'active';
		this.animatingClass = !this.settings.local ? `animating--${this.node.getAttribute('id')}` : 'animating';

		this.initToggles();
		this.settings.startOpen && this.toggle();

		return this;
	},
	initToggles() {
		this.toggles.forEach(toggle => {
			if(toggle.tagName !== 'BUTTON') toggle.setAttribute('role', 'button');
			toggle.setAttribute('aria-controls', this.node.getAttribute('id'));
			toggle.setAttribute('aria-expanded', 'false');
			TRIGGER_EVENTS.forEach(ev => {
				toggle.addEventListener(ev, e => {
					if(!!e.keyCode && !~TRIGGER_KEYCODES.indexOf(e.keyCode)) return;
					e.preventDefault();
					this.toggle();
				});
			});
		});
	},
	getFocusableChildren() {
		return [].slice.call(this.node.querySelectorAll(FOCUSABLE_ELEMENTS.join(',')));
	},
	toggleState: function(){
		this.isOpen = !this.isOpen;
		this.toggles.forEach(toggle => {
			toggle.setAttribute('aria-expanded', toggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
		});
		this.classTarget.classList.remove(this.animatingClass);
		this.classTarget.classList.toggle(this.statusClass);
	},
	manageFocus: function(){
		if(!this.isOpen){
			this.lastFocused = document.activeElement;
			this.focusableChildren.length && window.setTimeout(() => this.focusableChildren[0].focus(), this.settings.delay);
			this.settings.trapTab && document.addEventListener('keydown', this.boundKeyListener);
		}
		else {
			this.settings.trapTab && document.removeEventListener('keydown', this.boundKeyListener);
			this.focusableChildren.length && window.setTimeout(() => {
				this.lastFocused.focus();
				this.lastFocused = false;
			}, this.settings.delay);
		}
	},
	trapTab: function(e){
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
		if (this.isOpen && e.keyCode === 27) {
			e.preventDefault();
			this.toggle();
		}
		if (this.isOpen && e.keyCode === 9) this.trapTab(e);
	},
	focusInListener: function(e){
		if(
			!this.node.contains(e.target) && 
			!this.toggles.reduce((acc, toggle) => {
				if(toggle === e.target) acc = true;
				return acc;
			}, false)
		) this.toggle();
	},
	manageBlurClose: function(){
		if(!this.isOpen) document.addEventListener('focusin', this.boundFocusInListener);
		else document.removeEventListener('focusin', this.boundFocusInListener);
	},
	toggle: function(e){
		let delay = this.classTarget.classList.contains(this.statusClass) ?  this.settings.delay : 0;

		(!!this.settings.prehook && typeof this.settings.prehook === 'function') && this.settings.prehook.call(this);
		
		if(e) e.preventDefault(), e.stopPropagation();
		
		this.classTarget.classList.add(this.animatingClass);
		
		window.setTimeout(() => {
			(!!this.settings.focus && this.focusableChildren) && this.manageFocus();
			!!this.settings.closeOnBlur && this.manageBlurClose();
			this.toggleState();
			(!!this.settings.callback && typeof this.settings.callback === 'function') && this.settings.callback.call(this);
		}, delay);
	}
};