
(function() {
    'use strict';

    // Contact Item View
    // --------------

    // The DOM element for a contact item...
    app.EditContactView = Backbone.View.extend({

        // Cache the template function for a single item.
        template: Handlebars.compile( $('#contact-form-template').html() ),

        //The DOM events specific to an item.
        events: {
            'click #save-contact': 'save',
            'click #delete-contact': 'deleteContact'
        },

        initialize: function() {
            app.Contacts.push(this.model);
        },

        render: function() {
            this.$el.html( this.template( this.model.toJSON() ) );
            return this;
        },

        save: function() {

            var name = $('#name').val(),
                address = $('#address').val(),
                phone = $('#phone').val(),
                contact;

            if(name && address && phone) {

                contact = this.model.set({
                    name: name,
                    address: address,
                    phoneNumber: phone
                });

                contact.save();
            }
            else {
                return false;
            }
        },

        deleteContact: function() {
            this.model.destroy();
        }
    });
})();
