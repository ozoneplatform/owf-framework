define([    
    'jquery',
    'underscore',
    'backbone',
    '../views/ApplicationConfigurationDescriptionView',
    '../views/ApplicationConfigurationStringView',
    '../views/ApplicationConfigurationBooleanView' ,
    '../views/ApplicationConfigurationMapView',
    '../views/ApplicationConfigurationInsideOutsideToggleView'
], function($, _, Backbone,
            ApplicationConfigurationDescriptionView,
            ApplicationConfigurationStringView, 
            ApplicationConfigurationBooleanView,
            ApplicationConfigurationMapView,
            ApplicationConfigurationInsideOutsideToggleView){

    /*
     * This is the entry point for detailed views.  It delegates to the specific item type to render the view.
     * In the end this will render a row with each specific view rendering a column or element in a column.
     */ 
    
    return Backbone.View.extend({

        tagName: "div",
        
        className: "app_config_column_container",
        
        sectionTemplate:  _.template("<br><div class='app_config_section <%= sectionCls %>'> <%= sectionName %>  </div>"),
        
        initialize: function(options){
            this.franchiseFlag = options.franchiseFlag;
        },
        
        render: function(){

            var modelCode = this.model.get("code");

            this.descriptionView = new ApplicationConfigurationDescriptionView({model : this.model});
            this.descriptionView.render();

            //If needed start a new section
            if(this.model.get("subGroupName")){
                var sectionCls = "app_config_section_" + this.model.get("subGroupName") ;
                sectionCls = sectionCls.toLowerCase().split(' ').join('_');
                if($("." + sectionCls).length == 0)
                    $(this.el).append(this.sectionTemplate({sectionCls : sectionCls , sectionName : this.model.get("subGroupName")}));
            }

            //Description and title are always used
            $(this.el).append(this.descriptionView.el);

            // check for complex settings that need special views
            var specialView = false;
            switch (modelCode) {
                case "store.insideOutside.behavior":
                    specialView = true;

                    this.configView = new ApplicationConfigurationInsideOutsideToggleView({model: this.model});

                    this.configView.render();
                    $(this.el).append(this.configView.el);
                    break;
            }

            if (!specialView) {
                switch (this.model.get("type")) {
                case 'Boolean':
                    this.configView = new ApplicationConfigurationBooleanView({model: this.model});

                    this.configView.render();
                    $(this.el).append(this.configView.el);
                    break;

                case 'String':
                    this.configView = new ApplicationConfigurationStringView({model: this.model, showInImage: false});

                    this.configView.render();
                    $(this.el).append(this.configView.el);

                    break;
                case 'Number':
                    this.configView = new ApplicationConfigurationStringView({model: this.model, showInImage: false});

                    this.configView.render();
                    $(this.el).append(this.configView.el);

                    break;                    
                case 'Image':
                    this.configView = new ApplicationConfigurationStringView({model: this.model, showInImage: true});

                    this.configView.render();
                    $(this.el).append(this.configView.el);
                    break;
                case 'Map':

                    var isImage = modelCode == 'store.themes';
                    this.configView = new ApplicationConfigurationMapView({model: this.model, hasImage: isImage});

                    this.configView.render();
                    $(this.el).append(this.configView.el);
                    break;

                case 'List':
                    //Until we implement a way to show/edit a list in a collection view, just use the string view
                    this.configView = new ApplicationConfigurationStringView({model: this.model});

                    this.configView.render();
                    $(this.el).append(this.configView.el);
                    break;
                }
            }

            if(this.model.get("errors")) {
                this.configView.trigger("openForEdit");
                if(!$.browser.mozilla) {
                    this.configView.$(".app_config_text_area").css('display', 'inline-block');
                }
            }

            $(this.el).fadeIn('slow');
        }
    });

});