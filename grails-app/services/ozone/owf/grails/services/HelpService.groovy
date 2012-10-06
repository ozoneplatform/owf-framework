package ozone.owf.grails.services

import org.springframework.context.*
import groovy.io.FileVisitResult

class HelpService {

  def grailsApplication

  private def getPath(baseDir, file) {
    def index = 0
    def baseDirURI = baseDir.toURI().toString()
    def fileURI = file.toURI().toString()

    //remove the base path from the uri
    if (baseDir != file) {
      index = fileURI.indexOf(baseDirURI)
    }

    if (index >= 0) {
      fileURI.substring(baseDirURI.length() - 1)
    }
    else {
      fileURI
    }
  }

  private def recurseFiles(baseDir, dirMap) {

    baseDir.traverse(
            preDir: { f -> if (f.isHidden()) return FileVisitResult.SKIP_SUBTREE },
            filter: { f -> !f.isHidden() && (f.name.matches(grailsApplication.config.owf.helpFileRegex) || f.isDirectory()) }
    ) { current ->
      def parentDir = current.getParentFile() ?: baseDir

      def currPath = getPath(baseDir, current)
      def parentPath = getPath(baseDir, parentDir)

      def parentList = dirMap[parentPath]

      if (!parentList.find {it -> it.path == currPath}) {

        if (current.isDirectory()) {
          dirMap[currPath] = []
          parentList.push([text: current.getName(), path: currPath, leaf: false, children: dirMap[currPath]])
        }
        else {
          parentList.push([text: current.getName(), path: currPath, leaf: true])
        }
      }
    }
  }

  def getHelpTree() {
    def appContext = grailsApplication.mainContext 
    def data = []
    def dirMap = ['/' : data]

    def internalFile
    def externalFile
    
    def internalHelpRes = appContext.getResource('help')
    def externalHelpRes = appContext.getResource(grailsApplication.config.owf.external.helpPath)
    if (internalHelpRes.exists()) { internalFile = internalHelpRes.file }
    if (externalHelpRes.exists()) { externalFile = externalHelpRes.file }

    if (externalFile) { recurseFiles(externalFile, dirMap) }
    if (internalFile) { recurseFiles(internalFile, dirMap) }

    data.sort { a, b ->
      a.leaf != b.leaf ? a.leaf <=> b.leaf : a.name <=> b.name
    }

    data
  }
}
