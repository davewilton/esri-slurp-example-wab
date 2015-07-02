//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "dijit/_WidgetBase", "../../../../kernel"], function(b, c, d, a, e) {
    return b([a], {
        gxeDocument: null,
        toDocumentType: null,
        postCreate: function() {
            this.inherited(arguments)
        },
        checkTarget: function(b, a) {
            return a
        }
    })
});