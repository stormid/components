import { FOCUSABLE_ELEMENTS } from './constants';

export const sanitize = item => item.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const getFocusableChildren = node => [].slice.call(node.querySelectorAll(FOCUSABLE_ELEMENTS.join(',')));

