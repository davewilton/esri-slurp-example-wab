//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom-style", "dojo/has", "../kernel", "../domUtils", "../geometry/Extent"], function(e, f, g, k, l, d, h) {
    return e(null, {
        declaredClass: "esri.layers.MapImage",
        constructor: function(a) {
            f.mixin(this, a);
            this.extent = new h(this.extent)
        },
        visible: !0,
        opacity: 1,
        getLayer: function() {
            return this._layer
        },
        getNode: function() {
            return this._node
        },
        show: function() {
            if (!this.visible) {
                this.visible = !0;
                var a = this._node,
                    b = this._layer,
                    c;
                if (a) {
                    if (c = b && b._div) b.suspended || b._setPos(a, c._left,
                        c._top), (b._active || c).appendChild(a);
                    d.show(a)
                }
            }
        },
        hide: function() {
            if (this.visible) {
                this.visible = !1;
                var a = this._node;
                a && (d.hide(a), a.parentNode && a.parentNode.removeChild(a))
            }
        },
        setOpacity: function(a) {
            var b = this._node;
            this.opacity = a;
            b && g.set(b, "opacity", a)
        }
    })
});