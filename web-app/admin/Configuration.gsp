<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <title>Configuration</title>
        
        <!-- ** CSS ** -->
        <!-- base library -->
        <link rel='stylesheet' type='text/css' href='../themes/a_default.theme/css/a_default.css' />
        
    </head>
  
    <body class="configuration_widget">
        <br>

        <div class="app_config_menu">
            <div class="app_config_menu_item app_config_menu_item_auditing app_config_menu_item_auditing_active">
                <a href="#/config/auditing" class="app_config_menu_item_link">Auditing</a>
            </div>
            <div class="app_config_menu_item app_config_menu_item_user_account_settings">
                <a href="#/config/user_account_settings" class="app_config_menu_item_link">User Account Settings</a>
            </div>
        </div>                  

        <!-- Start the page content here -->
        <div id="applicationConfigurationDetail" class="app_config_list_view_panel">
        </div>

        <!--[if lt IE 8]>
            <script type="text/javascript" src="../js-lib/json2.js"></script>
        <![endif]-->

        <p:javascript data-main='../js/components/admin/applicationConfiguration/main' src='require-js' pathToRoot="../" />
    </body>
</html>