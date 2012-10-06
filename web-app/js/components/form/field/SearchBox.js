/**
 * @class Ozone.components.SearchBox
 * @extends Ext.form.Text
 */
Ext.define('Ozone.components.form.field.SearchBox', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.searchbox',

    emptyText: 'Search...',

    fieldSubTpl: [
            '<span class="magnifier-btn search-img" ></span>',
            '<input type="text" id="{id}" ',
                '<tpl if="name">name="{name}" </tpl>',
                '<tpl if="tabIdx">tabIndex="{tabIdx}" </tpl>',
                'autocomplete="off" />',

            '<span class="clear-btn search-img" id="{id}-clearEl"></span>',
        {
            compiled: true, 
            disableFormats: true
        }
    ],

    fieldBodyCls: 'search',

    //any smaller and the images fail to show up
    minHeight: 20,
    
    componentLayout: 'searchbox',

    dynamic: false,

    //in ms
    searchChangedEventDelay: 200,

    initComponent: function() {
        this.addChildEls({name: 'clearEl', id: this.getInputId() + '-clearEl' });
        this.callParent(arguments);

        function initClearEl(cmp) {
            cmp.mon(cmp.clearEl, 'click', function() {
                this.onClear();
            }, cmp);

            cmp.clearKeyMap = new Ext.util.KeyMap(cmp.clearEl, {
                key: [Ext.EventObject.ENTER, Ext.EventObject.SPACE],
                handler: function (key, evt) {
                    evt.stopPropagation();
                    this.onClear();
                },
                scope: cmp
            });

            //add focusability to the close button
            Ozone.components.focusable.Focusable.setupFocus(cmp.clearEl, cmp);

            //add mouse hover effect
            cmp.clearEl.hover(function() {
                this.addCls('clear-btn-over');
            }, function() {
                this.removeCls('clear-btn-over');
            }, cmp.clearEl);

        }

        this.on('afterrender', function(cmp) {
            initClearEl(cmp);

            cmp.keymap = new Ext.util.KeyMap(cmp.inputEl, {
                key: Ext.EventObject.ENTER,
                handler: function() {
                    this.fireSearchChanged();
                },
                scope: cmp
            });

            var delayedSearchChanged = new Ext.util.DelayedTask(function(){
                cmp.fireSearchChanged();
            });
            if(cmp.dynamic){
                cmp.inputEl.on("keyup", function(e, t) {
                    delayedSearchChanged.delay(cmp.searchChangedEventDelay);
                })
            }

            //make the implicit height explicit. 
            //this is necessary in order for the height: 100%
            //on the child elements to work
            cmp.setHeight(cmp.getHeight());
        });

        this.on('destroy', function(cmp) {
            cmp.clearKeyMap.destroy();
            cmp.keymap.destroy();
        });

        this.addEvents('searchChanged');
    },

    onClear: function() {
        this.setValue('');
        this.clearInvalid();
        this.inputEl.focus();

        this.fireSearchChanged();
    },

    fireSearchChanged: function() {
        this.fireEvent('searchChanged', this, this.getValue());
    }

});
