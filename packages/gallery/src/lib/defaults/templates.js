/* istanbul ignore file */
import { sanitize } from '../utils';

export const ui = () => {
    const container = document.createElement('div');
    container.className = 'gallery__container';

    // container.insertAdjacentHTML('beforeend', );

    return container;
};

// export const details = item => item.title || item.description
//     ? `<div class="modal-gallery__details">
//                                     ${item.title ? `<h1 class="modal-gallery__title">${sanitize(item.title)}</h1>` : ``}
//                                     ${item.description ? `<div class="modal-gallery__description">${sanitize(item.description)}</div>` : ``}
//                                 </div>`
//     : '';