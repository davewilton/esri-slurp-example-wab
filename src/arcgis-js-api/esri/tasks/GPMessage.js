//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel"], function(a, b, c, d) {
    a = a(null, {
        declaredClass: "esri.tasks.GPMessage",
        constructor: function(a) {
            b.mixin(this, a)
        }
    });
    b.mixin(a, {
        TYPE_INFORMATIVE: "esriJobMessageTypeInformative",
        TYPE_PROCESS_DEFINITION: "esriJobMessageTypeProcessDefinition",
        TYPE_PROCESS_START: "esriJobMessageTypeProcessStart",
        TYPE_PROCESS_STOP: "esriJobMessageTypeProcessStop",
        TYPE_WARNING: "esriJobMessageTypeWarning",
        TYPE_ERROR: "esriJobMessageTypeError",
        TYPE_EMPTY: "esriJobMessageTypeEmpty",
        TYPE_ABORT: "esriJobMessageTypeAbort"
    });
    return a
});