import Boilerplate from '../../../src';
    
window.addEventListener('DOMContentLoaded', () => {
    console.log('test');
    const t1 = Boilerplate.init('.js-boilerplate');
    const t2 = Boilerplate.init('.js-boilerplate__2', {
        callback(){
            console.log(this);
        }
    });
    console.log(t1, t2);
});