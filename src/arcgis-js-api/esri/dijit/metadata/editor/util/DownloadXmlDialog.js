//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/aspect", "dojo/dom-class", "dojo/dom-construct", "dojo/has", "dijit/_WidgetBase", "dojo/i18n!../../nls/i18nBase", "dijit/Dialog", "./OkCancelBar", "../../base/etc/docUtil", "../../../../kernel"], function(e, a, l, m, b, u, f, k, n, p, q, v) {
    return e([f], {
        dialog: null,
        dialogTitle: k.editor.download.dialogTitle,
        postCreate: function() {
            this.inherited(arguments)
        },
        show: function(e, f) {
            var r = f + ".xml",
                s = new Blob([e], {
                    type: "text/xml"
                }),
                g = b.create("div", {}),
                c = b.create("div", {
                        "class": "gxePrimaryPane gxeDownloadPane"
                    },
                    g),
                h = b.create("a", {
                    "class": "gxeClickableText gxeBold gxeLine",
                    onclick: a.hitch(this, function() {
                        this.dialog && this.dialog.hide()
                    })
                }, c);
            q.setNodeText(h, k.editor.download.prompt);
            c = new FileReader;
            this.own(l.after(c, "onload", a.hitch(this, function(a) {
                var b = null;
                a && (a.target && a.target.result) && (b = a.target.result, h.href = b, h.download = r)
            }), !0));
            c.readAsDataURL(s);
            var t = new p({
                    showOk: !1,
                    onCancelClick: a.hitch(this, function() {
                        this.dialog && this.dialog.hide()
                    })
                }, b.create("div", {}, g)),
                d = this.dialog = new n({
                    "class": "gxeDialog  gxePopupDialog",
                    title: this.dialogTitle,
                    content: g
                });
            this.isLeftToRight() || m.add(d.domNode, "gxeRtl");
            this.own(d.on("hide", a.hitch(this, function() {
                setTimeout(a.hitch(this, function() {
                    t.destroyRecursive(!1);
                    d.destroyRecursive(!1);
                    this.destroyRecursive(!1)
                }), 300)
            })));
            d.show()
        }
    })
});