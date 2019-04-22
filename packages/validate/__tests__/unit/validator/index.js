import { resolveParam } from '../../../src/lib/validator';

//resolveParam
describe('Validate > Unit > Validator > resolveParam', () => {
    it('should return a param Object indexed by second part of param name and String value', async () => {
      document.body.innerHTML = `<input
        id="group1"
        name="group1"
        data-val="true"
        data-val-length="Please enter between 2 and 8 characters"
        data-val-required="This field is required"
        data-val-length-min="2"
        data-val-length-max="8"
        type="text">`;
        const input = document.querySelector('#group1');
        const param = 'length-min';
        const resolved = resolveParam(param, input);
        expect(resolved).toEqual({ 'min': '2' });
  });

  //DOM_SELECTOR_PARAMS are params that get their vaoues from other inputs (e.g. 'equal-to')
//   it('should return a param Object indexed by second part of param name, and an array pf DOMNodes', async () => {

//   });
})

/*
const resolveParam = (param, input) => {
    let value = input.getAttribute(`data-val-${param}`);
    return ({
                [param.split('-')[1]]: !!~DOM_SELECTOR_PARAMS.indexOf(param) ? DOMNodesFromCommaList(value, input): value
            })
};
*/