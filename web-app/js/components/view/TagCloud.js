Ext.define('Ozone.components.view.TagCloud', {
    extend: 'Ozone.components.focusable.FocusableView',
    alias: 'widget.tagcloud',

    cls: 'tagCloud',

    minFont: 0.8,
    maxFont: 2.5,

    initComponent: function () {
        var me = this;

        if (me.store == null) {
            me.store = Ext.create("Ext.data.Store", {
                fields: [
                    {name: 'tag'},
                    {name: 'uses', type: 'int'}
                ]
            });
        }
        me.minTagUses = me.store.min('uses');
        me.maxTagUses = me.store.max('uses');

        me.tpl = new Ext.XTemplate(
                '<tpl for=".">',
                '<div class="tag">',
                '<span style="font-size:{[this.calculateFontSize(values)]}">{tag:htmlEncode}</span>',
                '</div>',
                '</tpl>',
                {

                    calculateFontSize: function (values) {
                        return this.fs(values) + 'em';
                    },
                    fs: function(values) {
                        var constant = Math.log(me.maxTagUses - (me.minTagUses - 1)) / (me.maxFont - me.minFont);
                        var fontSize = me.minFont;

                        if (constant > 0) {
                            fontSize = Math.log(values.uses - (me.minTagUses - 1)) / constant + me.minFont;
                        }

                        return fontSize;
                    }
                }
        );

        me.callParent();
    },

    refresh: function () {
        var me = this;

        me.minTagUses = me.store.min('uses');
        me.maxTagUses = me.store.max('uses');

        me.callParent();
    }
});