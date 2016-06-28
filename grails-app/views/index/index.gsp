<!DOCTYPE html>
<%@ page contentType="text/html; UTF-8" %>
<%
    String query = request.getQueryString();

    if (query && query.toLowerCase().contains("csp-debug=true")) {
        response.addHeader("Content-Security-Policy-Report-Only",
                           "default-src 'self';")
    }
 %>
<html>
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title id='title'>Ozone Widget Framework</title>

        <link rel="shortcut icon" href="images/favicon.ico" />
        <script language="javascript">
            //console.time('page');
        </script>
        <!-- ** CSS ** -->
        <p:css id='theme' name='${owfCss.defaultCssPath()}' absolute='true'/>
        <p:css id="bootstrap" name="${owfCss.bootstrapCssPath()}" absolute='true'/>

        <!-- initialize ozone configuration from server -->
        <owfImport:jsOwf path="config" resource="config" />

        <!-- modernizr-->
        <script src="./js-lib/modernizr/modernizr-2.6.2.js"></script>
        <!-- turn off Modernizr-based animations if needed -->
        <script>
            // limit the scope
            ;(function(Ozone, Modernizr) {
                // no animations?
                if (!Ozone.config.showAnimations) {
                    // turn off Modernizr-based animations
                    Modernizr.csstransitions = false;
                    Modernizr.cssanimations = false;
                }
            })(Ozone, Modernizr);
        </script>

        <!-- include our server bundle, in dev mode a full list of js includes will appear -->
        <p:javascript src='owf-server'/>
        <!-- include our server bundle, in dev mode a full list of js includes will appear -->

        <!-- Styles that disable all CSS animations.  This element gets removed if animations
             are enabled -->
        <style id="disable-css-animations">
            * {
                -webkit-transition:    none !important; /* Chrome, Safari */
                -moz-transition:       none !important; /* Firefox */
                -ms-transition:        none !important; /* IE */
                -o-transition:         none !important; /* Opera */
                transition:            none !important; /* CSS 3 */
                -webkit-animation:     none !important; /* Chrome, Safari */
                -moz-animation:        none !important; /* Firefox */
                -ms-animation:         none !important; /* IE */
                -o-animation:          none !important; /* Opera */
                animation:             none !important; /* CSS 3 */
            };
        </style>

        <!-- turn off CSS- and jQuery-based animations if needed -->
        <script>
            // limit the scope
            ;(function(Ozone, Ext, jQuery) {
                // no animations?
                if (!Ozone.config.showAnimations) {
                    // turn off jQuery-based animations
                    jQuery.fx.off = true;
                    jQuery.fn.bxSlider.defaults.useCSS = false;
                }
                else {
                    var ss = document.createElement('link');
                    ss.setAttribute('rel', 'stylesheet');
                    ss.setAttribute('type', 'text/css');
                    ss.setAttribute('href', './themes/a_default.theme/css/animations.css');
                    document.getElementsByTagName('head')[0].appendChild(ss);

                    var disableCssStyles = document.getElementById('disable-css-animations');
                    disableCssStyles.parentNode.removeChild(disableCssStyles);
                }
            })(Ozone, Ext, jQuery);
        </script>

        <script language="javascript">
            owfdojo.config.dojoBlankHtmlUrl =  './js-lib/dojo-1.5.0-windowname-only/dojo/resources/blank.html';
        </script>

        <!-- bring in custom header/footer resources -->
        <g:each in="${grailsApplication.mainContext.getBean('customHeaderFooterService').jsImportsAsList}" var="jsImport">
            <script type="text/javascript" src="${jsImport.encodeAsHTML()}"></script>
        </g:each>
        <g:each in="${grailsApplication.mainContext.getBean('customHeaderFooterService').cssImportsAsList}" var="cssImport">
            <link rel="stylesheet" href="${cssImport.encodeAsHTML()}" type="text/css" />
        </g:each>

        <!-- language switching -->
        <lang:preference lang="${params.lang}" />

        <!-- set Marketplace Version -->
        <marketplace:preference />
    </head>

     <body id="owf-body" onscroll="handleBodyOnScrollEvent();">
        <!-- Fields required for history management -->
        <form id="history-form" class="x-hidden">
            <input type="hidden" id="x-history-field" />
            <iframe id="x-history-frame" tabindex="-1"></iframe>
        </form>
    </body>
</html>
