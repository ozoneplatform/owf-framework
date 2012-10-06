dojo.provide("Ozone.pref.tests.module");
//This file loads in all the test definitions.  

try{
	//Load in the demoFunctions module test.
//	dojo.require("Ozone.eventing.tests.functions.demoFunctions");
	//Load in the widget tests.
//	dojo.require("Ozone.eventing.tests.widgets.DemoWidget");

    if(dojo.isBrowser){
        //Define the HTML file/module URL to import as a 'remote' test.
//        doh.registerUrl("Ozone.pref.tests.prefAPILocalTests",
//                      dojo.moduleUrl("Ozone", "pref/tests/prefAPILocalTests.html"));
//        doh.registerUrl("Ozone.pref.tests.prefLocalTests",
//                dojo.moduleUrl("Ozone", "pref/tests/prefLocalTests.html"));
//        doh.registerUrl("Ozone.pref.tests.prefRemoteTests",
//                    dojo.moduleUrl("Ozone", "pref/tests/prefRemoteTests.html"));

      doh.registerUrl("Ozone.pref.tests.prefLocalSetUserPreferenceTest",
              dojo.moduleUrl("Ozone", "pref/tests/prefLocalSetUserPreferenceTest.html"));
      doh.registerUrl("Ozone.pref.tests.prefLocalGetUserPreferenceTest",
              dojo.moduleUrl("Ozone", "pref/tests/prefLocalGetUserPreferenceTest.html"));
      doh.registerUrl("Ozone.pref.tests.prefLocalDeleteUserPreferenceTest",
              dojo.moduleUrl("Ozone", "pref/tests/prefLocalDeleteUserPreferenceTest.html"));
      doh.registerUrl("Ozone.pref.tests.prefLocalGetUserPreferenceDoesntExistTest",
              dojo.moduleUrl("Ozone", "pref/tests/prefLocalGetUserPreferenceDoesntExistTest.html"));
      doh.registerUrl("Ozone.pref.tests.prefLocalDeleteUserPreferenceDoesntExistTest",
              dojo.moduleUrl("Ozone", "pref/tests/prefLocalDeleteUserPreferenceDoesntExistTest.html"));

      doh.registerUrl("Ozone.pref.tests.prefRemoteSetUserPreferenceTest",
              dojo.moduleUrl("Ozone", "pref/tests/prefRemoteSetUserPreferenceTest.html"));
      doh.registerUrl("Ozone.pref.tests.prefRemoteGetUserPreferenceTest",
              dojo.moduleUrl("Ozone", "pref/tests/prefRemoteGetUserPreferenceTest.html"));
      doh.registerUrl("Ozone.pref.tests.prefRemoteDeleteUserPreferenceTest",
              dojo.moduleUrl("Ozone", "pref/tests/prefRemoteDeleteUserPreferenceTest.html"));
      doh.registerUrl("Ozone.pref.tests.prefRemoteGetUserPreferenceDoesntExistTest",
              dojo.moduleUrl("Ozone", "pref/tests/prefRemoteGetUserPreferenceDoesntExistTest.html"));
      doh.registerUrl("Ozone.pref.tests.prefRemoteDeleteUserPreferenceDoesntExistTest",
              dojo.moduleUrl("Ozone", "pref/tests/prefRemoteDeleteUserPreferenceDoesntExistTest.html"));


//        doh.registerUrl("Ozone.pref.tests.AllPrefTests",
//                dojo.moduleUrl("Ozone", "pref/tests/AllPrefTests.html"));
    }
}catch(e){
	doh.debug(e);
}

