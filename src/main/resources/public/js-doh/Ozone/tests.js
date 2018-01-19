dojo.provide("Ozone.tests");
//This file loads in all the test definitions.  

try{
	if(dojo.isBrowser){
		//in browser only tests here
//		dojo.require('Ozone.admin.tests.module');
//		dojo.require('Ozone.apis.tests.module');
		dojo.require('Ozone.chrome.tests.module');
//		dojo.require('Ozone.components.tests.module');
//		dojo.require('Ozone.data.tests.module');
//		dojo.require('Ozone.dd.tests.module');
		dojo.require('Ozone.eventing.tests.module');
//		dojo.require('Ozone.lang.tests.module');
//		dojo.require('Ozone.launcher.tests.module');
//		dojo.require('Ozone.layout.tests.module');
//		dojo.require('Ozone.marketplace.tests.module');
		dojo.require('Ozone.pref.tests.module');
//		dojo.require('Ozone.prefs.tests.module');
		dojo.require('Ozone.state.tests.module');
//		dojo.require('Ozone.util.tests.module');
//		dojo.require('Ozone.ux.tests.module');
		dojo.require('Ozone.widget.tests.module');
	}
}catch(e){
	doh.debug(e);
}

