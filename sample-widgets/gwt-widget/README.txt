Sample Google Web Toolkit (GWT) Widget for the Ozone Widgeting Framework

**********************************************************************
1. BUILDING

Prerequisites for building the sample StockWatcher project:

Eclipse with GWT toolkit plug-in

* or *

Ant, Java, and the GWT toolkit.

Please refer to the GWT-README.txt file for instructions on building 
the application.

You must then edit the following file to ensure that the JavaScript includes
all point to your instance of the OWF (default is localhost:8443).

StockWatcher.html

Also ensure that OWF.relayFile points to the RPC
relay file using the your web context, such as:

OWF.relayFile = '/gwt/js/eventing/rpc_relay.uncompressed.html';

**********************************************************************
2. DEPLOYING

Simply deploy the generated war file to your favorite web application 
server (Tomcat, Jetty, etc.)

**********************************************************************
3. WIDGET DEFINITION IN OWF

The following lists some sample values that can be used to insert the
widget into your OWF installation, assuming that the widget is
hosted in a container (for example, Tomcat), running on port 8080
using a context of "gwt".

Widget GUID:     fb5435cf-4021-4f2a-ba69-dde451dddddd
Name:            StockWatcher
URL:             http://localhost:8080/gwt/StockWatcher.html
Large Image URL: http://localhost:8080/gwt/images/stockwatch.gif
Small Image URL: http://localhost:8080/gwt/images/stockwatchsm.gif
Width:           500
Height:          500

**********************************************************************
4. EXAMPLE WIDGET

This is the standard GWT tutorial application modified to use some of 
the features of the Ozone Widget Framework.

Your stock symbol picks are persisted to the Preferences database via 
the preferences API and are automatically populated the next time you 
launch the widget.

Also, adding and removing stocks broadcasts a message on the 'stockwatcher' 
channel.  You can see this by subscribing to the 'stockwatcher' channel 
via the example Channel Listener widget.