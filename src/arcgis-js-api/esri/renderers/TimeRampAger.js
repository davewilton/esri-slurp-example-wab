//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/Color", "dojo/has", "../kernel", "../symbols/jsonUtils", "../Color", "./SymbolAger"], function(n, s, p, t, u, q, m, r) {
    return n(r, {
        declaredClass: "esri.renderer.TimeRampAger",
        constructor: function(e, k, a) {
            this.colorRange = e;
            this.sizeRange = k;
            this.alphaRange = a
        },
        getAgedSymbol: function(e, k) {
            var a = k.getLayer(),
                c = k.attributes;
            e = q.fromJson(e.toJson());
            var b = a._map.timeExtent,
                d = b.startTime,
                b = b.endTime;
            if (!d || !b) return e;
            d = d.getTime();
            b = b.getTime();
            a = new Date(c[a._startTimeField]);
            a = a.getTime();
            a < d && (a = d);
            d = b === d ? 1 : (a - d) / (b - d);
            if (a = this.sizeRange) c = a[0], b = a[1], a = Math.abs(b - c) * d, this._setSymbolSize(e, c < b ? c + a : c - a);
            if (a = this.colorRange) {
                var b = a[0],
                    g = a[1],
                    l = Math.round,
                    c = new p,
                    f = b.r,
                    h = g.r,
                    a = Math.abs(h - f) * d;
                c.r = l(f < h ? f + a : f - a);
                f = b.g;
                h = g.g;
                a = Math.abs(h - f) * d;
                c.g = l(f < h ? f + a : f - a);
                f = b.b;
                h = g.b;
                a = Math.abs(h - f) * d;
                c.b = l(f < h ? f + a : f - a);
                b = b.a;
                g = g.a;
                a = Math.abs(g - b) * d;
                c.a = b < g ? b + a : b - a;
                e.setColor(c)
            }
            c = e.color;
            if ((a = this.alphaRange) && c) b = a[0], g = a[1], a = Math.abs(g - b) * d, c.a = b < g ? b + a : b - a;
            return e
        },
        toJson: function() {
            var e = {};
            this.sizeRange && (e.sizeRange = this.sizeRange);
            this.colorRange && (e.colorRange = [m.toJsonColor(this.colorRange[0]), m.toJsonColor(this.colorRange[1])]);
            this.alphaRange && (e.alphaRange = [Math.round(255 * this.alphaRange[0]), Math.round(255 * this.alphaRange[1])]);
            return e
        }
    })
});