Ext.apply(Ext.History, {
  startUp: function () {
      var me = this;

      me.currentToken = me.hiddenField.value || this.getHash();

      if (me.oldIEMode) {
          me.checkIFrame();
      } else {
          var hash = me.getHash();
          this.task = Ext.TaskManager.start({
              run: function () {
                  var newHash = me.getHash();
                  if (newHash !== hash) {
                      hash = newHash;
                      me.handleStateChange(hash);
                      me.doSave();
                  }
              },
              interval: 50,
              scope: me
          });
          me.ready = true;
          me.fireEvent('ready', me);
      }

  },
  checkIFrame: function () {
    var me = this,
            contentWindow = me.iframe.contentWindow;

    if (!contentWindow || !contentWindow.document) {
      Ext.Function.defer(this.checkIFrame, 10, this);
      return;
    }

    var doc = contentWindow.document,
            elem = doc.getElementById("state"),
            oldToken = elem ? elem.innerText : null,
            oldHash = me.getHash();

    this.task = Ext.TaskManager.start({
      run: function () {
        var doc = contentWindow.document,
                elem = doc.getElementById("state"),
                newToken = elem ? elem.innerText : null,
                newHash = me.getHash();

        if (newToken !== oldToken) {
          oldToken = newToken;
          me.handleStateChange(newToken);
          window.top.location.hash = newToken;
          oldHash = newToken;
          me.doSave();
        } else if (newHash !== oldHash) {
          oldHash = newHash;
          me.updateIFrame(newHash);
        }
      },
      interval: 50,
      scope: me
    });
    me.ready = true;
    me.fireEvent('ready', me);
  },

  shutDown: function() {
    if (this.task != null) {
      Ext.TaskManager.stop(this.task);
      this.currentToken = null;
      this.hiddenField.value = null;
    }
  }

});
