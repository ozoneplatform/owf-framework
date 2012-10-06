/*global Ext*/
Ext.namespace('Ext.ux.panel');
/**
 * <p>A tab panel which supports drag and drop behaviour for tabs. Usage and configuration are identical to {@link Ext.TabPanel}, with the sole exception of two extra configuration options to adjust the drop arrow indicator position.</p>
 * <p>This extension can also be created using the <b>ddtabpanel</b> xtype.<br/>&nbsp;</p>
 * <p>Based on the code of <a href="http://extjs.com/forum/member.php?u=22731">thommy</a> and <a href="http://extjs.com/forum/member.php?u=37284">rizjoj</a> in the topic <a href="http://extjs.com/forum/showthread.php?t=23264">Draggable Panel in a TabPanel</a>.</p>
 * <p>Demo link: <a href="http://extjs-ux.org/repo/authors/Matti/trunk/Ext/ux/panel/DDTabPanel/demo.html">http://extjs-ux.org/repo/authors/Matti/trunk/Ext/ux/panel/DDTabPanel/demo.html</a>
 * <br />Forum thread: <a href="http://extjs.com/forum/showthread.php?p=264712">http://extjs.com/forum/showthread.php?p=264712</a><br/>&nbsp;</p>
 * <p>Every tab is extended with additional configuration options and methods to control its drag and drop behaviour. These are:</p>
 * <ul>
 * <li><b>allowDrag</b>: Config Option - Boolean
 * <div class="sub-desc">Whether this tab can be dragged to be re-ordered (defaults to true).</div></li>
 * <li><b>enableDrag</b>: Public Method
 * <div class="sub-desc">Allow this tab to be dragged to re-order it.</div></li>
 * <li><b>disableDrag</b>: Public Method
 * <div class="sub-desc">Prevent this tab from being dragged to re-order it.</div></li>
 * </ul>
 * <b>CSS Styles:</b>
 * <pre><code>.dd-arrow-down {
	background-image: url( &lt;your_down_arrow_image&gt; );
	display: block;
	visibility: visible;
	z-index: 20000;
	position: absolute;
	width: 16px;
	height: 16px;
	top: 0;
	left: 0;
}</code></pre>
 * <br /><b>Example Usage:</b>
 * <pre><code>var tabs = new Ext.ux.panel.DDTabPanel({
	renderTo: Ext.getBody(),
	items: [{
		title: 'Tab 1',
		html: 'A simple tab'
	},{
		title: 'Tab 2',
		html: 'Fixed tab',
		allowDrag: false
	},{
		title: 'Tab 3',
		html: 'Another tab'
	}]
});</code></pre>
 * @class Ext.ux.panel.DDTabPanel
 * @extends Ext.TabPanel
 * @author Original by <a href="http://extjs.com/forum/member.php?u=22731">thommy</a> and <a href="http://extjs.com/forum/member.php?u=37284">rizjoj</a><br />Published and polished by: Mattias Buelens (<a href="http://extjs.com/forum/member.php?u=41421">Matti</a>)<br />With help from: <a href="http://extjs.com/forum/member.php?u=1459">mystix</a>
 * @license Licensed under the terms of the Open Source <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0 license</a>. Commercial use is permitted to the extent that the code/component(s) do NOT become part of another Open Source or Commercially licensed development library or toolkit without explicit permission. 
 * @version 1.0.7 (Jan 16, 2009)
 */
Ext.ux.panel.DDTabPanel = Ext.extend(Ext.TabPanel, {
	/**
	 * @cfg {Number} arrowOffsetX The horizontal offset for the drop arrow indicator, in pixels (defaults to -9).
	 */
	arrowOffsetX: -9,
	/**
	 * @cfg {Number} arrowOffsetY The vertical offset for the drop arrow indicator, in pixels (defaults to -8).
	 */
	arrowOffsetY: -8,

	// Assign the drag and drop group id
	/** @private */
	initComponent: function(){
		Ext.ux.panel.DDTabPanel.superclass.initComponent.call(this);
		if(!this.ddGroupId) this.ddGroupId = 'dd-tabpanel-group-' + Ext.ux.panel.DDTabPanel.superclass.getId.call(this);
	},

	// Declare the tab panel as a drop target
	/** @private */
	afterRender: function(){
		Ext.ux.panel.DDTabPanel.superclass.afterRender.call(this);
		// Create a drop arrow indicator
		this.arrow = Ext.DomHelper.append(
			Ext.getBody(),
			'<div class="dd-arrow-down"></div>',
			true
		);
		this.arrow.hide();
		// Create a drop target for this tab panel
		var tabsDDGroup = this.ddGroupId;
		this.dd = new Ext.ux.panel.DDTabPanel.DropTarget(this, {
			ddGroup: tabsDDGroup
		});
	},

	// Init the drag source after (!) rendering the tab
	/** @private */
	initTab: function(tab, index){
		Ext.ux.panel.DDTabPanel.superclass.initTab.call(this, tab, index);

		var id = this.id + '__' + tab.id;
		// Enable dragging on all tabs by default
		Ext.applyIf(tab, { allowDrag: true });
		// Extend the tab
		Ext.apply(tab, {
			// Set the initial tab position
			position: (index + 1) * 2, // 2, 4, 6, 8, ... (2n)
			// Make this tab a drag source
			ds: new Ext.dd.DragSource(id, {
				ddGroup: this.ddGroupId,
				dropEl: tab,
				dropElHeader: Ext.get(id, true),
				scroll: false,
				// Update the drag proxy ghost element
				onStartDrag : function(){
					if(this.dropEl.iconCls){
						this.getProxy().getGhost().select(".x-tab-strip-text").applyStyles({
							paddingLeft: "20px"
						});
					}
				},
				// Activate this tab on mouse down
                // (Fixes bug which prevents a tab from being activated by clicking it)
                onMouseDown: function(event){
                    if(!this.dropEl.isVisible()){
                        this.dropEl.show();
                    }
                }
			}),
			// Method to enable dragging
			enableDrag: function(){
				this.allowDrag = true;
				return this.ds.unlock();
			},
			// Method to disable dragging
			disableDrag: function(){
				this.allowDrag = false;
				return this.ds.lock();
			}
		});

		// Initial dragging state
		if(tab.allowDrag){
			tab.enableDrag();
		}else{
			tab.disableDrag();
		}
	},
	
	// DragSource cleanup on removed tabs
	/** @private */
	onRemove: function(tp, item){
		Ext.destroy(item.ds.proxy, item.ds);
		Ext.ux.panel.DDTabPanel.superclass.onRemove.call(this, tp, item);
	},

	// DropTarget and arrow cleanup
	/** @private */
	onDestroy: function(){
		Ext.destroy(this.dd, this.arrow);
		Ext.ux.panel.DDTabPanel.superclass.onDestroy.call(this);		
	}
});

