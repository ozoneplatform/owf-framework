Ext.ns('Ozone.components');

(Ozone.components.StockTimer = function(callback, interval) {
    
    var runner = new Ext.util.TaskRunner();
    var theInterval = interval ? interval : 10000;  // 10 second default interval
    var task;
    var targets;
    
    return {
        start: function() {
            if (!task) {
                task = runner.start({
                    run: function() {
                        if (targets) {
                            var dt = new Date();
                            Ext.Array.each(targets, function(target, index, targetsRef) {
                                if (target && target.widgetId) {
                                    var data = [];
                                    var proxy = target.proxy;
                                    var widgetId = target.widgetId;
                                    Ext.Array.each(target.symbols, function(symbol, index, symbolsRef) {
                                        if (symbol) {
                                            data.push({
                                                date: dt,
                                                symbol: symbol,
                                                price: Math.floor((Math.random()*25)+1)
                                            });
                                        }
                                    });
                                    callback(widgetId, proxy, data);
                                }
                            });
                        }
                    },
                    interval: theInterval
                });
            }
        },
        stop: function() {
            if (task) {
                runner.stop(task);
            }
        },
        reset: function(widgetId, proxy, symbols) {
            if (!targets) { targets = []; }
            var idx = -1;
            for (var i = 0; i < targets.length; i++) {
                if (targets[i].widgetId == widgetId) {
                    idx = i;
                    break;
                }
            }
            if (idx > -1) {
                Ext.Array.replace(
                    targets,
                    idx,
                    1,
                    [{
                        widgetId: widgetId,
                        proxy: proxy,
                        symbols: symbols
                    }]
                );
            } else {
                targets.push({
                    widgetId: widgetId,
                    proxy: proxy,
                    symbols: symbols
                });
            }
        },
        remove: function(widgetId) {
            if (targets) {
                var idx = -1;
                for (var i = 0; i < targets.length; i++) {
                    if (targets[i].widgetId == widgetId) {
                        idx = i;
                        break;
                    }
                }
                if (idx > -1) {
                    Ext.Array.splice(
                        targets,
                        idx,
                        1
                    );
                }
            }
        }
    };
        
})();