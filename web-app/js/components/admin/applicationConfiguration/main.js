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
            var $menuItems = $('.app_config_menu .item');

            $menuItems.on('click', function () {
                $menuItems.removeClass('active');
                $(this).addClass('active');
            });
        });
    }

    require ([
        'router/Router',
        'collections/Collection',
        'collections/Errors',
        'jquery',
        'underscore',
        'backbone',
    ], function(Router, Collection, Errors, $, _, Backbone){

        init();
        
        $.ajaxSetup({
            cache: false
        });

        Collection.prototype.url =  '../applicationConfiguration/configs';
        Errors.prototype.url =  '../applicationConfiguration/configs/validate';


        //Not sure if this is a good entry pointto the application or not.  For now it will route events on this
        //page to the appropriate place
        var app_router = new Router();
        
        //Start Backbone history a necessary step for bookmarkable URL's
        Backbone.history.start();
         
    });

})();