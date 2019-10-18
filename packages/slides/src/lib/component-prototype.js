const KEY_CODES = {
		ENTER: 13
	},
	TRIGGER_EVENTS = ['click', 'keydown' ];

export default {
	init(){
		this.slides = [].slice.call(this.node.querySelectorAll(this.settings.itemSelector))
						.map(slide => ({
							unloadedImgs: [].slice.call(slide.querySelectorAll('[data-srcset], [data-src]')),
							container: slide
						}));

		this.nextButton = this.node.querySelector(this.settings.buttonNextSelector);
		this.previousButton = this.node.querySelector(this.settings.buttonPreviousSelector);
		this.navItems = [].slice.call(this.node.querySelectorAll(this.settings.navItemSelector));

		if(this.navItems.length > 0 && this.navItems.length !== this.slides.length) throw new Error('Slide navigation does not match the number of slides.');

		this.notification = this.node.querySelector(this.settings.liveRegionSelector);
		this.setCurrent(this.settings.startIndex);
		this.slides[this.currentIndex].container.classList.add(this.settings.activeClass);
		this.initHandlers();
		this.settings.preload ? this.slides.forEach((slide, i) => { this.loadImage(i); }) : this.loadImages(this.settings.startIndex);
        this.settings.autoPlay ? this.autoPlay(this.settings.slideDuration) : null;
		return this;
	},
	initHandlers(){
		TRIGGER_EVENTS.forEach(ev => {
			['previous', 'next'].forEach(type => {
				if(this[`${type}Button`]) this[`${type}Button`].addEventListener(ev, e => {
					if(e.keyCode && e.keyCode !== KEY_CODES.ENTER) return;
					this[type]();
				});
			});
			this.navItems.length > 0 && this.navItems.forEach((item, i)	 => {
				item.addEventListener(ev, e => {
					if(e.keyCode && e.keyCode !== KEY_CODES.ENTER) return;
					this.change(i);
				})
			});
		});
	},
	loadImage(i){
		if(!this.slides[i].unloadedImgs.length) return;
		
		this.slides[i].container.classList.add(this.settings.loadingClass);
		this.slides[i].unloadedImgs = this.slides[i].unloadedImgs.reduce((acc, el) => {
											['src', 'srcset'].forEach(type => {
												if(el.hasAttribute(`data-${type}`)) {
													el.setAttribute(type, el.getAttribute(`data-${type}`));
													el.removeAttribute(`data-${type}`);
												}
												this.slides[i].container.classList.remove(this.settings.loadingClass);
											});
											return acc;
										}, []);
	},
	loadImages(i){
		if(!this.node.querySelector('[data-src], [data-srcset]')) return;
		let indexes = [i];

		if(this.slides.length > 1) indexes.push(i === 0 ? this.slides.length - 1 : i - 1);
		if(this.slides.length > 2) indexes.push(i === this.slides.length - 1 ? 0 : i + 1);

		indexes.forEach(idx => { this.loadImage(idx) });
	},
	reset(){
		this.slides[this.currentIndex].container.classList.remove(this.settings.activeClass);
		this.slides[this.currentIndex].container.removeAttribute('tabindex');
		this.navItems.length && this.navItems[this.currentIndex].removeAttribute('aria-current');

		let previouslyHidden = this.node.querySelector(`.${this.settings.hidePreviousClass}`),
			previouslyShown = this.node.querySelector(`.${this.settings.showPreviousClass}`),
			nextShown = this.node.querySelector(`.${this.settings.showNextClass}`),
			nextHidden = this.node.querySelector(`.${this.settings.hideNextClass}`);

		previouslyHidden && previouslyHidden.classList.remove(this.settings.hidePreviousClass);
		previouslyShown && previouslyShown.classList.remove(this.settings.showPreviousClass);
		nextShown && nextShown.classList.remove(this.settings.showNextClass);
		nextHidden && nextHidden.classList.remove(this.settings.hideNextClass);
	},
	next(){
		this.change((this.currentIndex === this.slides.length - 1 ? 0 : this.currentIndex + 1));
	},
	previous(){
		this.change((this.currentIndex === 0 ? this.slides.length - 1 : this.currentIndex - 1));
	},
	change(index){
		if (index === this.currentIndex) return;
		
		this.reset();

		index = index === -1 ? this.slides.length - 1 : index === this.slides.length ? 0 : index;

		this.loadImages(index);
		
		let isForwards = (index > this.currentIndex || index === 0 && this.currentIndex === this.slides.length - 1) && !(index === (this.slides.length - 1) && this.currentIndex === 0);
		
		this.slides[this.currentIndex].container.classList.add(isForwards ? this.settings.hidePreviousClass : this.settings.hideNextClass);
		this.slides[index].container.classList.add(`${isForwards ? this.settings.showNextClass : this.settings.showPreviousClass}`);
		this.setCurrent(index);
		!this.settings.autoPlay && this.slides[index].container.focus();
		
		(this.settings.callback && typeof this.settings.callback === 'function') && this.settings.callback();
	},
	setCurrent(i){
		this.slides[i].container.classList.add(this.settings.activeClass);
		this.slides[i].container.setAttribute('tabindex', '-1');
		this.navItems.length && this.navItems[i].setAttribute('aria-current', true);
		this.notification.innerHTML = `Slide ${i + 1} of ${this.slides.length}`;
		this.currentIndex = i;
    },
    autoPlay(slideDuration) {
        this.interval = setInterval(() => {
            this.next();
        }, slideDuration ? slideDuration * 1000 : 5000);
    }
};