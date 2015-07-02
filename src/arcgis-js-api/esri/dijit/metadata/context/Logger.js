//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../../../kernel"], function(b, c, d, e) {
    return b(null, {
        debugEnabled: !0,
        constructor: function(a) {
            c.mixin(this, a)
        },
        debug: function() {
            window.console && this.debugEnabled && (console.debug ? console.debug(arguments) : console.log && console.log(arguments))
        },
        error: function(a) {
            window.console && (console.error ? a ? console.error(a) : console.error(arguments) : console.log && console.log(arguments))
        },
        info: function() {
            window.console && (console.info ? console.info(arguments) : console.log &&
                console.log(arguments))
        },
        log: function() {
            window.console && console.log && console.log(arguments)
        },
        warn: function() {
            window.console && (console.warn ? console.warn(arguments) : console.log && console.log(arguments))
        },
        _test: function() {
            this.debug("Debug message.");
            this.log("Log message.");
            this.info("Info message.");
            this.warn("Warn message.");
            this.error(Error("Error message."), "additionalArgument");
            console.error(Error("Error2 message2."), "additionalArgument")
        }
    })
});