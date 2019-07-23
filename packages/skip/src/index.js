{
	const focusable = ['a', 'select', 'input', 'button', 'textarea'];
  
	window.addEventListener('hashchange', () => {
		const element = document.getElementById(window.location.hash.substring(1));
		if (!element) return;
		if(!(focusable.indexOf(element.tagName.toLowerCase()) > -1)) element.setAttribute('tabindex', '0');
		element.focus();
	});
}