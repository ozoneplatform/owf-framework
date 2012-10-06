dojo.provide("Ozone.components.tests.module");
//This file loads in all the test definitions.  

try{
	//Load in the demoFunctions module test.
//	dojo.require("Ozone.eventing.tests.functions.demoFunctions");
	//Load in the widget tests.
//	dojo.require("Ozone.eventing.tests.widgets.DemoWidget");

    if(dojo.isBrowser){
        //Define the HTML file/module URL to import as a 'remote' test.
        //doh.registerUrl("Ozone.components.tests.CarouselPanelTests",
        //              dojo.moduleUrl("Ozone", "components/tests/CarouselPanelTests.html"));
        //doh.registerUrl("Ozone.components.tests.ApproveWidgetsPanelTests",
        //        dojo.moduleUrl("Ozone", "components/tests/ApproveWidgetsPanelTests.html"));
        doh.registerUrl("Ozone.components.tests.AllComponentsTests",
                dojo.moduleUrl("Ozone", "components/tests/AllComponentsTests.html"));
        doh.registerUrl("Ozone.components.tests.AllComponentsTests3",
                dojo.moduleUrl("Ozone", "components/tests/AllComponentsTests-3.html"));
    }
}catch(e){
	doh.debug(e);
}