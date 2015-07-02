//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom-class", "dojo/has", "dijit/_WidgetBase", "dojo/i18n!../../../nls/i18nBase", "dojo/i18n!../../../nls/i18nIso", "dijit/Dialog", "./ThemePane", "../../../../../kernel"], function(d, b, e, l, f, m, g, h, k, n) {
    return d([f], {
        dialog: null,
        gxeDocument: null,
        initiallySelectedValues: null,
        title: g.gemet.theme.dialogTitle,
        postCreate: function() {
            this.inherited(arguments)
        },
        onSelect: function(a) {},
        show: function() {
            var a = null,
                c = new k({
                    dialogBroker: this,
                    gxeDocument: this.gxeDocument,
                    initiallySelectedValues: this.initiallySelectedValues,
                    onOkClick: b.hitch(this, function(b) {
                        if (b) this.onSelect(b);
                        a && a.hide()
                    }),
                    onCancelClick: b.hitch(this, function() {
                        a && a.hide()
                    })
                }),
                a = this.dialog = new h({
                    "class": "gxeDialog gxePopupDialog gxeGemetDialog",
                    title: this.title,
                    content: c,
                    autofocus: !1
                });
            this.isLeftToRight() || e.add(a.domNode, "gxeRtl");
            this.own(a.on("hide", b.hitch(this, function() {
                setTimeout(b.hitch(this, function() {
                    c.destroyRecursive(!1);
                    a.destroyRecursive(!1);
                    this.destroyRecursive(!1)
                }), 300)
            })));
            a.show()
        }
    })
});