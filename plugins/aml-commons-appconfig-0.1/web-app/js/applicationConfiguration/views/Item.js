define([
    '../views/Description',
    '../views/String',
    '../views/Boolean',
    '../views/Map',
    '../views/InsideOutsideToggle',
    'jquery',
    'underscore',
    'backbone'
], function(ApplicationConfigurationDescriptionView,
            ApplicationConfigurationStringView,
            ApplicationConfigurationBooleanView,
            ApplicationConfigurationMapView,
            ApplicationConfigurationInsideOutsideToggleView,
            $, _, Backbone){

    /*
     * This is the entry point for detailed views.  It delegates to the specific item type to render the view.
     * In the end this will render a row with each specific view rendering a column or element in a column.
     */

    return Backbone.View.extend({

        tagName: "div",

        className: "app_config_column_container",

        sectionTemplate:  _.template("<br><div class='app_config_section <%= sectionCls %>'> <%= sectionName %>  </div>"),

        initialize: function(options) {
            this.appConfigs = options.appConfigs;
        },

        render: function(){

            var modelCode = this.model.get("code");

            this.descriptionView = new ApplicationConfigurationDescriptionView({model : this.model});
            this.descriptionView.render();

            //If needed start a new section
            if(this.model.get("subGroupName") != null && this.model.get("subGroupOrder") == 1){
                var sectionCls = "app_config_section_" + this.model.get("subGroupName") ;
                sectionCls = sectionCls.toLowerCase().split(' ').join('_');
                if($("." + sectionCls).length == 0)
                    this.$el.append(this.sectionTemplate({sectionCls : sectionCls , sectionName : this.model.get("subGroupName")}));
            }

            //Description and title are always used
            this.$el.append(this.descriptionView.el);

            // check for complex settings that need special views
            var specialView = false;
            switch (modelCode) {
                case "store.insideOutside.behavior":
                    specialView = true;
                    this.configView = new ApplicationConfigurationInsideOutsideToggleView({ model: this.model });
                    break;
            }

            if (!specialView) {
                switch (this.model.get("type")) {
                    case 'Boolean':
                        this.configView = new ApplicationConfigurationBooleanView({ model: this.model });
                        break;

                    case 'String':
                    case 'Integer':
                    case 'Decimal':
                        this.configView = new ApplicationConfigurationStringView({ model: this.model });
                        break;

                    case 'Image':
                        this.configView = new ApplicationConfigurationStringView({ model: this.model, showInImage: true });
                        break;

                    case 'Map':
                        var isImage = modelCode == 'store.themes';
                        this.configView = new ApplicationConfigurationMapView({ model: this.model, hasImage: isImage });
                        break;

                    case 'List':
                        //Until we implement a way to show/edit a list in a collection view, just use the string view
                        this.configView = new ApplicationConfigurationStringView({ model: this.model });
                        break;
                }
            }

            if(this.configView) {
                this.configView.appConfigs = this.appConfigs
                this.configView.render();
                this.$el.append(this.configView.el);
            }

            if(this.model.get("errors")) {
                this.configView.trigger("openForEdit");
            }

            this.$el.fadeIn('slow');
        },

        remove: function () {
            this.descriptionView.remove();
            this.configView && this.configView.remove();
            Backbone.View.prototype.remove.call(this);
        }
    });

});