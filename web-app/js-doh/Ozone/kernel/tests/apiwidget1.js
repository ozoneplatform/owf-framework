console.log("XXXXXXXXXXXXXXXxWidget seems to have loaded");

function init() {
  console.log("XXXXXXXXXXXXXXXxInitializing");
  Ozone.eventing.clientInitialize({
    name: 'hello',
    fn: function hello() {
      return "Hello world";
    }
  });
}

Ozone.eventing.handleDirectMessage = function(payload) {
  function onfound(widget) {
    widget.add(2,3, function(result) {
        if(result == 5) {
          gadgets.rpc.call("..", "TEST_RESULT", null, true);
        }
    });
  }
  Ozone.eventing.importWidget("awidget2", onfound);
}