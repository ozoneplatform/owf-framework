;(function () {
    
    Ozone.components.appcomponents = Ozone.components.appcomponents || {};

    var ItemViem = Backbone.View.extend({
        
        className: 'widget',

        tpl: '<div class="thumb-wrap" data-id="<%= id %>">' +
                '<img onerror="this.src = \'themes/common/images/settings/WidgetsIcon.png\'" src="<%= image %>" class="thumb" />' +
            '</div>' +
            '<div class="thumb-text"><%= namespace %></div>',

        attributes: function () {
            return {
                tabindex: 0
            };
        },

        initialize: function () {
            Backbone.View.prototype.initialize.apply(this, arguments);
            this.model = this.options.model;
        },

        render: function () {
            this.$el.append(_.template(this.tpl, this.model.attributes));
            return this;
        }

    });

    Ozone.components.appcomponents.AppComponentsMenu = Backbone.View.extend({

        className: 'appcomponents-menu',

        searchQuery: '',

        initialize: function () {
            _.bindAll(this, 'addOne', 'reloadSlider');
            $(window).on('resize', this.reloadSlider);
        },

        events: {
            'keyup .search-input': '_inputKeyUp',
            'click .x-tool': 'toggle'
        },

        render: function () {
            this.$el.html(  '<div class="header">' +
                                '<a class="x-tool">' +
                                    '<img src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" class="x-tool-close">' +
                                '</a>' +
                                '<input type="text" class="search-input">' +
                                '<span>App Components</span>'+
                            '</div>' + 
                            '<div class="body"></div>');
            this.$body = this.$el.find('.body');

            this.addAll();
            return this;
        },

        addAll: function () {
            _.invoke(this.views, 'remove');
            this.views = [];
            this.options.collection.each(this.addOne);
            return this;
        },

        addOne: function (model, index) {
            if(model.get('namespace').indexOf(this.searchQuery) < 0 || model.get('widgetTypes')[0].name !== 'standard') {
                return;
            }

            var view = new ItemViem({
                model: model
            });
            this.views.push(view);

            this.$body.append(view.render().$el);
        },

        filter: function (query) {
            this.searchQuery = query;

            this._destroyCarousel()
                .addAll()
                ._initCarousel();
        },

        _inputKeyUp: _.debounce(function (evt) {
            this.filter($(evt.target).val());
        }, 500),

        reloadSlider: _.debounce(function (evt) {
            this.carousel && this.carousel.reloadSlider();
                console.log(this.carousel.getSlides());
        }, 1000),

        toggle: function () {
            this.$el.is(':visible') ? this.hide() : this.show();
        },

        shown: function () {
            this._initCarousel();
            return this;
        },

        show: function () {
            this.$el.show();
            return this;
        },

        hide: function () {
            this.$el.hide();
            return this;
        },

        remove: function () {
            _.invoke(this.views, 'remove');
            delete this.views;

            this._destroyCarousel();
            $(window).off('resize', this.reloadSlider);

            return Backbone.View.prototype.remove.call(this);
        },

        _initCarousel: function () {
            if(this.views.length) {
                this.carousel = this.$body.bxSlider({
                    oneItemPerSlide: false,
                    infiniteLoop: true,
                    touchEnabled: false
                });
            }
            return this;
        },

        _destroyCarousel: function () {
            this.carousel && this.carousel.destroySlider();
            return this;
        }

    });

})();