define([
    '../collections/Collection',
    '../collections/Errors',
    '../views/Item',
    '../views/partials/FreeTextWarning',
    'jquery',
    'underscore',
    'backbone'
],

function(ApplicationConfigurationCollection, ApplicationConfigurationErrors,
         ApplicationConfigurationItemView, FreeTextWarningView, $, _, Backbone) {

    /*
    * This is the entry point for the views. This class will iterate through the data
    * and call the ItemView for each record.
    */
    return Backbone.View.extend({

        id: 'applicationConfigurationDetail',
        className: 'app_config_list_view_panel',

        views: null,

        initialize: function(){
            this.views = [];
            _.bindAll(this, "resetPage", "renderItem");
            this.listenTo(this.collection, "reset", this.resetPage);
        },

        needToRender: function(model) {
            return true;
        },

        renderItem: function(model){
            var itemView = new ApplicationConfigurationItemView({
                model: model,
                appConfigs: this.appConfigs
            });

            if(this.needToRender(model)) {
                itemView.render();
                this.$el.append(itemView.el);
                this.views.push(itemView);
            }
        },

        render: function(){
            this.$el.empty().append("<br>");
            this.collection.each(this.renderItem);
            return this;
        },

        resetPage: function() {
            this.render();
            return false;
        },

        remove: function () {
            _.invoke(this.views, 'remove');
            delete this.views;
            Backbone.View.prototype.remove.call(this);
        }
    });
});
