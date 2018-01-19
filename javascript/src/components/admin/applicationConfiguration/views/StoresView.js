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

        btnTpl: '<div id="app-config-add-store-container">' +
                    '<a href="#" target="_blank" id="app-config-add-store">Add Store</a>' +
                '</div>',

        events: {
            'click #app-config-add-store': 'addBtnClicked',
            'click .app-config-store-view .edit': 'editBtnClicked',
            'click .app-config-store-view .delete': 'deleteBtnClicked',
            'mouseover .app-config-store-view': 'onStoreViewMouseover',
            'mouseout .app-config-store-view': 'onStoreViewMouseout'
        },

        initialize: function() {
            this.storeViews = {};

            _.bindAll(this, 'renderItem', 'render');

            this._buildModel();
            this._buildCollection();
            this.loadAndRenderStores();
        },

        _buildModel: function() {
            this.model = new Backbone.Model({
                title: 'Stores',
                description: 'The icon and name for connected Stores is displayed here.'
            });
        },

        _buildCollection: function() {
            this.collection = new Stores([], {
                parse: true
            });
            this.listenTo(this.collection, 'add', this.renderItem);
        },

        loadAndRenderStores: function() {
            this.collection.fetch({
                silent: true,
                data: $.param({
                    widgetTypes: 'store'
                })
            }).done(this.render);
        },

        render: function() {
            this.descriptionView = new ApplicationConfigurationDescriptionView({
                model: this.model
            });

            this.descriptionView.render();

            this.$el.append(this.descriptionView.el);
            this.$el.append(this.btnTpl);

            this.collection.each(this.renderItem);
        },

        renderItem: function(model) {
            var storeView = new StoreView({
                model: model
            });

            this.$el.children('#app-config-add-store-container')
                    .before(storeView.render().el);

            this.storeViews[model.get('widgetGuid')] = storeView;
        },

        addBtnClicked: function(e) {
            var me = this;
            e.preventDefault();

            Ext.widget('storewizard', {
                id: 'storeWizard',
                saveCallback: _.bind(this._saveCallback, this)
            }).show().center();
        },

        editBtnClicked: function(e) {
            var me = this;
            e.preventDefault();

            Ext.widget('storewizard', {
                id: 'storeWizard',
                editing: true,
                existingStoreId: ($(e.currentTarget).parent().data('store-id')),
                saveCallback: _.bind(this._saveCallback, this)
            }).show().center();
        },

        _saveCallback: function(operation, json) {
            var action = operation.action,  // create, read
                widget = json.data[0],
                id = widget.id,
                model = this.collection.get(id);

            if(action === 'read') return;
            
            model ? model.set(model.parse(widget)) : this.collection.add(json, {parse: true});
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

        // OP-3264: Controlling visibility on hover using CSS doesn't
        // work in Chrome 25, so fall back to using mouseover & mouseout events.
        onStoreViewMouseover: function(e) {
            $(e.currentTarget).find('.edit, .delete').css('visibility', 'visible');
        },

        onStoreViewMouseout: function(e) {
            $(e.currentTarget).find('.edit, .delete').css('visibility', 'hidden');
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