//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../Element", "../../../../kernel"], function(a, c, d, b, e) {
    return a([b], {
        showHeader: !1,
        postCreate: function() {
            this.inherited(arguments)
        },
        resolveMinOccurs: function() {
            return this.parentElement ? this.parentElement.resolveMinOccurs() : this.minOccurs
        },
        toggleContent: function(a) {
            this.parentElement ? this.parentElement.toggleContent(a) : this.inherited(arguments)
        }
    })
});