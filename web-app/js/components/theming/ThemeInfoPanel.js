Ext.define('Ozone.components.theming.ThemeInfoPanel', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.themeinfopanel',
    
	autoScroll: true,
	width: 532,
	minWidth: 300,
	
    tpl: [
        '<div id="header">',
            '<div id="theme-info">',
                '<span id="theme-name">{display_name}</span>',
                '<span id="author">{author}</span>',
                '<span id="contact">{contact_email}</span>',
                '<span id="created">Created {created_date}</span>',
                '<span id="modified">Modified {modified_date}</span>',
                '<p id="description">{description}</p>',
            '</div>',
        '</div>',
        '<div class="clear"></div>',
        '<fieldset id="screenshots">',
            '<legend>Preview</legend>',
            '<tpl if="screenshots.length &gt; 0">',
                '<tpl for="screenshots" />',
                    '<div class="screenshot">',
                        '<div class="screenshot-inner">',
                        '<img src="{url}" />',
                        '</div>',
                        '<div class="screenshot-desc">',
                        '<span>{description}</span>',
                    '</div>',
                    '</div>',
                '</tpl>',
            '</tpl>',
            '<tpl if="screenshots.length === 0">',
                '<p>No preview images found!</p>',
            '</tpl>',
        '</fieldset>'
    ],

    loadThemeInfo: function(theme) {
        this.tpl.overwrite(this.body, theme.data);
    }
});
