dojo.provide("Ozone.eventing.tests.rpcRemoteTests");
//This file loads in all the test definitions.  

try{
    if(dojo.isBrowser){
        //Define the HTML file/module URL to import as a 'remote' test.
        doh.registerUrl("Ozone.eventing.tests.rpcRemoteTests",
                        dojo.moduleUrl("Ozone", "eventing/tests/rpcRemoteTests.gsp"));
    }
}catch(e){
	doh.debug(e);
}

