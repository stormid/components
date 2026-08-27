import { FOCUSABLE_ELEMENTS } from './constants.js';

export const sanitize = item => item.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/*
 * Escapes a value for safe interpolation into a double- or single-quoted HTML attribute.
 * Extends sanitize (which only covers element-text sinks) with quote escaping, and coerces
 * to a string so non-string values (e.g. a null href) don't throw.
 */
export const escapeAttr = item => sanitize(`${item}`).replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export const getFocusableChildren = node => Array.from(node.querySelectorAll(FOCUSABLE_ELEMENTS.join(',')));

