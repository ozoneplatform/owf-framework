<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <title>Configuration</title>
        
        <!-- ** CSS ** -->
        <!-- base library -->
        <link rel='stylesheet' type='text/css' href='../themes/a_default.theme/css/a_default.css' />

        <p:javascript src='owf-widget-configuration-widget' pathToRoot="../" />
    </head>
  
    <body class="configuration_widget">
        <br>

        <div class="app_config_menu">
            <div class="item auditing active">
                <a href="#/config/auditing">Auditing</a>
            </div>
            <div class="item user_account_settings">
                <a href="#/config/user_account_settings">User Account Settings</a>
            </div>
            <div class="item branding">
                <a href="#/config/branding">Branding</a>
            </div>
            <div class="item store">
                <a href="#/config/store">Store</a>
            </div>
        </div>

        <!--[if lt IE 8]>
            <script type="text/javascript" src="../js-lib/json2.js"></script>
        <![endif]-->

        <p:javascript data-main='../js/components/admin/applicationConfiguration/main' src='require-js' pathToRoot="../" />
        <script>
            owfdojo.config.dojoBlankHtmlUrl =  '../js-lib/dojo-1.5.0-windowname-only/dojo/resources/blank.html';
        </script>
    </body>
</html>