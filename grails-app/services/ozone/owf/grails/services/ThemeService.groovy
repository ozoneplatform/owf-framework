package ozone.owf.grails.services

import groovy.transform.CompileStatic
import javax.annotation.Nullable

import grails.config.Config
import grails.converters.JSON
import grails.core.GrailsApplication
import grails.core.support.GrailsConfigurationAware

import org.springframework.core.io.Resource

import org.grails.web.json.JSONObject

import ozone.owf.grails.OwfException
import ozone.owf.grails.OwfExceptionTypes
import ozone.owf.grails.domain.Preference


@CompileStatic
class ThemeService implements GrailsConfigurationAware {

    private static final String THEME_CLASSPATH_ROOT = 'classpath:public/themes'

    PreferenceService preferenceService

    MergedDirectoryResourceService mergedDirectoryResourceService

    String defaultThemeName
    String externalThemePath

    @Override
    void setConfiguration(Config config) {
        defaultThemeName = config.getProperty('owf.defaultTheme', String)
        externalThemePath = config.getProperty('owf.external.themePath', String)
    }

    Resource getImageResource(String imageUrl) {
        JSONObject theme

        try {
            theme = findUserTheme()
        }
        catch (Exception ignored) {
            //fall back to default theme. If this also throws an exception, don't catch it
            theme = findDefaultTheme()
        }

        String baseUrl = theme.getString('base_url')

        if (baseUrl == null || baseUrl.isEmpty()) {
            Resource themeResource = findThemeResource("$baseUrl/$imageUrl")
            if (themeResource != null) return themeResource
        }

        findThemeResource("common/$imageUrl")
    }

    @Nullable
    private Resource findThemeResource(String location) {
        mergedDirectoryResourceService.getResource(externalThemePath, THEME_CLASSPATH_ROOT, location)
    }

    private Collection<Resource> findThemeResources(String pattern) {
        mergedDirectoryResourceService.getResources(externalThemePath, THEME_CLASSPATH_ROOT, pattern)
    }

    JSONObject getCurrentTheme() {
        //if there is a stored preference for this user's theme, use that
        String userTheme = getUserThemePref()
        if (userTheme != null && !userTheme.isEmpty()) {
            try {
                return getTheme(userTheme)
            } catch (OwfException ignored) {
                log.warn("User theme preference set to non-existant theme: ${userTheme}")
            }
        }

        return findDefaultTheme()
    }

    Collection<JSONObject> getAvailableThemes() {
        //find all files in the webapp (and external themes dir)
        //with a path like 'themes/*.theme/theme.json'
        findThemeResources("*.theme/theme.json").findResults {
            try {
                return parseThemeDefinitionFromResource(it)
            }
            catch (OwfException ignored) {
                return null
            }
        }
    }

    String getUserThemePref() {
        Map result = (Map) preferenceService.show([namespace: 'owf', path: 'selected_theme'])
        Preference preference = (Preference) result.get("preference")
        return preference?.value
    }

    private JSONObject parseThemeDefinitionFromResource(Resource resource) {
        try {
            JSON.parse(new InputStreamReader(resource.inputStream)) as JSONObject
        }
        catch (e) {
            log.error("Error while attempting to read Theme definition in ${resource.getURL()}. Exception: ${e}")

            throw new OwfException(
                    message: 'Error retrieving the requested CSS theme',
                    exceptionType: OwfExceptionTypes.GeneralServerError)
        }
    }

    private JSONObject findDefaultTheme() {
        getTheme(defaultThemeName)
    }

    private JSONObject findUserTheme() {
        getTheme(getUserThemePref())
    }

    JSONObject getTheme(String themeName) {
        Resource resource = findThemeResource("${themeName}.theme/theme.json")

        if (!themeName || resource == null)
            throw new OwfException(
                    message: "Cannot find the requested CSS theme: ${themeName}",
                    exceptionType: OwfExceptionTypes.GeneralServerError)

        return parseThemeDefinitionFromResource(resource)
    }

}
