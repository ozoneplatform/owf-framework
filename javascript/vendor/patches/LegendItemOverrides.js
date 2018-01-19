// This allows you to change the color of the legend text
Ext.override(Ext.chart.LegendItem, {

    /**
     * Creates all the individual sprites for this legend item
     */
    createLegend: function(config) {
        var me = this,
            index = config.yFieldIndex,
            series = me.series,
            seriesType = series.type,
            idx = me.yFieldIndex,
            legend = me.legend,
            surface = me.surface,
            refX = legend.x + me.x,
            refY = legend.y + me.y,
            bbox, z = me.zIndex,
            markerConfig, label, mask,
            radius, toggle = false,
            seriesStyle = Ext.apply(series.seriesStyle, series.style);

        function getSeriesProp(name) {
            var val = series[name];
            return (Ext.isArray(val) ? val[idx] : val);
        }
        
        label = me.add('label', surface.add({
            type: 'text',
            x: 20,
            y: 0,
            zIndex: z || 0,
            font: legend.labelFont,
            // PATCH BEGIN
            fill: legend.labelFill || '#000',	// Added this line so that label color could be modified
            // PATCH END
            text: getSeriesProp('title') || getSeriesProp('yField')
        }));

        // Line series - display as short line with optional marker in the middle
        if (seriesType === 'line' || seriesType === 'scatter') {
            if(seriesType === 'line') {
                me.add('line', surface.add({
                    type: 'path',
                    path: 'M0.5,0.5L16.5,0.5',
                    zIndex: z,
                    "stroke-width": series.lineWidth,
                    "stroke-linejoin": "round",
                    "stroke-dasharray": series.dash,
                    stroke: seriesStyle.stroke || '#000',
                    style: {
                        cursor: 'pointer'
                    }
                }));
            }
            if (series.showMarkers || seriesType === 'scatter') {
                markerConfig = Ext.apply(series.markerStyle, series.markerConfig || {});
                me.add('marker', Ext.chart.Shape[markerConfig.type](surface, {
                    fill: markerConfig.fill,
                    x: 8.5,
                    y: 0.5,
                    zIndex: z,
                    radius: markerConfig.radius || markerConfig.size,
                    style: {
                        cursor: 'pointer'
                    }
                }));
            }
        }
        // All other series types - display as filled box
        else {
            me.add('box', surface.add({
                type: 'rect',
                zIndex: z,
                x: 0,
                y: 0,
                width: 12,
                height: 12,
                fill: series.getLegendColor(index),
                style: {
                    cursor: 'pointer'
                }
            }));
        }
        
        me.setAttributes({
            hidden: false
        }, true);
        
        bbox = me.getBBox();
        
        mask = me.add('mask', surface.add({
            type: 'rect',
            x: bbox.x,
            y: bbox.y,
            width: bbox.width || 20,
            height: bbox.height || 20,
            zIndex: (z || 0) + 1000,
            fill: '#f00',
            opacity: 0,
            style: {
                'cursor': 'pointer'
            }
        }));

        //add toggle listener
        me.on('mouseover', function() {
            label.setStyle({
                'font-weight': 'bold'
            });
            mask.setStyle({
                'cursor': 'pointer'
            });
            series._index = index;
            series.highlightItem();
        }, me);

        me.on('mouseout', function() {
            label.setStyle({
                'font-weight': 'normal'
            });
            series._index = index;
            series.unHighlightItem();
        }, me);
        
        if (!series.visibleInLegend(index)) {
            toggle = true;
            label.setAttributes({
               opacity: 0.5
            }, true);
        }

        me.on('mousedown', function() {
            if (!toggle) {
                series.hideAll();
                label.setAttributes({
                    opacity: 0.5
                }, true);
            } else {
                series.showAll();
                label.setAttributes({
                    opacity: 1
                }, true);
            }
            toggle = !toggle;
        }, me);
        me.updatePosition({x:0, y:0}); //Relative to 0,0 at first so that the bbox is calculated correctly
    }
});