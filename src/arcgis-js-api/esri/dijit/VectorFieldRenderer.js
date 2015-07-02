//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/connect", "dojo/_base/array", "dojo/i18n!../nls/jsapi", "dojo/text!./templates/VectorFieldRenderer.html", "dojo/store/Memory", "dojo/data/ObjectStore", "dojo/has", "dojo/query", "dojo/dom-style", "dojo/dom-construct", "../kernel", "../renderers/VectorFieldRenderer", "../Color", "../lang", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/form/HorizontalSlider", "dijit/form/HorizontalRuleLabels", "dojox/form/HorizontalRangeSlider", "dojox/gfx", "require", "dijit/form/FilteringSelect", "dijit/form/RadioButton", "dijit/form/Select", "./ColorPicker", "dijit/form/DropDownButton", "dijit/TitlePane", "dijit/form/NumberTextBox", "dijit/form/Button"], function(l, h, m, k, v, w, n, x, E, q, g, r, F, b, s, t, y, z, A, B, u, C, p, D) {
    return l([y, z, A], {
        templateString: w,
        declaredClass: "esri.dijit.VectorFieldRenderer",
        widgetsInTemplate: !0,
        layer: null,
        map: null,
        _rendererTypes: "simpleScalar singleArrow windBarbs beaufort oceanCurrentKnots oceanCurrentMps classifiedArrow".split(" "),
        _rendererTypeData: [],
        _vfrObject: null,
        _defaultVFRName: "classifiedArrow",
        basePath: D.toUrl("."),
        propertiesChanged: !0,
        resetAvailable: !0,
        constructor: function(a) {
            l.safeMixin(this, a);
            this._i18n = v;
            this._setupDefaults()
        },
        startup: function(a) {
            this.inherited(arguments);
            var c = this;
            this._arrowSymbolButtonNode = q(".dijitButtonNode", q(".esriVFRColorButton")[0])[0];
            this.symbolColorPicker.onColorChange = function(a) {
                c._updateArrowSymbolButton();
                c.propertiesChanged = !0
            };
            m.subscribe("onVectorFieldRendererApply", h.hitch(this, "_onClickApplyVectorFieldRenderer"));
            m.subscribe("onVectorFieldRendererReset", h.hitch(this, "_onClickResetVectorFieldRenderer"));
            this.startupCalled = !0
        },
        postCreate: function(a) {
            this.inherited(arguments);
            var c = this;
            this.advancedSettingsPane.set("title", this._i18n.widgets.vectorFieldRenderer.advancedOptionsTitle);
            this.minMagnitudeInput.set("invalidMessage", this._i18n.widgets.vectorFieldRenderer.invalidNumberMessage);
            this.maxMagnitudeInput.set("invalidMessage", this._i18n.widgets.vectorFieldRenderer.invalidNumberMessage);
            g.set(this.symbolColorPicker.dap_transparencySection, "display", "none");
            this._popuplateRendererList();
            this._createTileSizeSlider();
            this._createSymbolSizeSlider();
            this.hideApplyButton && g.set(this.applyButton.domNode,
                "display", "none");
            if (this.layer.loaded) this._loadVFRArguments();
            else this.layer.on("load", function() {
                c._loadVFRArguments()
            })
        },
        _setLayerAttr: function(a) {
            if (a && this.startupCalled) {
                var c = this;
                this.layer = a;
                this.inherited(arguments);
                this.advancedSettingsPane.set("open", !1);
                if (this.layer.loaded) this._loadVFRArguments();
                else this.layer.on("load", function() {
                    c._loadVFRArguments()
                })
            }
        },
        _addRendererTypeToList: function(a, c, f, b) {
            var e = {};
            e.label = "\x3chtml\x3e\x3cbody\x3e\x3csection\x3e\x3ctable\x3e\x3ctr\x3e\x3ctd colspan\x3d'2'\x3e\x3cb\x3e" +
                a + "\x3cb\x3e\x3c/td\x3e\x3c/tr\x3e\x3ctr\x3e\x3ctd\x3e\x3cimg src\x3d'" + b + "' height\x3d'90' width\x3d'90'\x3e\x3c/td\x3e\x3ctd\x3e\x3cp style\x3d'white-space:pre-wrap;width:35ex;'\x3e\x3ci\x3e" + c + "\x3c/i\x3e\x3c/p\x3e\x3ctd\x3e\x3c/tr\x3e\x3c/table\x3e\x3c/section\x3e\x3c/body\x3e\x3c/html\x3e";
            e.name = a;
            e.desc = c;
            e.id = f;
            this._rendererTypeData.push(e)
        },
        _popuplateRendererList: function() {
            var a = this;
            k.forEach(this._rendererTypes, function(c) {
                a._addRendererTypeToList(a._i18n.widgets.vectorFieldRenderer[c +
                    "LabelTitle"], a._i18n.widgets.vectorFieldRenderer[c + "Desc"], c, a.basePath + "/images/vfr_" + c + ".png")
            });
            this._rendererTypeStore = new n({
                data: this._rendererTypeData
            });
            this.rendererTypeSelect.set("store", this._rendererTypeStore);
            this.rendererTypeSelect.set("labelAttr", "label");
            this.rendererTypeSelect.set("labelType", "html")
        },
        _createTileSizeSlider: function() {
            var a = this,
                c = [],
                b, d = r.create("div");
            this.symbolDensitySliderDiv.appendChild(d);
            for (b = 0; 80 > b; b++) 0 === b ? c.push(this._i18n.widgets.vectorFieldRenderer.sparseTileSizeAlias) :
                79 === b ? c.push(this._i18n.widgets.vectorFieldRenderer.denseTileSizeAlias) : c.push("");
            new u({
                labels: c,
                labelStyle: "font-size: 75%"
            }, d);
            this._symbolDensitySlider = new B({
                value: 0.02,
                minimum: 0.01,
                maximum: 0.05,
                intermediateChanges: !1,
                discreteValues: 81,
                style: "width: 100%",
                onChange: function(c) {
                    a._setPropertiesChanged()
                }
            }, this.symbolDensitySliderDiv)
        },
        _createSymbolSizeSlider: function() {
            var a = this,
                c = [],
                b, d = r.create("div");
            this.symbolSizeSliderDiv.appendChild(d);
            for (b = 0; 100 > b; b++) 0 === b ? c.push(this._i18n.widgets.vectorFieldRenderer.minSymbolSizeAlias) :
                99 === b ? c.push(this._i18n.widgets.vectorFieldRenderer.maxSymbolSizeAlias) : c.push("");
            new u({
                labels: c,
                labelStyle: "font-size: 75%"
            }, d);
            this._symbolSizeSlider = new C({
                value: [20, 80],
                minimum: 0,
                maximum: 100,
                discreteValues: 101,
                intermediateChanges: !1,
                style: "width: 100%",
                onChange: function(c) {
                    a._setPropertiesChanged()
                }
            }, this.symbolSizeSliderDiv)
        },
        _selectRendererStyle: function(a) {
            "singleArrow" === a ? this._showColorPickerButton() : this._hideColorPickerButton();
            this._refreshOutputUnitSelect();
            this.layer.getFlowRepresentation() ||
                ("beaufort" === a || "windBarbs" === a ? this.flowAngleSelect.set("value", "FLOW_FROM") : "oceanCurrent" === a && this.flowAngleSelect.set("value", "FLOW_TO"));
            this.propertiesChanged = !0
        },
        _showColorPickerButton: function() {
            var a = this.singleArrowDefaultColor;
            this.layer.renderer && (this.layer.renderer.renderer && this.layer.renderer.renderer.defaultSymbol && this.layer.rendererStyle == b.STYLE_SINGLE_ARROW) && this.layer.renderer.renderer.defaultSymbol.color;
            this.symbolColorPicker.set("color", a);
            g.set(this.colorPickerButton.domNode,
                "display", "block")
        },
        _hideColorPickerButton: function() {
            g.set(this.colorPickerButton.domNode, "display", "none")
        },
        _setupDefaults: function() {
            this.singleArrowDefaultColor = new s([0, 92, 230])
        },
        _loadVFRArguments: function() {
            if (!this.layer || !this.layer.renderer) return console.log("Layer not present");
            this._loadVFRStyle();
            this._loadSymbolSizeValues();
            this._loadTileSizeValue();
            this._loadMinMaxValues();
            this._loadAngleDirection();
            this._loadColor();
            this._loadUnits()
        },
        _loadVFRStyle: function() {
            switch (this.layer.renderer.style) {
                case b.STYLE_SCALAR:
                    this.rendererTypeSelect.set("value",
                        this._rendererTypes[0]);
                    break;
                case b.STYLE_SINGLE_ARROW:
                    this.rendererTypeSelect.set("value", this._rendererTypes[1]);
                    this._loadColor();
                    break;
                case b.STYLE_BEAUFORT_KN:
                case b.STYLE_BEAUFORT_METER:
                case b.STYLE_BEAUFORT_MILE:
                case b.STYLE_BEAUFORT_FEET:
                case b.STYLE_BEAUFORT_KM:
                    this.rendererTypeSelect.set("value", this._rendererTypes[3]);
                    break;
                case b.STYLE_OCEAN_CURRENT_M:
                    this.rendererTypeSelect.set("value", this._rendererTypes[5]);
                    break;
                case b.STYLE_OCEAN_CURRENT_KN:
                    this.rendererTypeSelect.set("value", this._rendererTypes[4]);
                    break;
                case b.STYLE_CLASSIFIED_ARROW:
                    this.rendererTypeSelect.set("value", this._rendererTypes[6]);
                    break;
                case b.STYLE_WIND_BARBS:
                    this.rendererTypeSelect.set("value", this._rendererTypes[2]);
                    break;
                default:
                    this.rendererTypeSelect.set("value", this._rendererTypes[1])
            }
        },
        _loadSymbolSizeValues: function() {
            var a = 20,
                c = 80,
                b;
            k.forEach(this.layer.renderer.visualVariables, function(a) {
                "sizeInfo" === a.type && (b = a)
            });
            b && (b.minSize && b.maxSize && this.layer.graphics.length) && (a = 100 * (b.minSize / this.layer.symbolTileSize), c = 100 *
                (b.maxSize / this.layer.symbolTileSize));
            this._symbolSizeSlider.set("value", [a, c])
        },
        _loadTileSizeValue: function() {
            this._symbolDensitySlider.set("value", this.layer.symbolTileSize ? 1 / this.layer.symbolTileSize : 0.02)
        },
        _loadMinMaxValues: function() {
            var a;
            k.forEach(this.layer.renderer.visualVariables, function(b) {
                "sizeInfo" === b.type && (a = b)
            });
            this.minMagnitudeInput.set("value", a && t.isDefined(a.minDataValue) ? a.minDataValue : "");
            this.maxMagnitudeInput.set("value", a && t.isDefined(a.maxDataValue) ? a.maxDataValue : "")
        },
        _loadAngleDirection: function() {
            var a = this.layer.getFlowRepresentation(),
                c = a ? !0 : !1,
                f = "FLOW_FROM",
                f = c ? a == b.FLOW_TO ? "FLOW_TO" : "FLOW_FROM" : this.layer.renderer.flowRepresentation == b.FLOW_TO ? "FLOW_TO" : "FLOW_FROM";
            this.flowAngleSelect.set("value", f);
            this.flowAngleSelect.set("disabled", c)
        },
        _loadColor: function() {
            this.layer.renderer && (this.layer.renderer.renderer && this.layer.renderer.renderer.defaultSymbol && this.startupCalled) && (this.symbolColorPicker.set("color", this.layer.renderer.renderer.defaultSymbol.color),
                this._updateArrowSymbolButton())
        },
        _loadUnits: function() {
            this.layer.vectorFieldPixelFilter && (this.layer.vectorFieldPixelFilter.inputUnit ? this.inputDataUnitSelect.set("value", this.layer.vectorFieldPixelFilter.inputUnit) : this.inputDataUnitSelect.set("value", "NO_UNIT"), this.layer.vectorFieldPixelFilter.outputUnit && this.outputDataUnitSelect.set("value", this.layer.vectorFieldPixelFilter.outputUnit))
        },
        _onOutputUnitChange: function(a) {
            this.dataValueRangeUnit.innerHTML = a && "NO_UNIT" != a ? " in \x3cstrong\x3e" +
                this._i18n.widgets.vectorFieldRenderer[a] + "\x3c/strong\x3e." : ".";
            this.propertiesChanged = !0
        },
        _onClickApplyVectorFieldRenderer: function() {
            if (this.propertiesChanged) {
                var a = b.STYLE_SINGLE_ARROW,
                    c, f, d, e, g, h, k;
                d = Math.floor(1 / this._symbolDensitySlider.value);
                c = p.px2pt(this._symbolSizeSlider.value[0] / 100 * d);
                f = p.px2pt(this._symbolSizeSlider.value[1] / 100 * d);
                e = !isNaN(this.minMagnitudeInput.value) ? this.minMagnitudeInput.value : null;
                g = !isNaN(this.maxMagnitudeInput.value) ? this.maxMagnitudeInput.value : null;
                h = b[this.flowAngleSelect.value];
                "singleArrow" == this.rendererTypeSelect.value ? a = b.STYLE_SINGLE_ARROW : "simpleScalar" == this.rendererTypeSelect.value ? a = b.STYLE_SCALAR : "beaufort" == this.rendererTypeSelect.value ? "esriKnots" == this.outputDataUnitSelect.value ? a = b.STYLE_BEAUFORT_KN : "esriMetersPerSecond" == this.outputDataUnitSelect.value ? a = b.STYLE_BEAUFORT_METER : "esriMilesPerHour" == this.outputDataUnitSelect.value ? a = b.STYLE_BEAUFORT_MILE : "esriKilometersPerHour" == this.outputDataUnitSelect.value && (a = b.STYLE_BEAUFORT_KM) : "oceanCurrentKnots" == this.rendererTypeSelect ?
                    a = b.STYLE_OCEAN_CURRENT_KN : "oceanCurrentMps" == this.rendererTypeSelect ? a = b.STYLE_OCEAN_CURRENT_M : "classifiedArrow" == this.rendererTypeSelect ? a = b.STYLE_CLASSIFIED_ARROW : "windBarbs" == this.rendererTypeSelect && (a = b.STYLE_WIND_BARBS);
                this.symbolColorPicker && this.symbolColorPicker.color && (k = this.layer.renderer._getDefaultSymbol(new s(this.symbolColorPicker.color)));
                var l = "NO_UNIT" !== this.inputDataUnitSelect.value ? this.inputDataUnitSelect.value : "",
                    m = "NO_UNIT" !== this.outputDataUnitSelect.value ? this.outputDataUnitSelect.value :
                    "";
                this.layer.vectorFieldPixelFilter.setUnits(l, m);
                this.layer.rendererStyle = a;
                var n = [];
                n.push({
                    type: "sizeInfo",
                    minSize: c,
                    maxSize: f,
                    minDataValue: e,
                    maxDataValue: g
                });
                a = new b({
                    style: a,
                    visualVariables: n,
                    flowRepresentation: h,
                    singleArrowSymbol: k || null,
                    outputUnit: m,
                    inputUnit: l
                });
                this.layer.setRenderer(a);
                this.layer.symbolTileSize !== d ? (this.layer.symbolTileSize = d, this.layer.refresh()) : this.layer.redraw();
                this._loadVFRStyle();
                this.propertiesChanged = !1;
                this.resetAvailable = !0
            }
        },
        _onClickResetVectorFieldRenderer: function() {
            if (this.layer &&
                (this.propertiesChanged || this.resetAvailable)) {
                var a = this;
                this.layer.symbolTileSize = 50;
                this.layer.setVectorRendererStyle(b.STYLE_SINGLE_ARROW);
                var c = Math.floor(1 / this._symbolDensitySlider.value);
                this.layer.vectorFieldPixelFilter && this.layer.vectorFieldPixelFilter.setUnits(null, null);
                this.layer.symbolTileSize !== c ? this.layer.refresh() : this.layer.redraw();
                this._loadVFRArguments();
                this.resetAvailable = this.propertiesChanged = !1;
                setTimeout(function() {
                    a.propertiesChanged = !1
                }, 500)
            }
        },
        _updateArrowSymbolButton: function(a) {
            this._arrowSymbolButtonNode.innerHTML =
                "";
            var b = p.createSurface(this._arrowSymbolButtonNode, 24, 24);
            a = b.createShape({
                type: "path",
                path: "M14,32 14,18 9,23 16,3 22,23 17,18 17,32 z"
            }).setFill(a ? a : this.symbolColorPicker.color);
            b.getDimensions();
            var f = {
                    dx: 0,
                    dy: 0
                },
                d = a.getBoundingBox(),
                e = d.width,
                d = d.height;
            if (24 > e || 24 > d) e = (e + 5) / 24, h.mixin(f, {
                xx: e,
                yy: e
            });
            a.applyTransform(f);
            return b
        },
        _onInputUnitChange: function(a) {
            "NO_UNIT" != a || "beaufort" == this.rendererTypeSelect.value || "oceanCurrent" == this.rendererTypeSelect.value ? this.outputDataUnitSelect.set("disabled", !1) : (this.outputDataUnitSelect.set("value", "NO_UNIT"), this.outputDataUnitSelect.set("disabled", !0));
            this.propertiesChanged = !0
        },
        _refreshOutputUnitSelect: function() {
            this._outputUnits = [];
            "oceanCurrentMps" != this.rendererTypeSelect.value && this._outputUnits.push({
                id: "esriKnots",
                label: this._i18n.widgets.vectorFieldRenderer.esriKnots
            });
            "oceanCurrentKnots" != this.rendererTypeSelect.value && "windBarbs" != this.rendererTypeSelect.value && (this._outputUnits.push({
                    id: "esriMetersPerSecond",
                    label: this._i18n.widgets.vectorFieldRenderer.esriMetersPerSecond
                }),
                "oceanCurrentMps" != this.rendererTypeSelect.value && (this._outputUnits.push({
                    id: "esriKilometersPerHour",
                    label: this._i18n.widgets.vectorFieldRenderer.esriKilometersPerHour
                }), this._outputUnits.push({
                    id: "esriMilesPerHour",
                    label: this._i18n.widgets.vectorFieldRenderer.esriMilesPerHour
                }), "beaufort" != this.rendererTypeSelect.value && (this._outputUnits.push({
                    id: "esriFeetPerSecond",
                    label: this._i18n.widgets.vectorFieldRenderer.esriFeetPerSecond
                }), this._outputUnits.push({
                    id: "NO_UNIT",
                    label: " ",
                    selected: !0
                }))));
            var a = new n({
                    data: this._outputUnits
                }),
                a = new x({
                    objectStore: a
                });
            this.outputDataUnitSelect.set("store", a);
            "oceanCurrentKnots" === this.rendererTypeSelect.value || "beaufort" === this.rendererTypeSelect.value ? this.outputDataUnitSelect.set("value", "esriKnots") : "oceanCurrentMps" === this.rendererTypeSelect.value && this.outputDataUnitSelect.set("value", "esriMetersPerSecond")
        },
        _setPropertiesChanged: function() {
            this.propertiesChanged = !0
        }
    })
});