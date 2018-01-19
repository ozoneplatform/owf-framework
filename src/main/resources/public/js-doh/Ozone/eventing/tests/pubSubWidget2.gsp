<html>
<head>
  <title>Eventing pubSubWidget2 Widget</title>

  <link href="../../../../css/dragAndDrop.css" rel="stylesheet" type="text/css">

  <p:javascript src='owf-widget'/>

  <script type="text/javascript">

    //The location is assumed to be at /<context>/js/eventing/rpc_relay.uncompressed.html if it is not set
    Ozone.eventing.Widget.widgetRelayURL = Ozone.util.contextPath() + '/js/eventing/rpc_relay.uncompressed.html';
    owfdojo.config.dojoBlankHtmlUrl = '../../../js-lib/dojo-1.5.0-windowname-only/dojo/resources/blank.html';

    owfdojo.addOnLoad(function() {
      var widgetEventingController = Ozone.eventing.Widget.getInstance();
      widgetEventingController.subscribe("pubSubWidget2", function (sender, message, channel) {
        owfdojo.byId('message').innerHTML = 'received message: <b>' + Ozone.util.toString(message) + '</b> on channel: ' + channel;

        //send message to pubSubWidget1 after we've received pubSubWidget1's message
        widgetEventingController.publish('pubSubWidget1', {msg:'I sent you a message from the pubSubWidget2!!!'});
        //return 'pubSubWidget2:' + message;
      });

    });
  </script>
</head>

<body>
  <div id="message">No Message</div>
</body>
</html>
