import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import validate from '../../src/index.js';
import { findScrollTarget } from '../../src/lib/dom/error-summary.js';
import { DOTNET_CLASSNAMES } from '../../src/lib/constants/index.js';

const tick = () => new Promise(resolve => setTimeout(resolve));

const setUpDOM = () => {
    document.body.innerHTML = `<main>
        <form class="form">
            <label for="name">Name</label>
            <input id="name" name="name" data-val="true" data-val-required="Enter your name" type="text">
            <fieldset>
                <legend>Colour</legend>
                <input id="colour-1" name="colour" type="radio" value="red" data-val="true" data-val-required="Select a colour">
                <label for="colour-1">Red</label>
                <input id="colour-2" name="colour" type="radio" value="blue">
                <label for="colour-2">Blue</label>
            </fieldset>
            <label for="email">Email</label>
            <input id="email" name="email" data-val="true" data-val-email="{{value}} is not an email address" value="nope" type="text">
        </form>
    </main>`;
    return document.querySelector('form');
};

const summary = () => document.querySelector('.error-summary');
const hrefs = () => Array.from(summary().querySelectorAll('a')).map(link => link.getAttribute('href'));

describe('Validate > Unit > Error summary > disabled', () => {

    it('should not render a summary by default, and focus the first invalid field', async () => {
        const form = setUpDOM();
        const [ validator ] = validate(form);
        assert.strictEqual(await validator.validate(), false);
        assert.strictEqual(summary(), null);
        assert.strictEqual(document.activeElement, document.getElementById('name'));
    });
});

describe('Validate > Unit > Error summary > render', () => {

    it('should render a summary before the form, with an alert containing a title and a link to each invalid group', async () => {
        const form = setUpDOM();
        const [ validator ] = validate(form, { errorSummary: true });
        assert.strictEqual(await validator.validate(), false);

        const node = summary();
        assert.strictEqual(node.nextElementSibling, form);
        assert.strictEqual(node.hasAttribute('role'), false);
        const alert = node.querySelector(':scope > [role="alert"]');
        assert.strictEqual(alert.querySelector(':scope > h2.error-summary__title').textContent, 'There is a problem');
        const links = Array.from(alert.querySelectorAll(':scope > ul.error-summary__list > li > a'));
        assert.deepStrictEqual(links.map(link => [ link.getAttribute('href'), link.textContent ]), [
            [ '#name', 'Enter your name' ],
            [ '#colour-1', 'Select a colour' ],
            [ '#email', 'nope is not an email address' ]
        ]);
    });

    it('should focus the summary with a tabindex that is removed on blur', async () => {
        const form = setUpDOM();
        const [ validator ] = validate(form, { errorSummary: true });
        await validator.validate();

        const node = summary();
        assert.strictEqual(document.activeElement, node);
        assert.strictEqual(node.getAttribute('tabindex'), '-1');
        document.getElementById('name').focus();
        assert.strictEqual(node.hasAttribute('tabindex'), false);
    });

    it('should render inline errors alongside the summary', async () => {
        const form = setUpDOM();
        const [ validator ] = validate(form, { errorSummary: true });
        await validator.validate();
        assert.strictEqual(document.querySelectorAll(`form .${DOTNET_CLASSNAMES.ERROR}`).length, 3);
        assert.strictEqual(document.getElementById('name').getAttribute('aria-invalid'), 'true');
    });

    it('should use the errorSummaryTitle option', async () => {
        const form = setUpDOM();
        const [ validator ] = validate(form, { errorSummary: true, errorSummaryTitle: 'Fix these' });
        await validator.validate();
        assert.strictEqual(summary().querySelector('.error-summary__title').textContent, 'Fix these');
    });

    it('should use the default title and warn if the errorSummaryTitle option is empty', async () => {
        const form = setUpDOM();
        console.warn = mock.fn();
        const [ validator ] = validate(form, { errorSummary: true, errorSummaryTitle: ' ' });
        await validator.validate();
        assert.strictEqual(summary().querySelector('h2').textContent, 'There is a problem');
        assert.strictEqual(console.warn.mock.callCount(), 1);
    });

    it('should replace the summary on each invalid submit rather than add another', async () => {
        const form = setUpDOM();
        const [ validator ] = validate(form, { errorSummary: true });
        await validator.validate();
        document.getElementById('name').value = 'Mick';
        await validator.validate();
        assert.strictEqual(document.querySelectorAll('.error-summary').length, 1);
        assert.deepStrictEqual(hrefs(), [ '#colour-1', '#email' ]);
    });

    it('should list errors in document order, regardless of the order groups were added or their names', async () => {
        document.body.innerHTML = `<form class="form">
            <label for="added">Added</label>
            <input id="added" name="added" value="not valid" type="text">
            <label for="x">X</label>
            <input id="x" name="x" data-val="true" data-val-required="Enter x" type="text">
            <label for="one">One</label>
            <input id="one" name="1" data-val="true" data-val-required="Enter 1" type="text">
        </form>`;
        const [ validator ] = validate('form', { errorSummary: true });
        validator.addMethod('added', () => false, 'Added is invalid');
        await validator.validate();
        assert.deepStrictEqual(hrefs(), [ '#added', '#x', '#one' ]);
    });

    it('should link to the first field in a group that has an id', async () => {
        document.body.innerHTML = `<form class="form">
            <span data-valmsg-for="date"></span>
            <input name="day" data-val="true" data-val-required="Enter a date" data-val-group="date" type="text">
            <input id="month" name="month" data-val-group="date" type="text">
        </form>`;
        const [ validator ] = validate('form', { errorSummary: true });
        await validator.validate();
        assert.deepStrictEqual(hrefs(), [ '#month' ]);
    });

    it('should link to # and warn for a group with no field with an id', async () => {
        document.body.innerHTML = `<form class="form">
            <span data-valmsg-for="name"></span>
            <input name="name" data-val="true" data-val-required="Enter your name" type="text">
        </form>`;
        console.warn = mock.fn();
        const [ validator ] = validate('form', { errorSummary: true });
        await validator.validate();
        assert.deepStrictEqual(hrefs(), [ '#' ]);
        assert.strictEqual(console.warn.mock.callCount(), 1);
    });

    it('should warn and fall back to focusing the first invalid field if the form has no parent node', async () => {
        const form = document.createElement('form');
        form.innerHTML = `<label for="name">Name</label>
            <input id="name" name="name" data-val="true" data-val-required="Enter your name" type="text">`;
        console.warn = mock.fn();
        const input = form.querySelector('input');
        input.focus = mock.fn();
        const [ validator ] = validate(form, { errorSummary: true });
        assert.strictEqual(await validator.validate(), false);
        assert.strictEqual(console.warn.mock.callCount(), 1);
        assert.strictEqual(input.focus.mock.callCount(), 1);
    });
});

