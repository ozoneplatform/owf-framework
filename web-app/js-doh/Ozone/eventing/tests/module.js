dojo.provide("Ozone.eventing.tests.module");
//This file loads in all the test definitions.  

try{
    if(dojo.isBrowser){
          //todo use dojo.require - however async test timing maybe needed to be tweaked.
//        dojo.require('Ozone.eventing.tests.rpcLocalTests');
//        dojo.require('Ozone.eventing.tests.rpcRemoteTests');
//        dojo.require('Ozone.eventing.tests.pubSubLocalTests');
//        dojo.require('Ozone.eventing.tests.pubSubRemoteTests');
        //Define the HTML file/module URL to import as a 'remote' test.
        doh.registerUrl("Ozone.eventing.tests.rpcLocalTests",
                      dojo.moduleUrl("Ozone", "eventing/tests/rpcLocalTests.gsp"));
        doh.registerUrl("Ozone.eventing.tests.rpcRemoteTests",
                        dojo.moduleUrl("Ozone", "eventing/tests/rpcRemoteTests.gsp"));
        doh.registerUrl("Ozone.eventing.tests.pubSubLocalTests",
                        dojo.moduleUrl("Ozone", "eventing/tests/pubSubLocalTests.gsp"));
        doh.registerUrl("Ozone.eventing.tests.pubSubRemoteTests",
                        dojo.moduleUrl("Ozone", "eventing/tests/pubSubRemoteTests.gsp"));
//        doh.registerUrl("Ozone.eventing.tests.AllEventingTests",
//                dojo.moduleUrl("Ozone", "eventing/tests/AllEventingTests.html"));
    }
}catch(e){
	doh.debug(e);
}

