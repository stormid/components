export const findSpies = nodes => nodes.map(node => {
    if (!node.hash || !document.querySelector(node.hash)) return void console.warn('Node is missing a href hash or the hash target id does not exist');
    return  {
        node,
        target: document.querySelector(node.hash),
    };
});

export const setActive = () => state => {
    const { settings, spies, active, hasScrolledToBottom } = state;

    //Reset everything to work out new active state
    spies.map(spy => {
        if (spy !== undefined) spy.node.classList.remove(settings.activeClassName);
    });

    active.forEach((spy, index) => {    
        //If the user has scrolled to the bottom we want the last element to be active
        //even if it hasn't passed the threshold.  
        if (hasScrolledToBottom && index !== active.length - 1) return;

        //Otherwise, if the settings require just one active element it should always the 
        //the first in the active array
        if (!hasScrolledToBottom && settings.single && index !== 0) return;

        //Set the active class based on all those conditions
        spy.node.classList.add(settings.activeClassName);
    })
};
