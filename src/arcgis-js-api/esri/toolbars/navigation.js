//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/connect", "dojo/_base/Color", "dojo/has", "../kernel", "./_toolbar", "../undoManager", "../OperationBase", "../geometry/Extent", "../geometry/Rect", "../symbols/SimpleLineSymbol", "../symbols/SimpleFillSymbol", "../graphic"], function(g, f, c, h, n, u, p, q, r, s, k, l, m, t) {
    var e = g(p, {
        declaredClass: "esri.toolbars.Navigation",
        _eventMap: {
            "extent-history-change": !0
        },
        constructor: function(a) {
            this.zoomSymbol = new m(m.STYLE_SOLID, new l(l.STYLE_SOLID, new h([255, 0, 0]), 2), new h([0, 0, 0, 0.25]));
            c.connect(a, "onUnload", this, "_cleanUp");
            this.map = a;
            this._undoManager = new q({
                maxOperations: -1
            });
            this._normalizeRect = f.hitch(this, this._normalizeRect);
            this._onMouseDownHandler = f.hitch(this, this._onMouseDownHandler);
            this._onMouseUpHandler = f.hitch(this, this._onMouseUpHandler);
            this._onMouseDragHandler = f.hitch(this, this._onMouseDragHandler);
            this._swipeCheck = n("esri-pointer");
            this._onExtentChangeHandler_connect = c.connect(a, "onExtentChange", this, "_extentChangeHandler");
            this._onMapLoad_connect = c.connect(a,
                "onLoad", this, "_mapLoadHandler");
            a.loaded && a.extent && (this._currentExtent = a.extent)
        },
        _mapLoadHandler: function() {
            this._currentExtent = this.map.extent
        },
        _navType: null,
        _start: null,
        _graphic: null,
        _prevExtent: !1,
        _currentExtent: null,
        _preExtent: null,
        _cleanUp: function(a) {
            c.disconnect(this._onExtentChangeHandler_connect);
            c.disconnect(this._onMapLoad_connect)
        },
        activate: function(a) {
            var b = this.map;
            this._graphic || (this._deactivateMapTools(!0, !1, !1, !0), this._graphic = new t(null, this.zoomSymbol));
            switch (a) {
                case e.ZOOM_IN:
                case e.ZOOM_OUT:
                    this._deactivate();
                    this._swipeCheck ? (this._onMouseDownHandler_connect = c.connect(b, "onSwipeStart", this, "_onMouseDownHandler"), this._onMouseDragHandler_connect = c.connect(b, "onSwipeMove", this, "_onMouseDragHandler"), this._onMouseUpHandler_connect = c.connect(b, "onSwipeEnd", this, "_onMouseUpHandler")) : (this._onMouseDownHandler_connect = c.connect(b, "onMouseDown", this, "_onMouseDownHandler"), this._onMouseDragHandler_connect = c.connect(b, "onMouseDrag", this, "_onMouseDragHandler"), this._onMouseUpHandler_connect = c.connect(b, "onMouseUp",
                        this, "_onMouseUpHandler"));
                    this._navType = a;
                    break;
                case e.PAN:
                    this._deactivate(), b.enablePan(), this._navType = a
            }
        },
        _extentChangeHandler: function(a) {
            this._prevExtent || this._nextExtent ? this._currentExtent = a : (this._preExtent = this._currentExtent, this._currentExtent = a, this._preExtent && this._currentExtent && (a = new e.MapExtent({
                map: this.map,
                preExtent: this._preExtent,
                currentExtent: this._currentExtent
            }), this._undoManager.add(a)));
            this._prevExtent = this._nextExtent = !1;
            this.onExtentHistoryChange()
        },
        _deactivate: function() {
            var a =
                this._navType;
            if (a === e.PAN) this.map.disablePan();
            else if (a === e.ZOOM_IN || a === e.ZOOM_OUT) c.disconnect(this._onMouseDownHandler_connect), c.disconnect(this._onMouseDragHandler_connect), c.disconnect(this._onMouseUpHandler_connect)
        },
        _normalizeRect: function(a, b, d) {
            var c = a.x;
            a = a.y;
            var e = b.x;
            b = b.y;
            var f = Math.abs(c - e),
                g = Math.abs(a - b);
            return {
                x: Math.min(c, e),
                y: Math.max(a, b),
                width: f,
                height: g,
                spatialReference: d
            }
        },
        _onMouseDownHandler: function(a) {
            this._start = a.mapPoint
        },
        _onMouseDragHandler: function(a) {
            var b = this._graphic,
                d = this.map.graphics;
            d.remove(b, !0);
            b.setGeometry(new k(this._normalizeRect(this._start, a.mapPoint, this.map.spatialReference)));
            d.add(b, !0)
        },
        _onMouseUpHandler: function(a) {
            var b = this.map,
                d = this._normalizeRect(this._start, a.mapPoint, b.spatialReference);
            b.graphics.remove(this._graphic, !0);
            if (!(0 === d.width && 0 === d.height))
                if (this._navType === e.ZOOM_IN) b.setExtent((new k(d)).getExtent());
                else {
                    a = b.toScreen(d);
                    var d = b.toScreen({
                            x: d.x + d.width,
                            y: d.y,
                            spatialReference: b.spatialReference
                        }),
                        c = b.extent.getWidth();
                    a = (c * b.width / Math.abs(d.x - a.x) - c) / 2;
                    d = b.extent;
                    b.setExtent(new s(d.xmin - a, d.ymin - a, d.xmax + a, d.ymax + a, d.spatialReference))
                }
        },
        deactivate: function() {
            this._deactivate();
            this._graphic && this.map.graphics.remove(this._graphic, !0);
            this._navType = this._start = this._graphic = null;
            this._activateMapTools(!0, !1, !1, !0)
        },
        setZoomSymbol: function(a) {
            this.zoomSymbol = a
        },
        isFirstExtent: function() {
            return !this._undoManager.canUndo
        },
        isLastExtent: function() {
            return !this._undoManager.canRedo
        },
        zoomToFullExtent: function() {
            var a =
                this.map;
            a.setExtent(a.getLayer(a.layerIds[0]).initialExtent)
        },
        zoomToPrevExtent: function() {
            this._undoManager.canUndo && (this._prevExtent = !0, this._undoManager.undo())
        },
        zoomToNextExtent: function() {
            this._undoManager.canRedo && (this._nextExtent = !0, this._undoManager.redo())
        },
        onExtentHistoryChange: function() {}
    });
    f.mixin(e, {
        ZOOM_IN: "zoomin",
        ZOOM_OUT: "zoomout",
        PAN: "pan"
    });
    e.MapExtent = g(r, {
        declaredClass: "esri.toolbars.MapExtent",
        label: "extent changes",
        constructor: function(a) {
            this.map = a.map;
            this.preExtent = a.preExtent;
            this.currentExtent = a.currentExtent
        },
        performRedo: function() {
            this.map.setExtent(this.currentExtent)
        },
        performUndo: function() {
            this.map.setExtent(this.preExtent)
        }
    });
    return e
});