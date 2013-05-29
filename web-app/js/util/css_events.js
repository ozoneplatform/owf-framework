;(function (window, Modernizr) {
    
    var transEndEventNames = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd otransitionend',
            'msTransition': 'MSTransitionEnd',
            'transition': 'transitionend'
        },
        transitionEnd = transEndEventNames[Modernizr.prefixed('transition')],
        animationEndEventNames = {
            'WebkitAnimation': 'webkitAnimationEnd',
            'MozAnimation': 'animationend',
            'OAnimation': 'oAnimationEnd oanimationend',
            'msAnimation': 'MSAnimationEnd',
            'animation': 'animationend'
        },
        animationEnd = animationEndEventNames[Modernizr.prefixed('animation')];


    window.CSS = {
        Transition: {
            TRANSITION_END: transitionEnd
        },
        Animation: {
            ANIMATION_END: animationEnd
        }
    };

})(window, Modernizr);