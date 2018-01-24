/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.charting.themes.PrimaryColors"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.charting.themes.PrimaryColors"] = true;
dojo.provide("dojox.charting.themes.PrimaryColors");

dojo.require("dojox.charting.Theme");
dojo.require("dojox.charting.themes.gradientGenerator");

(function(){
	var dc = dojox.charting, themes = dc.themes,
		colors = ["#f00", "#0f0", "#00f", "#ff0", "#0ff", "#f0f"],
		defaultFill = {type: "linear", space: "plot", x1: 0, y1: 0, x2: 0, y2: 100};

	themes.PrimaryColors = new dc.Theme({
		seriesThemes: themes.gradientGenerator.generateMiniTheme(colors, defaultFill, 90, 40, 25)
	});
})();

}
