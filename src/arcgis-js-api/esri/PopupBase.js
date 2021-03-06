//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/Color", "dojo/_base/Deferred", "dojo/has", "./kernel", "./graphic", "./geometry/Point", "./geometry/jsonUtils", "./geometry/mathUtils", "./geometry/webMercatorUtils", "./symbols/SimpleMarkerSymbol", "./symbols/SimpleLineSymbol", "./symbols/CartographicLineSymbol", "./symbols/SimpleFillSymbol", "./tasks/query", "./Evented", "require"], function(v, n, d, p, w, E, F, x, y, z, A, s, t, q, r, u, B, C) {
    function D(a) {
        return "sizeInfo" === a.type
    }
    return v(C, {
        declaredClass: "esri.PopupBase",
        _featureLayers: {},
        _updateEndHandles: [],
        _evtMap: {
            "set-features": !0,
            "clear-features": !0,
            "selection-change": !0,
            "dfd-complete": !0
        },
        onSetFeatures: function() {},
        onClearFeatures: function() {},
        onSelectionChange: function() {},
        onDfdComplete: function() {},
        initialize: function() {
            this.count = 0;
            this.selectedIndex = -1;
            this.on("clear-features", n.hitch(this, this._resetUpdateEndListeners));
            this.on("dfd-complete", n.hitch(this, this._processFeatures));
            this.on("set-features", n.hitch(this, this._processFeatures))
        },
        cleanup: function() {
            this.features =
                this.deferreds = null;
            this._resetUpdateEndListeners()
        },
        setFeatures: function(a) {
            if (a && a.length) {
                this.clearFeatures();
                var b, c;
                a[0] instanceof w ? c = a : b = a;
                b ? this._updateFeatures(null, b) : (this.deferreds = c, c = c.slice(0), d.forEach(c, function(a) {
                    a.addBoth(n.hitch(this, this._updateFeatures, a))
                }, this))
            }
        },
        clearFeatures: function() {
            this.features = this.deferreds = this._marked = null;
            this.count = 0;
            var a = this.selectedIndex;
            this.selectedIndex = -1;
            if (-1 < a) this.onSelectionChange();
            this.onClearFeatures()
        },
        getSelectedFeature: function() {
            var a =
                this.features;
            if (a) return a[this.selectedIndex]
        },
        select: function(a) {
            0 > a || a >= this.count || (this.selectedIndex = a, this.onSelectionChange())
        },
        enableHighlight: function(a) {
            this._highlighted = a.graphics.add(new x(new y(0, 0, a.spatialReference)));
            this._highlighted.hide();
            this.markerSymbol || (a = this.markerSymbol = new t, a.setStyle(t.STYLE_TARGET), a._setDim(16, 16, 0), a.setOutline(new r(q.STYLE_SOLID, new p([0, 255, 255]), 2, r.CAP_ROUND, r.JOIN_ROUND)), a.setColor(new p([0, 0, 0, 0])));
            this.lineSymbol || (this.lineSymbol = new q(q.STYLE_SOLID,
                new p([0, 255, 255]), 2));
            this.fillSymbol || (this.fillSymbol = new u(u.STYLE_NULL, new q(q.STYLE_SOLID, new p([0, 255, 255]), 2), new p([0, 0, 0, 0])))
        },
        disableHighlight: function(a) {
            var b = this._highlighted;
            b && (b.hide(), a.graphics.remove(b), delete this._highlighted);
            this.markerSymbol = this.lineSymbol = this.fillSymbol = null
        },
        showHighlight: function() {
            var a = this.features && this.features[this.selectedIndex];
            this._highlighted && (a && a.geometry) && this._highlighted.show()
        },
        hideHighlight: function() {
            this._highlighted && this._highlighted.hide()
        },
        updateHighlight: function(a, b) {
            var c = b.geometry,
                f = this._highlighted;
            if (!c || !f) f && f.hide();
            else {
                f.hide();
                !f._graphicsLayer && a && a.graphics.add(f);
                f.setGeometry(z.fromJson(c.toJson()));
                var e;
                switch (c.type) {
                    case "point":
                    case "multipoint":
                        e = this.markerSymbol;
                        e.setOffset(0, 0);
                        e.setAngle(0);
                        var g = b.getLayer();
                        if (g) {
                            var c = g._getSymbol(b),
                                l, h, d = 0,
                                m = 0,
                                k = 0;
                            if (c) {
                                g = !b.symbol ? g._getRenderer(b) : null;
                                if (d = this._getSizeInfo(g)) l = h = g.getSize(b, {
                                    sizeInfo: d,
                                    shape: c.style,
                                    resolution: a && a.getResolutionInMeters && a.getResolutionInMeters()
                                });
                                else switch (c.type) {
                                    case "simplemarkersymbol":
                                        l = h = c.size || 0;
                                        break;
                                    case "picturemarkersymbol":
                                        l = c.width || 0, h = c.height || 0
                                }
                                d = c.xoffset || 0;
                                m = c.yoffset || 0;
                                k = c.angle || 0
                            }
                            l && h && e._setDim(l + 1, h + 1, 0);
                            e.setOffset(d, m);
                            e.setAngle(k)
                        }
                        break;
                    case "polyline":
                        e = this.lineSymbol;
                        break;
                    case "polygon":
                        e = this.fillSymbol
                }
                f.setSymbol(e)
            }
        },
        showClosestFirst: function(a) {
            var b = this.features;
            if (b && b.length) {
                if (1 < b.length) {
                    var c, f = Infinity,
                        e = -1,
                        g, l = A.getLength,
                        h, d = a.spatialReference,
                        m, k;
                    a = a.normalize();
                    for (c = b.length - 1; 0 <= c; c--)
                        if (g =
                            b[c].geometry) {
                            m = g.spatialReference;
                            h = 0;
                            try {
                                k = "point" === g.type ? g : g.getExtent().getCenter(), k = k.normalize(), d && (m && !d.equals(m) && d._canProject(m)) && (k = d.isWebMercator() ? s.geographicToWebMercator(k) : s.webMercatorToGeographic(k)), h = l(a, k)
                            } catch (n) {}
                            0 < h && h < f && (f = h, e = c)
                        }
                    0 < e && (b.splice(0, 0, b.splice(e, 1)[0]), this.select(0))
                }
            } else this.deferreds && (this._marked = a)
        },
        _unbind: function(a) {
            a = d.indexOf(this.deferreds, a);
            if (-1 !== a) return this.deferreds.splice(a, 1), !this.deferreds.length ? (this.deferreds = null, 2) : 1
        },
        _fireComplete: function(a) {
            var b = this._marked;
            b && (this._marked = null, this.showClosestFirst(b));
            this.onDfdComplete(a)
        },
        _updateFeatures: function(a, b) {
            if (a) {
                if (this.deferreds) {
                    var c = this._unbind(a);
                    if (c)
                        if (b && b instanceof Error) {
                            if (this._fireComplete(b), 2 === c) this.onSetFeatures()
                        } else if (b && b.length)
                        if (this.features) {
                            var f = d.filter(b, function(a) {
                                return -1 === d.indexOf(this.features, a)
                            }, this);
                            this.features = this.features.concat(f);
                            this.count = this.features.length;
                            this._fireComplete();
                            if (2 === c) this.onSetFeatures()
                        } else {
                            this.features =
                                b;
                            this.count = b.length;
                            this.selectedIndex = 0;
                            this._fireComplete();
                            if (2 === c) this.onSetFeatures();
                            this.select(0)
                        } else if (this._fireComplete(), 2 === c) this.onSetFeatures()
                }
            } else this.features = b, this.count = b.length, this.selectedIndex = 0, this.onSetFeatures(), this.select(0)
        },
        _getSizeInfo: function(a) {
            return a ? a.sizeInfo || d.filter(a.visualVariables, D)[0] : null
        },
        _resetUpdateEndListeners: function() {
            this._featureLayers = {};
            d.forEach(this._updateEndHandles, function(a) {
                a.remove()
            });
            this._updateEndHandles = []
        },
        _processFeatures: function() {
            d.forEach(this.features,
                function(a) {
                    if ((a = a.getLayer()) && !this._featureLayers[a.id] && 1 === a.currentMode && a.objectIdField && a.hasXYFootprint && a.queryFeatures && ("esriGeometryPolygon" === a.geometryType || "esriGeometryPolyline" === a.geometryType || a.hasXYFootprint())) this._featureLayers[a.id] = a, a = a.on("update-end", n.hitch(this, this._fLyrUpdateEndHandler)), this._updateEndHandles.push(a)
                }, this)
        },
        _fLyrUpdateEndHandler: function(a) {
            if (!a.error) {
                var b = this,
                    c = a.target,
                    f = {},
                    e = [];
                d.forEach(this.features, function(a) {
                    if (a.getLayer() === c) {
                        var b =
                            a.attributes[c.objectIdField];
                        f[b] = a;
                        e.push(b)
                    }
                });
                e.length && (a = new B, a.objectIds = e, c.queryFeatures(a, function(a) {
                    d.forEach(a.features, function(a) {
                        var b = f[a.attributes[c.objectIdField]];
                        b.geometry !== a.geometry && (b.setGeometry(a.geometry), this._highlighted && b === this.getSelectedFeature() && this._highlighted.setGeometry(a.geometry))
                    }, b)
                }))
            }
        }
    })
});