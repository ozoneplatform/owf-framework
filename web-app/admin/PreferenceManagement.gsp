<%@ page contentType="text/html; UTF-8" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title id='title'>OWF Preference Management</title>
		
		<!-- ** CSS ** -->
        <!-- base library -->
        <owfImport:cssLibrary lib="ext" version="3.2.1" resource="resources/css/ext-all" />
        <p:css name='../themes/owf-admin/css/owf-admin-theme.css' absolute='true'/>

        <!-- initialize ozone configuration from server -->
        <owfImport:jsOwf path="config" resource="config" />

        <!-- include our server bundle, in dev mode a full list of js includes will appear -->
        <p:javascript src='owf-preference-management-widget'/>
        <!-- include our server bundle, in dev mode a full list of js includes will appear -->

        <script language="javascript">
            //<!-- ExtJS -->
            Ext.BLANK_IMAGE_URL = '<owfImport:fileLibrary lib="ext" version="3.2.1" resource="resources/images/default/s.gif" />';

            owfdojo.config.dojoBlankHtmlUrl =  '../js-lib/dojo-1.5.0-windowname-only/dojo/resources/blank.html';
        </script>
    </head>

    <body>
    </body>
</html>
