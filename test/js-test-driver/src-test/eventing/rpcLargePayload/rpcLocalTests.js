describe("rpcLocalLargePayloadTest", function() {
  var serviceName = '_rpc_test';
  var container = null;
  var widget = null;
  var widgetFrameId = null;
  var iframeTag = null;
  var largePayload = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris. Praesent adipiscing. Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy metus. Vestibulum volutpat pretium libero. Cras id dui. Aenean ut eros et nisl sagittis vestibul";

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
                  + '/test/test/js-test-driver/src-test/eventing/rpcLargePayload/rpcWidget.html').replace(/\/{2,}/,'/')
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
            '<h>Eventing Local RPC Large Payload Tests</h>',
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

	it('sends a large message between widget and container', function() {
      var finished = false;

      setupWidget();

      container.registerHandler(serviceName, function(sender, msg) {
          //parse sender and see if the widget id is as expected
          var widgetId = Ozone.util.parseJson(sender);
          expect(widgetId.id).toBe(widget.id);
          expect(msg).toBe(largePayload);
          Ext.get('message').dom.innerHTML='received message: <b>'+msg+'</b>';
          finished = true;
      });

      writeWidget();

      waitsFor(function() {
        return finished;
      }, "Message never received", 10000);

      runs(function() {
        finished = false;
        gadgets.rpc.call(widgetFrameId,
                '_rpc_widget_test', function(msg) {
            //this callback will get the msg string from the rpcWidget
            expect(msg).toBe('rpc_widget_test:'+largePayload);
            finished = true;

        }, 'rpcTestContainer', largePayload);
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
