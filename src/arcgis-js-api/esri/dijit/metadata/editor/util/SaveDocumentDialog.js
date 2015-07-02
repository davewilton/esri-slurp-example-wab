//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom-class", "dojo/dom-construct", "dojo/has", "dijit/_WidgetBase", "dojo/i18n!../../nls/i18nBase", "dijit/Dialog", "./SaveDocumentPane", "../../../../kernel"], function(c, a, f, d, m, g, h, k, l, n) {
    return c([g], {
        dialog: null,
        dialogTitle: h.editor.save.dialogTitle,
        editor: null,
        gxeDocument: null,
        postCreate: function() {
            this.inherited(arguments)
        },
        hide: function() {
            this.dialog && this.dialog.hide()
        },
        onSave: function(a, d, b) {},
        show: function() {
            var e = d.create("div", {}),
                c = new l({
                    dialogBroker: this,
                    editor: this.editor,
                    gxeDocument: this.gxeDocument,
                    onCancel: a.hitch(this, function() {
                        this.dialog && this.dialog.hide()
                    }),
                    onSave: a.hitch(this, function(a, b) {
                        if (this.dialog) this.onSave(this.dialog, a, b)
                    })
                }, d.create("div", {}, e)),
                b = this.dialog = new k({
                    "class": "gxeDialog  gxePopupDialog",
                    title: this.dialogTitle,
                    content: e,
                    autofocus: !1
                });
            this.isLeftToRight() || f.add(b.domNode, "gxeRtl");
            this.own(b.on("hide", a.hitch(this, function() {
                setTimeout(a.hitch(this, function() {
                        c.destroyRecursive(!1);
                        b.destroyRecursive(!1);
                        this.destroyRecursive(!1)
                    }),
                    300)
            })));
            b.show()
        }
    })
});