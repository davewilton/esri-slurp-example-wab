//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom-attr", "dojo/has", "./Templated", "dojo/text!./templates/TabButton.html", "../../../kernel"], function(b, e, f, g, c, d, h) {
    return b([c], {
        label: null,
        templateString: d,
        postCreate: function() {
            this.inherited(arguments)
        },
        _onClick: function() {
            this.onClick(this)
        },
        onClick: function(a) {},
        setLabel: function(a) {
            "undefined" === typeof a && (a = null);
            this.label = a;
            this.setI18nNodeText(this.labelNode, a)
        }
    })
});