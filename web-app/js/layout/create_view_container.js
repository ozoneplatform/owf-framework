/**
 * @class Ozone.layout.CreateViewContainer
 * @extends Ext.form.Panel
 */
Ext.define('Ozone.layout.CreateViewContainer', {
    extend: 'Ext.form.Panel',
    alias: [
        'widget.owfCreateDashboardsContainer',
        'widget.owfCreateViewsContainer',
        'widget.Ozone.layout.CreateViewContainer'
    ],
    requires: [
        'Ext.layout.container.Border'
    ],
    border: false,
    config: {},
    views: null,
    dashboardContainer: null,
    itemId: 'createNewDashboardPanel',
    cls: 'cvc-createNewDashboardContainer',
    afterRenderInitComplete: false,
    createViewContainer_FormValid: true,
    hideViewSelectRadio: false,
    stackId: null, // parent stack id

    /**
    *
    * Returns a dashboard store with non marketplace dashboards
    *
    **/
    getDashboardStore: function () {
        var dashboard,
            dashboards = [],
            dashboardStore = this.dashboardContainer.dashboardStore,
            storeDashboards = dashboardStore.data.items;

        for(var i = 0, len = storeDashboards.length; i < len; i++) {
            dashboard = storeDashboards[i];
            if(dashboard.get('type') !== 'marketplace') {
                dashboards.push(dashboard.data);
            }
        }
        
        var store = Ext.create('Ozone.data.DashboardStore', {
            data: dashboards
        });

        return store;
    },

    initComponent: function() {
        this.config = this.dashboardContainer.activeDashboard.config;
        this.views = this.dashboardContainer.dashboards;
        
        this.addEvents('saved', 'failed');

        this.headerLabel = {
            xtype: 'label',
            name: 'headerLabel',
            forId: 'myFieldId',
            cls: 'createNewHeaderLabel',
            text: this.headerText,
            margins: '0 0 0 10'
        };

        this.iconImage = Ext.create('Ext.Img', {
            name: 'appIconImage',
            cls: 'appIconImage',
            itemId: 'appIconImage',
            src: OWF.getContainerUrl() + Ozone.ux.DashboardMgmtString.dashboardIconPath,
            height: 54,
            width: 54,
            margin: '4 0 0 5',
           listeners: {
               show: function(a,b,c,d) {
                   alert('showing it');
               }
           }
        });

        var iconImage = this.iconImage;

        this.titleTextField = {
            xtype: 'textfield',
            name: 'titleTextField',
            cls: 'titleTextField',
            itemId: 'titleTextField',
            usePlaceholderIfAvailable: false,
            emptyText: Ozone.ux.DashboardMgmtString.titleBlankText,
            allowBlank: false,
            maxLength: 200,
            height: 22,
            value: '',
            enforceMaxLength: true,
            margin: '0 0 5 0'
        };

        this.iconURLField = {
            xtype: 'textfield',
            name: 'iconURLField',
            cls: 'iconURLField',
            itemId: 'iconURLField',
            usePlaceholderIfAvailable: false,
            emptyText: Ozone.ux.DashboardMgmtString.iconBlankText,
            allowBlank: true,
            maxLength: 200,
            height: 22,
            value: '',
            enforceMaxLength: true,
            margin: '0 0 5 0',
            listeners: {
                blur: function(field){
                    // Remove leading and tailing spaces
                    var val = field.getValue().replace(new RegExp(Ozone.lang.regexLeadingTailingSpaceChars), '');
                    field.setValue(val);
                    //$.get(val).done(function() { alert('it worked');}).fail(function() { alert('it failed');});
                    iconImage.setSrc(field.getValue());
                }
            }
        };

        this.titleIconContainer = {
            xtype: 'container',
            name: 'titleIconContainer',
            height: 60,
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            padding: '5, 5, 0, 15',
            items: [
                this.titleTextField,
                this.iconURLField
            ]
        };

        this.appInfoContainer = {
            xtype: 'container',
            name: 'appInfoContainer',
            layout: {
                type: 'hbox'
            },
            padding: '0, 5, 0, 0',
            items: [
                this.iconImage,
                this.titleIconContainer
            ]
        };

        this.titleBox = {
            xtype: 'textfield',
            name: 'titleBox',
            cls: 'titleBox',
            itemId: 'titleBox', //OWF-2558
            fieldLabel: Ozone.util.createRequiredLabel(Ozone.ux.DashboardMgmtString.title),
            labelSeparator: '',
            labelWidth: 150,
            allowBlank: false,
            maxLength: 200,
            value: '',
            enforceMaxLength: true,
            margin: '0 0 5 0',
            listeners: {
                blur: function(field){
                    // Remove leading and tailing spaces
                    var val = field.getValue().replace(new RegExp(Ozone.lang.regexLeadingTailingSpaceChars), '');
                    field.setValue(val);
                }
            }
        };

        this.description = {
            xtype: 'textareafield',
            name: 'description',
            cls: 'description',
            itemId: 'description',
            usePlaceholderIfAvailable: false,
            emptyText: Ozone.ux.DashboardMgmtString.descriptionBlankText,
            value: '',
            maxLength: 4000,
            enforceMaxLength: true,
            margin: '10 10 10 10'
        };

        if (this.existingDashboardRecord != null) {
            this.titleTextField.value = this.existingDashboardRecord.get('name');
            this.iconURLField.value = this.existingDashboardRecord.get('iconImageUrl');
            this.description.value = this.existingDashboardRecord.get('description');

            if (this.iconURLField.value != '' && this.iconURLField.value != null && this.iconURLField.value != undefined) {
                this.iconImage.setSrc(this.iconURLField.value);
            }
        }

        var enableInputComponent = function(component) {
            component.enable();
            component.validate();
        };

        var disableInputComponent = function(component) {
            component.reset();
            component.disable();
        };

        this.newViewRadio = {
            boxLabel: Ozone.layout.CreateViewWindowString.createNew,
            name: 'viewSelectRadio',
            cls:'newViewRadio',
            listeners: {
                'change': {
                    fn: function(radio, newValue) {
                        if(newValue)
                        {
                            disableInputComponent(this.down('#existViewCb'));
                        }
                    },
                    scope: this
                }
            }
        };

        this.existingViewRadio = { 
            boxLabel: Ozone.layout.CreateViewWindowString.createFromExisting,
            name: 'viewSelectRadio',
            inputValue: "copiedDashboard",
            cls:'existingViewRadio',
            //tabIndex: 2,
            listeners: {
                'change': {
                    fn: function(radio, newValue) {
                        if(newValue)
                        {
                            enableInputComponent(this.down('#existViewCb'));
                        }
                    },
                    scope: this
                }
            },
            vtype: 'copiedDashboard',
            copiedDashboardField: 'existViewCb' // id of the field to validate
        };
		
        this.premadeLayoutRadio = {
            boxLabel: Ozone.ux.DashboardMgmtString.premadeLayout,
            name: 'viewSelectRadio',
            inputValue: "premadeLayout",
            checked: 'true',
            cls:'importedViewRadio',
            listeners: {
                //this listener works for both since we can use the 'isSelected' param
                'change': {
                    fn: function(radio, newValue) {
                        if(newValue) {
                            disableInputComponent(this.down('#existViewCb'));
                        }
                    },
                    scope: this
                }
            },
            importedDashboardField: 'importFileupload' // id of the field to validate
        };

        this.premadeViewRow1 = {
            xtype: 'container',
            name: 'premadeViewRow1',
            cls: 'premadeViewRow',
            layout: {
                type: 'hbox'
            },
            height: 50,
            items: [
                {
                    xtype: 'button',
                    itemId: 'premadeDesktop',
                    cls: 'premadeLayoutButton premadeDesktop',
                    scale: 'banner-large'
                },
                {
                    xtype: 'button',
                    itemId: 'premadeFit',
                    cls: 'premadeLayoutButton premadeFit',
                    scale: 'banner-large'
                },
                {
                    xtype: 'button',
                    itemId: 'premadeTabbed',
                    cls: 'premadeLayoutButton premadeTabbed',
                    scale: 'banner-large'
                },
                {
                    xtype: 'button',
                    itemId: 'premade2ColumnFit',
                    cls: 'premadeLayoutButton premade2ColumnFit',
                    scale: 'banner-large'
                },
                {
                    xtype: 'button',
                    itemId: 'premade2RowFit',
                    cls: 'premadeLayoutButton premade2RowFit',
                    scale: 'banner-large'
                },
                {
                    xtype: 'button',
                    itemId: 'premade4Fit',
                    cls: 'premadeLayoutButton premade4Fit',
                    scale: 'banner-large'
                }
            ]
        };

        this.premadeViewRow2 = {
            xtype: 'container',
            name: 'premadeViewRow2',
            cls: 'premadeViewRow',
            layout: {
                type: 'hbox'
            },
            height: 50,
            items: [
                {
                    xtype: 'button',
                    itemId: 'premade2ColumnPortal',
                    cls: 'premadeLayoutButton premade2ColumnPortal',
                    scale: 'banner-large'
                },
                {
                    xtype: 'button',
                    itemId: 'premadeAccordionFit',
                    cls: 'premadeLayoutButton premadeAccordionFit',
                    scale: 'banner-large'
                },
                {
                    xtype: 'button',
                    itemId: 'premadeTabbedAccordion',
                    cls: 'premadeLayoutButton premadeTabbedAccordion',
                    scale: 'banner-large'
                },
                {
                    xtype: 'button',
                    itemId: 'premade2RowFitTabbed',
                    cls: 'premadeLayoutButton premade2RowFitTabbed',
                    scale: 'banner-large'
                },
                {
                    xtype: 'button',
                    itemId: 'premadeAccordion2RowFit',
                    cls: 'premadeLayoutButton premadeAccordion2RowFit',
                    scale: 'banner-large'
                },
                {
                    xtype: 'button',
                    itemId: 'premadeTabbed2Fit',
                    cls: 'premadeLayoutButton premadeTabbed2Fit',
                    scale: 'banner-large'
                }
            ]
        };

        this.premadeViewContainer = {
            xtype: 'container',
            name: 'premadeViewContainer',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            padding: '5, 5, 0, 15',
            items: [
                this.premadeViewRow1,
                this.premadeViewRow2
            ]
        };
		
        this.existingView = {
            xtype: 'combo',
            itemId: 'existViewCb',
            store: this.getDashboardStore(),
            valueField:'guid',
            displayField:'name',
            hideLabel: true,
            typeAhead: true,
            queryMode: 'local',
            value: null,
            triggerAction: 'all',
            editable: true,
            selectOnFocus:true,
            allowBlank:true,
            forceSelection: true,
            disabled: true,
            padding: '0, 0, 5, 0',
            margin: '0, 5, 0, 17'            
        };
        this.existingView.value = this.views[0].guid;

        function handleInvalidFileUpload(current) {
            dashboardJson = null;
            Ozone.Msg.alert(Ozone.util.ErrorMessageString.dashboardConfig, "Invalid configuration file.", function () {
                current.focusTitleBox();
            }, current, null, current.dashboardContainer.modalWindowManager);
        }

        var container = this;
        var dashboardJson = null;
        var isSubmittingForm = false;
        
        this.importedView = {
            xtype: 'filefield',
            itemId: 'importFileupload',
            cls: 'importFileupload',
            name: 'importFileupload',
            hideLabel: true,
            label: '',
            padding: '0, 0, 5, 0',
            margin: '0, 5, 0, 17',
            emptyText: Ozone.ux.DashboardMgmtString.uploadConfig,
            allowBlank: true,
            disabled: true,
            buttonText:Ozone.ux.DashboardMgmtString.browse,
            listeners: {
                afterrender: function (cmp) {
                    cmp.setupFocus = function() {
                        /*
                         * We need to have the file input be focusable, but
                         * have it appear that the button is what actually has focus
                         */

                        var btnEl = this.button.getEl();
                        var innerBtnEl = this.button.btnEl;
                        var fileInputEl = this.fileInputEl;
                        var allowFocus = true;

                        //set the <button> element and the text field to not be focusable
                        innerBtnEl.dom.tabIndex = -1;
                        cmp.inputEl.dom.tabIndex = -1;

                        fileInputEl.dom.tabIndex = 0;
                        fileInputEl.dom.hideFocus = true;
                        fileInputEl.dom.style.outlineStyle = 'none';

                        cmp.mon(fileInputEl, 'focus', function() {
                            this.addCls('x-focus');
                        }, btnEl);

                        cmp.mon(fileInputEl,'blur', function() {
                            this.removeCls('x-focus');
                        }, btnEl);

                        function enableBorder() {
                            allowFocus = true;
                        }

                        cmp.mon(fileInputEl, {
                            mouseup: enableBorder,
                            mouseout: enableBorder
                        });
                    };

                    cmp.setupFocus();

                    //override the reset function
                    cmp._reset = cmp.reset;
                    cmp.reset = function() {
                        
                        if (!isSubmittingForm) {
                            this._reset.apply(this, arguments);
                            dashboardJson = null;
                        }
                        // this small block does exactly what the extjs reset does, except
                        // it does not clear out the inputEl value because we want to see
                        // the file in the input text field after selecting it.  if the 
                        // fileInputEl is not removed then created again, the browse button
                        // will not work a second time.
                        else {
                            if (this.rendered) {
                                this.fileInputEl.remove();
                                this.createFileInput();
                            }
                            this.callParent();
                        }
                        
                        this.setupFocus();
                    }
                },
                change: function( cmp, value, eOpts ) {

                    isSubmittingForm = true;
                    container.getForm().submit({
                        clientValidation: false,
                        reset: false,
                        url: Ozone.util.contextPath() + '/servlet/FileServlet',
                        waitMsg: 'Reading file...',
                        success: function (fp, action) {

                            dashboardJson = Ozone.util.parseJson(action.response.responseText).value;
                            
                            if (!Ozone.util.validateDashboardJSON(dashboardJson)) {
                                handleInvalidFileUpload();
                            }
                            else {
                                
                                // if the description field is empty, fill it in with the imported description field, otherwise do nothing
                                if (container.down('#description').getValue() == null || container.down('#description').getValue() == "") {
                                    container.down('#description').setValue(dashboardJson.description);
                                }   
                            }
                            isSubmittingForm = false;
                        },
                        failure: Ext.bind(function (form, action) {
                            handleInvalidFileUpload(container);
                            isSubmittingForm = false;
                        }, container)
                    });
                }
            }
        };


        //RadioGroup and CheckboxGroup does not properly validate other form fields that are not radio/checkboxes
        //when mixed with radio/checkbox fields because it assumes if any radio/checkbox is checked it can assume the
        //entire group is valid
        this.viewSelectRadio = {
            xtype: 'fieldcontainer',
            labelWidth: 110,
            layout: 'fit',
            cls: 'createSelector',
            region: 'center',
            allowBlank: false,
            hidden: this.hideViewSelectRadio,
            padding: '10, 0, 0, 0',
            items: [
                {
                    xtype: 'radiogroup',
                    cls: 'viewSelect',
                    itemId: "viewSelect", //OWF-2558
                    layout: 'anchor',
                    defaults: {
                        anchor: '100%',
                        padding: '0, 0, 5, 0'
                    },
                    items: [
                        this.premadeLayoutRadio,
                        this.premadeViewContainer,
                        this.existingViewRadio,
                        this.existingView,
                        this.newViewRadio
                    ]
                }
            ]
        };

        this.layout = {
        	type: 'fit'
        };

        this.defaults = {
            labelWidth: 175,
            labelSeparator: ''
        };

        this.margin = '0 0 0 0';
        this.items = [{
        	xtype: 'container',
        	layout: {
        		type: 'vbox',
        		align: 'stretch'
        	},
        	padding: '0, 5, 0, 0',
        	items: [
                    this.headerLabel,
                    this.appInfoContainer,
        	        this.description,
        	        this.viewSelectRadio
        	]
    	}];

        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            defaults: {
                minWidth: this.minButtonWidth
            },
            items: [{
                xtype: 'tbfill'
            },{
                xtype:'button',
                scale: 'small',
                text: Ozone.layout.DialogMessages.ok,
                itemId: 'saveButton',
                //iconCls: 'okSaveBtnIcon',
                //tabIndex: 4,
                handler: function (button, event) {
                    if (this.getForm().isValid() && this.createViewContainer_FormValid) {
                        var titleTextField = this.down('#titleTextField'),
                            descriptionBox = this.down('#description'),
                            iconImageUrlField = this.down('#iconURLField');

                        Ozone.util.formField.removeLeadingTrailingSpaces(titleTextField);
                        //make sure name is unique
                        Ext.getCmp('mainPanel').saveActiveDashboardToServer();

                        var title = titleTextField.getValue();
                        var desc = descriptionBox.getValue();
                        var iconImageUrl = iconImageUrlField.getValue();
                        
                        // add a space to the field if it is empty or null so that it will
                        // store an empty string to the db instead of it thinking its a null value
                        if (desc == null || desc == '')
                            desc = ' ';
                        if (iconImageUrl == null || iconImageUrl == '')
                            iconImageUrl = ' ';

                        //edit an existing dashboard if a record was passed in
                        if (this.existingDashboardRecord != null) {
                            this.existingDashboardRecord.set('name',title);
                            this.existingDashboardRecord.set('description',desc);
                            this.existingDashboardRecord.set('iconImageUrl', iconImageUrl);
                            this.dashboardContainer.editDashboard(this.existingDashboardRecord);
                            this.close();
                        }
                        //else create a new one
                        else {

                            var radioSelection = this.down('#viewSelect').getValue().viewSelectRadio;
                            var isCreateFromExisting = (radioSelection == "copiedDashboard") ? true : false;
                            var isImport = (radioSelection == "importedDashboard") ? true : false;

                            //create new from existing
                            if (isCreateFromExisting) {
                                var existingViewSelected = this.down('#existViewCb').getValue();

                                if (Ext.isEmpty(existingViewSelected)) {
                                    this.down('#existViewCb').markInvalid("This field cannot be blank.");
                                    Ozone.Msg.alert(Ozone.util.ErrorMessageString.invalidForm, Ozone.util.ErrorMessageString.invalidFormMsg, function () {
                                            this.focusTitleBox();
                                        }, this, null, this.dashboardContainer.modalWindowManager);
                                    return;
                                }

                                var existingViewToDuplicate = this.dashboardContainer.dashboardStore.getById(existingViewSelected).data;
                                existingViewToDuplicate = Ozone.util.cloneDashboard(existingViewToDuplicate, true);
                                
                                existingViewToDuplicate.name = title;
                                existingViewToDuplicate.description = desc;
                                existingViewToDuplicate.iconImageUrl = iconImageUrl;
                                existingViewToDuplicate.isdefault = false;

                                Ext.getCmp('mainPanel').createDashboard(
                                        Ext.create('Ozone.data.Dashboard', existingViewToDuplicate)
                                );

                                this.close();
                            }
                            //create new from import
                            else if (isImport) {
                                //check if the dashboardJson has been set from file upload
                                if (dashboardJson != null) {
                                    
                                    // Reset title
                                    dashboardJson.name = title;
                                    dashboardJson.description = desc;
                                    dashboardJson.iconImageUrl = iconImageUrl;

                                    // make sure the right type of json is being imported
                                    if (!Ozone.util.validateDashboardJSON(dashboardJson)) {
                                        Ozone.Msg.alert(Ozone.util.ErrorMessageString.dashboardConfig, "Invalid " + dashboardJson.layout + " configuration file.", function () {
                                            this.focusTitleBox();
                                        }, this, null, this.dashboardContainer.modalWindowManager);
                                    }
                                    else {
                                        delete dashboardJson.state;

                                        Ext.getCmp('mainPanel').createDashboard(
                                            Ext.create('Ozone.data.Dashboard', Ozone.util.cloneDashboard(dashboardJson, true))
                                            );
                                        this.close();
                                    }
                                }
                                else {
                                    Ozone.Msg.alert(Ozone.util.ErrorMessageString.invalidForm, Ozone.util.ErrorMessageString.invalidFormMsg, function () {
                                        this.focusTitleBox();
                                    }, this, null, this.dashboardContainer.modalWindowManager);
                                }
                            }
                            //create new using name, and description
                            else {
                                Ext.getCmp('mainPanel').createDashboard(
                                        Ext.create('Ozone.data.Dashboard', {
                                            "name": title,
                                            "description": desc,
                                            "iconImageUrl": iconImageUrl
                                        })
                                );
                                this.close();
                            }
                        }
                    }
                    else {
                        Ozone.Msg.alert(Ozone.util.ErrorMessageString.invalidForm, Ozone.util.ErrorMessageString.invalidFormMsg, function () {
                            this.focusTitleBox();
                        }, this, null, this.dashboardContainer.modalWindowManager);
                    }
                },
                scope: this,
                listeners: {
                    afterrender: function(button) {
                        button.getEl().on('keydown', function(e) {
                            e.stopPropagation(); //prevent keydown from bubbling up to the toolbar
                        });
                    }
                }
            },{
                xtype:'button',
                scale: 'small',
                text: 'Cancel',
                itemId: 'cancelBtn',
//                iconCls: 'cancelBtnIcon',
                scope: this,
                handler: this.cancel
            }]
        }];
		
        //Need this to get rid of destory errors with ExtJS
        this.on('beforedestroy', function(cmp){
            cmp.dockedItems = null;
        });

        //        this.on("afterrender", function(cmp) {
        //        	cmp.focusTitleBox();
        //        });

        this.callParent();
    },

    refreshData: function(){
        this.config = this.dashboardContainer.activeDashboard.config;
        this.views = this.dashboardContainer.dashboards;

        // Reset fields
        var txtTitle = this.down('#titleTextField');
        if (txtTitle) {
            txtTitle.setRawValue('');
        }

        var txtIconUrl = this.down('#iconURLField');
        if (txtIconUrl) {
            txtIconUrl.setRawValue('');
        }

        var txtDescription = this.down('#description');
        if (txtDescription) {
            txtDescription.setRawValue('');
        }

        var txtImportFile = this.down('#importFileupload');
        if (txtImportFile) {
            txtImportFile.setRawValue('');
        }

        var cboViewSelect = this.down('#viewSelect');
        if (cboViewSelect) {
            cboViewSelect.reset();
        }

        var existingView = this.down('#existViewCb');
        existingView.setValue(this.views[0].guid);
    },

    focusTitleBox: function() {
        /*
         * Have to defer this so that it happens after a focus that Ext does 
         * internally that is also deffered
         */
        Ext.defer(function() {
            this.down('#titleBox').focus();
        }, 500, this);
    },

    cancel: function () {
        this.close();
    },

    close: function() {
        Ext.getCmp(this.winId).close();
    }
});