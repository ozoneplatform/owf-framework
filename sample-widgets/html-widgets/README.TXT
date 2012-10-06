Sample HTML Widgets for the Ozone Widgeting Framework.

**********************************************************************
1. COMPONENTS

This example consists of a functional widget pair and a preferences
example:

Announcing Clock/Second Tracker
Preferences

**********************************************************************
2. BUILDING

You must edit the following files to ensure that the JavaScript includes
all point to your instance of the OWF (default is localhost:8443).

clock/SecondTracker_Launched.html
prefs/Preferences.html

Also ensure that OWF.relayFile points to the RPC
relay file using the your web context, such as:

OWF.relayPath = '/owf-sample-html/js/eventing/rpc_relay.uncompressed.html';

To build from the main directory, do: 

ant

The resulting WAR will be in the target directory.

**********************************************************************
3. WIDGET DEFINITION IN OWF

The following lists some sample values that can be used to insert the
widgets into your OWF installation, assuming that the widgets are
hosted in a container (for example, Tomcat), running on port 8080
using a context of "owf-sample-html".

Name:               Announcing Clock
URL:                http://localhost:8080/owf-sample-html/clock/AnnouncingClock_Eventing.html
Container Icon URL: http://localhost:8080/owf-sample-html/images/clock.gif
Carousel Icon URL:  http://localhost:8080/owf-sample-html/images/clocksm.gif
Width:              500
Height:             500 

Name:            	Second Tracker
URL:             	http://localhost:8080/owf-sample-html/clock/SecondTracker.html
Container Icon URL: http://localhost:8080/owf-sample-html/images/tracker.gif
Carousel Icon URL: 	http://localhost:8080/owf-sample-html/images/trackersm.gif
Width:           	500
Height:          	500

Name:            	Preferences
URL:             	http://localhost:8080/owf-sample-html/prefs/Preferences.html
Container Icon URL: http://localhost:8080/owf-sample-html/images/preferences.gif
Carousel Icon URL: 	http://localhost:8080/owf-sample-html/images/preferencessm.gif
Width:           	500
Height:          	500

----------------------------------------------------------------------
3a.  Widget Definitions for sample widgets deployed inside the OWF WAR file

     NOTES: The OWF sample database already contains these widget definitions
            Switching from the default database to another implementation would
            require these to be added, if desired.

Name:            	Channel Listener
URL:             	https://localhost:8443/owf/examples/walkthrough/widgets/ChannelListener.html
Container Icon URL: https://localhost:8443/owf/images/blue/icons/widgetContainer/channelListenersm.gif
Carousel Icon URL: 	https://localhost:8443/owf/images/blue/icons/widgetIcons/channelListener.gif
Width:           	500
Height:          	500

Name:            	Channel Shouter
URL:             	https://localhost:8443/owf/examples/walkthrough/widgetsChannelShouter.html
Container Icon URL: http://localhost:8443/owf/images/blue/icons/widgetContainer/channelShoutersm.gif
Carousel Icon URL: 	http://localhost:8443/owf/images/blue/icons/widgetIcons/channelShouter.gif
Width:           	500
Height:          	500


**********************************************************************
4. EXAMPLE WIDGETS

The Widget Developer's Guide uses the Announcing Clock and Second
Tracker as progressive coding examples. The end result is a running 
text clock that broadcasts time information, which is received and 
displayed by the Second Tracker. This can be observed by opening the 
Announcing Clock and Second Tracker widgets added to OWF.

The Preferences widget is a simple example of saving to the preferences
server.  It reads the latest value from the server when initialized.

The Channel Shouter and Listener are bundled with the OWF web application
itself and are pre-deployed in the default demo database. Hence, the
HTML source can be located inside the OWF WAR file under the path
referenced in the widget URLs, as listed above.  The Shouter
allows the user to broadcast any text over a channel while the 
Listener provides a way to display those messages.

