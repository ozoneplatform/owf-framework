Ext.define('Ozone.data.OWFStore', {
  extend:'Ext.data.Store',
  remoteSort: true,
  constructor: function(config) {

    config = config ? config : {};

    var reader_root = ((config.reader && config.reader.root) ? config.reader.root : 'data');
    var writer_root = ((config.writer && config.writer.root) ? config.writer.root : 'data');

    if (this.proxy == null) {
      this.proxy = this.proxy || {};
      Ext.apply(this.proxy, {
        type: 'owftransportproxy',
        limitParam: 'max',
        pageParam: undefined,
        startParam: 'offset',
        simpleSortMode: true,
        sortParam: 'sort',
        directionParam: 'order',
        reader: {
          type: 'json',
          root: reader_root,
          totalProperty: 'results'
        },
        writer: {
          type: 'json',
          allowSingle: false,
          encode: true,
          root: writer_root
        }
      });

      //short cut properties to be applied on the proxy
      if (config.api) {
        Ext.copyTo(this.proxy, config, 'api');
      }
      if (config.methods) {
        Ext.copyTo(this.proxy, config, 'methods');
      }
      if (config.updateActions) {
        Ext.copyTo(this.proxy, config, 'updateActions');
      }

      //if a proxy was supplied copy its properties in
      if (config.proxy != null) {
        Ext.apply(this.proxy, config.proxy);
      }
    }

    this.callParent(arguments);

    //add default exception listener if one was not already added
    if (!this.proxy.hasListener('exception') && this.enableDefaultExceptionListener) {
      this.proxy.on({
        exception: {
          fn: function(proxy, response, operation, eOpts) {
            try {
              var json = (typeof response) == 'string' ? Ext.util.JSON.decode(response) : response;
            }
            catch(e) {
              json = {
                errorMsg: response
              }
            }
            Ext.Msg.alert("Server Error!",
                    'Error during ' + operation.action + (json && json.errorMsg ? (':\n ' + json.errorMsg) : ''),
                    function() {
//                      if (this.reloadOnError) this.reload();
                    },
                    this);
          },
          scope: this
        }
      });
    }
  }});