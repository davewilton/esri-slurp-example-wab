//>>built
define(["dojo/_base/kernel", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/json", "dojo/_base/Color", "dojo/has", "dojo/sniff", "dojo/DeferredList", "dojo/json", "dojo/dom", "dojo/dom-construct", "dojo/dom-style", "dijit/_Widget", "dojox/gfx", "dojox/gfx/matrix", "dojox/html/entities", "../kernel", "../config", "../request", "../lang", "../numberUtils", "../renderers/SimpleRenderer", "../renderers/UniqueValueRenderer", "../renderers/ClassBreaksRenderer", "../renderers/ScaleDependentRenderer", "../renderers/DotDensityRenderer", "../renderers/TemporalRenderer", "../renderers/VectorFieldRenderer", "../renderers/HeatmapRenderer", "../symbols/PictureFillSymbol", "../symbols/jsonUtils", "./_EventedWidget", "dojo/i18n!../nls/jsapi"], function(G, R, r, m, l, S, H, x, ba, T, U, s, g, t, V, L, W, w, ca, M, N, A, C, y, I, F, X, Y, Z, K, O, $, J, aa, P) {
    var z = R([aa, V], {
        declaredClass: "esri.dijit.Legend",
        widgetsInTemplate: !1,
        layers: null,
        alignRight: !1,
        hoverLabelShowing: !1,
        dotDensitySwatchSize: 26,
        dotCoverage: 75,
        gradientHeight: 30,
        defaultText: "Aa",
        gradientWidth: 34,
        colorRampBorder: "1px solid",
        _specialChars: {
            lt: "\x3c",
            gt: "\x3e"
        },
        _ieTimer: 100,
        _isRightToLeft: !1,
        _align: null,
        _legendAlign: null,
        constructor: function(a, b) {
            r.mixin(this, P.widgets.legend);
            this._i18n = P.widgets.legend;
            a = a || {};
            a.map ? b ? (this.map = a.map, this.layerInfos = a.layerInfos, this._respectCurrentMapScale = !1 === a.respectCurrentMapScale ? !1 : !0, this._respectVisibility = !1 === a.respectVisibility ? !1 : !0, this.arrangement = a.arrangement === z.ALIGN_RIGHT ? z.ALIGN_RIGHT : z.ALIGN_LEFT, this.arrangement === z.ALIGN_RIGHT && (this.alignRight = !0), this.autoUpdate = !1 === a.autoUpdate ? !1 : !0, this._surfaceItems = []) : console.error("esri.dijit.Legend: must specify a container for the legend") : console.error("esri.dijit.Legend: unable to find the 'map' property in parameters")
        },
        postMixInProperties: function() {
            this.inherited(arguments);
            var a = ["ar", "he"],
                b, c;
            for (b = 0; b < a.length; b += 1) c = a[b], G.locale && -1 !== G.locale.indexOf(c) && (-1 !== G.locale.indexOf("-") ? -1 !== G.locale.indexOf(c + "-") && (this._isRightToLeft = !0) : this._isRightToLeft = !0);
            this._isRightToLeft ? (this._align = this.alignRight ? "left" : "right", this._legendAlign = this.alignRight ? "esriLegendLeft" : "esriLegendRight") : (this._align = this.alignRight ? "right" : "left", this._legendAlign = this.alignRight ? "esriLegendRight" : "esriLegendLeft")
        },
        startup: function() {
            this.inherited(arguments);
            this._initialize();
            9 > x("ie") && (this._repaintItems = r.hitch(this, this._repaintItems), setTimeout(this._repaintItems, this._ieTimer))
        },
        destroy: function() {
            this._deactivate();
            this._removeHoverHandlers();
            this.inherited(arguments)
        },
        refresh: function(a) {
            if (this.domNode) {
                a ? (this.layerInfos = a, this.layers = [], m.forEach(this.layerInfos, function(a) {
                    this._isSupportedLayerType(a.layer) && (a.title && (a.layer._titleForLegend = a.title), a.layer._hideDefaultSymbol = !1 === a.defaultSymbol ?
                        !0 : !1, a.hideLayers ? (a.layer._hideLayersInLegend = a.hideLayers, this._addSubLayersToHide(a)) : a.layer._hideLayersInLegend = [], a.hoverLabel && (a.layer._hoverLabel = a.hoverLabel), a.hoverLabels && (a.layer._hoverLabels = a.hoverLabels), this.layers.push(a.layer))
                }, this)) : this.useAllMapLayers && (this.layers = this.layerInfos = null);
                for (a = this.domNode.children.length - 1; 0 <= a; a--) g.destroy(this.domNode.children[a]);
                this._removeHoverHandlers();
                this.startup()
            }
        },
        _legendUrl: "http://utility.arcgis.com/sharing/tools/legend",
        _initialize: function() {
            this.layerInfos && (this.layers = [], m.forEach(this.layerInfos, function(a) {
                this._isSupportedLayerType(a.layer) && (a.title && (a.layer._titleForLegend = a.title), a.layer._hideDefaultSymbol = !1 === a.defaultSymbol ? !0 : !1, a.hideLayers ? (a.layer._hideLayersInLegend = a.hideLayers, this._addSubLayersToHide(a)) : a.layer._hideLayersInLegend = [], a.hoverLabel && (a.layer._hoverLabel = a.hoverLabel), a.hoverLabels && (a.layer._hoverLabels = a.hoverLabels), this.layers.push(a.layer))
            }, this));
            this.useAllMapLayers = !1;
            if (!this.layers) {
                this.useAllMapLayers = !0;
                this.layers = [];
                var a = [],
                    b = [];
                m.forEach(this.map.layerIds, function(c) {
                    c = this.map.getLayer(c);
                    var d;
                    this._isSupportedLayerType(c) && (c.arcgisProps && c.arcgisProps.title && (c._titleForLegend = c.arcgisProps.title), this.layers.push(c));
                    "esri.layers.KMLLayer" == c.declaredClass && (d = c.getLayers(), m.forEach(d, function(b) {
                        a.push(b.id)
                    }, this));
                    "esri.layers.GeoRSSLayer" == c.declaredClass && (d = c.getFeatureLayers(), m.forEach(d, function(a) {
                        b.push(a.id)
                    }, this))
                }, this);
                m.forEach(this.map.graphicsLayerIds,
                    function(c) {
                        var d = this.map.getLayer(c); - 1 == m.indexOf(a, c) && -1 == m.indexOf(b, c) && (this._isSupportedLayerType(d) && d._params && d._params.drawMode) && (d.arcgisProps && d.arcgisProps.title && (d._titleForLegend = d.arcgisProps.title), this.layers.push(d))
                    }, this)
            }
            this._createLegend()
        },
        _activate: function() {
            this._deactivate();
            this.autoUpdate && (this._respectCurrentMapScale && (this._ozeConnect = l.connect(this.map, "onZoomEnd", this, "_refreshLayers")), this.useAllMapLayers && (this._olaConnect = l.connect(this.map, "onLayerAdd",
                this, "_updateAllMapLayers"), this._olrConnect = l.connect(this.map, "onLayerRemove", this, "_updateAllMapLayers"), this._olroConnect = l.connect(this.map, "onLayersReordered", this, "_updateAllMapLayers")), m.forEach(this.layers, function(a) {
                a.ovcConnect = l.connect(a, "onVisibilityChange", this, "_refreshLayers");
                a.oscConnect = l.connect(a, "onScaleRangeChange", this, "_refreshLayers");
                "esri.layers.ArcGISDynamicMapServiceLayer" === a.declaredClass && a.supportsDynamicLayers && (a.odcConnect = l.connect(a, "_onDynamicLayersChange",
                    r.hitch(this, "_updateDynamicLayers", a)));
                "esri.layers.ArcGISImageServiceLayer" === a.declaredClass && (a.oirConnect = l.connect(a, "onRenderingChange", r.partial(this._updateImageServiceLayers, this, a)));
                "esri.layers.ArcGISImageServiceVectorLayer" === a.declaredClass && (a.oivrConnect = l.connect(a, "onRendererChange", r.hitch(this, "_refreshLayers")))
            }, this))
        },
        _deactivate: function() {
            this._ozeConnect && l.disconnect(this._ozeConnect);
            this._olaConnect && l.disconnect(this._olaConnect);
            this._olroConnect && l.disconnect(this._olroConnect);
            this._olrConnect && l.disconnect(this._olrConnect);
            m.forEach(this.layers, function(a) {
                a.ovcConnect && l.disconnect(a.ovcConnect);
                a.oscConnect && l.disconnect(a.oscConnect);
                a.odcConnect && l.disconnect(a.odcConnect);
                a.oirConnect && l.disconnect(a.oirConnect);
                a.oivrConnect && l.disconnect(a.oivrConnect)
            }, this)
        },
        _updateDynamicLayers: function(a) {
            delete a.legendResponse;
            this._refreshLayers()
        },
        _updateImageServiceLayers: function(a, b) {
            delete b.legendResponse;
            a._refreshLayers()
        },
        _refreshLayers: function() {
            this.refresh()
        },
        _updateAllMapLayers: function() {
            this.layers = [];
            m.forEach(this.map.layerIds, function(a) {
                a = this.map.getLayer(a);
                this._isSupportedLayerType(a) && this.layers.push(a)
            }, this);
            m.forEach(this.map.graphicsLayerIds, function(a) {
                a = this.map.getLayer(a);
                this._isSupportedLayerType(a) && (a._params && a._params.drawMode) && this.layers.push(a)
            }, this);
            this.refresh()
        },
        _createLegend: function() {
            var a = !1;
            t.set(this.domNode, "position", "relative");
            g.create("div", {
                id: this.id + "_msg",
                className: "esriLegendMsg",
                innerHTML: this.NLS_creatingLegend +
                    "..."
            }, this.domNode);
            var b = [];
            m.forEach(this.layers, function(c) {
                if ("esri.layers.KMLLayer" == c.declaredClass || "esri.layers.GeoRSSLayer" == c.declaredClass) {
                    var e;
                    c.loaded ? ("esri.layers.KMLLayer" == c.declaredClass ? e = c.getLayers() : "esri.layers.GeoRSSLayer" == c.declaredClass && (e = c.getFeatureLayers(), c._hideLayersInLegend && (e = m.filter(e, function(a) {
                        return -1 == m.indexOf(c._hideLayersInLegend, a.id)
                    }))), m.forEach(e, function(a) {
                        "esri.layers.FeatureLayer" == a.declaredClass && c._titleForLegend && (a._titleForLegend = c._titleForLegend +
                            " - ", "esriGeometryPoint" == a.geometryType ? a._titleForLegend += this.NLS_points : "esriGeometryPolyline" == a.geometryType ? a._titleForLegend += this.NLS_lines : "esriGeometryPolygon" == a.geometryType && (a._titleForLegend += this.NLS_polygons), b.push(a))
                    }, this)) : l.connect(c, "onLoad", r.hitch(this, function() {
                        this.refresh(this.layerInfos)
                    }))
                } else if ("esri.layers.WMSLayer" === c.declaredClass)
                    if (c.loaded) {
                        if ((!this._respectVisibility || this._respectVisibility && c.visible) && 0 < c.layerInfos.length && m.some(c.layerInfos, function(a) {
                                return a.legendURL
                            })) {
                            var f = !1;
                            m.forEach(c.layerInfos, function(b) {
                                b.legendURL && -1 < m.indexOf(c.visibleLayers, b.name) && (f || (g.create("div", {
                                    innerHTML: "\x3cspan class\x3d'esriLegendServiceLabel'\x3e" + (c._titleForLegend || c.name || c.id) + "\x3c/span\x3e"
                                }, this.domNode), f = !0), g.create("div", {
                                    innerHTML: "\x3cimg src\x3d'" + b.legendURL + "'/\x3e"
                                }, this.domNode), a = !0)
                            }, this)
                        }
                    } else l.connect(c, "onLoad", r.hitch(this, function() {
                        this.refresh(this.layerInfos)
                    }));
                else b.push(c)
            }, this);
            var c = [];
            m.forEach(b, function(a) {
                if (a.loaded) {
                    if ((!this._respectVisibility ||
                            this._respectVisibility && a.visible) && (a.layerInfos || a.renderer || "esri.layers.ArcGISImageServiceLayer" == a.declaredClass)) {
                        var b = g.create("div", {
                            id: this.id + "_" + a.id,
                            style: {
                                display: "none"
                            },
                            "class": "esriLegendService"
                        });
                        g.create("span", {
                            innerHTML: this._getServiceTitle(a),
                            "class": "esriLegendServiceLabel"
                        }, g.create("td", {
                            align: this._align
                        }, g.create("tr", {}, g.create("tbody", {}, g.create("table", {
                            width: "95%"
                        }, b)))));
                        g.place(b, this.id, "first");
                        a.legendResponse || a.renderer ? this._createLegendForLayer(a) : c.push(this._legendRequest(a))
                    }
                } else var f =
                    l.connect(a, "onLoad", this, function(a) {
                        l.disconnect(f);
                        f = null;
                        this.refresh()
                    })
            }, this);
            0 === c.length && !a ? (s.byId(this.id + "_msg").innerHTML = this.NLS_noLegend, this._activate()) : (new T(c)).addCallback(r.hitch(this, function(b) {
                a ? s.byId(this.id + "_msg").innerHTML = "" : s.byId(this.id + "_msg").innerHTML = this.NLS_noLegend;
                this._activate()
            }))
        },
        _createLegendForLayer: function(a) {
            if (a.legendResponse || a.renderer) {
                var b = !1;
                if (a.legendResponse) {
                    var c = a.dynamicLayerInfos || a.layerInfos;
                    c && c.length ? m.forEach(c, function(c,
                        e) {
                        if (!a._hideLayersInLegend || -1 == m.indexOf(a._hideLayersInLegend, c.id)) {
                            var f = this._buildLegendItems(a, c, e);
                            b = b || f
                        }
                    }, this) : "esri.layers.ArcGISImageServiceLayer" == a.declaredClass && (b = this._buildLegendItems(a, {
                        id: 0,
                        name: null,
                        title: a.name,
                        subLayerIds: null,
                        parentLayerId: -1
                    }, 0))
                } else a.renderer && (c = a.url ? a.url.substring(a.url.lastIndexOf("/") + 1, a.url.length) : "fc_" + a.id, b = this._buildLegendItems(a, {
                    id: c,
                    name: null,
                    subLayerIds: null,
                    parentLayerId: -1
                }, 0));
                b && (t.set(s.byId(this.id + "_" + a.id), "display", "block"),
                    t.set(s.byId(this.id + "_msg"), "display", "none"))
            }
        },
        _legendRequest: function(a) {
            if (a.loaded) return 10.01 <= a.version ? this._legendRequestServer(a) : this._legendRequestTools(a);
            l.connect(a, "onLoad", r.hitch(this, "_legendRequest"))
        },
        _legendRequestServer: function(a) {
            var b = a.url,
                c = b.indexOf("?"),
                b = -1 < c ? b.substring(0, c) + "/legend" + b.substring(c) : b + "/legend";
            (c = a._getToken()) && (b += "?token\x3d" + c);
            var d = r.hitch(this, "_processLegendResponse"),
                c = {
                    f: "json"
                };
            a._params.dynamicLayers && (c.dynamicLayers = U.stringify(this._createDynamicLayers(a)),
                "[{}]" === c.dynamicLayers && (c.dynamicLayers = "[]"));
            a._params.bandIds && (c.bandIds = a._params.bandIds);
            a._params.renderingRule && (c.renderingRule = a._params.renderingRule);
            return N({
                url: b,
                content: c,
                callbackParamName: "callback",
                load: function(b, c) {
                    d(a, b, c)
                },
                error: M.defaults.io.errorHandler
            })
        },
        _legendRequestTools: function(a) {
            var b = a.url.toLowerCase().indexOf("/rest/"),
                b = a.url.substring(0, b) + a.url.substring(b + 5, a.url.length),
                b = this._legendUrl + "?soapUrl\x3d" + window.escape(b);
            if (!x("ie") || 8 < x("ie")) b += "\x26returnbytes\x3dtrue";
            var c = r.hitch(this, "_processLegendResponse");
            return N({
                url: b,
                content: {
                    f: "json"
                },
                callbackParamName: "callback",
                load: function(b, e) {
                    c(a, b, e)
                },
                error: M.defaults.io.errorHandler
            })
        },
        _processLegendResponse: function(a, b) {
            b && b.layers ? (a.legendResponse = b, s.byId(this.id + "_" + a.id) && g.empty(s.byId(this.id + "_" + a.id)), g.create("span", {
                innerHTML: this._getServiceTitle(a),
                "class": "esriLegendServiceLabel"
            }, g.create("td", {
                align: this._align
            }, g.create("tr", {}, g.create("tbody", {}, g.create("table", {
                width: "95%"
            }, s.byId(this.id +
                "_" + a.id)))))), this._createLegendForLayer(a)) : console.log("Legend could not get generated for " + a.url + ": " + S.toJson(b))
        },
        _buildLegendItems: function(a, b, c) {
            var d = !1,
                e = s.byId(this.id + "_" + a.id),
                f = b.parentLayerId;
            if (b.subLayerIds) a = g.create("div", {
                id: this.id + "_" + a.id + "_" + b.id + "_group",
                style: {
                    display: "none"
                },
                "class": -1 == f ? 0 < c ? "esriLegendGroupLayer" : "" : this._legendAlign
            }, -1 == f ? e : s.byId(this.id + "_" + a.id + "_" + f + "_group")), g.create("td", {
                innerHTML: w.encode(b.name),
                align: this._align
            }, g.create("tr", {}, g.create("tbody", {}, g.create("table", {
                width: "95%",
                "class": "esriLegendLayerLabel"
            }, a))));
            else {
                if (a.visibleLayers && -1 == ("," + a.visibleLayers + ",").indexOf("," + b.id + ",")) return d;
                c = g.create("div", {
                    id: this.id + "_" + a.id + "_" + b.id,
                    style: {
                        display: "none"
                    },
                    "class": -1 < f ? this._legendAlign : ""
                }, -1 == f ? e : s.byId(this.id + "_" + a.id + "_" + f + "_group"));
                g.create("td", {
                    innerHTML: w.encode(b.name) || "",
                    align: this._align
                }, g.create("tr", {}, g.create("tbody", {}, g.create("table", {
                    width: "95%",
                    "class": "esriLegendLayerLabel"
                }, c))));
                a.legendResponse ? d = d ||
                    this._buildLegendItems_Tools(a, b, c) : a.renderer && (d = d || this._buildLegendItems_Renderer(a, b, c))
            }
            return d
        },
        _buildLegendItems_Tools: function(a, b, c) {
            var d = b.parentLayerId,
                e = this.map.getScale(),
                f = !1,
                n = function(a, b) {
                    var c, d;
                    for (c = 0; c < a.length; c++)
                        if (b.dynamicLayerInfos)
                            for (d = 0; d < b.dynamicLayerInfos[d].length; d++) {
                                if (b.dynamicLayerInfos[d].mapLayerId == a[c].layerId) return a[c]
                            } else if (b.id == a[c].layerId) return a[c];
                    return {}
                };
            if (!this._respectCurrentMapScale || this._respectCurrentMapScale && this._isLayerInScale(a,
                    b, e)) {
                var p = !0;
                if ("esri.layers.ArcGISDynamicMapServiceLayer" === a.declaredClass || "esri.layers.ArcGISMapServiceLayer" === a.declaredClass) {
                    var k = this._getEffectiveScale(a, b);
                    if (k.minScale && k.minScale < e || k.maxScale && k.maxScale > e) p = !1
                }
                if (p) {
                    var e = n(a.legendResponse.layers, b),
                        h = e.legendType,
                        v = e.legend;
                    if (v) {
                        c = g.create("table", {
                            cellpadding: 0,
                            cellspacing: 0,
                            width: "95%",
                            "class": "esriLegendLayer"
                        }, c);
                        var u = g.create("tbody", {}, c);
                        (a._hoverLabel || a._hoverLabels) && this._createHoverAction(c, a, b);
                        m.forEach(v, function(c) {
                            if (!(10.1 <=
                                    a.version && !c.values && 1 < v.length && (a._hideDefaultSymbol || "\x3call other values\x3e" === c.label || !c.label && !("esri.layers.ArcGISImageServiceLayer" === a.declaredClass && 10.3 <= a.version))))
                                if (c.url && 0 === c.url.indexOf("http") || c.imageData && 0 < c.imageData.length) f = !0, this._buildRow_Tools(c, u, a, b.id, h)
                        }, this)
                    }
                }
            }
            f && (t.set(s.byId(this.id + "_" + a.id + "_" + b.id), "display", "block"), -1 < d && (t.set(s.byId(this.id + "_" + a.id + "_" + d + "_group"), "display", "block"), this._findParentGroup(a.id, a, d)));
            return f
        },
        _buildRow_Tools: function(a,
            b, c, d, e) {
            var f = g.create("tr", {}, b),
                n;
            this.alignRight ? (b = g.create("td", {
                align: this._isRightToLeft ? "left" : "right"
            }, f), n = g.create("td", {
                align: this._isRightToLeft ? "left" : "right",
                width: 35
            }, f)) : (n = g.create("td", {
                width: 35
            }, f), b = g.create("td", {}, f));
            f = a.url;
            (!x("ie") || 9 <= x("ie") || 9 > x("ie") && "esri.layers.ArcGISImageServiceLayer" === c.declaredClass) && a.imageData && 0 < a.imageData.length ? f = "data:image/png;base64," + a.imageData : 0 !== a.url.indexOf("http") && (f = c.url + "/" + d + "/images/" + a.url, (d = c._getToken()) && (f += "?token\x3d" +
                d));
            d = g.create("img", {
                src: f,
                border: 0,
                style: "opacity:" + c.opacity
            }, n);
            a = g.create("td", {
                innerHTML: w.encode(a.label),
                align: this._align
            }, g.create("tr", {}, g.create("tbody", {}, g.create("table", {
                width: "95%",
                dir: "ltr"
            }, b))));
            e && ("Stretched" === e && 10.3 <= c.version && "esri.layers.ArcGISImageServiceLayer" === c.declaredClass) && (a.style.verticalAlign = "top", a.style.lineHeight = "1", d.style.marginBottom = "-1px", d.style.display = "block", b.style.verticalAlign = "top");
            9 > x("ie") && (d.style.filter = "alpha(opacity\x3d" + 100 * c.opacity +
                ")")
        },
        _getVariable: function(a, b) {
            var c;
            a && (c = (c = a.getVisualVariablesForType(b)) && c[0]);
            return c
        },
        _getFieldAlias: function(a, b) {
            var c = b.infoTemplate,
                c = c && c.getFieldInfo && c.getFieldInfo(a),
                d = b.getField(a),
                e = c || d,
                f = "";
            e && (f = c && c.label || d && d.alias || e.name || e.fieldName);
            return f
        },
        _getDefaultHoverLabel: function(a, b) {
            var c;
            if (a) {
                var d = this._getVariable(a, "colorInfo"),
                    e = this._getVariable(a, "opacityInfo"),
                    f = this._getVariable(a, "sizeInfo"),
                    d = d || f || e,
                    n, p, k, h, g;
                a instanceof O ? n = a.field : a instanceof I && !a.attributeField2 &&
                    !a.attributeField3 ? (n = a.attributeField, d && (k = d.field, h = d.normalizationField)) : a instanceof F ? d ? (n = d.field, p = d.normalizationField) : (n = a.attributeField, p = a.normalizationField, g = "percent-of-total" === a.normalizationType) : a instanceof y && d && (n = d.field, p = d.normalizationField);
                (g = h && "showOpNormField" || k && "showOpField" || p && "showNormField" || (g ? "showNormPct" : null) || n && "showField" || null) && (c = A.substitute({
                    field: n && this._getFieldAlias(n, b),
                    normField: p && this._getFieldAlias(p, b),
                    opField: k && this._getFieldAlias(k,
                        b),
                    opNormField: h && this._getFieldAlias(h, b)
                }, this._i18n[g]))
            }
            return c
        },
        _buildLegendItems_Renderer: function(a, b, c) {
            var d = b.parentLayerId,
                e = this.map,
                f = e.getScale(),
                n = !1;
            if (!this._respectCurrentMapScale || this._isLayerInScale(a, b, f)) {
                var p, k, h = "esri.layers.ArcGISImageServiceVectorLayer" === a.declaredClass ? a.renderer.renderer : a.renderer,
                    v, u, D, q, l;
                if (h instanceof X && (h = (e = "zoom" === h.rangeType ? h.getRendererInfoByZoom(e.getZoom()) : h.getRendererInfoByScale(f)) && e.renderer, !h)) return !1;
                var e = this._getVariable(h,
                        "colorInfo"),
                    f = this._getVariable(h, "opacityInfo"),
                    E = this._getVariable(h, "sizeInfo"),
                    B = this._getDefaultHoverLabel(h, a);
                e ? (v = this._getMedianColor(h, e), e.field && (D = r.isFunction(e.field) ? null : a.getField(e.field))) : f && (l = r.isFunction(f.field) ? null : a.getField(f.field));
                E && E.field && (q = r.isFunction(E.field) ? null : a.getField(E.field));
                if (h instanceof O) n = !0, this._showHeatRamp(a, b, h, c, B);
                else if (h instanceof Y) n = !0, this._showDotDensityLegend(a, b, h, c);
                else if (h instanceof Z) n = !0, k = g.create("table", {
                    cellpadding: 0,
                    cellspacing: 0,
                    width: "95%",
                    "class": "esriLegendLayer"
                }, c), p = g.create("tbody", {}, k), (a._hoverLabel || a._hoverLabels) && this._createHoverAction(k, a, b), h.latestObservationRenderer && h.latestObservationRenderer instanceof y && this._buildRow_Renderer(a, h.latestObservationRenderer.symbol, v, w.encode(h.latestObservationRenderer.label) || this.NLS_currentObservations, null, p), h.observationRenderer && h.observationRenderer instanceof y && this._buildRow_Renderer(a, h.observationRenderer.symbol, v, w.encode(h.observationRenderer.label) ||
                    this.NLS_previousObservations, null, p);
                else if (h instanceof I) {
                    if (h.infos && 0 < h.infos.length) {
                        n = !0;
                        k = g.create("table", {
                            cellpadding: 0,
                            cellspacing: 0,
                            width: "95%",
                            "class": "esriLegendLayer"
                        }, c);
                        p = g.create("tbody", {}, k);
                        (a._hoverLabel || a._hoverLabels || B) && this._createHoverAction(k, a, b, B);
                        var Q = [];
                        m.forEach(h.infos, function(b) {
                            var c = null;
                            a._editable && a.types && (c = this._getTemplateFromTypes(a.types, b.value));
                            var d = b.label;
                            null == d && (d = b.value); - 1 === m.indexOf(Q, d) && (Q.push(d), this._buildRow_Renderer(a, b.symbol,
                                v, w.encode(d), c, p))
                        }, this)
                    }
                } else if (h instanceof F) {
                    if (h.infos && 0 < h.infos.length || "esri.layers.ArcGISImageServiceVectorLayer" === a.declaredClass) n = !0, k = g.create("table", {
                        cellpadding: 0,
                        cellspacing: 0,
                        width: "95%",
                        "class": "esriLegendLayer"
                    }, c), p = g.create("tbody", {}, k), (a._hoverLabel || a._hoverLabels || B) && this._createHoverAction(k, a, b, B), k = h.infos.slice(0).reverse(), m.forEach(k, function(b) {
                        var c = b.label;
                        null == c && (c = (c = D || q || l) && this._isSmartRenderer(h, c.name) ? this._getFieldAlias(c.name, a) : b.minValue + " - " +
                            b.maxValue);
                        this._buildRow_Renderer(a, b.symbol, v, w.encode(c), null, p)
                    }, this), "esri.layers.ArcGISImageServiceVectorLayer" === a.declaredClass && (a.rendererStyle === K.STYLE_SCALAR || a.rendererStyle === K.STYLE_SINGLE_ARROW) && this._buildRow_Renderer(a, h.defaultSymbol, null, "", null, p)
                } else h instanceof y && (n = !0, k = g.create("table", {
                        cellpadding: 0,
                        cellspacing: 0,
                        width: "95%",
                        "class": "esriLegendLayer"
                    }, c), p = g.create("tbody", {}, k), (a._hoverLabel || a._hoverLabels || B) && this._createHoverAction(k, a, b, B), u = null, a._editable &&
                    (a.templates && 0 < a.templates.length) && (u = a.templates[0]), k = (D || l) && q ? null : D || l || q, this._buildRow_Renderer(a, h.symbol, v, w.encode(k ? this._getFieldAlias(k.name, a) : h.label), u, p), u = h.symbol && h.symbol.color, k && (D = l = q = null));
                n && (e && e.field ? (D && this._isSmartRenderer(h, D.name) && (D = null), this._showColorRamp(a, b, h, null, c, e, D, B)) : f && u && this._showColorRamp(a, b, h, u, c, f, l, B), E && E.field && (q && this._isSmartRenderer(h, q.name) && (q = null), this._showSizeLegend(a, b, h, E, v, c, q, B)));
                !a._hideDefaultSymbol && h.defaultSymbol && (n = !0, k = g.create("table", {
                    cellpadding: 0,
                    cellspacing: 0,
                    width: "95%",
                    "class": "esriLegendLayer"
                }, c), p = g.create("tbody", {}, k), this._buildRow_Renderer(a, h.defaultSymbol, null, w.encode(h.defaultLabel) || "others", null, p))
            }
            n && (t.set(s.byId(this.id + "_" + a.id + "_" + b.id), "display", "block"), -1 < d && (t.set(s.byId(this.id + "_" + a.id + "_" + d + "_group"), "display", "block"), this._findParentGroup(a.id, d)));
            return n
        },
        _isSmartRenderer: function(a, b) {
            return a instanceof F && a.infos && 1 === a.infos.length && a.attributeField === b
        },
        _showColorRamp: function(a,
            b, c, d, e, f, n, p) {
            var k;
            k = g.create("table", {
                cellpadding: 0,
                cellspacing: 0,
                width: "95%",
                "class": "esriLegendLayer"
            }, e);
            e = g.create("tbody", {}, k);
            (a._hoverLabel || a._hoverLabels || p) && this._createHoverAction(k, a, b, p);
            n && this._addSubHeader(e, this._getFieldAlias(n.name, a));
            b = this._getRampStops(c, f, d);
            b.length && this._drawColorRamp(e, b, !0, a, this._getRampBorderColor(c))
        },
        _getMedianColor: function(a, b) {
            var c, d;
            b.colors ? (c = b.minDataValue, d = b.maxDataValue) : b.stops && (c = b.stops[0].value, d = b.stops[b.stops.length - 1].value);
            return a.getColor(c + (d - c) / 2, {
                colorInfo: b
            })
        },
        _getRampStops: function(a, b, c) {
            var d, e, f, n, g = !1;
            b.colors || b.opacityValues ? (e = b.maxDataValue - b.minDataValue, d = m.map([0, 0.25, 0.5, 0.75, 1], function(a) {
                f = b.minDataValue + a * e;
                return Number(f.toFixed(6))
            }), this._checkPrecision(0, 4, d)) : b.stops && (d = m.map(b.stops, function(a) {
                return a.value
            }), (g = m.some(b.stops, function(a) {
                return !!a.label
            })) && (n = m.map(b.stops, function(a) {
                return a.label
            })));
            var k = d[0],
                h, v, u;
            e = d[d.length - 1] - k;
            return m.map(d, function(f, m) {
                c ? (h = new H(c.toRgba()),
                    v = a.getOpacity(f, {
                        opacityInfo: b
                    }), null != v && (h.a = v)) : h = a.getColor(f, {
                    colorInfo: b
                });
                u = "";
                0 === m ? u = this._specialChars.lt + " " : m === d.length - 1 && (u = this._specialChars.gt + " ");
                return {
                    value: f,
                    color: h,
                    offset: 1 - (f - k) / e,
                    label: g ? n[m] : u + C.format(f)
                }
            }, this).reverse()
        },
        _checkPrecision: function(a, b, c) {
            var d = a + (b - a) / 2,
                e = c[a],
                f = c[d],
                n = c[b],
                g = Math.floor(e),
                k = Math.floor(f),
                h = Math.floor(n);
            g === e && (h === n && k !== f && g !== k && h !== k) && (c[d] = k);
            a + 1 !== d && this._checkPrecision(a, d, c);
            d + 1 !== b && this._checkPrecision(d, b, c)
        },
        _getRampBorderColor: function(a) {
            var b;
            if (a instanceof y) b = a.symbol;
            else if (a instanceof I || a instanceof F) b = a.infos[0].symbol;
            return (a = b && -1 === b.type.indexOf("linesymbol") ? b.getStroke() : null) && a.color
        },
        _drawColorRamp: function(a, b, c, d, e) {
            var f = g.create("tr", {}, a),
                n, p, k, h, v, u = b.length - 1,
                l;
            h = 0;
            this.alignRight ? (a = g.create("td", {
                align: this._isRightToLeft ? "left" : "right"
            }, f), n = g.create("td", {
                align: this._isRightToLeft ? "left" : "right",
                width: this.gradientWidth
            }, f)) : (n = g.create("td", {
                width: this.gradientWidth,
                align: "center"
            }, f), a = g.create("td", {},
                f));
            var q = e && 0 < e.a && !(240 <= e.r && 240 <= e.g && 240 <= e.b);
            p = g.create("div", {
                "class": q ? "" : "esriLegendBorderLessColorRamp",
                style: "position: relative; width:" + this.gradientWidth + "px;"
            }, n);
            f = g.create("div", {
                "class": "esriLegendColorRamp"
            }, p);
            n = t.get(f, "width");
            q && (e = 9 > x("ie") ? e.toHex() : "rgba(" + e.toRgba().join(",") + ")", t.set(f, "border", this.colorRampBorder + " " + e));
            c ? (e = this.gradientHeight * u, t.set(f, "height", e + "px")) : e = t.get(f, "height");
            t.set(p, "height", e + "px");
            f = L.createSurface(f, n, e);
            9 > x("ie") && (h = f.getEventSource(),
                t.set(h, "position", "relative"), t.set(h.parentNode, "position", "relative"), h = 1);
            try {
                c && m.forEach(b, function(a, b) {
                    a.offset = b / u
                }), v = f.createRect({
                    x: -h,
                    y: -h,
                    width: n + h,
                    height: e + h
                }), v.setFill({
                    type: "linear",
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: e,
                    colors: b
                }).setStroke(null), f.createRect({
                    width: n,
                    height: e
                }).setFill(new H([255, 255, 255, 1 - d.opacity])).setStroke(null), this._surfaceItems.push(f)
            } catch (r) {
                f.clear(), f.destroy()
            }
            m.forEach(b, function(a, c) {
                if (a.label) {
                    l = "top:" + 100 * a.offset + "%;";
                    var d = "";
                    0 === c && (d += " esriLegendColorRampTickFirst");
                    c === b.length - 1 && (d += " esriLegendColorRampTickLast");
                    g.create("div", {
                        "class": "esriLegendColorRampTick" + d,
                        innerHTML: "\x26nbsp;",
                        style: l
                    }, p)
                }
            });
            k = g.create("div", {
                "class": "esriLegendColorRampLabels",
                style: {
                    height: e + this.gradientHeight + "px"
                }
            }, a);
            c ? m.forEach(b, function(a) {
                g.create("div", {
                    "class": "esriLegendColorRampLabel",
                    innerHTML: w.encode(a.label) || "\x26nbsp;"
                }, k)
            }) : (g.create("div", {
                "class": "esriLegendColorRampLabel",
                innerHTML: this._i18n.high
            }, k), g.create("div", {
                "class": "esriLegendColorRampLabel",
                innerHTML: this._i18n.low,
                style: "top: " + (e + this.gradientHeight - 2 * this.gradientHeight) + "px;"
            }, k))
        },
        _showHeatRamp: function(a, b, c, d, e) {
            var f, n = c.field;
            f = g.create("table", {
                cellpadding: 0,
                cellspacing: 0,
                width: "95%",
                "class": "esriLegendLayer"
            }, d);
            d = g.create("tbody", {}, f);
            (a._hoverLabel || a._hoverLabels || e) && this._createHoverAction(f, a, b, e);
            (n = n && a.getField(n)) && this._addSubHeader(d, this._getFieldAlias(n.name, a));
            b = this._getHeatmapStops(c);
            b.length && this._drawColorRamp(d, b, !1, a)
        },
        _getHeatmapStops: function(a) {
            var b = a.colorStops;
            a = a.colors;
            var c, d, e, f;
            if (b && b[0])
                if (c = b.length - 1, a = b[0] && null != b[0].ratio) {
                    if ((a = b[c]) && 1 !== a.ratio) b = b.slice(0), b.push({
                        ratio: 1,
                        color: a.color
                    }), c++
                } else d = b[0].value, e = b[c].value - d, b = m.map(b, function(a) {
                    return {
                        color: a.color,
                        ratio: (a.value - d) / e
                    }
                });
            else a && a[0] && (c = a.length - 1, f = 1 / (a.length - 1), b = m.map(a, function(a, b) {
                return {
                    color: a,
                    ratio: b * f
                }
            }));
            b = m.map(b, function(a, b) {
                var d = "";
                0 === b ? d = "Low" : b === c && (d = "High");
                return {
                    color: a.color,
                    label: d,
                    offset: 1 - a.ratio
                }
            });
            return b.reverse()
        },
        _showDotDensityLegend: function(a,
            b, c, d) {
            var e = c.legendOptions,
                f, n, p, k, h, v, u, l = this.dotDensitySwatchSize,
                q = Math.round(l / 2);
            e && (n = e.backgroundColor, p = e.outline, k = e.valueUnit, h = e.dotCoverage);
            h = (h || this.dotCoverage) / 100;
            u = Math.round(l * l / Math.pow(c.dotSize, 2) * h);
            d = g.create("table", {
                cellpadding: 0,
                cellspacing: 0,
                width: "95%",
                "class": "esriLegendLayer"
            }, d);
            v = g.create("tbody", {}, d);
            (a._hoverLabel || a._hoverLabels) && this._createHoverAction(d, a, b);
            this._addSubHeader(v, A.substitute({
                value: c.dotValue,
                unit: k || ""
            }, this.NLS_dotValue));
            m.forEach(c.fields,
                function(b) {
                    b = r.mixin({}, b);
                    b.numPoints = u;
                    f = new $(c._generateImageSrc(l, l, [b], {
                        x: 0,
                        y: 0
                    }, {
                        x: l,
                        y: l
                    }, n), p || c.outline, l, l);
                    b = a.getField(b.name) || b;
                    this._buildRow_Renderer(a, f, null, w.encode(this._getFieldAlias(b.name, a)), null, v, {
                        type: "path",
                        path: "M " + -q + "," + -q + " L " + q + "," + -q + " L " + q + "," + q + " L " + -q + "," + q + " L " + -q + "," + -q + " E"
                    })
                }, this)
        },
        _showSizeLegend: function(a, b, c, d, e, f, n, p) {
            var k = d.legendOptions,
                k = k && k.customValues,
                h, l, u = this._getSizeSymbol(c, e);
            "unknown" !== d.valueUnit || (!u || !k && (null == d.minSize || null ==
                d.maxSize)) || (e = g.create("table", {
                cellpadding: 0,
                cellspacing: 0,
                width: "95%",
                "class": "esriLegendLayer"
            }, f), h = g.create("tbody", {}, e), (a._hoverLabel || a._hoverLabels || p) && this._createHoverAction(e, a, b, p), n && this._addSubHeader(h, this._getFieldAlias(n.name, a)), l = k || this._getDataValues(c, u, d), l.reverse(), m.forEach(l, function(b, e) {
                u = J.fromJson(u.toJson());
                this._applySize(u, c, d, b);
                b = C.format(b);
                var f = "";
                0 === e ? f = this._specialChars.gt + " " : e === l.length - 1 && (f = this._specialChars.lt + " ");
                f = "\x3cspan class\x3d'esriLegendSizeRampLabel'\x3e" +
                    w.encode(f + b) + "\x3c/span\x3e";
                this._buildRow_Renderer(a, u, null, f, null, h)
            }, this))
        },
        _getSizeSymbol: function(a, b) {
            var c;
            if (a instanceof y) c = a.symbol;
            else if (a instanceof K) c = a.defaultSymbol;
            else if (a instanceof I || a instanceof F) c = a.infos[0].symbol;
            if (c = -1 !== c.type.indexOf("fillsymbol") ? null : c) c = J.fromJson(c.toJson()), b && c.setColor(new H(b.toRgba()));
            return c
        },
        _getDataValues: function(a, b, c, d, e) {
            e = null == e ? 20 : e;
            d = this._interpolateSizeRange(c.minSize, c.maxSize, null == d ? 5 : d);
            var f = m.map(d, function(a) {
                    return this._getDataValueFromSize(a,
                        c)
                }, this),
                n, g, f = C.round(f);
            for (n = 1; n < f.length - 1; n++)
                if (g = this._roundDataValue(a, b, c, f[n], f[n - 1], e)) f[n] = g[0], d[n] = g[1];
            return f
        },
        _interpolateSizeRange: function(a, b, c) {
            b = (b - a) / (c - 1);
            var d, e = [];
            for (d = 0; d < c; d++) e.push(a + b * d);
            return e
        },
        _getDataValueFromSize: function(a, b) {
            var c = b.minSize,
                d = b.maxSize,
                e = b.minDataValue,
                f = b.maxDataValue;
            return c = a <= c ? e : a >= d ? f : (a - c) / (d - c) * (f - e) + e
        },
        _roundDataValue: function(a, b, c, d, e, f) {
            var g = this._getSize(b, a, c, d);
            e = this._getSize(b, a, c, e);
            var p, k = C.getDigits(d),
                h = k.integer,
                k = k.fractional,
                l, m, r, q, t, s, w, x, y, z, A;
            0 < d && 1 > d && (p = Math.pow(10, k), d *= p, h = C.getDigits(d).integer);
            for (h -= 1; 0 <= h && !(l = Math.pow(10, h), k = Math.floor(d / l) * l, l *= Math.ceil(d / l), null != p && (k /= p, l /= p), m = (k + l) / 2, m = C.round([k, m, l], {
                    indexes: [1]
                })[1], r = this._getSize(b, a, c, k), q = this._getSize(b, a, c, l), t = this._getSize(b, a, c, m), s = C.getPctChange(g, r, e, null), w = C.getPctChange(g, q, e, null), x = C.getPctChange(g, t, e, null), y = s.prev <= f, z = w.prev <= f, y && z && (s.prev <= w.prev ? (y = !0, z = !1) : (z = !0, y = !1)), y ? A = [k, r] : z ? A = [l, q] : x.prev <= f && (A = [m, t]), A); h--);
            return A
        },
        _applySize: function(a, b, c, d) {
            var e = a.type;
            b = this._getSize(a, b, c, d);
            switch (e) {
                case "simplemarkersymbol":
                    a.setSize(b);
                    break;
                case "picturemarkersymbol":
                    e = a.width;
                    c = a.height;
                    a.setHeight(b);
                    a.setWidth(b * (e / c));
                    break;
                case "simplelinesymbol":
                case "cartographiclinesymbol":
                    a.setWidth(b);
                    break;
                case "textsymbol":
                    a.font && a.font.setSize(b)
            }
        },
        _getSize: function(a, b, c, d) {
            return b.getSize(d, {
                sizeInfo: c,
                shape: -1 !== a.type.indexOf("markersymbol") ? a.style : null
            })
        },
        _buildRow_Renderer: function(a,
            b, c, d, e, f, n) {
            var p = g.create("tr", {}, f),
                k;
            this.alignRight ? (f = g.create("td", {
                align: this._isRightToLeft ? "left" : "right"
            }, p), k = g.create("td", {
                align: this._isRightToLeft ? "left" : "right",
                width: 35
            }, p)) : (k = g.create("td", {
                width: 35,
                align: "center"
            }, p), f = g.create("td", {}, p));
            var h = p = 30;
            if ("simplemarkersymbol" == b.type) p = Math.min(Math.max(p, b.size + 12), 125), h = Math.min(Math.max(h, b.size + 12), 125);
            else if ("picturemarkersymbol" == b.type) p = Math.min(Math.max(p, b.width), 125), h = Math.min(b.height || h, 125);
            else if ("textsymbol" ==
                b.type) {
                var l, m;
                b.text || (l = b.text, m = !0, b.setText(this.defaultText));
                p = Math.min(Math.max(p, b.getWidth() + 12), 125);
                h = Math.min(Math.max(h, b.getHeight() + 12), 125);
                m && b.setText(l)
            }
            l = g.create("div", {
                style: "width:" + p + "px;height:" + h + "px;"
            }, k);
            A.isDefined(d) && "number" === typeof d && (d = "" + d);
            g.create("td", {
                innerHTML: d || "",
                align: this._align
            }, g.create("tr", {}, g.create("tbody", {}, g.create("table", {
                width: "95%"
            }, f))));
            a = this._drawSymbol(l, b, c, p, h, e, a, n);
            this._surfaceItems.push(a)
        },
        _addSubHeader: function(a, b) {
            var c =
                g.create("tr", {}, a),
                c = g.create("td", {
                    align: this._align,
                    colspan: 2
                }, c);
            g.create("td", {
                innerHTML: w.encode(b) || "",
                align: this._align
            }, g.create("tr", {}, g.create("tbody", {}, g.create("table", {
                width: "95%"
            }, c))))
        },
        _drawSymbol: function(a, b, c, d, e, f, g, p) {
            b = J.fromJson(b.toJson());
            var k = g.opacity;
            c && b.setColor(new H(c.toRgba()));
            if ("simplelinesymbol" === b.type || "cartographiclinesymbol" === b.type || "textsymbol" === b.type) {
                if (!b.color) return;
                c = b.color.toRgba();
                c[3] *= k;
                b.color.setColor(c)
            } else if ("simplemarkersymbol" ===
                b.type || "simplefillsymbol" === b.type) {
                if (!b.color) return;
                c = b.color.toRgba();
                c[3] *= k;
                b.color.setColor(c);
                b.outline && b.outline.color && (c = b.outline.color.toRgba(), c[3] *= k, b.outline.color.setColor(c))
            } else "picturemarkersymbol" === b.type && (a.style.opacity = k, a.style.filter = "alpha(opacity\x3d(" + 100 * k + "))");
            a = L.createSurface(a, d, e);
            9 > x("ie") && (c = a.getEventSource(), t.set(c, "position", "relative"), t.set(c.parentNode, "position", "relative"));
            f = this._getDrawingToolShape(b, f) || J.getShapeDescriptors(b);
            var h, k = (c =
                f.defaultShape) && "text" === c.type;
            try {
                k && !c.text && (c.text = this.defaultText), h = a.createShape(p || c).setFill(f.fill).setStroke(f.stroke), k && h.setFont(f.font)
            } catch (l) {
                a.clear();
                a.destroy();
                return
            }
            var m = h.getBoundingBox();
            p = m.width;
            f = m.height;
            var k = -(m.x + p / 2),
                s = -(m.y + f / 2);
            c = a.getDimensions();
            k = {
                dx: k + c.width / 2,
                dy: s + c.height / 2
            };
            if ("simplemarkersymbol" === b.type && "path" === b.style) d = g._getScaleMatrix(m, b.size), h.applyTransform(W.scaleAt(d.xx, d.yy, {
                x: c.width / 2,
                y: c.height / 2
            }));
            else if (p > d || f > e) g = p / d > f / e, d = ((g ?
                d : e) - 5) / (g ? p : f), r.mixin(k, {
                xx: d,
                yy: d
            });
            h.applyTransform(k);
            return a
        },
        _getDrawingToolShape: function(a, b) {
            var c;
            switch (b ? b.drawingTool || null : null) {
                case "esriFeatureEditToolArrow":
                    c = {
                        type: "path",
                        path: "M 10,1 L 3,8 L 3,5 L -15,5 L -15,-2 L 3,-2 L 3,-5 L 10,1 E"
                    };
                    break;
                case "esriFeatureEditToolTriangle":
                    c = {
                        type: "path",
                        path: "M -10,14 L 2,-10 L 14,14 L -10,14 E"
                    };
                    break;
                case "esriFeatureEditToolRectangle":
                    c = {
                        type: "path",
                        path: "M -10,-10 L 10,-10 L 10,10 L -10,10 L -10,-10 E"
                    };
                    break;
                case "esriFeatureEditToolCircle":
                    c = {
                        type: "circle",
                        cx: 0,
                        cy: 0,
                        r: 10
                    };
                    break;
                case "esriFeatureEditToolEllipse":
                    c = {
                        type: "ellipse",
                        cx: 0,
                        cy: 0,
                        rx: 10,
                        ry: 5
                    };
                    break;
                default:
                    return null
            }
            return {
                defaultShape: c,
                fill: a.getFill(),
                stroke: a.getStroke()
            }
        },
        _repaintItems: function() {
            m.forEach(this._surfaceItems, function(a) {
                this._repaint(a)
            }, this)
        },
        _repaint: function(a) {
            if (a) {
                a.getStroke && a.setStroke && a.setStroke(a.getStroke());
                try {
                    a.getFill && a.setFill && a.setFill(a.getFill())
                } catch (b) {}
                a.children && r.isArray(a.children) && m.forEach(a.children, this._repaint, this)
            }
        },
        _createHoverAction: function(a, b, c, d) {
            if (d = b._hoverLabel || b._hoverLabels && b._hoverLabels[c.id] || d) d = w.encode(d), b.mouseMoveHandler = b.mouseMoveHandler || {}, b.mouseMoveHandler[c.id] = l.connect(a, "onmousemove", r.hitch(this, function(a, b) {
                this.mouseX = b.clientX;
                this.mouseY = b.clientY;
                this.hoverLabelShowing && (this.hoverLabelShowing = !1, t.set(s.byId(this.id + "_hoverLabel"), "display", "none"));
                setTimeout(r.hitch(this, function(a, b, c) {
                    if (a == this.mouseX && b == this.mouseY && !this.hoverLabelShowing)
                        if (this.hoverLabelShowing = !0, s.byId(this.id + "_hoverLabel")) {
                            var d = s.byId(this.id + "_hoverLabel");
                            d.innerHTML = "\x3cspan\x3e" + c + "\x3c/span\x3e";
                            t.set(d, "top", b + "px");
                            t.set(d, "left", a + 15 + "px");
                            t.set(d, "display", "")
                        } else g.create("div", {
                            innerHTML: "\x3cspan\x3e" + c + "\x3c/span\x3e",
                            id: this.id + "_hoverLabel",
                            "class": "esriLegendHoverLabel",
                            style: {
                                top: b + "px",
                                left: a + 15 + "px"
                            }
                        }, document.body)
                }, b.clientX, b.clientY, a), 500)
            }, d)), b.mouseOutHandler = b.mouseOutHandler || {}, b.mouseOutHandler[c.id] = l.connect(a, "onmouseout", r.hitch(this, function(a) {
                this.mouseY =
                    this.mouseX = -1;
                this.hoverLabelShowing && (this.hoverLabelShowing = !1, t.set(s.byId(this.id + "_hoverLabel"), "display", "none"))
            }))
        },
        _removeHoverHandlers: function() {
            var a;
            m.forEach(this.layers, function(b) {
                if (b.mouseMoveHandler)
                    for (a in b.mouseMoveHandler) l.disconnect(b.mouseMoveHandler[a]);
                if (b.mouseOutHandler)
                    for (a in b.mouseOutHandler) l.disconnect(b.mouseOutHandler[a])
            })
        },
        _createDynamicLayers: function(a) {
            var b = [],
                c;
            m.forEach(a.dynamicLayerInfos || a.layerInfos, function(d) {
                c = {
                    id: d.id
                };
                c.source = d.source && d.source.toJson();
                var e;
                a.layerDefinitions && a.layerDefinitions[d.id] && (e = a.layerDefinitions[d.id]);
                e && (c.definitionExpression = e);
                var f;
                a.layerDrawingOptions && a.layerDrawingOptions[d.id] && (f = a.layerDrawingOptions[d.id]);
                f && (c.drawingInfo = f.toJson());
                c.minScale = d.minScale || 0;
                c.maxScale = d.maxScale || 0;
                b.push(c)
            });
            return b
        },
        _getTemplateFromTypes: function(a, b) {
            var c;
            for (c = 0; c < a.length; c++)
                if (a[c].id == b && a[c].templates && 0 < a[c].templates.length) return a[c].templates[0];
            return null
        },
        _findParentGroup: function(a, b, c) {
            var d, e =
                b.dynamicLayerInfos || b.layerInfos;
            for (d = 0; d < e.length; d++)
                if (c == e[d].id) {
                    -1 < e[d].parentLayerId && (t.set(s.byId(this.id + "_" + a + "_" + e[d].parentLayerId + "_group"), "display", "block"), this._findParentGroup(a, b, e[d].parentLayerId));
                    break
                }
        },
        _addSubLayersToHide: function(a) {
            function b(c, d) {
                var e = a.layer.dynamicLayerInfos || a.layer.layerInfos,
                    f, g;
                for (f = 0; f < e.length; f++)
                    if (e[f].id === c && e[f].subLayerIds)
                        for (g = 0; g < e[f].subLayerIds.length; g++) {
                            var l = e[f].subLayerIds[g]; - 1 === m.indexOf(d, l) && (d.push(l), b(l, d))
                        }
            }
            a.layer.layerInfos &&
                m.forEach(a.layer._hideLayersInLegend, function(c) {
                    b(c, a.layer._hideLayersInLegend)
                })
        },
        _isLayerInScale: function(a, b, c) {
            var d, e = !0;
            if (a.legendResponse && a.legendResponse.layers)
                for (d = 0; d < a.legendResponse.layers.length; d++) {
                    var f = a.legendResponse.layers[d];
                    if (b.id == f.layerId) {
                        var g, l;
                        !a.minScale && 0 !== a.minScale || !a.maxScale && 0 !== a.maxScale ? (0 == f.minScale && a.tileInfo && (g = a.tileInfo.lods[0].scale), 0 == f.maxScale && a.tileInfo && (l = a.tileInfo.lods[a.tileInfo.lods.length - 1].scale)) : (g = Math.min(a.minScale, f.minScale) ||
                            a.minScale || f.minScale, l = Math.max(a.maxScale, f.maxScale));
                        if (0 < g && g < c || l > c) e = !1;
                        break
                    }
                } else if (a.minScale || a.maxScale)
                    if (a.minScale && a.minScale < c || a.maxScale && a.maxScale > c) e = !1;
            return e
        },
        _getServiceTitle: function(a) {
            var b = a._titleForLegend;
            b || ((b = a.url) ? -1 < a.url.indexOf("/MapServer") ? (b = a.url.substring(0, a.url.indexOf("/MapServer")), b = b.substring(b.lastIndexOf("/") + 1, b.length)) : -1 < a.url.indexOf("/ImageServer") ? (b = a.url.substring(0, a.url.indexOf("/ImageServer")), b = b.substring(b.lastIndexOf("/") + 1,
                b.length)) : -1 < a.url.indexOf("/FeatureServer") && (b = a.url.substring(0, a.url.indexOf("/FeatureServer")), b = b.substring(b.lastIndexOf("/") + 1, b.length)) : b = "", a.name && (b = 0 < b.length ? b + (" - " + a.name) : a.name));
            "esri.layers.ArcGISImageServiceVectorLayer" === a.declaredClass && a.vectorFieldPixelFilter && (a = a.vectorFieldPixelFilter.outputUnit ? this["NLS_" + a.vectorFieldPixelFilter.outputUnit] : this["NLS_" + a.vectorFieldPixelFilter.inputUnit], A.isDefined(a) && (b += " (" + a + ")"));
            return w.encode(b)
        },
        _getEffectiveScale: function(a,
            b) {
            var c = b.minScale,
                d = b.maxScale;
            if (A.isDefined(b.parentLayerId)) {
                var e = a.layerInfos,
                    f = b.parentLayerId,
                    g;
                for (g = e.length - 1; 0 <= g; g--)
                    if (e[g].id == f)
                        if (0 == c && 0 < e[g].minScale ? c = e[g].minScale : 0 < c && 0 == e[g].minScale || 0 < c && 0 < e[g].minScale && (c = Math.min(c, e[g].minScale)), d = Math.max(d || 0, e[g].maxScale || 0), -1 < e[g].parentLayerId) f = e[g].parentLayerId;
                        else break
            }
            return {
                minScale: c,
                maxScale: d
            }
        },
        _isSupportedLayerType: function(a) {
            return a && ("esri.layers.ArcGISDynamicMapServiceLayer" === a.declaredClass || "esri.layers.ArcGISImageServiceLayer" ===
                a.declaredClass && 10.2 <= a.version || "esri.layers.ArcGISImageServiceVectorLayer" === a.declaredClass || "esri.layers.ArcGISTiledMapServiceLayer" === a.declaredClass || "esri.layers.FeatureLayer" === a.declaredClass || "esri.layers.StreamLayer" === a.declaredClass || "esri.layers.KMLLayer" === a.declaredClass || "esri.layers.GeoRSSLayer" === a.declaredClass || "esri.layers.WMSLayer" === a.declaredClass || "esri.layers.CSVLayer" === a.declaredClass) ? !0 : !1
        }
    });
    r.mixin(z, {
        ALIGN_LEFT: 0,
        ALIGN_RIGHT: 1
    });
    return z
});