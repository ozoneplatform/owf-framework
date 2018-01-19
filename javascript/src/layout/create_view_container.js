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
    existingDashboardRecord: null,
    existingStackRecord: null,
    premadeLayouts: {
        premadeDesktop: {"paneType":"desktoppane","widgets":[],"xtype":"container","flex":1,"height":"100%","items":[]},
        premadeFit: {"paneType":"fitpane","widgets":[],"xtype":"container","flex":1,"height":"100%","items":[]},
        premadeTabbed: {"paneType":"tabbedpane","widgets":[],"xtype":"container","flex":1,"height":"100%","items":[]},
        premade2ColumnFit: {"xtype":"container","cls":"hbox ","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"dashboarddesignerpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":[],"paneType":"fitpane"},{"xtype":"dashboardsplitter"},{"xtype":"dashboarddesignerpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"fitpane"}],"flex":3},
        premade2RowFit: {"xtype":"container","cls":"vbox ","layout":{"type":"vbox","align":"stretch"},"items":[{"xtype":"dashboarddesignerpane","cls":"top","flex":1,"htmlText":"50%","items":[],"widgets":[],"paneType":"fitpane"},{"xtype":"dashboardsplitter"},{"xtype":"dashboarddesignerpane","cls":"bottom","flex":1,"htmlText":"50%","items":[],"paneType":"fitpane"}],"flex":3},
        premade4Fit: {"xtype":"container","cls":"hbox ","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"container","cls":"vbox left","layout":{"type":"vbox","align":"stretch"},"items":[{"xtype":"dashboarddesignerpane","cls":"top","flex":1,"htmlText":"50%","items":[],"widgets":[],"paneType":"fitpane"},{"xtype":"dashboardsplitter"},{"xtype":"dashboarddesignerpane","cls":"bottom","flex":1,"htmlText":"50%","items":[],"paneType":"fitpane"}],"flex":1},{"xtype":"dashboardsplitter"},{"xtype":"container","cls":"vbox right","layout":{"type":"vbox","align":"stretch"},"items":[{"xtype":"dashboarddesignerpane","cls":"top","flex":1,"htmlText":"50%","items":[],"widgets":[],"paneType":"fitpane"},{"xtype":"dashboardsplitter"},{"xtype":"dashboarddesignerpane","cls":"bottom","flex":1,"htmlText":"50%","items":[],"paneType":"fitpane"}],"flex":1}],"flex":3},
        premade2ColumnPortal: {"xtype":"container","cls":"hbox ","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"dashboarddesignerpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":[],"paneType":"portalpane"},{"xtype":"dashboardsplitter"},{"xtype":"dashboarddesignerpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"portalpane"}],"flex":3},
        premadeAccordionFit: {"xtype":"container","cls":"hbox ","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"dashboarddesignerpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":[],"paneType":"accordionpane"},{"xtype":"dashboardsplitter"},{"xtype":"dashboarddesignerpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"fitpane"}],"flex":3},
        premadeTabbedAccordion: {"xtype":"container","cls":"hbox ","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"dashboarddesignerpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":[],"paneType":"tabbedpane"},{"xtype":"dashboardsplitter"},{"xtype":"dashboarddesignerpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"accordionpane"}],"flex":3},
        premade2RowFitTabbed: {"xtype":"container","cls":"vbox ","layout":{"type":"vbox","align":"stretch"},"items":[{"xtype":"dashboarddesignerpane","cls":"top","flex":1,"htmlText":"50%","items":[],"widgets":[],"paneType":"fitpane"},{"xtype":"dashboardsplitter"},{"xtype":"dashboarddesignerpane","cls":"bottom","flex":1,"htmlText":"50%","items":[],"paneType":"tabbedpane"}],"flex":3},
        premadeAccordion2RowFit: {"xtype":"container","cls":"hbox ","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"dashboarddesignerpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":[],"paneType":"accordionpane"},{"xtype":"dashboardsplitter"},{"xtype":"container","cls":"vbox right","layout":{"type":"vbox","align":"stretch"},"items":[{"xtype":"dashboarddesignerpane","cls":"top","flex":1,"htmlText":"50%","items":[],"widgets":[],"paneType":"fitpane"},{"xtype":"dashboardsplitter"},{"xtype":"dashboarddesignerpane","cls":"bottom","flex":1,"htmlText":"50%","items":[],"paneType":"fitpane"}],"flex":1}],"flex":3},
        premadeTabbed2Fit: {"xtype":"container","cls":"vbox ","layout":{"type":"vbox","align":"stretch"},"items":[{"xtype":"dashboarddesignerpane","cls":"top","flex":1,"htmlText":"50%","items":[],"widgets":[],"paneType":"tabbedpane"},{"xtype":"dashboardsplitter"},{"xtype":"container","cls":"hbox bottom","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"dashboarddesignerpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":[],"paneType":"fitpane"},{"xtype":"dashboardsplitter"},{"xtype":"dashboarddesignerpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"fitpane"}],"flex":1}],"flex":3}
    },

    freeTextWarningLabel: null, // the free text warning Ext label
    parentWindow: null, // the parent Ext window

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

        for (var i = 0, len = storeDashboards.length; i < len; i++) {
            dashboard = storeDashboards[i];
            if (dashboard.get('type') !== 'marketplace') {
                dashboards.push(dashboard.data);
            }
        }

        var store = Ext.create('Ozone.data.DashboardStore', {
            data: dashboards
        });

        return store;
    },

    initComponent: function() {
        var me = this,
            defaultIconUrl = '';

        this.config = this.dashboardContainer.activeDashboard.config;
        this.views = this.dashboardContainer.dashboards;

        this.addEvents('saved', 'failed');

        this.headerLabel = {
            xtype: 'label',
            name: 'headerLabel',
            forId: 'myFieldId',
            height: 35,
            cls: 'createNewHeaderLabel',
            text: this.headerText,
            margins: '0 0 0 10'
        };
        if (Ozone.config.freeTextEntryWarningMessage) {
            this.freeTextWarningLabel = {
                xtype: 'component',
                name: 'freeTextWarningLabel',
                height: 50,
                margins: '0 0 0 10',
                renderTpl: '<div class="freeTextWarning dialogHeader">{message}</div>',
                renderData: {
                   message: Ozone.config.freeTextEntryWarningMessage
                }
            };
        }

        if (me.existingStackRecord) {
            defaultIconUrl = OWF.getContainerUrl() + Ozone.ux.DashboardMgmtString.stackIconPath;
        } else {
            defaultIconUrl = OWF.getContainerUrl() + Ozone.ux.DashboardMgmtString.dashboardIconPath;
        }

        this.iconImage = Ext.create('Ext.Img', {
            name: 'appIconImage',
            cls: 'appIconImage',
            itemId: 'appIconImage',
            src: defaultIconUrl,
            height: 54,
            width: 54,
            margin: '4 0 0 5'
        });

        var iconImage = this.iconImage;

        this.titleTextField = {
            xtype: 'textfield',
            name: 'titleTextField',
            cls: 'titleTextField createAppField',
            emptyCls: 'empty-text-field',
            itemId: 'titleTextField',
            usePlaceholderIfAvailable: false,
            emptyText: Ozone.ux.DashboardMgmtString.titleBlankText,
            allowBlank: false,
            value: '',
            maxLength: (this.existingStackRecord ? 256 : 200),
            enforceMaxLength: true,
            fieldLabel: 'Title'
        };

        this.iconURLField = {
            xtype: 'textfield',
            name: 'iconURLField',
            cls: 'iconURLField createAppField',
            itemId: 'iconURLField',
            emptyCls: 'empty-text-field',
            usePlaceholderIfAvailable: false,
            emptyText: Ozone.ux.DashboardMgmtString.iconBlankText,
            allowBlank: true,
            value: '',
            maxLength: 2083,
            enforceMaxLength: true,
            fieldLabel: 'Icon URL',
            listeners: {
                blur: function(field){
                    // Remove leading and tailing spaces
                    var val = field.getValue().replace(new RegExp(Ozone.lang.regexLeadingTailingSpaceChars), '');
                    field.setValue(val);
                    iconImage.setSrc(field.getValue());
                }
            }
        };

        this.description = {
            xtype: 'textareafield',
            name: 'description',
            cls: 'description createAppField',
            emptyCls: 'empty-text-field',
            itemId: 'description',
            usePlaceholderIfAvailable: false,
            emptyText: Ozone.ux.DashboardMgmtString.descriptionBlankText,
            value: '',
            maxLength: 4000,
            enforceMaxLength: true,
            fieldLabel: 'Description'
        };

        this.titleIconContainer = {
            xtype: 'fieldcontainer',
            name: 'titleIconContainer',
            height: 175,
            flex: 1,
            fieldDefaults: {
                labelWidth: 65,
                maxLength: 100,
                height: 32,
                labelSeparator: '',
                margin: '0 0 5 0',
                width: 362
            },
            layout: {
                type: 'vbox'
            },
            padding: '5, 5, 0, 15',
            items: [
                this.titleTextField,
                this.iconURLField,
                this.description
            ]
        };

        this.appInfoContainer = {
            xtype: 'container',
            name: 'appInfoContainer',
            layout: {
                type: 'hbox'
            },
            height: 180,
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
            itemId: 'titleBox', // OWF-2558
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

        var iconImageUrl, description;
        if (this.existingStackRecord != null) {
            // Edit stack
            this.titleTextField.value = this.existingStackRecord.name;
            iconImageUrl = this.existingStackRecord.imageUrl || "";
            description = this.existingStackRecord.description || "";
        }
        else if (this.existingDashboardRecord != null) {
            // Edit dashboard
            this.titleTextField.value = this.existingDashboardRecord.get('name');
            iconImageUrl = this.existingDashboardRecord.get('iconImageUrl') || "";
            description = this.existingDashboardRecord.get('description') || "";
        }
        this.iconURLField.value = jQuery.trim(iconImageUrl);
        this.description.value = jQuery.trim(description);

        if (this.iconURLField.value) {
            this.iconImage.setSrc(encodeURI(decodeURI(this.iconURLField.value)));
        }

        this.newViewRadio = {
            boxLabel: Ozone.layout.CreateViewWindowString.createNew,
            name: 'viewSelectRadio',
            cls:'newViewRadio',
            listeners: {
                'change': {
                    fn: function(radio, newValue) {
                        if (newValue) {
                            this.down('#existViewCb').removeCls('expandView');
                            this.down('#existViewCb').addCls('collapseView');
                            this.down('#premadeViewContainer').removeCls('expandView');
                            this.down('#premadeViewContainer').addCls('collapseView');
                            jQuery('.premadeViewRow').removeClass('expandView');
                            jQuery('.premadeViewRow').addClass('collapseView');
                            jQuery('.premadeLayoutButton').removeClass('expandView');
                            jQuery('.premadeLayoutButton').addClass('collapseView');
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
            // tabIndex: 2,
            listeners: {
                'change': {
                    fn: function(radio, newValue) {
                        if (newValue) {
                            this.down('#existViewCb').removeCls('collapseView');
                            this.down('#existViewCb').addCls('expandView');
                            this.down('#premadeViewContainer').removeCls('expandView');
                            this.down('#premadeViewContainer').addCls('collapseView');
                            jQuery('.premadeViewRow').removeClass('expandView');
                            jQuery('.premadeViewRow').addClass('collapseView');
                            jQuery('.premadeLayoutButton').removeClass('expandView');
                            jQuery('.premadeLayoutButton').addClass('collapseView');
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
                // This listener works for both since we can use the 'isSelected' param
                'change': {
                    fn: function(radio, newValue) {
                        if (newValue) {
                            this.down('#existViewCb').removeCls('expandView');
                            this.down('#existViewCb').addCls('collapseView');
                            this.down('#premadeViewContainer').removeCls('collapseView');
                            this.down('#premadeViewContainer').addCls('expandView');
                            jQuery('.premadeViewRow').removeClass('collapseView');
                            jQuery('.premadeViewRow').addClass('expandView');
                            jQuery('.premadeLayoutButton').removeClass('collapseView');
                            jQuery('.premadeLayoutButton').addClass('expandView');
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
            cls: 'expandView',
            id: 'premadeViewContainer',
            itemId: 'premadeViewContainer',
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
            cls: 'collapseView',
            id: 'existViewCb',
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

                        // Set the <button> element and the text field to not be focusable
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

                    // Override the reset function
                    cmp._reset = cmp.reset;
                    cmp.reset = function() {

                        if (!isSubmittingForm) {
                            this._reset.apply(this, arguments);
                            dashboardJson = null;
                        }
                        // This small block does exactly what the extjs reset does, except
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


        // RadioGroup and CheckboxGroup does not properly validate other form fields that are not radio/checkboxes
        // when mixed with radio/checkbox fields because it assumes if any radio/checkbox is checked it can assume the
        // entire group is valid
        this.viewSelectRadio = {
            xtype: 'fieldcontainer',
            labelWidth: 110,
            layout: 'fit',
            cls: 'createSelector',
            region: 'center',
            allowBlank: false,
            hidden: this.hideViewSelectRadio,
            padding: '0, 0, 5, 6',
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

        var childItems = [];
        // free text warning Ext label?
        if (this.freeTextWarningLabel) {
            // resize the parent Ext window to make room for
            // the 25-pixel tall free text warning Ext label
            this.parentWindow.height = this.parentWindow.height + 50;
            // insert the free text warning Ext label
            childItems.push(this.freeTextWarningLabel);
        }
        if (this.headerText) {
            childItems.push(this.headerLabel);
        }
        childItems.push(this.appInfoContainer);
        if (!this.hideViewSelectRadio) {
            childItems.push(this.viewSelectRadio);
        }

        this.items = [
            {
                xtype: 'fieldcontainer',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                padding: '0, 0, 0, 0',
                items: childItems
            }
        ];

        this.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'bottom',
                defaults: {
                    minWidth: this.minButtonWidth
                },
                items: [
                    {
                        xtype: 'tbfill'
                    },
                    {
                        xtype:'button',
                        scale: 'small',
                        cls: 'okbutton',
                        text: Ozone.layout.DialogMessages.ok,
                        itemId: 'saveButton',
                        // iconCls: 'okSaveBtnIcon',
                        // tabIndex: 4,
                        handler: function (button, event) {
                            if (this.getForm().isValid() && this.createViewContainer_FormValid) {
                                var dashboardContainer = Ext.getCmp('mainPanel'),
                                    titleTextField = this.down('#titleTextField'),
                                    descriptionBox = this.down('#description'),
                                    iconImageUrlField = this.down('#iconURLField');

                                Ozone.util.formField.removeLeadingTrailingSpaces(titleTextField);
                                // Make sure name is unique
                                dashboardContainer.saveActiveDashboardToServer();

                                var title = titleTextField.getValue();
                                var desc = descriptionBox.getValue();
                                var iconImageUrl = iconImageUrlField.getValue();

                                // Add a space to the field if it is empty or null so that it will
                                // store an empty string to the db instead of it thinking its a null value
                                if (desc == null || desc == '')
                                    desc = ' ';
                                if (iconImageUrl == null || iconImageUrl == '')
                                    iconImageUrl = ' ';

                                // Edit an existing dashboard if a record was passed in
                                if (this.existingDashboardRecord != null || this.existingStackRecord != null) {
                                    if (this.existingStackRecord != null) {
                                        this.editStack(title, iconImageUrl, desc, this.existingDashboardRecord === null);
                                    }
                                    if (this.existingDashboardRecord != null) {
                                        this.existingDashboardRecord.set('name', title);
                                        this.existingDashboardRecord.set('description', desc);
                                        this.existingDashboardRecord.set('iconImageUrl', iconImageUrl);
                                        this.dashboardContainer.editDashboard(this.existingDashboardRecord);
                                    }
                                    this.close();
                                }
                                // Else create a new one
                                else {

                                    var radioSelection = this.down('#viewSelect').getValue().viewSelectRadio;
                                    var isCreateFromExisting = radioSelection == "copiedDashboard";
                                    var isImport = radioSelection == "importedDashboard";
                                    var usePremadeLayout = radioSelection == "premadeLayout";

                                    // Create new from existing
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
                                        existingViewToDuplicate.stack = null;

                                        dashboardContainer.createDashboard(this.createDashboardModel(existingViewToDuplicate));

                                        this.close();
                                    }
                                    // Create new from import
                                    else if (isImport) {
                                        // Check if the dashboardJson has been set from file upload
                                        if (dashboardJson != null) {

                                            // Reset title
                                            dashboardJson.name = title;
                                            dashboardJson.description = desc;
                                            dashboardJson.iconImageUrl = iconImageUrl;

                                            // Make sure the right type of json is being imported
                                            if (!Ozone.util.validateDashboardJSON(dashboardJson)) {
                                                Ozone.Msg.alert(Ozone.util.ErrorMessageString.dashboardConfig, "Invalid " + dashboardJson.layout + " configuration file.", function () {
                                                    this.focusTitleBox();
                                                }, this, null, this.dashboardContainer.modalWindowManager);
                                            }
                                            else {
                                                delete dashboardJson.state;

                                                dashboardContainer.createDashboard(this.createDashboardModel(Ozone.util.cloneDashboard(dashboardJson, true)));

                                                this.close();
                                            }
                                        }
                                        else {
                                            Ozone.Msg.alert(Ozone.util.ErrorMessageString.invalidForm, Ozone.util.ErrorMessageString.invalidFormMsg, function () {
                                                this.focusTitleBox();
                                            }, this, null, this.dashboardContainer.modalWindowManager);
                                        }
                                    }
                                    else if (usePremadeLayout) {
                                        var dashboardModel = this.createDashboardModel({
                                            name: title,
                                            description: desc,
                                            iconImageUrl: iconImageUrl,
                                            layoutConfig: me.getPremadeLayout()
                                        });

                                        // DO not open dashboard designer, just save the dashboard with the pre-made layout
                                        dashboardContainer.saveDashboard(dashboardModel.data, 'create', function(json) {

                                            // Activate new dashboard
                                            dashboardContainer.activateDashboard(json.guid);

                                            $.pnotify({
                                                title: 'Add App Components',
                                                text: "Click App Components (in the toolbar) to find App Components. Drag them onto the screen to add them to this App.",
                                                type: 'success',
                                                addclass: "stack-bottomright",
                                                stack: {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25},
                                                history: false,
                                                sticker: false,
                                                icon: false,
                                                delay: 20000
                                            });
                                        });

                                        this.close();
                                    }
                                    // Create new using name, and description
                                    else {
                                        dashboardContainer.createDashboard(
                                            this.createDashboardModel({
                                                name: title,
                                                description: desc,
                                                iconImageUrl: iconImageUrl
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
                                    e.stopPropagation(); // prevent keydown from bubbling up to the toolbar
                                });
                            }
                        }
                    },
                    {
                        xtype:'button',
                        scale: 'small',
                        text: 'Cancel',
                        cls: 'cancelbutton',
                        itemId: 'cancelBtn',
                        // iconCls: 'cancelBtnIcon',
                        scope: this,
                        handler: this.cancel
                    }
                ]
            }
        ];

        // Need this to get rid of destroy errors with ExtJS
        this.on('beforedestroy', function(cmp) {
            cmp.dockedItems = null;
        });

        if (!this.hideViewSelectRadio) {
            this.on("afterrender", function(cmp) {
                // Register handler for pre-made layout buttons and select the first one by default
                this.handlePremadeLayoutButtons();
            });

            // Had to add this here instead of after render because the selected first item would
            // mess up the layout in ie7.
            this.on("afterlayout", function(cmp) {
                var layoutButtons = this.query('container#premadeViewContainer')[0].query('button');
                layoutButtons[0].fireEvent('click');
            }, this, {single: true});
        }


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
            this.down('#titleTextField').focus();
        }, 500, this);
    },

    cancel: function () {
        this.close();
    },

    close: function() {
        Ext.getCmp(this.winId).close();
    },

    handlePremadeLayoutButtons: function() {
        var me = this;
        var layoutButtons = this.query('container#premadeViewContainer')[0].query('button');

        Ext.Array.each(layoutButtons, function(button) {
            // Select the clicked button
            button.on("click", function(evt) {
                if (me.selectedButton) {
                    me.selectedButton.removeCls('selected');
                }
                this.addCls('selected');
                me.selectedLayoutName = this.itemId;
                me.selectedButton = this;
            });
        });
    },

    getPremadeLayout: function() {
        // Get the pre-defined layout for that selection
        return this.premadeLayouts[this.selectedLayoutName];
    },

    createDashboardModel: function(config) {
        if (this.stackId) {
            config.stack = {"id": this.stackId};
        }

        return Ext.create('Ozone.data.Dashboard', config);
    },

    editStack: function(name, url, description, sync) {
        var me = this;
        var stack = this.dashboardContainer.stackStore.getById(this.existingStackRecord.id);
        stack.set('name', name);
        stack.set('imageUrl', url);
        stack.set('description', description);
        if (sync) {
            me.dashboardContainer.stackStore.on("write", function(store, operation, eOpts) {
                if (operation.records && operation.records[0].get("id") === stack.get("id")) {
                    me.dashboardContainer.reloadDashboards();
                }
            }, {single: true});
            this.dashboardContainer.stackStore.sync();
        }
    }
});
