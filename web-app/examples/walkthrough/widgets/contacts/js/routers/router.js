var app = app || {};

$(function() {

    var AppRouter = Backbone.Router.extend({

        currentView: null,

        initialize:function () {
            //this.$contentFormTpl = Handlebars.compile( $('#contact-form-template').html() );
            _.bindAll(this);
        },

        routes:{
            "": "list",
            "new": "newContact",
            ":id": "editContact"
        },

        list:function () {
            this.showView('#contacts', new app.ContactsView());
        },

        editContact:function (id) {
            var contact = app.Contacts.get(id);

            if(contact) {
                this.showView('#contact', new app.EditContactView({
                    model: contact
                }));
            }
            else {
                this.navigate('', {trigger: true});
            }
        },

        newContact:function () {
            this.showView('#contact', new app.EditContactView({
                model: new app.Contact()
            }));
        },

        showView:function (selector, view) {

            if (this.currentView) {
                this.currentView.remove();
                this.currentView.unbind();
            }

            if(selector)
                $(selector).html(view.render().el);

            this.currentView = view;

            return view;
        }

    });

    app.Router = new AppRouter();
    Backbone.history.start();

});