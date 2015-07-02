//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/aspect", "dojo/_base/array", "require", "../kernel", "../sniff", "../geometry/Point", "../geometry/webMercatorUtils", "./MapImage", "./FeatureLayer", "../renderers/HeatmapRenderer", "../tasks/query", "dojo/_base/fx"], function(t, r, u, q, v, D, E, w, x, y, z, l, A, s) {
    function B() {}

    function C(b) {
        var a = b.layer;
        return {
            geometry: b.geometry,
            attributes: b.attributes,
            getLayer: function() {
                return a
            }
        }
    }
    return t(null, {
        declaredClass: "esri.layers.HeatmapManager",
        heatmapRenderer: null,
        sourceLayer: null,
        imageLayer: null,
        useTiles: !0,
        useWorker: !1,
        map: null,
        constructor: function(b) {
            this.sourceLayer = b;
            this._hndls = []
        },
        initialize: function(b) {
            this.map = b;
            var a = this.sourceLayer,
                d = a.renderer;
            a.setDrawMode(!1);
            this.imageLayer = b._getMapImageLyr();
            var c = this;
            this.heatmapRenderer = d instanceof l ? d : (d.getRendererInfoByZoom(b.getZoom()) || d.getRendererInfoByScale(b.getScale())).renderer;
            this.recalculateHeatmap = this.recalculateHeatmap.bind(this);
            this._removeRenderer = this._removeRenderer.bind(this);
            this._handleRendererChange = this._handleRendererChange.bind(this);
            this._rendererChangeHandle = this.sourceLayer.on("renderer-change", this._handleRendererChange);
            this._handleOpacityChange = this._handleOpacityChange.bind(this);
            this._reprojectFeature = this._reprojectFeature.bind(this);
            v(["../workers/heatmapCalculator"], function(a) {
                c._calculator = new a(r.mixin({
                    width: c.map.width,
                    height: c.map.height
                }, c._getOptions()));
                c._setupRenderer();
                c.heatmapRenderer.getStats = a.calculateStats;
                c.heatmapRenderer.getHistogramData = a.getHistogramData
            })
        },
        destroy: function() {
            this._removeHandlers();
            this._rendererChangeHandle && this._rendererChangeHandle.remove();
            this._rendererChangeHandle = this.sourceLayer = this.imageLayer = this.map = this.heatmapRenderer = this._hndls = null
        },
        _handleRendererChange: function(b) {
            var a = b.renderer,
                d = a instanceof l;
            this.heatmapRenderer ? d ? this.heatmapRenderer = a : this._removeRenderer(b) : d && (this.heatmapRenderer = a, this.sourceLayer && this.map && this._setupRenderer())
        },
        _handleOpacityChange: function(b) {
            b = b.opacity;
            var a = this._getImageBySourceId(this.sourceLayer.id);
            a && a.setOpacity(b)
        },
        _setupRenderer: function() {
            var b = this._hndls,
                a = this.sourceLayer,
                d = this.map,
                c = this;
            a._originalDraw = a._draw;
            a._draw = B;
            a._div.clear();
            setTimeout(this._resetGraphics.bind(this), 250);
            b.push(a.on("update-end", function(a) {
                c.recalculateHeatmap()
            }));
            b.push(a.on("suspend", function(a) {
                (a = c._getImageBySourceId(c.sourceLayer.id)) && a.hide()
            }));
            b.push(a.on("resume", function(a) {
                (a = c._getImageBySourceId(c.sourceLayer.id)) && a.show()
            }));
            b.push(u.after(a, "redraw", this.recalculateHeatmap));
            b.push(d.on("layer-remove", function(b) {
                b.layer ==
                    a && ((b = c._getImageBySourceId(c.sourceLayer.id)) && c.imageLayer.removeImage(b), c._removeRenderer({
                        target: a
                    }))
            }));
            a._collection && b.push(a.on("graphic-add", function(a) {
                c._reprojectFeature(a.graphic)
            }));
            a.mode !== z.MODE_ONDEMAND && (b.push(d.on("resize, pan-end", function(a) {
                setTimeout(c.recalculateHeatmap, 16)
            })), b.push(d.on("zoom-end", function(b) {
                setTimeout(function() {
                    a._getRenderer().isInstanceOf(l) && c.recalculateHeatmap()
                }, 16)
            })));
            b.push(a.on("opacity-change", this._handleOpacityChange));
            this.imageLayer.suspended &&
                this.imageLayer.resume();
            a.graphics && a.graphics.length && (a.graphics[0].geometry && !d.spatialReference.equals(a.graphics[0].geometry.spatialReference) && q.forEach(a.graphics, function(a) {
                this._reprojectFeature(a)
            }.bind(this)), this.recalculateHeatmap())
        },
        _removeRenderer: function(b) {
            var a = b.target;
            a._draw = a._originalDraw;
            delete a._originalDraw;
            a.setDrawMode(!0);
            this._removeHandlers();
            this._hndls = [];
            var d = this._getImageBySourceId(this.sourceLayer.id);
            d && this.imageLayer.removeImage(d);
            a.renderer != b.renderer &&
                a.renderer.getRendererInfo ? this.heatmapRenderer = null : (a.redraw(), this.destroy())
        },
        recalculateHeatmap: function() {
            this._calculator ? this._doMainCalculation() : this._calculatorClient && this._doWorkerCalculation()
        },
        _reprojectFeature: function(b) {
            if (b && b.geometry) {
                var a = b.geometry,
                    d = this.map.spatialReference;
                d.equals(a.spatialReference) || (a = x.project(a, d), null == a ? console.log("Unable to reproject features to map's spatial reference. Please convert feature geometry before adding to layer") : b.geometry = a)
            }
        },
        _doWorkerCalculation: function() {},
        _doMainCalculation: function() {
            var b = this.sourceLayer,
                a = this.map,
                d = this.heatmapRenderer,
                c = this.map.extent,
                h = this.map.width,
                p = this.map.height,
                f = this._calculator,
                g = this,
                m = function(e) {
                    e = g._getScreenPoints(e.features, a, b);
                    e = f.calculateImageData(r.mixin({
                        screenPoints: e,
                        mapinfo: {
                            extent: [c.xmin, c.ymin, c.xmax, c.ymax],
                            resolution: a.getResolution()
                        },
                        width: h,
                        height: p
                    }, g._getOptions()));
                    e = d.getSymbol(C({
                        geometry: a.extent,
                        attributes: {
                            size: [h, p],
                            imageData: e
                        },
                        layer: b
                    }));
                    e = new y({
                        extent: a.extent,
                        href: e.url,
                        opacity: 0,
                        sourceId: b.id
                    });
                    g._swapMapImages(e, g._getImageBySourceId(b.id));
                    b.suspended && e.hide()
                },
                k = {
                    geometry: a.extent,
                    timeExtent: b.useMapTime ? a.timeExtent : void 0,
                    spatialRelationship: A.SPATIAL_REL_INTERSECTS
                };
            null != b._canDoClientSideQuery(k) ? b.queryFeatures(k, m) : m({
                features: b.graphics
            })
        },
        _getScreenPoints: function(b, a, d) {
            var c = [],
                h = b.length,
                p = 0,
                f = 0,
                g, m = new w(a.extent.xmin, a.extent.ymax, a.spatialReference),
                k = a.toScreen(m),
                e = k.x,
                k = k.y,
                l = a.getResolution(),
                n;
            for ((f = a.extent.getCacheValue("_parts")) && (n = q.map(f, function(b) {
                    return d._intersects(a,
                        b.extent)[0]
                })); h--;) f = b[h], f.geometry && (g = {
                x: Math.ceil((f.geometry.x - m.x) / l + e),
                y: Math.floor((m.y - f.geometry.y) / l - k),
                attributes: f.attributes
            }, n && (f = 1 < n.length && g.x < -n[0] ? n[1] : n[0], g.x += f), c[p++] = g);
            return c
        },
        _getImageBySourceId: function(b) {
            var a = this.imageLayer.getImages(),
                a = q.filter(a, function(a) {
                    return a.sourceId == b
                });
            if (a.length) return a[a.length - 1]
        },
        _swapMapImages: function(b, a) {
            function d() {
                c.removeImage(a)
            }
            var c = this.imageLayer,
                h = this.sourceLayer.opacity || 1;
            c.addImage(b);
            s.anim(b._node, {
                    opacity: h
                },
                null, null,
                function() {
                    b.opacity = h
                });
            null != a && s.anim(a._node, {
                opacity: 0
            }, null, null, d)
        },
        _removeHandlers: function() {
            if (null != this._hndls)
                for (var b = this._hndls.length; b--;) this._hndls[b].remove()
        },
        _getOptions: function() {
            var b = this.heatmapRenderer;
            return {
                blurRadius: b.blurRadius,
                gradient: b.gradient,
                maxPixelIntensity: b.maxPixelIntensity,
                minPixelIntensity: b.minPixelIntensity,
                field: b.field,
                fieldOffset: b.fieldOffset
            }
        },
        _resetGraphics: function() {
            for (var b = this.sourceLayer.graphics, a = b.length, d; a--;) d = b[a], d._shape =
                d._offsets = void 0
        }
    })
});