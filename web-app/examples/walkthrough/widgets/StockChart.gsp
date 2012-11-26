<!DOCTYPE html>
<%@ page contentType="text/html;charset=UTF-8" %>

<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Stock Chart</title>
    <g:if test="${params.themeName != null && params.themeName != ''}">
      <link rel='stylesheet' type='text/css' href='../../../themes/${params.themeName.encodeAsHTML()}.theme/css/${params.themeName.encodeAsHTML()}.css' />
    </g:if>
    <g:else>
      <link href="../../../js-lib/ext-4.0.7/resources/css/ext-all.css" rel="stylesheet" type="text/css">
      <link href="../../../css/dragAndDrop.css" rel="stylesheet" type="text/css">
    </g:else>
    <script type="text/javascript" src="../../../js-lib/ext-4.0.7/ext-all-debug.js"></script>
    <p:javascript src="owf-widget" pathToRoot="../../../" />
	<script type="text/javascript" src="../../../js-lib/patches/LegendItemOverrides.js"></script>
    <script type="text/javascript" src="StockChart.js"></script>
    <script type="text/javascript" src="../chart/theme/accessibility-wob.js"></script>
    <script type='text/javascript'>
      
        var _chart;
        
        function doPlot(data) {
            if (_chart) { _chart.plot(data); }
        }
      
        Ext.onReady(function () {
            OWF.ready(function () {
			    var colorSchemes = {
			    	"accessibility-wob": {
			    		theme: "accessibility-wob",
			    		background: {
			    			fill: '#151515'
			    		},
			    		legend: {
			    			boxFill: 'transparent',
			    			boxStroke: 'transparent',
			    			labelFill: '#FFFFFF'
			    		},
					    axes: [{
					        type: 'Numeric',
					        grid: true,
					        minimum: 0,
					        maximum: 25,
					        majorTickSteps: 5,
					        position: 'left',
					        title: 'Price',
					        grid: {
					            odd: {
					                fill: '#3A3A3A',
					                stroke: '#3A3A3A',
					                'stroke-width': 0.5
					            }
					        }
					    }, {
					        type: 'Time',
					        position: 'bottom',
					        fields: 'date',
					        title: 'Time',
					        dateFormat: 'n/d/y G:i:s',
					        constrain: true,
					        fromDate: new Date(2012, 0, 1),
					        toDate: new Date(2012, 0, 4)
					    }]
			    	}
			    };
				    
			    // Set default theme
			    var currentTheme = "${params.themeName.encodeAsHTML()}";
			    if (!colorSchemes[currentTheme]) {
			    	colorSchemes[currentTheme] = {
			    		theme: "Base",
			    		background: null,
			    		legend: true,
					    axes: [{
					        type: 'Numeric',
					        grid: true,
					        minimum: 0,
					        maximum: 25,
					        majorTickSteps: 5,
					        position: 'left',
					        title: 'Price',
					        grid: {
					            odd: {
					                fill: '#dedede',
					                stroke: '#ddd',
					                'stroke-width': 0.5
					            }
					        }
					    }, {
					        type: 'Time',
					        position: 'bottom',
					        fields: 'date',
					        title: 'Time',
					        dateFormat: 'n/d/y G:i:s',
					        constrain: true,
					        fromDate: new Date(2012, 0, 1),
					        toDate: new Date(2012, 0, 4)
					    }]
			    	};
			    }
    
                _chart = Ext.create('Ozone.components.StockChart', {
                  	legend: colorSchemes[currentTheme].legend || true,
                  	theme: colorSchemes[currentTheme].theme || 'Base',
                  	background: colorSchemes[currentTheme].background || null,
                  	axes: colorSchemes[currentTheme].axes || []
                });

                Ext.create('Ext.Viewport', {
                    width: 800,
                    height: 600,
                    minHeight: 400,
                    minWidth: 550,
                    maximizable: true,
                    title: 'Live Updated Chart',
                    layout: 'fit',
                    items: [_chart]
                }).show();
                
                OWF.RPC.registerFunctions([
                    {
                        name: 'doPlot',
                        fn: doPlot
                    }
                ]);
               
                OWF.Intents.receive(
                    {
                        action: 'Graph',
                        dataType: 'application/vnd.owf.sample.price'
                    },
                    function (sender, intent, data) {
                        doPlot(data.data);
                    }
                );
                OWF.notifyWidgetReady();
            });
        });
    </script>
  </head>
  <body style="background-color: white;"></body>
</html>
