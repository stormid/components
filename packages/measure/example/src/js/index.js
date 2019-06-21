import Measure from '../../../src';
 import { impressions, click, detail } from './auto-measure';


window.addEventListener('DOMContentLoaded', () => {
    window.__m = Measure.init( 'UA-141774857-1');    
    impressions(__m); 
    click(__m);
    detail(__m);    
});