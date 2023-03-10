import { hasSearchParams, filterUnusedParams, generateId, getId, findLink, getUrlParts, isSubmitButton, getSubmitButtonText } from '../../src/lib/utils';

describe('GA4 > utils > hasSearchParams', () => {

    it('should return true or false for the presence of search  terms in a URL based on a set of parameter names', () => {
        //'q', 's', 'search', 'query', 'keyword'
        expect(hasSearchParams(`?q=test`)).toEqual(true);
        expect(hasSearchParams(`&q=test`)).toEqual(true);
        expect(hasSearchParams(`?s=test`)).toEqual(true);
        expect(hasSearchParams(`&s=test`)).toEqual(true);
        expect(hasSearchParams(`?search=test`)).toEqual(true);
        expect(hasSearchParams(`&search=test`)).toEqual(true);
        expect(hasSearchParams(`?query=test`)).toEqual(true);
        expect(hasSearchParams(`&query=test`)).toEqual(true);
        expect(hasSearchParams(`?keyword=test`)).toEqual(true);
        expect(hasSearchParams(`&keyword=test`)).toEqual(true);
        expect(hasSearchParams(`?keyword=test`)).toEqual(true);
        expect(hasSearchParams(`&potato=test`)).toEqual(false);
        expect(hasSearchParams(`?q=test&potato=test`)).toEqual(true);
        expect(hasSearchParams(`&que=test`)).toEqual(false);
    });

});

describe('GA4 > utils > filterUnusedParams', () => {

    it('should return an array without child tuples with falsey values', () => {
        
        expect(filterUnusedParams([
            ['key', 'value'],
            ['key', ],
            ['key', ''],
            ['key', null],
            ['key', 'value'],
            ['key', undefined],
            ['key', false],
        ])).toEqual([
            ['key', 'value'],
            ['key', 'value']
        ]);
    });

});

describe('GA4 > utils > generateId', () => {

    it('should return string of length 16', () => {
        const id = generateId();
        expect(id.length).toEqual(16);
        expect(typeof id).toEqual('string');
    });
    
    it('should return string of specified length', () => {
        const id = generateId(8);
        expect(id.length).toEqual(8);
    });

    it('should return string of no longer than 16 bits', () => {
        const id = generateId(32);
        expect(id.length).toEqual(16);
    });

});

describe('GA4 > utils > getId', () => {
    const storageMock = () => {
        let store = {};
      
        return {
            getItem(key) {
                return store[key];
            },
            setItem(key, value) {
                store[key] = value;
            },
            clear() {
                store = {};
            },
            removeItem(key) {
                delete store[key];
            },
            getAll() {
                return store;
            },
        };
    };
      
    Object.defineProperty(window, 'localStorage', { value: storageMock() });
    Object.defineProperty(window, 'sessionStorage', { value: storageMock() });

    it('should get an id item from localStorage if one is set', () => {
        window.localStorage.setItem('test.id', '123');
        expect(getId('test.id')).toEqual('123');
    });

    it('should create a new id and save it to localStorage if one does not exist', () => {
        expect(window.localStorage.getItem('test.id.2')).toBeUndefined();
        expect(getId('test.id.2')).toEqual(window.localStorage.getItem('test.id.2'));
    });

    it('should create a new id and save it to sessionStorage if specified', () => {
        expect(window.sessionStorage.getItem('test.id')).toBeUndefined();
        expect(getId('test.id', window.sessionStorage)).toEqual(window.sessionStorage.getItem('test.id'));
    });

});

describe('GA4 > utils > findLink', () => {
    document.body.innerHTML = `<div>
        <div>
            <div><a href="#" class="test-link">
            <span><span><span><span class="with-link"></span></span></span></span>
            </a></div>
        </div>
        <div >
            <div>
                <div>
                    <span><span><span><span class="no-link"></span></span></span></span>
                </div>
            </div>
        </div>
    </div>`;

    it('should find an ancestor link', () => {
        const target = document.querySelector('.with-link');
        const link = document.querySelector('.test-link');
        expect(findLink(target)).toEqual(link);
    });

    it('should return false for no ancestor link', () => {
        const target = document.querySelector('.no-link');
        expect(findLink(target)).toEqual(false);
    });

});

