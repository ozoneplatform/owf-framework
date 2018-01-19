package ozone.owf.grails.controllers

import grails.converters.JSON

import org.springframework.core.io.Resource

import ozone.owf.grails.services.ThemeService


class ThemeController extends BaseOwfRestController {

    ThemeService themeService

    def getImageURL = {
        boolean isAdminImage = params.isImageReqAdmin ?: false

        String imageUrl = isAdminImage ? "/images/admin/${params.img_name}"
                                       : "/images/${params.img_name}"

        Resource resource = themeService.getImageResource(imageUrl)

        if (resource == null || !resource.exists()) {
            return renderResult([message: "Not Found: ${params.img_name}"] as JSON, 404)
        }

        response.outputStream << resource.inputStream
        response.outputStream.flush()
    }

    def getAvailableThemes = {
        renderResult((themeService.getAvailableThemes()) as JSON, 200)
    }
}
