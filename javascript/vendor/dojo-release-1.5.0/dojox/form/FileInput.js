/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.form.FileInput"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.form.FileInput"] = true;
dojo.provide("dojox.form.FileInput");
dojo.experimental("dojox.form.FileInput"); 

dojo.require("dijit.form._FormWidget");
dojo.require("dijit._Templated"); 

dojo.declare("dojox.form.FileInput",
	dijit.form._FormWidget,
	{
	// summary: A styled input type="file"
	//
	// description: A input type="file" form widget, with a button for uploading to be styled via css,
	//	a cancel button to clear selection, and FormWidget mixin to provide standard dijit.form.Form
	//	support (FIXME: maybe not fully implemented) 

	// label: String
	//	the title text of the "Browse" button
	label: "Browse ...",

	// cancelText: String
	//	the title of the "Cancel" button
	cancelText: "Cancel",

	// name: String
	//	ugh, this should be pulled from this.domNode
	name: "uploadFile",

	templateString: dojo.cache("dojox.form", "resources/FileInput.html", "<div class=\"dijitFileInput\">\r\n\t<input id=\"${id}\" class=\"dijitFileInputReal\" type=\"file\" dojoAttachPoint=\"fileInput\" name=\"${name}\" />\r\n\t<div class=\"dijitFakeInput\">\r\n\t\t<input class=\"dijitFileInputVisible\" type=\"text\" dojoAttachPoint=\"focusNode, inputNode\" />\r\n\t\t<div class=\"dijitInline dijitFileInputText\" dojoAttachPoint=\"titleNode\">${label}</div>\r\n\t\t<div class=\"dijitInline dijitFileInputButton\" dojoAttachPoint=\"cancelNode\" \r\n\t\t\tdojoAttachEvent=\"onclick:reset\">${cancelText}</div>\r\n\t</div>\r\n</div>\r\n"),
	
	startup: function(){
		// summary: listen for changes on our real file input
		this._listener = this.connect(this.fileInput,"onchange","_matchValue");
		this._keyListener = this.connect(this.fileInput,"onkeyup","_matchValue");
	},

	//get rid of the this.connect in _FormWidget.postCreate to allow IE to show
	//the file picker dialog properly
	postCreate: function(){},
	
	_matchValue: function(){
		// summary: set the content of the upper input based on the semi-hidden file input
		this.inputNode.value = this.fileInput.value;
		if(this.inputNode.value){
			this.cancelNode.style.visibility = "visible";
			dojo.fadeIn({ node: this.cancelNode, duration:275 }).play();
		}
	},

	setLabel: function(/* String */label,/* String? */cssClass){
		// summary: method to allow use to change button label
		this.titleNode.innerHTML = label;
	},

	reset: function(/* Event */e){
		// summary: on click of cancel button, since we can't clear the input because of
		// 	security reasons, we destroy it, and add a new one in it's place.
		this.disconnect(this._listener);
		this.disconnect(this._keyListener);
		if(this.fileInput){
			this.domNode.removeChild(this.fileInput);
		}
		dojo.fadeOut({ node: this.cancelNode, duration:275 }).play(); 

		// should we use cloneNode()? can we?
		this.fileInput = document.createElement('input');
		// dojo.attr(this.fileInput,{
		//	"type":"file", "id":this.id, "name": this.name	
		//});
		this.fileInput.setAttribute("type","file");
		this.fileInput.setAttribute("id", this.id);
		this.fileInput.setAttribute("name", this.name);
		dojo.addClass(this.fileInput,"dijitFileInputReal");
		this.domNode.appendChild(this.fileInput);

		this._keyListener = this.connect(this.fileInput, "onkeyup", "_matchValue");
		this._listener = this.connect(this.fileInput, "onchange", "_matchValue"); 
		this.inputNode.value = ""; 
	}

});

}
