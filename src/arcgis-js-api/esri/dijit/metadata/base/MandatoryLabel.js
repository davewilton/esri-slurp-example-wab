//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "./Templated", "dojo/text!./templates/MandatoryLabel.html", "../../../kernel"], function(a, d, e, b, c, f) {
    return a([b], {
        label: null,
        templateString: c,
        postCreate: function() {
            this.inherited(arguments)
        }
    })
});