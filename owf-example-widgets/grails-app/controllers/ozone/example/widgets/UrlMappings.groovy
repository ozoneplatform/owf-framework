package ozone.example.widgets


class UrlMappings {

    static mappings = {

        if (OzoneExampleWidgetsGrailsPlugin.isEnabled()) {
            "/widgets/channel_shouter"(view: "/channel_shouter")
            "/widgets/channel_listener"(view: "/channel_listener")

            "/widgets/color_server"(view: "/color_server")
            "/widgets/color_client"(view: "/color_client")

            "/widgets/widget_log"(view: "/widget_log")

            "/widgets/widget_chrome"(view: "/widget_chrome")

            "/widgets/preferences"(view: "/preferences")

            "/widgets/event_monitor"(view: "/event_monitor")

            "/widgets/html_viewer"(view: "/html_viewer")

            "/widgets/nyse"(view: "/nyse")
            "/widgets/stock_chart"(view: "/stock_chart")
        }

    }

}
