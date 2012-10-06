dojo.provide("Ozone.dd.tests.module");
//This file loads in all the test definitions.  

try{
	//Load in the demoFunctions module test.
//	dojo.require("Ozone.eventing.tests.functions.demoFunctions");
	//Load in the widget tests.
//	dojo.require("Ozone.eventing.tests.widgets.DemoWidget");

    if(dojo.isBrowser){
        //Define the HTML file/module URL to import as a 'remote' test.
        doh.registerUrl("Ozone.dd.tests.AllDdTests",
                      dojo.moduleUrl("Ozone", "dd/tests/AllDdTests.html"));
    }
}catch(e){
	doh.debug(e);
}