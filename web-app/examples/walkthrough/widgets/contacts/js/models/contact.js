var app = app || {};

(function() {
	'use strict';

	// Contact Model
	// ----------

	// Our basic **Contact** model has `name`, `address`, and `phoneNumber` attributes.
	app.Contact = Backbone.Model.extend({

		// Default attributes 
		// and ensure that each contact created has default properties
		defaults: {
			name: 'John Doe',
			address: 'Address unknown',
			phoneNumber: '(410) 555-5555'
		}

	});

}());
