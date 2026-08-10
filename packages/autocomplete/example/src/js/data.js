// Sample data for the example app. In a real app this would come from your own
// source — an API, a server-rendered payload, or a static list. Every option is
// a { value, label } pair: `value` is what the form submits, `label` is what the
// user sees.

// Local list used by the synchronous and simulated-async examples. Here value
// and label are identical, the common case for a plain list of words.
export const fruits = [
    { value: 'Apple', label: 'Apple' },
    { value: 'Banana', label: 'Banana' },
    { value: 'Cherry', label: 'Cherry' },
    { value: 'Potato', label: 'Potato' },
    { value: 'Sweet potato', label: 'Sweet potato' }
];

// Used by the prefilled examples: `value` is an ISO code (submitted) while
// `label` is the display name (shown) — the case where the two deliberately
// differ, so displayTemplate is needed to render the label.
export const countries = [
    { value: 'GB', label: 'United Kingdom' },
    { value: 'FR', label: 'France' },
    { value: 'DE', label: 'Germany' },
    { value: 'ES', label: 'Spain' }
];
