Ext.define('Ozone.components.draggable.DraggableWidgetView', {
	extend: 'Ext.AbstractPlugin',

	itemSelector: null,
	dragNodeSelector: null,

	cmpToHideAndShow: null,
	dashboardContainer: null,
	showAfterLaunch: null,

	init: function(cmp) {
		cmp.on('afterrender', this.setupDragZone, this, { single: true });
		cmp.on('destroy', this.cleanup, this);
	},

	cleanup: function() {
		this.dragZone.unreg();
	},

	// set up drag zone
	setupDragZone: function(view) {
		this.dragZone = new Ext.dd.DragZone(view.getEl(), {
			isTarget: false,
			panes: null,
			ddGroup: 'widgets',
			itemSelector: this.itemSelector,
			dragNodeSelector: this.dragNodeSelector,

			getDragData: function(event) {
				var target = event.getTarget(this.itemSelector),
					targetEl, view;
				if(target) {
					targetEl = Ext.get(target);
					view = Ext.getCmp(targetEl.parent().id);

					return {
						ddel: targetEl.down(this.dragNodeSelector).dom.cloneNode(true),
						widgetModel: [view.getRecord(target)]
					};
				}
			},

			onStartDrag: Ext.bind(this.onStartDrag, this),
			afterValidDrop: Ext.bind(this.afterDrop, this),
			afterInvalidDrop: Ext.bind(this.afterDrop, this)
		});

		this.dashboardContainer = view.dashboardContainer;
		this.cmpToHideAndShow = view.isXType('window') ? view : view.up('window');
	},

	onStartDrag: function() {
		this.dashboardContainer.activeDashboard.enableWidgetDragAndDrop();
		this.cmpToHideAndShow.hide();
		this.showAfterLaunch && this.dashboardContainer.activeDashboard.on(OWF.Events.Widget.AFTER_LAUNCH, this.showWindow, this);
	},

	afterDrop: function() {
		this.dashboardContainer.activeDashboard.disableWidgetDragAndDrop();
	},

	showWindow: function() {
		this.dashboardContainer.activeDashboard.un(OWF.Events.Widget.AFTER_LAUNCH, this.showWindow, this);
		this.cmpToHideAndShow.show();
	}

});