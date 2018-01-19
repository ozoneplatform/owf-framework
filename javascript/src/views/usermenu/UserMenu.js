;(function (Backbone, _, $, Ozone) {
    var Superclass = Ozone.views.BaseView;

    var dividerHtml = '<li role="presentation" class="divider"></li>',
        logoutHtml = '<li class="logout-link">Sign Out</li>';

    var UserMenu = Superclass.extend({
        menuGroupViews: [],

        events: {
            'click .logout-link': 'logoutHandler'
        },

        initialize: function (options) {
            Superclass.prototype.initialize.apply(this, arguments);
            this.activeGroupIndex = options.activeGroupIndex;
            this.listenTo(this.collection, 'reset', this.renderGroups);
        },

        render: function () {
            return this;
        },

        renderGroups: function () {
            var me = this;
            this.$el.empty();

            while(this.menuGroupViews.length > 0) {
                var view = this.menuGroupViews.shift();
                view.remove();
            }

            _.each(this.collection.models, function(group, index, list) {
                var view = new Ozone.views.usermenu.UserMenuGroup({ model: group });
                me.$el.append(view.render().el);
                me.$el.append(dividerHtml);
                me.menuGroupViews.push(view);
            });

            this.$el.append(logoutHtml);
        },

        logoutHandler: function () {
            window.location.href = Ozone.util.contextPath() + Ozone.config.logoutURL;
        },

        resetCollapse: function () {
            var activeIndex = this.activeGroupIndex();

            this.menuGroupViews[activeIndex].setCollapse(false);

            _.each(this.menuGroupViews, function (view, index) {
                if(index !== activeIndex) {
                    view.setCollapse(true);
                }
            })
        }
    });

    $.extend(true, Ozone, { views: { usermenu: { UserMenu: UserMenu }}});

})(window.Backbone, window._, window.$, window.Ozone);