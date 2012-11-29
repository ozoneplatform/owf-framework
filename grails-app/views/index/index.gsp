<!DOCTYPE html>
<%@ page contentType="text/html; UTF-8" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title id='title'>Ozone Widget Framework</title>
        
        <link rel="shortcut icon" href="images/favicon.ico" />
        <script language="javascript">
            //console.time('page');
        </script>
        <!-- ** CSS ** -->
        <!-- base library -->
        <p:css id='theme' name='${owfCss.defaultCssPath()}' absolute='true'/>

        <!-- initialize ozone configuration from server -->
        <owfImport:jsOwf path="config" resource="config" />

        <!-- include our server bundle, in dev mode a full list of js includes will appear -->
        <p:javascript src='owf-server'/>
        <!-- include our server bundle, in dev mode a full list of js includes will appear -->

        <script language="javascript">
            owfdojo.config.dojoBlankHtmlUrl =  './js-lib/dojo-1.5.0-windowname-only/dojo/resources/blank.html';
        </script>

        <!-- bring in custom header/footer resources -->
        <g:each in="${grailsApplication.config.owf.customHeaderFooter.jsImports}" var="jsImport">
            <script type="text/javascript" src="${jsImport}"></script>
        </g:each>
        <g:each in="${grailsApplication.config.owf.customHeaderFooter.cssImports}" var="cssImport">
            <link rel="stylesheet" href="${cssImport}" type="text/css" />
        </g:each>

        <!-- language switching -->
        <lang:preference lang="${params.lang}" />

        <!-- set Marketplace Version -->
        <marketplace:preference />

        <script type="text/javascript">

            // OWF-6032
            window.opener = null;

            function initLayoutComponents(customHeaderFooter, floatingWidgetManager, 
                    bannerManager, dashboardDesignerManager, modalWindowManager, tooltipManager) {
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
                    data: ${dashboards}
                });

                // user's widgets
                var widgetStore = Ext.create('Ozone.data.WidgetStore', {
                    storeId: 'widgetStore'
                });

                // mappings are not supported in Models,
                // they only supported through Ext Proxy Reader
                widgetStore.loadRecords(widgetStore.proxy.reader.read(${widgets}).records);

                layoutComponents.push({
                    id: 'mainPanel',
                    itemId: 'mainPanel',
                    xtype: 'dashboardContainer',
                    autoHeight:true,
                    viewportId: 'viewport',
                    anchor: '100% ' + heightOffset,
                    dashboardStore: dashboardStore,
                    widgetStore: widgetStore,
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
        </script>
        <script type="text/javascript">

			// var logger = Ozone.log.getDefaultLogger();
			// var appender = logger.getEffectiveAppenders()[0];
			// appender.setThreshold(log4javascript.Level.INFO);
			// Ozone.log.setEnabled(true);

            var handleBodyOnScrollEvent = function(){
                document.body.scrollTop = 0;
                document.body.style.overflow = "hidden";
                document.body.scroll = "no";
                scroll(0,0);
                return;
            };

            if (Ext.isIE) {
                Ext.BLANK_IMAGE_URL = './themes/common/images/s.gif';
            }
            Ext.useShims = OWF.config.useShims;
            Ext.onReady(function() {
                
                Ozone.version = Ozone.version || {};
                Ozone.version.mpversion = "${(grailsApplication.config.owf.mpVersion)}" || "2.5";

                //function to check if the login cookie
                //exists and if not, force a refresh
                //in order to force a re-login
                var testLoginCookie = function() {
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
                };

                //skip loading the rest of the page if the
                //login cookie is not found
                if (!testLoginCookie()) return;

                handleBodyOnScrollEvent();

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
                    dismissDelay: 60000,
                    showDelay: 2000,
                    zIndexManager: tooltipManager
                });

                Ext.History.init();

                // Use new shim for dd
                Ext.dd.DragDropMgr.useShim = true;

                var layoutComponents = initLayoutComponents(Ozone.config.customHeaderFooter, 
                        floatingWidgetManager, bannerManager, dashboardDesignerManager,
                        modalWindowManager, tooltipManager);
                
                var continueProcessingPage = function() {
                    
                    console.time('initload');

                    OWF.Mask = new Ozone.ux.AutoHideLoadMask(Ext.getBody(), {
                        msg:"Please wait...",
                        id: 'owf-body-mask'
                    });
                    OWF.Mask.show();

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
              };

                //show access alert window if it is configured to be on and only once per session
                var sessionShowAccessAlert = '${session.getAttribute('showAccessAlert')}';
                if (Ozone.config.showAccessAlert && (Ozone.config.showAccessAlert.toLowerCase() == "true" && (sessionShowAccessAlert == 'true' || sessionShowAccessAlert == ''))) {
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
                                sync: true,
                                handleAs: "text",
                                content: {'key': 'showAccessAlert', 'value': 'false'},
                                load: function(response) {
                                    continueProcessingPage();
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
                    });
                    //Ensure the shadow follows the window in IE
                    alertWin.on('resize', function() {
                        alertWin.syncShadow();
                    });
                }
                else {
                  continueProcessingPage();
                }
            });
        </script>
    </head>

     <body id="owf-body" onscroll="handleBodyOnScrollEvent();">
        <!-- Fields required for history management -->
        <form id="history-form" class="x-hidden">
            <input type="hidden" id="x-history-field" />
            <iframe id="x-history-frame" tabindex="-1"></iframe>
        </form>
    </body>
</html>
