package ozone.owf.grails.services

import spock.lang.Specification

import grails.testing.services.ServiceUnitTest


class HelpServiceSpec extends Specification implements ServiceUnitTest<HelpService> {

    void testSortsTopLevelDirectory() {
        given:
        setUpFilesToBe([
                mockFile("/aFile"),
                mockDirectory("/bDir"),
                mockFile("/bFile"),
                mockDirectory("/aDir")
        ])

        expect:
        service.getHelpTree()*.path == ["/aDir", "/bDir", "/aFile", "/bFile"]
    }

    void testSortsSubDirectory() {
        given:
        setUpFilesToBe([
                mockDirectory("/dir"),
                mockFile("/dir/aFile"),
                mockDirectory("/dir/bDir"),
                mockFile("/dir/bFile"),
                mockDirectory("/dir/aDir")
        ])

        expect:
        service.getHelpTree()[0].children*.path == ["/dir/aDir", "/dir/bDir", "/dir/aFile", "/dir/bFile"]
    }

    private mockFile(path) {
        [
                getParentFile: { -> mockDirectory(path.split("/")[0..-2].join("/") ?: "/") },
                toURI        : { -> path },
                isDirectory  : { -> false },
                getName      : { -> path.split("/")[-1] }
        ]
    }

    private mockDirectory(path) {
        def file = mockFile(path)
        file.isDirectory = { -> true }
        file
    }

    private directoryThatTraverses(files) {
        def directory = mockDirectory("/")
        directory.traverse = { options, processItemClosure ->
            files.each processItemClosure
        }
        directory
    }

    private resourceWithFiles(files) {
        [
                exists: { -> true },
                file  : directoryThatTraverses(files)
        ]
    }

    private nonExistentResource() {
        [exists: { -> false }]
    }

    private void setUpFilesToBe(files) {
        service.grailsApplication = [
                mainContext: [
                        getResource: { String path ->
                            if (path == "help") {
                                resourceWithFiles(files)
                            } else {
                                nonExistentResource()
                            }
                        }
                ],
                config: [owf: [external: [helpPath: null]]]
        ]
    }

}
