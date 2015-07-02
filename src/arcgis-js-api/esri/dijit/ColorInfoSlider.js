//>>built
define(["../kernel", "../renderers/utils", "dijit/_OnDijitClickMixin", "dijit/_TemplatedMixin", "dijit/_WidgetBase", "dijit/Tooltip", "../dijit/RendererSlider", "dojo/_base/array", "dojo/_base/declare", "dojo/_base/lang", "dojo/i18n!../nls/jsapi", "dojo/dom-geometry", "dojo/dom-style", "dojo/Evented", "dojo/has", "dojo/number", "dojo/string", "dojox/gfx", "dojo/text!./ColorInfoSlider/templates/ColorInfoSlider.html"], function(B, p, q, r, s, t, u, h, v, d, w, n, f, x, C, y, z, g, A) {
    return v("esri.dijit.ColorInfoSlider", [s, r, q, x], {
        baseClass: "esriColorInfoSlider",
        basePath: require.toUrl("esri/dijit/ColorInfoSlider/"),
        templateString: A,
        domNode: null,
        containerNode: null,
        colorInfo: null,
        minValue: null,
        maxValue: null,
        histogram: null,
        statistics: null,
        handles: null,
        primaryHandle: null,
        _histogramWidthDefault: 100,
        _rampWidthDefault: 25,
        showLabels: null,
        showTicks: null,
        showHandles: null,
        showHistogram: !0,
        showStatistics: !0,
        _rampNode: null,
        _sliderHeight: null,
        _colorRampSurface: null,
        _histogramSurface: null,
        _rect: null,
        _barsGroup: null,
        _updateTimer: null,
        showTransparentBackground: !1,
        _transparentBackgroundNode: null,
        classificationMethod: null,
        normalizationType: null,
        zoomOptions: {},
        constructor: function(a, b) {
            this.inherited(arguments);
            b && (this.domNode = b, this.containerNode = this._containerNode, this.histogram = a.histogram || !1, this.statistics = a.statistics || !1, this.zoomOptions = a.zoomOptions || null, this.colorInfo = d.clone(a.colorInfo) || null, this.histogramWidth = a.histogramWidth || this._histogramWidthDefault, this.rampWidth = a.rampWidth || this._rampWidthDefault, this.handles = a.handles || [], this.primaryHandle = a.primaryHandle || null,
                this.showLabels = a.showLabels || !0, this.showTicks = a.showTicks || !0, this.showHandles = a.showHandles || !0, this.statistics ? (this.minValue = this.statistics.min || 0, this.maxValue = this.statistics.max || 100) : (this.minValue = 0, this.maxValue = 100), void 0 !== a.minValue && (this.minValue = a.minValue), void 0 !== a.maxValue && (this.maxValue = a.maxValue), this.showTransparentBackground = a.showTransparentBackground || !1, null !== this.zoomOptions && (this.toggleSliderBottom = this.zoomOptions.minSliderValue > this.minValue, this.toggleSliderTop =
                    this.zoomOptions.maxSliderValue < this.maxValue))
        },
        postCreate: function() {
            this.inherited(arguments);
            this.colorInfo.stops[0].value === this.colorInfo.stops[this.colorInfo.stops.length - 1].value && 0 !== this.colorInfo.stops[0].value && (this.minValue = 0, this.maxValue = 2 * this.colorInfo.stops[0].value, this.colorInfo.stops[0].value = this.maxValue / 5, this.colorInfo.stops[this.colorInfo.stops.length - 1].value = 4 * (this.maxValue / 5));
            this.minValue === this.maxValue && (0 === this.minValue ? this.maxValue = 100 : (this.maxValue = null ===
                this.minValue ? 100 : 2 * this.minValue, this.minValue = 0));
            this.values = this._generateHandleValues(d.clone(this.colorInfo.stops))
        },
        startup: function() {
            this.inherited(arguments);
            this._slider = new u({
                type: "ColorInfoSlider",
                values: this.values,
                minLabel: this.zoomOptions ? this.minValue : null,
                maxLabel: this.zoomOptions ? this.maxValue : null,
                minimum: this.zoomOptions ? this.zoomOptions.minSliderValue : this.minValue,
                maximum: this.zoomOptions ? this.zoomOptions.maxSliderValue : this.maxValue,
                _isZoomed: this.zoomOptions ? !0 : !1,
                showLabels: this.showLabels,
                showTicks: this.showTicks,
                showHandles: this.showHandles,
                handles: this.handles,
                primaryHandle: this.primaryHandle
            }, this._sliderNode);
            this._slider.startup();
            this._rampNode = this._slider._sliderAreaRight;
            this._sliderHeight = f.get(this._rampNode, "height") || 155;
            this._valuesAutoAdjust();
            this._createSVGSurfaces();
            this._slider.on("slide", d.hitch(this, function() {
                this._valuesAutoAdjust();
                this._fillRamp()
            }));
            this._slider.on("change", d.hitch(this, function(a) {
                this.values = a.values;
                this._updateColorInfo(a.values);
                this.emit("change",
                    d.clone(this.colorInfo))
            }));
            this._slider.on("handle-value-change", d.hitch(this, function(a) {
                this.values = a.values;
                this._updateColorInfo(a.values);
                this._valuesAutoAdjust();
                this._fillRamp();
                this.emit("handle-value-change", d.clone(this.colorInfo))
            }));
            this._slider.on("data-value-change", d.hitch(this, function(a) {
                this.minValue = a.min;
                this.maxValue = a.max;
                this._updateRendererSlider();
                this.emit("data-value-change", {
                    minValue: this.minValue,
                    maxValue: this.maxValue,
                    colorInfo: d.clone(this.colorInfo)
                })
            }));
            this._slider.on("stop",
                d.hitch(this, function(a) {
                    this.emit("handle-value-change", d.clone(this.colorInfo))
                }));
            this.statistics && this.showStatistics && this._generateStatistics();
            this.showHistogram && (this.histogram || this.zoomOptions && this.zoomOptions.histogram) && this._generateHistogram();
            this.watch("colorInfo", this._updateTimeout);
            this.watch("handles", this._updateTimeout);
            this.watch("primaryHandle", this._updateTimeout);
            this.watch("statistics", this._updateTimeout);
            this.watch("histogram", this._updateTimeout);
            this.watch("zoomOptions",
                this._updateTimeout);
            this.watch("showHistogram", this._toggleHistogram);
            this.watch("showTransparentBackground", this._toggleTransparentBackground);
            this.watch("showHandles", this._updateTimeout);
            this.watch("showLabels", this._updateTimeout);
            this.watch("showTicks", this._updateTimeout)
        },
        _clearRect: function() {
            this._colorRampSurface.destroy();
            this._histogramSurface.destroy()
        },
        _createSVGSurfaces: function() {
            this._colorRampSurface = g.createSurface(this._rampNode, this.rampWidth, this._sliderHeight);
            this._histogramSurface =
                g.createSurface(this._rampNode, this.histogramWidth, this._sliderHeight);
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
            }).setTransform(g.matrix.translate(0,
                5)))
        },
        _showHistogram: function() {
            this.histogram || this.zoomOptions && this.zoomOptions.histogram ? this._generateHistogram() : this._barsGroup && (this._barsGroup.destroy(), this._barsGroup = null)
        },
        _toggleHistogram: function(a) {
            this.showHistogram ? (f.set(this._barsGroup.rawNode, "display", "inline-block"), this._showHistogram()) : f.set(this._barsGroup.rawNode, "display", "none")
        },
        _updateTimeout: function() {
            var a = this;
            clearTimeout(this._updateTimer);
            this._updateTimer = setTimeout(function() {
                var b = a;
                a = null;
                clearTimeout(b._updateTimer);
                b._updateRendererSlider()
            }, 0)
        },
        _updateRendererSlider: function() {
            null !== this.zoomOptions ? (this.toggleSliderBottom = this.zoomOptions.minSliderValue > this.minValue, this.toggleSliderTop = this.zoomOptions.maxSliderValue < this.maxValue, this._slider.set("minimum", this.zoomOptions.minSliderValue), this._slider.set("maximum", this.zoomOptions.maxSliderValue), this._slider.set("_isZoomed", !0), this._slider.set("maxLabel", this.maxValue), this._slider.set("minLabel", this.minValue)) : (this._slider.set("minimum", this.minValue),
                this._slider.set("maximum", this.maxValue), this._slider.set("_isZoomed", !1), this._slider.set("maxLabel", null), this._slider.set("minLabel", null));
            this.values = this._generateHandleValues(d.clone(this.colorInfo.stops));
            this._slider.set("values", this.values);
            this._slider.set("handles", this.handles);
            this._slider.set("primaryHandle", this.primaryHandle);
            this._slider._reset();
            this._slider._updateRoundedLabels();
            this._slider._generateMoveables();
            this._clearRect();
            this._createSVGSurfaces();
            this.statistics && this.showStatistics &&
                this._generateStatistics();
            this.showHistogram && (this.histogram || this.zoomOptions && this.zoomOptions.histogram) && this._generateHistogram()
        },
        _getPrecision: function() {
            return 2 > Math.floor(Math.log(this.maxValue) / Math.log(10)) ? 2 - Math.floor(Math.log(this.maxValue) / Math.log(10)) : 0
        },
        _generateHistogram: function() {
            var a = this.zoomOptions && this.zoomOptions.histogram ? this.zoomOptions.histogram : this.histogram,
                b;
            this._barsGroup = this._histogramSurface.createGroup();
            var c = h.map(a.bins, function(a) {
                return "object" ===
                    typeof a ? a.count : a
            });
            c.reverse();
            var e = this._histogramSurface.getDimensions().height / c.length;
            h.forEach(c, d.hitch(this, function(a, d) {
                b = 0 < a ? this.histogramWidth * (a / Math.max.apply(Math, c)) : 0;
                this._barsGroup.createRect({
                    width: b,
                    height: e
                }).setStroke("#c0c0c0").setFill("#aaa").setTransform(g.matrix.translate(0, e * d))
            }));
            f.set(this._histogramSurface.rawNode, {
                display: "inline-block",
                left: this.rampWidth + "px"
            });
            n.isBodyLtr() || this._barsGroup.setTransform({
                dx: this.histogramWidth,
                dy: 0,
                xx: -1,
                xy: 0,
                yx: 0,
                yy: 1
            })
        },
        _generateStatistics: function() {
            var a =
                this.statistics;
            if (!(2 > a.count)) {
                var b = this._slider,
                    c = this.zoomOptions || null,
                    e, k;
                a.min === a.max && a.min === a.avg ? (e = 0, k = 2 * a.avg) : (e = a.min, k = a.max);
                if (e !== b.minimum || k !== b.maximum) e = b.minimum, k = b.maximum;
                c && (e = c.minSliderValue, k = c.maxSliderValue);
                b = [{
                    value: a.avg,
                    label: "average"
                }];
                b = h.filter(b, function(a) {
                    return a.value >= e && a.value <= k
                });
                h.forEach(b, d.hitch(this, function(b) {
                    b = this._sliderHeight * (k - b.value) / (k - e);
                    this._avgHandleLine = this._histogramSurface.createLine({
                        x1: 0,
                        y1: b,
                        x2: this.histogramWidth,
                        y2: b
                    }).setStroke("#c0c0c0").moveToBack();
                    this._avgHandleImage = this._histogramSurface.createImage({
                        x: n.isBodyLtr() ? this.histogramWidth + 2 : 0,
                        y: b - 8,
                        width: 12,
                        height: 14,
                        src: this.basePath + "images/xAvg.png"
                    });
                    b = z.substitute(w.widgets.rendererSlider.statsAvg, {
                        avg: y.format(a.avg, {
                            places: this._getPrecision()
                        })
                    });
                    this._avgHandleTooltip = new t({
                        connectId: [this._avgHandleImage.rawNode],
                        label: b
                    })
                }))
            }
        },
        _generateTransparentBackground: function() {
            var a = this._colorRampSurface.createRect({
                width: this.rampWidth,
                height: this._sliderHeight
            }).setFill(this.showTransparentBackground ?
                this._getTransparentFill() : null);
            a.moveToBack();
            return a
        },
        _toggleTransparentBackground: function() {
            this.showTransparentBackground ? this._transparentBackgroundNode.setFill(this._getTransparentFill()) : this._transparentBackgroundNode.setFill(null)
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
        _updateColorInfo: function(a) {
            h.forEach(this.colorInfo.stops, d.hitch(this, function(b, c) {
                b.value = a[c].value
            }));
            p.updateColorStops({
                stops: this.colorInfo.stops,
                changes: a
            })
        },
        _generateHandleValues: function(a) {
            var b = [];
            h.forEach(a, d.hitch(this, function(a, e) {
                -1 === h.indexOf(this.handles, e) && e !== this.primaryHandle && (a.hidden = !0);
                e === this.primaryHandle && (a.primaryHandle = !0);
                b.push(a)
            }));
            return b
        },
        _valuesAutoAdjust: function() {
            var a = this._slider.values,
                b, c, e, d, g, f, l, m = [];
            h.forEach(a, function(a, b) {
                a.hidden || m.push(b)
            });
            for (f = 0; f < m.length - 1; f++) {
                b = m[f];
                c = m[f + 1];
                e = c - b;
                d = a[b].value;
                g = a[c].value;
                for (l = b + 1; l < c; l++) a[l].value = d * (c - l) / e + g * (l - b) / e
            }
        },
        _fillRamp: function() {
            var a = this._slider.minimum,
                b = this._slider.maximum,
                c = this._slider.values.slice(0);
            h.forEach(c, function(c) {
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
        destroy: function() {
            this.inherited(arguments);
            this._slider.destroy();
            this._avgHandleTooltip && this._avgHandleTooltip.destroy()
        }
    })
});