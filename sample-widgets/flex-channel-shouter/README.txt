Sample Flex Channel Shouter Widget for the Ozone Widgeting Framework

**********************************************************************
1. COMPONENTS

This example is composed of one independent widget:

- Flex Channel Shouter

**********************************************************************
2. BUILDING

The example widgets require Flex SDK 4.1 to build.  The SDK
can be found here:

http://sourceforge.net/adobe/flexsdk/wiki/Versions/

If you do not have FLEX_HOME path set in your environment, edit the build.xml and make sure the FLEX_HOME points to your SDK installation.  Then, from the main directory, do:

ant

The resulting WAR file will be in the target directory.

**********************************************************************
3. WIDGET DEFINITIONS IN OWF

The following lists some sample values that can be used to insert the
widgets into your OWF installation, assuming that the widgets are
hosted in a container (for example, Tomcat), running on port 8080
using a context of "flex".

Name:            Flex Channel Shouter
URL:             https://localhost:8443/flex-channel-shouter/index.html
Large Image URL: https://localhost:8443/owf/images/blue/icons/widgetIcons/channelShouter.gif
Small Image URL: https://localhost:8443/owf/images/blue/icons/widgetIcons/channelShouter.gif
Width:           500
Height:          500