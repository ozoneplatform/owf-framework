package ozone.owf.grails.services

import grails.test.*

class HelpServiceTests extends GrailsUnitTestCase {

    HelpService service = new HelpService()

    private mockFile(path) {
        [
            getParentFile: {->mockDirectory(path.split("/")[0..-2].join("/")?:"/")},
            toURI: {->path},
            isDirectory: {-> false},
            getName:{-> path.split("/")[-1]}
        ]
    }

    private mockDirectory(path) {
        def file = mockFile(path)
        file.isDirectory = {->true}
        file
    }

    private directoryThatTraverses(files) {
        def directory = mockDirectory("/")
        directory.traverse = {options, processItemClosure ->
            files.each processItemClosure
        }
        directory
    }

    private resourceWithFiles(files) {
        [
            exists:{->true},
            file: directoryThatTraverses(files)
        ]
    }

    private nonExistentResource() {
        [exists:{->false}]
    }

    private void setUpFilesToBe(files) {
        service.grailsApplication = [
                mainContext : [
                    getResource : {String path ->
                        if ( path == "help" ) {
                            resourceWithFiles(files)
                        } else {
                            nonExistentResource()
                        }
                    }
                ],
                config:[owf:[external:[helpPath:null]]]
        ]
    }

    private void assertPathsAre(expectedPaths, helpTreeResult) {
        assertEquals expectedPaths, helpTreeResult*.path
    }

    void testSortsTopLevelDirectory() {
        setUpFilesToBe([
                mockFile("/aFile"),
                mockDirectory("/bDir"),
                mockFile("/bFile"),
                mockDirectory("/aDir")
        ])
        assertPathsAre([
                "/aDir",
                "/bDir",
                "/aFile",
                "/bFile",
        ], service.getHelpTree())
    }

    void testSortsSubDirectory() {
        setUpFilesToBe([
                mockDirectory("/dir"),
                mockFile("/dir/aFile"),
                mockDirectory("/dir/bDir"),
                mockFile("/dir/bFile"),
                mockDirectory("/dir/aDir")
        ])
        assertPathsAre([
                "/dir/aDir",
                "/dir/bDir",
                "/dir/aFile",
                "/dir/bFile",
        ], service.getHelpTree()[0].children)
    }
}