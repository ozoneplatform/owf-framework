<!DOCTYPE html>
<html>
<head>

    <g:if test="${params.themeName != null && params.themeName != ''}">
        <owf:themeStylesheet themeName="${params.themeName}"/>
    </g:if>
    <g:else>
        <owf:vendorJs src="ext-4.0.7/resources/css/ext-all.css"/>
        <owf:stylesheet src="static/css/dragAndDrop.css"/>
    </g:else>

    <owf:vendorJs src="ext-4.0.7/ext-all-debug.js"/>

    <owf:frameworkJs src="owf-widget.js"/>

    <script type="text/javascript">
        //The location is assumed to be at /<context>/js/eventing/rpc_relay.uncompressed.html if it is not set
        //OWF.relayFile = Ozone.util.contextPath() + '/js/eventing/rpc_relay.uncompressed.html';

        owfdojo.config.dojoBlankHtmlUrl = '${request.contextPath}/static/vendor/dojo-1.5.0-windowname-only/dojo/resources/blank.html';

        if (Ext.isIE) {
            Ext.BLANK_IMAGE_URL = '${request.contextPath}/static/themes/common/images/s.gif';
        }

        function init() {
            //init quicktips
            Ext.QuickTips.init();

            new Ext.Viewport({
                layout: 'fit',
                items: [
                    {
                        xtype: 'grid',
                        store: new Ext.data.JsonStore({
                            storeId: 'widgetLoadTime',
                            sortInfo: {
                                field: 'date',
                                direction: 'ASC'
                            },
                            fields: [
                                {name: 'date', type: 'date'},
                                'id',
                                'widgetGuid',
                                'name',
                                'msg',
                                'loadTime'
                            ]
                        }),
                        columns: [
                            {
                                header: 'Date', dataIndex: 'date', sortable: true,
                                xtype: 'datecolumn', format: 'Y-m-d H:i:s'
                            },
                            {header: 'ID', dataIndex: 'id', sortable: true, hidden: true},
                            {header: 'Widget Definition GUID', dataIndex: 'widgetGuid', sortable: true, hidden: true},
                            {header: 'Name', dataIndex: 'name', sortable: true},
                            {header: 'Message', dataIndex: 'msg', sortable: true},
                            {
                                header: 'Load Time', dataIndex: 'loadTime', sortable: true,
                                renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                                    return value + ' (ms)';
                                }
                            }
                        ],
                        viewConfig: {
                            forceFit: true
                        },
                        listeners: {
                            render: {
                                fn: function (cmp) {
                                    OWF.Eventing.subscribe('Ozone.eventing.widget.public', function (sender, msg, channel) {
                                        var store = Ext.StoreMgr.lookup('widgetLoadTime');
                                        var data = Ozone.util.parseJson(msg);
                                        var newRec = Ext.apply({date: new Date()}, data);
                                        store.add(newRec);

                                        //resort
                                        store.sort(store.sortInfo.field, store.sortInfo.direction);
                                    });
                                }
                            }
                        },
                        bbar: [
                            {
                                text: 'Clear',
                                handler: function () {
                                    var store = Ext.StoreMgr.lookup('widgetLoadTime');
                                    store.removeAll();
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
