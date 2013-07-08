;(function () {
    
    Ozone.components.appcomponents = Ozone.components.appcomponents || {};

    

    Ozone.components.appcomponents.AppComponentsMenu = Backbone.View.extend({

        className: 'appcomponents-menu',

        tpl: '<div class="widget">' +
            '<div class="thumb-wrap" data-id="<%= id %>">' +
                '<img onerror="this.src = \'themes/common/images/settings/WidgetsIcon.png\'" src="<%= image %>" class="thumb" />' +
            '</div>' +
            '<div class="thumb-text"><%= namespace %></div>' + 
        '</div>',

        initialize: function () {
            console.log('initialize');
        },

        render: function () {
            var tpl = this.tpl,
                widgetsHtml = this.options.collection.map(function(widget) {
                    return _.template(tpl, widget.attributes);
                }).join('');

            this.$el.html('<div class="header"><span>App Components</span><input type="text" class="search-input"></div><div class="body">' + widgetsHtml + '<div>');
            return this;
        },

        toggle: function () {
            this.$el.is(':visible') ? this.hide() : this.show();
        },

        shown: function () {
            this.$el.find('.body').bxSlider({
                oneItemPerSlide: false
            });
            return this;
        },

        show: function () {
            this.$el.show();
            return this;
        },

        hide: function () {
            this.$el.hide();
        },

        remove: function () {
            console.log('remove');
        }

    });

})();