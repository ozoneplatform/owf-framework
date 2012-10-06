Ext.define('Ext.chart.theme.accessibility-wob', {
    extend: 'Ext.chart.theme.Base',

    constructor: function(config) {
    	var baseColor = '#FFFFFF';
    	var colors = ['#FFFF49', '#6BFC17', '#499DFF', '#FF499D', '#FFA035'];
    	var markerThemes = [];
    	var seriesThemes = [];
    	var types = ["circle", "cross", "plus", "diamond", "triangle"];
    	var typeIndex = 0;
    	
    	for (var i = 0; i < colors.length; i++) {
    		var color = colors[i];
    		
    		markerThemes.push({
    			fill: color,
    			type: types[typeIndex]
    		});
    		
    		seriesThemes.push({
    			fill: color
    		});
    		
    		if (typeIndex == types.length - 1) typeIndex = 0;
    		else typeIndex++;
    	}   
    	
        this.callParent([Ext.apply({
		    axis: {
		    	fill: baseColor,
		    	stroke: baseColor
		    },
		    axisLabelTop: {
		        fill: baseColor
		    },
		    axisLabelLeft: {
		        fill: baseColor
		    },
		    axisLabelRight: {
		        fill: baseColor
		    },
		    axisLabelBottom: {
		        fill: baseColor
		    },
		    axisTitleTop: {
		        fill: baseColor
		    },
		    axisTitleLeft: {
		        fill: baseColor
		    },
		    axisTitleRight: {
		        fill: baseColor
		    },
		    axisTitleBottom: {
		        fill: baseColor
		    },
		    colors: ['#FFFFFF'],
            markerThemes: markerThemes,
            seriesThemes: seriesThemes
		}, config)]);
    }
});