/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.grid.enhanced.plugins.DnD"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.grid.enhanced.plugins.DnD"] = true;
dojo.provide("dojox.grid.enhanced.plugins.DnD");

dojo.require("dojox.grid.enhanced.dnd._DndMovingManager");

dojo.declare("dojox.grid.enhanced.plugins.DnD", dojox.grid.enhanced.dnd._DndMovingManager, {
	//	summary:
	//		 Provides dnd support for row(s) and column(s)
	// example:
	// 		 <div dojoType="dojox.grid.EnhancedGrid" plugins="{dnd: true}" ...></div>
});

}
