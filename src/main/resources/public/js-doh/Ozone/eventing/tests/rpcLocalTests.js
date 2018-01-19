dojo.provide("Ozone.eventing.tests.rpcLocalTests");
//This file loads in all the test definitions.  

try{
    if(dojo.isBrowser){
        //Define the HTML file/module URL to import as a 'remote' test.
        doh.registerUrl("Ozone.eventing.tests.rpcLocalTests",
                        dojo.moduleUrl("Ozone", "eventing/tests/rpcLocalTests.gsp"));
    }
}catch(e){
	doh.debug(e);
}

