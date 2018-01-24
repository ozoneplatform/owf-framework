;(function () {
    var CONTEXT_PATH = (function getContextPath() {
        var pathname = window.location.pathname;
        var contextPath = pathname.substring(0, pathname.indexOf("/", 2));
        return (contextPath === "/admin") ? "" : contextPath;
    })();

    require.config({
        baseUrl: CONTEXT_PATH + "/static/js/components/admin/applicationConfiguration",
        paths: {
            "jquery"    : CONTEXT_PATH + "/static/vendor/jquery/jquery-3.2.1",
            "underscore": CONTEXT_PATH + "/static/vendor/underscore/underscore-1.8.3",
            "backbone"  : CONTEXT_PATH + "/static/vendor/backbone/backbone-1.3.3",
            "pnotify"   : CONTEXT_PATH + "/static/vendor/pnotify-1.2.0/jquery.pnotify",
            "bootstrap" : CONTEXT_PATH + "/static/vendor/bootstrap/bootstrap-2.3.2"
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
            },
            pnotify: {
                deps: ["jquery"],
                exports: "$"
            },
            bootstrap: {
                deps: ["jquery"],
                exports: "$"
            }
        }
    });

    function init() {
        jQuery(function () {
            var $ = jQuery;
            var $menuItems = $('.app_config_menu .item');

            $menuItems.on('click', function () {
                $menuItems.removeClass('active');
                $(this).addClass('active');
            });
        });
    }

    require([
        'router/Router',
        'collections/Collection',
        'collections/Errors',
        'jquery',
        'underscore',
        'backbone'
    ], function (Router, Collection, Errors, $, _, Backbone) {
        init();
        $.ajaxSetup({cache: false});

        Collection.prototype.url = CONTEXT_PATH + "/applicationConfiguration/configs";
        Errors.prototype.url = CONTEXT_PATH + "/applicationConfiguration/configs/validate";

        //Not sure if this is a good entry pointto the application or not.  For now it will route events on this
        //page to the appropriate place
        var app_router = new Router();
        //Start Backbone history a necessary step for bookmarkable URL's
        Backbone.history.start();
    });

})();
