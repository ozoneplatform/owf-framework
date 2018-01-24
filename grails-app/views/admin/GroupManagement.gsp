<%@ page contentType="text/html; UTF-8" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title id='title'>OWF Group Management</title>

        <g:if test="${params.themeName != null && params.themeName != ''} ">
            <owf:themeStylesheet theme="${params.themeName}"/>
        </g:if>
        <g:else>
            <owf:themeStylesheet/>
        </g:else>

        <owf:configScript/>

        <owf:javascript src="owf-admin-widget.js"/>
        <owf:javascript src="owf-group-management-widget.js"/>

        <script language="javascript">
            if (Ext.isIE) { Ext.BLANK_IMAGE_URL = '${request.contextPath}/static/themes/common/images/s.gif'; }

            owfdojo.config.dojoBlankHtmlUrl = '${request.contextPath}/static/vendor/dojo-1.5.0-windowname-only/dojo/resources/blank.html';

            Ext.onReady(function() {
                OWF.ready(function(){
                    var viewport = Ext.create('Ext.container.Viewport', {
                        layout: 'fit',
                        isLayedOut: false,
                        listeners: {
                            afterlayout: {
                                fn: function(cmp) { cmp.isLayedOut = true; },
                                single: true
                            }
                        },
                        items: [ { xtype: 'groupmanagement' } ]
                    });
                });
            });
        </script>
    </head>

    <body>
    </body>
</html>
