//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/dom-class", "dojo/dom-construct", "dojo/has", "dijit/_WidgetBase", "dojo/i18n!../../nls/i18nBase", "dojo/i18n!../../nls/i18nFgdc", "../../base/etc/docUtil", "../IsoTopicCategoryOptions", "dijit/Dialog", "../../editor/util/OkCancelBar", "../../../../kernel"], function(k, d, g, l, e, t, m, u, n, p, q, r, s, v) {
    return k([m], {
        checkBoxes: null,
        dialogTitle: n.idinfo.keywords.themektIsoTopicDialog,
        values: null,
        postCreate: function() {
            this.inherited(arguments);
            this.checkBoxes = []
        },
        onChange: function(b) {},
        show: function() {
            var b = new q;
            b.fetchOptionWidgets().then(d.hitch(this, function(c) {
                this._showDialog(b, c)
            }))
        },
        _addOption: function(b, c, a) {
            c = this.id + "_chk" + c;
            var f = e.create("div", {
                "class": "gxeOption"
            }, a);
            a = b.label;
            var d = b.value;
            b = g.some(this.values, function(a) {
                if (a === d) return !0
            });
            var h = {
                id: c,
                type: "checkbox",
                value: d
            };
            b && (h.checked = "checked");
            b = e.create("input", h, f);
            this.checkBoxes.push(b);
            c = e.create("label", {
                "for": c
            }, f);
            p.setNodeText(c, a)
        },
        _applySelections: function(b) {
            var c = [];
            g.forEach(this.checkBoxes,
                function(a) {
                    a.checked && c.push(a.value)
                });
            this.onChange(c);
            b.hide()
        },
        _showDialog: function(b, c) {
            var a = null,
                f = e.create("div", {}),
                k = e.create("div", {
                    "class": "gxeOptions"
                }, f);
            g.forEach(c, function(a, b) {
                this._addOption(a, b, k)
            }, this);
            var h = new s({
                    onOkClick: d.hitch(this, function() {
                        a && this._applySelections(a)
                    }),
                    onCancelClick: d.hitch(this, function() {
                        a && a.hide()
                    })
                }, e.create("div", {}, f)),
                a = new r({
                    "class": "gxeDialog gxePopupDialog gxeIsoTopicDialog",
                    title: this.dialogTitle,
                    content: f
                });
            this.isLeftToRight() || l.add(a.domNode,
                "gxeRtl");
            this.own(a.on("hide", d.hitch(this, function() {
                setTimeout(d.hitch(this, function() {
                    try {
                        b.destroyRecursive(!1), g.forEach(c, function(a) {
                            try {
                                a.destroyRecursive(!1)
                            } catch (b) {
                                console.error(b)
                            }
                        })
                    } catch (d) {
                        console.error(d)
                    }
                    h.destroyRecursive(!1);
                    a.destroyRecursive(!1);
                    this.destroyRecursive(!1)
                }), 300)
            })));
            a.show()
        }
    })
});