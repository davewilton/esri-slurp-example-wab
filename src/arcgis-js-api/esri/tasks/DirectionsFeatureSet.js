//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "../kernel", "../geometry/Extent", "../geometry/Polyline", "./FeatureSet"], function(n, p, f, s, t, q, m, r) {
    return n(r, {
        declaredClass: "esri.tasks.DirectionsFeatureSet",
        constructor: function(c, h) {
            this.routeId = c.routeId;
            this.routeName = c.routeName;
            p.mixin(this, c.summary);
            this.extent = new q(this.envelope);
            var b = this._fromCompressedGeometry,
                g = this.features,
                d = this.extent.spatialReference,
                a = [];
            f.forEach(h, function(c, e) {
                g[e].setGeometry(a[e] = b(c,
                    d))
            });
            this.strings = c.strings;
            this.mergedGeometry = this._mergePolylinesToSinglePath(a, d);
            this.geometryType = "esriGeometryPolyline";
            delete this.envelope
        },
        _fromCompressedGeometry: function(c, h) {
            var b = 0,
                g = 0,
                d = [],
                a, f, e, l;
            e = c.match(/((\+|\-)[^\+\-]+)/g);
            l = parseInt(e[0], 32);
            for (var k = 1; k < e.length; k += 2) b = a = parseInt(e[k], 32) + b, g = f = parseInt(e[k + 1], 32) + g, d.push([a / l, f / l]);
            b = new m({
                paths: [d]
            });
            b.setSpatialReference(h);
            return b
        },
        _mergePolylinesToSinglePath: function(c, h) {
            var b = [];
            f.forEach(c, function(a) {
                f.forEach(a.paths,
                    function(a) {
                        b = b.concat(a)
                    })
            });
            var g = [],
                d = [0, 0];
            f.forEach(b, function(a) {
                if (a[0] !== d[0] || a[1] !== d[1]) g.push(a), d = a
            });
            return (new m({
                paths: [g]
            })).setSpatialReference(h)
        }
    })
});