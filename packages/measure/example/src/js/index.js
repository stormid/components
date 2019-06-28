import Measure from '../../../src';
 import { auto } from '../../../src/lib/auto-ecommerce';

window.addEventListener('DOMContentLoaded', () => {
    // const __m = Measure.init( 'UA-141774857-1');
    auto(Measure.init( 'UA-141774857-1'));
    // impressions(__m); 
    // click(__m);
    // detail(__m);
    // add(__m);
    // checkout(__m);
    // step(__m);
    // purchase(__m);
});