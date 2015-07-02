//>>built
define(["./geometry/Extent", "./geometry/ScreenPoint", "./kernel", "./layerUtils", "./tasks/query", "dijit/registry", "dojo/_base/array", "dojo/_base/declare", "dojo/_base/Deferred", "dojo/_base/lang", "dojo/has", "dojo/on", "dojo/promise/all", "dojo/Stateful", "require"], function(E, u, M, C, F, G, f, H, v, w, N, I, J, K, L) {
    var x;
    return H(K, {
        declaredClass: "esri.PopupManager",
        enabled: !1,
        map: null,
        _mapClickHandle: null,
        _featureLayersCache: {},
        constructor: function(a) {
            this._mapClickHandler = w.hitch(this, this._mapClickHandler)
        },
        setMap: function(a) {
            if (this.map)
                if (a !==
                    this.map) this.unsetMap();
                else return;
            this.map = a;
            this._setupClickHandler()
        },
        unsetMap: function() {
            this.map && (this.map = null);
            this._mapClickHandle && (this._mapClickHandle.remove(), this._mapClickHandle = null)
        },
        getMapLayer: function(a) {
            var c;
            if (a && (c = a.getLayer()))
                if (a = c.id, this._featureLayersCache[a]) {
                    var b = a.lastIndexOf("_"); - 1 < b && (a = a.substring(0, b), c = this.map.getLayer(a))
                }
            return c
        },
        _enabledSetter: function(a) {
            this.enabled = a;
            this._setupClickHandler()
        },
        _setupClickHandler: function() {
            this._mapClickHandle && (this._mapClickHandle.remove(),
                this._mapClickHandle = null);
            this.enabled && this.map && (this._mapClickHandle = this.map.on("click", this._mapClickHandler))
        },
        _mapClickHandler: function(a) {
            var c = this.map.infoWindow,
                b = a.graphic;
            c && this.map.loaded && (c.clearFeatures && c.setFeatures ? this._showPopup(a) : b && b.getInfoTemplate() && this._showInfoWindow(b, a.mapPoint))
        },
        _showPopup: function(a) {
            var c = this.map,
                b = c.infoWindow,
                d = this,
                m = [],
                g = [c.graphics].concat(f.map(c.graphicsLayerIds, c.getLayer, c));
            f.forEach(g, function(a) {
                a && (a.loaded && a.infoTemplate && !a.suspended) &&
                    m.push(a)
            });
            var n = [];
            f.forEach(c.layerIds, function(a) {
                (a = c.getLayer(a)) && (a.loaded && !a.suspended) && (d._isImageServiceLayer(a) && a.infoTemplate ? m.push(a) : ("esri.layers.ArcGISDynamicMapServiceLayer" === a.declaredClass || "esri.layers.ArcGISTiledMapServiceLayer" === a.declaredClass) && a.infoTemplates && n.push(a))
            });
            this._getSubLayerFeatureLayers(n).then(function(g) {
                m = m.concat(g);
                g = null;
                a.graphic && (a.graphic.getInfoTemplate() && !d._isImageServiceLayer(a.graphic._layer)) && (g = a.graphic);
                if (m.length || g) {
                    var k = d._calculateClickTolerance(m),
                        r = a.screenPoint,
                        e = c.toMap(new u(r.x - k, r.y + k)),
                        k = c.toMap(new u(r.x + k, r.y - k)),
                        s = new E(e.x, e.y, k.x, k.y, c.spatialReference),
                        l = new F,
                        p = !!g,
                        n = !0,
                        e = f.map(m, function(b) {
                            var e;
                            l.timeExtent = b.useMapTime ? c.timeExtent : null;
                            if (d._isImageServiceLayer(b)) l.geometry = a.mapPoint, n = !1, e = b.queryVisibleRasters(l, {
                                rasterAttributeTableFieldPrefix: "Raster.",
                                returnDomainValues: !0
                            }), e.addCallback(function() {
                                var a = b.getVisibleRasters();
                                p = p || 0 < a.length;
                                return a
                            });
                            else if (d._featureLayersCache[b.id] || "function" === typeof b.queryFeatures &&
                                (0 === b.currentMode || 1 === b.currentMode)) l.geometry = s, e = b.queryFeatures(l), e.addCallback(function(a) {
                                a = a.features;
                                p = p || 0 < a.length;
                                return a
                            });
                            else {
                                e = new v;
                                var g = f.filter(b.graphics, function(a) {
                                    return a && a.visible && s.intersects(a.geometry)
                                });
                                p = p || 0 < g.length;
                                e.resolve(g)
                            }
                            return e
                        });
                    g && (k = new v, k.resolve([g]), e.unshift(k));
                    !f.some(e, function(a) {
                        return !a.isFulfilled()
                    }) && !p ? (b.hide(), b.clearFeatures()) : (b.setFeatures(e), b.show(a.mapPoint, {
                        closestFirst: n
                    }))
                }
            })
        },
        _getSubLayerFeatureLayers: function(a, c) {
            var b =
                c || new v,
                d = [],
                m = a.length,
                g = Math.floor(this.map.extent.getWidth() / this.map.width),
                n = this.map.getScale(),
                u = !1,
                k = this,
                r = 0;
            a: for (; r < m; r++) {
                var e = a[r],
                    s = e.dynamicLayerInfos || e.layerInfos;
                if (s) {
                    var l = null;
                    if (e._params && (e._params.layers || e._params.dynamicLayers)) l = e.visibleLayers;
                    for (var l = C._getVisibleLayers(s, l), p = C._getLayersForScale(n, s), w = s.length, z = 0; z < w; z++) {
                        var y = s[z],
                            q = y.id,
                            t = e.infoTemplates[q];
                        if (!y.subLayerIds && t && t.infoTemplate && -1 < f.indexOf(l, q) && -1 < f.indexOf(p, q)) {
                            if (!x) {
                                u = !0;
                                break a
                            }
                            var A =
                                e.id + "_" + q,
                                h = this._featureLayersCache[A];
                            if (!h || !h.loadError) h || ((h = t.layerUrl) || (h = y.source ? this._getLayerUrl(e.url, "/dynamicLayer") : this._getLayerUrl(e.url, q)), h = new x(h, {
                                    id: A,
                                    drawMode: !1,
                                    mode: x.MODE_SELECTION,
                                    outFields: this._getOutFields(t.infoTemplate),
                                    resourceInfo: t.resourceInfo,
                                    source: y.source
                                }), this._featureLayersCache[A] = h), h.setDefinitionExpression(e.layerDefinitions && e.layerDefinitions[q]), h.setGDBVersion(e.gdbVersion), h.setInfoTemplate(t.infoTemplate), h.setMaxAllowableOffset(g), h.setUseMapTime(!!e.useMapTime),
                                e.layerDrawingOptions && (e.layerDrawingOptions[q] && e.layerDrawingOptions[q].renderer) && h.setRenderer(e.layerDrawingOptions[q].renderer), d.push(h)
                        }
                    }
                }
            }
            if (u) {
                var D = new v;
                L(["./layers/FeatureLayer"], function(a) {
                    x = a;
                    D.resolve()
                });
                D.then(function() {
                    k._getSubLayerFeatureLayers(a, b)
                })
            } else {
                var B = [];
                f.forEach(d, function(a) {
                    if (!a.loaded) {
                        var b = new v;
                        I.once(a, "load, error", function() {
                            b.resolve()
                        });
                        B.push(b.promise)
                    }
                });
                B.length ? J(B).then(function() {
                    d = f.filter(d, function(a) {
                        return !a.loadError && a.isVisibleAtScale(n)
                    });
                    b.resolve(d)
                }) : (d = f.filter(d, function(a) {
                    return a.isVisibleAtScale(n)
                }), b.resolve(d))
            }
            return b.promise
        },
        _getLayerUrl: function(a, c) {
            var b = a.indexOf("?");
            return -1 === b ? a + "/" + c : a.substring(0, b) + "/" + c + a.substring(b)
        },
        _getOutFields: function(a) {
            var c;
            a.info && "esri.dijit.PopupTemplate" === a.declaredClass ? (c = [], f.forEach(a.info.fieldInfos, function(a) {
                var d = a.fieldName && a.fieldName.toLowerCase();
                d && ("shape" !== d && 0 !== d.indexOf("relationships/")) && c.push(a.fieldName)
            })) : c = ["*"];
            return c
        },
        _calculateClickTolerance: function(a) {
            var c =
                6,
                b, d;
            f.forEach(a, function(a) {
                if (b = a.renderer) "esri.renderer.SimpleRenderer" === b.declaredClass ? ((d = b.symbol) && d.xoffset && (c = Math.max(c, Math.abs(d.xoffset))), d && d.yoffset && (c = Math.max(c, Math.abs(d.yoffset)))) : ("esri.renderer.UniqueValueRenderer" === b.declaredClass || "esri.renderer.ClassBreaksRenderer" === b.declaredClass) && f.forEach(b.infos, function(a) {
                    (d = a.symbol) && d.xoffset && (c = Math.max(c, Math.abs(d.xoffset)));
                    d && d.yoffset && (c = Math.max(c, Math.abs(d.yoffset)))
                })
            });
            return c
        },
        _showInfoWindow: function(a,
            c) {
            var b = this.map.infoWindow,
                d = a.geometry,
                d = d && "point" === d.type ? d : c,
                f = a.getContent();
            b.setTitle(a.getTitle());
            if (f && w.isString(f.id)) {
                var g = G.byId(f.id);
                g && (g.set && /_PopupRenderer/.test(g.declaredClass)) && g.set("showTitle", !1)
            }
            b.setContent(f);
            b.show(d)
        },
        _isImageServiceLayer: function(a) {
            return "esri.layers.ArcGISImageServiceLayer" === a.declaredClass || "esri.layers.ArcGISImageServiceVectorLayer" === a.declaredClass
        }
    })
});