const NO_OUTLINE_CLASSNAME = 'no-outline';

if (typeof document !== 'undefined') {
    document.addEventListener('mousedown', () => {
        document.documentElement.classList.add(NO_OUTLINE_CLASSNAME);
    });
    document.addEventListener('keydown', () => {
        document.documentElement.classList.remove(NO_OUTLINE_CLASSNAME);
    });
}
