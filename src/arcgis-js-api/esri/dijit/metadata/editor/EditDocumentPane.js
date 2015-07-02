//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../base/Templated", "dojo/text!./templates/EditDocumentPane.html", "../../../kernel"], function(a, d, e, b, c, f) {
    return a([b], {
        gxeDocument: null,
        templateString: c,
        postCreate: function() {
            this.inherited(arguments)
        }
    })
});