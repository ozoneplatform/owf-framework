Ext.define('Ozone.components.dashboarddesigner.LayoutType', {
	extend: 'Ozone.components.dashboarddesigner.DraggableView',
	alias: [
		'widget.dashboarddesignerlayouttype',
		'widget.Ozone.components.dashboarddesigner.LayoutType'
	],

	id: 'dashboard-designer-layout',

	itemSelector: '.layout',
	singleSelect: true,

	tpl: Ext.create('Ext.XTemplate',
		'<tpl for=".">',
			'<div class="layout" tabindex="0">',
				'<img height="100" width="100" src="{image}" alt="{imageBase}"></img>',
				'<p style="font-size:11px; text-align: center;">{imageTitle}</p>',
			'</div>',
		'</tpl>'
	),

	store: Ext.create ('Ext.data.Store', {
		model: 'Ozone.data.LayoutType',
		data: [
			{
				paneType:'accordionpane',
				displayName:Ozone.ux.DashboardMgmtString.accordion,
				image: 'images/dashboard-designer/accordion.png',
                imageBase: 'accordion',
                imageTitle: 'Accordion'
			},
			{
				paneType:'desktoppane',
				displayName:Ozone.ux.DashboardMgmtString.desktop,
				image: 'images/dashboard-designer/desktop.png',
                imageBase: 'desktop',
                imageTitle: 'Desktop'
			},
			{
				paneType:'portalpane',
				displayName:Ozone.ux.DashboardMgmtString.portal,
				image: 'images/dashboard-designer/portal.png',
                imageBase: 'portal',
                imageTitle: 'Portal'
			},
			{
				paneType:'tabbedpane',
				displayName:Ozone.ux.DashboardMgmtString.tabbed,
				image: 'images/dashboard-designer/tabbed.png',
                imageBase: 'tabbed',
                imageTitle: 'Tabbed'
			},
            {
                paneType:'fitpane',
                displayName:Ozone.ux.DashboardMgmtString.fit,
                image: 'images/dashboard-designer/fit.png',
                imageBase: 'fit',
                imageTitle: 'Fit'
            }
		]
	})
});