/* istanbul ignore file */
import { sanitize } from '../utils';

export const container = items => {
    const container = document.createElement('div');
    container.className = 'gallery__container';

    container.insertAdjacentHTML('beforeend', `${header(items)}${main(items)}${footer()}`);

    return container;
};

export const header = (items, settings) => `<div class="gallery__header">
    <div class="gallery__totals"></div>
    ${settings.fullscreen && <button class="gallery__fullscreen" aria-label="Full screen">
        <svg class="gallery__fullscreen-icon" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0z" fill="none"/><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>
    </button>}
</div>`;

export const main = items => `<div class="gallery__main"></div>`;

export const footer = items => `<div class="gallery__footer"></div>`;

// export const details = item => item.title || item.description
//     ? `<div class="modal-gallery__details">
//                                     ${item.title ? `<h1 class="modal-gallery__title">${sanitize(item.title)}</h1>` : ``}
//                                     ${item.description ? `<div class="modal-gallery__description">${sanitize(item.description)}</div>` : ``}
//                                 </div>`
//     : '';