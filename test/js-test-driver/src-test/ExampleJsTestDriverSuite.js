TestCase("ExampleJsTestDriverSuite", {
//    setUp: function() {
//
//    },
//    tearDown: function() {
//
//    },

    testA:function(){
      jstestdriver.console.log("JsTestDriver", "Hello World!");
      assertTrue('asserting true!',true);
    },
    testB:function(){
      jstestdriver.console.log("JsTestDriver", "Hello World!");
      jstestdriver.console.log("JsTestDriver", "Inserting foo in the page");
      /*:DOC foo = <div><p>foo</p></div>*/
    }
});