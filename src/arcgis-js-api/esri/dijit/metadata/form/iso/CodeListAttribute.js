//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../Attribute", "../../../../kernel"], function(a, c, d, b, e) {
    return a([b], {
        fixed: !0,
        hide: !0,
        minOccurs: 1,
        showHeader: !1,
        target: "codeList",
        postCreate: function() {
            this.inherited(arguments)
        }
    })
});