export const callback = ({ settings, node }) => (entries, observer) => {
    const [ entry ] = entries;
    if (entry.isIntersecting) {
        node.classList.add(settings.className);
        if (typeof settings.callback === 'function') settings.callback(entry, { node, settings, observer });
        // replay requires a live observer, so unload is ignored when replay is set
        if (settings.unload && !settings.replay) observer.unobserve(node);
    } else if (settings.replay) node.classList.remove(settings.className);
};

export default ({ settings, node }) => {
    const observer = new IntersectionObserver(callback({ settings, node }), {
        root: settings.root,
        rootMargin: settings.rootMargin,
        threshold: settings.threshold
    });
    observer.observe(node);

    return {
        node,
        settings,
        disconnect: () => observer.disconnect()
    };
};
