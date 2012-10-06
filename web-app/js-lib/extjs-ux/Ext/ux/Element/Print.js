/**
 * @class Ext.ux.Element.Print
 * @version 0.3
 * @author <a href="http://extjs.com/forum/member.php?u=43382">nerdydude81</a>
 * @license <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0</a>
 */
Ext.override(Ext.Element, {
	/**
	 * @cfg {string} printCSS The file path of a CSS file for printout.
	 */
	printCSS: null
	/**
	 * @cfg {Boolean} printStyle Copy the style attribute of this element to the print iframe.
	 */
	, printStyle: false
	/**
     * @property {string} printTitle Page Title for printout. 
     */
	, printTitle: document.title
	/**
	 * Prints this element.
	 * 
	 * @param config {object} (optional)
	 */
	, print: function(config) {
		Ext.apply(this, config);
		
		var el = Ext.get(this.id).dom;
		var c = document.getElementById('printcontainer');
		var iFrame = document.getElementById('printframe');
		
		var strTemplate = '<HTML><HEAD><link rel="stylesheet" type="text/css" href="{0}"/><TITLE>{1}</TITLE></HEAD><BODY onload="{2}"><DIV {3}>{4}</DIV></BODY></HTML>';
		var strAttr = '';
		var strFormat;
		var strHTML;
		
		//Get rid of the old crap so we don't copy it
		//to our iframe
		if (iFrame != null) c.removeChild(iFrame);
		if (c != null) el.removeChild(c);
		
		//Copy attributes from this element.
		for (var i = 0; i < el.attributes.length; i++) {
			if (Ext.isEmpty(el.attributes[i].value) || el.attributes[i].value.toLowerCase() != 'null') {
				strFormat = Ext.isEmpty(el.attributes[i].value)? '{0}="true" ': '{0}="{1}" ';
				if (this.printStyle? this.printStyle: el.attributes[i].name.toLowerCase() != 'style')
					strAttr += String.format(strFormat, el.attributes[i].name, el.attributes[i].value);
			}
		}
		
		//Build our HTML document for the iframe
		strHTML = String.format(
				strTemplate
				, Ext.isEmpty(this.printCSS)? '#': this.printCSS
				, this.printTitle
				, Ext.isIE? 'document.execCommand(\'print\');': 'window.print();'
				, strAttr
				, el.innerHTML
		);
		
		//I coun't get FF to print a hidden iframe,
		//so I encapsulated it in a hidden div.
		c = document.createElement('div');
		c.setAttribute('style','width:0px;height:0px;visibility:hidden;');
		c.setAttribute('id', 'printcontainer');
		el.appendChild(c);
		
		//IE doesn't like style attributes anymore?
		if (Ext.isIE)
			c.style.display = 'none';
		
		iFrame = document.createElement('iframe');
		iFrame.setAttribute('id', 'printframe');
		iFrame.setAttribute('name', 'printframe');
		c.appendChild(iFrame);
		
		//Write our new document to the iframe
		iFrame.contentWindow.document.open();		
		iFrame.contentWindow.document.write(strHTML);
		iFrame.contentWindow.document.close();
	}
});

Ext.override(Ext.Component, {
	printEl: function(config) {
		this.el.print(Ext.isEmpty(config)? this.initialConfig: config);
	}
	, printBody: function(config) {
		this.body.print(Ext.isEmpty(config)? this.initialConfig: config);
	}
});