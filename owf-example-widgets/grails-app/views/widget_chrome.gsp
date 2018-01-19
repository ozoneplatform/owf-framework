<!DOCTYPE html>
<html>
<head>

    <owf:themeStylesheet themeName="a_default"/>

    <owf:vendorJs src="ext-4.0.7/ext-all-debug.js"/>

    <owf:frameworkJs src="owf-widget.js"/>


    <script type="text/javascript">
        const WIDGET_CHROME_DATA_URL = '${request.contextPath}/static/widgets/widgetChromeData.js';

        //The location is assumed to be at /<context>/js/eventing/rpc_relay.uncompressed.html if it is not set
        //OWF.relayFile = Ozone.util.contextPath() + '/js/eventing/rpc_relay.uncompressed.html';

        owfdojo.config.dojoBlankHtmlUrl = '${request.contextPath}/static/vendor/dojo-1.5.0-windowname-only/dojo/resources/blank.html';

        if (Ext.isIE) {
            Ext.BLANK_IMAGE_URL = '${request.contextPath}/static/themes/common/images/s.gif';
        }

        //hack to fix bug with FF
        //http://www.sencha.com/forum/showthread.php?132187-Issue-with-the-computed-style-on-hidden-elements-using-Firefox-and-Ext-JS-4&p=607608
        if (Ext.supports.tests != null && Ext.isGecko) {
            var tests = Ext.supports.tests;
            for (var i = 0; i < tests.length; i++) {
                if (tests[i].identity == 'RightMargin') {
                    tests[i].fn = function (doc, div) {
                        var view = doc.body.defaultView;
                        return !(view && view.getComputedStyle(div.firstChild.firstChild, null).marginRight != '0px');
                    };
                }
                else if (tests[i].identity == 'TransparentColor') {
                    tests[i].fn = function (doc, div, view) {
                        view = doc.body.defaultView;
                        return !(view && view.getComputedStyle(div.lastChild, null).backgroundColor != 'transparent');
                    }

                }
            }
        }

        function init() {
            //init quicktips
            Ext.tip.QuickTipManager.init();

            var viewport = new Ext.Viewport({
                layout: {
                    type: 'fit'
                },
                items: [
                    {
                        id: 'widgetChrome-example',
                        cls: 'widgetChrome-example',
                        xtype: 'panel',
                        flex: 1,
                        layout: 'fit',
                        frame: true,
                        padding: 5,
                        menuCount: 0,
                        title: '<font color="#FFFFFF">Example Button/Menu Configuration</font>',
                        items: [
                            {
                                xtype: 'textarea',
                                readOnly: true,
                                id: 'chromeCfg',
                                fieldLabel: '<b>For example purposes only. Configuration will NOT dynamically update.</b>',
                                labelAlign: 'top',
                                labelSeparator: ''
                            }
                        ],
                        listeners: {
                            render: {
                                fn: function (cmp) {

                                    //get data
                                    Ext.Ajax.request({
                                        url: WIDGET_CHROME_DATA_URL,
                                        success: function (response) {
                                            var text = response.responseText;
                                            // trim parens
                                            var displayText = text.substring(1, text.length - 2);
                                            // process server response here

                                            var textArea = Ext.getCmp('chromeCfg');
                                            textArea.setValue(displayText);

                                            //don't ever really do this eval is bad practice
                                            var data = eval(text);
                                            var cmp = Ext.getCmp('widgetChrome-example');
                                            OWF.Chrome.isModified({
                                                callback: Ext.bind(function (msg) {
                                                    //msg will always be a json string
                                                    var res = Ozone.util.parseJson(msg);
                                                    if (res.success) {

                                                        //if the chrome was never modified insert buttons and menu
                                                        if (!res.modified) {
                                                            OWF.Chrome.insertHeaderButtons({
                                                                items: data.buttons
                                                            });
                                                            OWF.Chrome.addHeaderMenus({
                                                                items: data.menus
                                                            });
                                                        }
                                                        //if we already modified the chrome, lets remove the old ones and add new ones
                                                        else {
                                                            OWF.Chrome.removeHeaderButtons({
                                                                items: data.buttons,
                                                                callback: function () {
                                                                    OWF.Chrome.insertHeaderButtons({
                                                                        items: data.buttons
                                                                    });
                                                                }
                                                            });
                                                            OWF.Chrome.listHeaderMenus({
                                                                callback: Ext.bind(function (msg) {
                                                                    var result = Ozone.util.parseJson(msg);
                                                                    var itemsToRemove = [];
                                                                    for (var i = 0; i < result.items.length; i++) {
                                                                        itemsToRemove.push({
                                                                            itemId: result.items[i]
                                                                        });
                                                                    }
                                                                    OWF.Chrome.removeHeaderMenus({
                                                                        items: itemsToRemove,
                                                                        callback: Ext.bind(function (msg) {
                                                                            OWF.Chrome.addHeaderMenus({
                                                                                items: data.menus
                                                                            });
                                                                        }, cmp)
                                                                    });
                                                                }, cmp)
                                                            });
                                                        }
                                                    }
                                                }, cmp)
                                            });
                                        }
                                    });
                                }
                            }
                        },
                        buttons: [
                            {
                                text: 'Change Alert Icon',
                                enableToggle: true,
                                pressed: true,
                                pressedCls: "",
                                toggleHandler: function (btn, state) {
                                    var cmp = Ext.getCmp('widgetChrome-example');
                                    var icon = '${request.contextPath}/static/themes/common/images/shared/warning.gif';
                                    if (state) {
                                        icon = '${request.contextPath}/static/themes/common/images/skin/exclamation.png';
                                    }
                                    OWF.Chrome.updateHeaderButtons({
                                        items: [
                                            {
                                                xtype: 'button',
                                                //path to an image to use. this path should either be fully qualified or relative to the /owf context
                                                icon: icon,
                                                text: 'Alert',
                                                itemId: 'alert',
                                                tooltip: {
                                                    text: 'Alert!'
                                                },
                                                handler: function (sender, data) {
                                                    Ext.Msg.alert('Alert', 'Alert Button Pressed');
                                                }
                                            }
                                        ]
                                    });

                                }
                            },
                            {
                                text: 'Reload Widget',
                                handler: function () {
                                    window.location.reload();
                                }
                            },
                            {
                                text: 'Load Menu Configuration',
                                handler: function () {
                                    var cmp = Ext.getCmp('widgetChrome-example');
                                    var msgBox = Ext.Msg.prompt('Load Widget Chrome Data', 'Filename: ', function (btn, text) {
                                        if (btn == 'ok') {
                                            //get data
                                            Ext.Ajax.request({
                                                url: text,
                                                success: function (response) {
                                                    var text = response.responseText;
                                                    // trim parens
                                                    var displayText = text.substring(1, text.length - 2);
                                                    // process server response here

                                                    var textArea = Ext.getCmp('chromeCfg');
                                                    textArea.setValue(displayText);

                                                    //don't ever really do this eval is bad practice
                                                    var data = eval(text);
                                                    OWF.Chrome.isChromeModified({
                                                        callback: Ext.bind(function (msg) {
                                                            //msg will always be a json string
                                                            var res = Ozone.util.parseJson(msg);
                                                            if (res.success) {

                                                                //if the chrome was never modified insert buttons and menu
                                                                if (!res.modified) {
                                                                    OWF.Chrome.insertHeaderButtons({
                                                                        items: data.buttons
                                                                    });
                                                                    OWF.Chrome.addHeaderMenus({
                                                                        items: data.menus
                                                                    });
                                                                }
                                                                //if we already modified the chrome, lets remove the old ones and add new ones
                                                                else {
                                                                    OWF.Chrome.removeHeaderButtons({
                                                                        items: data.buttons,
                                                                        callback: function () {
                                                                            OWF.Chrome.insertHeaderButtons({
                                                                                items: data.buttons
                                                                            });
                                                                        }
                                                                    });
                                                                    OWF.Chrome.listHeaderMenus({
                                                                        callback: Ext.bind(function (msg) {
                                                                            var result = Ozone.util.parseJson(msg);
                                                                            var itemsToRemove = [];
                                                                            for (var i = 0; i < result.items.length; i++) {
                                                                                itemsToRemove.push({
                                                                                    itemId: result.items[i]
                                                                                });
                                                                            }
                                                                            OWF.Chrome.removeHeaderMenus({
                                                                                items: itemsToRemove,
                                                                                callback: Ext.bind(function (msg) {
                                                                                    OWF.Chrome.addHeaderMenus({
                                                                                        items: data.menus
                                                                                    });
                                                                                }, cmp)
                                                                            });
                                                                        }, cmp)
                                                                    });
                                                                }
                                                            }
                                                        }, cmp)
                                                    });
                                                }
                                            });
                                        }
                                    });
                                    //Fix for IE7 where the textfield extends beyond the messagebox
                                    msgBox.textField.maxWidth = msgBox.width - 30;
                                    msgBox.textField.doComponentLayout();
                                }
                            },
                            {
                                text: 'Get Title',
                                handler: function () {
                                    OWF.Chrome.getTitle({
                                        callback: function (msg) {
                                            //msg will always be a json string
                                            var res = Ozone.util.parseJson(msg);
                                            if (res.success) {
                                                var alert = Ext.Msg.show({
                                                    title: 'Get Title',
                                                    msg: res.title,
                                                    buttons: Ext.Msg.OK,
                                                    closable: false,
                                                    modal: true
                                                });
                                            }
                                        }
                                    });
                                }
                            },
                            {
                                text: 'Set Title',
                                handler: function () {
                                    var msgBox = Ext.Msg.prompt('Set Title', 'Title: ', function (btn, text) {
                                        if (btn == 'ok') {
                                            OWF.Chrome.setTitle({
                                                title: text,
                                                callback: function (msg) {
                                                    //msg will always be a json string
//                                                   var res = Ozone.util.parseJson(msg);
//                                                   if (res.success) {
//                                                   }
                                                }
                                            });

                                        }
                                    });
                                    //Fix for IE7 where the textfield extends beyond the messagebox
                                    msgBox.textField.maxWidth = msgBox.width - 30;
                                    msgBox.textField.doComponentLayout();

                                }
                            }
                        ]
                    }
                ]
            });
        }

        Ext.onReady(function () {
            OWF.ready(init);
        });
    </script>
</head>

<body>
</body>
</html>
