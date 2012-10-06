#!/bin/bash

java -DSTOP.PORT=8079 -DSTOP.KEY=owf -jar -Djava.awt.headless=true -Djavax.net.ssl.trustStore=certs/ozone-core.jks -Djavax.net.ssl.keyStore=certs/ozone-core.jks -Djavax.net.ssl.keyStorePassword=changeit -Xmx1024m -Xms512m -XX:PermSize=128m -XX:MaxPermSize=256m start.jar custom/jetty-ssl.xml
