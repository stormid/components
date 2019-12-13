import { singles, galleries } from './lib/init';

const init = (src, options) => {
    if (!src.length) return void console.warn('Modal Gallery cannot be initialised, no images found');

    if (options && options.single) return singles(src, options);
    return galleries(src, options);
};

export default { init };