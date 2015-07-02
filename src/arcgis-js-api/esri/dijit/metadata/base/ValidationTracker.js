//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "dijit/_WidgetBase", "../../../kernel"], function(a, e, f, g, d, h) {
    return a([d], {
        documentTitle: null,
        hadValidationErrors: !1,
        ignoreErrors: !1,
        isSaveAsDraft: !1,
        validationPane: null,
        postCreate: function() {
            this.inherited(arguments)
        },
        handleValidationError: function(a, b, c) {
            this.ignoreErrors || (this.isSaveAsDraft ? a.isDocumentTitle && (this.hadValidationErrors = !0, this.validationPane.addWarning(b, c)) : (this.hadValidationErrors = !0, this.validationPane.addWarning(b,
                c)))
        },
        whenComplete: function() {
            this.validationPane && this.validationPane.whenComplete()
        }
    })
});