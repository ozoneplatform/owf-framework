Ext.define('Ozone.components.dashboarddesigner.BaseLayout', {
	extend: 'Ozone.components.dashboarddesigner.DraggableView',
	alias: [
		'widget.dashboarddesignerbaselayout',
		'widget.Ozone.components.dashboarddesigner.BaseLayout'
	],

	id: 'dashboard-designer-base-layout',

	itemSelector: '.layout-type',
	singleSelect: true,

	tpl: Ext.create('Ext.XTemplate',
		'<tpl for=".">',
			'<div class="layout-type" tabindex="0">',
				'<img height="100" width="100" src="{image}"></img>',
			'</div>',
		'</tpl>'
	),

	store: Ext.create('Ext.data.Store', {
		fields: ['type', 'displayName', 'image', 'classes'],
		data: [
			{
				type: 'vbox',
				displayName: 'Horizontal Divider',
				image: 'images/dashboard-designer/vbox.png',
				classes: ['top', 'bottom']
			},
			{
				type: 'hbox',
				displayName: 'Vertical Divider',
				image: 'images/dashboard-designer/hbox.png',
				classes: ['left', 'right']
			}
		]
	})
});
