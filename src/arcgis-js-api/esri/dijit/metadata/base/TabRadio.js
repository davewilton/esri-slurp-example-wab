//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom-attr", "dojo/has", "./TabButton", "dojo/text!./templates/TabRadio.html", "../../../kernel"], function(a, e, b, f, c, d, g) {
    return a([c], {
        checkedAttr: "",
        radioName: null,
        templateString: d,
        postCreate: function() {
            this.inherited(arguments)
        },
        setChecked: function(a) {
            b.set(this.radioNode, "checked", a)
        }
    })
});