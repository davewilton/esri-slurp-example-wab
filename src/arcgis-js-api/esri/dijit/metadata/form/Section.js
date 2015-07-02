//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom-attr", "dojo/dom-class", "dojo/dom-construct", "dojo/has", "../base/Templated", "dojo/text!./templates/Section.html", "../../../kernel"], function(b, g, h, c, d, k, e, f, l) {
    return b([e], {
        templateString: f,
        label: null,
        showHeader: !0,
        postCreate: function() {
            this.inherited(arguments)
        },
        startup: function() {
            this._started || (this.initializeSection(), this.inherited(arguments))
        },
        getLabelString: function() {
            var a = this.label;
            return "undefined" !== typeof a && null != a ? a : null
        },
        initializeSection: function() {
            var a =
                this.getLabelString();
            this.showHeader ? this.setLabel(a) : this.headerNode && (d.destroy(this.headerNode), this.labelNode = this.headerNode = null)
        },
        setLabel: function(a) {
            this.labelNode && ("undefined" === typeof a && (a = null), this.label = a, this.setI18nNodeText(this.labelNode, a), null !== a && c.add(this.domNode, "gxeIndent"))
        }
    })
});