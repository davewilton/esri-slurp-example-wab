//>>built
define(["dojo/_base/declare", "dojo/_base/connect", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/url", "dojo/dom-construct", "dojo/dom-class", "dojo/dom-geometry", "dojo/dom-style", "dojox/collections/ArrayList", "dojox/gfx/matrix", "../kernel", "../config", "../sniff", "../domUtils", "../tileUtils", "../geometry/Point", "../geometry/Rect", "../geometry/Extent", "./layer"], function(Q, s, C, A, J, q, K, L, l, M, N, v, O, x, P, D, z, E, R, S) {
    return Q(S, {
        declaredClass: "esri.layers.TiledMapServiceLayer",
        constructor: function(a, c) {
            s.connect(this, "onLoad", this, "_initTiledLayer");
            this._lowestLevel = (this._displayLevels = c ? c.displayLevels : null) ? this._displayLevels[0] : 0;
            this.resampling = c ? c.resampling : void 0;
            this._resamplingTolerance = c ? c.resamplingTolerance : null;
            this.exclusionAreas = c ? c.exclusionAreas : null;
            var d = C.hitch;
            this._addImage = d(this, this._addImage);
            this._tileLoadHandler = d(this, this._tileLoadHandler);
            this._tileErrorHandler = d(this, this._tileErrorHandler);
            this._tilePopPop = d(this, this._tilePopPop);
            this._cleanUpRemovedImages = d(this, this._cleanUpRemovedImages);
            this._fireOnUpdateEvent =
                d(this, this._fireOnUpdateEvent);
            this._transitionEnd = d(this, this._transitionEnd);
            this._tileMapCallback = d(this, this._tileMapCallback)
        },
        opacity: 1,
        isPNG32: !1,
        _multiple: 1,
        isResampling: !1,
        _initTiledLayer: function() {
            var a = this.tileInfo,
                c = a.lods;
            this.resampling = null != this.resampling ? this.resampling : !1;
            this._tileW = a.width;
            this._tileH = a.height;
            var d = this.scales = [],
                b = this._displayLevels,
                e = "esri.layers.WMTSLayer" === this.declaredClass && 96 != a.dpi,
                g = -Infinity,
                k = Infinity,
                f = this.fullExtent,
                l = new z(f.xmin, f.ymax),
                f = new z(f.xmax, f.ymin),
                m = D.getContainingTileCoords,
                h, p, r, q = c.length;
            for (r = 0; r < q; r++)
                if (p = c[r], e && (p.scale = 96 * p.scale / a.dpi), h = m(a, l, p), p.startTileRow = 0 > h.row ? 0 : h.row, p.startTileCol = 0 > h.col ? 0 : h.col, h = m(a, f, p), p.endTileRow = h.row, p.endTileCol = h.col, !b || -1 !== A.indexOf(b, p.level)) d[r] = p.scale, g = p.scale > g ? p.scale : g, k = p.scale < k ? p.scale : k;
            e && (a.dpi = 96); - Infinity !== g && !this._hasMin && this.setMinScale(g);
            Infinity !== k && !this._hasMax && this.setMaxScale(k);
            this.setExclusionAreas(this.exclusionAreas);
            this._patchIE =
                6 <= x("ie") && 7 > x("ie") && (this.isPNG32 || "Mixed" === a.format)
        },
        _isMapAtVisibleScale: function() {
            var a = this.inherited(arguments);
            if (a) {
                var c;
                c = this._map;
                var a = this.scales,
                    d = c.getScale(),
                    b = !1,
                    e = c.width > c.height ? c.width : c.height;
                for (c = 0; c < a.length; c++)
                    if (Math.abs(a[c] - d) / a[c] < 1 / e) {
                        b = !0;
                        break
                    }
                a = b
            }
            return a
        },
        _setMap: function(a, c, d, b) {
            this.inherited(arguments);
            this._map = a;
            var e = this._div = q.create("div", null, c),
                g = a.__visibleDelta,
                k = s.connect,
                f = v._css.names,
                u = {
                    position: "absolute",
                    width: a.width + "px",
                    height: a.height +
                        "px",
                    overflow: "visible"
                },
                m = O.defaults.map.zoomDuration;
            "css-transforms" === a.navigationMode ? (u[f.transform] = v._css.translate(-g.x, -g.y), l.set(e, u), delete u[f.transform], u[f.transition] = f.transformName + " " + m + "ms ease", l.set(this._active = q.create("div", null, e), u), this._active._remove = 0, this._passives = []) : (u.left = -g.x + "px", u.top = -g.y + "px", l.set(e, u));
            this._onResizeHandler_connect = k(a, "onResize", this, "_onResizeHandler");
            this._opacityChangeHandler_connect = k(this, "onOpacityChange", this, "_opacityChangeHandler");
            g = this.tileInfo;
            k = g.spatialReference;
            f = k._getInfo();
            (this._wrap = a.wrapAround180 && k._isWrappable() && Math.abs(f.origin[0] - g.origin.x) <= f.dx) && D._addFrameInfo(g, f);
            this.setExclusionAreas(this.exclusionAreas);
            this.evaluateSuspension();
            if (this.suspended && !a.loaded) var h = s.connect(a, "onLoad", this, function() {
                s.disconnect(h);
                h = null;
                this.setExclusionAreas(this.exclusionAreas);
                this.evaluateSuspension()
            });
            return e
        },
        _unsetMap: function(a, c) {
            this.suspended || this._suspendImpl();
            q.destroy(this._div);
            this._map = this._div =
                null;
            var d = s.disconnect;
            d(this._onResizeHandler_connect);
            d(this._opacityChangeHandler_connect);
            this.inherited(arguments)
        },
        onSuspend: function() {
            this.inherited(arguments);
            this._suspendImpl()
        },
        _suspendImpl: function() {
            P.hide(this._div);
            clearTimeout(this._wakeTimer);
            this._wakeTimer = null;
            this._disableDrawConnectors();
            var a = this._tiles,
                c = this._tileIds,
                d = this._loadingList,
                b, e, g = s.disconnect,
                k = q.destroy;
            d && 0 < d.count && (d.forEach(function(c) {
                if (b = a[c]) g(b._onload_connect), g(b._onerror_connect), g(b._onabort_connect),
                    b._onload_connect = b._onerror_connect = b._onabort_connect = null
            }), d.clear(), this._fireUpdateEnd());
            this._removeList.clear();
            for (d = c.length - 1; 0 <= d; d--)(b = (e = c[d]) && a[e]) && k(b);
            if ("css-transforms" === this._map.navigationMode) {
                c = this._active;
                e = this._passives;
                var f;
                this._noDom = 0;
                for (d = e.length - 1; 0 <= d; d--) f = e[d], f._endHandle && g(f._endHandle), f._matrix = f._multiply = f._endHandle = null, f._marked = f._remove = 0, e.splice(d, 1), k(f);
                c._matrix = c._multiply = null;
                c._marked = c._remove = 0
            }
            this._tileIds = this._tiles = this._tileBounds =
                this._ct = this._loadingList = this._removeList = this._standby = null
        },
        onResume: function() {
            this.inherited(arguments);
            this._tileIds = [];
            this._tiles = [];
            this._tileBounds = [];
            this._ct = null;
            this._removeList = new M;
            this._loadingList = new M;
            P.show(this._div);
            this._enableDrawConnectors();
            this._wakeTimer = this._wakeTimer || setTimeout(C.hitch(this, function() {
                this.suspended || this._onExtentChangeHandler(this._map.extent, null, !0, this._map.__LOD)
            }), 0)
        },
        _enableDrawConnectors: function() {
            var a = this._map,
                c = s.connect;
            if ("css-transforms" ===
                a.navigationMode) {
                if (this._onScaleHandler_connect = c(a, "onScale", this, this._onScaleHandler), x("esri-touch") || x("esri-pointer")) {
                    this._standby = [];
                    var d = this,
                        b = function() {
                            d._noDom = 1
                        };
                    this._onPanStartHandler_connect = c(a, "onPanStart", b);
                    this._onZoomStartHandler_connect = c(a, "onZoomStart", b)
                }
            } else this._onZoomHandler_connect = c(a, "onZoom", this, "_onZoomHandler");
            this._onPanHandler_connect = c(a, "onPan", this, "_onPanHandler");
            this._onExtentChangeHandler_connect = c(a, "onExtentChange", this, "_onExtentChangeHandler")
        },
        _disableDrawConnectors: function() {
            var a = s.disconnect;
            a(this._onPanHandler_connect);
            a(this._onZoomHandler_connect);
            a(this._onScaleHandler_connect);
            a(this._onExtentChangeHandler_connect);
            a(this._onPanStartHandler_connect);
            a(this._onZoomStartHandler_connect);
            this._onPanHandler_connect = this._onZoomHandler_connect = this._onScaleHandler_connect = this._onExtentChangeHandler_connect = this._onPanStartHandler_connect = this._onZoomStartHandler_connect = null
        },
        _onResizeHandler: function(a, c, d) {
            a = {
                width: c + "px",
                height: d +
                    "px"
            };
            c = l.set;
            c(this._div, a);
            if ("css-transforms" === this._map.navigationMode) {
                this._active && c(this._active, a);
                for (d = this._passives.length - 1; 0 <= d; d--) c(this._passives[d], a)
            }
        },
        _onExtentChangeHandler: function(a, c, d, b) {
            c = this._map;
            var e = this._standby,
                g;
            clearTimeout(this._wakeTimer);
            this._wakeTimer = null;
            if (!c._isPanningOrZooming()) {
                if ("css-transforms" === c.navigationMode) {
                    if (d)
                        for (b = this._passives.length - 1; 0 <= b; b--) g = this._passives[b], l.set(g, v._css.names.transition, "none"), g._marked ? (this._passives.splice(b,
                            1), g.parentNode && g.parentNode.removeChild(g), q.destroy(g)) : 0 < g.childNodes.length && (g._multiply = g._multiply ? N.multiply(g._matrix, g._multiply) : g._matrix);
                    this._noDom = 0;
                    if (e && e.length)
                        for (b = e.length - 1; 0 <= b; b--) g = e[b], l.set(g, "visibility", "visible"), this._tilePopPop(g), e.splice(b, 1)
                }
                this._fireUpdateStart();
                this._rrIndex = 0;
                b = D.getCandidateTileInfo(c, this.tileInfo, a);
                a = c.__visibleDelta;
                if (!this._ct || b.lod.level !== this._ct.lod.level || d) {
                    g = b && this._ct && b.lod.level !== this._ct.lod.level;
                    this._ct = b;
                    var k = this._tiles,
                        f = this._tileIds,
                        u = this._tileBounds,
                        m = this._removeList,
                        h, p = f.length;
                    this._cleanUpRemovedImages();
                    for (b = 0; b < p; b++) e = f[b], h = k[e], u[e] = f[b] = null, "css-transforms" === c.navigationMode && (g && h.parentNode && c.fadeOnZoom) && (h._fadeOut = g, h.parentNode._remove++), m.add(h);
                    d && (this._tileIds = [], this._tiles = [], this._tileBounds = [])
                }
                b = a.x;
                d = a.y;
                "css-transforms" === c.navigationMode ? (e = {}, e[v._css.names.transform] = v._css.translate(b, d), l.set(this._div, e)) : l.set(this._div, {
                    left: b + "px",
                    top: d + "px"
                });
                this.__coords_dx = b;
                this.__coords_dy =
                    d;
                this._updateImages(new E(0, 0, a.width, a.height));
                0 === this._loadingList.count ? (this._cleanUpRemovedImages(), this.onUpdate(), this._fireUpdateEnd()) : this._fireOnUpdate = !0;
                d = this._tileW;
                k = this._tileH;
                a = new E(-a.x, -a.y, a.width, a.height);
                for (b = this._tileIds.length - 1; 0 <= b; b--)(e = this._tileIds[b]) ? (g = this._tiles[e], f = L.getMarginBox(g), f = new E(f.l, f.t, d, k), "css-transforms" === c.navigationMode && (f.x = g._left, f.y = g._top), a.intersects(f) ? this._tileBounds[e] = f : (this._loadingList.contains(e) && this._tilePopPop(g),
                    q.destroy(g), this._tileIds.splice(b, 1), delete this._tileBounds[e], delete this._tiles[e])) : (this._tileIds.splice(b, 1), delete this._tileBounds[e], delete this._tiles[e])
            }
        },
        _onPanHandler: function(a, c) {
            var d = this._map,
                b = d.__visibleDelta.offset(c.x, c.y);
            this.__coords_dx = this.__coords_dy = 0;
            "css-transforms" === d.navigationMode ? (d = {}, d[v._css.names.transform] = v._css.translate(b.x, b.y), l.set(this._div, d), !x("esri-touch") && !x("esri-pointer") && this._updateImages({
                    x: -b.x,
                    y: -b.y,
                    width: b.width,
                    height: b.height
                })) :
                (l.set(this._div, {
                    left: b.x + "px",
                    top: b.y + "px"
                }), this._updateImages({
                    x: -b.x,
                    y: -b.y,
                    width: b.width,
                    height: b.height
                }));
            0 < this._loadingList.count && (this._fireUpdateStart(), this._fireOnUpdate = !0)
        },
        _onScaleHandler: function(a, c) {
            var d, b = {},
                e = v._css.names,
                g = this._map,
                k = O.defaults.map.zoomDuration;
            for (d = this._passives.length - 1; 0 <= d; d--) {
                var f = this._passives[d];
                0 === f.childNodes.length ? (this._passives.splice(d, 1), q.destroy(f)) : ("none" === f.style[e.transition] && l.set(f, e.transition, e.transformName + " " + k + "ms ease"),
                    l.set(f, e.transition, c ? "none" : e.transformName + " " + k + "ms ease"), f._matrix = a, b[e.transform] = v._css.matrix(f._multiply ? N.multiply(a, f._multiply) : a), l.set(f, b))
            }
            this._active && 0 === this._active.childNodes.length || (l.set(this._active, e.transition, c ? "none" : e.transformName + " " + k + "ms ease"), this._active._matrix = a, b[e.transform] = v._css.matrix(this._active._matrix), l.set(this._active, b), this._passives.push(this._active), b = {
                    position: "absolute",
                    width: g.width + "px",
                    height: g.height + "px",
                    overflow: "visible"
                }, b[e.transition] =
                e.transformName + " " + k + "ms ease", l.set(this._active = q.create("div", null, this._div), b), this._active._remove = 0, g.fadeOnZoom && q.place(this._active, this._div, "first"))
        },
        _onZoomHandler: function(a, c, d) {
            a = L.getMarginBox(this._div);
            d = d.offset(-a.l, -a.t);
            if (!this._previousScale || 1 === c) this._previousScale = 1;
            var b, e = this._tileW * c,
                g = this._tileH * c,
                k = this._tileBounds,
                f = this._tiles,
                u = this._previousScale,
                m = this._multiple,
                h = l.set,
                p, r;
            if ((a = x("ie")) && 8 > a) A.forEach(this._tileIds, function(a) {
                r = "";
                b = k[a];
                p = f[a].style.margin.split(" ");
                A.forEach(p, function(a) {
                    "" !== r && (r += " ");
                    a = parseFloat(a);
                    r += a / u * c + "px"
                });
                h(f[a], {
                    left: b.x - (e - b.width) * (d.x - b.x) / b.width + "px",
                    top: b.y - (g - b.height) * (d.y - b.y) / b.height + "px",
                    margin: 1 !== m && -1 === r.indexOf("NaN") ? r : "",
                    zoom: c
                })
            });
            else {
                var q = e * m,
                    T = g * m,
                    n, v;
                A.forEach(this._tileIds, function(a) {
                    r = "";
                    b = k[a];
                    n = b.x - (e - b.width) * (d.x - b.x) / b.width;
                    v = b.y - (g - b.height) * (d.y - b.y) / b.height;
                    p = f[a].style.margin.split(" ");
                    A.forEach(p, function(a) {
                        "" !== r && (r += " ");
                        a = parseFloat(a);
                        r += a / u * c + "px"
                    });
                    h(f[a], {
                        left: n + "px",
                        top: v + "px",
                        margin: 1 !== m && -1 === r.indexOf("NaN") ? r : "",
                        width: q + "px",
                        height: T + "px"
                    })
                })
            }
            this._previousScale = c
        },
        _updateImages: function(a) {
            if (this._ct) {
                var c, d = this._tileW,
                    b = this._tileH,
                    e = this._ct;
                c = e.lod;
                var e = e.tile,
                    g = e.offsets,
                    k = e.coords,
                    f = k.row,
                    k = k.col,
                    l = c.level,
                    m = this.opacity,
                    h = this._tileIds,
                    p = this._loadingList,
                    r = this._addImage,
                    q = this._map.id,
                    v = this.id,
                    n = a.x,
                    s = a.y,
                    x = c.startTileRow,
                    z = c.endTileRow,
                    C = c.startTileCol,
                    D = c.endTileCol,
                    E = A.indexOf,
                    y, t, H = g.x - this.__coords_dx,
                    F = g.y - this.__coords_dy;
                t = d - H + -a.x;
                var w = b - F +
                    -a.y;
                y = Math.ceil;
                t = 0 < t ? t % d : d - Math.abs(t) % d;
                w = 0 < w ? w % b : b - Math.abs(w) % b;
                n = 0 < n ? Math.floor((n + H) / d) : y((n - (d - H)) / d);
                s = 0 < s ? Math.floor((s + F) / b) : y((s - (b - F)) / b);
                F = n + y((a.width - t) / d);
                a = s + y((a.height - w) / b);
                var B, G, I;
                this._wrap && (B = c._frameInfo, G = B[0], I = B[1], B = B[2]);
                for (w = n; w <= F; w++)
                    for (n = s; n <= a; n++) y = f + n, t = k + w, this._wrap && (t < I ? (t %= G, t = t < I ? t + G : t) : t > B && (t %= G)), !this._isExcluded(l, y, t) && (y >= x && y <= z && t >= C && t <= D) && (c = q + "_" + v + "_tile_" + l + "_" + n + "_" + w, -1 === E(h, c) && (p.add(c), h.push(c), r(l, n, y, w, t, c, d, b, m, e, g)))
            }
        },
        _cleanUpRemovedImages: function() {
            var a =
                this._removeList,
                c = q.destroy,
                d, b = v._css.names;
            a.forEach(function(a) {
                a._fadeOut || (a.style.filter = "", a.style.zoom = 1, c(a))
            });
            if ("css-transforms" === this._map.navigationMode)
                for (d = this._passives.length - 1; 0 <= d; d--) {
                    var e = this._passives[d];
                    0 === e.childNodes.length ? (this._passives.splice(d, 1), c(e)) : this._map.fadeOnZoom && (!e._marked && e._remove === e.childNodes.length) && (e._marked = 1, 2048 > v._css.getScaleFromMatrix(l.get(e, b.transform)) ? (l.set(e, b.transition, "opacity 0.65s"), l.set(e, "opacity", 0), s.disconnect(e._endHandle),
                        e._endHandle = s.connect(e, b.endEvent, this._transitionEnd)) : this._transitionEnd({
                        propertyName: "opacity",
                        target: e
                    }))
                }
            a.clear()
        },
        _transitionEnd: function(a) {
            var c = a.target;
            "opacity" === a.propertyName && (s.disconnect(c._endHandle), c._endHandle = null, a = A.indexOf(this._passives, c), -1 < a && this._passives.splice(a, 1), c.parentNode && c.parentNode.removeChild(c), q.destroy(c))
        },
        _addImage: function(a, c, d, b, e, g, k, f, u, m, h) {
            if (this._patchIE) m = this._tiles[g] = q.create("div"), m.id = g, K.add(m, "layerTile"), l.set(m, {
                left: k * b - h.x +
                    "px",
                top: f * c - h.y + "px",
                width: k + "px",
                height: f + "px",
                filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(src\x3d'" + this.getTileUrl(a, d, e) + "', sizingMethod\x3d'scale')"
            }), 1 > u && l.set(m, "opacity", u), a = m.appendChild(q.create("div")), l.set(a, {
                opacity: 0,
                width: k + "px",
                height: f + "px"
            }), this._div.appendChild(m), this._loadingList.remove(g), this._fireOnUpdateEvent();
            else {
                m = this._tiles[g] = q.create("img");
                var p = s.connect;
                m.id = g;
                K.add(m, "layerTile");
                b = k * b - h.x;
                h = f * c - h.y;
                c = this._map;
                var r = v._css.names;
                k = {
                    width: k +
                        "px",
                    height: f + "px",
                    visibility: "hidden"
                };
                "css-transforms" === c.navigationMode ? (k[r.transform] = v._css.translate(b, h), l.set(m, k), m._left = b, m._top = h) : (k.left = b + "px", k.top = h + "px", l.set(m, k));
                1 > u && l.set(m, "opacity", u);
                m._onload_connect = p(m, "onload", this, "_tileLoadHandler");
                m._onerror_connect = p(m, "onerror", C.hitch(this, "_tileErrorHandler", d, e));
                m._onabort_connect = p(m, "onabort", this, "_tileAbortHandler");
                if (this.tileMap) this.tileMap.getTile(a, d, e, g, this._tileMapCallback);
                else if (g = this.getTileUrl(a, d, e, m)) this._failedRequests &&
                    this._failedRequests[g] ? (l.set(m, this._failedRequests[g].css), m.src = this._failedRequests[g].src, this._multiple = parseInt(this._failedRequests[g].css.width) / this._tileW, this.isResampling = 1 !== this._multiple) : (this._multiple = 1, this.isResampling = !1, m.src = g);
                "css-transforms" === c.navigationMode ? this._active.appendChild(m) : this._div.appendChild(m)
            }
        },
        _tileMapCallback: function(a, c) {
            var d, b;
            !this.suspended && this._tiles[c.id] && (this._multiple = 2 * (c.level - a.level) || 1, this.isResampling = 1 !== this._multiple, b = this._tiles[c.id],
                d = this.tileMap.style(a, c), l.set(b, d), b.src = this.getTileUrl(a.level, a.row, a.col))
        },
        getTileUrl: function(a, c, d) {},
        _reCheckTS: /[\?\&]_ts=/ig,
        _reReplaceTS: /([\?\&]_ts=)[0-9]+/ig,
        addTimestampToURL: function(a) {
            var c = this._refreshTS;
            c && (a = this._reCheckTS.test(a) ? a.replace(this._reReplaceTS, "$$$1" + c) : a + ((-1 === a.indexOf("?") ? "?" : "\x26") + "_ts\x3d" + c));
            return a
        },
        refresh: function() {
            this.suspended || (this._refreshTS = (new Date).getTime(), this._onExtentChangeHandler(this._map.extent, null, !0, this._map.__LOD))
        },
        _tilePopPop: function(a) {
            var c =
                s.disconnect;
            c(a._onload_connect);
            c(a._onerror_connect);
            c(a._onabort_connect);
            a._onload_connect = a._onerror_connect = a._onabort_connect = null;
            this._loadingList.remove(a.id);
            this._fireOnUpdateEvent()
        },
        _tileLoadHandler: function(a) {
            a = a.currentTarget;
            this._noDom ? this._standby.push(a) : (l.set(a, "visibility", "visible"), this._tilePopPop(a))
        },
        _tileAbortHandler: function(a) {
            a = a.currentTarget;
            this.onError(Error("Unable to load tile: " + a.src));
            l.set(a, "visibility", "hidden");
            this._tilePopPop(a)
        },
        _tileErrorHandler: function(a,
            c, d) {
            d = d.currentTarget;
            var b, e, g = !0;
            if (this.tileMap || !this.resampling) g = !1;
            else if (b = new J(d.src), b = b.path.split("/"), b = parseInt(b[b.length - 3]), e = this._ct.lod.level - b + 1, this._multiple = Math.pow(2, e), b === this._lowestLevel || 0 === this._resamplingTolerance || this._resamplingTolerance && Math.log(this._multiple) / Math.LN2 > this._resamplingTolerance) g = !1;
            g ? (this.isResampling = !0, this._resample(d, a, c)) : (this.onError(Error("Unable to load tile: " + d.src)), l.set(d, "visibility", "hidden"), this._tilePopPop(d))
        },
        _resample: function(a,
            c, d) {
            var b = (new J(a.src)).path.split("/"),
                e = this._multiple,
                g = parseInt(b[b.length - 3]) - 1,
                k = parseInt(c / e),
                f = parseInt(d / e),
                b = d % e,
                u = c % e,
                k = this.getTileUrl(g, k, f);
            c = this.getTileUrl(g + Math.log(e) / Math.LN2, c, d);
            e = {
                width: this._tileW * e + "px",
                height: this._tileH * e + "px",
                margin: "-" + this._tileW * u + "px 0 0 " + ("-" + this._tileH * b + "px")
            };
            this._failedRequests || (this._failedRequests = {});
            this._failedRequests[c] = {
                src: k,
                css: e
            };
            l.set(a, e);
            x("chrome") && a.setAttribute("src", null);
            a.src = k
        },
        _fireOnUpdateEvent: function() {
            0 === this._loadingList.count &&
                (this._cleanUpRemovedImages(), this._fireOnUpdate && (this._fireOnUpdate = !1, this.onUpdate(), this._fireUpdateEnd()))
        },
        setOpacity: function(a) {
            if (this.opacity != a) this.onOpacityChange(this.opacity = a)
        },
        onOpacityChange: function() {},
        _opacityChangeHandler: function(a) {
            var c = l.set,
                d, b, e;
            if ("css-transforms" === this._map.navigationMode) {
                if (this._active) {
                    e = this._active.childNodes;
                    for (d = e.length - 1; 0 <= d; d--) c(e[d], "opacity", a)
                }
                for (d = this._passives.length - 1; 0 <= d; d--) {
                    e = this._passives[d].childNodes;
                    for (b = e.length - 1; 0 <=
                        b; b--) c(e[b], "opacity", a)
                }
            } else {
                e = this._div.childNodes;
                for (d = e.length - 1; 0 <= d; d--) c(e[d], "opacity", a)
            }
        },
        setExclusionAreas: function(a) {
            this.exclusionAreas = a;
            if (this.loaded && this._map && this._map.loaded) {
                var c = this._map.spatialReference,
                    d = this.tileInfo,
                    b = d.origin,
                    e = d.lods,
                    g = e[0].level,
                    k = e[e.length - 1].level,
                    f, l, m, h, p, r, s, q, n;
                if (!this.exclusionAreas || !this.exclusionAreas.length) this._exclusionsPerZoom = null;
                else {
                    this._exclusionsPerZoom = [];
                    l = 0;
                    for (m = a.length; l < m; l++)
                        if (f = a[l], (n = f.geometry) && "extent" === n.type &&
                            n.xmin <= n.xmax && n.ymin <= n.ymax) {
                            if (!c.equals(n.spatialReference))
                                if (c._canProject(n.spatialReference)) c.isWebMercator() ? (q = z.lngLatToXY(n.xmin, n.ymin), n = z.lngLatToXY(n.xmax, n.ymax)) : (q = z.xyToLngLat(n.xmin, n.ymin, !0), n = z.xyToLngLat(n.xmax, n.ymax, !0)), n = new R(q[0], q[1], n[0], n[1], c);
                                else continue;
                            s = -1;
                            if (f.minZoom && -1 !== f.minZoom) s = f.minZoom;
                            else if (f.minScale && -1 !== f.minScale) {
                                h = 0;
                                for (p = e.length; h < p; h++)
                                    if (e[h].scale <= f.minScale) {
                                        s = e[h].level;
                                        break
                                    }
                            }
                            s = Math.max(s, g);
                            q = -1;
                            if (f.maxZoom && -1 !== f.maxZoom) q =
                                f.maxZoom;
                            else if (f.maxScale && -1 !== f.maxScale) {
                                h = 0;
                                for (p = e.length; h < p; h++)
                                    if (e[h].scale < f.maxScale) {
                                        q = e[h - 1].level;
                                        break
                                    } else if (e[h].scale === f.maxScale) {
                                    q = e[h].level;
                                    break
                                }
                            }
                            q = -1 === q ? k : Math.min(q, k);
                            for (f = s; f <= q; f++) {
                                h = 0;
                                for (p = e.length; h < p; h++)
                                    if (e[h].level === f) {
                                        r = e[h];
                                        break
                                    }
                                r && (this._exclusionsPerZoom[f] || (this._exclusionsPerZoom[f] = []), h = 1 / r.resolution / d.rows, p = 1 / r.resolution / d.cols, this._exclusionsPerZoom[f].push({
                                    rowFrom: Math.floor((b.y - n.ymax) * h),
                                    rowTo: Math.ceil((b.y - n.ymin) * h),
                                    colFrom: Math.floor((n.xmin -
                                        b.x) * p),
                                    colTo: Math.ceil((n.xmax - b.x) * p)
                                }))
                            }
                        }
                }
                this.suspended || this._onExtentChangeHandler(this._map.extent, null, !0, this._map.__LOD)
            }
        },
        _isExcluded: function(a, c, d) {
            var b, e, g;
            if (!this._exclusionsPerZoom) return !1;
            b = this._exclusionsPerZoom[a];
            if (!b) return !1;
            e = 0;
            for (g = b.length; e < g; e++)
                if (a = b[e], c >= a.rowFrom && c < a.rowTo && d >= a.colFrom && d < a.colTo) return !0;
            return !1
        }
    })
});