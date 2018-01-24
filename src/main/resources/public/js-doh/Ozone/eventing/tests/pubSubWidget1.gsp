<html>
<head>
  <title>Eventing pubSubWidget1 Widget</title>

  <link href="../../../../css/dragAndDrop.css" rel="stylesheet" type="text/css">

  <p:javascript src='owf-widget'/>

  <script type="text/javascript">

    //The location is assumed to be at /<context>/js/eventing/rpc_relay.uncompressed.html if it is not set
    Ozone.eventing.Widget.widgetRelayURL = Ozone.util.contextPath() + '/js/eventing/rpc_relay.uncompressed.html';
    owfdojo.config.dojoBlankHtmlUrl = '../../../js-lib/dojo-1.5.0-windowname-only/dojo/resources/blank.html';

    owfdojo.addOnLoad(function() {
      var widgetEventingController = Ozone.eventing.Widget.getInstance();
      //wait for 1 second
      setTimeout(function() {
        widgetEventingController.subscribe("pubSubWidget1", function (sender, message, channel) {
          owfdojo.byId('message').innerHTML = 'received message: <b>' + message.msg + '</b> on channel: ' + channel;
          //return 'pubSubWidget1:' + message;
        });

        widgetEventingController.publish('pubSubWidget2', {msg:'I sent you a message from the pubSubWidget1!!!', z:{z:'z'},foo:['bar',{baz:{foo1:'foo'}}]});
      }, 1000);
    });
  </script>
</head>

<body>
  <div id="message">No Message</div>
</body>
</html>
