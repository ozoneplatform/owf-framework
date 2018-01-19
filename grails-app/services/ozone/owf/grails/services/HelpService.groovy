package ozone.owf.grails.services

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
    def externalHelpRes
    def externalFile
    
    def internalHelpRes = appContext.getResource('help')
    if (internalHelpRes.exists()) { internalFile = internalHelpRes.file }
    
    // protect, external help file path may not be set in application.yml
    def externalFilePath = grailsApplication.config.owf.external.helpPath
    if (externalFilePath) { externalHelpRes = appContext.getResource(externalFilePath) }
    if (externalHelpRes && externalHelpRes.exists()) { externalFile = externalHelpRes.file }

    if (externalFile) { recurseFiles(externalFile, dirMap) }
    if (internalFile) { recurseFiles(internalFile, dirMap) }

    dirMap.each {path, fileList ->
      fileList.sort { a, b ->
        a.leaf != b.leaf ? a.leaf <=> b.leaf : a.text <=> b.text
      }
    }

    data
  }
}