describe('GA4 > utils > getUrlParts', () => {

    it('should return isExternal, hostname and pathname for an absolute URL', () => {
        expect(getUrlParts('https://stormid.com/test')).toEqual({
            isExternal: true,
            hostname: 'stormid.com',
            pathname: '/test'
        });
    });

    it('should handle non-URLs', () => {
        expect(getUrlParts('not a url')).toEqual({
            isExternal: true,
            hostname: undefined,
            pathname: undefined
        });
    });

    it('should recognise non-external links', () => {
        delete global.window.location;
        global.window = Object.create(window);
        global.window.location = {
            protocol: 'https:',
            hostname: 'stormid.com',
            host: 'stormid.com'
        };
        expect(getUrlParts('https://stormid.com/test')).toEqual({
            isExternal: false,
            hostname: 'stormid.com',
            pathname: '/test'
        });
    });

});

describe('GA4 > utils > isSubmitButton', () => {
    document.body.innerHTML += `<button type="submit">Submit</button>
        <button class="no-type">Submit</button>
        <input type="submit" />
        <button type="button">Not submit</button>
    `;

    it('should recognise a button with type of submit', () => {
        const candidate = document.querySelector('button[type=submit]');
        expect(isSubmitButton(candidate)).toEqual(true);
    });

    it('should recognise a button without type of button', () => {
        const candidate = document.querySelector('button.no-type');
        expect(isSubmitButton(candidate)).toEqual(true);
    });

    it('should recognise an input with type of submit', () => {
        const candidate = document.querySelector('input[type=submit]');
        expect(isSubmitButton(candidate)).toEqual(true);
    });

    it('should rejcet a button with type of button', () => {
        const candidate = document.querySelector('button[type=button]');
        expect(isSubmitButton(candidate)).toEqual(false);
    });
    
});

describe('GA4 > utils > getSubmitButtonText', () => {

    document.body.innerHTML += `<form id="test-form">
        <input type="text id="test-field" />
        <button type="submit" id="submit-btn">Submit via button</button>
        <button type="button" id="not-submit-btn">Not submit</button>
        <input type="submit" id="submit-input" />
        <input type="submit" id="submit-input-with-value" value="test" />
        <button type="submit" id="submit-btn-with-children">Submit <span>button</span> with messy <b>innerHTML</b></button>
    </form>`;
    const form = document.querySelector('#test-form');
    // const input = document.querySelector('#test-field');
    const submitButtonWithChildren = document.querySelector('#submit-btn-with-children');
    const notSubmitButton = document.querySelector('#not-submit-btn');
    const submitInput = document.querySelector('#submit-input');
    const submitInputWithValue = document.querySelector('#submit-input-with-value');

    /*
    const submitNode = isSubmitButton(document.activeElement) ? document.activeElement : form.querySelector(`button:not([type=button]), input[type=submit]`);
    if (!submitNode) return '';
    if (submitNode.nodeName === 'BUTTON') return (submitNode.innerText || submitNode.textContent).trim();
    return submitNode.value || 'Submit';
    */
    it('should get the text value of the activeElement if it is a submit button/input', () => {
        submitInput.focus();
        expect(getSubmitButtonText(form)).toEqual('Submit');
    });

    it('should get the value of a submit input', () => {
        submitInputWithValue.focus();
        expect(getSubmitButtonText(form)).toEqual('test');
    });

    it('should get not return the value of a non-submit type button', () => {
        notSubmitButton.focus();
        expect(getSubmitButtonText(form)).not.toEqual('Not submit');
    });

    it('should get return the value of the first submit type button if not the activeElement', () => {
        expect(getSubmitButtonText(form)).toEqual('Submit via button');
    });

    it('should get the text value from the child nodes of a button', () => {
        submitButtonWithChildren.focus();
        expect(getSubmitButtonText(form)).toEqual('Submit button with messy innerHTML');
    });


});