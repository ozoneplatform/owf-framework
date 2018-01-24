<html>
<head>
    <title>Eventing pubSubLocal Tests</title>
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
            Ozone.eventing.Container.init();
            var container = Ozone.eventing.Container;

            var altHostName = window.location.hostname;
            var port = window.location.port != '' ? ':'+window.location.port : '';
            var widget1 = {
                id: guid.util.guid(),
                widgetGuid:  guid.util.guid(),
                url: window.location.protocol + "//" + (altHostName + port +"/"
                        + Ozone.util.contextPath()+'/js-doh/Ozone/eventing/tests/pubSubWidget1.gsp').replace(/\/{2,}/,'/')
            };
            var widget2 = {
                id: guid.util.guid(),
                widgetGuid:  guid.util.guid(),
                url: window.location.protocol + "//" + (altHostName + port +"/"
                        + Ozone.util.contextPath()+'/js-doh/Ozone/eventing/tests/pubSubWidget2.gsp').replace(/\/{2,}/,'/')
            };

            var widgetFrameId1Obj = container.generateIframeId(widget1.id, widget1,'desktop', 1);
            var widgetFrameId1 = Ozone.util.formatWindowNameData(widgetFrameId1Obj);
            var iframeTag1 = "<iframe " + container.getIframeProperties(widget1.url, widget1.id, widget1) + " width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"auto\"></iframe>";

            var widgetFrameId2Obj = container.generateIframeId(widget2.id, widget2,'desktop', 1);
            var widgetFrameId2 = Ozone.util.formatWindowNameData(widgetFrameId2Obj);
            var iframeTag2 = "<iframe " + container.getIframeProperties(widget2.url, widget2.id, widget2) + " width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"auto\"></iframe>";

            doh.register("Ozone.eventing.tests.pubSubLocalTests", [
                {
                    name: "widget1PublishToWidget2",
                    setUp: function() {
                        //Setup to do before runTest.
                    },
                    runTest: function() {
                        //Our test function to run.
                        var deferred = new doh.Deferred();

                        //connect to checkMatch which is called when any message is delivered
                      Ozone.eventing.Container.onRoute(function(sender, subscriber, channel, message) {
                            if (sender == widgetFrameId1) {
                                //doh.assertEqual(sender,widgetFrameId1);
                                doh.assertEqual(subscriber,widgetFrameId2);
                                doh.assertEqual(channel,'pubSubWidget2');
                                doh.assertEqual(message.msg,'I sent you a message from the pubSubWidget1!!!');

                                if (dojo.byId('message').innerHTML == 'No Message') {
                                   dojo.byId('message').innerHTML = '';
                                }
                                dojo.byId('message').innerHTML+='published to ['+ channel +'] received message: <b>'+message.msg+'</b><br/>';

                                deferred.callback(true);
                           }
                        },this);

                        return deferred;
                    },
                    tearDown: function() {
                        //cleanup to do after runTest.
                    },
                    timeout: 10000 //10 second timeout.
                },
                {
                    name: "widget2PublishToWidget1",
                    setUp: function() {
                        //Setup to do before runTest.
                    },
                    runTest: function() {
                        //Our test function to run.
                        var deferred = new doh.Deferred();

                        //connect to checkMatch which is called when any message is delivered
                        Ozone.eventing.Container.onRoute(function(sender, subscriber, channel, message) {
                            if (sender == widgetFrameId2) {
                                //doh.assertEqual(sender,widgetFrameId2);
                                doh.assertEqual(subscriber,widgetFrameId1);
                                doh.assertEqual(channel,'pubSubWidget1');
                                doh.assertEqual(message.msg,'I sent you a message from the pubSubWidget2!!!');

                                if (dojo.byId('message').innerHTML == 'No Message') {
                                   dojo.byId('message').innerHTML = '';
                                }
                                dojo.byId('message').innerHTML+='published to ['+ channel +'] received message: <b>'+message.msg+'</b><br/>';

                                deferred.callback(true);
                           }
                        },this);

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


            //write out widget iframe <!-- this iframe is loaded via 127.0.0.1 which means it will be xdomain for browsers pointed at localhost-->
            dojo.byId('widget1').innerHTML = iframeTag1;
            dojo.byId('widget2').innerHTML = iframeTag2;
        });
    </script>
</head>
<body>
<h>Eventing pubSubLocal Tests</h>
<div style="border: 2px solid black; height:200px;">
    <h>Container</h>
    <div id="message">No Message</div>
    <div id="widget_container1" style="border: 2px solid black; height:50px;">
        pubSubWidget1
        <div id="widget1">
        </div>
    </div>
    <div id="widget_container2" style="border: 2px solid black;  height:50px;">
        pubSubWidget2
        <div id="widget2">
        </div>
    </div>
</div>
</body>
</html>
