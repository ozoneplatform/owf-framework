package ozone.example.widgets

class OwfTagLib {

    static namespace = 'owf'

    public static final String FRAMEWORK_JS_PATH = "static/js";
    public static final String WIDGETS_JS_PATH = "static/widgets";
    public static final String VENDOR_JS_PATH = "static/vendor";

        public static final String STYLESHEET_MEDIA_DEFAULT = "screen, projection";

    //static encodeAsForTags = [tagName: [taglib:'html'], otherTagName: [taglib:'none']]

    //static defaultEncodeAs = [taglib: 'html']

    Closure javascript = { attrs ->
        String src = attrs.src
        String context = attrs.context ?: request.contextPath ?: ""

        if (src.startsWith("/")) {
            out << script(src)
        } else {
            out << script("$context/$src")
        }
    }

    Closure configScript = { attrs ->
        String context = attrs.context ?: request.contextPath ?: ""

        out << script("${context}/js/config/config.js")
    }

    Closure frameworkJs = { attrs ->
        String src = attrs.src
        String context = attrs.context ?: request.contextPath ?: ""

        out << script("$context/$FRAMEWORK_JS_PATH/$src")
    }

    Closure widgetJs = { attrs ->
        String src = attrs.src
        String context = attrs.context ?: request.contextPath ?: ""

        out << script("$context/$WIDGETS_JS_PATH/$src")
    }

    Closure vendorJs = { attrs ->
        String src = attrs.src
        String context = attrs.context ?: request.contextPath ?: ""

        out << script("$context/$VENDOR_JS_PATH/$src")
    }

    Closure stylesheet = { attrs ->
        String id = attrs.id
        String src = attrs.src
        String context = attrs.context ?: request.contextPath ?: ""
        String media = attrs.media ?: "screen, projection"

        if (!src.startsWith("/")) {
            out << linkStylesheet(id, "$context/$src", media)
        } else {
            out << linkStylesheet(id, src, media)
        }
    }

    Closure themeStylesheet = { attrs ->
        String id = attrs.id
        String themeName = attrs.themeName.encodeAsURL().encodeAsHTML()
        String context = attrs.context ?: request.contextPath ?: ""
        String media = attrs.media ?: "screen, projection"

        out << linkStylesheet(id, "$context/static/themes/${themeName}.theme/css/${themeName}.css", media)
    }

    private static String script(String src) {
        """<script type="text/javascript" src="$src"></script>"""
    }

    private static String linkStylesheet(String id, String href, String media = STYLESHEET_MEDIA_DEFAULT) {
        return (id != null) ? """<link id="$id" rel="stylesheet" type="text/css" href="$href"  media="$media"/>"""
                            : """<link rel="stylesheet" type="text/css" href="$href"  media="$media"/>"""
    }

}
