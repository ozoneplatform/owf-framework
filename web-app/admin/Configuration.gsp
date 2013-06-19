<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <title>Configuration</title>
        
        <!-- ** CSS ** -->
        <!-- base library -->
        <g:if test="${params.themeName != null && params.themeName != ''} ">
            <link rel='stylesheet' type='text/css' href='../themes/${params.themeName.encodeAsHTML()}.theme/css/${params.themeName.encodeAsHTML()}.css' />
        </g:if>
        <g:else>
            <p:css name='../${owfCss.defaultCssPath()}' absolute='true'/>
        </g:else>
        
    </head>
  
    <body class="configuration_widget">
        <br>

        <div class="app_config_menu">
            <div class="app_config_menu_item app_config_menu_item_branding app_config_menu_item_branding_active">
                <a href="#/config/auditing" class="app_config_menu_item_link">Auditing</a>
            </div>   
        </div>                  
        </div>
        <!-- Start the page content here -->
        <div id="applicationConfigurationDetail" class="app_config_list_view_panel">
        </div>

        <!--[if lt IE 8]>
            <script type="text/javascript" src="../js/backbone/json2.js"></script>
        <![endif]-->

        <p:javascript data-main='../js/components/admin/applicationConfiguration/main' src='require-js' pathToRoot="../" />
</html>