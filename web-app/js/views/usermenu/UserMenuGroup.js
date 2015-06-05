;(function () {

    var SuperClass = Ozone.views.BaseView;

    var groupTemplate = Handlebars.compile('<ul class="user-menu-group">' +
                                             '<li class="group-header">{{groupName}}<i class="collapse-toggle"></i></li>' +
                                             '{{#each items}}' +
                                             '<li class="user-menu-item {{itemClass}}">{{itemText}}</li>' +
                                             '{{/each}}' +
                                           '</ul>');

    var UserMenuGroup = SuperClass.extend({
        tagName: 'li',

        events: {
            'click .user-menu-item': 'handleItemClick',
            'click .group-header': 'toggleCollapse'
        },

        initialize: function () {
            SuperClass.prototype.initialize.apply(this, arguments);
        },

        render: function () {
            this.$el.append(groupTemplate(this.model.attributes));
            return this;
        },

        handleItemClick: function (evt) {
            var itemText = $(evt.target).html(),
                items = this.model.get('items');

            //This assumes that the itemText is unique within a group
            var item = _.find(items, function (item) {
                return item.itemText === itemText;
            });

            item && item.handler();
        },

        toggleCollapse: function (evt) {
            evt && evt.stopPropagation();
            this.$('.user-menu-group').toggleClass('collapsed');
        },

        setCollapse: function (toggle) {
            this.$('.user-menu-group').toggleClass('collapsed', toggle);
        }
    });

    $.extend(true, Ozone, { views: { usermenu: { UserMenuGroup: UserMenuGroup }}});

})(window.Backbone, window._, window.$, window.Ozone, window.Handlebars);
