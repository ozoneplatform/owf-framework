Sample Flex Widget for the Ozone Widgeting Framework

**********************************************************************
1. COMPONENTS

This example is composed of two independent widgets:

- Flex Direct Widget
- Flex Pan Widget

**********************************************************************
2. BUILDING

You must edit the following files to ensure that the JavaScript includes
all point to your instance of the OWF (default is localhost:8443).

./src/main/webapp/direct.html
./src/main/resources/custom-template/templates/html-templates/express-installation-with-history/index.template.html

Also ensure that the OWF.relayFile points to the RPC
relay file using the your web context, such as:

OWF.relayFile = '/owf-sample-flex/js/eventing/rpc_relay.uncompressed.html';

The example widgets require Flex SDK 3.4 or higher to build.  The SDK
can be found here:

http://www.adobe.com/cfusion/entitlement/index.cfm?e=flex3sdk

Edit the build.xml and make sure the FLEX_HOME points to your SDK
installation.  Then, from the main directory, do:

ant

The resulting WAR file will be in the target directory.

**********************************************************************
3. WIDGET DEFINITIONS IN OWF

The following lists some sample values that can be used to insert the
widgets into your OWF installation, assuming that the widgets are
hosted in a container (for example, Tomcat), running on port 8080
using a context of "owf-sample-flex".

Widget GUID:     fb5435cf-4021-4f2a-ba69-dde451daaaaa
Name:            Flex Direct
URL:             http://localhost:8080/owf-sample-flex/direct.html
Large Image URL: http://localhost:8080/owf-sample-flex/images/direct.gif
Small Image URL: http://localhost:8080/owf-sample-flex/images/directsm.gif
Width:           500
Height:          500

Widget GUID:     fb5435cf-4021-4f2a-ba69-dde451dbbbbb
Name:            Flex Pan
URL:             http://localhost:8080/owf-sample-flex/pan.html
Large Image URL: http://localhost:8080/owf-sample-flex/images/pan.gif
Small Image URL: http://localhost:8080/owf-sample-flex/images/pansm.gif
Width:           500
Height:          500

**********************************************************************
4. EXAMPLE WIDGETS

The Flex Pan Widget demonstrates the integration of a Flex Rich Internet 
Application with the Ozone Widgeting Framework. The application displays 
a large image of the Earth and allows users to zoom and scroll around 
the image.  The Flex Pan widget exposes eventing interfaces to control 
pan and zoom control.

The Flex Pan Widget subscribes on the "map.command" channel for the 
following messages:

- zoomIn
- zoomOut
- panUp
- panDown
- panLeft
- panRight

The Flex Pan Widget publishes on the "map.mouse" channel the mouse
coordinates in the format:

{ absX : 100, absY : 110, localX : 200, localY : 500 }

Where abs coordinates are relative to the map image and local coordinates
are relative to the widget's window. 

The Flex Pan Widget subscribes to the map.marker channel to messages to post 
markers on the map image. The format for a map.marker message is:

{ x: 100, y: 200 } 

Which will put a map marker at 100, 200 on the map. Markers are persisted to 
the database using the Preferences API.

The Flex Direct Widget connects to the Flex Pan widget via the eventing 
mechanism to control the panning and zooming.  It also displays the current 
mouse position.
