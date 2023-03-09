import { hasSearchParams, filterUnusedParams, generateId, getId, findLink, getUrlParts, getSubmitButtonText } from '../../src/lib/utils';

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


//getUrlParts
//isSubmitButton
//getSubmitButtonText