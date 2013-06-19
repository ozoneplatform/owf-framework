;(function () {
    require.config({
        //urlArgs : "bust=" + Marketplace.getBuildNumber(),   
        paths: {
            "jquery"                : "../../../../js-lib/jquery/jquery-1.8.0",
            "underscore"            : "../../../../js-lib/underscore/underscore-1.4.4",
            "backbone"              : "../../../../js-lib/backbone/backbone-0.9.2"
        },  
        shim: {
            underscore: {
                exports: '_'
            },
            backbone: {
                deps: ["underscore", "jquery"],
                exports: "Backbone"
            },
            jqueryui: {
                deps: ["jquery"],
                exports: 'jqueryui'
            }
        }
    });

    function init () {
        jQuery(function(){ 
            var $ = jQuery;
            
            $(".app_config_menu_item_franchise_store").click(function(){
                removeAllActiveClasses();
                $(this).addClass('app_config_menu_item_franchise_store_active');    
            }); 
            
            $(".app_config_menu_item_branding").click(function(){
                removeAllActiveClasses();
                $(this).addClass('app_config_menu_item_branding_active');   
            }); 

            $(".app_config_menu_item_scorecard").click(function(){
                removeAllActiveClasses();
                $(this).addClass('app_config_menu_item_scorecard_active');  
            });                     

            $(".app_config_menu_item_additional_config").click(function(){
                removeAllActiveClasses();
                $(this).addClass('app_config_menu_item_additional_config_active');  
            });     

            $(".app_config_menu_item_data_exchange").click(function(){
                removeAllActiveClasses();
                $(this).addClass('app_config_menu_item_data_exchange_active');  
            });     

            $(".app_config_menu_item_listing_management").click(function(){
                removeAllActiveClasses();
                $(this).addClass('app_config_menu_item_listing_management_active'); 
            });

            $(".app_config_menu_item_user_account_settings").click(function(){
                removeAllActiveClasses();
                $(this).addClass('app_config_menu_item_user_account_settings_active');
            });

            function removeAllActiveClasses(){
                $(".app_config_menu_item_franchise_store").removeClass("app_config_menu_item_franchise_store_active");
                $(".app_config_menu_item_branding").removeClass("app_config_menu_item_branding_active");
                $(".app_config_menu_item_scorecard").removeClass("app_config_menu_item_scorecard_active");
                $(".app_config_menu_item_additional_config").removeClass("app_config_menu_item_additional_config_active");
                $(".app_config_menu_item_data_exchange").removeClass("app_config_menu_item_data_exchange_active");
                $(".app_config_menu_item_listing_management").removeClass("app_config_menu_item_listing_management_active");
                $(".app_config_menu_item_user_account_settings").removeClass("app_config_menu_item_user_account_settings_active");
                // Handle page layout when menus with larger content display
            }                   
        });
    }

    require ([
        'jquery',
        'underscore',
        'backbone',
        'router/ApplicationConfigurationRouter',
    ], function($, _, Backbone,  ApplicationConfigurationRouter){

        init();
        
        $.ajaxSetup({
            cache: false
        });


        //Not sure if this is a good entry pointto the application or not.  For now it will route events on this
        //page to the appropriate place
        var app_router = new ApplicationConfigurationRouter();
        
        //Start Backbone history a necessary step for bookmarkable URL's
        Backbone.history.start();
         
    });

})();