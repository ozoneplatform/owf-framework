<%@ page contentType="text/html; UTF-8" %>
<html>
<head>
  <title>testWidgetChromeConstructorWithOutEventingController_Widget.gsp</title>

  <p:javascript src='owf-widget'/>

  <script type="text/javascript">
    //The location is assumed to be at /<context>/js/eventing/rpc_relay.uncompressed.html if it is not set
    Ozone.eventing.Widget.widgetRelayURL = Ozone.util.contextPath() + '/js/eventing/rpc_relay.uncompressed.html';

    owfdojo.config.dojoBlankHtmlUrl = '../../../js-lib/dojo-1.5.0-windowname-only/dojo/resources/blank.html';


    owfdojo.addOnLoad(function() {
      var widgetEventingController = Ozone.eventing.Widget.getInstance();
      var widgetChrome = null;
      var serviceName = '_chrome_test';
      try {
        widgetChrome = Ozone.chrome.WidgetChrome.getInstance();
      }
      catch(e) {
        //send error up
        gadgets.rpc.call('..', serviceName, null, widgetEventingController.getWidgetId(), 'false');
        owfdojo.byId('message').innerHTML = 'Error during WidgetChrome Constructor!!';
        return;
      }
      gadgets.rpc.call('..', serviceName, null, widgetEventingController.getWidgetId(), 'true');
      owfdojo.byId('message').innerHTML = 'WidgetChrome Constructor executed successfully!!';
    });

  </script>
</head>

<body>
<div id="message"></div>
</body>
</html>
