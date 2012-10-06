@echo off
java -server -version 1> nul 2>&1
IF not errorlevel 1 (
  java -DSTOP.PORT=8079 -DSTOP.KEY=owf -Djavax.net.ssl.trustStore=certs/keystore.jks -Djavax.net.ssl.keyStore=certs/keystore.jks -Djavax.net.ssl.keyStorePassword=changeit -server -Xmx1024m -Xms512m -XX:PermSize=128m -XX:MaxPermSize=256m -jar start.jar custom/jetty-ssl.xml
) ELSE (
  java -DSTOP.PORT=8079 -DSTOP.KEY=owf -Djavax.net.ssl.trustStore=certs/keystore.jks -Djavax.net.ssl.keyStore=certs/keystore.jks -Djavax.net.ssl.keyStorePassword=changeit -Xmx1024m -Xms512m -XX:PermSize=128m -XX:MaxPermSize=256m -jar start.jar custom/jetty-ssl.xml
)