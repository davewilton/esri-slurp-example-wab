//>>built
define(["dojo/_base/declare", "dojo/_base/connect", "dojo/_base/lang", "dojo/_base/array", "dojo/dom-attr", "dojo/dom-construct", "dojo/dom-style", "dojox/gfx", "dojox/gfx/matrix", "./layer", "../kernel", "../lang", "../sniff", "../Color", "../domUtils", "../symbols/MarkerSymbol", "../symbols/SimpleMarkerSymbol", "../geometry/Point", "../geometry/ScreenPoint", "../geometry/Extent", "../geometry/mathUtils", "../geometry/screenUtils", "../PluginTarget"], function(x, v, y, m, J, N, G, A, u, V, W, O, H, X, E, P, w, Q, K, B, R, L, Y) {
    var M, I = -1 !== A.renderer.toLowerCase().indexOf("svg"),
        F = -1 !== A.renderer.toLowerCase().indexOf("canvas"),
        t = 9 > H("ie"),
        S = H("esri-touch");
    P = x(null, {
        declaredClass: "esri.layers._GraphicsContainer",
        _setMap: function(a, c) {
            var b, e = this._connects = [];
            this._map = a;
            F ? (b = N.create("div", {
                    style: "overflow: visible; position: absolute;"
                }, c), this._surface = {
                    getEventSource: function() {
                        return b
                    }
                }, e.push(v.connect(b, "onmousedown", this, this._canvasDownHandler)), e.push(v.connect(b, "onmouseup", this, this._canvasUpHandler)), e.push(v.connect(b, "onclick", this, this._canvasClickHandler)),
                M.prototype._canvas = !0) : (b = (this._surface = A.createSurface(c, a.width, a.height)).getEventSource(), G.set(b = t ? b.parentNode : b, {
                overflow: "visible",
                position: "absolute"
            }));
            e.push(v.connect(a, "onResize", this, "_onResizeHandler"));
            return b
        },
        _onResizeHandler: function(a, c, b) {
            a = this._surface.getEventSource();
            var e = this._map,
                d;
            t && G.set(a = a.parentNode, {
                width: c + "px",
                height: b + "px",
                clip: "rect(0px " + c + "px " + b + "px 0px)"
            });
            J.set(a, "width", c);
            J.set(a, "height", b);
            this._surface.declaredClass || m.forEach(a.childNodes, function(a) {
                J.set(a,
                    "width", c);
                J.set(a, "height", b)
            });
            e.loaded && (e.graphics.suspended || (e.graphics._resized = !0), m.forEach(e.graphicsLayerIds, function(a) {
                d = e.getLayer(a);
                d.suspended || (d._resized = !0)
            }))
        },
        _cleanUp: function() {
            m.forEach(this._connects, v.disconnect, v);
            this._map = this._surface = null
        },
        _processEvent: function(a) {
            var c = this._map;
            a.screenPoint = new K(a.pageX - c.position.x, a.pageY - c.position.y);
            a.mapPoint = c.toMap(a.screenPoint)
        },
        _canvasDownHandler: function(a) {
            this._processEvent(a);
            this._downPt = a.screenPoint.x + "," + a.screenPoint.y
        },
        _canvasUpHandler: function(a) {
            this._processEvent(a);
            this._upPt = a.screenPoint.x + "," + a.screenPoint.y
        },
        _tolerance: 15,
        _isPrimaryMatch: function(a, c, b, e) {
            if (!a.visible || !c) return !1;
            var d = c.getTransformedBoundingBox(),
                g;
            return d ? (g = new B(d[0].x, d[0].y, d[2].x, d[2].y), delete g.spatialReference, S ? g.intersects(b) : g.contains(e)) : m.some(c.children || [], function(a) {
                d = a.getTransformedBoundingBox();
                g = new B(d[0].x, d[0].y, d[2].x, d[2].y);
                delete g.spatialReference;
                return S ? g.intersects(b) : g.contains(e)
            })
        },
        _canvasClickHandler: function(a) {
            if (this._downPt &&
                this._upPt && this._downPt === this._upPt) {
                this._processEvent(a);
                var c = this._map,
                    b = m.map(c.graphicsLayerIds, function(a) {
                        return c.getLayer(a)
                    });
                b.push(c.graphics);
                b.reverse();
                var b = m.filter(b, function(a) {
                        return a.loaded && a._mouseEvents && !a.suspended && (!O.isDefined(a.opacity) || 0 < a.opacity)
                    }),
                    e = a.screenPoint,
                    d = this._tolerance,
                    g = e.x - d,
                    f = e.y + d,
                    h = e.x + d,
                    d = e.y - d,
                    k = new B(g, d, h, f),
                    g = c.toMap(new K(g, f)),
                    h = c.toMap(new K(h, d)),
                    f = g.spatialReference._getInfo(),
                    l = new B(B.prototype._normalizeX(g.x, f).x, g.y, B.prototype._normalizeX(h.x,
                        f).x, h.y, g.spatialReference),
                    n;
                delete k.spatialReference;
                m.some(b, function(a) {
                    a = m.filter(a.graphics, function(a) {
                        return this._isPrimaryMatch(a, a.getDojoShape(), k, e) || !(!a._bgShape || !this._isPrimaryMatch(a, a._bgShape, k, e))
                    }, this);
                    a.reverse();
                    if (0 < a.length) {
                        var b;
                        m.some(a, function(a) {
                            return a.geometry && l.intersects(a.geometry) ? (b = a, !0) : !1
                        });
                        if (b) return n = b, !0
                    }
                    return !1
                }, this);
                if (n && (b = n.getLayer())) a.graphic = n, b.onClick(a)
            }
        }
    });
    M = x(V, {
        declaredClass: "esri.layers._GraphicsLayer",
        managedSuspension: !0,
        surfaceType: F ?
            "canvas-2d" : A.renderer,
        _eventMap: {
            "graphic-add": ["graphic"],
            "graphic-remove": ["graphic"],
            "renderer-change": ["renderer"]
        },
        constructor: function(a, c) {
            if (a && (y.isString(a) || y.isObject(a) && (a.layerDefinition || a.query))) a = c;
            this._params = y.mixin({
                displayOnPan: !0,
                drawMode: !0,
                styling: !0
            }, a || {});
            var b = this._params.dataAttributes;
            "string" === typeof b && (b = [b]);
            this.styling = I ? this._params.styling : !0;
            this.dataAttributes = b;
            this.infoTemplate = a && a.infoTemplate;
            this.graphics = [];
            this._draw = y.hitch(this, this._draw);
            this._refresh =
                y.hitch(this, this._refresh);
            this.registerConnectEvents()
        },
        getNode: function() {
            return this._div && this._div.getEventSource()
        },
        setDrawMode: function(a) {
            this._params.drawMode = a
        },
        renderer: null,
        _setMap: function(a, c) {
            this.inherited(arguments);
            this._map = a;
            this._wrap = a.wrapAround180;
            this._srInfo = a.spatialReference._getInfo();
            this._canvas ? (c = A.createSurface(c.getEventSource(), a.width, a.height), G.set(c.rawNode, "position", "absolute"), this._div = c.createGroup(), this._renderProto = this._div.constructor.prototype._render,
                this._div._render = y.hitch(this, this._canvasRender)) : this._div = c.createGroup();
            this._bgGroup = this._div.createGroup();
            this._div.getEventSource().id = this.id + "_layer";
            var b = this.opacity;
            O.isDefined(b) && 1 > b && this.setOpacity(b, !0);
            return this._div
        },
        _unsetMap: function(a, c) {
            m.forEach(this.graphics, function(a) {
                a._shape = null
            });
            this._canvas ? (c = this._div.getParent(), c._parent = {}, N.destroy(c.rawNode), c.destroy()) : (this._div.clear(), c.remove(this._div), N.destroy(this._div.getEventSource()));
            this._map = this._div =
                null;
            clearTimeout(this._wakeTimer);
            this._wakeTimer = null;
            this._disableDrawConnectors();
            this.inherited(arguments)
        },
        _onZoomStartHandler: function() {
            E.hide(this._div.getEventSource())
        },
        _onExtentChangeHandler: function(a, c, b, e) {
            clearTimeout(this._wakeTimer);
            this._wakeTimer = null;
            b ? (a = this._map.__visibleRect, c = this._div, this._evalSDRenderer(), this._refresh(!0), c.setTransform(u.translate({
                    x: a.x,
                    y: a.y
                })), this._renderProto && c.surface.pendingRender ? this._dirty = !0 : this.suspended || E.show(c.getEventSource())) : this._resized &&
                (this._refresh(!1), this._resized = !1);
            if (0 < this.graphics.length) this.onUpdate()
        },
        _canvasRender: function() {
            var a = this._div;
            this._dirty && (delete this._dirty, this.suspended || E.show(a.getEventSource()));
            return this._renderProto.apply(a, arguments)
        },
        _refresh: function(a) {
            var c = this.graphics,
                b = c.length,
                e, d = this._draw;
            for (e = 0; e < b; e++) d(c[e], a)
        },
        refresh: function() {
            this._refresh(!0)
        },
        redraw: function() {
            this._refresh(!0)
        },
        _onPanHandler: function(a, c) {
            this._panDx = c.x;
            this._panDy = c.y;
            var b = this._map.__visibleRect;
            this._div.setTransform(u.translate({
                x: b.x + c.x,
                y: b.y + c.y
            }))
        },
        _onPanEndUpdateHandler: function(a, c) {
            if (!this._params._child && (c.x !== this._panDx || c.y !== this._panDy)) {
                var b = this._map.__visibleRect;
                this._div.setTransform(u.translate({
                    x: b.x,
                    y: b.y
                }))
            }
            this._refresh(!1);
            if (this.graphics.length) this.onUpdate()
        },
        _onPanStartHandler: function() {
            E.hide(this._div.getEventSource())
        },
        _onPanEndHandler: function() {
            var a = this._map.__visibleRect,
                c = this._div;
            c.setTransform(u.translate({
                x: a.x,
                y: a.y
            }));
            this._refresh(!1);
            this._renderProto &&
                c.surface.pendingRender ? this._dirty = !0 : E.show(c.getEventSource());
            if (this.graphics.length) this.onUpdate()
        },
        onSuspend: function() {
            this.inherited(arguments);
            E.hide(this._div.getEventSource());
            clearTimeout(this._wakeTimer);
            this._wakeTimer = null;
            this._disableDrawConnectors()
        },
        onResume: function(a) {
            this.inherited(arguments);
            a.firstOccurrence && this._evalSDRenderer();
            this._enableDrawConnectors();
            this._wakeTimer = this._wakeTimer || setTimeout(y.hitch(this, function() {
                this.suspended || this._onExtentChangeHandler(null,
                    null, !0)
            }), 0)
        },
        _enableDrawConnectors: function() {
            var a = this._map,
                c = v.connect;
            this._disableDrawConnectors();
            this._params.displayOnPan ? (this._params._child || (this._onPanHandler_connect = c(a, "onPan", this, "_onPanHandler")), this._onPanEndHandler_connect = c(a, "onPanEnd", this, "_onPanEndUpdateHandler")) : (this._onPanStartHandler_connect = c(a, "onPanStart", this, "_onPanStartHandler"), this._onPanEndHandler_connect = c(a, "onPanEnd", this, "_onPanEndHandler"));
            this._onZoomStartHandler_connect = c(a, "onZoomStart", this, "_onZoomStartHandler");
            this._onExtentChangeHandler_connect = c(a, "onExtentChange", this, "_onExtentChangeHandler")
        },
        _disableDrawConnectors: function() {
            var a = v.disconnect;
            a(this._onExtentChangeHandler_connect);
            a(this._onZoomStartHandler_connect);
            a(this._onPanHandler_connect);
            a(this._onPanStartHandler_connect);
            a(this._onPanEndHandler_connect);
            this._onExtentChangeHandler_connect = this._onZoomStartHandler_connect = this._onPanHandler_connect = this._onPanStartHandler_connect = this._onPanEndHandler_connect = null
        },
        _updateExtent: function(a) {
            var c =
                a.geometry;
            if (c) {
                if (!(a._extent = c.getExtent())) {
                    var b, e;
                    if ("esri.geometry.Point" === c.declaredClass) b = c.x, e = c.y;
                    else if ("esri.geometry.Multipoint" === c.declaredClass) b = c.points[0][0], e = c.points[0][1];
                    else {
                        a._extent = null;
                        return
                    }
                    a._extent = new B(b, e, b, e, c.spatialReference)
                }
            } else a._extent = null
        },
        _intersects: function(a, c, b) {
            var e = a.spatialReference,
                d = c.spatialReference,
                g = e && d && !e.equals(d) && e._canProject(d) && 4326 === d.wkid;
            if (this._wrap && !b) {
                b = [];
                var e = a._getFrameWidth(),
                    f = this._srInfo,
                    h = a._clip ? a._getAvailExtent() :
                    a.extent,
                    k, l, n, q, p = [];
                k = c._partwise;
                g && (h = a.geographicExtent, f = d._getInfo());
                a = h._getParts(f);
                if (k && k.length) {
                    c = [];
                    d = 0;
                    for (g = k.length; d < g; d++) c = c.concat(k[d]._getParts(f))
                } else c = c._getParts(f);
                d = 0;
                for (g = c.length; d < g; d++) {
                    n = c[d];
                    f = 0;
                    for (h = a.length; f < h; f++)
                        if (q = a[f], q.extent.intersects(n.extent)) {
                            k = 0;
                            for (l = n.frameIds.length; k < l; k++) b.push((q.frameIds[0] - n.frameIds[k]) * e)
                        }
                }
                d = 0;
                for (g = b.length; d < g; d++) k = b[d], m.indexOf(b, k) === d && p.push(k);
                return p.length ? p : null
            }
            return (g ? a.geographicExtent : a.extent).intersects(c) ? [0] : null
        },
        _defaultMarker: {
            type: "simplemarkersymbol",
            style: "square",
            size: 1,
            xoffset: 0,
            yoffset: 0,
            angle: 0
        },
        _draw: function(a, c) {
            if (this._params.drawMode && this._map && !this.suspended) try {
                var b = a._extent,
                    e, d, g = !I || this.styling,
                    f = I && this.dataAttributes,
                    h = a.getDojoShape(),
                    k;
                if (a.visible && b && (e = this._intersects(this._map, b, a.geometry._originOnly)) && (d = g ? this._getSymbol(a) : this._defaultMarker)) {
                    if (!a._offsets || a._offsets.join(",") !== e.join(",") ? a._offsets = e : k = !0, !h || c || !k) {
                        var l = a.geometry.type,
                            b = {
                                graphic: a
                            },
                            n = a._bgShape,
                            q = g && !a.symbol ? this._getRenderer(a) : null,
                            p = q && q.backgroundFillSymbol;
                        if ("point" === l) this._isInvalidShape(d, h) && this._removeShape(a), a._shape = this._drawPoint(this._div, a.geometry, d, a.getDojoShape(), e, q, a), g && this._symbolizePoint(a.getDojoShape(), d, q, a);
                        else if ("multipoint" === l) this._drawMarkers(a, d, e, q), g && this._symbolizeMarkers(a, d, q);
                        else {
                            var D, l = d,
                                m, C;
                            g && (l = (D = "simplemarkersymbol" === d.type || "picturemarkersymbol" === d.type || "textsymbol" === d.type ? d : null) ? p : d);
                            l && l === p && (m = this._bgGroup);
                            n && !m && this._removeBgShape(a);
                            l && (!m && this._isInvalidShape(l, a._shape) && this._removeShape(a, !1), C = this._drawShape(a, e, m || this._div, m ? n : a.getDojoShape()), g && this._symbolizeShape(C, l, !p && q, a), a[m ? "_bgShape" : "_shape"] = C);
                            if (D) {
                                this._isInvalidShape(D, a._shape) && this._removeShape(a, !1);
                                var U = a.geometry.getCentroid();
                                (C = U && this._drawPoint(this._div, U, D, a._shape, e, q, a)) && this._symbolizePoint(C, D, q, a);
                                a._shape = C
                            }
                        }
                        F || (a._bgShape && this._initNode(a, a._bgShape, a._bgShape !== n, b, f), a._shape && this._initNode(a, a._shape,
                            a._shape !== h, b, f));
                        b.node = a.getNode();
                        this.onGraphicDraw(b)
                    }
                } else h && this._removeShape(a)
            } catch (Z) {
                this._errorHandler(Z, a)
            }
        },
        _initNode: function(a, c, b, e, d) {
            if (c = c && c.getNode()) c.e_graphic = a, this._addDataAttrs(a, d, c), b && (e.node = c, this.onGraphicNodeAdd(e))
        },
        _removeShape: function(a, c) {
            var b = a.getDojoShape(),
                e = b && b.getNode();
            b && (b.removeShape(), b.destroy());
            a._shape = a._offsets = null;
            !1 !== c && this._removeBgShape(a);
            if (e && (e.e_graphic = null, !F)) this.onGraphicNodeRemove({
                graphic: a,
                node: e
            })
        },
        _removeBgShape: function(a) {
            var c =
                a._bgShape,
                b = c && c.getNode();
            c && (c.removeShape(), c.destroy(), a._bgShape = null);
            if (b && (b.e_graphic = null, !F)) this.onGraphicNodeRemove({
                graphic: a,
                node: b
            })
        },
        _addDataAttrs: function(a, c, b) {
            var e = a.attributes,
                d, g = c ? c.length : 0,
                f = this._getRenderer(a);
            if (b && e) {
                for (d = 0; d < g; d++)(b = c[d]) && a.attr("data-" + b, e[b]);
                !this.styling && f && (f.getBreakIndex ? (c = f.getBreakIndex(a), a.attr("data-class-break", -1 !== c ? c : null)) : f.getUniqueValueInfo && (c = f.getUniqueValueInfo(a), a.attr("data-unique-value", c ? c.value : null)))
            }
        },
        _drawShape: function(a,
            c, b, e) {
            a = a.geometry;
            var d = a.type,
                g = this._map,
                f = g.extent,
                h = g.width,
                k = g.height,
                g = g.__visibleRect,
                l = [],
                n, q;
            n = "extent" === d;
            if ("rect" === d || n) l = {
                x: 0,
                y: 0,
                spatialReference: a.spatialReference
            }, l.x = n ? a.xmin : a.x, l.y = n ? a.ymax : a.y, d = L.toScreenPoint(f, h, k, l), l.x = n ? a.xmax : a.x + a.width, l.y = n ? a.ymin : a.y + a.height, a = L.toScreenPoint(f, h, k, l), c = {
                x: d.x - g.x + c[0],
                y: d.y - g.y,
                width: Math.abs(a.x - d.x),
                height: Math.abs(a.y - d.y)
            }, 0 === c.width && (c.width = 1), 0 === c.height && (c.height = 1), e = this._drawRect(b, e, c);
            else if ("polyline" === d ||
                "polygon" === d) {
                n = 0;
                for (q = c.length; n < q; n++) l = l.concat(L._toScreenPath(f, h, k, a, -g.x + c[n], -g.y));
                e = this._drawPath(b, e, l);
                this._rendererLimits && ("polyline" === d ? this._clipPolyline(e, a) : this._clipPolygon(e, a))
            }
            return e
        },
        _drawRect: function(a, c, b) {
            return c ? c.setShape(b) : a.createRect(b)
        },
        _drawImage: function(a, c, b) {
            return c ? c.setShape(b) : a.createImage(b)
        },
        _drawCircle: function(a, c, b) {
            return c ? c.setShape(b) : a.createCircle(b)
        },
        _drawPath: function() {
            return t ? function(a, c, b, e) {
                b = e ? b : b.join(" ");
                if (c) return c.setShape(b);
                c = a.createObject(e ? A.Path : A.EsriPath, b);
                a._overrideSize(c.getEventSource());
                return c
            } : function(a, c, b, e) {
                b = e ? b : b.join(" ");
                return c ? c.setShape(b) : a.createPath(b)
            }
        }(),
        _drawText: function(a, c, b) {
            return c ? c.setShape(b) : a.createText(b)
        },
        _evalSDRenderer: function(a) {
            var c = this._map,
                b = this.renderer,
                e, d = this._rndForScale;
            c && (c.loaded && b && b.getRendererInfo) && (e = "zoom" === b.rangeType ? b.getRendererInfoByZoom(c.getZoom()) : b.getRendererInfoByScale(c.getScale()));
            this._rndForScale = e && e.renderer;
            !a && this._rndForScale !=
                d && this.emit("renderer-change", {
                    renderer: this._rndForScale
                })
        },
        _getRenderer: function(a) {
            var c = this._rndForScale || this.renderer;
            a && (c && c.getObservationRenderer) && (c = c.getObservationRenderer(a));
            return c
        },
        _getSymbol: function(a) {
            var c = this._getRenderer();
            return a.symbol || c && c.getSymbol(a)
        },
        _getVariable: function(a, c) {
            var b;
            a && (b = (b = a.getVisualVariablesForType(c)) && b[0]);
            return b
        },
        _applyOpacity: function(a, c, b, e) {
            c = c.getOpacity(e, {
                opacityInfo: b
            });
            null != c && (a = new X(a), a.a = c);
            return a
        },
        _symbolizeShape: function(a,
            c, b, e) {
            var d = c.getStroke(),
                g = c.getFill();
            c = c.type;
            var f, h, k = this._getVariable(b, "sizeInfo"),
                l = this._getVariable(b, "colorInfo"),
                n = this._getVariable(b, "opacityInfo"),
                k = k ? b.getSize(e, {
                    sizeInfo: k,
                    resolution: this._map.getResolutionInMeters()
                }) : null;
            if (b && (l || n) && "picturefillsymbol" !== c) - 1 !== c.indexOf("linesymbol") ? (f = d && d.color, l && (f = b.getColor(e, {
                colorInfo: l
            }) || f), f && n && (f = this._applyOpacity(f, b, n, e))) : g && g.toCss && (h = g, l && (h = b.getColor(e, {
                colorInfo: l
            }) || h), h && n && (h = this._applyOpacity(h, b, n, e)));
            a.setStroke(null ==
                k && !f ? d : y.mixin({}, d, null != k ? {
                    width: k
                } : null, f && {
                    color: f
                })).setFill(h || g)
        },
        _smsToPath: function() {
            return t ? function(a, c, b, e, d, g, f, h, k) {
                switch (c) {
                    case a.STYLE_SQUARE:
                        return ["M", d + "," + f, "L", g + "," + f, g + "," + h, d + "," + h, "X", "E"];
                    case a.STYLE_CROSS:
                        return ["M", b + "," + f, "L", b + "," + h, "M", d + "," + e, "L", g + "," + e, "E"];
                    case a.STYLE_X:
                        return ["M", d + "," + f, "L", g + "," + h, "M", d + "," + h, "L", g + "," + f, "E"];
                    case a.STYLE_DIAMOND:
                        return ["M", b + "," + f, "L", g + "," + e, b + "," + h, d + "," + e, "X", "E"];
                    case a.STYLE_TARGET:
                        return ["M", d + "," + f, "L", g + "," + f,
                            g + "," + h, d + "," + h, d + "," + f, "M", d - k + "," + e, "L", d + "," + e, "M", b + "," + (f - k), "L", b + "," + f, "M", g + k + "," + e, "L", g + "," + e, "M", b + "," + (h + k), "L", b + "," + h, "E"
                        ]
                }
            } : function(a, c, b, e, d, g, f, h, k) {
                switch (c) {
                    case a.STYLE_SQUARE:
                        return ["M", d + "," + f, g + "," + f, g + "," + h, d + "," + h, "Z"];
                    case a.STYLE_CROSS:
                        return ["M", b + "," + f, b + "," + h, "M", d + "," + e, g + "," + e];
                    case a.STYLE_X:
                        return ["M", d + "," + f, g + "," + h, "M", d + "," + h, g + "," + f];
                    case a.STYLE_DIAMOND:
                        return ["M", b + "," + f, g + "," + e, b + "," + h, d + "," + e, "Z"];
                    case a.STYLE_TARGET:
                        return ["M", d + "," + f, g + "," + f, g + "," + h, d +
                            "," + h, d + "," + f, "M", d - k + "," + e, d + "," + e, "M", b + "," + (f - k), b + "," + f, "M", g + k + "," + e, g + "," + e, "M", b + "," + (h + k), b + "," + h
                        ]
                }
            }
        }(),
        _pathStyles: {
            square: 1,
            cross: 1,
            x: 1,
            diamond: 1,
            target: 1
        },
        _typeMaps: {
            picturemarkersymbol: "image",
            picturefillsymbol: "path",
            simplefillsymbol: "path",
            simplelinesymbol: "path",
            cartographiclinesymbol: "path",
            textsymbol: "text"
        },
        _isInvalidShape: function(a, c) {
            var b = c && c.shape && c.shape.type,
                e = a && a.type,
                d = a && a.style;
            "rect" === b && (b = "path");
            e && (d = this._typeMaps[e] || d);
            this._pathStyles[d] && (d = "path");
            return "shieldlabelsymbol" ===
                e ? !0 : !(!b || !(d && b !== d))
        },
        _drawPoint: function(a, c, b, e, d, g, f) {
            var h = b.type,
                k = this._map,
                l = k.__visibleRect,
                n = L.toScreenPoint(k.extent, k.width, k.height, c).offset(-l.x + d[0], -l.y),
                l = n.x,
                q = n.y,
                p;
            c = [];
            var m, T = g && g.rotationInfo ? g.getRotationAngle(f) : null,
                C = this._getVariable(g, "sizeInfo"),
                k = C ? g.getSize(f, {
                    sizeInfo: C,
                    shape: b.style,
                    resolution: k.getResolutionInMeters()
                }) : null;
            T && c.push(u.rotategAt(T, n));
            if (0 !== b.xoffset || 0 !== b.yoffset) m = u.translate(b.xoffset, -b.yoffset), c.push(m);
            0 !== b.angle && c.push(u.rotategAt(b.angle,
                n));
            if ("simplemarkersymbol" === h) switch (p = b.style, g = Math.round, k = null != k ? k : b.size, p) {
                    case w.STYLE_SQUARE:
                    case w.STYLE_CROSS:
                    case w.STYLE_X:
                    case w.STYLE_DIAMOND:
                        b = isNaN(k) ? 16 : k / 2;
                        p = this._drawPath(a, e, this._smsToPath(w, p, l, q, g(l - b), g(l + b), g(q - b), g(q + b)));
                        break;
                    case w.STYLE_TARGET:
                        f = b._targetWidth / 2;
                        n = b._targetHeight / 2;
                        p = this._drawPath(a, e, this._smsToPath(w, p, l, q, g(l - f), g(l + f), g(q - n), g(q + n), b._spikeSize));
                        break;
                    case w.STYLE_PATH:
                        p = this._drawPath(a, e, b.path, !0);
                        b = p.getBoundingBox();
                        a = this._getScaleMatrix(b,
                            k);
                        (1 !== a.xx || 1 !== a.yy) && c.push(u.scaleAt(a.xx, a.yy, n));
                        c.push(u.translate(-(b.x + b.width / 2) + l, -(b.y + b.height / 2) + q));
                        break;
                    default:
                        b = isNaN(k) ? 16 : k / 2, p = this._drawCircle(a, e, {
                            cx: l,
                            cy: q,
                            r: b
                        })
                } else if ("shieldlabelsymbol" === h) p = b.width, n = b.height, e = a.createGroup(), p = a.createImage({
                    x: l - p / 2,
                    y: q - n / 2,
                    width: p,
                    height: n,
                    src: b.url
                }), e.add(p), null != b.font && (q += 0.2 * b.getHeight(), a = a.createText({
                        type: "text",
                        text: b.text,
                        x: l,
                        y: q,
                        align: "middle",
                        decoration: b.decoration,
                        rotated: b.rotated,
                        kerning: b.kerning
                    }), a.setFont(b.font),
                    a.setFill(b.color), e.add(a)), p = e;
                else if ("picturemarkersymbol" === h) {
                if (null == k ? (p = b.width, n = b.height) : (n = k, p = n * (b.width / b.height), m && (null != m.dx && (m.dx = p * (m.dx / b.width)), null != m.dy && (m.dy = n * (m.dy / b.height)))), p = this._drawImage(a, e, {
                        x: l - p / 2,
                        y: q - n / 2,
                        width: p,
                        height: n,
                        src: b.url
                    }), I && (a = p.getNode())) b = (b = this._getVariable(g, "opacityInfo")) ? g.getOpacity(f, {
                    opacityInfo: b
                }) : null, null != b ? a.setAttribute("opacity", b) : a.setAttribute("opacity", 1)
            } else "textsymbol" === h && (g = b.font, null != k && g && (g = new g.constructor(g.toJson()),
                g.setSize(k)), p = this._drawText(a, e, {
                type: "text",
                text: b.text,
                x: l,
                y: q,
                align: b.getSVGAlign(),
                decoration: b.decoration || g && g.decoration,
                rotated: b.rotated,
                kerning: b.kerning
            }), g && p.setFont(g), I && (a = p.getNode(), l = b.getSVGBaseline(), b = b.getSVGBaselineShift(), a && (a.setAttribute("dominant-baseline", l), b && a.setAttribute("baseline-shift", b))));
            p.setTransform(u.multiply(c));
            p._wrapOffsets = d;
            return p
        },
        _getScaleMatrix: function(a, c) {
            var b = a.width / a.height,
                e = 1,
                d = 1;
            isNaN(c) || (1 < b ? (e = c / a.width, d = c / b / a.height) : (d = c / a.height,
                e = c * b / a.width));
            return {
                xx: e,
                yy: d
            }
        },
        _symbolizePoint: function(a, c, b, e) {
            var d = c.type,
                g = c.style;
            if (!("shieldlabelsymbol" === d || "picturemarkersymbol" === d)) {
                var f = c.getStroke();
                c = c.getFill();
                var g = g === w.STYLE_X || g === w.STYLE_CROSS,
                    h = f && f.color,
                    k = g ? h : c;
                if (b) {
                    var l = this._getVariable(b, "colorInfo"),
                        n = this._getVariable(b, "opacityInfo");
                    l && (k = b.getColor(e, {
                        colorInfo: l
                    }) || k);
                    k && n && (k = this._applyOpacity(k, b, n, e));
                    k && (g ? k !== h && (f = f ? y.mixin({}, f) : {}, f.color = k) : k !== c && (c = k))
                }
                "textsymbol" === d ? a.setFill(c) : "simplemarkersymbol" ===
                    d && a.setFill(c).setStroke(f)
            }
        },
        _drawMarkers: function(a, c, b, e) {
            var d = a.geometry,
                g = d.points,
                f = a.getDojoShape() || this._div.createGroup(),
                h, k, l = g.length,
                n = [],
                m = 0,
                p, D = b ? b.length : 0;
            f.children[0] && this._isInvalidShape(c, f.children[0]) && f.clear();
            for (k = 0; k < l; k++) {
                h = g[k];
                for (p = 0; p < D; p++) n[0] = b[p], this._drawPoint(f, {
                    x: h[0],
                    y: h[1],
                    spatialReference: d.spatialReference
                }, c, f.children[m++], n, e, a)
            }
            c = f.children.length;
            if (l * b.length < c)
                for (k = c - 1; k >= l * b.length; k--) f.children[k].removeShape();
            a._shape = f
        },
        _symbolizeMarkers: function(a,
            c, b) {
            var e = a.getDojoShape().children,
                d, g = e.length;
            for (d = 0; d < g; d++) this._symbolizePoint(e[d], c, b, a)
        },
        _errorHandler: function(a, c) {
            a.message = c ? "Unable to draw graphic (geometry:" + (c.geometry ? c.geometry.declaredClass : null) + ", symbol:" + (c.symbol ? c.symbol.declaredClass : null) + "): " + a.message : "Unable to draw graphic (null): " + a.message;
            this.inherited(arguments)
        },
        _rendererLimits: function() {
            var a, c, b;
            H("ff") ? (a = 16125, c = -32250, b = 32250) : t ? (a = 1E5, c = -1E5, b = 1E5) : H("chrome") && 6 > H("chrome") && (a = 8150, c = -1E4, b = 1E4);
            if (a) return {
                clipLimit: a,
                rangeMin: c,
                rangeMax: b,
                clipBBox: [-a, -a, a, a],
                clipSegments: [
                    [
                        [-a, -a],
                        [a, -a]
                    ],
                    [
                        [a, -a],
                        [a, a]
                    ],
                    [
                        [a, a],
                        [-a, a]
                    ],
                    [
                        [-a, a],
                        [-a, -a]
                    ]
                ]
            }
        }(),
        _clipPolyline: function(a, c) {
            var b = this._getCorners(a, c),
                e = b.br,
                d = this._rendererLimits,
                g = d.rangeMin,
                f = d.rangeMax,
                h = d.clipBBox,
                k = d.clipSegments,
                d = this._isPointWithinRange,
                l = this._isPointWithinBBox,
                n = this._getClipperIntersection,
                q = this._getPlaneIndex;
            if (!d(b.tl, g, f) || !d(e, g, f)) {
                t && this._createSegments(a);
                var p = [];
                m.forEach(a.segments, function(a) {
                    a = a.args;
                    var b = a.length,
                        c = [],
                        e;
                    for (e = 0; e < b; e += 2) {
                        var d = [a[e], a[e + 1]],
                            g = [a[e + 2], a[e + 3]],
                            f = l(d, h),
                            m = l(g, h);
                        if (f ^ m) {
                            if (m = n([d, g], k)) f ? (e ? c.push(m[1]) : c.push(d, m[1]), p.push(c), c = []) : c.push(m[1], g)
                        } else f ? e ? c.push(g) : c.push(d, g) : (m = q(d, h), f = q(g, h), -1 === m || (-1 === f || m === f) || (d = n([d, g], k, !0), 0 < d.length && (d[m] || (m = d[m[0]] ? m[0] : m[1]), d[f] || (f = d[f[0]] ? f[0] : f[1]), g = d[m], d = d[f], g && c.push(g), d && (c.push(d), p.push(c), c = []))))
                    }
                    p.push(c)
                });
                a.setShape(this._getPathStringFromPaths(p))
            }
        },
        _clipPolygon: function(a, c) {
            var b = this._getCorners(a,
                    c),
                e = b.br,
                d = this._rendererLimits,
                g = d.clipLimit,
                f = d.rangeMin,
                h = d.rangeMax,
                k = d.clipBBox,
                l = d.clipSegments,
                d = this._isPointWithinRange,
                n = this._isPointWithinBBox,
                q = this._getClipperIntersection,
                p = this._getPlaneIndex,
                v = R._pointLineDistance;
            if (!d(b.tl, f, h) || !d(e, f, h)) t && this._createSegments(a), b = m.map(a.segments, function(a) {
                var b = a.args,
                    c = b.length,
                    d = [];
                a = [];
                var e;
                for (e = 0; e < c; e += 2) {
                    var f = [b[e], b[e + 1]],
                        h = [b[e + 2], b[e + 3]];
                    if (e === c - 2) {
                        d.push(f);
                        break
                    }
                    var s = n(f, k),
                        r = n(h, k);
                    d.push(f);
                    if (s ^ r) {
                        if (r = q([f, h], l)) f = r[1],
                            f[s ? "inOut" : "outIn"] = !0, d.push(f), a.push([s ? "INOUT" : "OUTIN", d.length - 1, r[0]])
                    } else if (!s) {
                        var s = p(f, k),
                            z = p(h, k); - 1 === s || (-1 === z || s === z) || (r = q([f, h], l, !0), 0 < r.length ? (r[s] || (s = r[s[0]] ? s[0] : s[1]), r[z] || (z = r[z[0]] ? z[0] : z[1]), f = r[s], h = r[z], f && (f.outIn = !0, d.push(f), a.push(["OUTIN", d.length - 1, s])), h && (h.inOut = !0, d.push(h), a.push(["INOUT", d.length - 1, z]))) : y.isArray(s) && y.isArray(z) && (r = s.concat(z), r.sort(), "0123" === r.join("") && (r = [], 3 === s[0] + s[1] ? r.push([g, -g], [-g, g]) : r.push([-g, -g], [g, g]), s = v(r[0], [f, h]),
                            f = v(r[1], [f, h]), d.push(s < f ? r[0] : r[1]))))
                    }
                }
                var t = k[0],
                    u = k[1],
                    w = k[2],
                    x = k[3];
                m.forEach(d, function(a) {
                    a[0] < t && (a[1] >= u && a[1] <= x ? a[0] = t : (a[0] = t, a[1] = a[1] < u ? u : x))
                });
                m.forEach(d, function(a) {
                    a[1] < u && (a[0] >= t && a[0] <= w ? a[1] = u : (a[1] = u, a[0] = a[0] < t ? t : w))
                });
                m.forEach(d, function(a) {
                    a[0] > w && (a[1] >= u && a[1] <= x ? a[0] = w : (a[0] = w, a[1] = a[1] < u ? u : x))
                });
                m.forEach(d, function(a) {
                    a[1] > x && (a[0] >= t && a[0] <= w ? a[1] = x : (a[1] = x, a[0] = a[0] < t ? t : w))
                });
                b = 0;
                c = a.length;
                if (0 < c) {
                    do {
                        h = a[b];
                        e = a[(b + 1) % c];
                        if (h[2] === e[2] && "INOUT" === h[0] && "OUTIN" ===
                            e[0])
                            if (f = h[1], e = e[1], f < e)
                                for (f += 1; f < e; f++) d[f][2] = !0;
                            else if (f > e) {
                            for (f += 1; f < d.length; f++) d[f][2] = !0;
                            for (f = 0; f < e; f++) d[f][2] = !0
                        }
                        b = (b + 1) % c
                    } while (0 !== b)
                }
                c = d[0];
                b = d[d.length - 1];
                c[2] && (b[2] = !0, m.some(a, function(a) {
                    return 1 === a[1] ? (d.splice(d.length - 1, 0, y.clone(d[1])), !0) : !1
                }));
                d = m.filter(d, function(a) {
                    return a[2] ? !1 : !0
                });
                for (b = 0; b < d.length - 1; b++)
                    if (c = d[b], (e = d[b + 1]) && !(c[0] !== e[0] || c[1] !== e[1])) e.outIn ? c.outIn = !0 : e.inOut && (c.inOut = !0), d.splice(b + 1, 1);
                c = Math.abs;
                a = [];
                for (b = 0; b < d.length - 1; b++) {
                    h = d[b];
                    f = h[0];
                    h = h[1];
                    s = c(f) === g;
                    r = c(h) === g;
                    e = d[b + 1];
                    z = e[0];
                    e = e[1];
                    var A = c(z) === g,
                        B = c(e) === g;
                    s && B ? a.push([b + 1, [f, e]]) : r && A && a.push([b + 1, [z, h]])
                }
                for (b = a.length - 1; 0 <= b; b--) e = a[b], f = d[e[0] - 1], c = d[e[0]], !f.outIn && (!f.inOut && !c.outIn && !c.inOut) && d.splice(e[0], 0, e[1]);
                c = d[0];
                b = d[d.length - 1];
                (c[0] !== b[0] || c[1] !== b[1]) && d.push(c);
                return d
            }), a.setShape(this._getPathStringFromPaths(b))
        },
        _getCorners: function(a, c) {
            if (t) {
                var b = this._map,
                    e = c.getExtent(),
                    d = e.spatialReference,
                    g = b.toScreen(new Q(e.xmin, e.ymax, d)),
                    b = b.toScreen(new Q(e.xmax,
                        e.ymin, d));
                return {
                    tl: g,
                    br: b
                }
            }
            g = a.getTransformedBoundingBox();
            return {
                tl: g[0],
                br: g[2]
            }
        },
        _createSegments: function(a) {
            a.shape.path = a.vmlPath;
            a.segmented = !1;
            a._confirmSegmented();
            var c = a.segments;
            1 < c.length && (a.segments = m.filter(c, function(a, c, d) {
                c = d[c + 1];
                return "M" === a.action && c && "L" === c.action ? (a.args = a.args.concat(c.args), !0) : !1
            }))
        },
        _getPathStringFromPaths: function(a) {
            t ? (a = m.map(a, function(a) {
                return "m " + m.map(a, function(a, c) {
                    return (1 === c ? "l " : "") + a.join(",")
                }).join(" ")
            }), a.push("e")) : a = m.map(a, function(a) {
                return "M " +
                    m.map(a, function(a) {
                        return a.join(",")
                    }).join(" ")
            });
            return a.join(" ")
        },
        _isPointWithinBBox: function(a, c) {
            var b = c[1],
                e = c[2],
                d = c[3],
                g = a[0],
                f = a[1];
            return g > c[0] && g < e && f > b && f < d ? !0 : !1
        },
        _isPointWithinRange: function(a, c, b) {
            var e = a.x;
            a = a.y;
            return e < c || a < c || e > b || a > b ? !1 : !0
        },
        _getClipperIntersection: function(a, c, b) {
            var e, d = R._getLineIntersection2,
                g = Math.round,
                f = {
                    length: 0
                };
            for (e = 0; 4 > e; e++) {
                var h = d(a, c[e]);
                if (h)
                    if (h[0] = g(h[0]), h[1] = g(h[1]), b) f[e] = h, f.length++;
                    else return [e, h]
            }
            return b ? f : null
        },
        _getPlaneIndex: function(a,
            c) {
            var b = a[0],
                e = a[1],
                d = c[0],
                g = c[1],
                f = c[2],
                h = c[3];
            return b <= d ? e >= g && e <= h ? 3 : e < g ? [0, 3] : [2, 3] : e <= g ? b >= d && b <= f ? 0 : b < d ? [3, 0] : [1, 0] : b >= f ? e >= g && e <= h ? 1 : e < g ? [0, 1] : [2, 1] : e >= h ? b >= d && b <= f ? 2 : b < d ? [3, 2] : [1, 2] : -1
        },
        onGraphicAdd: function() {},
        onGraphicRemove: function() {},
        onGraphicNodeAdd: function() {},
        onGraphicNodeRemove: function() {},
        onGraphicDraw: function() {},
        onGraphicsClear: function() {},
        onRendererChange: function() {},
        onOpacityChange: function() {},
        setInfoTemplate: function(a) {
            this.infoTemplate = a
        },
        add: function(a, c) {
            if (a._graphicsLayer ===
                this) return a;
            c || this.graphics.push(a);
            a._graphicsLayer = this;
            a._layer = this;
            this._updateExtent(a);
            this._draw(a);
            if (!c) this.onGraphicAdd(a);
            return a
        },
        remove: function(a, c) {
            if (!c) {
                var b;
                if (-1 === (b = m.indexOf(this.graphics, a))) return null;
                a = this.graphics.splice(b, 1)[0]
            }
            a.getDojoShape() && this._removeShape(a);
            a._shape = a._graphicsLayer = null;
            this.onGraphicRemove(a);
            return a
        },
        clear: function(a, c) {
            for (var b = this.graphics; 0 < b.length;) this.remove(b[0]);
            if (!c) this.onGraphicsClear()
        },
        _setIEOpacity: function(a, c) {
            var b =
                a && a.getNode();
            if (b) {
                var e = a.strokeStyle,
                    d = b.stroke;
                e && d && (d.opacity = e.color.a * c);
                e = a.fillStyle;
                d = b.fill;
                e && d && ("tile" === d.type ? G.set(b, "opacity", c) : d.opacity = e.a * c)
            }
        },
        setOpacity: function(a, c) {
            if (c || this.opacity != a) {
                var b = this._div;
                b && (t ? (m.forEach(this.graphics, function(b) {
                    this._setIEOpacity(b._shape, a);
                    this._setIEOpacity(b._bgShape, a)
                }, this), b._esriIeOpacity = a, this._bgGroup._esriIeOpacity = a) : this._canvas ? G.set(b.getEventSource(), "opacity", a) : b.getEventSource().setAttribute("opacity", a));
                this.opacity =
                    a;
                if (!c) this.onOpacityChange(a)
            }
        },
        setRenderer: function(a) {
            this.renderer = a;
            this._evalSDRenderer(!0);
            this.emit("renderer-change", {
                renderer: this._rndForScale || a
            })
        }
    });
    x = x([M, Y], {
        declaredClass: "esri.layers.GraphicsLayer",
        constructor: function() {
            this.enableMouseEvents = y.hitch(this, this.enableMouseEvents);
            this.disableMouseEvents = y.hitch(this, this.disableMouseEvents);
            this._processEvent = y.hitch(this, this._processEvent);
            this._initLayer()
        },
        _initLayer: function() {
            this.loaded = !0;
            this.onLoad(this)
        },
        _setMap: function() {
            var a =
                this.inherited("_setMap", arguments);
            this.enableMouseEvents();
            return a
        },
        _unsetMap: function() {
            this.disableMouseEvents();
            this.inherited("_unsetMap", arguments)
        },
        _processEvent: function(a) {
            var c = this._map,
                b = a.target,
                e;
            a.screenPoint = new K(a.pageX - c.position.x, a.pageY - c.position.y);
            for (a.mapPoint = c.toMap(a.screenPoint); b && !(e = b.e_graphic);) b = b.parentNode;
            if (e) return a.graphic = e, a
        },
        _onMouseOverHandler: function(a) {
            if (this._processEvent(a)) this.onMouseOver(a)
        },
        _onMouseMoveHandler: function(a) {
            if (this._processEvent(a)) this.onMouseMove(a)
        },
        _onMouseDragHandler: function(a) {
            if (this._processEvent(a)) this.onMouseDrag(a)
        },
        _onMouseOutHandler: function(a) {
            if (this._processEvent(a)) this.onMouseOut(a)
        },
        _onMouseDownHandler: function(a) {
            this._downGr = this._downPt = null;
            this._processEvent(a) && (v.disconnect(this._onmousemove_connect), v.disconnect(this._onmousedrag_connect), this._onmousedrag_connect = v.connect(this._div.getEventSource(), "onmousemove", this, "_onMouseDragHandler"), this._downGr = a.graphic, this._downPt = a.screenPoint.x + "," + a.screenPoint.y, this.onMouseDown(a))
        },
        _onMouseUpHandler: function(a) {
            this._upGr = this._upPt = null;
            this._processEvent(a) && (v.disconnect(this._onmousedrag_connect), v.disconnect(this._onmousemove_connect), this._onmousemove_connect = v.connect(this._div.getEventSource(), "onmousemove", this, "_onMouseMoveHandler"), this._upGr = a.graphic, this._upPt = a.screenPoint.x + "," + a.screenPoint.y, this.onMouseUp(a))
        },
        _onClickHandler: function(a) {
            if (this._processEvent(a)) {
                var c = this._downGr,
                    b = this._upGr;
                c && (b && c === b && this._downPt === this._upPt) && (t && (W._ieGraphic = a.graphic),
                    this.onClick(a))
            }
        },
        _onDblClickHandler: function(a) {
            if (this._processEvent(a)) this.onDblClick(a)
        },
        onMouseOver: function() {},
        onMouseMove: function() {},
        onMouseDrag: function() {},
        onMouseOut: function() {},
        onMouseDown: function() {},
        onMouseUp: function() {},
        onClick: function() {},
        onDblClick: function() {},
        enableMouseEvents: function() {
            if (!this._mouseEvents) {
                var a = v.connect,
                    c = this._div.getEventSource();
                F || (this._onmouseover_connect = a(c, "onmouseover", this, "_onMouseOverHandler"), this._onmousemove_connect = a(c, "onmousemove",
                    this, "_onMouseMoveHandler"), this._onmouseout_connect = a(c, "onmouseout", this, "_onMouseOutHandler"), this._onmousedown_connect = a(c, "onmousedown", this, "_onMouseDownHandler"), this._onmouseup_connect = a(c, "onmouseup", this, "_onMouseUpHandler"), this._onclick_connect = a(c, "onclick", this, "_onClickHandler"), this._ondblclick_connect = a(c, "ondblclick", this, "_onDblClickHandler"));
                this._mouseEvents = !0
            }
        },
        disableMouseEvents: function() {
            if (this._mouseEvents) {
                var a = v.disconnect;
                a(this._onmouseover_connect);
                a(this._onmousemove_connect);
                a(this._onmousedrag_connect);
                a(this._onmouseout_connect);
                a(this._onmousedown_connect);
                a(this._onmouseup_connect);
                a(this._onclick_connect);
                a(this._ondblclick_connect);
                this._mouseEvents = !1
            }
        }
    });
    x._GraphicsContainer = P;
    x._GraphicsLayer = M;
    return x
});