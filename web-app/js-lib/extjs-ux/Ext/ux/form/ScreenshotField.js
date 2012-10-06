Ext.namespace('Ext.ux.form');

/**
 * @class Ext.ux.form.ScreenshotField
 * @extends Ext.form.TriggerField
 * @desc
 * Screenshot form field component for ExtJs 2.x
 * This component builds on the work of lopeky (BrowseButton) to allow for :
 * 1. Upload of files (pictures) to the server so that you can immediately preview what you uploaded.
 * 2. Selecting a picture from a remote location (inpired by Ext.ux.ImageField)<br><br>
 * 
 * Forum Thread : <a href="http://extjs.com/forum/showthread.php?t=37337">http://extjs.com/forum/showthread.php?t=37337</a><br>
 * Project Home : <a href="http://code.google.com/p/ext-ux-screenshotfield">http://code.google.com/p/ext-ux-screenshotfield</a><br>
 * Demo 		: <a href="http://extjs-ux.org/repo/authors/chalu/trunk/Ext/ux/form/screenshotfield/index.html">http://extjs-ux.org/repo/authors/chalu/trunk/Ext/ux/form/screenshotfield/index.html</a>
 * 
 * @version 2.0
 * @licence <a href="http://www.gnu.org/licenses/gpl.html">GPLv3</a>
 * @author Charles Opute Odili (chalu) <a href="mailto:chaluwa@gmail.com">chaluwa@gmail.com</a>
 * 
 * @constructor
 * @param {Object} config The config object
 */
