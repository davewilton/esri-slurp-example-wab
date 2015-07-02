//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom-class", "dojo/has", "./Tabs", "../../../kernel"], function(a, d, b, e, c, f) {
    return a([c], {
        _isGxeElementChoice: !0,
        useRadios: !0,
        postCreate: function() {
            this.inherited(arguments);
            b.add(this.domNode, "gxeElementChoice")
        }
    })
});