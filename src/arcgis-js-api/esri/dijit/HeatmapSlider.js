//>>built
define(["../kernel", "dijit/_OnDijitClickMixin", "dijit/_TemplatedMixin", "dijit/_WidgetBase", "../dijit/RendererSlider", "dojo/_base/array", "dojo/_base/declare", "dojo/_base/lang", "dojo/dom-style", "dojo/Evented", "dojo/has", "dojox/gfx", "dojo/i18n!../nls/jsapi", "dojo/text!./HeatmapSlider/templates/HeatmapSlider.html"], function(s, g, h, k, l, e, m, b, n, p, t, q, f, r) {
    return m("esri.dijit.HeatmapSlider", [k, h, g, p], {
        baseClass: "esriHeatmapSlider",
        basePath: require.toUrl("esri/dijit/HeatmapSlider/"),
        templateString: r,
        domNode: null,
        containerNode: null,
        handles: null,
        _rampWidthDefault: 25,
        showLabels: null,
        showTicks: null,
        showHandles: null,
        _rampNode: null,
        _sliderHeight: null,
        _colorRampSurface: null,
        _rect: null,
        _updateTimer: null,
        constructor: function(a, c) {
            this.inherited(arguments);
            c && (this.domNode = c, this.containerNode = this._containerNode, this.rampWidth = a.rampWidth || this._rampWidthDefault, this.handles = a.handles || [3, 15], this.showLabels = a.showLabels || !0, this.showTicks = a.showTicks || !0, this.showHandles = a.showHandles || !0, this.colorStops = a.colorStops, this.minSliderValue =
                0, this.maxSliderValue = 1, this.values = [this.colorStops[3].ratio, this.colorStops[15].ratio])
        },
        postCreate: function() {
            this.inherited(arguments)
        },
        startup: function() {
            this.inherited(arguments);
            this._slider = new l({
                type: "HeatmapSlider",
                values: this.values,
                minimum: this.minSliderValue,
                maximum: this.maxSliderValue,
                precision: 2,
                showLabels: this.showLabels,
                showTicks: this.showTicks,
                showHandles: this.showHandles,
                minLabel: f.widgets.rendererSlider.low,
                maxLabel: f.widgets.rendererSlider.high
            }, this._sliderNode);
            this._slider.startup();
            this._rampNode = this._slider._sliderAreaRight;
            this._sliderHeight = n.get(this._rampNode, "height") || 155;
            this._createSVGSurfaces();
            this._slider.on("slide", b.hitch(this, function(a) {
                this._updateColorStops(a.values[0], a.values[1]);
                this._fillRamp()
            }));
            this._slider.on("change", b.hitch(this, function(a) {
                this.values = [a.values[0], a.values[1]];
                this.emit("change", b.clone(this.colorStops))
            }));
            this._slider.on("handle-value-change", b.hitch(this, function(a) {
                this._updateRendererSlider()
            }));
            this._slider.on("data-value-change",
                b.hitch(this, function(a) {
                    this._updateRendererSlider()
                }));
            this._slider.on("stop", b.hitch(this, function(a) {
                this.emit("handle-value-change", b.clone(this.colorStops))
            }));
            this.watch("colorStops", this._updateTimeout)
        },
        _createSVGSurfaces: function() {
            this._colorRampSurface = q.createSurface(this._rampNode, this.rampWidth, this._sliderHeight);
            this._rect = this._colorRampSurface.createRect(this._colorRampSurface.getDimensions()).setStroke("#888");
            this._fillRamp()
        },
        _updateTimeout: function() {
            var a = this;
            clearTimeout(this._updateTimer);
            this._updateTimer = setTimeout(function() {
                var c = a;
                a = null;
                clearTimeout(c._updateTimer);
                c._updateRendererSlider()
            }, 0)
        },
        _updateRendererSlider: function() {
            this.values = [this.colorStops[3].ratio, this.colorStops[15].ratio];
            this._slider.set("values", this.values);
            this._slider._reset();
            this._slider._updateRoundedLabels();
            this._slider._generateMoveables();
            this._clearRect();
            this._createSVGSurfaces()
        },
        _clearRect: function() {
            this._colorRampSurface.destroy()
        },
        destroy: function() {
            this.inherited(arguments);
            this._slider.destroy()
        },
        _updateColorStops: function(a, c) {
            e.forEach(this.colorStops, b.hitch(this, function(b, d) {
                2 < d && (b.ratio = a + (c - a) * ((d - 3) / 12), 3 === d && b.ratio < this.colorStops[2].ratio && (b.ratio = this.colorStops[2].ratio))
            }))
        },
        _fillRamp: function() {
            var a = this.colorStops.slice(0);
            e.forEach(a, function(a) {
                a.offset = 1 - a.ratio
            });
            a.reverse();
            this._rect.setFill({
                type: "linear",
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 200 / 0.99,
                colors: a
            })
        }
    })
});