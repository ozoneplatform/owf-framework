Sample Microsoft Silverlight Widget for the Ozone Widgeting Framework.

**********************************************************************
1. COMPONENTS

OWFSilverlightDemo     - Silverlight project
OWFSilverlightDemo.Web - Web page project

**********************************************************************
2. BUILDING

You must edit the following file to ensure that the JavaScript includes
all point to your instance of the OWF (default is localhost:8443).

OWFSilverlightDemo.Web/OWFSilverlightDemoTestPage.aspx
OWFSilverlightDemo.Web/OWFSilverlightDemoTestPage.html

Also ensure that OWF.relayFile points to the RPC
relay file using the your web context, such as:

OWF.relayFile = '/silverlight/js/eventing/rpc_relay.uncompressed.html';

This example requires a separate web server to run the ASP.NET project, 
usually either IIS or the built-in web server that comes with Visual 
Studio 2008. Open the OWFSilverlightDemo.sln file and this project can 
be run and debugged from Visual Studio.

**********************************************************************
3. WIDGET DEFINITION IN OWF

The following lists some sample values that can be used to insert the
widget into your OWF installation, assuming that the widget is
hosted in a container (for example, IIS), running on port 80 using a 
root name of "silverlight".

Widget GUID:     fb5435cf-4021-4f2a-ba69-dde451d55555
Name:            Silverlight
URL:             http://localhost:8080/silverlight/OWFSilverlightDemoTestPage.aspx
Large Image URL: http://localhost:8080/silverlight/images/silverlight.gif
Small Image URL: http://localhost:8080/silverlight/images/silverlightsm.gif
Width:           500
Height:          500

**********************************************************************
4. EXAMPLE WIDGET

This widget demonstrates how some of the functionality of the Ozone 
Widget Framework can be integrated into an ASP.NET 3.5 with Silverlight 
2.0 website.  The example contains a web page that serves up a Silverlight 
application.  The web project and the Silverlight project are two separate 
projects within the same solution as per Microsoft suggested practice. 

The Silverlight application integrates with the JavaScript functions on 
the ASPX page that hosts it for the purposes of demonstrating interconnectivity 
with the Ozone Widgeting Framework's JavaScript APIs for preferences and 
eventing.

The widget consists of four "panes" that are accessible via the coolmenu
at the bottom of the widget.

The first pane, Shouter, allows sending of messages to other widgets via 
the eventing framework.

The second pane, Listener, allows you to register eventing channels to 
listen on and keeps a record of all messages received.

The third pane, Stats, uses silverlight charting to track the frequency 
of channels that have been registered.

The fourth pane, Prefs, uses the preferences API to store the user's 
preferred visualization method for the stats pane (either as a pie chart 
or a bar chart).
