define([
    'jquery',
    'underscore',
    'backbone',
    '../collections/ApplicationConfigurationCollection',
    '../collections/ApplicationConfigurationErrors',
    '../views/ApplicationConfigurationItemView'
], function($, _, Backbone, ApplicationConfigurationCollection, ApplicationConfigurationErrors, ApplicationConfigurationItemView){
  
    /*
    * This is the entry point for the views.  This class will fetch the data, iterate through it
    * and call the ItemView for each record.
    */ 
    return Backbone.View.extend({

        initialize: function(options){
          
            _.bindAll(this, "renderItem");
          
            this.collection = new ApplicationConfigurationCollection();

            this.setElement($("#applicationConfigurationDetail"));
          
            //TODO...this is not right.  We need a controller that will call view.remove() on this instead.
            this.$el.html(null);
          
            var me = this;

            var params = {
                data: $.param({
                    groupName: (options && options.groupName) || ''
                })
            };

            me.collection.fetch(params).complete(function(){
                me.render();
            });
        },

        needToRender: function(model) {
            var modelCode = model.get("code");
            //check for special cases where certain settings shouldn't rendered
            if (this.franchiseFlag) {
                switch (modelCode) {
                    case "store.insideOutside.behavior": return false;
                }
            }  else {
                switch (modelCode) {
                    case "store.valid.domains": return false;
                    case "store.domains": return false;
                    
                    case "store.is.franchise":
                      if(!model.get("mutable"))
                        return false;
                }

            }

            return true
        },

        renderItem: function(model){
            var itemView = new ApplicationConfigurationItemView({
                model:model,
                franchiseFlag:this.franchiseFlag
            });

            if (this.needToRender(model)) {
                itemView.render();
                this.$el.append(itemView.el);
            }
        },

        render: function(){
            this.$el.append("<br>");
            this.collection.each(this.renderItem);
        }
    });
});
