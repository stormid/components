import validate from '../../../src';
import { isValidDate, isDateInFuture, isDateInPast } from '../../../src/lib/plugins/methods/date';

describe('Validate > Integration > Plugins > Valid Date', () => {

    it('should add a validation method to a group', async () => {
        expect.assertions(2);
        document.body.innerHTML = `<form class="form">
            <fieldset>
                <legend>
                    <span>Date</span>
                    <span data-valmsg-for="date" id="date-error-message"></span>
                    <span data-valmsg-for="dateDay" id="date-Day-error-message"></span>
                    <span data-valmsg-for="dateMonth" id="date-Month-error-message"></span>
                    <span data-valmsg-for="dateYear" id="date-Year-error-message"></span>
                </legend>
                <div class="flex">
                    <input id="dateDay" name="dateDay" inputmode="numeric" data-val="true" data-val-required="Enter a day" aria-required="true"/>
                    <input id="dateMonth" name="dateMonth" inputmode="numeric" data-val="true" data-val-required="Enter a month" aria-required="true"/>
                    <input id="dateYear" name="dateYear" inputmode="numeric" data-val="true" data-val-required="Enter a year" aria-required="true" />
                </div>
            </fieldset>
        </form>`;
        
        const dateErrorNode = document.querySelector('#date-error-message');
        const dayInput = document.querySelector('#dateDay');
        const dayErrorNode = document.querySelector('#date-Day-error-message');
        const monthInput = document.querySelector('#dateMonth');
        const monthErrorNode = document.querySelector('#date-Month-error-message');
        const yearInput = document.querySelector('#dateYear');
        const yearErrorNode = document.querySelector('#date-Year-error-message');
        const [ validator ] = validate('form');

        expect(validator.getState().groups).toEqual({
            dateDay: {
                serverErrorNode: dayErrorNode,
                validators: [{ type: 'required', message: 'Enter a day' }],
                fields: [dayInput],
                valid: false
            },
            dateMonth: {
                serverErrorNode: monthErrorNode,
                validators: [{ type: 'required', message: 'Enter a month'  }],
                fields: [monthInput],
                valid: false
            },
            dateYear: {
                serverErrorNode: yearErrorNode,
                validators: [{ type: 'required', message: 'Enter a year'  }],
                fields: [yearInput],
                valid: false
            }
        });
        const dateFields = [ dayInput, monthInput, yearInput ];
        const message = 'Enter a valid date';
        validator.addMethod('date', isValidDate, message, dateFields);

        expect(validator.getState().groups).toEqual({
            dateDay: {
                serverErrorNode: dayErrorNode,
                validators: [{ type: 'required', message: 'Enter a day' }],
                fields: [dayInput],
                valid: false
            },
            dateMonth: {
                serverErrorNode: monthErrorNode,
                validators: [{ type: 'required', message: 'Enter a month'  }],
                fields: [monthInput],
                valid: false
            },
            dateYear: {
                serverErrorNode: yearErrorNode,
                validators: [{ type: 'required', message: 'Enter a year'  }],
                fields: [yearInput],
                valid: false
            },
            date: {
                serverErrorNode: dateErrorNode,
                validators: [{ type: 'custom', method: isValidDate, message }],
                fields: dateFields,
                valid: false
            }
        });
    });

    it('should return false for a missing day, month, or year', async () => {
        document.body.innerHTML = `<form class="form">
            <fieldset>
                <legend>
                    <span>Date</span>
                    <span data-valmsg-for="date" id="date-error-message"></span>
                    <span data-valmsg-for="dateDay" id="date-Day-error-message"></span>
                    <span data-valmsg-for="dateMonth" id="date-Month-error-message"></span>
                    <span data-valmsg-for="dateYear" id="date-Year-error-message"></span>
                </legend>
                <div class="flex">
                    <input id="dateDay" name="dateDay" inputmode="numeric" data-val="true" value="nope" />
                    <input id="dateMonth" name="dateMonth" inputmode="numeric" data-val="true" value="12" />
                    <input id="dateYear" name="dateYear" inputmode="numeric" data-val="true" value="2000" />
                </div>
            </fieldset>
        </form>`;
        
        const dateErrorNode = document.querySelector('#date-error-message');
        const dayInput = document.querySelector('#dateDay');
        const monthInput = document.querySelector('#dateMonth');
        const yearInput = document.querySelector('#dateYear');
        const [ validator ] = validate('form');

        const dateFields = [ dayInput, monthInput, yearInput ];
        const message = 'Enter a valid date';
        validator.addMethod('date', isValidDate, message, dateFields);
        const validityState = await validator.validate();
        expect(validityState).toEqual(false);
        expect(dateErrorNode.textContent).toEqual(message);
    });

    it('should return false for an impossible date', async () => {
        document.body.innerHTML = `<form class="form">
            <fieldset>
                <legend>
                    <span>Date</span>
                    <span data-valmsg-for="date" id="date-error-message"></span>
                    <span data-valmsg-for="dateDay" id="date-Day-error-message"></span>
                    <span data-valmsg-for="dateMonth" id="date-Month-error-message"></span>
                    <span data-valmsg-for="dateYear" id="date-Year-error-message"></span>
                </legend>
                <div class="flex">
                    <input id="dateDay" name="dateDay" inputmode="numeric" data-val="true" value="31" />
                    <input id="dateMonth" name="dateMonth" inputmode="numeric" data-val="true" value="02" />
                    <input id="dateYear" name="dateYear" inputmode="numeric" data-val="true" value="2000" />
                </div>
            </fieldset>
        </form>`;
        
        const dateErrorNode = document.querySelector('#date-error-message');
        const dayInput = document.querySelector('#dateDay');
        const monthInput = document.querySelector('#dateMonth');
        const yearInput = document.querySelector('#dateYear');
        const [ validator ] = validate('form');

        const dateFields = [ dayInput, monthInput, yearInput ];
        const message = 'Enter a valid date';
        validator.addMethod('date', isValidDate, message, dateFields);

        const invalidDates = [
            ['-1', '1', '2000'],
            ['32', '1', '2000'],
            ['31', '2', '2000'],
            ['29', '2', '2021'],
            ['01', '13', '2021']
        ];

        await Promise.all(invalidDates.map(async testcase => {
            dayInput.value = testcase[0];
            monthInput.value = testcase[1];
            yearInput.value = testcase[2];
            const validityState = await validator.validate();
            expect(validityState).toEqual(false);
            expect(dateErrorNode.textContent).toEqual(message);
        }));
    });

    it('should return true for a valid date', async () => {
        document.body.innerHTML = `<form class="form">
            <fieldset>
                <legend>
                    <span>Date</span>
                    <span data-valmsg-for="date" id="date-error-message"></span>
                    <span data-valmsg-for="dateDay" id="date-Day-error-message"></span>
                    <span data-valmsg-for="dateMonth" id="date-Month-error-message"></span>
                    <span data-valmsg-for="dateYear" id="date-Year-error-message"></span>
                </legend>
                <div class="flex">
                    <input id="dateDay" name="dateDay" inputmode="numeric" data-val="true" value="28" />
                    <input id="dateMonth" name="dateMonth" inputmode="numeric" data-val="true" value="02" />
                    <input id="dateYear" name="dateYear" inputmode="numeric" data-val="true" value="2000" />
                </div>
            </fieldset>
        </form>`;
        
        const dayInput = document.querySelector('#dateDay');
        const monthInput = document.querySelector('#dateMonth');
        const yearInput = document.querySelector('#dateYear');
        const [ validator ] = validate('form');

        const dateFields = [ dayInput, monthInput, yearInput ];
        const message = 'Enter a valid date';
        validator.addMethod('date', isValidDate, message, dateFields);
        const validityState = await validator.validate();
        expect(validityState).toEqual(true);
    });


});

