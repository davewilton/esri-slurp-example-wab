//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom-class", "dojo/dom-construct", "dojo/dom-style", "dojo/has", "../../base/etc/docUtil", "dijit/_WidgetBase", "dojo/i18n!../../nls/i18nBase", "dijit/Dialog", "./OkCancelBar", "../../../../kernel"], function(m, b, g, a, n, s, h, p, t, q, r, u) {
    return m([p], {
        title: "",
        okLabel: null,
        cancelIsProminent: !1,
        cancelLabel: null,
        showOk: !0,
        showCancel: !0,
        showOkCancelBar: !0,
        dialog: null,
        messagePane: null,
        iconNode: null,
        messageNode: null,
        okCancelBar: null,
        postCreate: function() {
            this.inherited(arguments)
        },
        hide: function() {
            this.dialog && this.dialog.hide()
        },
        onCancelClick: function(a) {},
        onOkClick: function(a) {},
        show: function(d, k, e) {
            var f = a.create("div", {});
            this.messagePane = a.create("div", {
                "class": "gxePrimaryPane gxeMessagePane"
            }, f);
            this.iconNode = a.create("div", {
                "class": "gxeIcon"
            }, this.messagePane);
            k && g.add(this.iconNode, k);
            this.messageNode = a.create("div", {
                "class": "gxeMessageText"
            }, this.messagePane);
            h.setNodeText(this.messageNode, d);
            e && e.message && (d = a.create("p", {}, this.messagePane), h.setNodeText(d, e.message));
            var l = this.okCancelBar = new r({
                okLabel: this.okLabel,
                cancelIsProminent: this.cancelIsProminent,
                cancelLabel: this.cancelLabel,
                showOk: this.showOk,
                showCancel: this.showCancel,
                onOkClick: b.hitch(this, function(a) {
                    this.dialog && this.dialog.hide();
                    this.onOkClick(a)
                }),
                onCancelClick: b.hitch(this, function(a) {
                    this.dialog && this.dialog.hide();
                    this.onCancelClick(a)
                })
            }, a.create("div", {}, f));
            this.showOkCancelBar || n.set(l.domNode, "display", "none");
            var c = this.dialog = new q({
                "class": "gxeDialog gxePopupDialog",
                title: this.title,
                content: f,
                autofocus: !1
            });
            this.isLeftToRight() || g.add(c.domNode, "gxeRtl");
            this.own(c.on("hide", b.hitch(this, function() {
                setTimeout(b.hitch(this, function() {
                    l.destroyRecursive(!1);
                    c.destroyRecursive(!1);
                    this.destroyRecursive(!1)
                }), 300)
            })));
            return c.show()
        }
    })
});