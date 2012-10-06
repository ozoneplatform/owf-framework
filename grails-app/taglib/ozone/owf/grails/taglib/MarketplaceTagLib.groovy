package ozone.owf.grails.taglib

import ozone.owf.grails.OwfException

class MarketplaceTagLib {
    
    static namespace = 'marketplace'
    
    def preference = { attrs ->
        def retVal
        def version = ''
        if (attrs['version'] != null && attrs['version'] != "") {
          version = '-' + attrs['version']
        }

            retVal = """
        ${p.javascript(src: 'marketplace/marketplaceAPI'+ version )}
            """
        out << retVal
    }

}
