//>>built
define(["../Color", "../kernel", "./_EventedWidget", "./_Tooltip", "./ColorPicker/colorUtil", "./ColorPicker/HexPalette", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dojo/_base/array", "dojo/_base/declare", "dojo/_base/lang", "dojo/dom-class", "dojo/dom-construct", "dojo/on", "dojo/query", "dojo/sniff", "dojo/dom-style", "dojo/i18n!../nls/jsapi", "dojo/text!./ColorPicker/templates/ColorPicker.html", "./HorizontalSlider", "dijit/form/RadioButton", "dijit/form/TextBox", "dijit/form/ToggleButton", "dojo/NodeList-dom"], function(n, q, t, u, e, s, v, w,
    g, x, k, h, p, m, r, y, l, z, A) {
    q = x("esri.dijit.ColorPicker", [t, v, w, u], {
        _DEFAULT_COLORS_PER_ROW: 13,
        templateString: A,
        labels: z.colorPicker,
        baseClass: "esriColorPicker",
        color: null,
        trackColors: !0,
        _required: !1,
        _activePalette: null,
        recentColors: [],
        _showRecentColors: !0,
        _showTransparencySlider: !0,
        colorsPerRow: void 0,
        _brightsPalette: null,
        _pastelsPalette: null,
        _swatches: null,
        _colorInstance: null,
        _swatchCreator: null,
        _noColorSwatchNode: null,
        constructor: function(a, b) {
            a = a || {};
            k.extend(this.constructor, {
                css: {
                    container: "esriContainer",
                    header: "esriHeader",
                    footer: "esriFooter",
                    middle: "esriMiddle",
                    swatch: "esriSwatch",
                    swatchRow: "esriSwatchRow",
                    swatchEmpty: "esriSwatchEmpty",
                    swatchPreview: "esriSwatchPreview",
                    swatchTransparencyBackground: "esriSwatchTransparencyBackground",
                    palette: "esriPalette",
                    paletteOptions: "esriPaletteOptions",
                    paletteToggle: "esriPaletteToggle",
                    label: "esriLabel",
                    hexInput: "esriHexInput",
                    recent: "esriRecent",
                    suggested: "esriSuggested",
                    selected: "esriSelected",
                    disabled: "esriDisabled",
                    section: "esriSection",
                    displayNone: "esriDisplayNone",
                    transparencySlider: "esriTransparencySlider"
                }
            });
            this._colorInstance = new n;
            this._brightsPalette = new s({
                colors: a.palette
            });
            this._pastelsPalette = new s({
                colors: this._toPastels(this._brightsPalette.get("colors"))
            });
            this._activePalette = this._brightsPalette;
            this._swatchCreator = a.swatchCreator || this._createSwatch;
            a.hasOwnProperty("required") && (this._required = a.required);
            a.hasOwnProperty("showRecentColors") && (this._showRecentColors = a.showRecentColors);
            a.hasOwnProperty("showSuggestedColors") && (this._showSuggestedColors =
                a.showSuggestedColors);
            a.hasOwnProperty("showTransparencySlider") && (this._showTransparencySlider = a.showTransparencySlider);
            a.color && (a.color = e.normalizeColor(a.color));
            this.domNode = b;
            this.colorsPerRow = 0 < a.colorsPerRow ? a.colorsPerRow : this._DEFAULT_COLORS_PER_ROW;
            this._swatches = []
        },
        _toPastels: function(a) {
            var b = this._colorInstance,
                c = new n([238, 238, 238]);
            return g.map(a, function(a) {
                return n.blendColors(b.setColor(a), c, 0.2)
            }, this)
        },
        _createSwatch: function(a) {
            return p.create("span", {
                className: a.className,
                style: {
                    background: a.hexColor || "transparent"
                }
            }, a.paletteNode)
        },
        _createSwatches: function() {
            var a = this.css.swatch,
                b = this.css.swatchRow,
                c = this.dap_palette,
                f = this.colorsPerRow,
                d = this._activePalette.get("colors"),
                e, h;
            g.forEach(d, function(d, g) {
                0 === g % f && (e = p.create("div", {
                    className: b
                }, c));
                h = this._swatchCreator({
                    className: a,
                    hexColor: d,
                    paletteNode: e
                });
                this._swatches.push(h)
            }, this)
        },
        _selectColor: function() {
            var a = this.color || this._activePalette.get("colors")[0];
            this.set("color", a)
        },
        _updatePreviewSwatch: function(a) {
            var b =
                this.css.swatchEmpty,
                c = this.dap_previewSwatch,
                f, d;
            "no-color" === a ? (h.add(c, b), l.set(c, {
                backgroundColor: "",
                borderColor: ""
            })) : (f = e.getContrastingColor(a), d = 8 !== y("ie"), h.remove(c, b), b = a.toCss(d), f = f.toCss(d), f = {
                backgroundColor: b,
                borderColor: f
            }, d || (f.opacity = a.a), l.set(c, f))
        },
        _renderBrights: function() {
            this._renderColors(this._brightsPalette)
        },
        _renderColors: function(a) {
            var b = a.get("colors"),
                c = this._swatches;
            g.forEach(b, function(a, b) {
                b < c.length && l.set(c[b], "backgroundColor", a)
            });
            this._activePalette = a
        },
        _renderPastels: function() {
            this._renderColors(this._pastelsPalette)
        },
        _setColorFromSwatch: function(a) {
            a = l.get(a, "backgroundColor");
            this.set("color", a)
        },
        _checkSelection: function() {
            var a = this.get("color");
            this._activePalette.contains(a) ? this._highlightColor(a) : this._clearSelection()
        },
        _addListeners: function() {
            var a = "." + this.css.swatch;
            this.own(m(this.dap_palette, m.selector(a, "click"), k.hitch(this, function(a) {
                this._setColorFromSwatch(a.target)
            })));
            this.own(m(this.dap_recentColorPalette, m.selector(a, "click"),
                k.hitch(this, function(a) {
                    this._setColorFromSwatch(a.target)
                })));
            this.own(m(this.dap_suggestedColorPalette, m.selector(a, "click"), k.hitch(this, function(a) {
                this._setColorFromSwatch(a.target)
            })));
            this._required || this.own(m(this._noColorSwatchNode, "click", k.hitch(this, function(a) {
                var b = a.target,
                    d = this.css.selected;
                this.set("color", "no-color");
                h.add(b, d);
                this._silentlyUpdateHexInput("no-color");
                this._disableTransparencySlider();
                a = this.on("color-change", k.hitch(this, function() {
                    this._enableTransparencySlider();
                    h.remove(b, d)
                }));
                this.own(a)
            })));
            var b = this.dap_hexInput;
            b.on("blur", k.hitch(this, function() {
                var a = e.normalizeHex(b.get("value"));
                e.isShorthandHex(a) ? this.set("color", a) : this._silentlyUpdateHexInput(this.color)
            }));
            b.on("change", k.hitch(this, function() {
                var a = e.normalizeHex(b.get("value"));
                e.isLonghandHex(a) && (this._colorInstance.setColor(a), this.color.toHex() !== a && this.set("color", a))
            }));
            this.dap_transparencySlider.on("change", k.hitch(this, function(a) {
                var b = this.get("color");
                "no-color" !== b && (b = e.normalizeColor(this._colorInstance.setColor(b)),
                    b.a = 1 - a, this._updatePreviewSwatch(b), this._silentlyUpdateHexInput(b), this.set("color", b))
            }));
            this.dap_paletteToggle.on("change", k.hitch(this, function(a) {
                a ? this._renderPastels() : this._renderBrights();
                this._checkSelection()
            }))
        },
        postCreate: function() {
            this.inherited(arguments);
            this._addListeners();
            this._selectColor();
            this.dap_hexInput.intermediateChanges = !0;
            this.dap_transparencySlider.intermediateChanges = !0;
            this.createTooltips([{
                node: this.dap_palette,
                label: this.labels.paletteTooltip
            }, {
                node: this.dap_hexInput,
                label: this.labels.hexInputTooltip
            }, {
                node: this._noColorSwatchNode,
                label: this.labels.noColorTooltip
            }, {
                node: this.dap_paletteToggle,
                label: this.labels.moreColorsTooltip
            }])
        },
        startup: function() {
            this.inherited(arguments)
        },
        buildRendering: function() {
            this.inherited(arguments);
            this._createSwatches();
            var a = this.css.swatch,
                b = this.css.swatchEmpty;
            this._required || (this._noColorSwatchNode = p.create("div", {
                className: a + " " + b
            }, this.dap_hexInput.domNode, "after"));
            a = this.css.displayNone;
            this._showTransparencySlider || h.add(this.dap_transparencySection,
                a);
            this._showRecentColors || h.add(this.dap_recentColorSection, a);
            this._showSuggestedColors || h.add(this.dap_suggestedColorSection, a)
        },
        _silentlyUpdateHexInput: function(a) {
            a = "no-color" === a ? "" : a.toHex();
            this._silentlyUpdateIntermediateChangingValueWidget(this.dap_hexInput, a)
        },
        _silentlyUpdateIntermediateChangingValueWidget: function(a, b) {
            a.intermediateChanges = !1;
            a.set("value", b, !1);
            a.intermediateChanges = !0
        },
        addRecentColor: function(a) {
            a && "no-color" !== a && this._addRecentColor(e.normalizeColor(a).toHex())
        },
        _addRecentColor: function(a) {
            if (a) {
                var b = this.recentColors,
                    c = g.indexOf(b, a); - 1 < c && b.splice(c, 1);
                b.unshift(a);
                b.length > this.colorsPerRow && b.pop();
                this._renderRecentSwatches()
            }
        },
        _renderRecentSwatches: function() {
            if (this.recentColors) {
                var a = this.css.recent,
                    b = this.css.swatch,
                    c = r("." + a + "." + b, this.dap_recentColorPalette);
                g.forEach(this.recentColors, function(f, d) {
                    if (d < this.colorsPerRow) {
                        if (d + 1 > c.length) {
                            var e = this._swatchCreator({
                                hexColor: f,
                                className: b + " " + a,
                                paletteNode: this.dap_recentColorPalette
                            });
                            c.push(e)
                        }
                        l.set(c[d],
                            "backgroundColor", f)
                    }
                }, this)
            }
        },
        _renderSuggestedSwatches: function() {
            if (this.suggestedColors) {
                var a = this.css.suggested,
                    b = this.css.swatch,
                    c = r("." + a + "." + b, this.dap_recentColorPalette);
                g.forEach(this.suggestedColors, function(f, d) {
                    if (d < this.colorsPerRow) {
                        if (d + 1 > c.length) {
                            var e = this._swatchCreator({
                                hexColor: f,
                                className: b + " " + a,
                                paletteNode: this.dap_suggestedColorPalette
                            });
                            c.push(e)
                        }
                        l.set(c[d], "backgroundColor", f)
                    }
                }, this)
            }
        },
        _clearRecentSwatches: function() {
            p.empty(this.dap_recentColorPalette)
        },
        _clearSuggestedSwatches: function() {
            p.empty(this.dap_suggestedColorPalette)
        },
        _clearSelection: function() {
            var a = this.css.selected;
            r("." + a, this.dap_palette).removeClass(a)
        },
        _highlightColor: function(a) {
            var b = this.css.selected,
                c = this._findColorSwatch(a);
            c && (a = e.normalizeColor(a), a = e.getContrastingColor(a), h.add(c, b), l.set(c, "borderColor", a.toHex()))
        },
        _findColorSwatch: function(a) {
            var b = this._activePalette.get("colors");
            a = this._colorInstance.setColor(a).toHex();
            var b = g.indexOf(b, a),
                c; - 1 < b && (c = this._swatches[b]);
            return c
        },
        _getColorAttr: function() {
            return new n(this.color)
        },
        _previousColor: null,
        _enableTransparencySlider: function() {
            h.remove(this.dap_transparencyLabel, this.css.disabled);
            this.dap_transparencySlider.set("disabled", !1)
        },
        _disableTransparencySlider: function() {
            h.add(this.dap_transparencyLabel, this.css.disabled);
            this.dap_transparencySlider.set("disabled", !0)
        },
        _setColorAttr: function(a, b) {
            if (a)
                if (b = b || void 0 === b, !this._required && "no-color" === a) this._disableTransparencySlider(), this._set("color", "no-color"), this._clearSelection(), this._silentlyUpdateHexInput("no-color"), this._updatePreviewSwatch(a),
                    b && this.emit("color-change", {
                        color: "no-color"
                    });
                else {
                    var c = e.normalizeColor(a),
                        f = this._previousColor,
                        d = this._colorInstance,
                        g = this.css.selected;
                    if (f) {
                        if (e.equal(f, c)) return;
                        if (f = this._findColorSwatch(f)) h.remove(f, g), l.set(f, "borderColor", "")
                    }
                    d.setColor(c);
                    g = d.toHex();
                    this._set("color", new n(d));
                    this._previousColor = c;
                    this._silentlyUpdateIntermediateChangingValueWidget(this.dap_transparencySlider, 1 - d.a);
                    this._updatePreviewSwatch(d);
                    this._checkSelection();
                    this._silentlyUpdateHexInput(d);
                    this.trackColors &&
                        this._addRecentColor(g);
                    b && this.emit("color-change", {
                        color: new n(d)
                    })
                }
        },
        _getRecentColorsAttr: function() {
            return g.map(this.recentColors, function(a) {
                return e.normalizeColor(a)
            })
        },
        _setRecentColorsAttr: function(a) {
            this.recentColors = a || [];
            this._showRecentColors && (this.recentColors = g.map(this.recentColors, function(a) {
                return e.normalizeColor(a).toHex()
            }));
            0 === this.recentColors.length ? this._clearRecentSwatches() : this._renderRecentSwatches()
        },
        suggestedColors: null,
        _getSuggestedColorsAttr: function() {
            return g.map(this.suggestedColors,
                function(a) {
                    return e.normalizeColor(a)
                })
        },
        _setSuggestedColorsAttr: function(a) {
            this._showSuggestedColors && (this._clearSuggestedSwatches(), this.suggestedColors = a || [], this.suggestedColors = g.map(this.suggestedColors, function(a) {
                return e.normalizeColor(a).toHex()
            }), 0 < this.suggestedColors.length && this._renderSuggestedSwatches())
        },
        _setPaletteAttr: function(a) {
            var b = this._activePalette === this._brightsPalette;
            this._brightsPalette.set("colors", a);
            this._pastelsPalette.set("colors", this._toPastels(this._brightsPalette.get("colors")));
            this._activePalette = b ? this._brightsPalette : this._pastelsPalette;
            this._renderColors(this._activePalette)
        },
        saveRecentColors: function(a) {
            localStorage.setItem(a, JSON.stringify(this.get("recentColors")))
        },
        loadRecentColors: function(a) {
            this.set("recentColors", JSON.parse(localStorage.getItem(a)))
        }
    });
    q.NO_COLOR = "no-color";
    return q
});