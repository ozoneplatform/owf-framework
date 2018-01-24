var app = app || {};

(function() {
	'use strict';

	// Contact Collection
	// ---------------

	// The collection of contacts is backed by *localStorage* instead of a remote
	// server.
	var ContactList = Backbone.Collection.extend({

		// Reference to this collection's model.
		model: app.Contact,

		// Save all of the contact items under the `"contacts-backbone"` namespace.
		localStorage: new Store('contacts-backbone')
	});

	// Create our global collection of **Contacts**.
	app.Contacts = new ContactList();

	app.Contacts.fetch();

}());
