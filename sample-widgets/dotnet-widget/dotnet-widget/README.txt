Sample Microsoft .Net Widget for the Ozone Widgeting Framework.

**********************************************************************
1. COMPONENTS

This example consists of one main widget page.

**********************************************************************
2. BUILDING

You must edit the following file to ensure that the JavaScript includes
all point to your instance of the OWF (default is localhost:8443):

Default.aspx

Also ensure that OWF.relayFile points to the RPC
relay file using the your web context, such as:

OWF.relayFile = '/dotnet/js/eventing/rpc_relay.uncompressed.html';

This example requires a separate web server to run the ASP.NET project, 
usually either IIS or the built-in web server that comes with Visual 
Studio 2008. Open the dotnet-widget.sln file and this project can be 
run and debugged from Visual Studio.

**********************************************************************
3. WIDGET DEFINITION IN OWF

The following lists some sample values that can be used to insert the
widget into your OWF installation, assuming that the widget is
hosted in a container (for example, IIS), running on port 80 using a 
root name of "dotnet".

Widget GUID:     fb5435cf-4021-4f2a-ba69-dde451d44444
Name:            DotNet Listener
URL:             http://localhost:80/dotnet/Default.aspx
Large Image URL: http://localhost:80/dotnet/images/channelListener.gif
Small Image URL: http://localhost:80/dotnet/images/channelListenersm.gif
Width:           500
Height:          500

**********************************************************************
4. EXAMPLE WIDGET

This widget demonstrates how some of the functionality of the Ozone 
Widget Framework can be integrated into an ASP.NET 3.5 website. 
The example contains a web page for adding eventing channels and a 
web service for storing eventing messages. 
