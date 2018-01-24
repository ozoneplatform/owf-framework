<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <title>Configuration</title>

        <owf:stylesheet src="static/themes/a_default.theme/css/a_default.css"/>
        <owf:stylesheet src="static/themes/a_default.theme/css/bootstrap_main.css"/>
        <owf:stylesheet src="static/themes/a_default.theme/css/applicationConfiguration.css"/>

        <owf:javascript src="owf-widget-configuration-widget.js"/>
        <owf:javascript src="require-js.js"/>
    </head>

    <body class="configuration_widget">
        <br>

        <div class="app_config_menu">
            <div class="item auditing active">
                <a href="#/config/AUDITING">Auditing</a>
            </div>
            <div class="item user_account_settings">
                <a href="#/config/USER_ACCOUNT_SETTINGS">User Account Settings</a>
            </div>
            <div class="item branding">
                <a href="#/config/BRANDING">Branding</a>
            </div>
            <div class="item store">
                <a href="#/config/store">Store</a>
            </div>
        </div>

        <!--[if lt IE 8]>
            <owf:vendor src="json2.js"/>
        <![endif]-->

        <owf:javascript src="components/admin/applicationConfiguration/main.js"/>

        <script>
            owfdojo.config.dojoBlankHtmlUrl = '${request.contextPath}/static/vendor/dojo-1.5.0-windowname-only/dojo/resources/blank.html';
        </script>
    </body>
</html>
