Ext.ns('Ext.ux.form');

/**
 * A specialized implementation of Ext.form.CheckboxGroup which is a grouping container 
 * for {@link Ext.form.Checkbox} controls.
 * 
 * <br>Demo link: <a href="http://extjs-ux.org/repo/authors/mjlecomte/trunk/Ext/ux/form/examples/xcheckboxgroup.html">here</a>
 * <br>Forum thread: <a href="http://extjs.com/forum/showthread.php?p=263032">here</a><br>
 * 
 * <img src="http://extjs-ux.org/repo/authors/mjlecomte/trunk/Ext/ux/form/examples/xcheckboxgroup.PNG" alt="Screenshot" /><br>
 * 
 * <b>Sample usage:</b>
 * <pre><code>
sampleData = {
    "success": true,
    "data": {
        "demand": [{
            "id": "cb-demand-0",
            "name": "cb-demand-0",
            "boxLabel": "Highest",
            "checked": false,
            "disabled": false
        }, {
            "id": "cb-demand-1",
            "name": "cb-demand-1",
            "boxLabel": "High",
            "checked": false,
            "disabled": false
        }, {
            "id": "cb-demand-2",
            "name": "cb-demand-2",
            "boxLabel": "Normal",
            "checked": false,
            "disabled": false
        }, {
            "id": "cb-demand-3",
            "name": "cb-demand-3",
            "boxLabel": "Low",
            "checked": true,
            "disabled": false
        }, {
            "id": "cb-demand-4",
            "name": "cb-demand-4",
            "boxLabel": "Lowest",
            "checked": true,
            "disabled": true  // does not work?
        }]
    }
};

Ext.onReady(function(){

    var fp = new Ext.FormPanel({
        frame: true,
        title:'Check/Radio Groups',
        labelWidth: 110,
        width: 600,
        renderTo:'form-ct',
        bodyStyle: 'padding:0 10px 0;',
        items: [{
            layout: 'column',
            border: false,
            defaults: {
                columnWidth: '.5',
                border: false
            }
        },{
            xtype:'fieldset',
            title: 'XCheckboxGroups',
            autoHeight: true,
            layout: 'form',
            items: [{
                layout: 'column',
                border: false,
                defaults: {
                    width: 100,
                    border: false
                },
                items:[{
                    xtype: 'xcheckboxgroup',
                    columns: 2,
                    data: sampleData.data.demand,
                    panelCfg: {
                        title: 'Example with sample data'
                    },
                    vertical: true,
                    width: 200,//'auto',
                    items: [{
                        xtype:'checkbox',
                        boxLabel: 'Item 1',
                        checked: true,
                        name: 'cb-test-1'
                    },{
                        xtype:'checkbox',
                        boxLabel: 'Item 2',
                        name: 'cb-test-2'
                    },{
                        xtype:'checkbox',
                        boxLabel: 'Item 3',
                        name: 'cb-test-3'
                    },{
                        xtype:'checkbox',
                        boxLabel: 'Item 4',
                        name: 'cb-test-4'
                    },{
                        xtype:'checkbox',
                        boxLabel: 'Item 5',
                        name: 'cb-test-5'
                    },{
                        xtype:'checkbox',
                        boxLabel: 'Item 6',
                        name: 'cb-test-6'
                    },{
                        xtype:'checkbox',
                        boxLabel: 'Item 7',
                        name: 'cb-test-7'
                    },{
                        xtype:'checkbox',
                        boxLabel: 'Item 8',
                        name: 'cb-test-8'
                    }]
                }]
            }]
        }]
    });
}); 
 * </pre></code>
 * @author Michael LeComte (<a href="http://extjs.com/forum/member.php?u=6834">mjlecomte</a>)
 * @license <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0</a>
 * @version 0.2 - Dec 16, 2008 (ALPHA!!!)
 * @donate <form action="https://www.paypal.com/cgi-bin/webscr" method="post">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="image" src="https://www.paypal.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="Make a donation to support ongoing development">
<img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1">
<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----
">
</form>
 */
