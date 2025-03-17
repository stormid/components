export const findSpies = nodes => nodes.map(node => {
    if (!node.hash || !document.querySelector(node.hash)) return void console.warn('Node is missing a href hash or the hash target id does not exist');
    
    return {
        node,
        target: document.querySelector(node.hash),
    };
});

export const setActive = () => state => {
    const { settings, spies, active, scrollDirectionY, hasScrolled } = state;

    spies.map(spy => {
        if (spy !== undefined) spy.node.classList.remove(settings.activeClassName);
    });

    if (!hasScrolled && active.length) {
        if (active[0].node) active[0].node.classList.add(settings.activeClassName);
        return;
    }

    active.forEach((spy, index) => {
        if (settings.single && scrollDirectionY === 'down' && index !== active.length - 1) return;
        if (settings.single && scrollDirectionY === 'up' && index !== 0) return;
        spy.node.classList.add(settings.activeClassName);
    })
};
