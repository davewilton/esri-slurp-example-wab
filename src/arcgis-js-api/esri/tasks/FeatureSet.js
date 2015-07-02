//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "../kernel", "../lang", "../graphic", "../SpatialReference", "../graphicsUtils", "../geometry/jsonUtils", "../symbols/jsonUtils"], function(w, x, y, E, F, z, A, B, C, v, D) {
    return w(null, {
        declaredClass: "esri.tasks.FeatureSet",
        constructor: function(a) {
            if (a) {
                x.mixin(this, a);
                var b = this.features,
                    n = a.spatialReference,
                    p = v.getGeometryType(a.geometryType),
                    n = this.spatialReference = new B(n);
                this.geometryType = a.geometryType;
                a.fields && (this.fields = a.fields);
                y.forEach(b,
                    function(a, l) {
                        var q = a.geometry && a.geometry.spatialReference;
                        b[l] = new A(p && a.geometry ? new p(a.geometry) : null, a.symbol && D.fromJson(a.symbol), a.attributes);
                        b[l].geometry && !q && b[l].geometry.setSpatialReference(n)
                    });
                this._hydrate()
            } else this.features = []
        },
        displayFieldName: null,
        geometryType: null,
        spatialReference: null,
        fieldAliases: null,
        toJson: function(a) {
            var b = {};
            this.displayFieldName && (b.displayFieldName = this.displayFieldName);
            this.fields && (b.fields = this.fields);
            this.spatialReference ? b.spatialReference =
                this.spatialReference.toJson() : this.features[0] && this.features[0].geometry && (b.spatialReference = this.features[0].geometry.spatialReference.toJson());
            this.features[0] && (this.features[0].geometry && (b.geometryType = v.getJsonType(this.features[0].geometry)), b.features = C._encodeGraphics(this.features, a));
            b.exceededTransferLimit = this.exceededTransferLimit;
            b.transform = this.transform;
            return z.fixJson(b)
        },
        _hydrate: function() {
            var a = this.transform;
            if (a) {
                var b = this.features,
                    n, p = a.translate[0],
                    s = a.translate[1],
                    l = a.scale[0],
                    q = a.scale[1],
                    u = function(a, b, r) {
                        if ("esriGeometryPoint" === a) return function(a) {
                            a.x = b(a.x);
                            a.y = r(a.y)
                        };
                        if ("esriGeometryPolyline" === a || "esriGeometryPolygon" === a) return function(a) {
                            a = a.rings || a.paths;
                            var h, k, c, e, f, g, m, d;
                            h = 0;
                            for (k = a.length; h < k; h++) {
                                f = a[h];
                                c = 0;
                                for (e = f.length; c < e; c++) g = f[c], 0 < c ? (m += g[0], d += g[1]) : (m = g[0], d = g[1]), g[0] = b(m), g[1] = r(d)
                            }
                        };
                        if ("esriGeometryEnvelope" === a) return function(a) {
                            a.xmin = b(a.xmin);
                            a.ymin = r(a.ymin);
                            a.xmax = b(a.xmax);
                            a.ymax = r(a.ymax)
                        };
                        if ("esriGeometryMultipoint" ===
                            a) return function(a) {
                            a = a.points;
                            var h, k, c, e, f;
                            h = 0;
                            for (k = a.length; h < k; h++) c = a[h], 0 < h ? (e += c[0], f += c[1]) : (e = c[0], f = c[1]), c[0] = b(e), c[1] = r(f)
                        }
                    }(this.geometryType, function(a) {
                        return a * l + p
                    }, function(a) {
                        return s - a * q
                    }),
                    a = 0;
                for (n = b.length; a < n; a++) b[a].geometry && u(b[a].geometry);
                this.transform = null
            }
        },
        quantize: function(a) {
            var b = a.translate[0],
                n = a.translate[1],
                p = a.scale[0],
                s = a.scale[1],
                l = this.features,
                q = function(a, b, h) {
                    var k, c, e, f, g, m, d = [];
                    k = 0;
                    for (c = a.length; k < c; k++)
                        if (e = a[k], 0 < k) {
                            if (m = b(e[0]), e = h(e[1]), m !==
                                f || e !== g) d.push([m - f, e - g]), f = m, g = e
                        } else f = b(e[0]), g = h(e[1]), d.push([f, g]);
                    return 0 < d.length ? d : null
                },
                u = function(a, b, h) {
                    if ("esriGeometryPoint" === a) return function(a) {
                        a.x = b(a.x);
                        a.y = h(a.y);
                        return a
                    };
                    if ("esriGeometryPolyline" === a || "esriGeometryPolygon" === a) return function(a) {
                        var c, e, f, g, d;
                        f = a.rings || a.paths;
                        d = [];
                        c = 0;
                        for (e = f.length; c < e; c++) g = f[c], (g = q(g, b, h)) && d.push(g);
                        return 0 < d.length ? (a.rings ? a.rings = d : a.paths = d, a) : null
                    };
                    if ("esriGeometryMultipoint" === a) return function(a) {
                        var c;
                        c = q(a.points, b, h);
                        return 0 <
                            c.length ? (a.points = c, a) : null
                    };
                    if ("esriGeometryEnvelope" === a) return function(a) {
                        return a
                    }
                }(this.geometryType, function(a) {
                    return Math.round((a - b) / p)
                }, function(a) {
                    return Math.round((n - a) / s)
                }),
                d, t;
            d = 0;
            for (t = l.length; d < t; d++) u(l[d].geometry) || (l.splice(d, 1), d--, t--);
            this.transform = a;
            return this
        }
    })
});