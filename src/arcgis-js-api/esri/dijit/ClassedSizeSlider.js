//>>built
define(["../kernel", "../renderers/utils", "dijit/_OnDijitClickMixin", "dijit/_TemplatedMixin", "dijit/_WidgetBase", "dijit/Tooltip", "dojo/number", "dojo/string", "../dijit/RendererSlider", "../Color", "dojo/_base/array", "dojo/_base/declare", "dojo/_base/lang", "dojo/i18n!../nls/jsapi", "dojo/dom-geometry", "dojo/dom-style", "dojo/Evented", "dojo/has", "dojox/gfx", "dojo/text!./ClassedSizeSlider/templates/ClassedSizeSlider.html"], function(A, l, n, p, q, r, s, t, u, v, h, w, d, x, m, f, y, B, g, z) {
    return w("esri.dijit.ClassedSizeSlider", [q, p, n, y], {
        baseClass: "esriClassedSizeSlider",
        basePath: require.toUrl("esri/dijit/ClassedSizeSlider/"),
        templateString: z,
        domNode: null,
        containerNode: null,
        breakInfos: null,
        histogram: null,
        showHistogram: !0,
        showStatistics: !0,
        handles: null,
        _histogramWidthDefault: 100,
        _rampWidthDefault: 25,
        showLabels: null,
        showTicks: null,
        showHandles: null,
        _rampNode: null,
        _sliderHeight: null,
        _colorRampSurface: null,
        _histogramSurface: null,
        _rect: null,
        _barsGroup: null,
        _updateTimer: null,
        classificationMethod: null,
        normalizationType: null,
        constructor: function(a, b) {
            this.inherited(arguments);
            b && (this.domNode = b, this.containerNode = this._containerNode, this.histogram = a.histogram || !1, this.statistics = a.statistics || !1, this.histogramWidth = a.histogramWidth || this._histogramWidthDefault, this.rampWidth = a.rampWidth || this._rampWidthDefault, this.handles = a.handles || [], this.showLabels = a.showLabels || !0, this.showTicks = a.showTicks || !0, this.showHandles = a.showHandles || !0, this.symbol = a.symbol, this.breakInfos = d.clone(a.breakInfos), this.values = this._getHandleInfo(this.breakInfos), this.classificationMethod = a.classificationMethod ||
                null, this.normalizationType = a.normalizationType || null)
        },
        postCreate: function() {
            this.inherited(arguments);
            null !== this.breakInfos && 1 < this.breakInfos.length ? (this.minValue = this.breakInfos[0].minValue, this.maxValue = this.breakInfos[this.breakInfos.length - 1].maxValue) : null !== this.breakInfos && 1 === this.breakInfos.length ? (this.minValue = this.breakInfos[0].minValue, this.maxValue = this.breakInfos[0].maxValue) : (this.minValue = 0, this.maxValue = 100, this.breakInfos = [{
                minValue: 0,
                maxValue: 20
            }, {
                minValue: 20,
                maxValue: 80
            }, {
                minValue: 80,
                maxValue: 100
            }], this.values = this._getHandleInfo(this.breakInfos), this._updateBreakInfoLabels())
        },
        startup: function() {
            this.inherited(arguments);
            this._slider = new u({
                type: "ClassedSizeSlider",
                values: this.values,
                minimum: this.minValue,
                maximum: this.maxValue,
                showLabels: this.showLabels,
                showTicks: this.showTicks,
                showHandles: this.showHandles,
                classificationMethod: this.classificationMethod,
                normalizationType: this.normalizationType
            }, this._sliderNode);
            this._slider.startup();
            this._rampNode = this._slider._sliderAreaRight;
            this._sliderHeight = f.get(this._rampNode, "height") || 155;
            this._createSVGSurfaces();
            this._slider.on("slide", d.hitch(this, function(a) {
                this._updateBreakInfos(a.values);
                this._updateBreakInfoLabels();
                this._fillRamp()
            }));
            this._slider.on("change", d.hitch(this, function(a) {
                this.values = a.values;
                this._updateBreakInfos(a.values);
                this._updateBreakInfoLabels();
                this.emit("change", d.clone(this.breakInfos))
            }));
            this._slider.on("handle-value-change", d.hitch(this, function(a) {
                this._updateBreakInfos(a.values);
                this._updateBreakInfoLabels();
                this._fillRamp();
                this.emit("handle-value-change", d.clone(this.breakInfos))
            }));
            this._slider.on("data-value-change", d.hitch(this, function(a) {
                this.breakInfos[0].minValue = this.minValue = a.min;
                this.breakInfos[this.breakInfos.length - 1].maxValue = this.maxValue = a.max;
                this._updateBreakInfoLabels();
                this._updateRendererSlider();
                this.emit("data-value-change", {
                    minValue: this.minValue,
                    maxValue: this.maxValue,
                    breakInfos: d.clone(this.breakInfos)
                })
            }));
            this._slider.on("stop", d.hitch(this, function(a) {
                this.emit("handle-value-change",
                    d.clone(this.breakInfos))
            }));
            this.showHistogram && this.histogram && this._generateHistogram();
            this.statistics && this.showStatistics && this._generateStatistics();
            this.watch("breakInfos", this._updateTimeout);
            this.watch("handles", this._updateTimeout);
            this.watch("statistics", this._updateTimeout);
            this.watch("histogram", this._showHistogram);
            this.watch("showHandles", this._updateTimeout);
            this.watch("showLabels", this._updateTimeout);
            this.watch("showTicks", this._updateTimeout);
            this.watch("showHistogram", this._toggleHistogram)
        },
        _createSVGSurfaces: function() {
            this._colorRampSurface = g.createSurface(this._rampNode, this.rampWidth, this._sliderHeight);
            this._histogramSurface = g.createSurface(this._rampNode, this.histogramWidth, this._sliderHeight);
            f.set(this._histogramSurface.rawNode, {
                overflow: "visible",
                display: "inline-block",
                left: this.rampWidth + "px"
            });
            this._rect = this._colorRampSurface.createRect(this._colorRampSurface.getDimensions());
            this._fillRamp()
        },
        _clearRect: function() {
            this._colorRampSurface.destroy();
            this._histogramSurface.destroy()
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
            this.minValue = this.breakInfos[0].minValue;
            this.maxValue = this.breakInfos[this.breakInfos.length - 1].maxValue;
            this._slider.set("values", this._getHandleInfo(this.breakInfos));
            this._slider.set("handles", this.handles);
            this._slider._reset();
            this._slider._updateRoundedLabels();
            this._slider._generateMoveables();
            this._clearRect();
            this._createSVGSurfaces();
            this.showHistogram && this.histogram && this._generateHistogram();
            this.statistics && this.showStatistics && this._generateStatistics()
        },
        _generateStatistics: function() {
            var a = this.statistics;
            if (!(2 > a.count)) {
                var b = this._slider,
                    c, e;
                a.min === a.max && a.min === a.avg ? (c = 0, e = 2 * a.avg) : (c = a.min, e = a.max);
                if (c !== b.minimum || e !== b.maximum) c = b.minimum, e = b.maximum;
                b = [{
                    value: a.avg,
                    label: "average"
                }];
                b = h.filter(b, function(a) {
                    return a.value >= c && a.value <= e
                });
                h.forEach(b, d.hitch(this, function(b) {
                    b =
                        this._sliderHeight * (e - b.value) / (e - c);
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
                    b = t.substitute(x.widgets.rendererSlider.statsAvg, {
                        avg: s.format(a.avg, {
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
        _getPrecision: function() {
            return 2 > Math.floor(Math.log(this.maxValue) / Math.log(10)) ? 2 - Math.floor(Math.log(this.maxValue) / Math.log(10)) : 0
        },
        _generateHistogram: function() {
            var a;
            this._barsGroup = this._histogramSurface.createGroup();
            var b = h.map(this.histogram.bins, function(a) {
                return "object" === typeof a ? a.count : a
            });
            b.reverse();
            var c = this._sliderHeight / b.length;
            h.forEach(b, d.hitch(this, function(e, d) {
                a = 0 < e ? this.histogramWidth * (e / Math.max.apply(Math, b)) : 0;
                this._barsGroup.createRect({
                    width: a,
                    height: c
                }).setStroke("#c0c0c0").setFill("#aaa").setTransform(g.matrix.translate(0,
                    c * d))
            }));
            f.set(this._histogramSurface.rawNode, {
                display: "inline-block",
                left: this.rampWidth + "px"
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
        _showHistogram: function() {
            this.histogram ? this._generateHistogram() : this._barsGroup && (this._barsGroup.destroy(), this._barsGroup = null)
        },
        _toggleHistogram: function() {
            this.showHistogram ? (f.set(this._barsGroup.rawNode, "display", "inline-block"), this._showHistogram()) : f.set(this._barsGroup.rawNode, "display", "none")
        },
        _getHandleInfo: function(a) {
            var b = [],
                c;
            for (c = 0; c < a.length - 1; c++) b.push(a[c].maxValue);
            return b
        },
        _updateBreakInfos: function(a) {
            var b, c = this.breakInfos;
            l.updateClassBreak({
                classBreaks: c,
                normalizationType: this.normalizationType,
                classificationMethod: this.classificationMethod,
                change: a
            });
            for (b = 0; b < a.length; b++) c[b].maxValue = a[b], c[b + 1] && (c[b + 1].minValue = a[b])
        },
        _updateBreakInfoLabels: function() {
            l.setLabelsForClassBreaks({
                classBreaks: this.breakInfos,
                normalizationType: this.normalizationType,
                classificationMethod: this.classificationMethod,
                round: !0
            })
        },
        _fillRamp: function() {
            var a = this.breakInfos,
                b = this._slider,
                c = this._sliderHeight,
                e = [];
            h.forEach(a, function(a) {
                e.push([c - Math.round((a.minValue - b.minimum) / (b.maximum - b.minimum) * c), c - Math.round((a.maxValue - b.minimum) / (b.maximum - b.minimum) * c)])
            });
            e.reverse();
            this._colorRampSurface.clear();
            var f = this.rampWidth / a.length,
                k = this.rampWidth,
                g = this._colorRampSurface.createPath().moveTo(k, 0);
            h.forEach(e, d.hitch(this, function(a, b) {
                g.lineTo(k, a[0]);
                k = this.rampWidth - f * (b + 1);
                g.lineTo(k, a[0])
            }));
            g.lineTo(1,
                c).lineTo(0, c).lineTo(0, 0).closePath().setFill(new v([0, 121, 193, 0.8]))
        },
        destroy: function() {
            this.inherited(arguments);
            this._slider.destroy();
            this._avgHandleTooltip && this._avgHandleTooltip.destroy()
        }
    })
});