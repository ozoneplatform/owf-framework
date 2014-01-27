;(function(_, Ozone) {
    'use strict';

    /**
     * A view that is contained within a Bootstrap popover. Views that use this mixin are expected
     * to have a popoverCOnfig attribute that provies the configuration values for the popover
     */
     Ozone.views.PopoverViewMixin = {
        /**
         * Views that use this mixin are expected to implement innerRender so that
         * this render function can work.  This function requires the parent element so
         * that the popover plugin can be invoked on it.  If the parent class render needs
         * to be called, call it in innerRender
         */
        render: function(parentEl) {
            this.innerRender();

            this.parentEl = parentEl;

            return this;
        },

        /**
         * Set up the popover on show, not render.  This allows multiple PopoverViews
         * to be attached to the same parent, as long as only one is open at a time
         */
        show: function() {
            this.parentEl.popover(_.extend({
                html: true,
                content: this.el,
                show: true,
                trigger: 'manual'
            }, this.popoverConfig)).popover('show');

            this.$el.trigger('show');
            return this;
        },

        hide: function() {
            this.parentEl.popover('destroy');

            this.$el.trigger('hide');
            return this;
        }
    };
})(window._, window.Ozone);
