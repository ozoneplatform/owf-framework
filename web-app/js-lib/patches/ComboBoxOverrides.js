// TODO: review this when upgrading EXT
// Added for a bug in Ext 4.0.7

Ext.override(Ext.form.field.ComboBox, {
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