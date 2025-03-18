export const findSpies = nodes => nodes.map(node => {
    if (!node.hash || !document.querySelector(node.hash)) return void console.warn('Node is missing a href hash or the hash target id does not exist');
    
    return {
        node,
        target: document.querySelector(node.hash),
    };
});

export const setActive = () => state => {
    const { settings, spies, active, hasScrolledToBottom } = state;

    spies.map(spy => {
        if (spy !== undefined) spy.node.classList.remove(settings.activeClassName);
    });

    active.forEach((spy, index) => {      
        if(hasScrolledToBottom && index !== active.length - 1) return;
        if (!hasScrolledToBottom && settings.single && index !== 0) return;
        spy.node.classList.add(settings.activeClassName);
    })
};
