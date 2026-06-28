/*
 * Shared happy-dom environment for the node:test unit layer.
 *
 * GlobalRegistrator registers happy-dom's DOM globals (window, document,
 * HTMLElement, Event, CustomEvent, …) into the Node global scope. It's loaded
 * once per test-file process via `node --test --import`, giving each file a
 * fresh DOM — the same per-file isolation Jest's environment provided. Because
 * happy-dom's own Event/CustomEvent become the globals, events dispatch on
 * happy-dom nodes without the cross-realm issue Node's native classes cause.
 *
 * Note: components that rely on IntersectionObserver/ResizeObserver stub those
 * per test where needed (see scroll-points / scroll-spy).
 */
import { GlobalRegistrator } from '@happy-dom/global-registrator';

GlobalRegistrator.register({ url: 'http://localhost/' });
