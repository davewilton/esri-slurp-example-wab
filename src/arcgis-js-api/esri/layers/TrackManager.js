//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "../kernel", "../graphic", "../geometry/Polyline", "./GraphicsLayer"], function(m, r, d, s, t, n, p, q) {
    return m(null, {
        declaredClass: "esri.layers._TrackManager",
        constructor: function(a) {
            this.layer = a;
            this.trackMap = {};
            this.trackLineMap = {}
        },
        initialize: function(a) {
            this.map = a;
            var c = this.layer,
                b = c._getRenderer(),
                b = b && b.trackRenderer;
            if ("esriGeometryPoint" === c.geometryType) {
                var e = this.container = new q._GraphicsLayer({
                    id: c.id + "_tracks",
                    _child: !0
                });
                e.loaded = !0;
                e.onLoad(e);
                e._setMap(a, c._div);
                e.setRenderer(b)
            }
        },
        addFeatures: function(a) {
            var c = this.trackMap,
                b = this.layer,
                e = b._trackIdField,
                f = [];
            d.forEach(a, function(a) {
                var b = a.attributes[e];
                (c[b] = c[b] || []).push(a); - 1 === d.indexOf(f, b) && f.push(b)
            });
            var g = b._startTimeField,
                k = b.objectIdField,
                h = function(b, a) {
                    var c = b.attributes[g],
                        f = a.attributes[g];
                    return c === f ? b.attributes[k] < a.attributes[k] ? -1 : 1 : c < f ? -1 : 1
                };
            d.forEach(f, function(b) {
                c[b].sort(h)
            })
        },
        trimTracks: function(a) {
            function c(a) {
                for (a = b[a] || []; a.length >
                    e;) f.push(a.shift())
            }
            var b = this.trackMap,
                e = this.layer.maximumTrackPoints || 0,
                f = [],
                g;
            if (!e) return f;
            if (a) d.forEach(a, function(a) {
                c(a)
            });
            else
                for (g in b) b.hasOwnProperty(g) && c(g);
            return f
        },
        drawTracks: function(a) {
            function c(a) {
                var c = f[a],
                    h, d, l;
                d = b.trackLineMap[a];
                e.remove(d);
                delete b.trackLineMap[a];
                if (!c || 2 > c.length) return !1;
                d = [];
                for (h = c.length - 1; 0 <= h; h--)(l = c[h].geometry) && d.push([l.x, l.y]);
                c = {};
                c[k] = a;
                1 < d.length && (d = new n(new p({
                    paths: [d],
                    spatialReference: g
                }), null, c), e.add(d), b.trackLineMap[a] = d)
            }
            var b = this,
                e = this.container,
                f, g, k, h;
            if (e)
                if (f = this.trackMap, g = this.map.spatialReference, k = this.layer._trackIdField, a) d.forEach(a, function(a) {
                    c(a)
                });
                else
                    for (h in f) f.hasOwnProperty(h) && c(h)
        },
        refreshTracks: function(a) {
            function c(a) {
                var c, d;
                b.drawTracks([a]);
                if (g && g.latestObservationRenderer) {
                    a = e[a] || [];
                    c = a.length;
                    for (d = 0; d < c; d++) f._repaint(a[d], null, !0)
                }
            }
            var b = this,
                e = this.trackMap,
                f = this.layer,
                g = f._getRenderer(),
                k;
            if (a) d.forEach(a, function(a) {
                c(a)
            });
            else
                for (k in e) e.hasOwnProperty(k) && c(k);
            this.moveLatestToFront()
        },
        moveLatestToFront: function(a) {
            d.forEach(this.getLatestObservations(a), function(a) {
                var b = a._shape;
                b && b._moveToFront();
                this._repaint(a, null, !0)
            }, this.layer)
        },
        getLatestObservations: function(a) {
            function c(a) {
                a = f[a];
                return a[a.length - 1]
            }
            var b = [],
                e = this.layer._getRenderer(),
                f = this.trackMap,
                g;
            if (!e.latestObservationRenderer) return b;
            if (a) d.forEach(a, function(a) {
                b.push(c(a))
            });
            else
                for (g in f) f.hasOwnProperty(g) && b.push(c(g));
            return b
        },
        clearTracks: function(a) {
            var c = this.getLatestObservations(a),
                b = this.container,
                e;
            a ? d.forEach(a, function(a) {
                delete this.trackMap[a];
                b && (e = this.trackLineMap[a], b.remove(e), delete this.trackLineMap[a])
            }, this) : (this.trackMap = {}, this.trackLineMap = {}, b && b.clear());
            d.forEach(c, function(a) {
                this._repaint(a, null, !0)
            }, this.layer)
        },
        isLatestObservation: function(a) {
            var c = this.trackMap[a.attributes[this.layer._trackIdField]];
            return c ? c[c.length - 1] === a : !1
        },
        destroy: function() {
            var a = this.container;
            a && (a.clear(), a._unsetMap(this.map, this.layer._div));
            this.map = this.layer = this.trackMap = this.container =
                null
        }
    })
});