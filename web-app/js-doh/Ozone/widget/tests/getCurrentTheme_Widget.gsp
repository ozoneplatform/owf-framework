<html>
<head>
  <title>Test Widget</title>

  <link href="../../../../css/dragAndDrop.css" rel="stylesheet" type="text/css">

  <p:javascript src='owf-widget'/>

  <script type="text/javascript">

    //The location is assumed to be at /<context>/js/eventing/rpc_relay.uncompressed.html if it is not set
    Ozone.eventing.Widget.widgetRelayURL = Ozone.util.contextPath() + '/js/eventing/rpc_relay.uncompressed.html';
    owfdojo.config.dojoBlankHtmlUrl = '../../../js-lib/dojo-1.5.0-windowname-only/dojo/resources/blank.html';


    owfdojo.addOnLoad(function() {
      var widgetEventingController = Ozone.eventing.Widget.getInstance();

      var serviceName = '_getCurrentTheme';

      gadgets.rpc.call('..', serviceName, null, widgetEventingController.getWidgetId(), Ozone.util.toString(Ozone.Widget.getCurrentTheme()));
    });
  </script>
</head>

<body>
  <div id="message"></div>
</body>
</html>
