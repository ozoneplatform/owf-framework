declare( 'Ext::ux::reference::Slot', function () {

	var intercepted = {
	    'Ext.Container.prototype.initComponent' : Ext.Container.prototype.initComponent
	};
	
    var setupSlots = function(){
        var self = this;
        
        var setup_slot_func = function (component){
            if (component.slot && component != self) {
                var has_slots = function (container, component) {
                    return !!container.slots; //toBoolean()
                }
                
                var parent_with_slots = component.findParentBy(has_slots);
                if (!parent_with_slots) return;
                
                parent_with_slots.slots[component.slot] = component;
                component.siblingSlots = parent_with_slots.slots; 
                delete component.slot;
            }
        };
        
        this.cascade(setup_slot_func);
    };
        
    
	/**
	 * This extension provides the unified way to access child components of any container. It adds 2 new configuration options and 1 property to the Ext.Container prototype.
	 * See below for description.
	 * <br>Examples of usage:
<pre><code>
var w = new Ext.Window({
  title : 'form',
  slots : true, <span style="color: blue"><-- </span><span style="color: blue"><b>field1 </b>and</span> <span style="color: blue"><b>field2</b> will be inserted here</span>
  items : [{
    xtype : 'form', <span style="color: blue"><-- unnecessary</span><span style="color: blue"> path component </span><span style="color: blue">skipped </span>
    items : [{
       xtype : 'panel', <span style="color: blue"><-- unnecessary</span><span style="color: blue"> path component </span><span style="color: blue">skipped </span>
       items : [{
         xtype : 'textfield',
         name : 'street',
         slot : 'field1'  <span style="color: blue"><-- here will be siblingSlots</span>
       }],
    },{
         xtype : 'textfield',
         name : 'city',
         slot : 'field2', <span style="color: blue"><-- here will be siblingSlots</span>
         id : 'city_field'
    }]
  }]
});
....

if (w.slots.field1.value == 'yyy') {
  w.slots.field2.value = 'zzz';
}

Ext.getCmp('city_field').on('change',function(){  
  if (this.siblingSlots.field1.value == 'xxx') {
    ...
  }
}, Ext.getCmp('city_field'));
</code></pre>
	 * <br/>Link to the forum thread: <a href="http://extjs.com/forum/showthread.php?t=46573">http://extjs.com/forum/showthread.php?t=46573</a> 
	 * <br/><br/>Link to the test suite: <a href="http://extjs-ux.org/repo/authors/SamuraiJack/trunk/Ext/ux/reference/Slot/index.html">http://extjs-ux.org/repo/authors/SamuraiJack/trunk/Ext/ux/reference/Slot/index.html</a> 
	 * <br/><br/>This extension was inspired by this thread: <a href="http://extjs.com/forum/showthread.php?t=42402">http://extjs.com/forum/showthread.php?t=42402</a>
	 * @class Ext.ux.reference.Slot
	 * @version 0.1
	 * @author <a href="http://extjs.com/forum/member.php?u=36826">SamuraiJack</a>
	 * @license <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0</a>
	 */
    Ext.ux.reference.Slot = {
	    /**
	     * @property {Object} siblingSlots The reference to nearest (up on ownerCt hierarchy) slots collector. 
	     */
    	siblingSlots : undefined,
    	
        /**
         * @cfg {String} slot The name of the slot, under which this element will be accessible in the slots collector.
         */
    	slot : undefined,
    	
    	/**
	     * @cfg {Boolean} slots If true - then after "initComponent" method in this container will be setuped a <b>slots collector</b>. Any component, which have the <b>slot</b> property 
	     * defined, will be referenced in the nearest (up on ownerCt hierarchy) slots collector. Dynamically added child items are handled correctly.
    	 */
    	slots : undefined
    };
    
    
    Ext.override(Ext.Container, {
    	slot : undefined,        
    	siblingSlots : undefined,        
        slots : undefined,        
        
        initComponent : function () {
            if (this.slots) this.slots = {};
            
            this.addEvents('add');
            this.on('add',setupSlots,this);

            intercepted['Ext.Container.prototype.initComponent'].call(this);
        }
	}); //eof override

});