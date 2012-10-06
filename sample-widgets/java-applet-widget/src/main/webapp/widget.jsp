<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
		"http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>OWF Sample Applet</title>
<link href="css/dragAndDrop.css" rel="stylesheet" type="text/css">

<script type="text/javascript" language="javascript" src="https://localhost:8443/owf/js-min/owf-widget-min.js"></script>

<script type="text/javascript">
//OWF.relayFile = 'owf-sample-applet/js/eventing/rpc_relay.uncompressed.html';
owfdojo.config.dojoBlankHtmlUrl = './js/dojo-1.5.0-windowname-only/dojo/resources/blank.html';

var gamePosition = 0;
function widgetInit() {
    OWF.Preferences.getUserPreference({namespace:'Applet', name:'position', onSuccess:onGetPositionSuccess, onFailure:onGetFailure});
}
function broadcastMove(move)
{
	OWF.Eventing.publish("mychess", "move: " + move);
}
var onGetPositionSuccess = function(result){
    if (result != null && result.value != null) {
	  gamePosition = result.value;
    }
};
var onGetFailure = function(err) {
};
function storePosition(position)
{
	// This is done to convert the position value from the Java applet
	// (which is a java.lang.Integer) to a JavaScript compatible
	// integer.
	gamePosition = parseInt(position.toString());
	
    OWF.Preferences.getUserPreference({namespace:'Applet', name:'position', onSuccess:putPosition, onFailure:postPosition});
}
var putPosition = function(result)
{
	setPosition("PUT");
};

var postPosition = function(err)
{
	setPosition("POST");
};

var setPosition = function(method) {	
    OWF.Preferences.setUserPreference({namespace:'Applet', name:'position',value:gamePosition,onSuccess:onSetPositionSuccess,onFailure:onSetFailure});
};

var onSetPositionSuccess = function(result)
{
};
var onSetFailure = function(err) {
	alert("Saving preferences failed: " + err);
};

owfdojo.addOnLoad(function() {
    OWF.ready(function() {
      widgetInit();
    });
});
</script>

</head>
<body>
<!--[if !IE]> -->
<object classid="java:ozone/owf/sample/applet/ChessBoard.class" 
              type="application/x-java-applet"
              archive="owf-applet.jar" 
              height="560" width="630" >
  <param name="code" value="ozone/owf/sample/applet/ChessBoard.class" />
  <param name="archive" value="owf-applet.jar" />
  <param name="persistState" value="false" />
  <param name="mayscript" value="true">
  <param name="pgngamefile" value="Polgar-Anand.pgn"/>
  <param name="widget" value="true"/>
  <center>
    <p><strong>Applet requires Java, which your browser does not appear to have.</strong></p>
    <p><a href="http://www.java.com/en/download/index.jsp">Get the latest Java Plug-in.</a></p>
  </center>
</object>
<!--<![endif]-->
<!--[if IE]>
<object classid="clsid:8AD9C840-044E-11D1-B3E9-00805F499D93" 
                codebase="http://java.sun.com/update/1.6.0/jinstall-6-windows-i586.cab#Version=6,0,0,0"
                height="560" width="630" > 
  <param name="code" value="ozone/owf/sample/applet/ChessBoard.class" />
  <param name="archive" value="owf-applet.jar" />
  <param name="persistState" value="false" />
  <param name="mayscript" value="true">
  <param name="pgngamefile" value="Polgar-Anand.pgn"/>
  <param name="widget" value="true"/>
  <center>
    <p><strong>Applet requires Java, which your browser does not appear to have.</strong></p>
    <p><a href="http://www.java.com/en/download/index.jsp">Get the latest Java Plug-in.</a></p>
  </center>
</object>
<![endif]-->
</body>
</html>