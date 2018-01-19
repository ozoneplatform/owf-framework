package ozone.owf.grails.services

import groovy.transform.CompileStatic
import javax.annotation.Nonnull
import javax.annotation.Nullable

import grails.config.Config
import grails.core.GrailsApplication
import grails.core.support.GrailsConfigurationAware

import org.springframework.core.io.Resource

/**
 * This service looks for the specified resource in two places.  
 * First, it looks in the external directory specified in fileRoot.
 * If not found, it then looks where the file would be if it were static
 * content from the war, as specified by urlRoot
 * If neither location are successful, it returns null*/
@CompileStatic
class MergedDirectoryResourceService implements GrailsConfigurationAware {

    private static final String THEME_CLASSPATH_ROOT = 'classpath:public/themes'
    private static final String PLUGIN_CLASSPATH_ROOT = 'classpath:public/js-plugins'
    private static final String HELP_CLASSPATH_ROOT = 'classpath:public/help'

    GrailsApplication grailsApplication

    String externalThemePath
    String externalPluginPath
    String externalHelpPath

    @Override
    void setConfiguration(Config config) {
        externalThemePath = config.getProperty('owf.external.themePath', String)
        externalPluginPath = config.getProperty('owf.external.jsPluginPath', String)
        externalHelpPath = config.getProperty('owf.external.helpPath', String)
    }

    Resource findThemeResource(@Nonnull String subPath) {
        getResource(externalThemePath, THEME_CLASSPATH_ROOT, subPath)
    }

    Resource findPluginResource(@Nonnull String subPath) {
        getResource(externalPluginPath, PLUGIN_CLASSPATH_ROOT, subPath)
    }

    Resource findHelpResource(@Nonnull String subPath) {
        getResource(externalHelpPath, HELP_CLASSPATH_ROOT, subPath)
    }

    /**
     * @return the Resource, or {@code null} if it does not exist
     */
    @Nullable
    Resource getResource(@Nullable String externalRoot,
                         @Nonnull String classpathRoot,
                         @Nonnull String subPath) {
        //subpath comes from end-user, should not trust it
        if (subPath.contains('..')) {
            log.info("Refusing to retrieve resource from subPath containing '..': ${subPath}")
            return null
        }

        if (externalRoot != null) {
            Resource externalResource = findResource("${externalRoot}/${subPath}")
            if (externalResource.exists()) return externalResource
        }

        Resource classpathResource = findResource("${classpathRoot}/${subPath}")
        if (classpathResource.exists()) return classpathResource

        return null
    }

    /**
     * Similar to getResource, but can have glob patterns in its parameters.
     *
     * @return all matching Resources, or an empty Collection
     */
    @Nonnull
    Collection<Resource> getResources(@Nullable String externalRoot,
                                      @Nonnull String classpathRoot,
                                      @Nonnull String subPath) {
        //subpath comes from end-user, should not trust it
        if (subPath.contains('..')) {
            log.info("Refusing to retrieve resource from subPath containing '..': ${subPath}")
            return []
        }

        List<Resource> externalResources = []
        if (externalRoot != null) {
            externalResources.addAll(findResources("${externalRoot}/${subPath}"))
        }

        findResources("${classpathRoot}/${subPath}") + externalResources
    }

    private Resource findResource(String location) {
        grailsApplication.mainContext.getResource(location)
    }

    private Collection<Resource> findResources(String pattern) {
        grailsApplication.mainContext.getResources(pattern) as Collection
    }

}
