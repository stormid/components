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

const setUpContainerDOM = (containerMarkup = '<div id="form-errors" class="my-summary"></div>') => {
    document.body.innerHTML = `<main>
        <div class="grid">${containerMarkup}</div>
        <a href="/back">Back</a>
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

const container = () => document.getElementById('form-errors');
const containerHrefs = () => Array.from(container().querySelectorAll('a')).map(link => link.getAttribute('href'));
const fillForm = () => {
    document.getElementById('name').value = 'Mick';
    document.getElementById('colour-1').checked = true;
    document.getElementById('email').value = 'mick@example.com';
};
const assertEmptyAndHidden = () => {
    assert.ok(container(), 'the container is still in the page');
    assert.strictEqual(container().childNodes.length, 0);
    assert.strictEqual(container().hasAttribute('hidden'), true);
};

describe('Validate > Unit > Error summary > container', () => {

    it('should render the summary inside the container, not before the form', async () => {
        const form = setUpContainerDOM();
        const [ validator ] = validate(form, { errorSummary: true, errorSummaryId: 'form-errors' });
        assert.strictEqual(await validator.validate(), false);

        assert.strictEqual(form.previousElementSibling.tagName, 'A');
        assert.strictEqual(document.querySelector('.error-summary'), null);
        assert.strictEqual(container().className, 'my-summary');
        assert.strictEqual(container().hasAttribute('hidden'), false);
        assert.strictEqual(container().hasAttribute('role'), false);
        const alert = container().querySelector(':scope > [role="alert"]');
        assert.strictEqual(alert.querySelector(':scope > h2.error-summary__title').textContent, 'There is a problem');
        assert.deepStrictEqual(Array.from(alert.querySelectorAll(':scope > ul.error-summary__list > li > a')).map(link => link.getAttribute('href')), [ '#name', '#colour-1', '#email' ]);
        assert.ok(document.activeElement === container(), 'focus is on the container');
    });

    it('should hide an empty container at initialisation', () => {
        const form = setUpContainerDOM();
        validate(form, { errorSummary: true, errorSummaryId: 'form-errors' });
        assert.strictEqual(container().hasAttribute('hidden'), true);
    });

    it('should replace the container contents on re-submit rather than add to them', async () => {
        const form = setUpContainerDOM();
        const [ validator ] = validate(form, { errorSummary: true, errorSummaryId: 'form-errors' });
        await validator.validate();
        document.getElementById('name').value = 'Mick';
        await validator.validate();
        assert.strictEqual(container().querySelectorAll('[role="alert"]').length, 1);
        assert.deepStrictEqual(containerHrefs(), [ '#colour-1', '#email' ]);
    });

    it('should empty and hide the container, keeping it in the page, when the form is valid on submit', async () => {
        const form = setUpContainerDOM();
        const [ validator ] = validate(form, { errorSummary: true, errorSummaryId: 'form-errors' });
        await validator.validate();
        fillForm();
        assert.strictEqual(await validator.validate(), true);
        assertEmptyAndHidden();
    });

    it('should empty and hide the container, keeping it in the page, when the form is reset', async () => {
        const form = setUpContainerDOM();
        const [ validator ] = validate(form, { errorSummary: true, errorSummaryId: 'form-errors' });
        await validator.validate();
        form.dispatchEvent(new Event('reset'));
        assertEmptyAndHidden();
    });

    it('should empty and hide the container, keeping it in the page, when the instance is destroyed', async () => {
        const form = setUpContainerDOM();
        const [ validator ] = validate(form, { errorSummary: true, errorSummaryId: 'form-errors' });
        await validator.validate();
        validator.destroy();
        assertEmptyAndHidden();
    });

    it('should move focus to the form when the focused container is hidden', async () => {
        const form = setUpContainerDOM();
        const [ validator ] = validate(form, { errorSummary: true, errorSummaryId: 'form-errors' });
        await validator.validate();
        assert.ok(document.activeElement === container(), 'focus is on the container');
        form.dispatchEvent(new Event('reset'));
        assert.ok(document.activeElement === form, 'focus is on the form');
    });

    it('should hide the container once the last error is fixed via validateGroup', async () => {
        const form = setUpContainerDOM();
        const [ validator ] = validate(form, { errorSummary: true, errorSummaryId: 'form-errors' });
        await validator.validate();
        fillForm();
        await validator.validateGroup('name');
        await validator.validateGroup('colour');
        assert.strictEqual(container().hasAttribute('hidden'), false);
        await validator.validateGroup('email');
        assertEmptyAndHidden();
    });

    it('should warn and render before the form when the container is not found', async () => {
        const form = setUpContainerDOM();
        console.warn = mock.fn();
        const [ validator ] = validate(form, { errorSummary: true, errorSummaryId: '#form-errors' });
        assert.strictEqual(console.warn.mock.callCount(), 1);
        assert.match(console.warn.mock.calls[0].arguments[0], /'#form-errors'/);
        await validator.validate();
        assert.ok(form.previousElementSibling.classList.contains('error-summary'));
        assert.strictEqual(container().childNodes.length, 0);
        assert.strictEqual(container().hasAttribute('hidden'), false);
    });

    it('should warn and render before the form when errorSummaryId is not a non-empty string', async () => {
        const form = setUpContainerDOM();
        console.warn = mock.fn();
        const [ validator ] = validate(form, { errorSummary: true, errorSummaryId: '  ' });
        assert.strictEqual(console.warn.mock.callCount(), 1);
        await validator.validate();
        assert.ok(form.previousElementSibling.classList.contains('error-summary'));
        assert.strictEqual(container().childNodes.length, 0);
    });

    it('should warn and render no summary when errorSummaryId is set without errorSummary', async () => {
        const form = setUpContainerDOM();
        console.warn = mock.fn();
        const [ validator ] = validate(form, { errorSummaryId: 'form-errors' });
        assert.strictEqual(console.warn.mock.callCount(), 1);
        await validator.validate();
        assert.strictEqual(document.querySelector('.error-summary'), null);
        assert.strictEqual(container().childNodes.length, 0);
        assert.ok(document.activeElement === document.getElementById('name'), 'focus is on the first invalid field');
    });

    it('should stop using the container once the instance is destroyed', async () => {
        const form = setUpContainerDOM();
        const [ first ] = validate(form, { errorSummary: true, errorSummaryId: 'form-errors' });
        first.destroy();
        form.removeAttribute('novalidate');
        const [ second ] = validate(form, { errorSummary: true });
        await second.validate();
        assert.ok(form.previousElementSibling.classList.contains('error-summary'));
        assert.strictEqual(container().childNodes.length, 0);
    });

    it('should warn and render before the form when the container contains the form', async () => {
        const form = setUpContainerDOM();
        const wrapper = document.createElement('div');
        wrapper.id = 'form-wrapper';
        form.parentNode.insertBefore(wrapper, form);
        wrapper.appendChild(form);
        console.warn = mock.fn();
        const [ validator ] = validate(form, { errorSummary: true, errorSummaryId: 'form-wrapper' });
        assert.strictEqual(console.warn.mock.callCount(), 1);
        assert.strictEqual(wrapper.hasAttribute('hidden'), false);
        await validator.validate();
        assert.ok(document.contains(form), 'the form is still in the page');
        assert.ok(form.previousElementSibling.classList.contains('error-summary'));
    });

    it('should move focus to the form when the focused last link\'s group is fixed', async () => {
        const form = setUpContainerDOM();
        const [ validator ] = validate(form, { errorSummary: true, errorSummaryId: 'form-errors' });
        await validator.validate();
        fillForm();
        await validator.validateGroup('name');
        await validator.validateGroup('colour');
        container().querySelector('a[href="#email"]').focus();
        await validator.validateGroup('email');
        assertEmptyAndHidden();
        assert.ok(document.activeElement === form, 'focus is on the form');
    });

    it('should warn and render before the form when another form already uses the container', async () => {
        document.body.innerHTML = `<main>
            <div id="form-errors"></div>
            <form id="first"><label for="a">A</label><input id="a" name="a" data-val="true" data-val-required="Enter A"></form>
            <form id="second"><label for="b">B</label><input id="b" name="b" data-val="true" data-val-required="Enter B"></form>
        </main>`;
        console.warn = mock.fn();
        const [ first, second ] = validate('form', { errorSummary: true, errorSummaryId: 'form-errors' });
        assert.strictEqual(console.warn.mock.callCount(), 1);
        await first.validate();
        await second.validate();
        const secondForm = document.getElementById('second');
        assert.ok(secondForm.previousElementSibling.classList.contains('error-summary'));
        assert.deepStrictEqual(containerHrefs(), [ '#a' ]);
        secondForm.dispatchEvent(new Event('reset'));
        assert.deepStrictEqual(containerHrefs(), [ '#a' ]);
    });
});

describe('Validate > Unit > Error summary > focus when the last link is removed', () => {

    it('should move focus to the form when the focused last link of a summary before the form is removed', async () => {
        const form = setUpDOM();
        const [ validator ] = validate(form, { errorSummary: true });
        await validator.validate();
        document.getElementById('name').value = 'Mick';
        document.getElementById('colour-1').checked = true;
        document.getElementById('email').value = 'mick@example.com';
        await validator.validateGroup('name');
        await validator.validateGroup('colour');
        summary().querySelector('a[href="#email"]').focus();
        await validator.validateGroup('email');
        assert.strictEqual(summary(), null);
        assert.ok(document.activeElement === form, 'focus is on the form');
    });
});

const SERVER_CONTAINER = `<div id="form-errors" class="my-summary">
    <div role="alert">
        <h2 class="error-summary__title">There is a problem</h2>
        <ul class="error-summary__list">
            <li><a href="#name">Enter your name</a></li>
            <li><a href="#other">Something else went wrong</a></li>
        </ul>
    </div>
</div>`;

describe('Validate > Unit > Error summary > container with server-rendered errors', () => {

    it('should leave a container with server-rendered errors visible and track its links', () => {
        const form = setUpContainerDOM(SERVER_CONTAINER);
        validate(form, { errorSummary: true, errorSummaryId: 'form-errors' });
        assert.strictEqual(container().hasAttribute('hidden'), false);
        container().querySelector('a[href="#name"]').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        assert.ok(document.activeElement === document.getElementById('name'), 'focus is on the linked field');
    });

    it('should remove a fixed group\'s link from the container, keeping links not to a group', async () => {
        const form = setUpContainerDOM(SERVER_CONTAINER);
        //the server renders the inline error alongside the summary, as it does in the server-rendered summary tests
        const serverError = document.createElement('span');
        serverError.setAttribute('data-valmsg-for', 'name');
        serverError.textContent = 'Enter your name';
        document.getElementById('name').before(serverError);
        const [ validator ] = validate(form, { errorSummary: true, errorSummaryId: 'form-errors' });
        document.getElementById('name').value = 'Mick';
        await validator.validateGroup('name');
        assert.deepStrictEqual(containerHrefs(), [ '#other' ]);
        assert.strictEqual(container().hasAttribute('hidden'), false);
    });

    it('should replace server-rendered container content on submit', async () => {
        const form = setUpContainerDOM(SERVER_CONTAINER);
        const [ validator ] = validate(form, { errorSummary: true, errorSummaryId: 'form-errors' });
        await validator.validate();
        assert.strictEqual(container().querySelectorAll('[role="alert"]').length, 1);
        assert.deepStrictEqual(containerHrefs(), [ '#name', '#colour-1', '#email' ]);
    });

    it('should empty and hide a container with server-rendered errors on valid submit', async () => {
        const form = setUpContainerDOM(SERVER_CONTAINER);
        const [ validator ] = validate(form, { errorSummary: true, errorSummaryId: 'form-errors' });
        fillForm();
        assert.strictEqual(await validator.validate(), true);
        assertEmptyAndHidden();
    });

    it('should leave a summary before the form alone when a container is used', async () => {
        const form = setUpContainerDOM();
        const sibling = document.createElement('div');
        sibling.className = 'error-summary';
        sibling.innerHTML = '<ul><li><a href="#name">Enter your name</a></li></ul>';
        form.parentNode.insertBefore(sibling, form);
        const before = sibling.outerHTML;

        const [ validator ] = validate(form, { errorSummary: true, errorSummaryId: 'form-errors' });
        await validator.validate();
        form.dispatchEvent(new Event('reset'));
        assert.ok(form.previousElementSibling === sibling, 'the sibling summary is still before the form');
        assert.strictEqual(sibling.outerHTML, before);
    });
});
