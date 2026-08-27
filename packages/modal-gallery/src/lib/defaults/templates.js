/* node:coverage disable */
import { sanitize, escapeAttr } from '../utils.js';

export const overlay = () => {
    const overlay = document.createElement('div');

    overlay.className = 'modal-gallery__outer js-modal-gallery__outer';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Image gallery');
    overlay.setAttribute('tabindex', '-1');
    overlay.setAttribute('aria-hidden', true);

    return overlay;
};

export const overlayInner = (buttons, items) =>  `<div class="modal-gallery__inner js-modal-gallery__inner" role="group" aria-roledescription="carousel">
                                    <div class="modal-gallery__content js-modal-gallery__content">
                                        ${items}
                                    </div>
                                </div>
                                ${buttons}
                                <button class="js-modal-gallery__close modal-gallery__close" aria-label="Close">
                                    <svg focusable="false" aria-hidden="true" width="30" height="30" stroke="#fff">
                                        <g stroke-width="4">
                                            <line x1="5" y1="5" x2="25" y2="25"/>
                                            <line x1="5" y1="25" x2="25" y2="5"/>
                                        </g>
                                    </svg>
                                </button>
                                <div class="modal-gallery__total js-gallery-totals" aria-hidden="true"></div>
                                <div class="js-modal-gallery__status" role="status" aria-live="polite" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0"></div>`;

export const buttons = () => `<button class="js-modal-gallery__previous modal-gallery__previous" aria-label="Previous">
    <svg focusable="false" aria-hidden="true" width="44" height="60" stroke="#fff">
        <polyline points="30 10 10 30 30 50" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>
    </svg>
    </button>
    <button class="js-modal-gallery__next modal-gallery__next" aria-label="Next">
    <svg focusable="false" aria-hidden="true" width="44" height="60" stroke="#fff">
        <polyline points="14 10 34 30 14 50" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>
    </svg>
</button>`;

export const item = items => (details, i) => `<div class="modal-gallery__item js-modal-gallery__item" role="group" aria-roledescription="slide" aria-label="Image ${i + 1} of ${items.length}${items[i].title ? `, ${escapeAttr(items[i].title)}` : ''}">
                                    <div class="modal-gallery__img-container js-modal-gallery__img-container"></div>
                                    ${details}
                                </div>`;

export const details = (item, headingLevel = 'h2') => {
    const tag = /^h[1-6]$/.test(headingLevel) ? headingLevel : 'h2';
    return item.title || item.description
        ? `<div class="modal-gallery__details">
                                    ${item.title ? `<${tag} class="modal-gallery__title">${sanitize(item.title)}</${tag}>` : ``}
                                    ${item.description ? `<div class="modal-gallery__description">${sanitize(item.description)}</div>` : ``}
                                </div>`
        : '';
};