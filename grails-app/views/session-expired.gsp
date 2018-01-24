<!DOCTYPE html>
<%@ page contentType="text/html; UTF-8" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Session Expired</title>

        <link rel="shortcut icon" href="images/favicon.ico" />

        <p:css id='theme' name='${owfCss.defaultCssPath()}' absolute='true'/>

        <style type="text/css">
            body {
                background-color: #e6e7e8;
            }

            .x-mask {
                background: transparent;
            }
        </style>

        <!-- Although this file includes lots of things this page doesnt need,
             it will presumably already be in cache and is therefore still a good
             choice -->
        <p:javascript src='owf-server'/>
    </head>
    <body>
        <script type="text/javascript">
            Ext.onReady(function() {
                Ext.Msg.show({
                    buttons: Ext.Msg.OK,
                    msg: "Your session has expired. Click OK to reload to page.",
                    fn: function() {
                        //reload entire OWF in case we are in a widget
                        window.top.location.href = '.';
                    }
                });
            });
        </script>
    </body>
</html>
