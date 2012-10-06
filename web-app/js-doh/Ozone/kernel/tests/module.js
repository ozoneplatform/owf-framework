dojo.provide("Ozone.kernel.tests.module");

try{
    if(dojo.isBrowser){
        //doh.registerUrl("Ozone.kernel.tests.kernelTests", dojo.moduleUrl("Ozone", "kernel/tests/kernelTests.html"));
        doh.registerUrl("Ozone.kernel.tests.apiTests",    dojo.moduleUrl("Ozone", "kernel/tests/apiTests.html"));
    }
}catch(e){
	doh.debug(e);
}

