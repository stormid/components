import Load, { series as LoadSeries } from '../src';

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<div class="chart"></div>`; 
};

describe('Load', () => {
    beforeAll(init);
    const loader = Load(['//d3js.org/d3.v3.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/preact/6.3.0/preact.min.js']);

    it('should return a promise', () => {
        expect(loader).toBeDefined();
        expect(loader.then).toBeDefined();
    });

    it('should convert single filenames into an array and load', () => {
        const loader = Load('//d3js.org/d3.v3.min.js');        
        expect(loader).resolves.toEqual(true);
    });

    it('should return promise fulfilled if passed an array of valid JS files', () => {
        expect(loader).resolves.toEqual(true);
    });

    it('should reject a file that cannot attached as a script', () => {
        const loader = Load(['//d3js.org/']);
        expect(loader).rejects.not.toBeNull();
    });

});

describe('Load in series', () => {
    const loader = LoadSeries(['//d3js.org/d3.v3.min.js', '//cdnjs.cloudflare.com/ajax/libs/d3.chart/0.2.0/d3.chart.js'])

    it('should return a promise', () => {
        expect(loader).toBeDefined();
        expect(loader.then).toBeDefined();
    });

    it('should return promise fulfilled if passed an array of valid JS files', () => {
        expect(loader).resolves.toEqual(true);
    });

    it('should reject a file that cannot attached as a script', () => {
        const loader = LoadSeries(['//d3js.org/']);
        expect(loader).rejects.not.toBeNull();
    });

});