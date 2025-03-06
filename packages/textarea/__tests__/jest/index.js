import textarea from '../../src';
import { getSelection } from '../../src/lib/utils';
window.scrollTo = function() {}; //not implemented in JSDOM

global.MutationObserver = class {
    // constructor(callback) {}
    disconnect() {}
    observe(element, initObject) {}
};

let Textareas;

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<textarea rows="1"></textarea>`;

    Textareas = textarea('textarea');
};

describe(`Textarea > initialisation`, () => {
    
    beforeAll(init);

    it('should return array of length 1', async () => {
        expect(Textareas.length).toEqual(1);
    });

    it('should return the expected API', () => {
        expect(Textareas[0]).not.toBeNull();
        expect(Textareas[0].node).not.toBeNull();
        expect(Textareas[0].update).not.toBeNull();
    });

});

describe('Textarea > Initialisation > Get Selection', () => {

    const setupDOM = () => {
        document.body.innerHTML = `<textarea rows="1"></textarea>`;
    }

    beforeAll(setupDOM);

    it('should return an array when passed a DOM element', async () => {
        const textarea = document.querySelector('textarea');
        const els = getSelection(textarea);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed a NodeList element', async () => {
        const textarea = document.querySelectorAll('textarea');
        const els = getSelection(textarea);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed an array of DOM elements', async () => {
        const textarea = document.querySelector('textarea');
        const els = getSelection([textarea]);
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

    it('should return an array when passed a string', async () => {
        const els = getSelection('textarea');
        expect(els instanceof Array).toBe(true);
        expect(els.length).toEqual(1);
    });

});


// cannot get JSDOM to change dimension of the textarea
// describe(`Textarea > listener`, () => {
    
//     beforeAll(init);

//     it('should update the height of the textarea after an input event', async () => {
//         Textareas[0].node.value = ` Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent malesuada, quam non finibus imperdiet, nulla dolor venenatis libero, quis euismod lectus justo ac orci. Praesent eget tincidunt dui, id blandit turpis. Ut arcu purus, semper vitae nibh at, fermentum tempor dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent malesuada, quam non finibus imperdiet, nulla dolor venenatis libero, quis euismod lectus justo ac orci. Praesent eget tincidunt dui, id blandit turpis. Ut arcu purus, semper vitae nibh at, fermentum tempor dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent malesuada, quam non finibus imperdiet, nulla dolor venenatis libero, quis euismod lectus justo ac orci. Praesent eget tincidunt dui, id blandit turpis. Ut arcu purus, semper vitae nibh at, fermentum tempor dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent malesuada, quam non finibus imperdiet, nulla dolor venenatis libero, quis euismod lectus justo ac orci. Praesent eget tincidunt dui, id blandit turpis. Ut arcu purus, semper vitae nibh at, fermentum tempor dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent malesuada, quam non finibus imperdiet, nulla dolor venenatis libero, quis euismod lectus justo ac orci. Praesent eget tincidunt dui, id blandit turpis. Ut arcu purus, semper vitae nibh at, fermentum tempor dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam. `;
  
//         const event = document.createEvent('Event');
//         event.initEvent('input', true, true);
//         Textareas[0].node.dispatchEvent(event);

//         expect(Textareas[0].node.style.height).toEqual(`${Textareas[0].node.scrollHeight}px`);
//     });

// });
