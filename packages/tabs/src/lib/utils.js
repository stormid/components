export const getActiveIndexByHash = panels => {
    const hash = location.hash ? location.hash.slice(1) : false;
    if(!hash) return undefined;
    
    return panels.reduce((acc, panel, i) => {
        if(panel.getAttribute('id') === hash) acc = i;
        return acc;
    }, undefined);
};