//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/aspect", "dojo/dom-class", "dojo/dom-construct", "dojo/has", "dijit/_WidgetBase", "dojo/i18n!../../nls/i18nBase", "dijit/Dialog", "./GeoExtent", "../../../../kernel"], function(d, c, m, e, f, n, p, g, h, k, l, q) {
    return d([g], {
        dialog: null,
        title: h.geoExtent.title,
        gxeDocument: null,
        xmin: null,
        ymin: null,
        xmax: null,
        ymax: null,
        postCreate: function() {
            this.inherited(arguments)
        },
        onChange: function(a) {},
        show: function() {
            var a = null,
                b = new l({
                    dialogBroker: this,
                    gxeDocument: this.gxeDocument,
                    xmin: this.xmin,
                    ymin: this.ymin,
                    xmax: this.xmax,
                    ymax: this.ymax,
                    onOkClick: c.hitch(this, function(b) {
                        if (b) this.onChange(b);
                        a && a.hide()
                    }),
                    onCancelClick: c.hitch(this, function() {
                        a && a.hide()
                    })
                }),
                a = this.dialog = new k({
                    "class": "gxeDialog gxePopupDialog",
                    title: this.title,
                    content: b,
                    autofocus: !1
                });
            this.isLeftToRight() || f.add(a.domNode, "gxeRtl");
            this.own(e.after(a, "_position", function() {
                b._map && b._map.reposition()
            }, !0));
            this.own(a.on("hide", c.hitch(this, function() {
                setTimeout(c.hitch(this, function() {
                    b.destroyRecursive(!1);
                    a.destroyRecursive(!1);
                    this.destroyRecursive(!1)
                }), 300)
            })));
            a.show().then(function() {
                b.initialize()
            })
        }
    })
});