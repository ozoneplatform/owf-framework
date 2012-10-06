dojo.registerModulePath("Ozone", "../../../js-doh/Ozone");
dojo.require("dojo.parser");
dojo.require("doh.runner");
dojo.require("dojox.secure.capability");
dojo.provide("Ozone.kernel.tests.apiTestsHTML");


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

    function findWidgets1() {
        return waitOnResult(Ozone.eventing.priv.getFunctions, "awidget1");
    }
    function findWidgets2() {
        return waitOnResult(Ozone.eventing.priv.getFunctions, "awidget2");
    }

    function functionCallingWidgetToWidget() {
        var deferred = new doh.Deferred();
        function resultHandler(result) {
          deferred.callback(result);
        }
        gadgets.rpc.register("TEST_RESULT", resultHandler);

        widget1.sendMessage("add some stuff");
        return deferred;
    }

    //Setup two widgets that will intercommunicate in tests
    var widget1 = Ozone.eventing.createWidget( getWidgetUrl("apiwidget1.html", true), "awidget1", "one");
    var widget2 = Ozone.eventing.createWidget( getWidgetUrl("apiwidget2.html", true), "awidget2", "two");


    function test1() { return {
            name: "Find first widget",
            runTest: findWidgets1,
            timeout: 1000 } }

    function test2() { return {
            name: "Find second widget",
            runTest: findWidgets2,
            timeout: 1000 } }

    function test3() { return {
            name: "Widget to widget function call",
            runTest: functionCallingWidgetToWidget,
            timeout: 2000 } }

    doh.register("Ozone.kernel.tests.apiTests", [
        test1(),
        test2(),
        test3()
    ]);

    doh.run();
});
