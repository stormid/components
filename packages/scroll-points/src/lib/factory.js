export const callback = ({ settings, node }) => (entries, observer) => {
    if (entries[0].isIntersecting) {
        node.classList.add(settings.className);
        if (settings.callback && typeof settings.callback === 'function') settings.callback.call({ settings, node });
        if (settings.unload) observer.disconnect(node);
    } else if (settings.replay) node.classList.remove(settings.className);
};

export default ({ settings, node }) => {
    const observer = new IntersectionObserver(callback({ settings, node }), {
        root: settings.root,
        rootMargin: settings.rootMargin,
        threshold: settings.threshold
    });
    observer.observe(node);

    return { node, settings };
};