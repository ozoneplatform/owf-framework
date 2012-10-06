Sample Java Applet Widget for the Ozone Widgeting Framework.

**********************************************************************
1. COMPONENTS

owf-applet        - Applet JAR
owf-sample-applet - Applet WAR

**********************************************************************
2. BUILDING

You must edit the following file to ensure that the JavaScript includes
all point to your instance of the OWF (default is localhost:8443).

widget.jsp

Also ensure that OWF.relayFile points to the RPC
relay file using the your web context, such as:

OWF.relayFile = 'owf-sample-applet/js/eventing/rpc_relay.uncompressed.html';

To build from the main directory, do: 

ant

The resulting WAR will be in the target directory.

**********************************************************************
3. DEPLOYING TO A TOMCAT INSTANCE

Edit the build.xml and ensure that the tomcat.home.dir property points
to the target Tomcat instance.  Then, from the main directory, do:

ant deploy

**********************************************************************
4. BUILD NOTES

The applet needs to access the browser's JavaScript object, which
requires some additional security.  The easiest way to accomplish this
is to sign the jar.  The security directory contains a keystore and a
DOS batch file to create a new one.

During the build process, this keystore is used to sign the jar file.
The first time the applet is run, the user will be prompted to trust
the test certificate.  Allowing it will avoid further prompting.

The classes needed to access the JavaScript object are part of the 
normal Sun JDK in the plugin.jar.  For simplicity, the jar has been 
copied into this project's lib directory from the Sun Java JDK 
v1.6.0_07.  Upgrade or point to your own installation as necessary.

Finally (and this is detailed in the SDK documentation), the
rpc_relay.uncompressed.html file needs to point to your local OWF
instance.

**********************************************************************
5. WIDGET DEFINITION IN OWF

The following lists some sample values that can be used to insert the
widget into your OWF installation, assuming that the widget is
hosted in a container (for example, Tomcat), running on port 8080
using a context of "applet".

Widget GUID:     		fb5435cf-4021-4f2a-ba69-dde451dccccc
Name:            		Applet
URL:             		http://localhost:8080/owf-sample-applet/widget.jsp
Container Icon URL: 	http://localhost:8080/owf-sample-applet/images/chess.gif
Launch Menu Icon URL: 	http://localhost:8080/owf-sample-applet/images/white-queen.gif
Width:           		680
Height:          		640

**********************************************************************
6. EXAMPLE WIDGET

The applet is Michael Keating's MyChessViewer (www.mychess.com), which
reads in and animates a chess PGN file. It has been hooked into the
Ozone Widgeting Framework to do the following:

- Broadcast on channel "mychess" each forward move selected.
- Store the current position in the game to the Preferences server.

Coding points of interest in owf-applet:

ChessBoard.java
   - broadcastMove(), hooks back into JavaScript to send current move
   - storeCurrentPosition(), hooks back into JavaScript to store current move
   - getCurrentPosition(), hooks back into JavaScript to retrieve current move

The index.jsp is provided as a default view of the applet, the OWF widget
definition must point to widget.jsp, where the JavaScript code is.

After deploying the widget to the Ozone Widgeting Framework, you can use
the sample Channel Listener widget to monitor the "mychess" channel.  Clicking
on the next button within the applet will send a message about the move.

Coming back to the widget after closing the browser will return it to the
last move performed. 

**********************************************************************
7. ISSUES

There is a documented issue with Java applets not obeying proper z-indexing,
the effect being that an applet will appear on top of everything else in the 
widgeting framework:

http://bugs.sun.com/bugdatabase/view_bug.do;jsessionid=6a434ce1408465ffffffff87e84af5d233a32?bug_id=6646289
