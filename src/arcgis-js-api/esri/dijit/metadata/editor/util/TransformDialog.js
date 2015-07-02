//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom-class", "dojo/dom-construct", "dojo/has", "dijit/_WidgetBase", "dojo/i18n!../../nls/i18nBase", "dijit/Dialog", "./OkCancelBar", "./TransformPane", "../../../../kernel"], function(d, a, g, b, n, e, h, k, l, m, p) {
    return d([e], {
        dialog: null,
        dialogTitle: h.editor.transform.dialogTitle,
        documentTypes: null,
        editor: null,
        okCancelBar: null,
        prompt: null,
        postCreate: function() {
            this.inherited(arguments)
        },
        onSelect: function(a, b) {},
        show: function() {
            var f = b.create("div", {}),
                d = new m({
                    editor: this.editor,
                    dialogBroker: this,
                    documentTypes: this.documentTypes,
                    prompt: this.prompt,
                    onSelect: a.hitch(this, function(a, b, c) {
                        if (this.dialog) this.onSelect(this.dialog, a, b, c)
                    })
                }, b.create("div", {}, f)),
                e = this.okCancelBar = new l({
                    showOk: !1,
                    onCancelClick: a.hitch(this, function() {
                        this.dialog && this.dialog.hide()
                    })
                }, b.create("div", {}, f)),
                c = this.dialog = new k({
                    "class": "gxeDialog  gxePopupDialog",
                    title: this.dialogTitle,
                    content: f,
                    autofocus: !1
                });
            this.isLeftToRight() || g.add(c.domNode, "gxeRtl");
            this.own(c.on("hide", a.hitch(this, function() {
                setTimeout(a.hitch(this,
                    function() {
                        d.destroyRecursive(!1);
                        e.destroyRecursive(!1);
                        c.destroyRecursive(!1);
                        this.destroyRecursive(!1)
                    }), 300)
            })));
            c.show()
        }
    })
});