describe('Validate > Unit > Error summary > links', () => {

    it('should focus the field when a link is followed, preventing the default jump', async () => {
        const form = setUpDOM();
        const [ validator ] = validate(form, { errorSummary: true });
        await validator.validate();
        const event = new MouseEvent('click', { bubbles: true, cancelable: true });
        summary().querySelector('a[href="#email"]').dispatchEvent(event);
        assert.strictEqual(event.defaultPrevented, true);
        assert.strictEqual(document.activeElement, document.getElementById('email'));
    });

    it('should scroll to the legend of a radio or checkbox group, otherwise the label, otherwise the field', async () => {
        setUpDOM();
        assert.strictEqual(findScrollTarget(document.getElementById('colour-1')), document.querySelector('legend'));
        assert.strictEqual(findScrollTarget(document.getElementById('name')), document.querySelector('label[for="name"]'));
        document.querySelector('label[for="name"]').remove();
        assert.strictEqual(findScrollTarget(document.getElementById('name')), document.getElementById('name'));
    });

    it('should scroll to the legend of a field within half a viewport of it, otherwise its label', async () => {
        document.body.innerHTML = `<fieldset>
            <legend>Date of birth</legend>
            <label for="day">Day</label>
            <input id="day" name="day" type="text">
        </fieldset>`;
        const legend = document.querySelector('legend');
        const day = document.getElementById('day');
        legend.getBoundingClientRect = () => ({ top: 0 });
        day.getBoundingClientRect = () => ({ top: 100, height: 40 });
        assert.strictEqual(findScrollTarget(day), legend);
        day.getBoundingClientRect = () => ({ top: window.innerHeight, height: 40 });
        assert.strictEqual(findScrollTarget(day), document.querySelector('label'));
    });

    it('should find the label of a field whose id contains a quote', async () => {
        document.body.innerHTML = `<label for='a"b'>Label</label><input id='a"b' name="ab" type="text">`;
        assert.strictEqual(findScrollTarget(document.querySelector('input')), document.querySelector('label'));
    });
});

