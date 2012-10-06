dojo.provide("Ozone.chrome.tests.module");
//This file loads in all the test definitions.  

try{
    if(dojo.isBrowser){
        doh.registerUrl("Ozone.chrome.tests.WidgetChromeRemoteTests",
                      dojo.moduleUrl("Ozone", "chrome/tests/WidgetChromeRemoteTests.gsp"));
    }
}catch(e){
	doh.debug(e);
}