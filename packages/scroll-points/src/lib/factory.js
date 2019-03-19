import throttle from 'raf-throttle';
import createStore from './store';

const check = Store => () => {
	const { node, settings, listener } = Store.getState();
	if (!enteredView({ node, settings })) return;
	node.classList.add(settings.className);
	!!settings.callback && settings.callback(node);
	if(settings.unload) {
		document.removeEventListener('scroll', listener);
		document.removeEventListener('resize', listener);
	}
};

const enteredView = ({ node, settings}) => {
	const box = node.getBoundingClientRect();
	const triggerPos = !!settings.offset.indexOf && settings.offset.indexOf('%') 
						? window.innerHeight - (window.innerHeight / 100) * +(settings.offset.substring(0, settings.offset.length - 1)) 
						: window.innerHeight - +(settings.offset);
	
	
	return (box.top - (isNaN(triggerPos) ? window.innerHeight : triggerPos) <= 0);
};


export default ({ settings, node }) => {
	const Store = createStore();
	const listener = check(Store);
	const throttledListener = throttle(listener);
	Store.update({ settings, node, listener: throttledListener });
	document.addEventListener('scroll', throttledListener);
	document.addEventListener('resize', throttledListener);
	check(Store)(); //wahey
	
	return { 
		settings,
		node,
		getState: Store.getState
	};
};