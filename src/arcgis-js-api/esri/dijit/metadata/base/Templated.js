//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom-style", "dojo/has", "./etc/docUtil", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dojo/i18n!../nls/i18nBase", "../../../kernel"], function(d, l, e, m, c, f, g, h, k, n) {
    return d([f, g, h], {
        _destroyWasCalled: !1,
        i18nBase: k,
        templateString: "\x3cdiv data-dojo-attach-point\x3d'containerNode'\x3e\x3c/div\x3e",
        hide: !1,
        postCreate: function() {
            this.inherited(arguments);
            this.hide && e.set(this.domNode, "display", "none")
        },
        destroy: function() {
            this._destroyWasCalled = !0;
            this.inherited(arguments)
        },
        setI18nNodeText: function(a, b) {
            c.setI18nNodeText(a, b)
        },
        setNodeText: function(a, b) {
            c.setNodeText(a, b)
        }
    })
});