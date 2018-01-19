Ext.define('Ozone.components.window.StoreWizard', {
    extend: 'Ozone.components.window.ModalWindow',
    alias: 'widget.storewizard',

    modal: true,
    preventHeader: true,
    modalAutoClose: true,
    shadow: false,
    layout: 'auto',
    ui: 'system-window',
    store: null,
    closable: true,
    title: '',
    cls: 'system-window',
    typeStore: null,
    groupStore: null,

    resizable: false,
    draggable: false,

    width: 780,
    height: 570,

    listeners: {
        'close': {
            fn: function() {
                this.destroy()
            }
        },
        'afterRender': {
            fn: function() {
                this.bindHandlers();
            }
        }
    },

    record: null,

    initComponent: function() {
    	var me = this
        this.loadMask = Ext.create('Ozone.components.mask.LoadMask', Ext.getBody(), {
            zIndexManager: Ext.WindowManager
        });

    	this.widgetStore = Ext.StoreManager.lookup('widgetStore');

        this.adminStore = Ext.create('Ozone.data.stores.AdminWidgetStore', {
            pageSize: -1,
            callback: this.saveCallback
        });

        this.typeStore = Ext.create('Ozone.data.WidgetTypeStore');
        this.groupStore = Ext.create('Ozone.data.GroupStore', {});

        this.typeStore.load();
        this.groupStore.load();

        this.html = this.getContent();

        $('.iconUrl').change(function() {
            var date = new Date();
            $('.loadedImg').attr('src', $('.iconUrl').val() + "?" + date.getTime()).slideToggle().slideToggle();
        });

        if (this.editing && this.existingStoreId) {
            this.adminStore.load({
                scope: this,
                callback: function(records, operation, success) {
                    this.record = this.adminStore.getAt(this.adminStore.findExact('widgetGuid', this.existingStoreId));
                    this.setupForEditing();
                }
            });
        }

        this.callParent(arguments);
    },

    getContent: function() {
        var htmlData = "<h1 class='wizardTitle'>" + (this.editing ? "Edit Store" : "Connecting to a Store") + "<div class='closeButton'></div></h1>" +
            "<div class='wizardButtons'>" +
            "<ul class='wizardProcessList'>" +
            "<li class='step1 active'><div><span class='stepNumber'>1</span> Enter Store URL</div></li>" +
            "<li class='step2'><div><span class='stepNumber'>2</span> Review</div></li>" +
            "</ul>" +
            "<div class='progressBar' >" +
            "<div class='progressBarProgress' style='display:none;'>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<div class='wizardContentBox'>" +
            "<div class='enterURLStep'>" +
            "<div class='contentTitle'>Enter Store URL</div>" +
            "<div class='contentText'>Enter the location of the store. For example, https://store.gov</div>" +
            "<div class='contentText userInput'>Store URL <input class='storeUrl'></input></div>" +
            "<div class='controlButtons'>" +
            "<div class='next button'>Next</div>" +
            "<div class='cancel button'>Cancel</div>" +
            "</div>" +
            "</div>" +
            "<div class='editStep' style='display:none;'>" +
            "<div class='contentTitle'>Review</div>" +
            "<div class='contentText'>All users will see this Store icon and name. Review them; if correct, click Save.</div>" +
            "<div class='contentText userInput iconText'>Icon <input class='iconUrl'></input></div>" +
            "<div class='contentText userInput'>Store Name <input class='storeName' maxlength='256'></input></div>" +
            "<div class='controlButtons'>" +
            "<div class='back button'>Back</div>" +
            "<div class='save button'>Save</div>" +
            "<div class='cancel button'>Cancel</div>" +
            "</div>" +
            "</div>" +
            "</div>";


        return htmlData;
    },

    setupForEditing: function() {
        $('.enterURLStep').hide();

        $('.step1').removeClass('active');
        $('.step1').addClass('complete');
        $('.editStep').slideToggle();
        $('.step2').addClass('active');

        $('.iconUrl').val(this.record.get('image'));
        $('.storeName').val(Ext.htmlDecode(this.record.get('name')));

        $('.back.button').hide();

        //add the loaded icon as an img
        if ($('.loadedImg').length === 0) {
            $('.loadedImg').add("<img src='" + this.record.get('image') + "' class='loadedImg'/>").appendTo($('.iconText'))
        }

        this.rollProgressForward();
    },

    rollProgressForward: function() {
        var progress = $('.progressBarProgress');
        progress.animate({
            width: 'toggle'
        });
    },

    rollProgressBack: function() {
        var progress = $('.progressBarProgress');
        progress.animate({
            width: 'toggle'
        });
    },

    descriptorSuccess: function() {
        $('.enterURLStep').hide();

        $('.iconUrl').val(this.record.get('imageUrlSmall'));
        $('.storeName').val(Ext.htmlDecode(this.record.get('displayName')));

        //add the loaded icon as an img
        if ($('.loadedImg').length === 0) {
            $('.loadedImg').add("<img src='" + this.record.get('imageUrlSmall') + "' class='loadedImg'/>").appendTo($('.iconText'))
        }

        $('.iconUrl').change(function() {
            var date = new Date();
            $('.loadedImg').attr('src', $('.iconUrl').val() + "?" + date.getTime()).slideToggle().slideToggle();
        });

        $('.step1').removeClass('active');
        $('.step1').addClass('complete');
        $('.editStep').slideToggle();
        $('.step2').addClass('active');
        this.rollProgressForward();
    },

    nextButtonHandler: function() {
        var me = this,
            storeUrl = Ext.String.trim($('.storeUrl').val());

        storeUrl = this.stripTrailingSlash(storeUrl);
        var storeDescriptor = Ext.String.trim(storeUrl + '/public/storeDescriptor');

        if (storeUrl == null || storeUrl == '' || !storeUrl.replace(/\s/g, '').length) {
            alert('Please enter a URL');
        } else {
            me.loadMask.show();
            Ozone.util.Transport.getDescriptor({
                url: storeDescriptor,
                onSuccess: function(data) {
                    data.imageUrlMedium = data.imageUrlMedium || data.imageUrlLarge;
                    me.record = new Ozone.data.WidgetDefinition(data);
                    me.loadMask.hide();

                    // Set needed vals not in descriptor
                    me.record.set('title', Ext.String.trim(data.displayName));
                    me.record.set('url', storeUrl);
                    me.record.set('descriptorUrl', storeDescriptor);
                    me.record.set('guid', guid.util.guid());
                    me.record.set('widgetGuid', me.record.get('guid'));
                    me.record.set('widgetVersion', '1.0');

                    me.descriptorSuccess()
                },
                onFailure: function() {
                    me.loadMask.hide();
                    alert("There was an error with the Store URL")
                }
            });
        }
    },

    backButtonHandler: function() {
        var me = this;
        $('.editStep').hide();

        $('.step2').removeClass('active');
        $('.enterURLStep').slideToggle();
        $('.step1').addClass('active');
        me.rollProgressBack();
    },

    isStoreDescriptorAttributeInvalid: function(attribute) {
        return attribute == null || attribute === '' || !attribute.replace(/\s/g, '').length;
    },

    saveButtonHandler: function() {
        var me = this;
        if (me.record) {

            var iconUrl     = $('.iconUrl').val();
            var displayName = $('.storeName').val();

            if (me.isStoreDescriptorAttributeInvalid(iconUrl)) {
                alert("Please fix the icon URL in the store's descriptor file.");
                return;
            }

            if (me.isStoreDescriptorAttributeInvalid(displayName)) {
                alert("Please fix the display name in the store's descriptor file.");
                return;
            }

            me.record.set('imageUrlSmall', $('.iconUrl').val());
            me.record.set('imageUrlMedium', me.record.get('imageUrlSmall'));
            me.record.set('displayName', Ext.htmlEncode($('.storeName').val()));
            me.record.set('name', me.record.get('displayName'));
            me.record.set('title', me.record.get('displayName'));
            me.record.set('image', me.record.get('imageUrlMedium'));
            me.record.set('headerIcon', me.record.get('imageUrlSmall'));
            me.record.phantom = true;

            var userGroup = this.groupStore.findRecord('name', 'OWF Users');
            var typeId = this.typeStore.findRecord('name', 'marketplace').internalId;

            var types = [{
                id: typeId,
                name: "marketplace"
            }];

            me.record.beginEdit();
            me.record.set('widgetTypes', types);
            me.record.endEdit();

            var guid = me.record.get('widgetGuid');

            me.adminStore.add(me.record);
            me.adminStore.on('write', function() {
                //ajax call to the server to save group
                Ext.Ajax.request({
                    url: Ozone.util.contextPath() + '/widget',
                    method: 'POST',
                    params: {
                        data: Ext.JSON.encode([userGroup.data]),
                        tab: 'groups',
                        update_action: 'add',
                        widget_id: guid
                    },
                    callback: function(success, response) {
                        if (success) {
                            if(me.widgetStore)
                            	me.widgetStore.load();

                            me.close();
                        }
                    }
                });
            });

            me.adminStore.sync();

        } else {
            alert("Error: The new Store could not be saved.");
        }
    },

    bindHandlers: function() {
        var me = this;

        $('.closeButton').on('click', function() {
            me.close()
        });

        $('.cancel').on('click', function() {
            me.close()
        });
        $('.next').on('click', $.proxy(me.nextButtonHandler, me));
        $('.back').on('click', $.proxy(me.backButtonHandler, me));
        $('.save').on('click', $.proxy(me.saveButtonHandler, me));
    },

    stripTrailingSlash: function (str) {
        if(str.substr(str.length - 1) == '/') {
            return str.substr(0, str.length - 1);
        }
        return str;
    }
})
