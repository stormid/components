export const findSpies = nodes => nodes.map(node => {
    if (!node.hash || !document.querySelector(node.hash)) return void console.warn('Node is missing a href hash or the hash target id does not exist');
    
    const newSpy =  {
        node,
        target: document.querySelector(node.hash),
    };

    console.log(newSpy);

    return newSpy;
});

export const setActive = spy => state => {
    const { settings } = state;
    if (spy !== undefined) spy.node.classList.add(settings.activeClassName);
};

export const unsetActive = spy => state => {
    const { settings } = state;
    if (spy !== undefined) spy.node.classList.remove(settings.activeClassName);
};

export const unsetAllActive = state => {
    const { settings, spies } = state;
    spies.map(spy => {
        if (spy !== undefined) spy.node.classList.remove(settings.activeClassName);    
    });
};

export const findActive = state => {
    const { settings, active } = state;
    if (active.length > 0) active[0].node.classList.add(settings.activeClassName);
};