//mock data for the remote-search example's /api/countries endpoint (served by
//the dev server in rspack.config.js). Note the { code, name } shape: the
//example's search() has to map it to the { value, label } the component expects.
module.exports = [
    { code: 'GB', name: 'United Kingdom' },
    { code: 'US', name: 'United States' },
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
    { code: 'ES', name: 'Spain' },
    { code: 'IT', name: 'Italy' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'IE', name: 'Ireland' },
    { code: 'IS', name: 'Iceland' },
    { code: 'FI', name: 'Finland' },
    { code: 'PL', name: 'Poland' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'NZ', name: 'New Zealand' }
];
