//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../base/Templated", "dojo/text!./templates/Option.html", "../../../kernel"], function(a, d, e, b, c, f) {
    return a([b], {
        _isGxeOption: !0,
        templateString: c,
        label: null,
        value: null,
        selected: !1,
        postCreate: function() {
            this.inherited(arguments)
        }
    })
});