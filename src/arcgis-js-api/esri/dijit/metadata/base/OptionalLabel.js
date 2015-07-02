//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "./Templated", "dojo/text!./templates/OptionalLabel.html", "../../../kernel"], function(a, d, e, b, c, f) {
    return a([b], {
        checkedAttr: "",
        label: null,
        templateString: c,
        postCreate: function() {
            this.inherited(arguments)
        },
        _onClick: function() {
            this.onClick(this.checkBoxNode.checked)
        },
        onClick: function(a) {}
    })
});