dojo.registerModulePath("Ozone", "../../../js-doh/Ozone");
dojo.require("dojo.parser");
dojo.require("doh.runner");
dojo.require("dojox.secure.capability");
dojo.provide("Ozone.kernel.tests.kernelTestsHTML");


dojo.addOnLoad(function() {
    Ozone.eventing.initializeContainer();

    function getWidgetUrl(widgetName, useRemote) {
        var hostname;
        if(useRemote) {
            hostname = "127.0.0.1"; //assume test being run on localhost, so 127.0.0.1 will be "remote"
        } else {
            hostname = window.location.hostname;
        }
        var port = window.location.port != '' ? ':' + window.location.port : '';
        return window.location.protocol + "//" + hostname + port + "/owf/js-doh/Ozone/kernel/tests/" + widgetName;
    }

    function waitOnResult(fn, arg) {
        var deferred = new doh.Deferred();
        var attempt = 0;
        var result;
        function callMultipleTimes() {
            result = fn.call(this, arg);
            if (typeof result === 'undefined') {
                attempt++;
                if (attempt < 1000) {
                    setTimeout(callMultipleTimes, 50);
                } else {
                    deferred.callback(false);
                }
            } else {
                deferred.callback(true);
            }
        }
        callMultipleTimes();
        return deferred;
    }

    function createWidget() {
        var widgetProxy = Ozone.eventing.createWidget( getWidgetUrl("widget1.html", true), "widget1", "one");
        return waitOnResult(Ozone.eventing.priv.getFunctions, "widget1");
    }

    function createDialogWidget() {
        var widgetProxy = Ozone.eventing.createWidget( getWidgetUrl("widget2.html", true), "widget2", "one");
        return waitOnResult(Ozone.eventing.priv.getFunctions, "widget2");
    }

    function createWindowWidget() {
        var widgetProxy = Ozone.eventing.createWindowWidget( getWidgetUrl("widget3.html", true), "widget3", 200, 200);
        return waitOnResult(Ozone.eventing.priv.getFunctions, "widget3");
    }


    function test1() { return { name: "CreateWidget",         runTest: createWidget,       timeout: 1000 } }
    function test2() { return { name: "CreateDialogWidget",   runTest: createDialogWidget, timeout: 1000 } }
    function test3() { return { name: "CreateWindowWidget",   runTest: createWindowWidget, timeout: 5000 } }

    doh.register("Ozone.kernel.tests.kernelTests", [
        test1(),
        test2()//,
        //test3()
    ]);

    doh.run();
});