describe('Validate > Integration > Plugins > Date in future', () => {

    it('should add a validation method to a group', async () => {
        expect.assertions(2);
        document.body.innerHTML = `<form class="form">
            <fieldset>
                <legend>
                    <span>Date</span>
                    <span data-valmsg-for="date" id="date-error-message"></span>
                    <span data-valmsg-for="dateDay" id="date-Day-error-message"></span>
                    <span data-valmsg-for="dateMonth" id="date-Month-error-message"></span>
                    <span data-valmsg-for="dateYear" id="date-Year-error-message"></span>
                </legend>
                <div class="flex">
                    <input id="dateDay" name="dateDay" inputmode="numeric" data-val="true" data-val-required="Enter a day" aria-required="true"/>
                    <input id="dateMonth" name="dateMonth" inputmode="numeric" data-val="true" data-val-required="Enter a month" aria-required="true"/>
                    <input id="dateYear" name="dateYear" inputmode="numeric" data-val="true" data-val-required="Enter a year" aria-required="true" />
                </div>
            </fieldset>
        </form>`;
        
        const dateErrorNode = document.querySelector('#date-error-message');
        const dayInput = document.querySelector('#dateDay');
        const dayErrorNode = document.querySelector('#date-Day-error-message');
        const monthInput = document.querySelector('#dateMonth');
        const monthErrorNode = document.querySelector('#date-Month-error-message');
        const yearInput = document.querySelector('#dateYear');
        const yearErrorNode = document.querySelector('#date-Year-error-message');
        const [ validator ] = validate('form');

        expect(validator.getState().groups).toEqual({
            dateDay: {
                serverErrorNode: dayErrorNode,
                validators: [{ type: 'required', message: 'Enter a day' }],
                fields: [dayInput],
                valid: false
            },
            dateMonth: {
                serverErrorNode: monthErrorNode,
                validators: [{ type: 'required', message: 'Enter a month'  }],
                fields: [monthInput],
                valid: false
            },
            dateYear: {
                serverErrorNode: yearErrorNode,
                validators: [{ type: 'required', message: 'Enter a year'  }],
                fields: [yearInput],
                valid: false
            }
        });
        const dateFields = [ dayInput, monthInput, yearInput ];
        const message = 'Enter a date in the future';
        validator.addMethod('date', isDateInFuture, message, dateFields);

        expect(validator.getState().groups).toEqual({
            dateDay: {
                serverErrorNode: dayErrorNode,
                validators: [{ type: 'required', message: 'Enter a day' }],
                fields: [dayInput],
                valid: false
            },
            dateMonth: {
                serverErrorNode: monthErrorNode,
                validators: [{ type: 'required', message: 'Enter a month'  }],
                fields: [monthInput],
                valid: false
            },
            dateYear: {
                serverErrorNode: yearErrorNode,
                validators: [{ type: 'required', message: 'Enter a year'  }],
                fields: [yearInput],
                valid: false
            },
            date: {
                serverErrorNode: dateErrorNode,
                validators: [{ type: 'custom', method: isDateInFuture, message }],
                fields: dateFields,
                valid: false
            }
        });
    });

    it('should return false for a date in the past', async () => {
        document.body.innerHTML = `<form class="form">
            <fieldset>
                <legend>
                    <span>Date</span>
                    <span data-valmsg-for="date" id="date-error-message"></span>
                    <span data-valmsg-for="dateDay" id="date-Day-error-message"></span>
                    <span data-valmsg-for="dateMonth" id="date-Month-error-message"></span>
                    <span data-valmsg-for="dateYear" id="date-Year-error-message"></span>
                </legend>
                <div class="flex">
                    <input id="dateDay" name="dateDay" inputmode="numeric" data-val="true" value="01" />
                    <input id="dateMonth" name="dateMonth" inputmode="numeric" data-val="true" value="02" />
                    <input id="dateYear" name="dateYear" inputmode="numeric" data-val="true" value="2000" />
                </div>
            </fieldset>
        </form>`;
        
        const dateErrorNode = document.querySelector('#date-error-message');
        const dayInput = document.querySelector('#dateDay');
        const monthInput = document.querySelector('#dateMonth');
        const yearInput = document.querySelector('#dateYear');
        const [ validator ] = validate('form');

        const dateFields = [ dayInput, monthInput, yearInput ];
        const message = 'Enter a date in the future';
        validator.addMethod('date', isDateInFuture, message, dateFields);

        const validityState = await validator.validate();
        expect(validityState).toEqual(false);
        expect(dateErrorNode.textContent).toEqual(message);
    });

    it('should return true for a date in the future', async () => {
        const currentDateYear = new Date().getFullYear();

        document.body.innerHTML = `<form class="form">
            <fieldset>
                <legend>
                    <span>Date</span>
                    <span data-valmsg-for="date" id="date-error-message"></span>
                    <span data-valmsg-for="dateDay" id="date-Day-error-message"></span>
                    <span data-valmsg-for="dateMonth" id="date-Month-error-message"></span>
                    <span data-valmsg-for="dateYear" id="date-Year-error-message"></span>
                </legend>
                <div class="flex">
                    <input id="dateDay" name="dateDay" inputmode="numeric" data-val="true" value="28" />
                    <input id="dateMonth" name="dateMonth" inputmode="numeric" data-val="true" value="02" />
                    <input id="dateYear" name="dateYear" inputmode="numeric" data-val="true" value="${currentDateYear+1}" />
                </div>
            </fieldset>
        </form>`;
        
        const dayInput = document.querySelector('#dateDay');
        const monthInput = document.querySelector('#dateMonth');
        const yearInput = document.querySelector('#dateYear');
        const [ validator ] = validate('form');

        const dateFields = [ dayInput, monthInput, yearInput ];
        const message = 'Enter a date in the future';
        validator.addMethod('date', isDateInFuture, message, dateFields);
        const validityState = await validator.validate();
        expect(validityState).toEqual(true);
    });

    it('should return false for todays date', async () => {
        const currentDateYear = new Date().getFullYear();
        const currentDateMonth = new Date().getMonth() + 1;
        const currentDateDay = new Date().getDate();

        document.body.innerHTML = `<form class="form">
            <fieldset>
                <legend>
                    <span>Date</span>
                    <span data-valmsg-for="date" id="date-error-message"></span>
                    <span data-valmsg-for="dateDay" id="date-Day-error-message"></span>
                    <span data-valmsg-for="dateMonth" id="date-Month-error-message"></span>
                    <span data-valmsg-for="dateYear" id="date-Year-error-message"></span>
                </legend>
                <div class="flex">
                    <input id="dateDay" name="dateDay" inputmode="numeric" data-val="true" value="${currentDateDay}" />
                    <input id="dateMonth" name="dateMonth" inputmode="numeric" data-val="true" value="${currentDateMonth}" />
                    <input id="dateYear" name="dateYear" inputmode="numeric" data-val="true" value="${currentDateYear}" />
                </div>
            </fieldset>
        </form>`;
        
        const dayInput = document.querySelector('#dateDay');
        const monthInput = document.querySelector('#dateMonth');
        const yearInput = document.querySelector('#dateYear');
        const [ validator ] = validate('form');

        const dateFields = [ dayInput, monthInput, yearInput ];
        const message = 'Enter a date in the future';
        validator.addMethod('date', isDateInFuture, message, dateFields);
        const validityState = await validator.validate();
        expect(validityState).toEqual(false);
    });

});