Ext.ux.form.ScreenshotField = Ext.extend(Ext.form.TriggerField, {
	/**
	 * @cfg {Array} filetypeList
	 * A list of file types to allow for upload, applied if mode is local
	 */
	filetypeList: ['gif', 'jpg', 'png'],	  
    
    /**
     * @cfg {Number} width
     * The width of the screenshot
     */
    width: 80,
    
    /**
     * @cfg {Number} height
     * The height of the screenshot
     */
    height: 90,
    
    /**
     * @cfg {String} uploadUrl
     * The upload URL for the screenshot, if not specified
     * the url of the field's form is assumed 
     */
    uploadUrl: null,    
    
    /**
     * @cfg {String} name
     * The name the file upload is submited with, also serves
     * as the name of this input field
     */
    name: 'screenshot',                
    
    /**
     * @cfg {String} waitMsg
     * A message to mask the field with, while the file is uploading (in local mode)
     */
	waitMsg: 'Uploading',
	
	/**
     * @cfg {String} invalidClass 
     * The CSS class to use when marking the field invalid (defaults to "x-form-screenshotfield-invalid")
     */
	invalidClass: 'x-form-screenshotfield-invalid',
	
	/**
     * @cfg {String} fieldClass 
     * The default CSS class for the field (defaults to "x-form-screenshotfield")
     */
	fieldClass : "x-form-screenshotfield",
	
	/**
     * @cfg {String} triggerClass 
     * A CSS class to apply to the trigger
     */
	triggerClass : 'x-form-screenshotfield-trigger',
	
	/**
	 * @cfg {Object} baseParams
	 * Extra parameters to send with the upload, defaults to null
	 */
	baseParams: null,
	
	/**
	 * @cfg {String} mode 
	 * A switch to determine how the field browses for screenshots. Valid
	 * values are 'local' or 'remote' and defaults to 'local'. In local mode the trigger brings
	 * up the browser's browse dialog so the user can select an image for upload to the server.
	 * In 'remote' mode the trigger brings up a browser of remote files (dataview) from which the user can select an image.
	 */
	mode: 'local',	
	
	/**
     * @cfg {Number} browserWidth 
     * The width of the remote  browser window (dataview)
     */
	browserWidth: 300,
	
	/**
     * @cfg {Number} browserHeight 
     * The height of the remote browser window (dataview)
     */
    browserHeight: 300,
	
	/**
     * @cfg {String} browserTitle 
     * The title of the remote browser window (dataview)
     */
    browserTitle: 'Select An Image',
	
    /**
     * @cfg {Boolean} alwaysLoadStore 
     * True to reload the data store every time the remote browser opens, default is false
     */
    alwaysLoadStore: false,
	
    /**
     * @cfg {Object} windowConfig 
     * Additional configuration for the remote browser window
     */	
	windowConfig: null,	
	
    /**
     * @cfg {Object} browser 
     * The browser {Ext.DataView} of the remote files
     */	
	browser: null,
	
	/**
     * @cfg {String} valueField 
     * The data store field (in remote mode) to return as the field's value
     */	
	valueField : 'url',	
	
	/**
	 * @cfg {String} value 
	 * The value (picture url) to initialize the field with, defaults to Ext.BLANK_IMAGE_URL
	 */
	value: Ext.BLANK_IMAGE_URL,
    
	/**
     * Inits this component with the specified config-properties and automatically
     * creates its components.
     */
    initComponent: function(){ 
		this.hideTrigger = this.readOnly;
		this.hasChange = false;
        Ext.ux.form.ScreenshotField.superclass.initComponent.apply(this, arguments);
        
        this.width = parseInt(this.width, 10);
        this.height = parseInt(this.height, 10);
        
		if(this.mode === 'local'){
			this.addEvents({
				'upload': true,
	        	'beforeupload': true,
	        	'afterupload': true
	        });	        
	        
	        var dynRegex = /.*/;
			if (this.filetypeList &&  Ext.isArray(this.filetypeList)) {
				var dynRegexStr = '\\w+\\.(';
				dynRegexStr += this.filetypeList.join('|');
				dynRegexStr += ')$';				
				dynRegex = new RegExp(dynRegexStr);
			}
			this.regex = dynRegex;			
			this.FLOAT_EL_WIDTH = 18;
			this.FLOAT_EL_HEIGHT = 20;
		}else if(this.mode === 'remote'){			
    		this.selections = [];
    		this.selectedRecords = [];
			this.isStoreLoaded = false;
			
			// we may be given just a config literal
			if(this.browser && this.browser.enable == undefined){
				if(this.browser.store.add == undefined){
					this.browser.store = new Ext.data.JsonStore(this.browser.store);
				}
				
				if(this.browser.tpl.apply == undefined){
					this.browser.tpl = new Ext.XTemplate(this.browser.tpl);
				}				
				this.browser = new Ext.DataView(this.browser);
				
				// if store was auto loaded, mark it as loaded
		        if(this.browser.store.autoLoad){
		            this.isStoreLoaded = true;
		        }
			}							
		}
    },
    
	/**
     * Renders the component within it's container
     */
    onRender: function(ct, position){
    	Ext.ux.form.ScreenshotField.superclass.onRender.call(this, ct, position);        
		
		this.el.dom.style.border = '0 none';
        this.el.dom.setAttribute('tabIndex', -1);
        this.el.addClass('x-hidden');
        if(Ext.isIE){ 
            this.el.applyStyles('margin-top:-1px;margin-bottom:-1px;');
        }
		
		this.imageEl = this.el.insertSibling({tag: 'img', src: this.value, width: this.width, height: this.height});
		this.imageEl.addClass(this.fieldClass + '-image');
		
		this.wrapWidth = this.width + 3;
		this.wrapHeight = this.height + 3;
        this.wrap.setWidth(this.wrapWidth);
        this.wrap.setHeight(this.wrapHeight);
        
		if(!this.hideTrigger && this.mode === 'local'){
			this.clipEl = this.trigger.wrap({tag: 'span'});		
			this.setClipSize();
			this.addClipListeners();		
			this.floatEl = this.clipEl.createChild({
				tag: 'div',
				style: {
					position: 'absolute',
					width: this.FLOAT_EL_WIDTH + 'px',
					height: this.FLOAT_EL_HEIGHT + 'px',
					overflow: 'hidden'
				}
			});		
			
			if(this.debug){
				this.clipEl.applyStyles({
					'background-color': 'green'
				});
				this.floatEl.applyStyles({
					'background-color': 'red'
				});
			}else{
				//this.clipEl.setOpacity(0.0);
				this.floatEl.setOpacity(0.0);
			}
			
			// Cover cases where someone tabs to the button:
			// Listen to focus of the button so we can translate the focus to the input file el.
			// In IE, it's possible to tab to the text portion of the input file el.  
			// We want to listen to keyevents so that if a space is pressed, we "click" the input file el.
			this.wrap.on('focus', this.onFieldFocus, this);
			if(Ext.isIE) {
				this.wrap.on('keydown', this.onFieldKeyDown, this);
			}		
			this.createInputFile();
	        
	        this.mask = new Ext.LoadMask(this.wrap, {
	        	msg: this.waitMsg
	        });
	        this.mask.hide();
		}				
    },
	
	/**
	 * @private
	 */
	resizeField: function(){		
		var fieldItem = this.wrap.up('div.x-form-item');
		var estimate = this.imageEl.getHeight() + 10;
		if(!this.parentForm){
    		this.parentForm = this.getParentForm();
    	}
    	
    	var alignCfg = this.parentForm.initialConfig.labelAlign;
    	if(alignCfg === 'top'){
    		// if labelAlign is set to top we have to make up for the extra margin and
    		// padding that the field label gets 			
    		estimate += 15;
    	}						
		fieldItem.setHeight(estimate); // resize to prevent scrolling
		fieldItem.applyStyles({'background-color': 'red'});
	},
    
	/**
	 * Return the name of this screenshot field
	 * 
	 * @return {String} field name
	 */
    getName: function(){
         return this.rendered ? (this.hiddenName || this.name || this.id) : '';
    },
    
	/**
	 * Return the value of screenshot field, i.e the selected / uploaded screenshot
	 * 
	 * @return {String} the field value
	 */
    getValue: function(){
    	if(!this.rendered) {
            return Ext.ux.form.ScreenshotField.superclass.getValue.call(this);
        }
        return this.getScreenshotView();
    },
    
	/**
	 * Sets the fields value 
	 * @param {String} v the new value
	 */
    setValue: function(v){
        Ext.ux.form.ScreenshotField.superclass.setValue.call(this, v);
        if(this.rendered){
        	this.setScreenshotView(v);
        }        
    },
    
	/**
	 * Validates the current value in the screenshot field
	 * @param {Object} value the value to validate
	 * 
	 * @return {Boolean} true if valid false otherwise
	 */
    validateValue: function(value){
    	if(value === Ext.BLANK_IMAGE_URL){ // if it's blank
             if(this.allowBlank){
                 this.clearInvalid();
                 return true;
             }else if(this.hasChange){ // an input attempt has been made on this field
                 this.markInvalid(this.blankText);
                 return false;
             }
        }  
        if(typeof this.validator == "function"){
            var msg = this.validator(value);
            if(msg !== true){
                this.markInvalid(msg);
                return false;
            }
        }
        return true;
    },
	
	/**
	 * Disables the screenshot field
	 */
	disable: function(){
		Ext.ux.form.ScreenshotField.superclass.disable.call(this);		
		if(this.mode === 'local'){
			console.info('disabled on local');
			this.removeClipListeners();		
			this.inputFileEl.dom.disabled = true;
		}			
	},
	
	/**
	 * Enables the screenshot field
	 */
	enable: function(){
		Ext.ux.form.ScreenshotField.superclass.enable.call(this);				
		if(this.mode === 'local'){
			this.addClipListeners();
			this.inputFileEl.dom.disabled = false;
		}			
	},
	
	/**
	 * Mark this field as invalid
	 * @param {String} msg the invalid message
	 */
	markInvalid : function(msg){
		Ext.ux.form.ScreenshotField.superclass.markInvalid.call(msg);
		
        if(!this.rendered || this.preventMark){ // not rendered
            return;
        }
        this.imageEl.addClass(this.invalidClass);
        msg = msg || this.invalidText;

        switch(this.msgTarget){
            case 'qtip':
                this.imageEl.dom.qtip = msg;
                this.imageEl.dom.qclass = 'x-form-invalid-tip';
                if(Ext.QuickTips){ // fix for floating editors interacting with DND
                    Ext.QuickTips.enable();
                }
                break;
            case 'title':
                this.imageEl.dom.title = msg;
                break;
            case 'under':
                if(!this.errorEl){
                    var elp = this.getErrorCt();
                    if(!elp){ // field has no container el
                        this.imageEl.dom.title = msg;
                        break;
                    }
                    this.errorEl = elp.createChild({cls:'x-form-invalid-msg'});
                    this.errorEl.setWidth(elp.getWidth(true)-20);
                }
                this.errorEl.update(msg);
                Ext.form.Field.msgFx[this.msgFx].show(this.errorEl, this);
                break;
            case 'side':
                if(!this.errorIcon){
                    var elp = this.getErrorCt();
                    if(!elp){ // field has no container el
                        this.imageEl.dom.title = msg;
                        break;
                    }
                    this.errorIcon = elp.createChild({cls:'x-form-invalid-icon'});
                }
                this.alignErrorIcon();
                this.errorIcon.dom.qtip = msg;
                this.errorIcon.dom.qclass = 'x-form-invalid-tip';
                this.errorIcon.show();
                this.on('resize', this.alignErrorIcon, this);
                break;
            default:
                var t = Ext.getDom(this.msgTarget);
                t.innerHTML = msg;
                t.style.display = this.msgDisplay;
                break;
        }
        this.fireEvent('invalid', this, msg);
    },
	
	/**
	 * Removes the invalid maker from the field
	 */
	clearInvalid: function(){
		Ext.ux.form.ScreenshotField.superclass.clearInvalid.call(this);
		
        if(!this.rendered || this.preventMark){ // not rendered
            return;
        }
        this.imageEl.removeClass(this.invalidClass);
        switch(this.msgTarget){
            case 'qtip':
                this.imageEl.dom.qtip = '';
                break;
            case 'title':
                this.imageEl.dom.title = '';
                break;
            case 'under':
                if(this.errorEl){
                    Ext.form.Field.msgFx[this.msgFx].hide(this.errorEl, this);
                }
                break;
            case 'side':
                if(this.errorIcon){
                    this.errorIcon.dom.qtip = '';
                    this.errorIcon.hide();
                    this.un('resize', this.alignErrorIcon, this);
                }
                break;
            default:
                var t = Ext.getDom(this.msgTarget);
                t.innerHTML = '';
                t.style.display = 'none';
                break;
        }
        this.fireEvent('valid', this);
    },
	
	/**
	 * Applys the Ext.ux.form.ScreenshotField.filetypeList check 
	 * @param {String} value the value to validate
	 * 
	 * @return {String/Boolean} true if valid, else Ext.form.Field.invalidText
	 */
	validator: function(value){
		if(this.regex && !this.regex.test(value)){
            return this.invalidText;
        }
        return true;
	},
	
	/**
	 * @private
	 */
    getSelectedRecords: function(){
		this.selections = this.browser.getSelectedIndexes();
		this.selectedRecords = this.browser.getSelectedRecords();
        return this.selectedRecords;
    },
	
	/**
	 * @private
	 */
    onSelect: function(){
		var selectedRecords = '';
		var returnValue = (this.getSelectedRecords().length > 0) ? this.selectedRecords[0].get(this.valueField) : '';		
		if (returnValue !== this.value){			
			this.setValue(returnValue);
			this.hasChange = true;	
	        //this.setValidState(true);
			this.validate();
		}
        this.window.hide();
		this.fireEvent('collapse', this, this.browser);
    },
				
    /**
     * The function that should handle the trigger's click event. 
     * This method is only called in remote mode
     * @param {Object} e click event
     */
    onTriggerClick : function(e){
		if(this.disabled){
			console.info('disabled on remote');
            return;
        }
        // load the data store
        if (!this.isStoreLoaded) {
            this.browser.store.load();
            this.isStoreLoaded = true;
        } else if (this.alwaysLoadStore == true) {
            this.browser.store.reload();
        }
		// setup window with forced config
		this.windowConfig = Ext.apply(this.windowConfig || {}, {
			title: this.browserTitle,
			width: this.browserWidth,
			height: this.browserHeight,
			draggable: false,
			resizable: false,
			closable: false,
			autoScroll: true,
			layout: 'fit',
			cls: 'x-form-screenshotfield-dataview',
			bbar: [{
				text: 'Cancel',
				handler: function(){
					this.browser.clearSelections();
					this.window.hide();
					this.fireEvent('collapse', this, this.browser);
				}, scope: this
			},'->',{
				text: 'Select',
				handler: this.onSelect,
				scope: this
			}],
			items: this.browser
		},{
			shadow: false,
			frame: true
		});
		// create the image browser window
        if(!this.window){
            this.window = new Ext.Window(this.windowConfig);
            this.window.setPagePosition(this.trigger.getRight(), this.trigger.getTop());
            this.browser.on('dblclick', this.onSelect, this);
        }
		// show the image browser window
        this.window.show();
		this.fireEvent('expand', this, this.browser);
	},
    
	/**
	 * Return the basename of the file selection (field value)
	 * @param {String} value field value
	 * 
	 * @return {String} basename
	 */
    getFileBaseName: function(value){
    	if(value){
    		value = value.substring( value.lastIndexOf('/')+1 );
	    	return value;
    	}	
    	return value;
    },
    
	/**
	 * @private
	 */
    setClipSize: function(){
		if(this.clipEl) {
			var width = this.wrapWidth;
			var height = this.wrapHeight;
			if(Ext.isIE) {
				width += 2;
				height += 8;
			} else if (Ext.isGecko) {
				width += 3;
				height += 9;
			} else if (Ext.isSafari) {
				width += 3;
				height += 9;
			}
			this.clipEl.setSize(width, height);						
		}
	},
	
	/**
	 * @private
	 */
	addClipListeners: function(){
		this.clipEl.on({
			'mousemove': this.onButtonMouseMove,
			'mouseover': this.onButtonMouseMove,
			scope: this
		});
	},
	
	/**
	 * @private
	 */
	removeClipListeners: function(){
		this.clipEl.removeAllListeners();
	},
	
	/**
	 * @private
	 */
	createInputFile: function(){
		this.inputFileEl = this.floatEl.createChild({
			tag: 'input',
			type: 'file',
			size: 1, // must be > 0. It's value doesn't really matter due to our masking div (inputFileCt).  
			name:  this.uploadName || this.hiddenName || this.name || Ext.id(this.el),
			tabindex: this.tabIndex,
			// Use the same pointer as an Ext.Button would use.  This doesn't work in Firefox.
			// This positioning right-aligns the input file to ensure that the "Browse" button is visible.
			style: {
				position: 'absolute',
				cursor: 'pointer',
				right: '0px',
				top: '0px'
			}
		});
		this.inputFileEl = this.inputFileEl.child('input') || this.inputFileEl;		
		
		// setup events
		this.inputFileEl.on({
			'click': this.onInputFileClick,
			'change': this.onInputFileChange,
			'focus': this.onInputFileFocus,
			'select': this.onInputFileFocus,
			'blur': this.onInputFileBlur,
			scope: this
		});
		
		// add a tooltip
		if (this.tooltip) {
			if (typeof this.tooltip == 'object') {
				Ext.QuickTips.register(Ext.apply({
					target: this.inputFileEl
				}, this.tooltip));
			} else {
				this.inputFileEl.dom[this.tooltipType] = this.tooltip;
			}
		}		
	},
	
	/**
	 * @private
	 */
	onFieldFocus: function(e){
		if (this.inputFileEl) {
			this.inputFileEl.focus();
			e.stopEvent();
		}
	},
	
	/**
	 * @private
	 */
	onFieldKeyDown: function(e){
		if (this.inputFileEl && e.getKey() == Ext.EventObject.SPACE) {
			this.inputFileEl.dom.click();
			e.stopEvent();
		}
	},
	
	/**
	 * @private
	 */
	onButtonMouseMove: function(e){
		var xy = e.getXY();
		xy[0] -= this.FLOAT_EL_WIDTH / 2;
		xy[1] -= this.FLOAT_EL_HEIGHT / 2;
		this.floatEl.setXY(xy);
	},
	
	/**
	 * @private
	 */
	onInputFileFocus: function(e){
		if (!this.isDisabled) {
			//this.wrap.addClass("x-box-blue");
		}
	},
	
	/**
	 * @private
	 */
	onInputFileBlur: function(e){
		//this.wrap.removeClass("x-box-blue");
	},

	/**
	 * @private
	 */
	onInputFileClick: function(e){
		e.stopPropagation();
	},
	
	/**
	 * @private
	 */
	onInputFileChange: function(){
		this.upload.call(this);
	},
	
	/**
	 * @private
	 */
	getInputFile: function(){
		return this.inputFileEl;
	},
    
	/**
	 * Return the containing form for this field
	 * 
	 * @return {Ext.form.FormPanel} The parent form
	 */
    getParentForm: function(){
    	var form = this.findParentBy(function(ct){
    		if(ct.isXType('form')){
				return true;
			}
    	}, this);
    	return form;
    },
    
	/**
	 * Sets the view (image / screenshot) for this field
	 * @param {Object} v the value to set the view with
	 */
    setScreenshotView: function(v){
    	if(this.imageEl){
    		var src = (v === null || v === undefined ? Ext.BLANK_IMAGE_URL : v);    	
	        this.imageEl.dom.src = src;
    	}	    	
    },
    
	/**
	 * Gets the current image / screenshot of this ffield
	 * 
	 * @return {String} the screenshot value
	 */
    getScreenshotView: function(){
    	if(this.imageEl){
    		return this.imageEl.dom.src;
    	}
        return this.value;
    },
    
	/**
	 * Sets the URL to upload screenshots to
	 * @param {String} url the upload url
	 */
    setUploadURL: function(url){
    	this.uploadUrl = url;
    },
	
	/**
	 * @private
	 */
	upload: function(){
		// do the upload  
    	if(!this.parentForm){
    		this.parentForm = this.getParentForm();
    	} 
		var oParams = Ext.apply({  
        	scope: this,
        	success: this.onSuccess,
            failure: this.onFailure,
            url: this.uploadUrl || this.parentForm.initialConfig.url            
        }, {
        	params: this.baseParams || {}
        }); 
		
		if(this.fireEvent('beforeupload', this) === true){					
			if(this.validator( this.inputFileEl.dom.value.toLowerCase() ) === true){
				this.mask.show();
				this.inputFileEl.addClass('x-hidden');
	        	var form = this.parentForm.getForm();
	        	this.inputFileEl = this.inputFileEl.appendTo(form.getEl());								
				form.submit(Ext.apply(oParams, {
	        		clientValidation: false
	        	}));
				this.fireEvent('upload', this);
			}        	       	    		
		}
	},
    
	/**
	 * @private
	 */
    afterupload: function(form, field, result){
		this.hasChange = true;
    	this.inputFileEl.remove();
        this.mask.hide(); 
        this.createInputFile();
		this.fireEvent('afterupload', form, field, result);
    },
    
	/**
	 * Default success handler called after an upload (in local mode)
	 * @param {Ext.form.FormPanel} form parent form for the field
	 * @param {Ext.form.Action.Submit} action form submit action object
	 */  
    onSuccess: function(form, action){
    	var result = action.result;
    	this.setValue(result.url);
		this.afterupload(form, this, result);        
        this.validate();
    },
       
	/**
	 * Default failure handler called after an upload (in local mode)
	 * @param {Ext.form.FormPanel} form parent form for the field
	 * @param {Ext.form.Action.Submit} action form submit action object
	 */ 
    onFailure: function(form, action){
    	var result = action.result;
    	this.handleErrors(result, result.errors);
        this.afterupload(form, this, result);
    },
    
	/**
	 * Default uploaad error handler
	 * @param {Ext.form.FormPanel} form parent form for the field
	 * @param {Ext.form.Action.Submit} action form submit action object
	 */
    handleErrors: function(result, errors){    	
    	if(!this.errorMsgTpl){
    		this.errorMsgTpl = new Ext.XTemplate(
	        	'<p>Upload Errors : </p>', 
	        	'<tpl for="errors">', 
	        		'<p>- {.}</p>', 
	        	'</tpl>'
	        );
    	}
    	Ext.Msg.show({
            title: 'Upload Failed',
            msg: errors ? this.errorMsgTpl.applyTemplate(result) : "<p>Your Screenshot Was Not Uploaded</p>",
            buttons: Ext.Msg.OK,
            minWidth: 300
        });
    }
    
});

Ext.reg('screenshotfield', Ext.ux.form.ScreenshotField);