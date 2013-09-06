define([
    './Description',
    './StoreView',
    '../collections/Stores',
    'jquery',
    'pnotify',
    'underscore',
    'backbone'
], function(ApplicationConfigurationDescriptionView,
    StoreView,
    Stores,
    $,
    pnotify,
    _,
    Backbone) {

    return Backbone.View.extend({

        id: 'applicationConfigurationStores',
        className: 'app_config_list_view_panel',

        storeViews: null,
        model: null,
        descriptionView: null,
        button: null,

        btnTpl: '<div id="app-config-add-store-container">' + '<a href="#" target="_blank" id="app-config-add-store">Add Store</a>' + '</div>',

        events: {
            'click #app-config-add-store': 'addBtnClicked',
            'click .app-config-store-view .edit': 'editBtnClicked',
            'click .app-config-store-view .delete': 'deleteBtnClicked'
        },

        initialize: function() {
            this.storeViews = {};

            _.bindAll(this, "renderItem");

            this.buildModel();
            this.buildCollection();
            this.loadAndRenderStores();
        },

        buildModel: function() {
            this.model = new Backbone.Model({
                title: 'Stores',
                description: 'The icon and name for connected Stores is displayed here.'
            });
        },

        buildCollection: function() {
            this.collection = new Stores([], {
                parse: true
            });
        },

        loadAndRenderStores: function() {
            this.collection.fetch({
                data: $.param({
                    widgetTypes: 'store'
                })
            }).done(_.bind(this.render, this));
        },

        render: function() {
            this.descriptionView = new ApplicationConfigurationDescriptionView({
                model: this.model
            });

            this.descriptionView.render();
            this.$el.append(this.descriptionView.el);

            this.collection.each(this.renderItem);

            this.$el.append(this.btnTpl);
        },

        renderItem: function(model) {
            var storeView = new StoreView({
                model: model
            });

            this.$el.append(storeView.render().el);
            this.storeViews[model.get('widgetGuid')] = storeView;
        },

        addBtnClicked: function(e) {
            var me = this;
            e.preventDefault();

            Ext.widget('storewizard', {
                id: 'storeWizard',
                saveCallback: function() {
                    setTimeout(_.bind(me.refresh, me), 500);
                }
            }).show().center();
        },

        editBtnClicked: function(e) {
            e.preventDefault();

            Ext.widget('storewizard', {
                id: 'storeWizard',
                editing: true,
                existingStoreId: ($(e.currentTarget).parent().data('store-id')),
                saveCallback: _.bind(function() {
                    setTimeout(_.bind(this.refresh, this), 500);
                }, this)
            }).show().center();
        },

        deleteBtnClicked: function(e) {
            e.preventDefault();

            var me = this,
                storeId = $(e.currentTarget).parent().data('store-id');

            $.ajax({
                url: Ozone.util.contextPath() + '/prefs/widgetDefinition',
                type: 'POST',
                dataType: 'json',
                data: {
                    _method: 'DELETE',
                    id: storeId
                }
            })
            .done(function(resp) {
                $.pnotify({
                    title: 'Store Removed',
                    text: me.collection.get(storeId).get('name') + ' was removed from OWF.',
                    type: 'success',
                    addclass: "stack-bottomright",
                    stack: {
                        "dir1": "up",
                        "dir2": "left",
                        "firstpos1": 25,
                        "firstpos2": 25
                    },
                    history: false,
                    sticker: false,
                    icon: false
                });
                me.removeStore(storeId);
            });
        },

        removeStore: function(storeId) {
            this.storeViews[storeId].remove();
            this.collection.remove(this.collection.get(storeId), {
                silent: true
            });
        },

        refresh: function() {
            this.$el.empty();
            this.loadAndRenderStores();
        },

        remove: function() {
            _.invoke(_.values(this.storeViews), 'remove');
            delete this.storeViews;
            delete this.descriptionView;

            Backbone.View.prototype.remove.call(this);
        }
    });
});