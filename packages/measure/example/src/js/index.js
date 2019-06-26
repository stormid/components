import Measure from '../../../src';
 import {
     impressions,
     click,
     detail,
     add,
     checkout,
     step
} from './auto-measure';


window.addEventListener('DOMContentLoaded', () => {
    const __m = Measure.init( 'UA-141774857-1');    
    impressions(__m); 
    click(__m);
    detail(__m);
    add(__m);
    checkout(__m);
    step(__m);
});