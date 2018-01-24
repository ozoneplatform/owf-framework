<html>
<head>
    <title>Eventing Local RPC Tests</title>
    <script type="text/javascript">
        djConfig = {
                isDebug: true,
                parseOnLoad: false,
                scopeMap: [
                        ["dojo", "owfdojo"],
                        ["dijit", "owfdijit"],
                        ["dojox", "owfdojox"]
                ]
        }
    </script>
    <script type="text/javascript" src="../../../../js-lib/dojo-release-1.5.0/dojo/dojo.js"></script>
    <script type='text/javascript' src='../../../../js/config/config.js'></script>
    <!-- include our server bundle, in dev mode a full list of js includes will appear -->
    <p:javascript src='owf-server'/>
    <!-- include our server bundle, in dev mode a full list of js includes will appear -->
    <script type="text/javascript">
        dojo = owfdojo;
        dojox = owfdojox;

        dojo.registerModulePath("Ozone", "../../../js-doh/Ozone");
        dojo.provide("Ozone.eventing.tests.rpcLocalTestsHTML");
        dojo.require("dojo.parser");
        dojo.require("doh.runner");
        dojo.require("dojox.secure.capability");

        dojo.addOnLoad(function() {

            // eventing configuration
            var serviceName = '_rpc_test';
            Ozone.eventing.Container.init();
            var container = Ozone.eventing.Container;

            //this is a local test so use the same hostname
            var altHostName = window.location.hostname;
            var port = window.location.port != '' ? ':'+window.location.port : '';
            var widget = {
                id: guid.util.guid(),
                widgetGuid:  guid.util.guid(),
                url: window.location.protocol + "//" + (altHostName + port +"/"
                        + Ozone.util.contextPath()+'/js-doh/Ozone/eventing/tests/rpcWidget.gsp').replace(/\/{2,}/,'/')
            };
            var widgetFrameIdObj = container.generateIframeId(widget.id, widget,'desktop', 1);
            var widgetFrameId = Ozone.util.formatWindowNameData(widgetFrameIdObj);
            var iframeTag = "<iframe " + container.getIframeProperties(widget.url, widget.id, widget) + " width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"auto\"></iframe>";

            doh.register("Ozone.eventing.tests.rpcLocalTests", [
                {
                    name: "widgetToContainerRPCTest",
                    setUp: function() {
                        //Setup to do before runTest.
                    },
                    runTest: function() {
                        //Our test function to run.
                        var deferred = new doh.Deferred();

                        //register event handler
                        container.registerHandler(serviceName, function(sender, msg) {
                            var widgetId = Ozone.util.parseJson(sender);
                            doh.assertEqual(widgetId.id,widget.id);
                            doh.assertEqual(msg,'I sent you a message from the widget!!!');

                            dojo.byId('message').innerHTML='received message: <b>'+msg+'</b>';

                            deferred.callback(true);
                        });
                        
                        return deferred;
                    },
                    tearDown: function() {
                        //cleanup to do after runTest.
                    },
                    timeout: 10000 //10 second timeout.
                },
                {
                    name: "containerToWidgetRPCTest",
                    setUp: function() {
                        //Setup to do before runTest.
                    },
                    runTest: function() {
                        //Our test function to run.
                        var deferred = new doh.Deferred();

                        //rpc call to widget
                        var msgFromContainer = 'this is a message from the container';
                        gadgets.rpc.call(widgetFrameId,
                                '_rpc_widget_test', function(msg) {

                            //this callback will get the msg string from the rpcWidget
                            doh.assertEqual(msg,'rpc_widget_test:'+msgFromContainer);
                            deferred.callback(true);

                        }, 'rpcTestContainer', msgFromContainer);

                        return deferred;
                    },
                    tearDown: function() {
                        //cleanup to do after runTest.
                    },
                    timeout: 10000 //10 second timeout.
                }
            ]);

            //Execute D.O.H. in this remote file.
            doh.run();

            dojo.byId('widget').innerHTML = iframeTag;
        });
    </script>
</head>
<body>
<h>Eventing Local RPC Tests</h>
<div style="border: 2px solid black;">
    <h>Container</h>
    <div id="message"></div>
    <div id="widget_container" style="border: 2px solid black;">
        Widget
        <div id="widget">
        </div>
    </div>
</div>
</body>
</html>
