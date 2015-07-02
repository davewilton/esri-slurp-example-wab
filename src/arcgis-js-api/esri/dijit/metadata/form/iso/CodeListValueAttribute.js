//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../Attribute", "../../../../kernel"], function(a, c, d, b, e) {
    return a([b], {
        isIsoCodeListValue: !0,
        minOccurs: 1,
        showHeader: !1,
        target: "codeListValue",
        postCreate: function() {
            this.inherited(arguments)
        },
        resolveMinOccurs: function() {
            return this.parentElement ? this.parentElement.resolveMinOccurs() : this.minOccurs
        }
    })
});