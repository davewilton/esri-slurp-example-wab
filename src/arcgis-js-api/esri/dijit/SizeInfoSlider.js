//>>built
define(["../kernel", "dijit/_OnDijitClickMixin", "dijit/_TemplatedMixin", "dijit/_WidgetBase", "dijit/Tooltip", "../dijit/RendererSlider", "../Color", "dojo/_base/array", "dojo/_base/declare", "dojo/_base/lang", "dojo/i18n!../nls/jsapi", "dojo/dom-geometry", "dojo/dom-style", "dojo/Evented", "dojo/has", "dojo/number", "dojo/string", "dojo/dom-construct", "dojo/dom-class", "dojox/gfx", "dojo/text!./SizeInfoSlider/templates/SizeInfoSlider.html"], function(A, m, n, p, q, r, l, h, s, f, t, k, d, u, B, v, w, x, y, g, z) {
    return s("esri.dijit.SizeInfoSlider", [p, n, m, u], {
        baseClass: "esriSizeInfoSlider",
        basePath: require.toUrl("esri/dijit/SizeInfoSlider/"),
        templateString: z,
        domNode: null,
        containerNode: null,
        values: null,
        minValue: null,
        maxValue: null,
        minSize: null,
        maxSize: null,
        histogram: null,
        statistics: null,
        showHistogram: !0,
        showStatistics: !0,
        _histogramWidthDefault: 100,
        _rampWidthDefault: 25,
        _symbolWidthDefault: 50,
        showLabels: null,
        showTicks: null,
        showHandles: null,
        _rampNode: null,
        _sliderHeight: null,
        _barsGroup: null,
        _updateTimer: null,
        zoomOptions: {},
        constructor: function(a, b) {
            this.inherited(arguments);
            b && (this.domNode =
                b, this.containerNode = this._containerNode, this.symbol = a.symbol, this.statistics = a.statistics || !1, this.histogram = a.histogram || !1, this.zoomOptions = a.zoomOptions || null, this.sizeInfo = a.sizeInfo, this.minSize = this.sizeInfo.minSize, this.maxSize = this.sizeInfo.maxSize, this.histogramWidth = a.histogramWidth || this._histogramWidthDefault, this.symbolWidth = a.symbolWidth || this._symbolWidthDefault, this.rampWidth = a.rampWidth || this._rampWidthDefault, this.showLabels = a.showLabels || !0, this.showTicks = a.showTicks || !0, this.showHandles =
                a.showHandles || !0, this.statistics ? (this.minValue = this.statistics.min, this.maxValue = this.statistics.max) : (this.minValue = 0, this.maxValue = 100), void 0 !== a.minValue && (this.minValue = a.minValue), void 0 !== a.maxValue && (this.maxValue = a.maxValue), null !== this.zoomOptions && (this.toggleSliderBottom = this.zoomOptions.minSliderValue > this.minValue, this.toggleSliderTop = this.zoomOptions.maxSliderValue < this.maxValue))
        },
        postCreate: function() {
            this.inherited(arguments);
            null === this.sizeInfo.minDataValue && null === this.sizeInfo.maxDataValue ||
                0 === this.sizeInfo.minDataValue && 0 === this.sizeInfo.maxDataValue ? null === this.minValue && null === this.maxValue && (this.minValue = 0, this.maxValue = 100, this.values = [20, 80]) : this.minValue === this.maxValue ? 0 === this.minValue ? (this.maxValue = 100, this.values = [20, 80]) : null === this.minValue ? (this.minValue = 0, this.maxValue = 100, this.values = [20, 80]) : (this.maxValue = 2 * this.minValue, this.minValue = 0, this.values = [this.maxValue / 5, 4 * (this.maxValue / 5)]) : this.values = [this.sizeInfo.minDataValue, this.sizeInfo.maxDataValue];
            null ===
                this.minValue && (this.minValue = 0);
            null === this.maxValue && (this.maxValue = 100)
        },
        startup: function() {
            this.inherited(arguments);
            this._slider = new r({
                    type: "SizeInfoSlider",
                    values: this.values,
                    minLabel: this.zoomOptions ? this.minValue : null,
                    maxLabel: this.zoomOptions ? this.maxValue : null,
                    minimum: this.zoomOptions ? this.zoomOptions.minSliderValue : this.minValue,
                    maximum: this.zoomOptions ? this.zoomOptions.maxSliderValue : this.maxValue,
                    _isZoomed: this.zoomOptions ? !0 : !1,
                    showLabels: this.showLabels,
                    showTicks: this.showTicks,
                    showHandles: this.showHandles
                },
                this._sliderNode);
            this._slider.startup();
            this._rampNode = this._slider._sliderAreaRight;
            this._sliderHeight = d.get(this._rampNode, "height") || 155;
            this._createSVGSurfaces();
            this._slider.on("slide", f.hitch(this, function(a) {
                this._fillRamp(a.values)
            }));
            this._slider.on("change", f.hitch(this, function(a) {
                this.sizeInfo.minDataValue = a.values[0];
                this.sizeInfo.maxDataValue = a.values[1];
                this.values = [this.sizeInfo.minDataValue, this.sizeInfo.maxDataValue];
                this.emit("change", f.clone(this.sizeInfo))
            }));
            this._slider.on("handle-value-change",
                f.hitch(this, function(a) {
                    this.values = a.values;
                    this.sizeInfo.minDataValue = a.values[0];
                    this.sizeInfo.maxDataValue = a.values[1];
                    this._updateRendererSlider();
                    this.emit("handle-value-change", f.clone(this.sizeInfo))
                }));
            this._slider.on("data-value-change", f.hitch(this, function(a) {
                this.minValue = a.min;
                this.maxValue = a.max;
                this._updateRendererSlider();
                this.emit("data-value-change", {
                    minValue: a.min,
                    maxValue: a.max,
                    sizeInfo: f.clone(this.sizeInfo)
                })
            }));
            this._slider.on("stop", f.hitch(this, function() {
                this.emit("handle-value-change",
                    f.clone(this.sizeInfo))
            }));
            this.statistics && this.showStatistics && this._generateStatistics();
            this.showHistogram && (this.histogram || this.zoomOptions && this.zoomOptions.histogram) && this._generateHistogram();
            this.watch("minValue", this._updateTimeout);
            this.watch("maxValue", this._updateTimeout);
            this.watch("symbol", this._updateTimeout);
            this.watch("sizeInfo", this._updateTimeout);
            this.watch("minSize", this._updateTimeout);
            this.watch("maxSize", this._updateTimeout);
            this.watch("statistics", this._updateTimeout);
            this.watch("histogram", this._updateTimeout);
            this.watch("showHistogram", this._toggleHistogram);
            this.watch("zoomOptions", this._updateTimeout)
        },
        _showHistogram: function() {
            this.histogram || this.zoomOptions && this.zoomOptions.histogram ? this._generateHistogram() : this._barsGroup && (this._barsGroup.destroy(), this._barsGroup = null)
        },
        _toggleHistogram: function() {
            this.showHistogram ? (d.set(this._barsGroup.rawNode, "display", "inline-block"), this._showHistogram()) : d.set(this._barsGroup.rawNode, "display", "none")
        },
        _updateTimeout: function() {
            var a =
                this;
            clearTimeout(this._updateTimer);
            this._updateTimer = setTimeout(function() {
                var b = a;
                a = null;
                clearTimeout(b._updateTimer);
                b._updateRendererSlider()
            }, 0)
        },
        _updateRendererSlider: function() {
            this.minSize = this.sizeInfo.minSize;
            this.maxSize = this.sizeInfo.maxSize;
            this.values = [this.sizeInfo.minDataValue, this.sizeInfo.maxDataValue];
            null !== this.zoomOptions ? (this.toggleSliderBottom = this.zoomOptions.minSliderValue > this.minValue, this.toggleSliderTop = this.zoomOptions.maxSliderValue < this.maxValue, this._slider.set("minimum",
                this.zoomOptions.minSliderValue), this._slider.set("maximum", this.zoomOptions.maxSliderValue), this._slider.set("_isZoomed", !0), this._slider.set("maxLabel", this.maxValue), this._slider.set("minLabel", this.minValue)) : (this._slider.set("minimum", this.minValue), this._slider.set("maximum", this.maxValue), this._slider.set("_isZoomed", !1), this._slider.set("maxLabel", null), this._slider.set("minLabel", null));
            this._slider.set("values", this.values);
            this._slider._reset();
            this._slider._updateRoundedLabels();
            this._slider._generateMoveables();
            this._clearRect();
            this._createSVGSurfaces();
            this.statistics && this.showStatistics && this._generateStatistics();
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
                return "object" === typeof a ? a.count : a
            });
            c.reverse();
            var e = this._sliderHeight / c.length;
            h.forEach(c, f.hitch(this, function(a, d) {
                b = 0 < a ? this.histogramWidth * (a / Math.max.apply(Math, c)) : 0;
                this._barsGroup.createRect({
                    width: b,
                    height: e
                }).setStroke("#c0c0c0").setFill("#aaa").setTransform(g.matrix.translate(0, e * d))
            }));
            d.set(this._histogramSurface.rawNode, {
                display: "inline-block",
                left: this.rampWidth + "px"
            });
            k.isBodyLtr() || this._barsGroup.setTransform({
                dx: this.histogramWidth,
                dy: 0,
                xx: -1,
                xy: 0,
                yx: 0,
                yy: 1
            })
        },
        _attachSymbols: function() {
            this._attachSymbol(this._slider.moveables[0], this.minSize, "min");
            this._attachSymbol(this._slider.moveables[1], this.maxSize, "max")
        },
        _attachSymbol: function(a, b) {
            a._symbol || (a._symbol = x.create("div", {
                style: "position: absolute; left: 10px;"
            }, a));
            var c = d.get(a._handler, "height"),
                e = a._symbol;
            switch (this.symbol.type) {
                case "simplelinesymbol":
                    b = b === this.minSize ? 5 : 13;
                    this._generateLineSymbol(a, b, c);
                    break;
                case "simplemarkersymbol":
                    b = b === this.minSize ? 12 : 48, this._generateCircleSymbol(e,
                        b, c)
            }
            return e
        },
        _generateLineSymbol: function(a, b, c) {
            y.add(a._tick, "handlerTickSize");
            a = a._symbol;
            d.set(a, "top", c / 2 - b + "px");
            d.set(a, "height", 2 * b + "px");
            d.set(a, "width", b - 4 + "px");
            a.innerHTML = "";
            c = g.createSurface(a);
            c.rawNode.style.position = "absolute";
            c.rawNode.style.top = 1 === b ? "1px" : b / 2 + "px";
            k.isBodyLtr() || (c.rawNode.style.left = "-45px");
            c.setDimensions(this.rampWidth, b);
            c.createRect({
                width: this.rampWidth,
                height: b
            }).setFill(new l([0, 121, 193, 0.8]));
            return c
        },
        _generateCircleSymbol: function(a, b, c) {
            b /= 2;
            d.set(a,
                "top", c / 2 - (b + 1) + "px");
            d.set(a, "height", 2 * (b + 1) + "px");
            d.set(a, "width", b + "px");
            a.innerHTML = "";
            a = g.createSurface(a);
            a.rawNode.style.position = "absolute";
            k.isBodyLtr() || (a.rawNode.style.left = "-45px");
            a.setDimensions(b + 1, 2 * (b + 1));
            a.createCircle({
                cx: 0,
                cy: b + 1,
                r: b
            }).setFill(new l([0, 121, 193, 0.8])).setStroke("#fff");
            return a
        },
        _fillRamp: function(a) {
            var b = this._slider,
                c = this._sliderHeight,
                e = a ? a[1] : b.values[1];
            a = Math.round(c - ((a ? a[0] : b.values[0]) - b.minimum) / (b.maximum - b.minimum) * c);
            b = Math.round(c - (e - b.minimum) /
                (b.maximum - b.minimum) * c);
            e = this.rampWidth;
            this._proportionalSymbolSurface.clear();
            this._proportionalSymbolSurface.createPath().moveTo(e, 0).lineTo(e, b).lineTo(5, a).lineTo(5, c).lineTo(0, c).lineTo(0, 0).closePath().setFill("#9a9a9a");
            d.set(this._proportionalSymbolSurface.rawNode, "overflow", "visible");
            d.set(this._proportionalSymbolSurface.rawNode, "background-color", "#d9d9d9");
            null !== this.zoomOptions && (this.toggleSliderBottom && this.toggleSliderTop ? (this._proportionalSymbolSurface.createPath("M0,1 L6.25,-1 L12.5,1 L18.75,-1 L25,1").setStroke({
                color: "#fff",
                width: 3
            }).setTransform(g.matrix.translate(0, 5)), this._proportionalSymbolSurface.createPath("M0,1 L6.25,-1 L12.5,1 L18.75,-1 L25,1").setStroke({
                color: "#fff",
                width: 3
            }).setTransform(g.matrix.translate(0, 195))) : this.toggleSliderBottom ? this._proportionalSymbolSurface.createPath("M0,1 L6.25,-1 L12.5,1 L18.75,-1 L25,1").setStroke({
                color: "#fff",
                width: 3
            }).setTransform(g.matrix.translate(0, 195)) : this.toggleSliderTop && this._proportionalSymbolSurface.createPath("M0,1 L6.25,-1 L12.5,1 L18.75,-1 L25,1").setStroke({
                color: "#fff",
                width: 3
            }).setTransform(g.matrix.translate(0, 5)))
        },
        _generateStatistics: function() {
            var a = this.statistics;
            if (!(2 > a.count)) {
                var b = this._slider,
                    c = this.zoomOptions || null,
                    e, d;
                a.min === a.max && a.min === a.avg ? (e = 0, d = 2 * a.avg) : (e = a.min, d = a.max);
                if (e !== b.minimum || d !== b.maximum) e = b.minimum, d = b.maximum;
                c && (e = c.minSliderValue, d = c.maxSliderValue);
                b = [{
                    value: a.avg,
                    label: "average"
                }];
                b = h.filter(b, function(a) {
                    return a.value >= e && a.value <= d
                });
                h.forEach(b, f.hitch(this, function(b) {
                    b = this._sliderHeight * (d - b.value) / (d - e);
                    this._avgHandleLine =
                        this._histogramSurface.createLine({
                            x1: 0,
                            y1: b,
                            x2: this.histogramWidth,
                            y2: b
                        }).setStroke("#c0c0c0").moveToBack();
                    this._avgHandleImage = this._histogramSurface.createImage({
                        x: k.isBodyLtr() ? this.histogramWidth + 2 : 0,
                        y: b - 8,
                        width: 12,
                        height: 14,
                        src: this.basePath + "images/xAvg.png"
                    });
                    b = w.substitute(t.widgets.rendererSlider.statsAvg, {
                        avg: v.format(a.avg, {
                            places: this._getPrecision()
                        })
                    });
                    this._avgHandleTooltip = new q({
                        connectId: [this._avgHandleImage.rawNode],
                        label: b
                    })
                }))
            }
        },
        _clearRect: function() {
            this._proportionalSymbolSurface.destroy();
            this._histogramSurface.destroy()
        },
        _createSVGSurfaces: function() {
            this._proportionalSymbolSurface = g.createSurface(this._rampNode, this.rampWidth, this._sliderHeight);
            this._histogramSurface = g.createSurface(this._rampNode, this.histogramWidth, this._sliderHeight);
            d.set(this._histogramSurface.rawNode, {
                overflow: "visible",
                display: "inline-block",
                left: this.rampWidth + "px"
            });
            this._rect = this._proportionalSymbolSurface.createRect(this._proportionalSymbolSurface.getDimensions());
            this._fillRamp();
            this._attachSymbols()
        },
        destroy: function() {
            this.inherited(arguments);
            this._slider.destroy();
            this._avgHandleTooltip && this._avgHandleTooltip.destroy()
        }
    })
});