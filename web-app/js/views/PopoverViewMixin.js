;(function(_, Ozone) {

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

            parentEl.popover(_.extend({
                content: this.$el
            }, this.popoverConfig));

            return this;
        }
    };
})(_, Ozone);
