import CheckAll from '../src';

let CheckSet, items;

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<div class="form-group relative">
        <input class="js-check-all" type="checkbox" id="check-all" data-group="group-1" checked>
        <label for="check-all" id="toggle-label">Check all</label>
        </div>
        <div class="col small-12 medium-6 relative">
        <input data-group-name="group-1" id="item-1" class="form-row-checkbox__checkbox" type="checkbox" name="items" value="1">
        <label for="item-1" class="form-control-label form-control-label--checkbox">
        Item 1
        </label>
        </div>
        <div class="col small-12 medium-6 relative">
        <input data-group-name="group-1" id="item-2" class="form-row-checkbox__checkbox" type="checkbox" name="items" value="2">
        <label for="item-2" class="form-control-label form-control-label--checkbox">
        Item 2
        </label>
        </div>
        <div class="col small-12 medium-6 relative">
        <input data-group-name="group-1" id="item-3" class="form-row-checkbox__checkbox" type="checkbox" name="items" value="3">
        <label for="item-3" class="form-control-label form-control-label--checkbox">
        Item 3
        </label>
        </div>
        <div class="col small-12 medium-6 relative">
        <input data-group-name="group-1" id="item-4" class="form-row-checkbox__checkbox" type="checkbox" name="items" value="4">
        <label for="item-4" class="form-control-label form-control-label--checkbox">
        Item 4
        </label>
        </div>
        <div class="col small-12 medium-6 relative">
        <input data-group-name="group-1" id="item-5" class="form-row-checkbox__checkbox" type="checkbox" name="items" value="5">
        <label for="item-5" class="form-control-label form-control-label--checkbox">
        Item 5
        </label>
    </div>`;

    CheckSet = CheckAll.init('.js-check-all');
    items = [].slice.call(document.getElementsByName('items'));
};

describe(`Initialisation`, () => {
    
    beforeAll(init);

    it('should return array of length 1', async () => {
      expect(CheckSet.length).toEqual(1);
    });

    it('should return the expected API', () => {
        expect(CheckSet[0]).not.toBeNull();
        expect(CheckSet[0].node).not.toBeNull();
        expect(CheckSet[0].groupNodes).not.toBeNull();
        expect(CheckSet[0].groupNodes.length).toEqual(5);
    });

});


describe(`Events`, () => {

    it('should uncheck main node checkbox when a group checkbox is clicked', () => {
        document.getElementById('item-1').click();
        expect(CheckSet[0].node.checked).toEqual(false);
    });

    it('should uncheck all group checkboxes when the  main node checkbox is clicked', () => {
        CheckSet[0].node.click();
        expect(document.getElementById('item-1').checked).toEqual(false);
    });

});