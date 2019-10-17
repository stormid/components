/* istanbul ignore file */
import { sanitize } from '../utils';

export const overlay = () => {
    const overlay = document.createElement('div');

    overlay.className = 'modal-gallery__outer js-modal-gallery__outer';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('tabindex', '-1');
    overlay.setAttribute('aria-hidden', true);

    return overlay;
};

export const overlayInner = (buttons, items) =>  `<div class="modal-gallery__inner js-modal-gallery__inner">
                                    <div class="modal-gallery__content js-modal-gallery__content">
                                        ${items}
                                    </div>
                                </div>
                                ${buttons}
                                <button class="js-modal-gallery__close modal-gallery__close" aria-label="Close">
                                    <svg focusable="false" width="30" height="30" stroke="#fff">
                                        <g stroke-width="4">
                                            <line x1="5" y1="5" x2="25" y2="25"/>
                                            <line x1="5" y1="25" x2="25" y2="5"/>
                                        </g>
                                    </svg>
                                </button>
                                <div class="modal-gallery__total js-gallery-totals"></div>`;

export const buttons = () => `<button class="js-modal-gallery__next modal-gallery__next" aria-label="Next">
    <svg focusable="false" width="44" height="60" stroke="#fff">
        <polyline points="14 10 34 30 14 50" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>
    </svg>
    </button>
    <button class="js-modal-gallery__previous modal-gallery__previous" aria-label="Previous">
    <svg focusable="false" width="44" height="60" stroke="#fff">
        <polyline points="30 10 10 30 30 50" stroke-width="4" stroke-linecap="butt" fill="none" stroke-linejoin="round"/>
    </svg>
</button>`;

export const item = details => `<div class="modal-gallery__item js-modal-gallery__item">
                                    <div class="modal-gallery__img-container js-modal-gallery__img-container"></div>
                                    ${details}
                                </div>`;

export const details = item => item.title || item.description 
                                ? `<div class="modal-gallery__details">
                                    ${item.title ? `<h1 class="modal-gallery__title">${sanitize(item.title)}</h1>` : ``}
                                    ${item.description ? `<div class="modal-gallery__description">${sanitize(item.description)}</div>` : ``}
                                </div>`
                                : '';