//>>built
define(["../kernel", "dijit/_OnDijitClickMixin", "dijit/_TemplatedMixin", "dijit/_WidgetBase", "dijit/Tooltip", "../dijit/RendererSlider", "../Color", "dojo/_base/array", "dojo/_base/declare", "dojo/_base/lang", "dojo/i18n!../nls/jsapi", "dojo/dom-geometry", "dojo/dom-style", "dojo/Evented", "dojo/has", "dojo/number", "dojo/string", "dojox/gfx", "dojo/text!./OpacitySlider/templates/OpacitySlider.html"], function(A, n, p, q, r, s, t, k, u, d, v, m, f, w, B, x, y, g, z) {
    return u("esri.dijit.OpacitySlider", [q, p, n, w], {
        baseClass: "esriOpacitySlider",
        basePath: require.toUrl("esri/dijit/OpacitySlider/"),
        templateString: z,
        domNode: null,
        containerNode: null,
        opacityInfo: null,
        minValue: null,
        maxValue: null,
        histogram: null,
        statistics: null,
        handles: null,
        _histogramWidthDefault: 100,
        _rampWidthDefault: 25,
        showLabels: null,
        showTicks: null,
        showHandles: null,
        showHistogram: !0,
        showStatistics: !0,
        _rampNode: null,
        _sliderHeight: null,
        _updateTimer: null,
        showTransparentBackground: !0,
        _transparentBackgroundNode: null,
        zoomOptions: {},
        constructor: function(a, b) {
            this.inherited(arguments);
            b && (this.domNode = b, this.containerNode = this._containerNode,
                this.statistics = a.statistics || !1, this.histogram = a.histogram || !1, this.histogramWidth = a.histogramWidth || this._histogramWidthDefault, this.rampWidth = a.rampWidth || this._rampWidthDefault, this.zoomOptions = a.zoomOptions || null, this.opacityInfo = a.opacityInfo, this.handles = a.handles || [0, 1], this.showLabels = a.showLabels || !0, this.showTicks = a.showTicks || !0, this.showHandles = a.showHandles || !0, this.statistics ? (this.minValue = this.statistics.min, this.maxValue = this.statistics.max) : (this.minValue = 0, this.maxValue = 100), void 0 !==
                a.minValue && (this.minValue = a.minValue), void 0 !== a.maxValue && (this.maxValue = a.maxValue), this.showTransparentBackground = a.showTransparentBackground || !0)
        },
        postCreate: function() {
            this.inherited(arguments);
            this.minValue === this.maxValue && (0 === this.minValue ? this.maxValue = 100 : null === this.minValue ? (this.minValue = 0, this.maxValue = 100) : (this.maxValue = 2 * this.minValue, this.minValue = 0));
            null === this.minValue && (this.minValue = 0);
            null === this.maxValue && (this.maxValue = 100);
            null !== this.zoomOptions && (this.toggleSliderBottom =
                this.zoomOptions.minSliderValue > this.minValue, this.toggleSliderTop = this.zoomOptions.maxSliderValue < this.maxValue);
            this.values = this._getHandleInfo(d.clone(this.opacityInfo.stops))
        },
        startup: function() {
            this.inherited(arguments);
            this._slider = new s({
                type: "OpacitySlider",
                values: this.values,
                minLabel: this.zoomOptions ? this.minValue : null,
                maxLabel: this.zoomOptions ? this.maxValue : null,
                minimum: this.zoomOptions ? this.zoomOptions.minSliderValue : this.minValue,
                maximum: this.zoomOptions ? this.zoomOptions.maxSliderValue : this.maxValue,
                _isZoomed: this.zoomOptions ? !0 : !1,
                showLabels: this.showLabels,
                showTicks: this.showTicks,
                showHandles: this.showHandles
            }, this._sliderNode);
            this._slider.startup();
            this._rampNode = this._slider._sliderAreaRight;
            this._sliderHeight = f.get(this._rampNode, "height") || 155;
            this._valuesAutoAdjust();
            this._createSVGSurfaces();
            this._slider.on("slide", d.hitch(this, function(a) {
                this._valuesAutoAdjust();
                this._fillRamp()
            }));
            this._slider.on("change", d.hitch(this, function(a) {
                this.values = a.values;
                this._updateOpacityInfo(a.values);
                this.emit("change", d.clone(this.opacityInfo))
            }));
            this._slider.on("handle-value-change", d.hitch(this, function(a) {
                this.values = a.values;
                this._updateOpacityInfo(a.values);
                this._valuesAutoAdjust();
                this._fillRamp();
                this.emit("handle-value-change", d.clone(this.opacityInfo))
            }));
            this._slider.on("data-value-change", d.hitch(this, function(a) {
                this.minValue = a.min;
                this.maxValue = a.max;
                this._updateRendererSlider();
                this.emit("data-value-change", {
                    minValue: this.minValue,
                    maxValue: this.maxValue,
                    opacityInfo: d.clone(this.opacityInfo)
                })
            }));
            this._slider.on("stop", d.hitch(this, function(a) {
                this.emit("handle-value-change", d.clone(this.opacityInfo))
            }));
            this.showHistogram && (this.histogram || this.zoomOptions && this.zoomOptions.histogram) && this._generateHistogram();
            this.statistics && this.showStatistics && this._generateStatistics();
            this.watch("minValue", this._updateTimeout);
            this.watch("maxValue", this._updateTimeout);
            this.watch("opacityInfo", this._updateTimeout);
            this.watch("statistics", this._updateTimeout);
            this.watch("histogram", this._updateTimeout);
            this.watch("zoomOptions", this._updateTimeout);
            this.watch("showHandles", this._updateTimeout);
            this.watch("showLabels", this._updateTimeout);
            this.watch("showTicks", this._updateTimeout);
            this.watch("showHistogram", this._toggleHistogram);
            this.watch("showTransparentBackground", this._toggleTransparentBackground)
        },
        _updateOpacityInfo: function(a) {
            k.forEach(this.opacityInfo.stops, d.hitch(this, function(b, c) {
                b.value = a[c].value;
                b.opacity = a[c].opacity
            }))
        },
        _generateStatistics: function() {
            var a = this.statistics;
            if (!(2 >
                    a.count)) {
                var b = this._slider,
                    c = this.zoomOptions || null,
                    e, h;
                a.min === a.max && a.min === a.avg ? (e = 0, h = 2 * a.avg) : (e = a.min, h = a.max);
                if (e !== b.minimum || h !== b.maximum) e = b.minimum, h = b.maximum;
                c && (e = c.minSliderValue, h = c.maxSliderValue);
                b = [{
                    value: a.avg,
                    label: "average"
                }];
                b = k.filter(b, function(a) {
                    return a.value >= e && a.value <= h
                });
                k.forEach(b, d.hitch(this, function(b) {
                    b = this._sliderHeight * (h - b.value) / (h - e);
                    this._avgHandleLine = this._histogramSurface.createLine({
                        x1: 0,
                        y1: b,
                        x2: this.histogramWidth,
                        y2: b
                    }).setStroke("#c0c0c0").moveToBack();
                    this._avgHandleImage = this._histogramSurface.createImage({
                        x: m.isBodyLtr() ? this.histogramWidth + 2 : 0,
                        y: b - 8,
                        width: 12,
                        height: 14,
                        src: this.basePath + "images/xAvg.png"
                    });
                    b = y.substitute(v.widgets.rendererSlider.statsAvg, {
                        avg: x.format(a.avg, {
                            places: this._getPrecision()
                        })
                    });
                    this._avgHandleTooltip = new r({
                        connectId: [this._avgHandleImage.rawNode],
                        label: b
                    })
                }))
            }
        },
        _valuesAutoAdjust: function() {
            var a = this._slider.values,
                b, c, e, h, d, g, f, l = [];
            k.forEach(a, function(a, b) {
                a.hidden || l.push(b)
            });
            for (g = 0; g < l.length - 1; g++) {
                b = l[g];
                c = l[g + 1];
                e = c - b;
                h = a[b].value;
                d = a[c].value;
                for (f = b + 1; f < c; f++) a[f].value = h * (c - f) / e + d * (f - b) / e
            }
        },
        _createSVGSurfaces: function() {
            this._colorRampSurface = g.createSurface(this._rampNode, this.rampWidth, this._sliderHeight);
            this._histogramSurface = g.createSurface(this._rampNode, this.histogramWidth, this._sliderHeight);
            f.set(this._histogramSurface.rawNode, {
                overflow: "visible",
                display: "inline-block",
                left: this.rampWidth + "px"
            });
            this._transparentBackgroundNode = this._generateTransparentBackground();
            this._rect = this._colorRampSurface.createRect(this._colorRampSurface.getDimensions());
            f.set(this._colorRampSurface.rawNode, "border", "1px solid #888");
            this._fillRamp();
            null !== this.zoomOptions && (this.toggleSliderBottom && this.toggleSliderTop ? (this._colorRampSurface.createPath("M0,1 L6.25,-1 L12.5,1 L18.75,-1 L25,1").setStroke({
                color: "#fff",
                width: 3
            }).setTransform(g.matrix.translate(0, 5)), this._colorRampSurface.createPath("M0,1 L6.25,-1 L12.5,1 L18.75,-1 L25,1").setStroke({
                color: "#fff",
                width: 3
            }).setTransform(g.matrix.translate(0, 195))) : this.toggleSliderBottom ? this._colorRampSurface.createPath("M0,1 L6.25,-1 L12.5,1 L18.75,-1 L25,1").setStroke({
                color: "#fff",
                width: 3
            }).setTransform(g.matrix.translate(0, 195)) : this.toggleSliderTop && this._colorRampSurface.createPath("M0,1 L6.25,-1 L12.5,1 L18.75,-1 L25,1").setStroke({
                color: "#fff",
                width: 3
            }).setTransform(g.matrix.translate(0, 5)))
        },
        _fillRamp: function() {
            var a = this._slider.minimum,
                b = this._slider.maximum,
                c = this._slider.values.slice(0);
            k.forEach(c, function(c) {
                c.offset = (b - c.value) / (b - a)
            });
            c.reverse();
            null !== this.zoomOptions ? this.toggleSliderBottom && this.toggleSliderTop ? this._rect.setFill({
                type: "linear",
                x1: 0,
                y1: 10,
                x2: 0,
                y2: 190,
                colors: c
            }) : this.toggleSliderBottom ? this._rect.setFill({
                type: "linear",
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 180,
                colors: c
            }) : this.toggleSliderTop && this._rect.setFill({
                type: "linear",
                x1: 0,
                y1: 20,
                x2: 0,
                y2: 200,
                colors: c
            }) : this._rect.setFill({
                type: "linear",
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 200,
                colors: c
            })
        },
        _getHandleInfo: function(a) {
            return k.map(a, d.hitch(this, function(b, c) {
                return {
                    color: new t([0, 121, 193, b.opacity]),
                    value: a[c].value,
                    opacity: a[c].opacity
                }
            }))
        },
        _showHistogram: function() {
            this.histogram || this.zoomOptions && this.zoomOptions.histogram ?
                this._generateHistogram() : this._barsGroup && (this._barsGroup.destroy(), this._barsGroup = null)
        },
        _toggleHistogram: function(a) {
            this.showHistogram ? (f.set(this._barsGroup.rawNode, "display", "inline-block"), this._showHistogram()) : f.set(this._barsGroup.rawNode, "display", "none")
        },
        _generateTransparentBackground: function() {
            var a = this._colorRampSurface.createRect({
                width: this.rampWidth,
                height: this._sliderHeight
            }).setFill(this.showTransparentBackground ? this._getTransparentFill() : null);
            a.moveToBack();
            return a
        },
        _toggleTransparentBackground: function() {
            this.showTransparentBackground ?
                this._transparentBackgroundNode.setFill(this._getTransparentFill()) : this._transparentBackgroundNode.setFill(null)
        },
        _getTransparentFill: function() {
            return {
                type: "pattern",
                x: 0,
                y: 0,
                width: 16,
                height: 16,
                src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgaGVpZ2h0PSIxNiIgd2lkdGg9IjE2Ij48cGF0aCBkPSJNMCAwIEw4IDAgTDggOCBMMCA4IFoiIGZpbGw9IiNjY2MiIC8+PHBhdGggZD0iTTAgMCBMOCAwIEw4IDggTDAgOCBaIiBmaWxsPSIjZmZmIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLDgpIiAvPjxwYXRoIGQ9Ik0wIDAgTDggMCBMOCA4IEwwIDggWiIgZmlsbD0iI2NjYyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOCw4KSIgLz48cGF0aCBkPSJNMCAwIEw4IDAgTDggOCBMMCA4IFoiIGZpbGw9IiNmZmYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDgsMCkiIC8+PC9zdmc+"
            }
        },
        _updateTimeout: function(a) {
            var b = this;
            clearTimeout(this._updateTimer);
            this._updateTimer = setTimeout(function() {
                var a = b;
                b = null;
                clearTimeout(a._updateTimer);
                a._updateRendererSlider()
            }, 0)
        },
        _updateRendererSlider: function(a) {
            null !== this.zoomOptions ? (this.toggleSliderBottom = this.zoomOptions.minSliderValue > this.minValue, this.toggleSliderTop = this.zoomOptions.maxSliderValue < this.maxValue, this._slider.set("minimum", this.zoomOptions.minSliderValue), this._slider.set("maximum", this.zoomOptions.maxSliderValue),
                this._slider.set("_isZoomed", !0), this._slider.set("minLabel", this.minValue), this._slider.set("maxLabel", this.maxValue)) : (this._slider.set("minimum", this.minValue), this._slider.set("maximum", this.maxValue), this._slider.set("_isZoomed", !1), this._slider.set("minLabel", null), this._slider.set("maxLabel", null));
            this.values = this._getHandleInfo(this.opacityInfo.stops);
            this._slider.set("values", this.values);
            this._slider._reset();
            this._slider._updateRoundedLabels();
            this._slider._generateMoveables();
            this._clearRect();
            this._createSVGSurfaces();
            this.statistics && this.showStatistics && this._generateStatistics();
            this.showHistogram && (this.histogram || this.zoomOptions && this.zoomOptions.histogram) && this._generateHistogram()
        },
        _clearRect: function() {
            this._colorRampSurface.destroy();
            this._histogramSurface.destroy()
        },
        _getPrecision: function() {
            return 2 > Math.floor(Math.log(this.maxValue) / Math.log(10)) ? 2 - Math.floor(Math.log(this.maxValue) / Math.log(10)) : 0
        },
        _generateHistogram: function() {
            var a = this.zoomOptions && this.zoomOptions.histogram ?
                this.zoomOptions.histogram : this.histogram,
                b;
            this._barsGroup = this._histogramSurface.createGroup();
            var c = k.map(a.bins, function(a) {
                return "object" === typeof a ? a.count : a
            });
            c.reverse();
            var e = this._sliderHeight / c.length;
            k.forEach(c, d.hitch(this, function(a, d) {
                b = 0 < a ? this.histogramWidth * (a / Math.max.apply(Math, c)) : 0;
                this._barsGroup.createRect({
                    width: b,
                    height: e
                }).setStroke("#c0c0c0").setFill("#aaa").setTransform(g.matrix.translate(0, e * d))
            }));
            f.set(this._histogramSurface.rawNode, {
                display: "inline-block",
                left: this.rampWidth +
                    "px"
            });
            m.isBodyLtr() || this._barsGroup.setTransform({
                dx: this.histogramWidth,
                dy: 0,
                xx: -1,
                xy: 0,
                yx: 0,
                yy: 1
            })
        },
        destroy: function() {
            this.inherited(arguments);
            this._slider.destroy();
            this._avgHandleTooltip && this._avgHandleTooltip.destroy()
        }
    })
});