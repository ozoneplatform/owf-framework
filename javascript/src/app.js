// OWF-6032
window.opener = null;

;(function () {
    // apply background image from app configuration
    if(Ozone.config.backgroundURL) {
        var css =   '#owf-body { ' +
                        'background-image: url("' + Ozone.config.backgroundURL + '") !important; ' +
                    '}';

        Ext.util.CSS.createStyleSheet(css);
    }

    // setup Ext
    if (Ext.isIE) {
        Ext.BLANK_IMAGE_URL = './themes/common/images/s.gif';
    }
    Ext.useShims = OWF.config.useShims;

    // prevent browser caching
    $.ajaxSetup({
        cache: false
    });

    function initLayoutComponents (dashboards, widgets, customHeaderFooter, floatingWidgetManager, bannerManager, dashboardDesignerManager, modalWindowManager, tooltipManager) {
        var layoutComponents = [];

        // create panel for custom header
        var showHeader = (customHeaderFooter.header != "" && customHeaderFooter.headerHeight > 0);
        var customHeader = {
            id: 'customHeaderComponent',
            xtype: 'component',
            border: false,
            frame: false,
            hidden: !showHeader,
            height: customHeaderFooter.headerHeight
        };

        // create panel for custom footer
        var showFooter = (customHeaderFooter.footer != "" && customHeaderFooter.footerHeight > 0);
        var customFooter = {
            id: 'customFooterComponent',
            xtype: 'component',
            border: false,
            frame: false,
            hidden: !showFooter,
            height: customHeaderFooter.footerHeight
        };


        // calculate height offset for main component
        var heightOffset = 0;

        if (showHeader) {
            heightOffset = heightOffset - customHeaderFooter.headerHeight;
        }
        if (showFooter) {
            heightOffset = heightOffset - customHeaderFooter.footerHeight;
        }

        // Build the layout components array.  Add functional panels as necessary.
        if (showHeader) {
            customHeader.loader = {
                    url: customHeaderFooter.header,
                    autoLoad: true,
                    callback: Ozone.config.customHeaderFooter.onHeaderReady
            }
            layoutComponents.push(customHeader);
        }

         // user's dashboards instances
        var dashboardStore = Ext.create('Ozone.data.DashboardStore', {
            storeId: 'dashboardStore',
            data: dashboards
        });

        // user's widgets
        var widgetStore = Ext.create('Ozone.data.WidgetStore', {
            storeId: 'widgetStore'
        });

        OWF.Collections = {};
        OWF.Collections.AppComponents = new Ozone.data.collections.Widgets({
            results: widgets.length,
            data: widgets
        }, {
            parse: true
        });

        // mappings are not supported in Models,
        // they only supported through Ext Proxy Reader
        widgetStore.loadRecords(widgetStore.proxy.reader.read(widgets).records);

        layoutComponents.push({
            id: 'mainPanel',
            itemId: 'mainPanel',
            xtype: 'dashboardContainer',
            autoHeight:true,
            viewportId: 'viewport',
            anchor: '100% ' + heightOffset,
            dashboardStore: dashboardStore,
            widgetStore: widgetStore,
            appComponentsViewState: Ozone.initialData.appComponentsViewState,
            floatingWidgetManager: floatingWidgetManager,
            bannerManager: bannerManager,
            dashboardDesignerManager: dashboardDesignerManager,
            modalWindowManager: modalWindowManager,
            tooltipManager: tooltipManager
        });

        if (showFooter) {
            customFooter.loader = {
                url: customHeaderFooter.footer,
                autoLoad: true,
                callback: Ozone.config.customHeaderFooter.onFooterReady
            };
            layoutComponents.push(customFooter);
        }
        return layoutComponents;
    }

    function handleBodyOnScrollEvent () {
        document.body.scrollTop = 0;
        document.body.style.overflow = "hidden";
        document.body.scroll = "no";
        scroll(0,0);
        return;
    }

    //function to check if the login cookie
    //exists and if not, force a refresh
    //in order to force a re-login
    function testLoginCookie () {
        var loggedIn = Ozone.config.loginCookieName == null || Ext.util.Cookies.get(Ozone.config.loginCookieName) != null;
        if (!loggedIn) {
            Ext.Msg.show({
                buttons: Ext.Msg.OK,
                msg: "You have been logged out.  Press OK to refresh the page and log back in.",
                fn: function() {
                    location.reload(true);
                }
            });
        }

        return loggedIn;
    }

    var initLayoutPromise;
    function initLayout () {
        if(initLayoutPromise) {
            return initLayoutPromise;
        }
        //Create the various z-index layers to be on top of the
        //base ZIndexManager, last created will be on top of others
        var floatingWidgetManager = new Ext.ZIndexManager(),
            bannerManager = new Ext.ZIndexManager(),
            dashboardDesignerManager = new Ext.ZIndexManager(),
            modalWindowManager = new Ext.ZIndexManager(),
            tooltipManager = new Ext.ZIndexManager();

        //init quicktips
        Ext.tip.QuickTipManager.init(true,{
            xtype: 'ozonequicktip',
            dismissDelay: 30000,
            hideDelay: 500,
            showDelay: 750,
            zIndexManager: tooltipManager
        });

        initLayoutPromise = $.ajax('person/me').then(function (person) {
            return initLayoutComponents(
                person.dashboards,
                person.widgets,
                Ozone.config.customHeaderFooter,
                floatingWidgetManager, bannerManager, dashboardDesignerManager, modalWindowManager, tooltipManager
            );
        });

        return initLayoutPromise;
    }

    function loadContainer () {
        OWF.Mask = new Ozone.ux.AutoHideLoadMask(Ext.getBody(), {
            msg:"Please wait...",
            id: 'owf-body-mask'
        });
        OWF.Mask.show();

        initLayout().
            then(function (layoutComponents) {
                console.time('initload');

                Ext.create('Ext.container.Viewport', {
                    id: 'viewport',
                    cls: 'viewport',
                    layout: {
                        type: 'fit'
                    },
                    items: [
                        {
                            xtype: 'container',
                            style: 'overflow:hidden',
                            layout: 'anchor',
                            items: layoutComponents
                        }
                    ]
                });

                setInterval(testLoginCookie, 5000);
            });
    }

    Ext.onReady(function () {

        Ozone.version = Ozone.version || {};
        Ozone.version.mpversion = Ozone.config.mpVersion || "2.5";

        //skip loading the rest of the page if the
        //login cookie is not found
        if (!testLoginCookie()) return;

        handleBodyOnScrollEvent();

        Ext.History.init();

        // Use new shim for dd
        Ext.dd.DragDropMgr.useShim = true;

        if (Ozone.config.showAccessAlert && Ozone.config.showAccessAlert.toLowerCase() == "true") {
            var accessAlertMsg = Ozone.config.accessAlertMsg;
            var okButton = Ext.widget('button', {
                id: 'accessAlertOKButton',
                text: Ozone.layout.MessageBoxButtonText.ok,
                scale: 'small',
                minWidth: 50,
                iconCls: 'accessAlertIcon',
                handler: function() {
                    Ext.getCmp("accessAlertWin").close();
                    owfdojo.xhrPost({
                        url: Ozone.util.contextPath() + "/servlet/SessionServlet",
                        preventCache: true,
                        handleAs: "text",
                        content: {'key': 'showAccessAlert', 'value': 'false'},
                        load: function(response) {
                            // added a timeout for better error handling
                            // without this, any errors from loadContainer method call are treated as Session errors
                            setTimeout(loadContainer, 0);
                        },
                        error: function(xhr, textStatus) {
                            Ext.Msg.alert("Error", Ozone.util.ErrorMessageString.settingSessionDataMsg);
                        }
                    });
                }
            });
            var alertWin = Ext.create('Ext.Window', {
                id: "accessAlertWin",
                title: "Warning",
                html: "<p class='accessAlertMsgBody'>" + accessAlertMsg + "</p>",
                cls: "accessAlert",
                modal: false,
                closable: false,
                draggable: false,
                height: 200,
                width: 500,
                autoScroll: true,
                bbar: [{xtype: 'tbfill'},okButton,{xtype: 'tbfill'}]
            });
            alertWin.show(null, function() {
                okButton.focus(false, true);
                window.document.getElementById('accessAlertOKButton').focus();
                initLayout();
            });
            //Ensure the shadow follows the window in IE
            alertWin.on('resize', function() {
                alertWin.syncShadow();
            });
        }
        else {
            loadContainer();
        }
    });
})();
