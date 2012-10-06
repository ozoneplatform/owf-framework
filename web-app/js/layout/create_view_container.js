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

    initComponent: function() {
        this.config = this.dashboardContainer.activeDashboard.config;
        this.views = this.dashboardContainer.dashboards;
        
        this.addEvents('saved', 'failed');
        
        this.titleBox = {
            xtype: 'textfield',
            name: 'titleBox',
            cls: 'titleBox',
            itemId: 'titleBox', //OWF-2558
            fieldLabel: Ozone.util.createRequiredLabel(Ozone.ux.DashboardMgmtString.title),
            labelSeparator: '',
            labelWidth: undefined,
            allowBlank: false,
            maxLength: 200,
            value: '',
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
            fieldLabel: Ozone.ux.DashboardMgmtString.description,
            labelSeparator: '',
            labelWidth: undefined,
            value: '',
            maxLength: 255,
            enforceMaxLength: true
        };

        if (this.existingDashboardRecord != null) {
          this.titleBox.value = this.existingDashboardRecord.get('name');
          this.description.value = this.existingDashboardRecord.get('description');
        }

        this.existingViewRadio = { 
            boxLabel: Ozone.layout.CreateViewWindowString.createFromExisiting, 
            name: 'viewSelectRadio',
            inputValue: "copiedDashboard",
            cls:'existingViewRadio',
            //tabIndex: 2,
            listeners: {
                'change': {
                    fn: function(radio, newValue, oldValue) {
                        if(newValue)
                        {
                            // var cmp = this.down('#viewCb');
                            // cmp.reset();
                            // cmp.disable();

                            var existViewCb = this.down('#existViewCb');
                            existViewCb.enable();
                            existViewCb.validate();

                            var importFileupload = this.down('#importFileupload');
                            importFileupload.reset();
                            importFileupload.disable();
                        }
                    },
                    scope: this
                }
            },
            vtype: 'copiedDashboard',
            copiedDashboardField: 'existViewCb' // id of the field to validate
        };
		
        this.importedViewRadio = { 
            boxLabel: Ozone.layout.CreateViewWindowString.importView, 
            name: 'viewSelectRadio',
            inputValue: "importedDashboard",
            cls:'importedViewRadio',
            //tabIndex: 3,
            listeners: {
                //this listener works for both since we can use the 'isSelected' param
                'change': {
                    fn: function(radio, newValue, oldValue) {
                        if(newValue) {
                            var existViewCb = this.down('#existViewCb');
                            existViewCb.reset();
                            existViewCb.disable();

                            var importFileupload = this.down('#importFileupload');
                            importFileupload.enable();
                            importFileupload.validate();
                        }
                    },
                    scope: this
                }
            },
            vtype: 'importedDashboard',
            importedDashboardField: 'importFileupload' // id of the field to validate
        };
    	
        // Set default layout for creating a new dashboard
        //this.newView.value = this.config.layout;
		
        this.existingView = {
            xtype: 'combo',
            //tabIndex: 2,
            //id: 'existViewCb',
            itemId: 'existViewCb',
            store: this.dashboardContainer.dashboardStore,
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
            width: 400
        };
        this.existingView.value = this.views[0].guid;

        this.importedView = {
            xtype: 'filefield',
            //tabIndex: 3,
            //id: 'importFileupload',
            itemId: 'importFileupload',
            cls: 'importFileupload',
            name: 'importFileupload',
            hideLabel: true,
            label: '',
            width: 400,
            emptyText: Ozone.ux.DashboardMgmtString.uploadConfig,
            allowBlank: true,
            disabled: true,
            buttonText:Ozone.ux.DashboardMgmtString.browse,
    //        buttonConfig: {
    //            ui: 'button'
    //        },
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
                        this._reset.apply(this, arguments);

                        this.setupFocus();
                    }
                }
            }
        };


        //RadioGroup and CheckboxGroup does not properly validate other form fields that are not radio/checkboxes
        //when mixed with radio/checkbox fields because it assumes if any radio/checkbox is checked it can assume the
        //entire group is valid
        this.viewSelectRadio = {
            layout: {
                type: 'hbox',
                align: 'stretchmax'
            },
            cls: 'createSelector',
            region: 'center',
            allowBlank: false,
            hideLabel: true,
            hidden: this.hideViewSelectRadio,
            items: [
                [
                    {
                        xtype: 'radiogroup',
                        flex: 1,
                        cls: 'viewSelect',
                        itemId: "viewSelect", //OWF-2558
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        defaults: {
                            flex: 1
                        },
                        items: [
                            this.existingViewRadio,
                            this.importedViewRadio
                        ]
                    },
                    {
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        cls: 'viewSelectBoxes',
                        flex: 1,
                        defaults: {
                            flex: 1
                        },
                        items: [
                            this.existingView,
                            this.importedView
                        ]
                    }
                ]
            ]
        };

        this.layout = {
            type: 'vbox',
            align: 'stretch'
        };
        this.items = [
            this.titleBox,
            this.description,
            this.viewSelectRadio
        ];

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
                        Ozone.util.formField.removeLeadingTrailingSpaces(this.getComponent('titleBox'));
                        //make sure name is unique
                        Ext.getCmp('mainPanel').saveActiveDashboardToServer();

                        var title = this.getComponent('titleBox').getValue();
                        var desc = this.getComponent('description').getValue();

                        //edit an existing dashboard if a record was passed in
                        if (this.existingDashboardRecord != null) {
                            this.existingDashboardRecord.set('name',title);
                            this.existingDashboardRecord.set('description',desc);
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
                                        }, this, null, this.dashboardContainer.floatingWindowManager);
                                    return;
                                }

                                var existingViewToDuplicate = this.dashboardContainer.dashboardStore.getById(existingViewSelected).data;
                                existingViewToDuplicate = Ozone.util.cloneDashboard(existingViewToDuplicate, true);
                                
                                existingViewToDuplicate.name = title;
                                existingViewToDuplicate.description = desc;
                                existingViewToDuplicate.isdefault = false;

                                Ext.getCmp('mainPanel').createDashboard(
                                        Ext.create('Ozone.data.Dashboard', existingViewToDuplicate)
                                );

                                this.close();
                            }
                            //create new from import
                            else if (isImport) {
                                //check if the fileupload field was actually set
                                var importFileupload = this.down('#importFileupload');
                                if (!Ext.isEmpty("importFileupload")) {
                                    //create a new view based on imported file
                                    this.getForm().submit({
                                        url: Ozone.util.contextPath() + '/servlet/FileServlet',
                                        waitMsg: 'Uploading config file...',
                                        success: Ext.bind(function (fp, action) {
                                            var dashboardJson = Ozone.util.parseJson(action.response.responseText).value;

                                            // Reset title
                                            dashboardJson.name = title;
                                            dashboardJson.description = desc;

                                            // make sure the right type of json is being imported
                                            if (!Ozone.util.validateDashboardJSON(dashboardJson)) {
                                                Ozone.Msg.alert(Ozone.util.ErrorMessageString.dashboardConfig, "Invalid " + dashboardJson.layout + " configuration file.", function () {
                                                    this.focusTitleBox();
                                                }, this, null, this.dashboardContainer.floatingWindowManager);
                                            }
                                            else {
                                                delete dashboardJson.state;

                                                Ext.getCmp('mainPanel').createDashboard(
                                                        Ext.create('Ozone.data.Dashboard', Ozone.util.cloneDashboard(dashboardJson, true))
                                                );
                                                this.close();
                                            }
                                        }, this),
                                        failure: Ext.bind(function (form, action) {
                                            Ozone.Msg.alert(Ozone.util.ErrorMessageString.dashboardConfig, "Invalid configuration file.", function () {
                                                this.focusTitleBox();
                                            }, this, null, this.dashboardContainer.floatingWindowManager);
                                        }, this)
                                    });
                                }
                                else {
                                    Ozone.Msg.alert(Ozone.util.ErrorMessageString.invalidForm, Ozone.util.ErrorMessageString.invalidFormMsg, function () {
                                        this.focusTitleBox();
                                    }, this, null, this.dashboardContainer.floatingWindowManager);
                                }
                            }
                            //create new using name, and description
                            else {
                                Ext.getCmp('mainPanel').createDashboard(
                                        Ext.create('Ozone.data.Dashboard', {
                                            "name": title,
                                            "description": desc
                                        })
                                );
                                this.close();
                            }
                        }
                    }
                    else {
                        Ozone.Msg.alert(Ozone.util.ErrorMessageString.invalidForm, Ozone.util.ErrorMessageString.invalidFormMsg, function () {
                            this.focusTitleBox();
                        }, this, null, this.dashboardContainer.floatingWindowManager);
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
                handler: this.close
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
        var txtTitle = this.getComponent('titleBox');
        if (txtTitle) {
            txtTitle.setRawValue('');
        }

        var txtDescription = this.getComponent('description');
        if (txtDescription) {
            txtDescription.setRawValue('');
        }

        var txtImportFile = this.down('#importFileupload');
        if (txtImportFile) {
            txtImportFile.setRawValue('');
        }

        var cboViewSelect = this.getComponent('viewSelect');
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
            this.getComponent('titleBox').focus();
        }, 500, this);
    },

    close: function() {
        Ext.getCmp(this.winId).close();
    }
});