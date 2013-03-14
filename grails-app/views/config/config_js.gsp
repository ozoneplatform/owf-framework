<%@ page import="grails.converters.JSON" contentType="text/javascript" %>
<%@ page import="grails.util.Environment" %>
<%@ page import="ozone.security.SecurityUtils" %>

var Ozone = Ozone || {};
//externalize any config properties here as javascript properties
//this should be only place where these config properties are exposed to javascript

Ozone.config = ${conf};

//add in contextPath
Ozone.config.webContextPath = window.location.pathname;

// fixes 'Error: Illegal Operator !=' error in IE
Ozone.config.webContextPath = Ozone.config.webContextPath.replace(/\;jsessionid=.*/g,'');

if(Ozone.config.webContextPath.charAt(Ozone.config.webContextPath.length - 1) === '/') {
    Ozone.config.webContextPath = Ozone.config.webContextPath.substr(0,Ozone.config.webContextPath.length - 1);
}

Ozone.config.carousel = {
    restrictedTagGroupsRegex: new RegExp('^(.*,)?\s*'+Ozone.config.pendingApprovalTagGroupName+'\s*(,.*)?$','im'),
    pendingApprovalTagGroupName:Ozone.config.pendingApprovalTagGroupName,
    approvedTagGroupName: Ozone.config.approvedTagGroupName
};

Ozone.config.user = ${user};

Ozone.config.widgetNames = ${widgetNames};

Ozone.config.banner = ${bannerState};

Ozone.config.currentTheme = ${currentTheme};

Ozone.config.loginCookieName = ${Environment.current == Environment.DEVELOPMENT ? "null" : "'" + ozone.security.SecurityUtils.LOGIN_COOKIE_NAME + "'"};

Ozone.config.prefsLocation = window.location.protocol + "//" + window.location.host + window.location.pathname + "prefs";

Ozone.config.prefsLocation = Ozone.config.prefsLocation.replace(/\;jsessionid=.*/g,'');

//for consistency add the properties onto the new OWF namespace
var OWF  = OWF || {};
OWF.config = Ozone.config;
OWF.getContainerUrl = function() {
    //figure out from preference location
    var pref = Ozone.config.prefsLocation;
    return pref.substring(0, pref.length - 6);
};
