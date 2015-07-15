//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/connect", "dojo/_base/array", "dojo/sniff", "dojo/dom-construct", "dojo/dom-style", "dojo/number", "../lang", "../domUtils", "./layer", "./ImageServiceLayerMixin", "../SpatialReference", "../geometry/Point"], function(g, q, d, h, k, l, e, r, m, f, n, p, s, t) {
    return g([n, p], {
        declaredClass: "esri.layers.RasterLayer",
        constructor: function(a, b) {
            this.drawMode = b && void 0 !== b.drawMode ? b.drawMode : !0;
            this.drawType = b && b.drawType ? b.drawType : "2d";
            this._initialize(a, b)
        },
        opacity: 1,
        setDrawMode: function(a) {
            this.drawMode =
                a
        },
        setOpacity: function(a) {
            if (this.opacity != a) this.onOpacityChange(this.opacity = a)
        },
        onOpacityChange: function() {},
        refresh: function() {
            if (!this._canDraw() || 10 > k("ie")) this.onError(Error("Unable to refresh. This layer is not supported in the current browser."));
            else this._map && this._extentChangeHandler(this._map.extent)
        },
        clear: function() {
            this._canDraw() && "2d" === this.drawType && this._context.clearRect(0, 0, this._mapWidth, this._mapHeight)
        },
        getContext: function() {
            return this._context
        },
        _setMap: function(a, b) {
            this.inherited(arguments);
            var c = this._element = l.create("canvas", {
                id: "canvas",
                width: a.width + "px",
                height: a.height + "px",
                style: "position: absolute; left: 0px; top: 0px;"
            }, b);
            m.isDefined(this.opacity) && e.set(c, "opacity", this.opacity);
            (this._context = c.getContext(this.drawType)) || console.error("Unable to create the context. This browser might not support \x3ccanvas\x3e elements.");
            this._mapWidth = a.width;
            this._mapHeight = a.height;
            this._connects = [];
            this._connects.push(d.connect(a, "onPan", this, this._panHandler));
            this._connects.push(d.connect(a,
                "onZoom", this, this._onZoomHandler));
            this._connects.push(d.connect(a, "onResize", this, this._onResizeHandler));
            this._connects.push(d.connect(a, "onExtentChange", this, this._extentChangeHandler));
            this._connects.push(d.connect(this, "onVisibilityChange", this, this._visibilityChangeHandler));
            this._connects.push(d.connect(this, "onOpacityChange", this, this._opacityChangeHandler));
            this._connects.push(d.connect(this, "onElevationChange", this, this._elevationChangeHandler));
            this._startRect = {
                left: 0,
                top: 0,
                width: a.width,
                height: a.height,
                zoom: 1
            };
            this.refresh();
            return c
        },
        _unsetMap: function(a, b) {
            h.forEach(this._connects, d.disconnect, this);
            this._element && b.removeChild(this._element);
            this._map = this._element = this._context = this.data = this._connects = null;
            this.inherited(arguments)
        },
        _canDraw: function() {
            return this._map && this._element && this._context ? !0 : !1
        },
        _panHandler: function(a, b) {
            e.set(this._element, {
                left: b.x + "px",
                top: b.y + "px"
            })
        },
        _onZoomHandler: function(a, b, c) {
            a = this._startRect;
            targetWidth = a.width * b;
            targetHeight = a.height * b;
            e.set(this._element, {
                left: a.left - (targetWidth - a.width) * (c.x - a.left) / a.width + "px",
                top: a.top - (targetHeight - a.height) * (c.y - a.top) / a.height + "px",
                width: targetWidth + "px",
                height: targetHeight + "px"
            })
        },
        _onResizeHandler: function(a, b, c) {
            e.set(this._element, {
                width: b + "px",
                height: c + "px"
            });
            this._startRect.width = this._element.width = b;
            this._startRect.height = this._element.height = c
        },
        _extentChangeHandler: function(a, b, c, d) {
            this._fireUpdateStart();
            this.setImageFormat("LERC", !0);
            a = this._map;
            this._requestData(a.extent, a.width,
                a.height)
        },
        _requestDataErrorHandler: function(a) {
            this.clear();
            this.onError(a)
        },
        _drawPixelData: function() {
            e.set(this._element, {
                left: "0px",
                top: "0px",
                width: this._map.width + "px",
                height: this._map.height + "px"
            });
            if (this._canDraw && this.drawMode && this.drawMode)
                if (!this.pixelData || !this.pixelData.pixelBlock) this.clear();
                else {
                    var a = this.pixelData.pixelBlock,
                        b = this._context,
                        c = b.createImageData(a.width, a.height);
                    c.data.set(a.getAsRGBA());
                    b.putImageData(c, 0, 0);
                    this._fireUpdateEnd()
                }
        },
        _visibilityChangeHandler: function(a) {
            a ?
                f.show(this._element) : f.hide(this._element)
        },
        _opacityChangeHandler: function(a) {
            e.set(this._element, "opacity", a)
        }
    })
});