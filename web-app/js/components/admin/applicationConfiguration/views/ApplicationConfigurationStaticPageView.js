define([
    'jquery',
    'underscore',
    'backbone',
    '../models/ApplicationConfigurationModel',
    '../views/partials/ApplicationConfigurationLinkView',
], function($, _, Backbone, ApplicationConfigurationModel, ApplicationConfigurationLinkView ){
    
    /*
     * This is the entry point for the views.  This class will fetch the data, iterate through it
     * and call the ItemView for each record.
     */ 
    return Backbone.View.extend({

        initialize: function(options){
            this.groupName = options.groupName;

            this.setElement($("#applicationConfigurationDetail"));
            
            //TODO...this is not right.  We need a controller that will call view.remove() on this instead.
            this.$el.html(null);

            this.render();
        },
        
        // Create views based on group names 
        createAndRenderGroup: function(){
            switch(this.groupName){
                case "data_exchange":
                    importModel = new ApplicationConfigurationModel();
                    importModel.set("value", "true");
                    importModel.set("linkId", "importItemsLink");
                    importModel.set("link","../importTask/list");
                    importModel.set("linkText", "<h5>Import Listings</h5>Import listings into your store by clicking here.");
                    linkView = new ApplicationConfigurationLinkView({model:importModel});
                    linkView.render();
                    $(this.el).append(linkView.el);
                    
                    exportModel = new ApplicationConfigurationModel();
                    exportModel.set("value", "true");
                    exportModel.set("linkId", "exportItemsLink");
                    exportModel.set("link","../public/exportAll");
                    exportModel.set("linkText", "<h5>Export Listings</h5>Export your data for use in another store by clicking here.");
                    linkView = new ApplicationConfigurationLinkView({model:exportModel});
                    linkView.render();
                    $(this.el).append(linkView.el);
                    break;
                    
                case "listing_management":
                    listingModel = new ApplicationConfigurationModel();
                    listingModel.set("value", "true");
                    listingModel.set("linkId", "pendingListingsLink");
                    listingModel.set("link","../serviceItem/adminView?sort=editedDate&order=desc&accessType=Administrator");
                    listingModel.set("linkText", "<h5>Pending Listings</h5>View your pending listings by clicking here.");
                    linkView = new ApplicationConfigurationLinkView({model:listingModel});
                    linkView.render();
                    $(this.el).append(linkView.el);
                    break;
            }
        },

        render: function(){
            this.$el.append("<br>");
            this.createAndRenderGroup();
        }
    });
});
