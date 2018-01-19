/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dijit.CheckedMenuItem"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.CheckedMenuItem"] = true;
dojo.provide("dijit.CheckedMenuItem");

dojo.require("dijit.MenuItem");

dojo.declare("dijit.CheckedMenuItem",
		dijit.MenuItem,
		{
		// summary:
		//		A checkbox-like menu item for toggling on and off

		templateString: dojo.cache("dijit", "templates/CheckedMenuItem.html", "<tr class=\"dijitReset dijitMenuItem\" dojoAttachPoint=\"focusNode\" waiRole=\"menuitemcheckbox\" tabIndex=\"-1\"\r\n\t\tdojoAttachEvent=\"onmouseenter:_onHover,onmouseleave:_onUnhover,ondijitclick:_onClick\">\r\n\t<td class=\"dijitReset dijitMenuItemIconCell\" waiRole=\"presentation\">\r\n\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitMenuItemIcon dijitCheckedMenuItemIcon\" dojoAttachPoint=\"iconNode\"/>\r\n\t\t<span class=\"dijitCheckedMenuItemIconChar\">&#10003;</span>\r\n\t</td>\r\n\t<td class=\"dijitReset dijitMenuItemLabel\" colspan=\"2\" dojoAttachPoint=\"containerNode,labelNode\"></td>\r\n\t<td class=\"dijitReset dijitMenuItemAccelKey\" style=\"display: none\" dojoAttachPoint=\"accelKeyNode\"></td>\r\n\t<td class=\"dijitReset dijitMenuArrowCell\" waiRole=\"presentation\">&nbsp;</td>\r\n</tr>\r\n"),

		// checked: Boolean
		//		Our checked state
		checked: false,
		_setCheckedAttr: function(/*Boolean*/ checked){
			// summary:
			//		Hook so attr('checked', bool) works.
			//		Sets the class and state for the check box.
			dojo.toggleClass(this.domNode, "dijitCheckedMenuItemChecked", checked);
			dijit.setWaiState(this.domNode, "checked", checked);
			this.checked = checked;
		},

		onChange: function(/*Boolean*/ checked){
			// summary:
			//		User defined function to handle check/uncheck events
			// tags:
			//		callback
		},

		_onClick: function(/*Event*/ e){
			// summary:
			//		Clicking this item just toggles its state
			// tags:
			//		private
			if(!this.disabled){
				this.set("checked", !this.checked);
				this.onChange(this.checked);
			}
			this.inherited(arguments);
		}
	});

}
