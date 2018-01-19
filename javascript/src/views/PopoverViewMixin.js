;(function(_, Ozone) {
    'use strict';

    /**
     * A view that is contained within a Bootstrap popover. Views that use this mixin are expected
     * to have a popoverCOnfig attribute that provies the configuration values for the popover
     */
     Ozone.views.PopoverViewMixin = {
         /**
          * options:
          *     parentEl (required) The parent element for the popover to attach to
          *     preventClickOnClose (optional) If true, clicks on the popover will
          *     not automatically cause to to close like they normally would
          */
        initialize: function(options) {
            this.parentEl = options.parentEl;

            //optionally prevent clicks from automatically
            //closing the popover
            if (options.preventClickClose) {
                //add the delegateEvents to the event name so that it automatically
                //get cleaned up by the view when it is removed
                this.$el.on('click.delegateEvents' + this.cid, function(e) {
                    e.stopPropagation();
                });
            }
        },

        render: function() {
            this.parentEl.popover(_.extend({
                html: true,
                content: this.el,
                show: true,
                trigger: 'manual'
            }, this.popoverConfig));
        },

        /**
         * Set up the popover on show, not render.  This allows multiple PopoverViews
         * to be attached to the same parent, as long as only one is open at a time
         */
        show: function() {
            if (!this.isVisible()) {
                this.parentEl.popover('show');
                this.$el.trigger('show');

                //have to re-attach event handlers that get lost when show is performed
                this.delegateEvents();
            }

            return this;
        },

        hide: function() {
            //popover show/hide causes event handlers to get lost, so we might
            //as well clean them up properly to avoid memory leaks
            this.undelegateEvents();

            this.parentEl.popover('hide');
            this.$el.trigger('hide');
            return this;
        }
    };
})(window._, window.Ozone);
