import defaults from './lib/defaults';

const isHidden = el => el.offsetParent === null;

const update = ({ target }) => {
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
};
const initObserver = el => {
    const observer = new MutationObserver(mutationsList => {
        update({ target: el });
    });
    observer.observe(el.parentNode, { attributes: true, attributeOldValue: true, attributeFilter: ['class', 'hidden']  });
};


export default (selector, options) => {
    const nodes = [].slice.call(document.querySelectorAll(selector));
    const events = options && options.events || defaults.events;

    return nodes.map(node => {
        events.forEach(event => {
            node.addEventListener(event, update);
        });
        if (isHidden(node)) initObserver(node);
        update({ target: node });

        return {
            node,
            resize() {
                update({ target: node });
            }
        };
    });
};
