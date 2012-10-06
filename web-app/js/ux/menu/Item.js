Ext.define('Owf.menu.Item', {
    extend: 'Ext.menu.Item',
    alias: 'widget.owfmenuitem',
    renderTpl: [
        '<tpl if="plain">',
            '{text}',
        '</tpl>',
        '<tpl if="!plain">',
            '<a id="{id}-itemEl" class="' + Ext.baseCSSPrefix + 'menu-item-link" style="padding-left: 5px;" href="{href}" <tpl if="hrefTarget">target="{hrefTarget}"</tpl> hidefocus="true" unselectable="on">',
                '<span id="{id}-textEl" class="' + Ext.baseCSSPrefix + 'menu-item-text" <tpl if="menu">style="margin-right: 17px;"</tpl> >{text}</span>',
                '<tpl if="menu">',
                    '<img id="{id}-arrowEl" src="' + (Ext.isIE ? "../themes/owf-ext-theme/resources/themes/images/owf-ext/s.gif" : "data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==") + '" class="' + Ext.baseCSSPrefix + 'menu-item-arrow" />',
                '</tpl>',
            '</a>',
        '</tpl>'
    ]
});