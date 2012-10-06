/**
 * Ozone.state.WidgetStateStoreProvider
 *
 * @description This is a stateprovider which is backed by a store
 */
Ext.define('Ozone.state.WidgetStateStoreProvider', {
    extend: 'Ext.state.Provider',
    
    constructor: function(config){
        this.callParent();
        Ext.apply(this, config);
    },
    store: null,
    
    /**
     * Clears a value from the state
     * @param {String} cfg
     */
    clear: function(cfg){
      if (Ext.isObject(cfg)) {
        var store = this.findStore(cfg.paneGuid);
        if (store && cfg.paneGuid) {
          //if the pos is a number switch to get
          if (Ext.isNumber(cfg.pos)) {
              return this.clearAt(cfg.pos,cfg);
          }
          //else use the uniqueId
          else {
              return this.clearById(cfg.uniqueId,cfg);
          }
        }
      }
    },
    
    /**
     * Clears a value from the state
     * @param {String} id The key name
     */
    clearById: function(id, cfg){
        var store = this.findStore(cfg.paneGuid);
        if (store) {
            var rec = store.getById(id);
            if (rec) {
              store.remove(rec);
              this.fireEvent("statechange", this, cfg.uniqueId, null);
            }
        }
    },
    
    /**
     * Clears a value from the state
     * @param {String} pos position
     */
    clearAt: function(pos, cfg){
        var store = this.findStore(cfg.paneGuid);
        if (store) {
            store.removeAt(pos);
            this.fireEvent("statechange", this, name, null);
        }
    },
    
    get: function(id, defaultValue){
    
        //if the id is a number switch to get
        if (Ext.isNumber(id)) {
            return this.getAt(id);
        }
        else {
            return this.getById(id, defaultValue);
        }
    },

    getById: function(id, defaultValue){
        //if there is no store then there is no saved state simply return undefined
        if (this.lastUsedStore != null && !this.lastUsedStore.isDestroyed) {
          return this.lastUsedStore.getById(id) == null ? defaultValue : this.lastUsedStore.getById(id).data;
        }
    },
    
    getAt: function(pos, defaultValue){
      //if there is no store then there is no saved state simply return undefined
      if (this.lastUsedStore != null && !this.lastUsedStore.isDestroyed) {
        return this.lastUsedStore.getAt(pos) == null ? defaultValue : this.lastUsedStore.getAt(pos).data;
      }
    },
    
    getByStore: function(storeId, id, defaultValue){
        var store = this.findStore(storeId);
        if (store) {
          return this.get(id,defaultValue);
        }
    },

    setAt: function(pos, value){
        var store = this.findStore(value.paneGuid);
        if (store && value.paneGuid) {
            store.removeAt(pos);
            store.insert(pos, [value]);
            this.fireEvent("statechange", this, pos, value);
        }
    },
    
    set: function(id, value){
        if (value === null) {
            this.clear(value.paneGuid, id);
            return;
        }

        //if the id is a number switch to setAt
        if (Ext.isNumber(id)) {
            this.setAt(id, value);
        }
        else {
            this.setById(id, value);
        }
    },
    
    setById: function(id, value){
        var store = this.findStore(value.paneGuid);
        if (store && value.paneGuid) {
            store.remove(store.getById(id));
            store.add(value);
//            var rec = store.getById(id);
//            if (rec != null) {
//              rec.data = value;
//              rec.setDirty(true);
//            }
//            else {
//              store.add(value);
//            }
            this.fireEvent("statechange", this, id, value);
        }
    },
    
    
    getStore: function(){
        return this.lastUsedStore;
    },
    
    setStore: function(store){
        return this.lastUsedStore = store;
    },
    
    findStore: function(id){
        var s = Ext.data.StoreManager.get(id);
        if (s) {
            this.lastUsedStore = s;
            return s;
        }
        return this.lastUsedStore;
    }
});