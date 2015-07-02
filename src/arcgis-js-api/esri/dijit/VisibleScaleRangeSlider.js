//>>built
define(["../kernel", "./_EventedWidget", "./_Tooltip", "./VisibleScaleRangeSlider/ScaleMenu", "./VisibleScaleRangeSlider/ScalePreview", "./VisibleScaleRangeSlider/ScaleRanges", "dijit/form/DropDownButton", "dijit/popup", "dijit/TooltipDialog", "dojo/_base/array", "dojo/_base/declare", "dojo/_base/lang", "dojo/aspect", "dojo/debounce", "dojo/Deferred", "dojo/dom-construct", "dojo/dom-geometry", "dojo/dom-style", "dojo/has", "dojo/on", "dojo/string", "dojox/form/HorizontalRangeSlider", "dojo/i18n!../nls/jsapi"], function(C, q, r, l, s, m, n, h, D, t, u, d, f, v, w, p, k,
    x, E, y, z, A, B) {
    return u([q, r], {
        declaredClass: "esri.dijit.VisibleScaleRangeSlider",
        baseClass: "esriVisibleScaleRangeSlider",
        map: null,
        layer: null,
        region: "en-US",
        minScale: 0,
        maxScale: 0,
        intermediateChanges: !1,
        labels: B.visibleScaleRangeSlider,
        _slider: null,
        _currentScaleIndicator: null,
        _scalePreview: null,
        _maxScaleButton: null,
        _minScaleButton: null,
        _mapUpdateHandler: null,
        _scaleRanges: null,
        _scheduleScaleRangeChangeEmit: null,
        _getSliderIndexRange: function(a) {
            a = Math.floor(a);
            return {
                min: a,
                max: a + 0.99999
            }
        },
        _setMapAttr: function(a) {
            this._set("map",
                a);
            this._mapUpdateHandler && this._mapUpdateHandler.remove();
            this._slider.set("disabled", !0);
            this._ensureMapIsReady().then(d.hitch(this, function() {
                var b = a.getMinScale(),
                    c = a.getMaxScale(),
                    e;
                this._slider.set("disabled", !1);
                this._scaleRanges.set("scaleRangeBounds", {
                    minScale: b,
                    maxScale: c
                });
                e = this._getSliderIndexRange(this._scaleRanges.length - 1);
                this._slider.set("maximum", e.max);
                this.set("minScale", b);
                this.set("maxScale", c);
                this._updateCurrentScaleIndicator();
                b = a.on("zoom-end", d.hitch(this, function() {
                    this._updateCurrentScaleIndicator()
                }));
                this.own(b);
                this._mapUpdateHandler = b
            }))
        },
        _ensureMapIsReady: function() {
            return this._ensureLoadedResource(this.map)
        },
        _ensureLoadedResource: function(a) {
            var b = new w;
            if (a)
                if (a.loaded) b.resolve();
                else a.on("load", function() {
                    b.resolve()
                });
            else b.reject(Error("could not load resource"));
            return b.promise
        },
        _updateCurrentScaleIndicator: function() {
            var a = this._scaleRanges.clampScale(this.map.getScale()),
                a = this._mapScaleToSlider(a) / this._slider.maximum;
            this.isLeftToRight() || (a = 1 - a);
            x.set(this._currentScaleIndicator, {
                left: 100 * a + "%"
            })
        },
        _setLayerAttr: function(a) {
            this._set("layer", a);
            this._ensureMapIsReady().then(d.hitch(this, this._ensureLayerIsReady)).then(d.hitch(this, function() {
                this._updateMinMaxScaleFromLayer(a)
            }))
        },
        _ensureLayerIsReady: function() {
            return this._ensureLoadedResource(this.layer)
        },
        _updateMinMaxScaleFromLayer: function(a) {
            this.set("minScale", a.minScale);
            this.set("maxScale", a.maxScale)
        },
        _mapSliderToScale: function(a) {
            var b = this._getSliderIndexRange(a),
                c = this._scaleRanges.findScaleRangeByIndex(a);
            return this._mapToRange(a,
                b.min, b.max, c.minScale, c.maxScale)
        },
        _mapToRange: function(a, b, c, e, d) {
            return e + (a - b) * (d - e) / (c - b)
        },
        _setRegionAttr: function(a) {
            this._set("region", a);
            this._scalePreview.set("source", m.getScalePreviewSource(a))
        },
        _getMinimumAttr: function() {
            return this._mapSliderToScale(this._slider.minimum)
        },
        _getMaximumAttr: function() {
            return this._mapSliderToScale(this._slider.maximum)
        },
        _getMaxScaleAttr: function() {
            return this.maxScale
        },
        _getActualMaxScaleAttr: function() {
            return this._scaleRanges.clampMaxScale(this.maxScale)
        },
        _setMaxScaleAttr: function(a) {
            this._set("maxScale", a);
            this._ensureMapIsReady().then(d.hitch(this, function() {
                a = this._scaleRanges.clampMaxScale(a);
                this._set("maxScale", this._adjustMaxScale(a));
                this._updateSliderSilently({
                    value: this._mapScaleToSlider(a),
                    isMaxVal: !0
                });
                this._scheduleScaleRangeChangeEmit()
            }))
        },
        _updateSliderSilently: function(a) {
            this._slider.set("value", a.value, !1, a.isMaxVal)
        },
        _mapScaleToSlider: function(a) {
            var b = this._scaleRanges.scaleToRangeIndex(a),
                c = this._getSliderIndexRange(b),
                b = this._scaleRanges.findScaleRangeByIndex(b);
            return this._mapToRange(a, b.minScale, b.maxScale, c.min, c.max)
        },
        _getMinScaleAttr: function() {
            return this.minScale
        },
        _getActualMinScaleAttr: function() {
            return this._scaleRanges.clampMinScale(this.minScale)
        },
        _setMinScaleAttr: function(a) {
            this._set("minScale", a);
            this._ensureMapIsReady().then(d.hitch(this, function() {
                a = this._scaleRanges.clampMinScale(a);
                this._set("minScale", this._adjustMinScale(a));
                this._updateSliderSilently({
                    value: this._mapScaleToSlider(a),
                    isMaxVal: !1
                });
                this._scheduleScaleRangeChangeEmit()
            }))
        },
        _emitScaleRangeChange: function() {
            this.emit("scale-range-change", {
                minScale: this.minScale,
                maxScale: this.maxScale
            })
        },
        _adjustMinScale: function(a) {
            return this._scaleRanges.isInFirstRange(a) ? 0 : a
        },
        _adjustMaxScale: function(a) {
            return this._scaleRanges.isInLastRange(a) ? 0 : a
        },
        constructor: function() {
            d.extend(this.constructor, {
                css: {
                    currentScaleIndicator: "esriCurrentScaleIndicator",
                    currentScaleIndicatorContainer: "esriCurrentScaleIndicatorContainer",
                    scaleIndicator: "esriScaleIndicator",
                    scaleIndicatorContainer: "esriScaleIndicatorContainer"
                }
            });
            this._scaleRanges = new m;
            this._scheduleScaleRangeChangeEmit = v(d.hitch(this, this._emitScaleRangeChange), 0)
        },
        buildRendering: function() {
            this.inherited(arguments);
            this._initSlider();
            this._initScalePreview();
            this._initScaleIndicators();
            this._initScaleMenus()
        },
        _initSlider: function() {
            var a = new A({
                baseClass: "esriHorizontalSlider",
                showButtons: !1,
                intermediateChanges: this.intermediateChanges,
                disabled: !0
            });
            a.placeAt(this.domNode);
            a.startup();
            this._slider = a;
            this.own(a.on("change", d.hitch(this, function() {
                var a =
                    Math.round(this._mapSliderToScale(this._getSliderMin())),
                    c = Math.round(this._mapSliderToScale(this._getSliderMax()));
                this.set("minScale", a);
                this.set("maxScale", c)
            })));
            this.own(f.after(a, "_setValueAttr", d.hitch(this, this._updateLabelMenus)))
        },
        _getSliderMin: function() {
            var a = this._slider.get("value");
            return this.isLeftToRight() ? a[0] : a[1]
        },
        _getSliderMax: function() {
            var a = this._slider.get("value");
            return this.isLeftToRight() ? a[1] : a[0]
        },
        _updateLabelMenus: function() {
            var a = this._maxScaleButton;
            this._minScaleButton.set("label",
                this._scaleRanges.getScaleRangeLabel(this._getSliderMin()));
            a.set("label", this._scaleRanges.getScaleRangeLabel(this._getSliderMax()))
        },
        _initScalePreview: function() {
            var a = new s;
            a.startup();
            var b = d.hitch(this, this._updateScalePreview);
            h.moveOffScreen(a);
            t.forEach([this._slider._movable.handle, this._slider._movableMax.handle], function(c) {
                c.onmouseenter = function() {
                    b(c)
                };
                c.onmousemove = function() {
                    b(c)
                };
                c.onmouseleave = function() {
                    h.close(a)
                }
            });
            this.own(a);
            this._scalePreview = a
        },
        _updateScalePreview: function(a) {
            var b =
                this._slider,
                c = this._scalePreview,
                e = a === b.sliderHandle ? this._getSliderMin() : this._getSliderMax(),
                d = k.position(a),
                g = k.position(c.domNode),
                b = k.position(b.sliderBarContainer),
                f = this.isLeftToRight();
            c.set("backgroundPosition", this._scaleRanges.getScalePreviewSpriteBackgroundPosition(e));
            e = d.x - b.x;
            g = 0.5 * g.w;
            h.open({
                parent: this,
                popup: c,
                around: a,
                orient: e < g ? f ? ["above", "below"] : ["above-alt", "below-alt"] : e < b.w - g ? ["above-centered", "below-centered"] : f ? ["above-alt", "below-alt"] : ["above", "below"]
            })
        },
        _initScaleIndicators: function() {
            var a =
                p.create("div", {
                    className: this.css.scaleIndicatorContainer + " " + this.css.currentScaleIndicatorContainer
                }, this._slider.sliderBarContainer),
                b = p.create("div", {
                    className: this.css.scaleIndicator + " " + this.css.currentScaleIndicator
                }, a);
            this._currentScaleIndicator = b;
            this.createTooltip(b);
            a = y(b, "mouseover", d.hitch(this, function() {
                var a = z.substitute(this.labels.currentScaleTooltip, {
                    scaleLabel: this._scaleRanges.getScaleRangeLabel(this._mapScaleToSlider(this.map.getScale()))
                });
                this.findTooltip(b).set("label",
                    a)
            }));
            this.own(a)
        },
        _initScaleMenus: function() {
            var a = new l,
                b = new l,
                c, e;
            this.own(a.on("scale-selected", d.hitch(this, function(a) {
                c.closeDropDown();
                this.set("minScale", a.scale)
            })));
            this.own(b.on("scale-selected", d.hitch(this, function(a) {
                e.closeDropDown();
                this.set("maxScale", a.scale)
            })));
            c = new n({
                baseClass: "esriScaleMenuButton esriMinScaleMenuButton",
                dropDown: a,
                dropDownPosition: ["below", "above"]
            });
            c.toggleDropDown();
            c.toggleDropDown();
            e = new n({
                baseClass: "esriScaleMenuButton esriMaxScaleMenuButton",
                dropDown: b,
                dropDownPosition: ["below", "above"]
            });
            e.toggleDropDown();
            e.toggleDropDown();
            this.own(f.before(c, "openDropDown", d.hitch(this, function() {
                a.set("currentScale", {
                    label: c.label,
                    scale: this.get("actualMinScale"),
                    mapScale: this.map.getScale(),
                    ranges: this._scaleRanges
                })
            })));
            this.own(f.before(e, "openDropDown", d.hitch(this, function() {
                b.set("currentScale", {
                    label: e.label,
                    scale: this.get("actualMaxScale"),
                    mapScale: this.map.getScale(),
                    ranges: this._scaleRanges
                })
            })));
            c.placeAt(this.domNode);
            e.placeAt(this.domNode);
            a.startup();
            b.startup();
            c.startup();
            e.startup();
            this._minScaleButton = c;
            this._maxScaleButton = e
        },
        startup: function() {
            this.inherited(arguments);
            this.watch("intermediateChanges", function(a, b, c) {
                this._slider.set(a, c)
            })
        }
    })
});