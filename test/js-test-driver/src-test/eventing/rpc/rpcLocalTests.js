describe("rpcLocalTest", function() {
  var serviceName = '_rpc_test';
  var container = null;
  var widget = null;
  var widgetFrameId = null;
  var iframeTag = null;

    var setupWidget = function() {
      Ozone.eventing.Container.init();
      container = Ozone.eventing.Container;

      //this is a local test so use the same hostname
      var altHostName = window.location.hostname;
    //    var altHostName = Ozone.config.alternateHostName ? Ozone.config.alternateHostName : '127.0.0.1';
      var port = window.location.port != '' ? ':'+window.location.port : '';

      widget = {
          id: guid.util.guid(),
          widgetGuid:  guid.util.guid(),
          url: window.location.protocol + "//" + (altHostName + port
                  + '/test/test/js-test-driver/src-test/eventing/rpc/rpcWidget.html').replace(/\/{2,}/,'/')
      };
      var widgetFrameIdObj = container.generateIframeId(widget.id);
      widgetFrameId = Ozone.util.toString(widgetFrameIdObj);
      iframeTag = "<iframe " + container.getIframeProperties(widget.url, widget.id, widget,'desktop', 1) + " width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"auto\"></iframe>";
    };

    var writeWidget = function() {
      var testDiv = Ext.get('testDiv');
      if (testDiv == null) {
        testDiv = Ext.getBody().createChild({id:'testDiv'},null,true);
      }
        var tpl = new Ext.XTemplate(
            '<h>Eventing Local RPC Tests</h>',
            '<div style="border: 2px solid black;">',
                '<h>Container</h>',
                '<div id="message"></div>',
                '<div id="widget_container" style="border: 2px solid black;">',
                    'Widget',
                    '<div id="widget">',
                     iframeTag,
                    '</div>',
                '</div>',
            '</div>'
        );
      tpl.overwrite(testDiv,{});
    };

	it('widgetToContainerRPCTest', function() {
      var finished = false;

      setupWidget();

      container.registerHandler(serviceName, function(sender, msg) {
          //parse sender and see if the widget id is as expected
          var widgetId = Ozone.util.parseJson(sender);
          expect(widgetId.id).toBe(widget.id);
          expect(msg).toBe('I sent you a message from the widget!!!');
          Ext.get('message').dom.innerHTML='received message: <b>'+msg+'</b>';
          finished = true;
      });

      writeWidget();

      waitsFor(function() {
        return finished;
      }, "Message never received", 10000);

      runs(function() {
        finished = false;
        var msgFromContainer = 'this is a message from the container';
        gadgets.rpc.call(widgetFrameId,
                '_rpc_widget_test', function(msg) {
            //this callback will get the msg string from the rpcWidget
            expect(msg).toBe('rpc_widget_test:'+msgFromContainer);
            finished = true;

        }, 'rpcTestContainer', msgFromContainer);
      });

      waitsFor(function() {
        return finished;
      }, "Return data never received", 10000);

      //clean up dom nodes
//      this.after(function() {
//        Ext.get('testDiv').remove();
//      });

    });
});
