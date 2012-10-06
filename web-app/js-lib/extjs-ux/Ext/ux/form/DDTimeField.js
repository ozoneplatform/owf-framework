/**
 * <p>Provides the implementation of a drag and drop enabled form field.</p>
 * <p><b>Forum Thread:</b><a href="http://www.extjs.com/forum/showthread.php?t=56275">link</a></p>
 * <p><b>Live Demo:</b><a href="http://projects.kopfhaus.net/demo/ddfields/">link</a></p>
 * <pre><code>
 * var ddTimeField = new Ext.ux.form.DDTimeField ({
 *   id: 'timefield',
 *   fieldLabel: 'Time Field',
 *   listeners: {
 *     render: function (comp) { comp.setDroppable ('myDropGroup'); }, 
 *     drop: function (field, dom, dd, e, data) { alert ('something dropped!'); }
 *   }
 * });</code></pre>
 * @author Kurtis Kopf (<a href="http://www.kopfhaus.net>Kopfhaus</a>)
 * @version 1.0.1
 * @license <a href="http://www.opensource.org/licenses/mit-license.php">MIT</a>
 */

Ext.namespace ("Ext.ux.form"); 

/**
 * Creates a new DDTimeField.
 * @class Ext.ux.form.DDTimeField Implementation of a drag and drop enabled TimeField.
 * @augments Ext.form.TimeField
 * @constructor
 * @param {object} config The configuration to use for the DDTimeField. 
 * @see Ext.form.TimeField
 */
