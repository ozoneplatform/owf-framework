#!/bin/bash

java -server -version 2>/dev/null
# If the server jvm is available then use the -server option
if [ $? -eq  0 ]; then
java -DSTOP.PORT=8079 -DSTOP.KEY=owf -jar -Djava.awt.headless=true -Djavax.net.ssl.trustStore=certs/keystore.jks -Djavax.net.ssl.keyStore=certs/keystore.jks -Djavax.net.ssl.keyStorePassword=changeit -server -Xmx1024m -Xms512m -XX:PermSize=128m -XX:MaxPermSize=256m start.jar custom/jetty-ssl.xml
else
java -DSTOP.PORT=8079 -DSTOP.KEY=owf-jar -Djava.awt.headless=true -Djavax.net.ssl.trustStore=certs/keystore.jks -Djavax.net.ssl.keyStore=certs/keystore.jks -Djavax.net.ssl.keyStorePassword=changeit -Xmx1024m -Xms512m -XX:PermSize=128m -XX:MaxPermSize=256m start.jar custom/jetty-ssl.xml
fi
