<!DOCTYPE html>
<%@ page import="java.io.InputStream" %>
<%@ page import="java.util.Properties" %>
<%

InputStream in = this.getClass().getResourceAsStream("/about.properties");

Properties p = new Properties();
if (in != null)
{
    p.load(in);
}

String description  = "";
String notice       = "";
String image        = "./images/brand-logo.png";
String version      = "${project.version}";
String buildNumber  = "${buildNumber}";
String buildDate    = "${buildDate}";
String javaVersion  = "${java.version}";
String computerName = "${env.COMPUTERNAME}";
String buildOSInfo  = "${os.name} ${os.version} ${os.arch}";

if (p != null)
{
    description     = p.getProperty("projectDescripton",description);
    notice          = p.getProperty("projectNotice",    notice);
    version         = p.getProperty("projectVersion",   version);   
    buildNumber     = p.getProperty("buildNumber",      buildNumber);
    buildDate       = p.getProperty("buildDate",        buildDate);
    javaVersion     = p.getProperty("javaVersion",      javaVersion);
    computerName    = p.getProperty("computerName",     computerName);
    buildOSInfo     = p.getProperty("buildOSInfo",      buildOSInfo);
}

//-------------------------------------------------------------------------
%>
<img src="<%= image %>" class="aboutImage"/>
<p><%= description %></p>
<p><%= notice %></p>
<p id="aboutInfo">Version: <%= version %> Build Date: <%= buildDate %> Build Number: <%= buildNumber %></p>
