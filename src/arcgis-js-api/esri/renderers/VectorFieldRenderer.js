//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "dojo/_base/array", "../kernel", "../lang", "../Color", "./Renderer", "./ClassBreaksRenderer", "../symbols/SimpleMarkerSymbol", "../symbols/PictureMarkerSymbol", "../symbols/SimpleLineSymbol", "../symbols/jsonUtils", "require"], function(h, k, t, g, u, e, f, p, q, l, m, n, r, s) {
    var b = h(p, {
        declaredClass: "esri.renderer.VectorFieldRenderer",
        patternUrlPrefix: s.toUrl("../images/symbol/sfs/"),
        constructor: function(a) {
            e.isDefined(a) || (a = {});
            a.attributeField = a.attributeField || "Magnitude";
            a.rotationInfo = a.rotationInfo || this._getRotationInfo(a);
            h.safeMixin(this, a);
            this.style = this.style || b.STYLE_SINGLE_ARROW;
            this.singleArrowSymbol && (this.singleArrowSymbol = this.singleArrowSymbol.declaredClass ? this.singleArrowSymbol : r.fromJson(this.singleArrowSymbol));
            this.renderer = new q(this._getDefaultSymbol(), a.attributeField);
            this._updateRenderer(this.style);
            this.flowRepresentation = this.flowRepresentation || this.FLOW_FROM
        },
        getSymbol: function(a) {
            return this.renderer && this.renderer.getSymbol(a)
        },
        setVisualVariables: function(a) {
            a =
                g.filter(a, function(a) {
                    if ("sizeInfo" === a.type) return e.isDefined(this._updateSizeInfo(a))
                }, this);
            this.inherited(arguments);
            return this
        },
        setSizeInfo: function(a) {
            this._updateSizeInfo(a);
            this.inherited(arguments);
            return this
        },
        setProportionalSymbolInfo: function(a) {
            this.setSizeInfo(a);
            return this
        },
        setColorInfo: function(a) {
            return this
        },
        _updateRenderer: function(a) {
            return !e.isDefined(this.renderer) ? Error("Invalid Renderer!") : a === b.STYLE_SINGLE_ARROW ? this._createSingleArrowRenderer() : a === b.STYLE_BEAUFORT_KN ?
                this._createBeaufortKnotsRenderer() : a === b.STYLE_BEAUFORT_METER ? this._createBeaufortMeterRenderer() : a === b.STYLE_BEAUFORT_FEET ? this._createBeaufortFeetRenderer() : a === b.STYLE_BEAUFORT_MILE ? this._createBeaufortMilesRenderer() : a === b.STYLE_BEAUFORT_KM ? this._createBeaufortKilometersRenderer() : a === b.STYLE_OCEAN_CURRENT_M ? this._createCurrentMeterRenderer() : a === b.STYLE_OCEAN_CURRENT_KN ? this._createCurrentKnotsRenderer() : a === b.STYLE_SCALAR ? this._createSimpleScalarRenderer() : a === b.STYLE_WIND_BARBS ? this._createWindBarbsRenderer() :
                this._createClassifiedArrowRenderer()
        },
        _updateSizeInfo: function(a) {
            return a && e.isDefined(a.minSize) && e.isDefined(a.maxSize) && e.isDefined(a.minDataValue) && e.isDefined(a.maxDataValue) ? (this.style === b.STYLE_WIND_BARBS && (a.minSize = a.maxSize), a.field = a.field || "Magnitude", a.type = "sizeInfo", a) : null
        },
        _createClassifiedArrowRenderer: function() {
            this.renderer.defaultSymbol = this._getDefaultSymbol(new f([56, 168, 0]));
            var a = [0, 1E-6, 3.5, 7, 10.5, 14];
            if (e.isDefined(this.minDataValue) && e.isDefined(this.maxDataValue)) {
                var c =
                    (this.maxDataValue - this.minDataValue) / 5,
                    a = [],
                    d, b;
                b = this.minDataValue;
                for (d = 0; 6 > d; d++) a[d] = b, b += c
            }
            this._addBreaks(a, [
                [56, 168, 0],
                [139, 309, 0],
                [255, 255, 0],
                [255, 128, 0],
                [255, 0, 0]
            ])
        },
        _createSingleArrowRenderer: function() {
            this.renderer.defaultSymbol = this.singleArrowSymbol || this._getDefaultSymbol()
        },
        _createBeaufortMeterRenderer: function() {
            this.renderer.defaultSymbol = this._getDefaultSymbol(new f([214, 47, 39]));
            this._addBreaks([0, 0.2, 1.8, 3.3, 5.4, 8.5, 11, 14.1, 17.2, 20.8, 24.4, 28.6, 32.7], [
                [69, 117, 181],
                [101, 137, 184],
                [132, 158, 186],
                [162, 180, 189],
                [192, 204, 190],
                [222, 227, 191],
                [255, 255, 191],
                [255, 220, 161],
                [250, 185, 132],
                [245, 152, 105],
                [237, 117, 81],
                [232, 21, 21]
            ])
        },
        _createBeaufortKnotsRenderer: function() {
            this.renderer.defaultSymbol = this._getDefaultSymbol(new f([214, 47, 39]));
            this._addBreaks([0, 1, 3, 6, 10, 16, 21, 27, 33, 40, 47, 55, 63], [
                [40, 146, 199],
                [89, 162, 186],
                [129, 179, 171],
                [160, 194, 155],
                [191, 212, 138],
                [218, 230, 119],
                [250, 250, 100],
                [252, 213, 83],
                [252, 179, 102],
                [250, 141, 52],
                [247, 110, 42],
                [240, 71, 29]
            ])
        },
        _createBeaufortFeetRenderer: function() {
            var a = [0, 0.2, 1.8, 3.3, 5.4, 8.5, 11, 14.1, 17.2, 20.8, 24.4, 28.6, 32.7];
            g.forEach(a, function(c, d) {
                a[d] *= 3.28084
            });
            this.renderer.defaultSymbol = this._getDefaultSymbol(new f([214, 47, 39]));
            this._addBreaks(a, [
                [69, 117, 181],
                [101, 137, 184],
                [132, 158, 186],
                [162, 180, 189],
                [192, 204, 190],
                [222, 227, 191],
                [255, 255, 191],
                [255, 220, 161],
                [250, 185, 132],
                [245, 152, 105],
                [237, 117, 81],
                [232, 21, 21]
            ])
        },
        _createBeaufortMilesRenderer: function() {
            var a = [0, 0.2, 1.8, 3.3, 5.4, 8.5, 11, 14.1, 17.2, 20.8, 24.4, 28.6, 32.7];
            g.forEach(a, function(c, d) {
                a[d] *= 2.23694
            });
            this.renderer.defaultSymbol = this._getDefaultSymbol(new f([214, 47, 39]));
            this._addBreaks(a, [
                [69, 117, 181],
                [101, 137, 184],
                [132, 158, 186],
                [162, 180, 189],
                [192, 204, 190],
                [222, 227, 191],
                [255, 255, 191],
                [255, 220, 161],
                [250, 185, 132],
                [245, 152, 105],
                [237, 117, 81],
                [232, 21, 21]
            ])
        },
        _createBeaufortKilometersRenderer: function() {
            var a = [0, 0.2, 1.8, 3.3, 5.4, 8.5, 11, 14.1, 17.2, 20.8, 24.4, 28.6, 32.7];
            g.forEach(a, function(c, d) {
                a[d] *= 3.6
            });
            this.renderer.defaultSymbol = this._getDefaultSymbol(new f([214, 47, 39]));
            this._addBreaks(a, [
                [69, 117,
                    181
                ],
                [101, 137, 184],
                [132, 158, 186],
                [162, 180, 189],
                [192, 204, 190],
                [222, 227, 191],
                [255, 255, 191],
                [255, 220, 161],
                [250, 185, 132],
                [245, 152, 105],
                [237, 117, 81],
                [232, 21, 21]
            ])
        },
        _createCurrentMeterRenderer: function() {
            this.renderer.defaultSymbol = this._getDefaultSymbol(new f([177, 177, 177]));
            this._addBreaks([0, 0.5, 1, 1.5, 2], [
                [78, 26, 153],
                [179, 27, 26],
                [202, 128, 26],
                [177, 177, 177]
            ])
        },
        _createCurrentKnotsRenderer: function() {
            this.renderer.defaultSymbol = this._getDefaultSymbol(new f([177, 177, 177]));
            this._addBreaks([0, 0.25, 0.5, 1, 1.5,
                2, 2.5, 3, 3.5, 4
            ], [
                [0, 0, 0],
                [0, 37, 100],
                [78, 26, 153],
                [151, 0, 100],
                [179, 27, 26],
                [177, 78, 26],
                [202, 128, 26],
                [177, 179, 52],
                [177, 177, 177]
            ])
        },
        _createSimpleScalarRenderer: function() {
            this.renderer.defaultSymbol = new m({
                url: this.patternUrlPrefix + "scalar.png",
                height: 20,
                width: 20,
                type: "esriPMS",
                angle: 0
            })
        },
        _createWindBarbsRenderer: function() {
            var a = [],
                c, d;
            for (c = 0; 150 >= c; c += 5) a.push(c);
            d = "M20 20 M5 20 A15 15 0 1 0 35 20 A15 15 0 1 0 5 20 M20 20 M10 20 A10 10 0 1 0 30 20 A10 10 0 1 0 10 20;M25 0 L25 40 M25 35 L17.5 37.5;M25 0 L25 40 L10 45 L25 40;M25 0 L25 40 L10 45 L25 40 M25 35 L17.5 37.5;M25 0 L25 40 L10 45 L25 40 M25 35 L10 40;M25 0 L25 40 L10 45 L25 40 M25 35 L10 40 L25 35 M25 30 L17.5 32.5;M25 0 L25 40 L10 45 L25 40 M25 35 L10 40 L25 35 M25 30 L10 35;M25 0 L25 40 L10 45 L25 40 M25 35 L10 40 L25 35 M25 30 L10 35 L25 30 M25 25 L17.5 27.5;M25 0 L25 40 L10 45 L25 40 M25 35 L10 40 L25 35 M25 30 L10 35 L25 30 M25 25 L10 30;M25 0 L25 40 L10 45 L25 40 M25 35 L10 40 L25 35 M25 30 L10 35 L25 30 M25 25 L10 30 L25 25 M25 20 L17.5 22.5;M25 0 L25 40 L10 40 L25 35;M25 0 L25 40 L10 40 L25 35 M25 30 L17.5 32.5;M25 0 L25 40 L10 40 L25 35 M25 30 L10 35;M25 0 L25 40 L10 40 L25 35 M25 30 L10 35 L25 30 M25 25 L17.5 27.5;M25 0 L25 40 L10 40 L25 35 M25 30 L10 35 L25 30 M25 25 L10 30;M25 0 L25 40 L10 40 L25 35 M25 30 L10 35 L25 30 M25 25 L10 30 L25 25 M25 20 L17.5 22.5;M25 0 L25 40 L10 40 L25 35 M25 30 L10 35 L25 30 M25 25 L10 30 L25 25 M25 20 L10 25;M25 0 L25 40 L10 40 L25 35 M25 30 L10 35 L25 30 M25 25 L10 30 L25 25 M25 20 L10 25 L25 20 M25 15 L17.5 17.5;M25 0 L25 40 L10 40 L25 35 M25 30 L10 35 L25 30 M25 25 L10 30 L25 25 M25 20 L10 25 L25 20 M25 15 L10 20;M25 0 L25 40 L10 40 L25 35 M25 30 L10 35 L25 30 M25 25 L10 30 L25 25 M25 20 L10 25 L25 20 M25 15 L10 20 L25 15 M25 10 L17.5 12.5;M25 0 L25 40 L10 40 L25 35 L10 35 L25 30;M25 0 L25 40 L10 40 L25 35 L10 35 L25 30 M25 25 L17.5 27.5;M25 0 L25 40 L10 40 L25 35 L10 35 L25 30 M25 25 L10 30;M25 0 L25 40 L10 40 L25 35 L10 35 L25 30 M25 25 L10 30 M25 25 M25 20 L17.5 22.5;M25 0 L25 40 L10 40 L25 35 L10 35 L25 30 M25 25 L10 30 M25 25 M25 20 L10 25;M25 0 L25 40 L10 40 L25 35 L10 35 L25 30 M25 25 L10 30 M25 25 M25 20 L10 25 M25 20 M25 15 L17.5 17.5;M25 0 L25 40 L10 40 L25 35 L10 35 L25 30 M25 25 L10 30 M25 25 M25 20 L10 25 M25 20 M25 15 L10 20;M25 0 L25 40 L10 40 L25 35 L10 35 L25 30 M25 25 L10 30 M25 25 M25 20 L10 25 M25 20 M25 15 L10 20 M25 15 M25 10 L17.5 12.5;M25 0 L25 40 L10 40 L25 35 L10 35 L25 30 M25 25 L10 30 M25 25 M25 20 L10 25 M25 20 M25 15 L10 20 M25 15 M25 10 L10 15;M25 0 L25 40 L10 40 L25 35 L10 35 L25 30 M25 25 L10 30 M25 25 M25 20 L10 25 M25 20 M25 15 L10 20 M25 15 M25 10 L10 15 M25 10 M25 5 L17.5 7.5".split(";");
            var b = new m({
                url: this.patternUrlPrefix + "windbarb.png",
                height: 20,
                width: 20,
                type: "esriPMS",
                angle: 0
            });
            this.renderer.defaultSymbol = b;
            for (c = 0; c < a.length - 1; c++) 0 == c ? this.renderer.addBreak({
                minValue: a[c],
                maxValue: a[c + 1],
                symbol: b
            }) : this.renderer.addBreak({
                minValue: a[c],
                maxValue: a[c + 1],
                symbol: (new l).setPath(d[c]).setOutline((new n).setWidth(1.5)).setSize(20).setColor(new f([0, 0, 0, 255]))
            })
        },
        _getDefaultSymbol: function(a) {
            return (new l).setPath("M14,32 14,18 9,23 16,3 22,23 17,18 17,32 z").setOutline((new n).setWidth(0)).setSize(20).setColor(a ||
                new f([0, 92, 230]))
        },
        _getRotationInfo: function(a) {
            var c = a && a.flowRepresentation || b.FLOW_FROM,
                d = a && a.rotationField || "Direction",
                e = b.FLOW_FROM;
            return {
                field: function(a) {
                    a = a.attributes[d];
                    return c === e ? a : a + 180
                },
                type: "geographic"
            }
        },
        _addBreaks: function(a, c) {
            if (!e.isDefined(this.renderer)) return Error("Invalid Renderer!");
            if (!a || !c || !a.length || !c.length || !(a.length >= c.length)) return Error("AddBreaks: Input arguments break values and colors not valid");
            var b;
            for (b = 0; b < c.length; b++) this.renderer.addBreak({
                minValue: a[b],
                maxValue: a[b + 1],
                symbol: this._getDefaultSymbol(new f(c[b]))
            })
        },
        toJson: function() {
            var a = k.mixin(this.inherited(arguments), {
                type: "vectorField",
                style: this.style,
                attributeField: this.attributeField,
                flowRepresentation: this.flowRepresentation
            });
            this.renderer && (this.renderer.defaultSymbol && this.style === b.STYLE_SINGLE_ARROW) && (a.singleArrowSymbol = this.renderer.defaultSymbol.toJson());
            return e.fixJson(a)
        }
    });
    k.mixin(b, {
        STYLE_WIND_BARBS: "wind_speed",
        STYLE_SINGLE_ARROW: "single_arrow",
        STYLE_CLASSIFIED_ARROW: "classified_arrow",
        STYLE_BEAUFORT_KN: "beaufort_kn",
        STYLE_BEAUFORT_METER: "beaufort_m",
        STYLE_BEAUFORT_MILE: "beaufort_mi",
        STYLE_BEAUFORT_FEET: "beaufort_ft",
        STYLE_BEAUFORT_KM: "beaufort_km",
        STYLE_OCEAN_CURRENT_M: "ocean_current_m",
        STYLE_OCEAN_CURRENT_KN: "ocean_current_kn",
        STYLE_SCALAR: "simple_scalar"
    }, {
        FLOW_FROM: "flow_from",
        FLOW_TO: "flow_to"
    });
    return b
});