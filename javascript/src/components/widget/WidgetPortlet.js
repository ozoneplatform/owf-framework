Ext.define('Ozone.components.widget.WidgetPortlet', {
	extend: 'Ozone.components.widget.WidgetPanel',
	alias: 'widget.widgetportlet',
	
	anchor: '100%',
	//frame: true,

	componentCls: 'x-portlet',
	closable: true,
	collapsible: true,
	draggable: false,
	stateEvents: ['collapse', 'expand', 'resize', 'titlechange'],
	stateful: true,
	
	/**
	 * @description Defines what state gets saved for the portal when the state manager calls this method.
	 *
	 * @param None.
	 * @returns state properties of the portal.
	 */
	getState: function() {
		var o = {
            universalName: this.universalName,
			widgetGuid: ((this.widgetGuid != null) && (this.widgetGuid != 'undefined')) ? this.widgetGuid : '',
			dashboardGuid: this.dashboardGuid,
			paneGuid: this.paneGuid,
			uniqueId: ((this.uniqueId != null) && (this.uniqueId != 'undefined')) ? this.uniqueId : '',
			name: this.title ? this.title : this.name,
			active: !!this.active,
			x: '',
			y: '',
			zIndex: '',
			minimized: false,
			maximized: false,
			pinned: false,
			collapsed: ((this.collapsed != null) && (this.collapsed != 'undefined')) ? this.collapsed : '',
			columnPos: 0,
			columnOrder: this.ownerCt ? this.ownerCt.items.indexOf(this) : '',
			buttonId: '',
			buttonOpened: '',
			region: 'none',
			statePosition: this.statePosition,
            intentConfig: this.intentConfig,
            launchData: this.launchData,
			singleton: this.singleton ? this.singleton : false
		};
		if (this.rendered) {
		  Ext.apply(o,{
			height: this.collapseMemento != null && this.collapseMemento.data != null ? this.collapseMemento.data.height :this.getSize().height,
			width: this.getSize().width
		  });
		}
		else {
		  Ext.apply(o,{
			height: this.height,
			width: this.width
		  });
		}
		return o;
	},
	
	/**
	 * @description Defines what state gets restored for the portal when the state manager calls this method.
	 *
	 * @param state State data from by portal manager's state provider.
	 * @returns None.
	 */
	applyState: function(state) {
		this.widgetGuid = state.widgetGuid;
		this.uniqueId = state.uniqueId;
		this.name = state.name;
		this.active = state.active;
		//this.width = state.width;
		this.height = state.height;
		//        this.x = state.x;
		//        this.y = state.y;
		//        this.zIndex = state.zIndex;
		this.minimized = state.minimized;
		this.maximized = state.maximized;
		this.pinned = state.pinned;

		// only set collapsed if the widget is rendered, otherwise it the widget iframe wouldn't be rendered
		if(this.rendered)
			this.collapsed = state.collapsed;
		
		this.columnPos = state.columnPos;
		this.buttonId = state.buttonId;
		this.buttonOpened = state.buttonOpened;
		this.region = state.region;
		this.title = state.name;

	},
	
	initComponent: function(){
		this.beforeInitComponent();

		this.callParent(arguments);
		
		var panel = this;
		this.panel = panel;
		this.on('render', function(){
			//When the widget is collapsed through the state (on page
			//reload), the height is not set. Then when expanded the
			//portlet height is incorrect, so this sets the height
			this.body.setHeight(this.getHeight());
		   
			panel.resizer = Ext.create('Ext.resizer.Resizer', {
				target: panel,
				handles: 's',
				minHeight: 100//,
				/*listeners: {
					resize: {
						fn: function() {
							this
						},
						scope: this
					}
				}*/
			});
		});
		this.addEvents("beforeexpand");
	}
});
