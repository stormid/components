import { createStore } from './store';
import {
    input,
    output,
    list,
    status,
    listeners
} from './dom';

export default ({ node, settings }) => {
    const store = createStore();
    
    store.update({
        settings,
        dom: {
            node,
            select: node.querySelector('select'),
            input: input({ node, settings }),
            list: list(node),
            status: status(node),
            output: output({ node, settings }) //list of hidden inputs, single hidden input
        }
    }, [
        listeners(store),
    ]);

    return {
        getState: store.getState,
    };
};