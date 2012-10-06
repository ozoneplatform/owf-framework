Ext.define('Ozone.components.focusable.CircularFocus', {

    //convience function that calls preventDefault
    //and focuses another el
    focusAndPrevent: function(evt, el) {
        evt.preventDefault();
        el.focus();
    },

    //resets focus to the firstEl when it goes beyond last el, and
    //vice-versa.  beforeLoop is an optional function to execute before
    //moving focus from the lastEl to the firstEl.  Similarly, beforeBackLoop
    //is executed when going the other way
    setupFocus: function(firstEl, lastEl, beforeLoop, beforeBackLoop) {
        var me = this;

        if(!firstEl) {
            firstEl = me.getEl();
        }

        if(!lastEl) {
            lastEl = me.getEl();
        }
        
        //function to move focus to lastEl when we shift-tab off of the
        //comoponents main el
        function backLoopFromParent(evt) {
            if(evt.keyCode === Ext.EventObject.TAB && evt.shiftKey === true 
                && document.activeElement === me.getEl().dom) {
                if (beforeBackLoop) beforeBackLoop();
                me.focusAndPrevent(evt, lastEl);
            }
        }

        //function to handle shit-tab from firstEl
        function backLoop(evt) {
            if(evt.keyCode === Ext.EventObject.TAB && evt.shiftKey === true) {
                if (beforeBackLoop) beforeBackLoop();
                me.focusAndPrevent(evt, lastEl);
            }
        }

        //function to handle tab from lastEl
        function loop(evt) {
            if(evt.keyCode === Ext.EventObject.TAB && evt.shiftKey === false) {
                if (beforeLoop) beforeLoop();
                me.focusAndPrevent(evt, firstEl);
            }
        }

        //monitor both keydown and keypress since FF 3.6 only fires
        //keypress on successive elements when you hold down tab
        me.mon(me.getFocusEl(), {
            keydown: backLoopFromParent,
            keypress: backLoopFromParent
        });

        me.mon(firstEl, {
            keydown: backLoop,
            keypress: backLoop
        });
        
        me.mon(lastEl, {
            keydown: loop,
            keypress: loop
        });


        //remove the handlers install by setupFocus
        me.tearDownCircularFocus = function() {
            me.mun(me.getFocusEl(), {
                keydown: backLoopFromParent,
                keypress: backLoopFromParent
            });

            me.mun(firstEl, {
                keydown: backLoop,
                keypress: backLoop
            });
            
            me.mun(lastEl, {
                keydown: loop,
                keypress: loop
            });
        };
    },

    tearDownCircularFocus: Ext.emptyFn

});
