// IE7 Date class doesn't support parsing ISO-8601 string date.
// Ideally, one should use moment.js for date parsing.
function parseJsonDate(value) {
    var a;

    if (typeof value === 'string') {
        a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
        if (a) {
            return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
        }
    }
    return value;
};

Ext.define('Stocks', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'date', type: 'date'},
    ]
});

Ext.define('Ozone.components.StockChart', {
    extend: 'Ext.chart.Chart',
    alias: ['widget.stockchart'],
    store: Ext.create('Ext.data.Store', {
        model: 'Stocks',
        proxy: {
            type: 'memory',
            reader: {
                type: 'json',
                root: 'stocks'
            }
        }
    }),
    shadow: false,
    symbols: {},
    axes: [],
    series: [],
    initComponent: function(){
        var me = this;
        me.callParent(arguments);
    },
    plot: function(data) {
        if (data) {
            var chart = this,
                timeAxis = chart.axes.get(1),
                firstPass = true,
                newData = {
                    stocks: [],
                    metaData: {
                        fields: []
                    }
                };
            Ext.Array.each(data, function(datum, index, dataRef) {
                if (datum) {

                    datum.date = parseJsonDate(datum.date);
                    
                    // Add to points
                    if (firstPass) {
                        newData.stocks.push({date: datum.date});
                        newData.metaData.fields.push({name: 'date', type: 'date'});
                        
                        timeAxis.toDate = datum.date;
                        timeAxis.fromDate = Ext.Date.add(Ext.Date.clone(datum.date), Ext.Date.SECOND, -40);
                        
                        firstPass = false;
                    }
                    newData.stocks[0][datum.symbol] = datum.price;
                    newData.metaData.fields.push({name: datum.symbol,  type: 'float'});
                    
                    // Add new series if not there.
                    if (!chart.symbols[datum.symbol]) {
                        chart.series.add({
                            type: 'line',
                            axis: ['left', 'bottom'],
                            xField: 'date',
                            yField: datum.symbol,
                            markerConfig: {
                                radius: 5,
                                size: 5
                            },
                            style: {
                                'stroke-width': 1
                            }                        });
                        chart.symbols[datum.symbol] = true;
                    }
                };
            });
            if (chart.store.getCount() > 10) {
                chart.store.removeAt(0);
            }
            chart.store.loadRawData(newData, true);

        }
    }
});
