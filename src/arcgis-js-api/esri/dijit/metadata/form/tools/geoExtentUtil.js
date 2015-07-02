//>>built
define(["dojo/_base/lang", "dojo/_base/array", "dojo/number", "dojo/has", "dojo/_base/Color", "../../../../graphic", "../../../../SpatialReference", "../../../../geometry/Extent", "../../../../symbols/SimpleFillSymbol", "../../../../symbols/SimpleLineSymbol", "../../../../kernel"], function(p, q, k, r, f, l, m, n, g, h, s) {
    return {
        addGraphic: function(a, b, d) {
            if (a && b) {
                var c = new h(h.STYLE_SOLID, new f([255, 0, 0]), 2),
                    c = new g(g.STYLE_SOLID, c, new f([0, 0, 0, 0]));
                d && a.graphics.clear();
                a.graphics.add(new l(b, c))
            }
        },
        checkNumber: function(a) {
            var b =
                typeof a;
            if ("undefined" === b && null === a) return null;
            if ("string" === b) {
                a = parseFloat(a);
                if (isNaN(a)) return null;
                b = typeof a
            }
            return "number" === b ? !isFinite(a) ? null : a : null
        },
        formatCoordinate: function(a) {
            for (a = k.format(a, {
                    places: 4
                }); - 1 !== a.indexOf("0", a.length - 1);) a = a.substring(0, a.length - 1); - 1 !== a.indexOf(".", a.length - 1) && (a = a.substring(0, a.length - 1));
            return a
        },
        makeGeographicExtent: function(a, b, d, c) {
            var e;
            a = this.checkNumber(a);
            b = this.checkNumber(b);
            d = this.checkNumber(d);
            c = this.checkNumber(c);
            if (null === a || null ===
                d || null === b || null === c) return null; - 85 > b && (b = -85);
            85 < c && (c = 85);
            d < a && (e = d, d = a, a = e);
            c < b && (e = c, c = b, b = e);
            try {
                return new n(a, b, d, c, new m({
                    wkid: 4326
                }))
            } catch (f) {}
            return null
        }
    }
});