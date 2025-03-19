import gallery from '../../../src';

const [ instance ] = gallery('.js-gallery', { startIndex: 2 });
console.log(instance.getState().activeIndex);