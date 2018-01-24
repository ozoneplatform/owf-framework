/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dijit.form.TimeTextBox"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form.TimeTextBox"] = true;
dojo.provide("dijit.form.TimeTextBox");

dojo.require("dijit._TimePicker");
dojo.require("dijit.form._DateTimeTextBox");

/*=====
dojo.declare(
	"dijit.form.TimeTextBox.__Constraints",
	[dijit.form._DateTimeTextBox.__Constraints, dijit._TimePicker.__Constraints]
);
=====*/

dojo.declare(
	"dijit.form.TimeTextBox",
	dijit.form._DateTimeTextBox,
	{
		// summary:
		//		A validating, serializable, range-bound time text box with a drop down time picker

		baseClass: "dijitTextBox dijitTimeTextBox",
		popupClass: "dijit._TimePicker",
		_selector: "time",

/*=====
		// constraints: dijit.form.TimeTextBox.__Constraints
		constraints:{},
=====*/

		// value: Date
		//		The value of this widget as a JavaScript Date object.  Note that the date portion implies time zone and daylight savings rules.
		//
		//		Example:
		// |	new dijit.form.TimeTextBox({value: dojo.date.stamp.fromISOString("T12:59:59", new Date())})
		//
		//		When passed to the parser in markup, must be specified according to locale-independent
		//		`dojo.date.stamp.fromISOString` format.
		//
		//		Example:
		// |	<input dojotype='dijit.form.TimeTextBox' value='T12:34:00'>
		value: new Date("")		// value.toString()="NaN"
		//FIXME: in markup, you have no control over daylight savings
	}
);

}
