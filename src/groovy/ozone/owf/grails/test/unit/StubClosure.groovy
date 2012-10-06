package ozone.owf.grails.test.unit

import junit.framework.AssertionFailedError

/**
 * Helps count the number of times a closure's called.
 * <p>
 * Example usage:
 * <pre>
 *
 * def stubObject = new Expando()
 * stubObject.method = stub { println "hello" }
 *
 * stubObject.method()
 * stubObject.method()
 * stubObject.method()
 *
 * assertMethodCalled stubObject.method, atLeastOnce()
 * assertMethodCalled stubObject.method, times(3)
 * assertMethodCalled stubObject.method, between(2..4)
 * </pre>
 */
class StubClosure extends Closure {
    static def stub(closure) {
        new StubClosure(closure)
    }

    static def assertMethodCalled(stub, matcher) {
        stub.assertCalled(matcher)
    }

    static def never() {
        [
            test: { it == 0 },
            describe: { actual -> "never expected method to be called, but was called ${actual} times" }
        ]
    }

    static def once() {
        [
            test: { it == 1 },
            describe: { actual -> "expected method to be called once, but was called ${actual} times" }
        ]
    }

    static def atLeastOnce() {
        [
            test: { it > 0 },
            describe: { actual -> "expected method to be called at least once, but was called ${actual} times" }
        ]
    }

    static def atLeast(int n) {
        [
            test: { it >= n },
            describe: { actual -> "expected method to be called at least ${n} times, but was called ${actual} times" }
        ]
    }

    static def times(int n) {
        [
            test: { it == n },
            describe: { actual -> "expected method to be called ${n} times, but was called ${actual} times" }
        ]
    }

    static def between(Range r) {
        [
            test: { r.contains(it) },
            describe: { actual -> "expected method to be called between ${r.from} and ${r.to} times, but was called ${actual} times" }
        ]
    }

    def closure
    def num = 0

    StubClosure(closure) {
        super(closure)
        this.closure = closure
        this.@maximumNumberOfParameters = closure.maximumNumberOfParameters
        this.@parameterTypes = closure.parameterTypes
    }

    protected def doCall(Object ... arguments) {
        num += 1
        closure.call(*arguments)
    }

    def assertCalled(matcher) {
        if (!matcher.test(num)) {
            // TODO: change to "throw new AssertionError(matcher.describe(num))" when we upgrade to JUnit 4
            throw new AssertionFailedError(matcher.describe(num))
        }
        true
    }
}