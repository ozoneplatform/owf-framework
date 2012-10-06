dojo.provide("Ozone.eventing.tests.pubSubLocalTests");
//This file loads in all the test definitions.  

try{
    if(dojo.isBrowser){
        //Define the HTML file/module URL to import as a 'remote' test.
        doh.registerUrl("Ozone.eventing.tests.pubSubLocalTests",
                        dojo.moduleUrl("Ozone", "eventing/tests/pubSubLocalTests.gsp"));
    }
}catch(e){
	doh.debug(e);
}

