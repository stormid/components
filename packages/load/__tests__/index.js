import Load, { synchronous as LoadSychronous } from '../src';

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<div class="chart"></div>`; 
};

describe('Load', () => {
    beforeAll(init);
    const loader = Load(['//d3js.org/d3.v3.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/preact/6.3.0/preact.min.js']);

    it('should return a promise', () => {
        //loader.should.be.a.Promise();
        expect(loader).toBeDefined();
        expect(loader.then).toBeDefined();
    });

    it('should convert single filenames into an array and load', () => {
        // Load('//d3js.org/d3.v3.min.js').should.be.fulfilled();
    });

    // it('should return promise fulfilled if passed an array of valid JS files', () => {
    //     loader.should.be.fulfilled();
    // });

    // it('should reject a file that cannot attached as a script', () => {
    //     Load(['//d3js.org/']).should.be.rejected();
    // });

});

// describe('Load synchronously', () => {
//     const loader = LoadSychronous(['//d3js.org/d3.v3.min.js', '//cdnjs.cloudflare.com/ajax/libs/d3.chart/0.2.0/d3.chart.js'], false)

//     it('should return a promise', () => {
//         loader.should.be.a.Promise();
//     });

//     it('should reject anything but an array', () => {
//         //Load.bind(Load, '//d3js.org/d3.v3.min.js', false).should.throw();
//         Load('//d3js.org/d3.v3.min.js', false).should.be.fulfilled();
//     });

//     it('should return promise fulfilled if passed an array of valid JS files', () => {
//         loader.should.be.fulfilled();
//     });

//     it('should reject a file that cannot attached as a script', () => {
//         Load(['//d3js.org/'], false).should.be.rejected();
//     });

// });