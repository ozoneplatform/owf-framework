Ext.define('Ozone.components.WidgetIframeComponent', {
    extend: 'Ext.Component',
    alias: ['widget.widgetiframe'],

//    plugins: [
//        new Ozone.components.focusable.Focusable('iframeEl')
//    ],

    //required
    iframeProperties: null,

    //renderTpl:  '<iframe {iframeProperties} ></iframe>',
    itemId: 'widgetIframe',
    
    initComponent : function() {

        var results = /id\s*=\s*"([^"]*)"/.exec(this.iframeProperties);
        if (results != null) {
          this.id = results[1];
        }

        results = /name\s*=\s*"([^"]*)"/.exec(this.iframeProperties);
        if (results != null) {
          this.name = results[1];
        }

        this.autoEl = {
            tag: 'iframe',
            //src is required
            src: /src\s*=\s*"([^"]*)"/.exec(this.iframeProperties)[1],
            frameBorder: 0 /* Improve appearance a bit */
        };
        if (this.name) {
          this.autoEl.name = this.name;
        }

        this.callParent(arguments);

        this.on('afterrender', function(cmp) {
            Ozone.KeyMap.bindWidgetEvents(cmp);
        });
    },

    clearSrc: function() {
        this.getEl().dom.src = 'about:blank';
    },

    isSrcCleared: function() {
        var el = this.getEl();
        if(!el) {
            return true;
        }
        return el.dom.src === 'about:blank';
    }
});
