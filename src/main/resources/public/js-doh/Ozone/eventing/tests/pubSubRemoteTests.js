dojo.provide("Ozone.eventing.tests.pubSubRemoteTests");
//This file loads in all the test definitions.  

try{
    if(dojo.isBrowser){
        //Define the HTML file/module URL to import as a 'remote' test.
        doh.registerUrl("Ozone.eventing.tests.pubSubRemoteTests",
                        dojo.moduleUrl("Ozone", "eventing/tests/pubSubRemoteTests.gsp"));
    }
}catch(e){
	doh.debug(e);
}

