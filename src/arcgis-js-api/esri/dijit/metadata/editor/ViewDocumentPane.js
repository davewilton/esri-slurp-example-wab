//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom-style", "dojo/has", "../base/Templated", "dojo/text!./templates/ViewDocumentPane.html", "../../../kernel"], function(a, e, b, f, c, d, g) {
    return a([c], {
        gxeDocument: null,
        templateString: d,
        xmlString: null,
        postCreate: function() {
            this.inherited(arguments)
        },
        hideMessage: function() {
            this.messageNode.innerHTML = "";
            b.set(this.messageNode, "display", "none")
        },
        showMessage: function(a) {
            this.setNodeText(this.messageNode, a);
            b.set(this.messageNode, "display", "")
        }
    })
});