Jasmine Adapter for [JsTestDriver][jstd]
========================================

Author
------

* Olmo Maldonado (me@ibolmo.com)
* Misko Hevery (misko@hevery.com)
* Christoph Pojer (christoph.pojer@gmail.com)

Requirements
------------

 - [JsTestDriver (JSTD)][jstd]
 - [Jasmine][jasmine]

Usage
-----

Create, or update, a `jstestdriver.conf` file (see [wiki page][jstd-conf] for more info).

Update your `jstestdriver.conf` by prepending the jasmine library and the adapter's source files.

For example:

	load:
    - "../jasmine/lib/jasmine-1.0.1.js"
    - "../JasmineAdapter/src/*"
    - "your_source_files.js"
    - "your_test_files.js"

Copy `server.sh` and `test.sh` (included) to your working directory, for convenience.

	# copy
	cp /path/to/jasmine-jstestdriver-adapter/*.sh ./
	
First: run `server.sh` and supply `-p`, for port, and `-j`, path to `jstestdriver.jar` or follow the convention defined in the `.sh` scripts (see Caveats below).

Open up [http://localhost:9876/capture](http://localhost:9876/capture) (update for your port) in any browser.

Finally: run `test.sh` to test all tests (specs) included with the `jstestdriver.conf`. Optionally pass a `-j` and `-t` arguments to `test.sh` to set the path to `jstestdriver.jar` and any test you'd only like to run, respectively.


Directory Layout
----------------
 
 - src: The adapter source code. Intent is to match interface with interface.
 - src-test: The test files that verifies that the adapter works as intended.

Caveats
-------

### jsTestDriver.conf and *.sh files

The files located in this repo assume that the parent folder has the jasmine source and a jstestdriver compiled available.

Update the paths, or pass arguments (as explained above), to reflect your own layout if you'd like to test the adapter.

### JSTD 1.3.2

This release has a [known bug (232)](http://code.google.com/p/js-test-driver/issues/detail?can=2&q=223&colspec=ID%20Type%20Status%20Priority%20Milestone%20Owner%20Summary&id=223) with relative paths. Quick solution is to place the `jasmine.js` and `JasmineAdapter.js` inside of the **absolute** path. In other words, make sure you do not use `..`. Other options are to: use a 1.3.1.jar or compile a jar from the HEAD (trunk) of the [JSTD][jstd] repository. 


Changes
-------
 * 1.1 - 2011-04-06 Olmo refactors and clean code into a more encapsulated adapter. 
 * 1.0 - 2010-12-14 Misko completely rewrites the adapter and is now a passthru for JSTD. Adds ddescribe and iit.
 * 0.5 - 2010-10-03 Chistoph has been improving the code and fixing bugs. Adds .sh files for simple run of server and client.
 * 0.2 - 2010-04-22 Misko fixes and refactors the adapter: beforeEach, afterEach, and nesting supported.
 * 0.1 - 2009-12-10 Olmo Initial release. Some support for beforeEach, afterEach, and matchers.


[jstd]: http://code.google.com/p/js-test-driver
[jstd-conf]: http://code.google.com/p/js-test-driver/wiki/ConfigurationFile
[jasmine]: http://github.com/pivotal/jasmine
