//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom-class", "dojo/dom-construct", "dojo/has", "dijit/_WidgetBase", "dojo/i18n!../../nls/i18nBase", "dijit/Dialog", "./OkCancelBar", "./LoadDocumentPane", "../../../../kernel"], function(d, a, g, c, p, h, k, l, m, n, q) {
    return d([h], {
        dialog: null,
        dialogTitle: k.editor.load.dialogTitle,
        editor: null,
        okCancelBar: null,
        prompt: null,
        postCreate: function() {
            this.inherited(arguments)
        },
        onSelect: function(a, c, f, b) {},
        onSelectPullItem: function(a) {},
        show: function() {
            var e = c.create("div", {}),
                d = new n({
                    editor: this.editor,
                    dialogBroker: this,
                    prompt: this.prompt,
                    onSelect: a.hitch(this, function(a, b, c) {
                        if (this.dialog) this.onSelect(this.dialog, a, b, c)
                    }),
                    onSelectPullItem: a.hitch(this, function() {
                        if (this.dialog) this.onSelectPullItem(this.dialog)
                    })
                }, c.create("div", {}, e)),
                f = this.okCancelBar = new m({
                    showOk: !1,
                    onCancelClick: a.hitch(this, function() {
                        this.dialog && this.dialog.hide()
                    })
                }, c.create("div", {}, e)),
                b = this.dialog = new l({
                    "class": "gxeDialog  gxePopupDialog",
                    title: this.dialogTitle,
                    content: e,
                    autofocus: !1
                });
            this.isLeftToRight() || g.add(b.domNode,
                "gxeRtl");
            this.own(b.on("hide", a.hitch(this, function() {
                setTimeout(a.hitch(this, function() {
                    d.destroyRecursive(!1);
                    f.destroyRecursive(!1);
                    b.destroyRecursive(!1);
                    this.destroyRecursive(!1)
                }), 300)
            })));
            b.show()
        }
    })
});