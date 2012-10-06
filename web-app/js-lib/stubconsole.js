//http://paulirish.com/2008/graceful-degredation-of-your-firebug-specific-code/

if (! ("console" in window)) {
    var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml", "group"
                 , "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];
    window.console = {};
    for (var i = 0; i < names.length; ++i) window.console[names[i]] = function() {};
}

// //console.time implementation for IE
// if(Ext.isIE && window.console) {
//     console.time = function(name, reset){
//         if(!name) { return; }
//         var time = new Date().getTime();
//         if(!console.timeCounters) { console.timeCounters = {} };
//         var key = "KEY" + name.toString();
//         if(!reset && console.timeCounters[key]) { return; }
//             console.timeCounters[key] = time;
//         };

//     console.timeEnd = function(name){
//         var time = new Date().getTime();
//         if(!console.timeCounters) { return; }
//         var key = "KEY" + name.toString();
//         var timeCounter = console.timeCounters[key];
//         if(timeCounter) {
//             var diff = time - timeCounter;
//             var label = name + ": " + diff + "ms";
//             alert(label);
//             //Ext.isIE7 || Ext.isIE8 ? alert(label) ? console.log(label);
//             delete console.timeCounters[key];
//         }
//         return diff;
//     };
// }