describe('Validate > Integration > Plugins > Date in Past', () => {

    it('should add a validation method to a group', async () => {
        expect.assertions(2);
        document.body.innerHTML = `<form class="form">
            <fieldset>
                <legend>
                    <span>Date</span>
                    <span data-valmsg-for="date" id="date-error-message"></span>
                    <span data-valmsg-for="dateDay" id="date-Day-error-message"></span>
                    <span data-valmsg-for="dateMonth" id="date-Month-error-message"></span>
                    <span data-valmsg-for="dateYear" id="date-Year-error-message"></span>
                </legend>
                <div class="flex">
                    <input id="dateDay" name="dateDay" inputmode="numeric" data-val="true" data-val-required="Enter a day" aria-required="true"/>
                    <input id="dateMonth" name="dateMonth" inputmode="numeric" data-val="true" data-val-required="Enter a month" aria-required="true"/>
                    <input id="dateYear" name="dateYear" inputmode="numeric" data-val="true" data-val-required="Enter a year" aria-required="true" />
                </div>
            </fieldset>
        </form>`;
        
        const dateErrorNode = document.querySelector('#date-error-message');
        const dayInput = document.querySelector('#dateDay');
        const dayErrorNode = document.querySelector('#date-Day-error-message');
        const monthInput = document.querySelector('#dateMonth');
        const monthErrorNode = document.querySelector('#date-Month-error-message');
        const yearInput = document.querySelector('#dateYear');
        const yearErrorNode = document.querySelector('#date-Year-error-message');
        const [ validator ] = validate('form');

        expect(validator.getState().groups).toEqual({
            dateDay: {
                serverErrorNode: dayErrorNode,
                validators: [{ type: 'required', message: 'Enter a day' }],
                fields: [dayInput],
                valid: false
            },
            dateMonth: {
                serverErrorNode: monthErrorNode,
                validators: [{ type: 'required', message: 'Enter a month'  }],
                fields: [monthInput],
                valid: false
            },
            dateYear: {
                serverErrorNode: yearErrorNode,
                validators: [{ type: 'required', message: 'Enter a year'  }],
                fields: [yearInput],
                valid: false
            }
        });
        const dateFields = [ dayInput, monthInput, yearInput ];
        const message = 'Enter a date in the past';
        validator.addMethod('date', isDateInPast, message, dateFields);

        expect(validator.getState().groups).toEqual({
            dateDay: {
                serverErrorNode: dayErrorNode,
                validators: [{ type: 'required', message: 'Enter a day' }],
                fields: [dayInput],
                valid: false
            },
            dateMonth: {
                serverErrorNode: monthErrorNode,
                validators: [{ type: 'required', message: 'Enter a month'  }],
                fields: [monthInput],
                valid: false
            },
            dateYear: {
                serverErrorNode: yearErrorNode,
                validators: [{ type: 'required', message: 'Enter a year'  }],
                fields: [yearInput],
                valid: false
            },
            date: {
                serverErrorNode: dateErrorNode,
                validators: [{ type: 'custom', method: isDateInPast, message }],
                fields: dateFields,
                valid: false
            }
        });
    });

    it('should return false for a date in the future', async () => {
        const currentDateYear = new Date().getFullYear();
        document.body.innerHTML = `<form class="form">
            <fieldset>
                <legend>
                    <span>Date</span>
                    <span data-valmsg-for="date" id="date-error-message"></span>
                    <span data-valmsg-for="dateDay" id="date-Day-error-message"></span>
                    <span data-valmsg-for="dateMonth" id="date-Month-error-message"></span>
                    <span data-valmsg-for="dateYear" id="date-Year-error-message"></span>
                </legend>
                <div class="flex">
                    <input id="dateDay" name="dateDay" inputmode="numeric" data-val="true" value="01" />
                    <input id="dateMonth" name="dateMonth" inputmode="numeric" data-val="true" value="02" />
                    <input id="dateYear" name="dateYear" inputmode="numeric" data-val="true" value="${currentDateYear+1}" />
                </div>
            </fieldset>
        </form>`;
        
        const dateErrorNode = document.querySelector('#date-error-message');
        const dayInput = document.querySelector('#dateDay');
        const monthInput = document.querySelector('#dateMonth');
        const yearInput = document.querySelector('#dateYear');
        const [ validator ] = validate('form');

        const dateFields = [ dayInput, monthInput, yearInput ];
        const message = 'Enter a date in the past';
        validator.addMethod('date', isDateInPast, message, dateFields);

        const validityState = await validator.validate();
        expect(validityState).toEqual(false);
        expect(dateErrorNode.textContent).toEqual(message);
    });

    it('should return true for a date in the past', async () => {
        document.body.innerHTML = `<form class="form">
            <fieldset>
                <legend>
                    <span>Date</span>
                    <span data-valmsg-for="date" id="date-error-message"></span>
                    <span data-valmsg-for="dateDay" id="date-Day-error-message"></span>
                    <span data-valmsg-for="dateMonth" id="date-Month-error-message"></span>
                    <span data-valmsg-for="dateYear" id="date-Year-error-message"></span>
                </legend>
                <div class="flex">
                    <input id="dateDay" name="dateDay" inputmode="numeric" data-val="true" value="28" />
                    <input id="dateMonth" name="dateMonth" inputmode="numeric" data-val="true" value="02" />
                    <input id="dateYear" name="dateYear" inputmode="numeric" data-val="true" value="2000" />
                </div>
            </fieldset>
        </form>`;
        
        const dayInput = document.querySelector('#dateDay');
        const monthInput = document.querySelector('#dateMonth');
        const yearInput = document.querySelector('#dateYear');
        const [ validator ] = validate('form');

        const dateFields = [ dayInput, monthInput, yearInput ];
        const message = 'Enter a date in the past';
        validator.addMethod('date', isDateInPast, message, dateFields);
        const validityState = await validator.validate();
        expect(validityState).toEqual(true);
    });

    it('should return true for todays date', async () => {
        const currentDateYear = new Date().getFullYear();
        const currentDateMonth = new Date().getMonth() + 1;
        const currentDateDay = new Date().getDate();

        document.body.innerHTML = `<form class="form">
            <fieldset>
                <legend>
                    <span>Date</span>
                    <span data-valmsg-for="date" id="date-error-message"></span>
                    <span data-valmsg-for="dateDay" id="date-Day-error-message"></span>
                    <span data-valmsg-for="dateMonth" id="date-Month-error-message"></span>
                    <span data-valmsg-for="dateYear" id="date-Year-error-message"></span>
                </legend>
                <div class="flex">
                    <input id="dateDay" name="dateDay" inputmode="numeric" data-val="true" value="${currentDateDay}" />
                    <input id="dateMonth" name="dateMonth" inputmode="numeric" data-val="true" value="${currentDateMonth}" />
                    <input id="dateYear" name="dateYear" inputmode="numeric" data-val="true" value="${currentDateYear}" />
                </div>
            </fieldset>
        </form>`;
        
        const dayInput = document.querySelector('#dateDay');
        const monthInput = document.querySelector('#dateMonth');
        const yearInput = document.querySelector('#dateYear');
        const [ validator ] = validate('form');

        const dateFields = [ dayInput, monthInput, yearInput ];
        const message = 'Enter a date in the past';
        validator.addMethod('date', isDateInPast, message, dateFields);
        const validityState = await validator.validate();
        expect(validityState).toEqual(true);
    });


});