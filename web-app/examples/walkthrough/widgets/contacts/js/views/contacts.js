
(function() {
    'use strict';

    app.ContactsView = Backbone.View.extend({

        tagName: 'table',
        className: 'table table-striped table-hover',

        initialize: function() {
            var me = this;
            app.Contacts.fetch({
                success: function() {
                    me.addAll();
                }
            });
        },

        addOne: function( contact ) {
            var view = new app.ContactView({ model: contact });
            this.$el.append( view.render().el );
        },

        // Add all items Contacts collection at once.
        addAll: function() {
            app.Contacts.each(this.addOne, this);
        }

    });

    // Contact Item View
    // --------------

    // The DOM element for a contact item...
    app.ContactView = Backbone.View.extend({

        //... is a table row.
        tagName:  'tr',

        // Cache the template function for a single item.
        template: Handlebars.compile( $('#contact-template').html() ),

        //The DOM events specific to an item.
        events: {
            'dblclick': 'edit',
            'mousedown': 'startDrag',
            'click .address': 'plotAddress'
        },

        // The ContactView listens for changes to its model, re-rendering. Since there's
        // a one-to-one correspondence between a **Contact** and a **ContactView** in this
        // app, we set a direct reference on the model for convenience.
        initialize: function() {
            this.model.on( 'change', this.render, this );
            this.model.on( 'destroy', this.remove, this );
        },

        // Re-render the titles of the contact item.
        render: function() {
            this.$el.html( this.template( this.model.toJSON() ) );
            return this;
        },

        edit: function() {
            app.Router.navigate(this.model.get('id'), {trigger: true});
        },

        startDrag: function(e) {
            e.preventDefault();
            var model = this.model;

            // -----------------------------------
            // Drag and Drop, start the drag
            // -----------------------------------

            OWF.ready(function(){

                OWF.DragAndDrop.startDrag({
                    dragDropLabel: model.get('name'),
                    dragDropData: model.toJSON(),
                    dragDataType: 'contact'
                });

            });
        },

        plotAddress: function () {
            var model = this.model.toJSON();

            // -----------------------------------
            // Widget Launching
            // -----------------------------------

            // launch a widget matching based on universalName

            OWF.ready(function () {

                OWF.Launcher.launch({
                    universalName: 'org.owfgoss.owf.examples.GoogleMaps',
                    launchOnlyIfClosed: true,
                    pane: 'sibling',
                    data: model
                }, function (result) {



                    // if an instance of it is already running, just
                    // publish a message on a channel that the widget
                    // is listening to

                    if(result.newWidgetLaunched === false) {
                        OWF.Eventing.publish('org.owfgoss.owf.examples.GoogleMapsExample.plotAddress', model, '{"id":"' + result.uniqueId + '"}');
                    }



                });
            });
        }
    });
})();
