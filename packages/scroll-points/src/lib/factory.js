import throttle from 'raf-throttle';

// const check = () => {
// 	if (!this.enteredView()) return;
	
// 	this.DOMElement.classList.add(this.settings.className);
// 	!!this.settings.callback && this.settings.callback.call(this);

// 	if(this.settings.unload) {
// 		document.removeEventListener('scroll', this.throttled, true);
// 		document.removeEventListener('resize', this.throttled, true);
// 	}
// };

export default ({ settings, node }) => {
	const Store = createStore();
    //set initial state of Store
    Store.dispatch({
        node,
        settings
    }, []);

	document.addEventListener('scroll', this.throttled, true);
	document.addEventListener('resize', this.throttled, true);
	check();
	
	return { 
		settings,
		node,
		getState: Store.getState
	};
}; 


/*
import throttle from 'raf-throttle';

StormScrollPoints = {
		init() {
			this.throttled = throttle(() => {
				this.check.call(this);
			});
			
			document.addEventListener('scroll', this.throttled, true);
			document.addEventListener('resize', this.throttled, true);
			this.check();

			return this;
		},
		check(){
			if (!this.enteredView()) return;
			
			this.DOMElement.classList.add(this.settings.className);
			!!this.settings.callback && this.settings.callback.call(this);

			if(this.settings.unload) {
				document.removeEventListener('scroll', this.throttled, true);
				document.removeEventListener('resize', this.throttled, true);
			}
		},
		enteredView(){
			let box = this.DOMElement.getBoundingClientRect(),
				triggerPos = !!this.settings.offset.indexOf && this.settings.offset.indexOf('%') ? window.innerHeight - (window.innerHeight / 100) * +(this.settings.offset.substring(0, this.settings.offset.length - 1)) : window.innerHeight - +(this.settings.offset);
			
			return (box.top - (isNaN(triggerPos) ? window.innerHeight : triggerPos) <= 0);
		}
	};
*/