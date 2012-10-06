<html>
<head>
  <title>Eventing RPC Widget</title>

  <link href="../../../../css/dragAndDrop.css" rel="stylesheet" type="text/css">

  <p:javascript src='owf-widget'/>

  <script type="text/javascript">

    //The location is assumed to be at /<context>/js/eventing/rpc_relay.uncompressed.html if it is not set
    Ozone.eventing.Widget.widgetRelayURL = Ozone.util.contextPath() + '/js/eventing/rpc_relay.uncompressed.html';
    owfdojo.config.dojoBlankHtmlUrl = '../../../js-lib/dojo-1.5.0-windowname-only/dojo/resources/blank.html';


    owfdojo.addOnLoad(function() {
      var widgetEventingController = Ozone.eventing.Widget.getInstance();

      gadgets.rpc.register("_rpc_widget_test", function (sender, message) {
        owfdojo.byId('message').innerHTML = 'received message: <b>' + message + '</b>';
        return 'rpc_widget_test:' + message;
      });

      var serviceName = '_rpc_test';
      gadgets.rpc.call('..', serviceName, null, widgetEventingController.getWidgetId(), 'I sent you a message from the widget!!!');
    });
  </script>
</head>

<body>
  <div id="message"></div>
</body>
</html>
