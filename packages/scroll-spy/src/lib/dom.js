export const findSpies = nodes => nodes.map(node => {
    if (!node.hash || !document.querySelector(node.hash)) return void console.warn('Node is missing a href hash or the hash target id does not exist');
    
    return {
        node,
        target: document.querySelector(node.hash),
    };
});

export const setActive = () => state => {
    const { settings, spies, active } = state;

    spies.map(spy => {
        if (spy !== undefined) spy.node.classList.remove(settings.activeClassName);
    });

    console.log("setting the active based on this");
    console.table(active);

    active.forEach((spy, index) => {
        let currentNode;
        if(settings.single && index === active.length-1) {
            currentNode = spy.node;
        } else if(!settings.single) {
            currentNode = spy.node;
        }
        console.log(currentNode);
        if(currentNode) currentNode.classList.add(settings.activeClassName)
    })
};