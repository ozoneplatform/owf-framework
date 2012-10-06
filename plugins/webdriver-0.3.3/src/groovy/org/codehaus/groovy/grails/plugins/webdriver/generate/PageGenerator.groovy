package org.codehaus.groovy.grails.plugins.webdriver.generate

import org.apache.commons.io.FileUtils
import org.codehaus.groovy.grails.plugins.webdriver.WebDriverPage
import org.openqa.selenium.By

/**
 * Created by IntelliJ IDEA.
 * User: rob
 * Date: Nov 18, 2010
 * Time: 7:30:55 AM
 * To change this template use File | Settings | File Templates.
 */
class PageGenerator {
    public void generate(File baseDir) {
        FileUtils.deleteDirectory(new File(baseDir, "test/functional2"))
        new File(baseDir, "grails-app/views").eachDir { File controllerDir ->
            controllerDir.eachFileMatch(~/.*\.gsp$/) { File gspFile ->
                System.out.println("gspFile = " + gspFile);
                String controllerName = controllerDir.name
                String viewName = gspFile.name[0..-5]
                String pageClassName = getPageName(controllerName, viewName)
                File pageFile = new File(baseDir, "test/functional2/pages/${controllerName}/${pageClassName}.groovy");
                String text = gspFile.text
                String layout = "main"
                List fields = []
                List methods = []
                List buttons = []
                List elements = []
                Set imports = [] as Set
                text.eachMatch(/<meta name="layout" content="(.*?)"/) { String all, String l ->
                    layout = l
                }
                text.eachMatch(/<g:textField name="(.*?)"/) { String all, String name ->
                    fields << "String ${name}"
                }
                text.eachMatch(/<g:submitButton name="(.*?)"/) { String all, String name ->
                    buttons << name
                }
                text.eachMatch(/<g:actionSubmit .*? action="(.*?)"/) { String all, String action ->
                    buttons << action
                }
                text.eachMatch(/<g:link( controller="(.*?)")? action="(.*?)"/) { String all, String x, String linkController,String action ->
                    System.out.println("all = " + all);
                    System.out.println("x = " + x);
                    System.out.println("linkController = " + linkController);
                    System.out.println("action = " + action);
                    linkController = linkController ?: controllerName
                    System.out.println("linkController2 = " + linkController);
                    methods << """${getPageName(linkController, action)} click${action.capitalize()}() {
        ${action}Link.click()
    }"""
                    elements << """${action}Link(By.xpath("a[href=/${linkController}/${action}]"))"""
                    imports << By.getCanonicalName()

                }
                String basePackage = controllerName == "layouts" ? WebDriverPage.getPackage().getName() : "pages.layouts"
                String basePage = controllerName == "layouts" ? "WebDriverPage" : getPageName("layouts", layout)
                imports << "${basePackage}.${basePage}"
                System.out.println("layout = " + layout);
                System.out.println("basePage = " + basePage);
                System.out.println("fields = " + fields);
                System.out.println("buttons = " + buttons);
                FileUtils.forceMkdir(pageFile.parentFile)
                pageFile.text = """package pages.${controllerName}
${imports.collect { "import ${it}" }.join('\n')}
import ${basePackage}.${basePage}

class ${pageClassName} extends ${basePage} {
    static expectedURL = ~"/${controllerName}/${viewName}(/\\\\d+)?"
    
    ${fields.join("\n    ")}

    ${methods.join("\n    ")}

    static elements = {
        ${elements.join('\n        ')}
    }
}
                """
            }
        }
    }

    private String getPageName(String controllerName, String viewName) {
        if (controllerName == "layouts") {
            return "${viewName.capitalize()}LayoutPage"
        } else {
            return "${controllerName.capitalize()}${viewName.capitalize()}Page"
        }
    }
}
