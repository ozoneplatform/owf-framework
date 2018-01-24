package ozone.owf.grails.controllers

class RedirectController {

    def redirectToScriptAssets() {
        redirect(uri: "/static/js/${params.path}")
    }

    def redirectToVendorAssets() {
        redirect(uri: "/static/vendor/${params.path}")
    }

}
