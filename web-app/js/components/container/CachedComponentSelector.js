Ext.define('Ozone.components.container.CachedComponentSelector', {

  //cache components that are searched for
  up: function(selector) {
    if (this.cmpCache == null) {
      this.cmpCache = Ext.create('Ext.util.MixedCollection');
    }

    var cmp = this.cmpCache.getByKey(selector);
    if (cmp == null) {
      cmp = this.callParent(arguments);
      if (cmp != null) {
        this.cmpCache.add(selector, cmp);
      }
    }

    return cmp;
  },

  //cache components that are searched for
  down: function(selector) {
    if (this.cmpCache == null) {
      this.cmpCache = Ext.create('Ext.util.MixedCollection');
    }

    var cmp = this.cmpCache.getByKey(selector);
    if (cmp == null) {
      cmp = this.callParent(arguments);
      if (cmp != null) {
        this.cmpCache.add(selector, cmp);
      }
    }

    return cmp;
  }

});