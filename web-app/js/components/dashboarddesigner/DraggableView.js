Ext.define('Ozone.components.dashboarddesigner.DraggableView', {
	extend: 'Ozone.components.focusable.FocusableView',
	alias: [
		'widget.dashboarddesignerbaselayoutdraggableview',
		'widget.Ozone.components.dashboarddesigner.DraggableView'
	],

	initComponent: function() {
		var me = this;

		me.on('viewready', me.setup, me, {single: true});
		me.on('destroy', me.cleanUp, me);
		me.on('keyup', me.keyup, me, { element: 'el' });
        me.on('click', me.click, me, { element: 'el' });
        me.on('mouseover', me.mouseover, me, { element: 'el' });
        me.on('mouseout', me.mouseout, me, { element: 'el' });
        me.on('mousedown', me.mousedown, me, { element: 'el' });
        me.on('mouseup', me.mouseup, me, { element: 'el' });
		
		me.addEvents(
			'enterpress',
            'buttonclick'
		);
		me.enableBubble(['enterpress','buttonclick']);
		
		me.callParent(arguments);
	},

	keyup: function(evt, dom) {
		var item = dom,
			record = this.getRecord(item);

		if(evt.getKey() === Ext.EventObject.ENTER)
			this.fireEvent('enterpress', this, record, item);
	},

    click: function(evt, dom) {
        var item = dom.parentElement,
            record = this.getRecord(item);

        this.fireEvent('buttonclick', this, record, item);
    },

    mouseover: function(evt, dom) {
        this.fireEvent('mouseover', dom);
    },

    mouseout: function(evt, dom) {
        this.fireEvent('mouseout', dom);
    },

    mousedown: function(evt, dom) {
        this.fireEvent('mousedown', dom);
    },

    mouseup: function(evt, dom) {
        this.fireEvent('mouseup', dom);
    },

	setup: function(view) {
		var me = this;

		me.tip = Ext.create('Ext.tip.ToolTip', {
            target: view.el,
            delegate: view.itemSelector,
            trackMouse: true,
            renderTo: view.el,
            mouseOffset: [0,10],
            listeners: {
                beforeshow: function updateTipBody(tip) {
                    tip.update(view.getRecord(tip.triggerElement).get('displayName'));
                }
            }
        });

		// set up drag zone
		me.dragZone = new Ext.dd.DragZone(view.getEl(), {
			isTarget: false,
			dragSourceView: view,
			ddGroup: 'dashboard-designer',
			animRepair: false,

            // this is a fix for the white highlight color that would go around the buttons after a failed drag
            afterRepair: function() {
                this.dragging = false;
            },

			getDragData: function(event) {
				var target = event.getTarget(this.dragSourceView.itemSelector);

				if(target) {
					return {
						ddel: target.cloneNode(true),
						draggedRecord: view.getRecord(target)
					};
				}
			}
		});
	},

	cleanUp: function() {
		this.tip.destroy();
		this.dragZone.destroy();
	}
});