describe('Validate > Unit > Error summary > updates', () => {

    it('should remove a group from the summary when it is fixed in real time, and the summary once all are fixed', async () => {
        const form = setUpDOM();
        const [ validator ] = validate(form, { errorSummary: true });
        await validator.validate();

        const name = document.getElementById('name');
        name.value = 'Mick';
        name.dispatchEvent(new Event('input'));
        await tick();
        assert.deepStrictEqual(hrefs(), [ '#colour-1', '#email' ]);

        const colour = document.getElementById('colour-1');
        colour.checked = true;
        colour.dispatchEvent(new Event('change'));
        const email = document.getElementById('email');
        email.value = 'mick@example.com';
        email.dispatchEvent(new Event('input'));
        await tick();
        assert.strictEqual(summary(), null);
    });

    it('should not change messages or add new errors in real time', async () => {
        const form = setUpDOM();
        const [ validator ] = validate(form, { errorSummary: true });
        document.getElementById('name').value = 'Mick';
        await validator.validate();
        const before = summary().innerHTML;

        const name = document.getElementById('name');
        name.value = '';
        name.dispatchEvent(new Event('input'));
        const email = document.getElementById('email');
        email.value = 'still-nope';
        email.dispatchEvent(new Event('input'));
        await tick();

        assert.strictEqual(name.getAttribute('aria-invalid'), 'true');
        assert.strictEqual(summary().innerHTML, before);
    });

    it('should move focus to the next link when the focused link\'s group is fixed', async () => {
        const form = setUpDOM();
        const [ validator ] = validate(form, { errorSummary: true });
        await validator.validate();
        summary().querySelector('a[href="#name"]').focus();

        document.getElementById('name').value = 'Mick';
        await validator.validateGroup('name');
        assert.strictEqual(document.activeElement, summary().querySelector('a[href="#colour-1"]'));
    });

    it('should move focus to the form when the summary is removed while focused', async () => {
        const form = setUpDOM();
        const [ validator ] = validate(form, { errorSummary: true });
        document.getElementById('name').value = 'Mick';
        document.getElementById('colour-1').checked = true;
        await validator.validate();
        assert.strictEqual(document.activeElement, summary());

        document.getElementById('email').value = 'mick@example.com';
        await validator.validateGroup('email');
        assert.strictEqual(summary(), null);
        assert.strictEqual(document.activeElement, form);
    });

    it('should remove the summary when the form is valid on submit', async () => {
        const form = setUpDOM();
        const [ validator ] = validate(form, { errorSummary: true });
        await validator.validate();
        document.getElementById('name').value = 'Mick';
        document.getElementById('colour-1').checked = true;
        document.getElementById('email').value = 'mick@example.com';
        assert.strictEqual(await validator.validate(), true);
        assert.strictEqual(summary(), null);
    });

    it('should remove the summary when the form is reset', async () => {
        const form = setUpDOM();
        const [ validator ] = validate(form, { errorSummary: true });
        await validator.validate();
        form.dispatchEvent(new Event('reset'));
        assert.strictEqual(summary(), null);
    });

    it('should remove the summary when the instance is destroyed', async () => {
        const form = setUpDOM();
        const [ validator ] = validate(form, { errorSummary: true });
        await validator.validate();
        validator.destroy();
        assert.strictEqual(summary(), null);
    });

    it('should remove a group from the summary when it is removed, or passes validateGroup', async () => {
        const form = setUpDOM();
        const [ validator ] = validate(form, { errorSummary: true });
        await validator.validate();

        validator.removeGroup('colour');
        assert.deepStrictEqual(hrefs(), [ '#name', '#email' ]);

        document.getElementById('name').value = 'Mick';
        assert.strictEqual(await validator.validateGroup('name'), true);
        assert.deepStrictEqual(hrefs(), [ '#email' ]);
    });
});

const setUpServerDOM = () => {
    document.body.innerHTML = `<main>
        <div class="error-summary">
            <div role="alert">
                <h2 class="error-summary__title">There is a problem</h2>
                <ul class="error-summary__list">
                    <li><a href="#name">Enter your name</a></li>
                    <li><a href="#other">Something else went wrong</a></li>
                </ul>
            </div>
        </div>
        <form class="form">
            <label for="name">Name</label>
            <span data-valmsg-for="name">Enter your name</span>
            <input id="name" name="name" data-val="true" data-val-required="Enter your name" type="text">
        </form>
    </main>`;
    return document.querySelector('form');
};

describe('Validate > Unit > Error summary > server-rendered summary', () => {

    it('should replace a server-rendered summary on submit rather than add another', async () => {
        const form = setUpServerDOM();
        const [ validator ] = validate(form, { errorSummary: true });
        await validator.validate();
        assert.strictEqual(document.querySelectorAll('.error-summary').length, 1);
        assert.deepStrictEqual(hrefs(), [ '#name' ]);
    });

    it('should remove a server-rendered summary on reset', async () => {
        const form = setUpServerDOM();
        validate(form, { errorSummary: true });
        form.dispatchEvent(new Event('reset'));
        assert.strictEqual(summary(), null);
    });

    it('should remove a group\'s link from a server-rendered summary when it is fixed, keeping links that aren\'t to a group', async () => {
        const form = setUpServerDOM();
        const [ validator ] = validate(form, { errorSummary: true });
        document.getElementById('name').value = 'Mick';
        await validator.validateGroup('name');
        assert.deepStrictEqual(hrefs(), [ '#other' ]);
    });

    it('should focus the field when a server-rendered summary link is followed', async () => {
        const form = setUpServerDOM();
        validate(form, { errorSummary: true });
        summary().querySelector('a[href="#name"]').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        assert.strictEqual(document.activeElement, document.getElementById('name'));
    });

    it('should leave a server-rendered summary alone if the error summary is not enabled', async () => {
        const form = setUpServerDOM();
        validate(form);
        form.dispatchEvent(new Event('reset'));
        assert.ok(summary());
    });
});
