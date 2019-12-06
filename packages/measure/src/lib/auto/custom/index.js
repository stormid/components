import { META_NAMES, DATA_ATTRIBUTES } from '../constants';

// collect custom dimensions in the DOM
// e.g. <meta name="custom-dimension-1" content="11th dimension" />
// or <div data-measure-custom-dimension="1" data-measure-content="11th dimension" />
export const dimensions = () => [].slice.call(document.querySelectorAll(`[name^=${META_NAMES.CUSTOM_PREFIX}], [${DATA_ATTRIBUTES.CUSTOM_DIMENSION}]`))
                                    .reduce(composeDimensions, []);
    

const composeDimensions = (custom, el) => [ 
    ...custom, 
    el.hasAttribute(DATA_ATTRIBUTES.CUSTOM) 
    ? {
        index: el.getAttribute(DATA_ATTRIBUTES.CUSTOM),
        value: el.getAttribute(DATA_ATTRIBUTES.CONTENT),
        type: 'dimension'
    }
    : {
        index: el.getAttribute('name').replace(META_NAME_PREFIX, ''),
        value: el.getAttribute('content'),
        type: 'dimension'
    }];
    


// export const customMetricNodes = [].slice.call(document.querySelectorAll('[name^=custom-metric-]'));
// custom = customMetricNodes.length !== 0
//                 ? customMetricNodes.reduce((custom, el) => {
//                     custom.push({
//                         index: el.getAttribute('name').replace('custom-metric-', ''),
//                         value: el.getAttribute('content'),
//                         type: 'metric'
//                     })
//                     return custom;
//                 }, custom)
//                 : custom;        