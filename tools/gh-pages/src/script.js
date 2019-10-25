module.exports = `(function(iframe, buttons, activeClass){
    var TRIGGER_KEYCODES = [13, 32];
    ['ontouchstart' in window ? 'touchstart' : 'click', 'keydown' ].forEach(function(ev){
        buttons.forEach(function(button){
            button.addEventListener(ev, function(e){
                if(!!e.keyCode && !~TRIGGER_KEYCODES.indexOf(e.keyCode)) return;
                iframe.src = button.getAttribute('data-url');
                document.querySelector('.'+activeClass).classList.remove(activeClass);
                button.classList.add(activeClass);
            })

        });
    });
})(document.querySelector('.iframe'), [].slice.call(document.querySelectorAll('.button')), 'is--active')`;