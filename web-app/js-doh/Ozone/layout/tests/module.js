dojo.provide("Ozone.layout.tests.module");
//This file loads in all the test definitions.  

try{
	//Load in the demoFunctions module test.
//	dojo.require("Ozone.eventing.tests.functions.demoFunctions");
	//Load in the widget tests.
//	dojo.require("Ozone.eventing.tests.widgets.DemoWidget");

    if(dojo.isBrowser){
        //Define the HTML file/module URL to import as a 'remote' test.
        doh.registerUrl("Ozone.layout.tests.AllLayoutTests",
                      dojo.moduleUrl("Ozone", "layout/tests/AllLayoutTests.html"));
    }
}catch(e){
	doh.debug(e);
}