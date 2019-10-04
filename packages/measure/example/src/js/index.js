import Measure from '../../../src';
 import { auto } from '../../../src/lib/auto-ecommerce';

window.addEventListener('DOMContentLoaded', () => {

    //Collect custom dimensions using preferred mechanism, e.g. read from DOM node, script tag with Array/Object/JSON
    const customDimensionNodes = [].slice.call(document.querySelectorAll('[name^=custom-dimension-]'));
    let custom = customDimensionNodes.length !== 0 
                        ? customDimensionNodes.reduce((custom, el) => {
                            custom.push({
                                index: el.getAttribute('name').replace('custom-dimension-', ''),
                                value: el.getAttribute('content'),
                                type: 'dimension'
                            })
                            return custom;
                        }, [])
                        : [];

    const customMetricNodes = [].slice.call(document.querySelectorAll('[name^=custom-metric-]'));
    custom = customMetricNodes.length !== 0
                    ? customMetricNodes.reduce((custom, el) => {
                        custom.push({
                            index: el.getAttribute('name').replace('custom-metric-', ''),
                            value: el.getAttribute('content'),
                            type: 'metric'
                        })
                        return custom;
                    }, custom)
                    : custom;                    

    const __m = Measure.init( 'UA-141774857-1', { custom });

    auto(__m);
    // e-commerce tracking initialisers can also be named imports from auto-commerce
    // impressions(__m); 
    // click(__m);
    // detail(__m);
    // add(__m);
    // checkout(__m);
    // step(__m);
    // purchase(__m);
    
});