Ext.ux.form.XCheckboxGroup = Ext.extend(Ext.form.CheckboxGroup, {

    /**
     * @cfg {Boolean} dataReplace Specify true if you want any "items" specified
     * in the config to be deleted prior to inserting items from "data".  Defaults
     * to false (inline "items" in the array will be replaced by "data" items so
     * the inline data may remain.
     */
    dataReplace: false,

    /**
     * @cfg {Array} defaultItems An array representing the default items to be used
     * as items when no data or no items have been specified in the configuration 
     * object, defaults to:
     * <pre><code>
     * defaultItems : [{
     *     boxLabel : 'No options',
     *     disabled : true
     * }]
     * </pre></code>
     */
	defaultItems : [{
		boxLabel : 'No options',
		disabled : true
	}],

    /**
     * @cfg {Array} fields An array of field definition objects to configure the JsonReader
     * (defaults to ['id','name','boxLabel','checked','disabled'] but another option is:
     * ['id','name','boxLabel','inputValue','checked','disabled']).  Only specify those you will
     * actually include in your data otherwise they will end up being undefined.
     */
    fields: ['id','name','boxLabel','checked','disabled'],

    /**
     * @cfg {String} iconAll The iconCls to use for the select all button in the toolbar.
     * Defaults to 'icon-add'.
     */
    iconAll: 'icon-add',
    
    /**
     * @cfg {String} iconInvert The iconCls to use for the invert button in the toolbar.
     * Defaults to 'icon-revolve'.
     */
    iconInvert: 'icon-revolve',
    
    /**
     * @cfg {String} iconNone The iconCls to use for the deselect all button in the toolbar.
     * Defaults to 'icon-delete'.
     */
    iconNone: 'icon-delete',
    
    /**
     * @cfg {String} textAll The text to use for the select all button in the toolbar.
     * Defaults to 'All'.
     */
    textAll: 'All',
    
    /**
     * @cfg {String} textInvert The text to use for the invert button in the toolbar.
     * Defaults to 'Invert'.
     */
    textInvert: 'Invert',
    
    /**
     * @cfg {String} textNone The text to use for the deselect all button in the toolbar.
     * Defaults to 'None'.
     */
    textNone: 'None',

    /**
     * @cfg {Array} panelTools An array representing the toolbar items to be included.
     * 'all', 'none', and 'invert' are preconfigured toolbar buttons with preconfigured 
     * handlers.  The iconCls and text for these buttons may be configured individually.
     * To not have a toolbar included specify
     * <pre><code>
     * panelTools: null
     * </pre></code>
     * Defaults to:
     * <pre><code>
     * panelTools: ['all','-','none','-','invert']
     * </pre></code>
     */
    panelTools: ['all','-','none','-','invert'],

    /**
     * @private
     */
    initComponent: function(){

        this.panelCfg = Ext.apply({
            bodyStyle:'padding:0px 0px 0px 5px',
            margins: '10 0 0 0',
            height: 160,
            autoScroll: true
        }, this.panelCfg || {});

        if (this.panelTools) {
            this.setTools();
        };

        if (!this.data) {
        	this.items = this.items || this.defaultItems;
        } else {
        	this.reader = new Ext.data.JsonReader( {
        		totalProperty: this.data['totalProperty'],
        		successProperty: 'success',
                root: this.data.data,
        		fields: this.fields
        	});

			var result = this.reader.readRecords(this.data);

            var records = result.records;
            
            // replace or overwrite the inline items?
            if (this.dataReplace || !this.items) {
                this.items = [];
            }
            
            for (var i = 0;i < records.length; i++) {
                this.items[i] = records[i].data;
            }
        }
        
        Ext.ux.form.XCheckboxGroup.superclass.initComponent.call(this);

        /*
        this.addEvents('selectAll', 'selectNone', 'invert');
        */
    },

    /**
     * Need to override entire method in order to affect panelCfg
     * @private
     */
    onRender : function(ct, position){
        if(!this.el){
            // rest of method is untouched with exception of panelCfg
            // which is modified to allow a panelCfg config option
            var panelCfg = Ext.apply({
                cls: this.groupCls,
                layout: 'column',
                border: false,
                renderTo: ct
            }, this.panelCfg || {});
            
            var colCfg = {
                defaultType: this.defaultType,
                layout: 'form',
                border: false,
                defaults: {
                    hideLabel: true,
                    anchor: '100%'
                }
            }
            
            if(this.items[0].items){
                
                // The container has standard ColumnLayout configs, so pass them in directly
                
                Ext.apply(panelCfg, {
                    layoutConfig: {columns: this.items.length},
                    defaults: this.defaults,
                    items: this.items
                })
                for(var i=0, len=this.items.length; i<len; i++){
                    Ext.applyIf(this.items[i], colCfg);
                };
                
            }else{
                
                // The container has field item configs, so we have to generate the column
                // panels first then move the items into the columns as needed.
                
                var numCols, cols = [];
                
                if(typeof this.columns == 'string'){ // 'auto' so create a col per item
                    this.columns = this.items.length;
                }
                if(!Ext.isArray(this.columns)){
                    var cs = [];
                    for(var i=0; i<this.columns; i++){
                        cs.push((100/this.columns)*0.01); // distribute by even %
                    }
                    this.columns = cs;
                }
                
                numCols = this.columns.length;
                
                // Generate the column configs with the correct width setting
                for(var i=0; i<numCols; i++){
                    var cc = Ext.apply({items:[]}, colCfg);
                    cc[this.columns[i] <= 1 ? 'columnWidth' : 'width'] = this.columns[i];
                    if(this.defaults){
                        cc.defaults = Ext.apply(cc.defaults || {}, this.defaults)
                    }
                    cols.push(cc);
                };
                
                // Distribute the original items into the columns
                if(this.vertical){
                    var rows = Math.ceil(this.items.length / numCols), ri = 0;
                    for(var i=0, len=this.items.length; i<len; i++){
                        if(i>0 && i%rows==0){
                            ri++;
                        }
                        if(this.items[i].fieldLabel){
                            this.items[i].hideLabel = false;
                        }
                        cols[ri].items.push(this.items[i]);
                    };
                }else{
                    for(var i=0, len=this.items.length; i<len; i++){
                        var ci = i % numCols;
                        if(this.items[i].fieldLabel){
                            this.items[i].hideLabel = false;
                        }
                        cols[ci].items.push(this.items[i]);
                    };
                }
                
                Ext.apply(panelCfg, {
                    layoutConfig: {columns: numCols},
                    items: cols
                });
            }
            
            this.panel = new Ext.Panel(panelCfg);
            this.el = this.panel.getEl();
            
            if(this.forId && this.itemCls){
                var l = this.el.up(this.itemCls).child('label', true);
                if(l){
                    l.setAttribute('htmlFor', this.forId);
                }
            }
            
            var fields = this.panel.findBy(function(c){
                return c.isFormField;
            }, this);
            
            this.items = new Ext.util.MixedCollection();
            this.items.addAll(fields);
        }
        Ext.form.CheckboxGroup.superclass.onRender.call(this, ct, position);
    },
    
    /**
     * Set all boxes for this CheckboxGroup to checked or unchecked.
     * @param {Boolean} v true to check all boxes this group, false to uncheck all boxes this group.
     */
    invert: function(){
        this.items.each(function(c){
            if (!c.disabled) {
                c.setValue(!c.checked);
            }
        }, this);
    },
    
    /**
     * Set all boxes for this CheckboxGroup to checked or unchecked.
     * @param {Boolean} v true to check all boxes this group, false to uncheck all boxes this group.
     */
    setAll: function(v){
        this.items.each(function(c){
            if(c.setValue && !c.disabled){
                c.setValue(v);
            }
        }, this);
    },

    /**
     * Set the toolbar items
     * @private
     */
    setTools: function(){

        var t = this.toolCfg = {
            all: {
                text: this.textAll,
                handler: this.setAll.createDelegate(this, [true]),
                iconCls: this.iconAll
            },
            none: {
                text: this.textNone,
                handler: this.setAll.createDelegate(this),
                iconCls: this.iconNone
            },
            invert: {
                text: this.textInvert,
                handler: this.invert.createDelegate(this),
                iconCls: this.iconInvert
            }
        };

        var tools = [];

        Ext.each(this.panelTools, function (i) {
            if (typeof i == 'string' && (t[i] !== undefined) ) {
                i = t[i]; 
            }
            if (i) {
                tools.push(i);
            }
        });
        
        this.panelCfg.tbar = tools;
    }
});
Ext.ComponentMgr.registerType('xcheckboxgroup', Ext.ux.form.XCheckboxGroup);