define([
    '../models/Model',
    '../views/partials/Link',
    'jquery',
    'underscore',
    'backbone'
], function(ApplicationConfigurationModel, ApplicationConfigurationLinkView, $, _, Backbone){
    
    /*
     * This is the entry point for the views.  This class will fetch the data, iterate through it
     * and call the ItemView for each record.
     */ 
    return Backbone.View.extend({

        id: 'applicationConfigurationDetail',
        className: 'app_config_list_view_panel',

        views: null,

        initialize: function(options){
            this.views = [];
            this.groupName = options.groupName;

            this.render();
        },
        
        // Create views based on group names 
        createAndRenderGroup: function() {
            var linkView;
            switch(this.groupName){
                case "data_exchange":
                    importModel = new ApplicationConfigurationModel();
                    importModel.set({
                        "value": "true",
                        "linkId": "importItemsLink",
                        "link": "../importTask/list",
                        "linkText": "<h5>Import Listings</h5>Import listings into your store by clicking here."
                    });
                    linkView = new ApplicationConfigurationLinkView({model:importModel});
                    linkView.render();
                    this.$el.append(linkView.el);
                    this.views.push(linkView);
                    
                    exportModel = new ApplicationConfigurationModel();
                    exportModel.set({
                        "value": "true",
                        "linkId": "exportItemsLink",
                        "link": "../public/exportAll",
                        "linkText": "<h5>Export Listings</h5>Export your data for use in another store by clicking here."
                    });
                    linkView = new ApplicationConfigurationLinkView({model:exportModel});
                    linkView.render();
                    this.$el.append(linkView.el);
                    this.views.push(linkView);
                    break;
                    
                case "LISTING_MANAGEMENT":
                    listingModel = new ApplicationConfigurationModel();
                    listingModel.set({
                        "value": "true",
                        "linkId": "pendingListingsLink",
                        "link": "../serviceItem/adminView?sort=editedDate&order=desc&accessType=Administrator",
                        "linkText": "<h5>Pending Listings</h5>View your pending listings by clicking here."
                    });
                    linkView = new ApplicationConfigurationLinkView({model:listingModel});
                    linkView.render();
                    this.$el.append(linkView.el);
                    this.views.push(linkView);
                    break;
            }
        },

        render: function(){
            this.$el.html("<br>");
            this.createAndRenderGroup();
        },

        remove: function () {
            _.invoke(this.views, 'remove');
            delete this.views;
            Backbone.View.prototype.remove.call(this);
        }
    });
});
