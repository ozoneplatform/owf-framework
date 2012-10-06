//this is a stubbed out config.js - usually this file contains server generated configuration, but for testing all these values have
//to be hardcoded

var Ozone = Ozone || {};
//externalize any config properties here as javascript properties
//this should be only place where these config properties are exposed to javascript

//auto convert to JSON this will take care of special characters
Ozone.config = {"accessAlertMsg":null,"adminBannerIcon":"images/adminLogo52.png","adminBannerIconHeight":52,"adminBannerIconWidth":346,"adminBannerPageTitle":"Admininistration","alternateHostName":"127.0.0.1","approvedTagGroupName":"approved","autoSaveInterval":900000,"bannerIcon":"images/blue/header/wfLogo48.gif","bannerIconHeight":48,"bannerIconWidth":250,"casLocation":null,"class":"ozone.owf.Configuration","defaultTheme":"a_default","dynamicLaunchData":null,"dynamicLaunchOnlyIfClosed":null,"enableMetrics":true,"enablePendingApprovalWidgetTagGroup":true,"freeTextEntryWarningMessage":"Warning, no inappropriate text/data should be entered.","helpFileRegex":"^.*\\.(html|gsp|jsp|pdf|doc|docx|mov|mp4|swf|wmv)$","isTestMode":null,"lastLoginDateFormat":"n/j/Y G:i","lastLoginText":"(last login: [lastLoginDate])","log4jWatchTime":180000,"logoutURL":"/logout","marketplaceLocation":"","mpInitialPollingInterval":5000,"mpPollingInterval":300000,"mpVersion":null,"officeName":"Sample Office","pendingApprovalTagGroupName":"pending approval","prefsLocation":"https://localhost:8443/owf/prefs","publishWidgetLoadTimes":true,"sendWidgetLoadTimesToServer":true,"serverVersion":"5.0.0-ALPHA-SPRINT1","showAccessAlert":null,"showLastLogin":"false","testSwarmUrl":null}

//set the property below to set the alternateHostName which is used to some tests to be cross domain
//Ozone.config.alternateHostName = 'ntabernero1';

//add in contextPath
Ozone.config.webContextPath = '/test/web-app';

Ozone.config.version = '6.0.0-ALPHA-SPRINT3';

Ozone.config.carousel = {
  restrictedTagGroupsRegex: new RegExp('^(.*,)?\s*'+Ozone.config.pendingApprovalTagGroupName+'\s*(,.*)?$','im'),
  pendingApprovalTagGroupName:Ozone.config.pendingApprovalTagGroupName,
  approvedTagGroupName: Ozone.config.approvedTagGroupName
};

Ozone.config.user = {"displayName":"testAdmin1","userRealName":"Test Admin 1","prevLogin":"2012-04-05T16:55:08Z","prettyPrevLogin":"4 hours ago","id":1,"groups":[{"totalUsers":0,"id":309,"totalWidgets":0,"name":"OWF Admins","status":"active","tagLinks":[],"description":"OWF Administrators","email":null,"automatic":false},{"totalUsers":0,"id":4,"totalWidgets":0,"name":"TestGroup1","status":"active","tagLinks":[],"description":"TestGroup1","email":"testgroup1@group1.com","automatic":false},{"totalUsers":0,"id":5,"totalWidgets":0,"name":"TestGroup2","status":"active","tagLinks":[],"description":"TestGroup2","email":"testgroup2@group2.com","automatic":false},{"totalUsers":0,"id":300,"totalWidgets":0,"name":"All Users","status":"active","tagLinks":[],"description":"All Users","email":null,"automatic":false}],"email":"testAdmin1@ozone3.test","isAdmin":true};

Ozone.config.widgetNames = {};

Ozone.config.banner = {"state":"docked","position":[0,0]};

Ozone.config.currentTheme = {"themeName":"a_default","themeContrast":"standard","themeFontSize":12};

//for consistency add the properties onto the new OWF namespace
var OWF  = OWF || {};
OWF.config = Ozone.config;
OWF.getContainerUrl = function() {
	return OWF.config.owfLocation;
};