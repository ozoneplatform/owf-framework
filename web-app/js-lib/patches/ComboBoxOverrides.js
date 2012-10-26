// TODO: review this when upgrading EXT
// Added for a bug in Ext 4.0.7

Ext.override(Ext.form.field.ComboBox, {

    initComponent: function() {
        var me = this,
            isDefined = Ext.isDefined,
            store = me.store,
            transform = me.transform,
            transformSelect, isLocalMode;

        Ext.applyIf(me.renderSelectors, {
            hiddenDataEl: '.' + me.hiddenDataCls.split(' ').join('.')
        });
        
        //<debug>
        if (me.typeAhead && me.multiSelect) {
            Ext.Error.raise('typeAhead and multiSelect are mutually exclusive options -- please remove one of them.');
        }
        if (me.typeAhead && !me.editable) {
            Ext.Error.raise('If typeAhead is enabled the combo must be editable: true -- please change one of those settings.');
        }
        if (me.selectOnFocus && !me.editable) {
            Ext.Error.raise('If selectOnFocus is enabled the combo must be editable: true -- please change one of those settings.');
        }
        //</debug>

        this.addEvents(
            /**
             * @event beforequery
             * Fires before all queries are processed. Return false to cancel the query or set the queryEvent's cancel
             * property to true.
             *
             * @param {Object} queryEvent An object that has these properties:
             *
             *   - `combo` : Ext.form.field.ComboBox
             *
             *     This combo box
             *
             *   - `query` : String
             *
             *     The query string
             *
             *   - `forceAll` : Boolean
             *
             *     True to force "all" query
             *
             *   - `cancel` : Boolean
             *
             *     Set to true to cancel the query
             */
            'beforequery',

            /**
             * @event select
             * Fires when at least one list item is selected.
             * @param {Ext.form.field.ComboBox} combo This combo box
             * @param {Array} records The selected records
             */
            'select',

            /**
             * @event beforeselect
             * Fires before the selected item is added to the collection
             * @param {Ext.form.field.ComboBox} combo This combo box
             * @param {Ext.data.Record} record The selected record
             * @param {Number} index The index of the selected record
             */
            'beforeselect',

            /**
             * @event beforedeselect
             * Fires before the deselected item is removed from the collection
             * @param {Ext.form.field.ComboBox} combo This combo box
             * @param {Ext.data.Record} record The deselected record
             * @param {Number} index The index of the deselected record
             */
            'beforedeselect'
        );

        // Build store from 'transform' HTML select element's options
        if (transform) {
            transformSelect = Ext.getDom(transform);
            if (transformSelect) {
                store = Ext.Array.map(Ext.Array.from(transformSelect.options), function(option) {
                    return [option.value, option.text];
                });
                if (!me.name) {
                    me.name = transformSelect.name;
                }
                if (!('value' in me)) {
                    me.value = transformSelect.value;
                }
            }
        }

        me.bindStore(store || 'ext-empty-store', true);
        store = me.store;
        if (store.autoCreated) {
            me.queryMode = 'local';
            me.valueField = me.displayField = 'field1';
            if (!store.expanded) {
                me.displayField = 'field2';
            }
        }


        if (!isDefined(me.valueField)) {
            me.valueField = me.displayField;
        }

        isLocalMode = me.queryMode === 'local';
        if (!isDefined(me.queryDelay)) {
            me.queryDelay = isLocalMode ? 10 : 500;
        }
        if (!isDefined(me.minChars)) {
            me.minChars = isLocalMode ? 0 : 4;
        }

        if (!me.displayTpl) {
            me.displayTpl = Ext.create('Ext.XTemplate',
                '<tpl for=".">' +
                    '{[typeof values === "string" ? values : values["' + me.displayField + '"]]}' +
                    '<tpl if="xindex < xcount">' + me.delimiter + '</tpl>' +
                '</tpl>'
            );
        } else if (Ext.isString(me.displayTpl)) {
            me.displayTpl = Ext.create('Ext.XTemplate', me.displayTpl);
        }

        me.callParent();

        me.doQueryTask = Ext.create('Ext.util.DelayedTask', me.doRawQuery, me);

        // store has already been loaded, setValue
        if (me.store.getCount() > 0) {
            me.setValue(me.value);
        }

        // render in place of 'transform' select
        if (transformSelect) {
            me.render(transformSelect.parentNode, transformSelect);
            Ext.removeNode(transformSelect);
            delete me.renderTo;
        }

        //PATCH begin
        //Setting the tpl explicitly to use html encoding before displaying
        me.tpl = new Ext.XTemplate(
            '<tpl for=".">',
                '<div class="x-boundlist-item">',
                    '{' + me.displayField + ':htmlEncode}',
                '</div>',
            '</tpl>'
        );
        //PATCH end
    },

    setHiddenValue: function(values){
        var me = this, i;
        if (!me.hiddenDataEl) {
            return;
        }
        values = Ext.Array.from(values);
        var dom = me.hiddenDataEl.dom,
            childNodes = dom.childNodes,
            input = childNodes[0],
            valueCount = values.length,
            childrenCount = childNodes.length;
 
        if (!input && valueCount > 0) {
            me.hiddenDataEl.update(Ext.DomHelper.markup({tag:'input', type:'hidden', name:me.name + "-hidden"}));
            childrenCount = 1;
            input = dom.firstChild;
        }
        while (childrenCount > valueCount) {
            dom.removeChild(childNodes[0]);
            -- childrenCount;
        }
        while (childrenCount < valueCount) {
            dom.appendChild(input.cloneNode(true));
            ++ childrenCount;
        }   
        for (i = 0; i < valueCount; i++) {
            childNodes[i].value = values[i];
        }
    }
});