Ext.ux.form.DDTimeField = function (config)
{
	Ext.ux.form.DDTimeField.superclass.constructor.call (this, Ext.apply (config));
	this.superclass = Ext.ux.form.DDTimeField.superclass;
}
Ext.extend (Ext.ux.form.DDTimeField, Ext.form.TimeField, {
	
	/**
	 * @event
	 * @param {object} field This field.
	 * @param {object} n The hovering node.
	 * @param {object} dd The drag and drop zone.
	 * @param {object} e Browser event object.
	 * @param {object} data The hovering node's internal data.
	 */
	drop: null,
	
	/**
	 * Return false to stop the hovering item from being dropped.
	 * @event
	 * @param {object} field This field.
	 * @param {object} n The hovering node.
	 * @param {object} e Browser event object.
	 * @param {object} data The hovering node's internal data.
	 */
	beforedrop: null,
	
	/**
	 * Set the draggable and droppable after the field is rendered.
	 * Register the new "drop" event.
	 * @private
	 */
	afterRender: function () 
	{
		this.superclass.afterRender.call (this);
		if (this.dragGroup) 
		{ 
			this.setDraggable (this.dragGroup.split (",")); 
		} 
		if (this.dropGroup) 
		{ 
			this.setDroppable (this.dropGroup.split (",")); 
		} 
		if (this.deletable) 
		{ 
			this.setDeletable (); 
		} 
		this.isDirtyFlag = false; 
		this.addEvents ("drop");
		this.addEvents ("beforedrop");
	},
	
	/**
	 * Destroy the extra listeners and Drag and Drop zones.
	 * @private
	 */
	destroy: function () 
	{ 
		this.purgeListeners (); 
		this.getEl ().removeAllListeners (); 
		this.getEl ().remove (); 
		if (this.dragZone) 
		{ 
			if (this.dragZone.destroy) 
			{ 
				this.dragZone.destroy (); 
			} 
		} 
		if (this.dropZone) 
		{ 
			if (this.dropZone.destroy) 
			{ 
				this.dropZone.destroy (); 
			} 
		} 
	}, 

	/** 
	 * Part of the Ext.dd.DropZone interface. If no target node is found, the 
	 * whole Element becomes the target, and this causes the drop gesture to append. 
	 * @param {object} e Browser event object.
	 * @private
	 */ 
	getTargetFromEvent : function (e) 
	{ 
		var target = e.getTarget (); 
		while ((target !== null) && (target.parentNode != this.el.dom)) 
		{ 
			target = target.parentNode; 
		} 
		if (!target) 
		{ 
			target = this.el.dom.lastChild || this.el.dom; 
		} 
		return target; 
	}, 

	/** 
	 * Create the drag data which consists of an object which has the property "ddel" as 
	 * the drag proxy element.  
	 * @param {object} e Browser event object.
	 * @private
	 */ 
	getDragData : function (e) 
	{ 
		var target = this.findItemFromChild (e.getTarget ()); 
		if (target) 
		{ 
			if (!this.isSelected (target)) 
			{ 
				delete this.ignoreNextClick; 
				this.onItemClick (target, this.indexOf (target), e); 
				this.ignoreNextClick = true; 
			} 
			return (this.getValue ());
		} 
		return false; 
	}, 
     
	/**    
	 * Specify to which ddGroup items in this field may be dragged.
	 * @param {string/array} ddGroup A string or array of strings with the drag group(s) to allow with this field.
	 */
	setDraggable: function (ddGroup) 
	{ 
		if (ddGroup instanceof Array) 
		{ 
			Ext.each (ddGroup, this.setDraggable, this); 
			return; 
		} 
		if (this.dragZone) 
		{ 
			this.dragZone.addToGroup (ddGroup); 
		} 
		else 
		{ 
			this.dragZone = new Ext.dd.DragZone (this.getEl (), 
				{ 
					containerScroll: true, 
					ddGroup: ddGroup 
				}
			);
			this.dragZone.getDragData = this.getDragData.createDelegate (this); 
			this.dragZone.getRepairXY = this.getRepairXY; 
			this.dragZone.onEndDrag = this.onEndDrag; 
		}
	}, 

	/**    
	 * Specify from which ddGroup this field accepts drops.
	 * @param {string/array} ddGroup A string or array of strings with the drop group(s) to allow with this field.
	 */ 
	setDroppable: function (ddGroup) 
	{ 
		if (ddGroup instanceof Array) 
		{ 
			Ext.each (ddGroup, this.setDroppable, this); 
			return; 
		} 
		if (this.dropZone) 
		{ 
			this.dropZone.addToGroup (ddGroup); 
		} 
		else 
		{ 
			this.dropZone = new Ext.dd.DropZone (this.getEl (), 
				{ 
					owningView: this, 
					containerScroll: true, 
					ddGroup: ddGroup 
				}
			);
			this.dropZone.getTargetFromEvent = this.getTargetFromEvent.createDelegate (this); 
			this.dropZone.onNodeEnter = this.onNodeEnter.createDelegate (this); 
			this.dropZone.onNodeOver = this.onNodeOver.createDelegate (this); 
			this.dropZone.onNodeOut = this.onNodeOut.createDelegate (this); 
			this.dropZone.onNodeDrop = this.onNodeDrop.createDelegate (this); 
		} 
	}, 
    
	/**
	 * Look for a TreeNode or a Grid in the drop data to determine if this is a valid drop point.
	 * This method can be overridden for custom implementations.
	 * @param {object} e Browser event object.
	 * @param {object} n The hovering node object.
	 * @param {object} data The hovering node's internal data.
	 * @return {boolean} True if this is a valid drop point for the node, false otherwise.
	 */
	isValidDropPoint: function (e, n, data) 
	{
		if (this.fireEvent ("beforedrop", this, n, e, data) === false) 
		{
			return false; 
		}
		return true;
	}, 
	
	/**
	 * Change the appearance of the field when a node is hovering over.
	 * @param {object} n The hovering node.
	 * @param {object} dd The drag and drop zone.
	 * @param {object} e Browser event object.
	 * @param {object} data The hovering node's internal data.
	 * @private
	 */
	onNodeEnter : function (n, dd, e, data)
	{ 
		if (this.highlightColor && (data.sourceView != this)) 
		{
			this.el.highlight (this.highlightColor);
		}
		return false; 
	}, 
    
	/**
	 * Change the appearance of the field based on the hovering node.
	 * @param {object} n The hovering node.
	 * @param {object} dd The drag and drop zone.
	 * @param {object} e Browser event object.
	 * @param {object} data The hovering node's internal data.
	 * @private
	 */
	onNodeOver : function (n, dd, e, data)
	{ 
		var dragElClass = this.dropNotAllowed;
		if (this.isValidDropPoint (e, n, data)) 
		{ 
			return 'x-dd-drop-ok';
		} 
		return dragElClass; 
	},
	
	/**
	 * Change the appearance of the field after a node leaves the drop zone.
	 * @param {object} n The hovering node.
	 * @param {object} dd The drag and drop zone.
	 * @param {object} e Browser event object.
	 * @param {object} data The hovering node's internal data.
	 * @private
	 */
	onNodeOut : function (n, dd, e, data)
	{ 
		this.removeDropIndicators (n); 
	}, 

	/**
	 * Something was dropped on the field, fire the custom drop event.
	 * @param {object} n The hovering node.
	 * @param {object} dd The drag and drop zone.
	 * @param {object} e Browser event object.
	 * @param {object} data The hovering node's internal data.
	 * @private
	 */
	onNodeDrop : function (n, dd, e, data)
	{ 
		if (this.isValidDropPoint (e, n, data) && this.fireEvent ("drop", this, n, dd, e, data) === false) 
		{ 
			return false; 
		}
		return true; 
	}, 
	
	/**
	 * Cleans up the field after a drop occurs.
	 * @param {object} n The dropped node.
	 * @private
	 */
	removeDropIndicators : function (n)
	{ 
		if (n)
		{ 
			Ext.fly (n).removeClass (
				[ 
					"x-dd-drop-ok", 
					"x-dd-drop-ok-add"
				]
			); 
			this.lastInsertClass = "_noclass"; 
		} 
	}
});
Ext.reg ('ddtimefield', Ext.ux.form.DDTimeField);