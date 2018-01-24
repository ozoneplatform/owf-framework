/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.drawing.plugins.tools.Iconize"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.drawing.plugins.tools.Iconize"] = true;
dojo.provide("dojox.drawing.plugins.tools.Iconize");
dojo.require("dojox.drawing.plugins._Plugin");

dojox.drawing.plugins.tools.Iconize = dojox.drawing.util.oo.declare(
	// summary:
	//		Somewhat of internal use...
	//		Outputs a path to be used as an icon. Will end up being a
	//		sub-icon under Export options
	
	dojox.drawing.plugins._Plugin,
	function(options){
	
	},
	{
		onClick: function(){
			var item;
			for(var nm in this.stencils.stencils){
				console.log(" stanceil item:", this.stencils.stencils[nm].id, this.stencils.stencils[nm])
				if(this.stencils.stencils[nm].shortType=="path"){
					item = this.stencils.stencils[nm];
					break;
				}
			}
			if(item){
				console.log("click Iconize plugin", item.points);
				this.makeIcon(item.points);
			}
		},
		makeIcon: function(/*Array*/p){
			var rnd = function(n){
				return Number(n.toFixed(1));
			}
			
			var x = 10000;
			var y = 10000;
			p.forEach(function(pt){
				if(pt.x!==undefined && !isNaN(pt.x)){
					x = Math.min(x, pt.x);
					y = Math.min(y, pt.y);
				}
			});
			
			var xmax = 0;
			var ymax = 0;
			p.forEach(function(pt){
				if(pt.x!==undefined && !isNaN(pt.x)){
					pt.x = rnd(pt.x - x);
					//console.log("Y:", pt.y, y, pt.y - y)
					pt.y = rnd(pt.y - y);
					xmax = Math.max(xmax, pt.x);
					ymax = Math.max(ymax, pt.y);
				}
			});
			
			console.log("xmax:", xmax, "ymax:", ymax)
			
			var s = 60
			var m = 20
			
			p.forEach(function(pt){
				pt.x = rnd(pt.x / xmax) * s + m;
				pt.y = rnd(pt.y / ymax) * s + m;
			});
			
			var txt = "[\n";
			dojo.forEach(p, function(pt, i){
				txt += "{\t"
				if(pt.t){
					txt += "t:'"+pt.t+"'"
				}
				if(pt.x!==undefined && !isNaN(pt.x)){
					if(pt.t){
						txt += ", ";
					}
					txt += "x:"+pt.x+",\t\ty:"+pt.y;
				}
				txt += "\t}";
				if(i!=p.length-1){
					txt += ","
				}
				txt += "\n"
			});
			txt+="]"
			
			console.log(txt)
			var n = dojo.byId("data");
			if(n){
				n.value = txt;
			}
		}
	}
);

dojox.drawing.plugins.tools.Iconize.setup = {
	name:"dojox.drawing.plugins.tools.Iconize",
	tooltip:"Iconize Tool",
	iconClass:"iconPan"
};

dojox.drawing.register(dojox.drawing.plugins.tools.Iconize.setup, "plugin");

}