// Ext.ux.panel.DDTabPanel.DropTarget
// Implements the drop behavior of the tab panel
/** @private */
Ext.ux.panel.DDTabPanel.DropTarget = Ext.extend(Ext.dd.DropTarget, {
	constructor: function(tabpanel, config){
		this.tabpanel = tabpanel;
		// The drop target is the tab strip wrap
		Ext.ux.panel.DDTabPanel.DropTarget.superclass.constructor.call(this, tabpanel.stripWrap, config);
	},

	notifyOver: function(dd, e, data){
		var tabs = this.tabpanel.items;
		var last = tabs.length;

		if(!e.within(this.getEl())){
			return 'x-dd-drop-nodrop';
		}

		var larrow = this.tabpanel.arrow;

		// Getting the absolute Y coordinate of the tabpanel
		var tabPanelTop = this.el.getY();

		var left;
		var eventPosX = e.getPageX();

		for(var i = 0; i < last; i++){
			var tab = tabs.itemAt(i);
			// Is this tab target of the drop operation?
			var tabEl = tab.ds.dropElHeader;
			// Getting the absolute X coordinate of the tab
			var tabLeft = tabEl.getX();
			// Get the middle of the tab
			var tabMiddle = tabLeft + tabEl.dom.clientWidth / 2;

			if(eventPosX <= tabMiddle){
				left = tabLeft;
				break;
			}
		}

		if(typeof left == 'undefined'){
			var lastTab = tabs.itemAt(last - 1);
			if(lastTab){
				var dom = lastTab.ds.dropElHeader.dom;
				left = (new Ext.Element(dom).getX() + dom.clientWidth) + 3;
			}
		}

		larrow.setTop(tabPanelTop + this.tabpanel.arrowOffsetY).setLeft(left + this.tabpanel.arrowOffsetX).show();

		return 'x-dd-drop-ok';
	},

	notifyDrop: function(dd, e, data){
		this.tabpanel.arrow.hide();
		var tabs = this.tabpanel.items;

		var last = tabs.length;
		var eventPosX = e.getPageX();

		var newPos = last;
		dd.dropEl.position = last * 2 + 1; // default: 'behind the rest'

		for(var i = 0; i < last; i++){
			var tab = tabs.itemAt(i);
			// Is this tab target of the drop operation?
			var tabEl = tab.ds.dropElHeader;
			// Getting the absolute X coordinate of the tab
			var tabLeft = tabEl.getX();
			// Get the middle of the tab
			var tabMiddle = tabLeft + tabEl.dom.clientWidth / 2;
			if(eventPosX <= tabMiddle) break;
		}

		// Insert the tab element at the new position
		dd.proxy.hide();
		/*dd.el.dom.parentNode.insertBefore(dd.el.dom, dd.el.dom.parentNode.childNodes[newPos]);
		// Sort tabs by their actual position
		tabs.sort('ASC', function(a, b){
			return a.position - b.position;
		});
		// Adjust tab position values
		tabs.each(function(tab, index){
			tab.position = (index + 1) * 2;
		});*/
		var dropEl = dd.dropEl.ownerCt.remove(dd.dropEl, false);
		this.tabpanel.insert(i, dropEl);
		this.tabpanel.activate(dropEl);

		return true;
	},

	notifyOut: function(dd, e, data){
		this.tabpanel.arrow.hide();
	}
});

Ext.reg('ddtabpanel', Ext.ux.panel.DDTabPanel);