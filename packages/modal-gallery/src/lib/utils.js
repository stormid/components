import { FOCUSABLE_ELEMENTS } from './constants.js';

export const sanitize = item => item.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/*
 * Escapes a value for safe interpolation into a double- or single-quoted HTML attribute.
 * Extends sanitize (which only covers element-text sinks) with quote escaping, and coerces
 * to a string so non-string values (e.g. a null href) don't throw.
 *
 * Scope: this prevents attribute breakout only. It deliberately does NOT strip dangerous URL
 * schemes (javascript:, data:) because data: URIs are legitimate image sources - it is safe for
 * the non-executing `<img src/srcset>` sinks it feeds today. Do not reuse it for an `href`/`src`
 * on a navigable element (a/iframe/form action) without adding scheme validation there.
 */
export const escapeAttr = item => sanitize(`${item}`).replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export const getFocusableChildren = node => Array.from(node.querySelectorAll(FOCUSABLE_ELEMENTS.join(',')));

