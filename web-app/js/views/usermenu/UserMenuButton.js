;(function (Backbone, _, $, Ozone, Handlebars) {

    var html = Handlebars.compile('<button class="btn btn-small" data-toggle="dropdown">{{displayName}}<i class="icon-chevron-sign-down"></i></button>' +
                                   '<ul class="dropdown-menu" role="menu">' +
                                   '</ul>');

    var Superclass = Ozone.views.BaseView;

    var UserMenuButton = Superclass.extend({

        className: 'user-menu dropdown',

        events: {
            'click .btn': 'resetCollapse'
        },

        menu: null,
        childEls: null,
        displayName: '',

        initialize: function (options) {
            Superclass.prototype.initialize.apply(this, arguments);

            this.childEls = $(html(this));
            this.displayName = options.displayName;
            this.menu = new Ozone.views.usermenu.UserMenu({
                el: this.childEls.filter('.dropdown-menu'),
                collection: options.menuCollection,
                activeGroupIndex: options.activeGroupIndex
            });
        },

        render: function () {
            this.$el.append(this.childEls);
            this.menu.render();

            return this;
        },

        resetCollapse: function () {
            this.menu.resetCollapse();
        }
    });

    $.extend(true, Ozone, { views: { usermenu: { UserMenuButton: UserMenuButton }}});

})(window.Backbone, window._, window.$, window.Ozone, window.Handlebars);