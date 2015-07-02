//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../base/Templated", "../base/OptionsMixin", "dojo/text!./templates/Options.html", "../../../kernel"], function(a, e, f, b, c, d, g) {
    return a([b, c], {
        _isGxeOptions: !0,
        templateString: d,
        postCreate: function() {
            this.inherited(arguments)
        },
        fetchOptionWidgets: function() {
            return this.inherited(arguments)
        }
    })
});