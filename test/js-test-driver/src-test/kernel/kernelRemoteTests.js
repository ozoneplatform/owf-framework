describe("kernelRemoteTest", function() {
  var serviceName = '_rpc_test';
  var container = null;

  var setupEventing = function() {
    Ozone.eventing.Container.init();
    container = Ozone.eventing.Container;
  };

  var setupWidget = function(url) {
    var widgetFrameId = null;
    var widget = null;
    var iframeTag = null;

    //this is a local test so use the same hostname
    //var altHostName = window.location.hostname;
    var altHostName = Ozone.config.alternateHostName ? Ozone.config.alternateHostName : '127.0.0.1';
    var port = window.location.port != '' ? ':' + window.location.port : '';

    widget = {
      id: guid.util.guid(),
      widgetGuid:  guid.util.guid(),
      url: window.location.protocol + "//" + (altHostName + port
              + url).replace(/\/{2,}/, '/')
    };
    var widgetFrameIdObj = container.generateIframeId(widget.id);
    widgetFrameId = Ozone.util.formatWindowNameData(widgetFrameIdObj);
    iframeTag = "<iframe " + container.getIframeProperties(widget.url, widget.id, widget, 'desktop', 1) + " width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"auto\"></iframe>";
    widget.iframeTag = iframeTag;

    return widget;
  };

  var writeContainer = function(divId) {
    var testDiv = Ext.get(divId);
    if (testDiv == null) {
      testDiv = Ext.getBody().createChild({id:divId}, null, true);
    }
    var tpl = new Ext.XTemplate(
            '<h>Kernel Remote RPC Tests</h>',
            '<div style="border: 2px solid black;">',
            '<h>Container</h>',
            '<div id="message"></div>',
            '<div id="widget_container" style="border: 2px solid black;">',
            '</div>',
            '</div>'
    );
    tpl.overwrite(testDiv, {});
  };

  var writeWidget = function(divId, iframeTag) {
    var testDiv = Ext.get("widget_container");
    var tpl = new Ext.XTemplate(
            '{divId}',
            '<div id="{divId}">',
            iframeTag,
            '</div>'
    );
    tpl.append(testDiv, {divId:divId});
  };

  it('communicates between widget1 and widget2', function() {
    setupEventing();

    var counter = 0;
    container.registerHandler(serviceName, function(msg, success) {
      Ext.get('message').dom.innerHTML += 'received message: <b>' + msg + '</b><br/>';
      expect(success).toBe(true);
      counter++;
    });

    var widget1 = setupWidget('/test/test/js-test-driver/src-test/kernel/widget1.html');
    var widget2 = setupWidget('/test/test/js-test-driver/src-test/kernel/widget2.html');

    writeContainer('testDiv');

    //mock out list widgets to know about the widgets that are to be created
    gadgets.rpc.register("LIST_WIDGETS", owfdojo.hitch(this, function () {
      var returnValue = [];
      returnValue.push({
        id: widget1.id,
        name: 'widget1'
      });
      returnValue.push({
        id: widget2.id,
        name: 'widget2'
      });
      return returnValue;
    }));


    //to avoid timing issues we'll write widget1 out after waiting 1 sec
    var waitedToWriteWidget1 = false;
    writeWidget('widget2', widget2.iframeTag);
    setTimeout(function() {
      waitedToWriteWidget1 = true;
    }, 1000);

    waitsFor(function() {
      return waitedToWriteWidget1;
    }, "Waiting 1 second before writing Widget1 out", 10000);


    //wait 1 second before writing widget1
    runs(function() {
      writeWidget('widget1', widget1.iframeTag);
    });

    waitsFor(function() {
      return counter == 2;
    }, "Widget1 only sent " + counter + " messages", 10000);


  });
});
