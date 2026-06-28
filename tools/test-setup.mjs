/*
 * Shared jsdom environment for the node:test unit layer.
 *
 * The Node test runner runs each test file in its own child process, so this
 * module is loaded once per file (via `node --test --import`) and gives that
 * process a fresh DOM — the same per-file isolation Jest's jsdom environment
 * provided.
 */
import { JSDOM } from 'jsdom';

const { window } = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost/',
    pretendToBeVisual: true
});

globalThis.window = window;
globalThis.document = window.document;

/*
 * jsdom's DOM realm must win over Node's native implementations for these.
 * Node 22 ships its own global Event/CustomEvent/EventTarget/…; an event built
 * with Node's CustomEvent can't be dispatched on a jsdom node ("parameter 1 is
 * not of type 'Event'"), so force jsdom's versions for the overlapping set.
 */
const FORCE_FROM_JSDOM = ['Event', 'CustomEvent', 'EventTarget', 'MessageEvent', 'DOMException'];
for (const key of FORCE_FROM_JSDOM) {
    if (key in window) globalThis[key] = window[key];
}

/*
 * Expose every other jsdom global Node doesn't already define (HTMLElement,
 * NodeList, MutationObserver, XMLHttpRequest, location, getComputedStyle, …).
 * The `key in globalThis` guard means we never clobber a Node built-in — the
 * timers, console, or read-only `navigator` — so the bare-global references
 * components make (`new MutationObserver`, `location`, `instanceof HTMLElement`)
 * resolve as they would in a browser.
 *
 * Note: jsdom does NOT implement IntersectionObserver / ResizeObserver, so
 * components that use them still mock those per test.
 */
for (const key of Object.getOwnPropertyNames(window)) {
    if (key in globalThis) continue;
    try {
        globalThis[key] = window[key];
    } catch {
        /* skip non-assignable globals */
    }
}
