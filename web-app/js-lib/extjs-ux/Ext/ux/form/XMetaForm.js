Ext.namespace('Ext.ux.form');

/**
 * @class Ext.ux.form.XMetaForm
 * @extend Ext.form.FormPanel
 * @desc
 * FormPanel implementation that can also load fields from server<br>
 * 
 * Project Home : <a href="http://code.google.com/p/ext-ux-xmetaform/">http://code.google.com/p/ext-ux-xmetaform/</a><br>
 * Demo 		: <a href="http://extjs-ux.org/repo/authors/chalu/trunk/Ext/ux/form/xmetaform/index.html">http://extjs-ux.org/repo/authors/chalu/trunk/Ext/ux/form/xmetaform/index.html</a>
 * 
 * @version 1.0
 * @licence <a href="http://www.gnu.org/licenses/gpl.html">GPLv3</a>
 * @author Charles Opute Odili (chalu) <a href="mailto:chaluwa@gmail.com">chaluwa@gmail.com</a>
 * 
 * @constructor
 * @param {Object} config The config object
 */ 
Ext.ux.form.XMetaForm = Ext.extend(Ext.form.FormPanel, {
	/**
	 * @cfg {Boolean} autoInit true to auto-load fields, false otherwise, default is true.
	 */
     autoInit: true,
	 
	 /**
	  * @cfg {String} loadingText mask mesage to display when loading fields
	  */
     loadingText: 'Loading...',
	 
	 /**
	  * @cfg {String} savingText mask mesage to display when saving / sending values
	  */	 
     savingText: 'Saving...',
	 
	 /**
	  * @cfg {Number} buttonMinWidth width for form buttons
	  */
     buttonMinWidth: 90,
	 
	 /**
	  * @cfg {Boolean} file upload flag, defaults to false
	  */
     fileUpload: false,
     
	/**
     * Inits this component with the specified config-properties and automatically
     * creates its components.
     */
     initComponent:function() {

        // create one item to avoid error
		this.items = this.items || {};
        Ext.apply(this, {
            items: this.items
        }); 

        // get buttons if we have button creation routines
        if('function' == typeof this.getButton) {
            this.buttons = this.getButtons();
        }        

        // call parent
        Ext.ux.form.XMetaForm.superclass.initComponent.apply(this, arguments);
        
        this.addEvents('cancel', 'ok');

        // install event handlers on basic form
        this.form.on({
             beforeaction:{scope:this, fn:this.beforeAction},
             actioncomplete:{scope:this, fn:function(form, action) {
                // (re) configure the form if we have (new) metaData
                if('load' === action.type && action.result.metaData) {                	
                    this.onMetaChange(this, action.result.metaData);
                }
                // update bound data on successful submit
                else if('submit' == action.type) {
                    this.updateBoundData();
                }
            }}
        });
        this.form.trackResetOnLoad = true;
    },
    
    /**
     * @private
     * changes order of execution in Ext.form.Action.Load::success
     * to allow reading of data in this server request (otherwise data would
     * be loaded to the form before onMetaChange is run from actioncomplete event
     */
    beforeAction:function(form, action) {
        action.success = function(response) {
            var result = this.processResponse(response);
            if(result === true || !result.success || !result.data){
            	this.failureType = Ext.form.Action.LOAD_FAILURE;
                this.form.afterAction(this, false);
                return;
            }

            this.form.afterAction(this, true);
            this.form.clearInvalid();
            this.form.setValues(result.data);
        };
    },
    
    /**
     * Data to bind to this form
     * @param {Object} data A reference to on external data object. 
     * The idea is that form can display/change an external object
     */
    bind:function(data) {
        this.data = data;
        this.form.setValues(this.data);
    },
    
    /**
     * override this if you want a special buttons config
     * 
     * @return {Array} array of the buttons
     */
    getButtons:function() {
        var buttons = [];
        if(this.createButtons.isArray) {
            Ext.each(this.createButtons, function(name) {
                var button;
                switch(name) {
                    case 'meta':
                        button = this.getButton(name, {
                            handler:this.load.createDelegate(this, [{params:{meta:true}}])
                        });
                    break;

                    case 'load':
                        button = this.getButton(name, {
                             scope:this
                            ,handler:this.load
                        });
                    break;

                    case 'defaults':
                        button = this.getButton(name, {
                             scope:this
                            ,handler:this.setDefaultValues
                        });
                    break;

                    case 'reset':
                        button = this.getButton(name, {
                             scope:this
                            ,handler:this.reset
                        });
                    break;

                    case 'save':
                    case 'submit':
                        button = this.getButton(name, {
                            handler:this.submit.createDelegate(this, [{params:{cmd:'setPref'}}])
                        });
                    break;

                    case 'ok':
                        button = this.getButton(name, {
                             scope:this
                            ,handler:this.onOk
                        });
                    break;

                    case 'cancel':
                        button = this.getButton(name, {
                             scope:this
                            ,handler:this.onCancel
                        });
                    break;
                }
                if(button) {
                    Ext.apply(button, {
                        minWidth:this.buttonMinWidth
                    });
                    buttons.push(button);
                }
            }, this);
        }
        return buttons;
    },
    
	/**
	  * @private
	  */
    getOptions:function(o) {
        var options = {
            url:this.url,
            method:this.method || 'post'
        };
        Ext.apply(options, o);
        options.params = Ext.apply(this.baseParams || {}, o.params || {});
        return options;
    },
    
    /**
     * Returm fields values in the form
     * 
     * @return {Object} object with name/value pairs using fields.getValue() methods
     */
    getValues:function() {
        var values = {};
        this.form.items.each(function(f) {
            values[f.name] = f.getValue();
        });
        return values;
    },
    
	/**
	 * Load data into the form
	 * @param {Object} o parameters for the load operrations
	 */
    load:function(o) {
        var options = this.getOptions(o || {});
        if(this.loadingText) {
            options.waitMsg = this.loadingText;
        }
        this.form.load(options);
    },
    
    /**
	  * @private
	  */
    onCancel:function() {
        this.fireEvent('cancel', this);
    },
    
	/**
	  * @private
	  */
    doConfig: function(config){
    	/*if(config instanceof Array){ 	// we have a container
    		Ext.each(config, function(cfg){
    			this.doConfig(cfg);
    		}, this);
    	}else{
    		if(config.items){	// we have a parent
				this.doConfig(config.items);
			}else{	
				// handle plugins
	            if(config.plugins){
	            	var plugins = config.plugins;
	            	delete config.plugins;
	            	if(plugins instanceof Array){
	            		config.plugins = [];
	            		Ext.each(plugins, function(plugin){
	            			config.plugins.push( Ext.ComponentMgr.create(plugin) );
	            		});
	            	}else{
	            		config.plugins = Ext.ComponentMgr.create(plugins);
	            	}
	            }
	            
	            if(config.regex) {
	                config.regex = new RegExp(config.regex);
	            }
	            
	            // to avoid checkbox misalignment
	            if('checkbox' === config.xtype) {
	                Ext.apply(config, {
	                     boxLabel:' ',
	                     checked: config.defaultValue
	                });
	            }
				//this.add(config);
			}
    	}    		    	
		return config;*/
		if( !Ext.isEmpty(config) ){
			this.buildPlugins(config);
			var items = config.items;
			if( !Ext.isEmpty(items) ) {
				this.doConfig(items);
			} else {            
				// handle regexps
	            if( !Ext.isEmpty(config.regex) ) {
	                config.regex = new RegExp(config.regex);
	            }
	            
	            // to avoid checkbox misalignment
	            if('checkbox' === config.xtype) {
	                Ext.apply(config, {
	                     boxLabel:' ',
	                     checked: config.defaultValue
	                });
	            }
			}																	
		}		
		return config
	},
	
	/**
	  * @private
	  */
	buildPlugins: function(item){
		var plugins = item.plugins;
		if( !Ext.isEmpty(plugins) ){        	
			delete item.plugins;
        	var stack = [];
    		Ext.each(plugins, function(plugin){
				if( typeof plugin.init !== 'function' ){
					stack.push( Ext.ComponentMgr.create(plugin) );
				}
    		});
			item.plugins = stack;
        }
	},
    
    /**
     * Override this if you need a custom functionality
     * in the handling of fields meta data from the server
     *
     * @param {Ext.FormPanel} this
     * @param {Object} meta Metadata
     */
    onMetaChange:function(form, meta) {
        this.removeAll(); 
		Ext.apply(this, meta.formConfig || {}); 
		   
		var oConfig = this.doConfig( meta.fields || meta.items || meta.elements );		
		Ext.each(oConfig, function(cfg){
			this.add(cfg);			
		}, this);							
			
		this.doLayout();
		if(this.monitorValid){
            this.startMonitoring();
        }
    },
	
	/**
	 * Handler for the monitorValid flag
	 */
	bindHandler : function(){		
        if(!this.bound){
            return false; // stops binding
        }
        var valid = true;
        this.findBy(function(f){
            if(f.isFormField === true && !f.isValid(true)){
                valid = false;
                return false;
            }
        });
        if(this.buttons){
            for(var i = 0, len = this.buttons.length; i < len; i++){
                var btn = this.buttons[i];
                if(btn.formBind === true && btn.disabled === valid){
                    btn.setDisabled(!valid);
                }
            }
        }
        this.fireEvent('clientvalidation', this, valid);
    },
    
	/**
	  * @private
	  */
    onOk:function() {
        this.updateBoundData();
        this.fireEvent('ok', this);
    },
    
	/**
	 * If configured, start loading fileds now
	 */
    afterRender:function() {
        // call parent
        Ext.ux.form.XMetaForm.superclass.afterRender.apply(this, arguments);

        this.form.waitMsgTarget = this.getEl();
        if(true === this.autoInit) {
            this.load({params:{meta:true}});
        }else if ('object' == typeof this.autoInit) {
            this.load(this.autoInit);
        }
    },
    
    /**
	  * @private
	  */
    removeAll:function() {
    	// remove border from header
        var hd = this.body.up('div.x-panel-bwrap').prev();
        if(hd) {
            hd.applyStyles({border:'none'});
        }
        
        // remove form panel items
        this.items.each(this.remove, this);
        
        // remove basic form items
        this.form.items.clear();
    },
    
	/**
	 * Resets the form
	 */
    reset: function() {
        this.form.reset();
    },
    
	/**
	  * @private
	  */
    setDefaultValues: function() {
        this.form.items.each(function(item) {
            item.setValue(item.defaultValue);
        });
    },
    
	/**
	 * Validate the form
	 * @param {Boolean} deep false to end validation routine on the first invalid field, true otherwise
	 * @param {Boolean} preventMark true to prevent invalid-state marker on the field, false otherwise
	 * 
	 * @return {Boolean} true if the form is valid, flse otherwise
	 */
    isValid: function(deep, preventMark){
    	var isValid = true;
    	// pull out the form fields
    	var fields = this.findBy(function(comp){
    		if(comp.isXType('field')){
    			return true;
    		}
    	});
    	
    	// validate them
    	Ext.each(fields, function(f){
    		if(f.isValid(preventMark) === false){
    			isValid = false;
    			if(deep === false){
    				return false;
    			}
    		}
    	});    	
        return isValid;
    },
  	
	/**
	 * Submit the form
	 * @param {Object} o submission parameter config
	 */
    submit:function(o) {
    	if(this.isValid(true, false) === true){
    		var options = this.getOptions(o || {});
	        if(this.savingText) {
	            options.waitMsg = this.savingText;
	        }        
	        this.form.submit(options);
    	}	        
    },
    
	/**
	  * @private
	  */
    updateBoundData:function() {
        if(this.data) {
            Ext.apply(this.data, this.getValues());
        }
    }

});

// register xtype
Ext.reg('xmetaform', Ext.ux.form.XMetaForm);
