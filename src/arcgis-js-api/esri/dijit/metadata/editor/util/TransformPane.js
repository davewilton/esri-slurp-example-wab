//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/dom-construct", "dojo/has", "../../base/Templated", "dojo/text!./templates/TransformPane.html", "dojo/i18n!../../nls/i18nBase", "../../../../kernel"], function(d, e, f, c, k, g, h, l, m) {
    return d([g], {
        editor: null,
        dialogBroker: null,
        documentTypes: null,
        prompt: null,
        templateString: h,
        postCreate: function() {
            this.inherited(arguments);
            this._initialize()
        },
        onSelect: function(a) {},
        _addDocType: function(a) {
            var b = c.create("div", {}, this.typesNode),
                b = c.create("div", {
                    "class": "gxeClickableText gxeLine",
                    onclick: e.hitch(this, function() {
                        this._selectDocType(a)
                    })
                }, b);
            this.setI18nNodeText(b, a.caption)
        },
        _initialize: function() {
            null !== this.prompt && (this.setI18nNodeText(this.promptNode, this.prompt), this.promptNode.style.display = "");
            f.forEach(this.documentTypes, function(a) {
                this._addDocType(a)
            }, this)
        },
        _selectDocType: function(a) {
            this.onSelect(a)
        }
    })
});