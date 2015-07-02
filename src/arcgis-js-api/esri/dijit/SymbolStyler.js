//>>built
define(["../dijit/ColorPicker", "../domUtils", "../kernel", "../symbol", "./_EventedWidget", "./_Tooltip", "./ColorPicker/colorUtil", "./SymbolStyler/_DelayedUpdate", "./SymbolStyler/IconSelect", "./SymbolStyler/MarkerSymbolPicker", "./SymbolStyler/schemeUtil", "./SymbolStyler/stylerUtil", "./SymbolStyler/symbolUtil", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/a11yclick", "dojo/_base/array", "dojo/_base/declare", "dojo/_base/lang", "dojo/dom-class", "dojo/has", "dojo/keys", "dojo/on", "dojo/string", "dojo/i18n!esri/nls/jsapi", "dojo/text!./SymbolStyler/templates/SymbolStyler.html", "../dijit/HorizontalSlider", "./SymbolStyler/MarkerSymbolPicker", "./SymbolStyler/ColorRampPicker", "dijit/form/Button", "dijit/form/NumberSpinner", "dijit/form/Select", "dijit/form/TextBox", "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dijit/layout/StackController", "dijit/layout/StackContainer"], function(l, f, E, k, t, u, v, w, m, x, n, g, e, y, z, p, A, B, c, h, F, C, q, r, s, D) {
    return B([t, y, z, w, u], {
        _RECENT_FILL_COLORS_ITEM_KEY: "symbolStyler/recent/fill/colors",
        _RECENT_OUTLINE_COLORS_ITEM_KEY: "symbolStyler/recent/outline/colors",
        _defaultMinLineWidthInPx: 0,
        _defaultMinShapeSizeInPx: 1,
        _defaultMaxLineWidthInPx: 18,
        _defaultMaxShapeSizeInPx: 120,
        declaredClass: "esri.dijit.SymbolStyler",
        baseClass: "esriSymbolStyler",
        templateString: D,
        labels: null,
        _originalSymbol: null,
        _editedSymbol: null,
        _activeTabName: null,
        _delayedCommitPropsTrigger: null,
        _symbolPickerOpts: {},
        _symbolPreviewSurface: null,
        _linePatternSelect: null,
        _symbolPicker: null,
        _customImageSymbol: null,
        constructor: function(a) {
            a = a ? a : {};
            this._delayedCommitPropsTrigger = this.createUpdateTrigger(this._commitProperties, this);
            a.portalSelf ? this._symbolPickerOpts.portalSelf = a.portalSelf : a.portalUrl && (this._symbolPickerOpts.portalUrl = a.portalUrl);
            c.extend(this.constructor, {
                css: {
                    symbolPreviewContainer: "esriSymbolPreviewContainer",
                    symbolPreview: "esriSymbolPreview",
                    tabBar: "esriTabBar",
                    content: "esriContent",
                    link: "esriLink",
                    label: "esriLabel",
                    shapeImageUrlContainer: "esriShapeImageUrlContainer",
                    urlInput: "esriUrlInput",
                    addIcon: "esriAddIcon",
                    errorDisplay: "esriErrorDisplay",
                    symbolSizeInput: "esriSymbolSizeInput",
                    inlineInput: "esriInlineInput",
                    text: "esriText",
                    hidden: "esriHidden",
                    lineWidthInput: "esriLineWidthInput",
                    linePattern: "esriLinePattern",
                    linePatternInput: "esriLinePatternInput",
                    alt: "esriAlt",
                    disabled: "esriDisabled"
                }
            })
        },
        postMixInProperties: function() {
            this.inherited(arguments);
            this.labels = c.mixin({}, s.common,
                s.symbolEditor)
        },
        _setUpColorControls: function(a, b) {
            var d = this.dap_outlineColorRampPicker,
                e = this.dap_outlineColorPicker,
                c = this.dap_fillColorRampPicker,
                f = this.dap_fillColorPicker,
                g;
            b ? (g = {
                colors: b.colors
            }, b.scheme && (g.scheme = b.scheme), this._isLine() ? (d.set({
                schemes: a,
                selected: g,
                numStops: b.numStops
            }), this._hide(e.domNode), this._show(d.domNode)) : (c.set({
                schemes: a,
                selected: g,
                numStops: b.numStops
            }), this._show(c.domNode), this._show(e.domNode), this._hide(f.domNode), this._hide(d.domNode))) : (this._show(f.domNode),
                this._show(e.domNode), this._hide(c.domNode), this._hide(d.domNode), this._updateSuggestedColors(f, n.getFillColors(a)));
            this._updateSuggestedColors(e, n.getOutlineColors(a))
        },
        edit: function(a, b) {
            var d = e.cloneSymbol(a),
                c;
            b = b || {};
            this._colorRamp = c = b.colorRamp;
            this._originalSymbol = a;
            this._editedSymbol = d;
            this._activeTabName = b.activeTab;
            this._setUpColorControls(b.schemes, c);
            this._assimilateSymbol(d);
            this._toggleSizingControls(b.externalSizing);
            this._updateSymbolPicker()
        },
        _importRecentColors: function() {
            this.dap_fillColorPicker.loadRecentColors(this._RECENT_FILL_COLORS_ITEM_KEY);
            this.dap_outlineColorPicker.loadRecentColors(this._RECENT_OUTLINE_COLORS_ITEM_KEY)
        },
        _hasColorRamp: function() {
            return !!this._colorRamp
        },
        _toggleSizingControls: function(a) {
            var b = !1,
                d = !1;
            a && (this._isLine() ? d = !0 : b = !0);
            h.toggle(this.dap_lineWidthLabel, this.css.disabled, d);
            this.dap_lineWidthTextBox.set("disabled", d);
            this.dap_lineWidthSlider.set("disabled", d);
            h.toggle(this.dap_shapeSizeLabel, this.css.disabled, b);
            this.dap_shapeSizeTextBox.set("disabled", b);
            this.dap_shapeSizeSlider.set("disabled", b)
        },
        _updateSymbolPicker: function() {
            var a =
                this._isPoint() && this._hasColorRamp() ? "default" : "portal";
            "portal" === a ? f.show(this.dap_useImageContent) : f.hide(this.dap_useImageContent);
            this._symbolPicker.set("displayMode", a);
            this._symbolPicker.clearSelection()
        },
        shapeSymbol: null,
        _setShapeSymbolAttr: function(a) {
            this._adjustOutlineProperties(this._editedSymbol, a);
            this._set("shapeSymbol", a);
            this._editedSymbol = a;
            this._toggleTabs(a);
            this._delayedCommitPropsTrigger()
        },
        _adjustOutlineProperties: function(a, b) {
            var d, c, f;
            this._switchedFromPictureMarkerSymbolToSimpleMarkerSymbol(a,
                b) ? (this.dap_fillColorPicker.set("color", b.color), d = e.getOutline(b), this.dap_outlineColorPicker.set("color", d.color), this.dap_lineWidthSlider.set("value", d.width), this._linePatternSelect.set("value", d.style)) : this._switchedSimpleMarkerSymbolStyleToPureOutline(a, b) && (d = e.getOutline(a), f = this.dap_outlineColorPicker.get("color"), d.color ? (c = v.isBright(d.color)) && 0.2 > d.color.a ? (f.a = 0.2, this.dap_outlineColorPicker.set("color", f)) : !c && 0.1 > d.color.a && (f.a = 0.1, this.dap_outlineColorPicker.set("color", f)) : this.dap_outlineColorPicker.set("color",
                b.color))
        },
        _switchedFromPictureMarkerSymbolToSimpleMarkerSymbol: function(a, b) {
            return a && b && "picturemarkersymbol" === a.type && "simplemarkersymbol" === b.type
        },
        _switchedSimpleMarkerSymbolStyleToPureOutline: function(a, b) {
            return a && b && "simplemarkersymbol" === a.type && "simplemarkersymbol" === b.type && -1 === "x,cross".indexOf(a.style) && -1 < "x,cross".indexOf(b.style)
        },
        shapeSize: null,
        _setShapeSizeAttr: function(a) {
            this._set("shapeSize", a);
            this._delayedCommitPropsTrigger()
        },
        _shapeImageUrl: null,
        _setShapeImageUrlAttr: function(a) {
            this._set("shapeImageUrl",
                a);
            this._delayedCommitPropsTrigger()
        },
        fillColor: null,
        _setFillColorAttr: function(a) {
            a = a === l.NO_COLOR ? null : a;
            this._set("fillColor", a);
            this._delayedCommitPropsTrigger()
        },
        fillColorRamp: null,
        _setFillColorRampAttr: function(a) {
            this._set("fillColorRamp", a);
            this._delayedCommitPropsTrigger()
        },
        outlineColorRamp: null,
        _setOutlineColorRampAttr: function(a) {
            this._set("outlineColorRamp", a);
            this._delayedCommitPropsTrigger()
        },
        outlineWidth: null,
        _setOutlineWidthAttr: function(a) {
            this._set("outlineWidth", a);
            this._delayedCommitPropsTrigger()
        },
        outlineColor: null,
        _setOutlineColorAttr: function(a) {
            a = a === l.NO_COLOR ? null : a;
            this._set("outlineColor", a);
            h.toggle(this.dap_lineWidthLabel, this.css.disabled, !a);
            this.dap_lineWidthSlider.set("disabled", !a);
            this.dap_lineWidthTextBox.set("disabled", !a);
            h.toggle(this.dap_linePatternSelectLabel, this.css.disabled, !a);
            this._linePatternSelect.set("disabled", !a);
            this._delayedCommitPropsTrigger()
        },
        outlinePattern: null,
        _setOutlinePatternAttr: function(a) {
            this._set("outlinePattern", a);
            this._delayedCommitPropsTrigger()
        },
        _getTabContainer: function(a) {
            return "fill" === a ? this.dap_fillContainer : "outline" === a ? this.dap_outlineContainer : this.dap_shapeContainer
        },
        _storeRecentFillColors: function() {
            this._storeRecentColors(this.dap_fillColorPicker, this._RECENT_FILL_COLORS_ITEM_KEY)
        },
        _storeRecentOutlineColors: function() {
            this._storeRecentColors(this.dap_outlineColorPicker, this._RECENT_OUTLINE_COLORS_ITEM_KEY)
        },
        _storeRecentColors: function(a, b) {
            a.addRecentColor(a.get("color"));
            a.saveRecentColors(b)
        },
        _isPoint: function() {
            return e.isPoint(this._editedSymbol)
        },
        _isLine: function() {
            return e.isLine(this._editedSymbol)
        },
        _isPolygon: function() {
            return e.isPolygon(this._editedSymbol)
        },
        _addHandlers: function() {
            this.own(this.dap_shapeContainer.on("show", c.hitch(this, function() {
                this._symbolPicker._updateTemplatePickerIfHeightless()
            })));
            this._linePatternSelect.on("change", c.hitch(this, function(a) {
                this.set("outlinePattern", a)
            }));
            this.own(q(this.dap_loadShapeImageUrl, p, c.hitch(this, function() {
                this._loadImage(this.dap_shapeImageUrlInput.get("value"))
            })));
            this.own(q(this.dap_addImage,
                p, c.hitch(this, function() {
                    f.show(this.dap_shapeImageUrlContainer);
                    this.dap_shapeImageUrlInput.focus()
                })));
            this.dap_shapeImageUrlInput.on("input", c.hitch(this, function(a) {
                a.keyCode === C.ENTER && this._loadImage(this.dap_shapeImageUrlInput.get("value"))
            }));
            this.dap_shapeImageUrlInput.on("change", c.hitch(this, function(a) {
                this.set("shapeImageUrl", a)
            }));
            this.dap_shapeSizeSlider.on("change", c.hitch(this, function(a) {
                this.set("shapeSize", a)
            }));
            this.dap_fillColorPicker.on("color-change", c.hitch(this, function(a) {
                this.set("fillColor",
                    a.color)
            }));
            this.dap_fillColorRampPicker.on("color-ramp-change", c.hitch(this, function(a) {
                this.set("fillColorRamp", a.colors)
            }));
            this.dap_outlineColorRampPicker.on("color-ramp-change", c.hitch(this, function(a) {
                this.set("outlineColorRamp", a.colors)
            }));
            this.dap_lineWidthSlider.on("change", c.hitch(this, function(a) {
                this.set("outlineWidth", a)
            }));
            this.dap_outlineColorPicker.on("color-change", c.hitch(this, function(a) {
                this.set("outlineColor", a.color)
            }));
            g.bindSliderAndSpinner(this.dap_lineWidthSlider, this.dap_lineWidthTextBox);
            g.bindSliderAndSpinner(this.dap_shapeSizeSlider, this.dap_shapeSizeTextBox);
            this._symbolPicker.on("symbol-select", c.hitch(this, function(a) {
                this._hideImageUrlInput();
                this.set("shapeSymbol", a.selection)
            }));
            this.dap_shapeSizeSlider.on("change", c.hitch(this, this._onSizeChange));
            this.dap_fillColorPicker.on("color-change", c.hitch(this, this._onFillColorChange));
            this.dap_outlineColorPicker.on("color-change", c.hitch(this, this._onOutlineColorChange));
            this.dap_lineWidthSlider.on("change", c.hitch(this, this._onWidthChange))
        },
        getStyle: function() {
            var a = {
                    symbol: e.cloneSymbol(this._editedSymbol)
                },
                b;
            this._hasColorRamp() && (b = this._isLine() ? this.dap_outlineColorRampPicker : this.dap_fillColorRampPicker, c.mixin(a, b.getStyle()));
            return a
        },
        storeColors: function() {
            this._storeRecentFillColors();
            this._storeRecentOutlineColors()
        },
        postCreate: function() {
            this.inherited(arguments);
            this._linePatternSelect = new m({
                baseClass: m.prototype.baseClass + " " + this.baseClass + " " + this.css.linePatternInput
            }, this.dap_linePatternSelect);
            f.hide(this.dap_shapeImageUrlContainer);
            this.dap_lineWidthSlider.intermediateChanges = !0;
            this.dap_lineWidthTextBox.intermediateChanges = !0;
            this.dap_shapeSizeSlider.intermediateChanges = !0;
            this.dap_shapeSizeTextBox.intermediateChanges = !0;
            this.dap_fillColorPicker.trackColors = !1;
            this.dap_outlineColorPicker.trackColors = !1;
            this._linePatternSelect.addIconOptions(["solid", "dot", "dash", "dashdot", "dashdotdot"], this.css.linePattern);
            this._importRecentColors();
            this.createTooltips([{
                node: this.dap_shapeImageUrlContainer,
                label: this.labels.imageUrlInputTooltip
            }, {
                node: this.dap_addImage,
                label: this.labels.useImageTooltip
            }, {
                node: this.dap_symbolSizeOptions
            }, {
                node: this.dap_lineWidthOptions
            }])
        },
        _updateSliderAndTextBoxConstraints: function(a) {
            a.textBox.set("constraints", {
                min: a.minimum,
                max: a.maximum
            });
            a.slider.set({
                minimum: a.minimum,
                maximum: a.maximum,
                discreteValues: a.maximum
            })
        },
        _loadImage: function(a) {
            this._clearUrlImageErrorDisplay();
            e.testImageUrl(a).then(c.hitch(this, function() {
                var b, d;
                b = this._customImageSymbol;
                d = this.shapeSize;
                b ? (b.url = a, b.height = d, b.width = d) :
                    this._customImageSymbol = b = new k.PictureMarkerSymbol(a, d, d);
                this.set("shapeSymbol", b)
            }), c.hitch(this, function() {
                this._showUrlImageErrorDisplay(this.labels.imageLoadError)
            }))
        },
        _showUrlImageErrorDisplay: function(a) {
            this.dap_shapeImageUrlErrorDisplay.innerHTML = a
        },
        _clearUrlImageErrorDisplay: function() {
            this.dap_shapeImageUrlErrorDisplay.innerHTML = ""
        },
        _getActiveTabAttr: function() {
            var a = this.dap_stackContainer.selectedChildWidget;
            return a === this.dap_outlineContainer ? "outline" : a === this.dap_fillContainer ? "fill" :
                "shape"
        },
        _updateTabs: function(a) {
            this._toggleTabs(a);
            this._showRelevantTabs(a);
            this._selectActiveTab();
            g.ensureEnabledChildSelection(this.dap_stackContainer)
        },
        _supportsPattern: function(a) {
            return e.isLine(a) || e.isPolygon(a)
        },
        _toggleTabs: function(a) {
            this._shouldShowShapeTab(a) ? this._enableTab("shape") : this._disableTab("shape");
            this._shouldShowFillTab(a) ? this._enableTab("fill") : this._disableTab("fill");
            this._shouldShowOutlineTab(a) ? (this._enableTab("outline"), this._supportsPattern(a) ? (f.show(this.dap_linePatternSelectLabel),
                f.show(this._linePatternSelect.domNode)) : (f.hide(this.dap_linePatternSelectLabel), f.hide(this._linePatternSelect.domNode))) : this._disableTab("outline")
        },
        _shouldShowShapeTab: function(a) {
            return "simplemarkersymbol" === a.type || "picturemarkersymbol" === a.type
        },
        _enableTab: function(a) {
            g.enable(this._getTabContainer(a))
        },
        _disableTab: function(a) {
            g.disable(this._getTabContainer(a))
        },
        _shouldShowFillTab: function(a) {
            return "simplemarkersymbol" === a.type && a.style === k.SimpleMarkerSymbol.STYLE_CIRCLE || "simplemarkersymbol" ===
                a.type && a.style === k.SimpleMarkerSymbol.STYLE_SQUARE || "simplemarkersymbol" === a.type && a.style === k.SimpleMarkerSymbol.STYLE_DIAMOND || "simplefillsymbol" === a.type
        },
        _shouldShowOutlineTab: function(a) {
            return "simplemarkersymbol" === a.type || "simplefillsymbol" === a.type || "cartographiclinesymbol" === a.type || "simplelinesymbol" === a.type
        },
        _syncControls: function(a) {
            var b;
            this._hideImageUrlInput();
            this._updateSizingConstraints();
            this._shouldShowShapeTab(a) && (b = e.getMarkerLength(a), this.set("shapeSize", b), g.silentlyUpdateIntermediateChangingValueWidget(this.dap_shapeSizeSlider,
                b), g.silentlyUpdateIntermediateChangingValueWidget(this.dap_shapeSizeTextBox, b));
            this._shouldShowFillTab(a) && (this.set("fillColor", a.color), this.dap_fillColorPicker.set("color", a.color, !1));
            this._shouldShowOutlineTab(a) && (a = e.getOutline(a), this.set("outlineColor", a.color), this.set("outlineWidth", a.width), this.set("outlinePattern", a.style), this.dap_outlineColorPicker.set("color", a.color, !1), g.silentlyUpdateIntermediateChangingValueWidget(this.dap_lineWidthSlider, a.width), g.silentlyUpdateIntermediateChangingValueWidget(this.dap_lineWidthTextBox,
                a.width), this._linePatternSelect.set("value", a.style, !1))
        },
        _updateSizingConstraints: function() {
            var a = e.getOutline(this._editedSymbol),
                a = a && a.width > this._defaultMaxLineWidthInPx ? Math.ceil(a.width) : this._defaultMaxLineWidthInPx,
                b = e.getMarkerLength(this._editedSymbol),
                b = b > this._defaultMaxShapeSizeInPx ? Math.ceil(b) : this._defaultMaxShapeSizeInPx;
            this._updateSliderAndTextBoxConstraints({
                textBox: this.dap_lineWidthTextBox,
                slider: this.dap_lineWidthSlider,
                minimum: this._defaultMinLineWidthInPx,
                maximum: a
            });
            this.findTooltip(this.dap_lineWidthOptions).set("label",
                r.substitute(this.labels.lineWidthTooltip, {
                    min: this._defaultMinLineWidthInPx,
                    max: a
                }));
            this._updateSliderAndTextBoxConstraints({
                textBox: this.dap_shapeSizeTextBox,
                slider: this.dap_shapeSizeSlider,
                minimum: this._defaultMinShapeSizeInPx,
                maximum: b
            });
            this.findTooltip(this.dap_symbolSizeOptions).set("label", r.substitute(this.labels.symbolSizeTooltip, {
                min: this._defaultMinShapeSizeInPx,
                max: b
            }))
        },
        _assimilateSymbol: function(a) {
            this._updateTabs(a);
            this._syncControls(a)
        },
        startup: function() {
            this.inherited(arguments);
            var a = new x(this._symbolPickerOpts, this.dap_symbolPicker);
            a.startup();
            this._symbolPicker = a;
            this._addHandlers()
        },
        _hideImageUrlInput: function() {
            this._clearUrlImageErrorDisplay();
            f.hide(this.dap_shapeImageUrlContainer);
            this.dap_shapeImageUrlInput.set("value", "")
        },
        _showRelevantTabs: function() {
            var a = this.dap_stackContainer,
                b = this.dap_shapeContainer,
                d = this.dap_fillContainer,
                c = this.dap_outlineContainer;
            A.forEach(a.getChildren(), function(b) {
                a.removeChild(b)
            });
            this._isPoint() && (a.addChild(b), a.addChild(d),
                a.addChild(c));
            this._isLine() && a.addChild(c);
            this._isPolygon() && (a.addChild(d), a.addChild(c));
            1 === a.getChildren().length ? f.hide(this.dap_stackController.domNode) : f.show(this.dap_stackController.domNode)
        },
        _selectActiveTab: function() {
            var a = this._getTabContainer(this._activeTabName); - 1 < this.dap_stackContainer.getIndexOfChild(a) && this.dap_stackContainer.selectChild(a)
        },
        _onFillColorChange: function(a) {
            this.set("fillColor", a.color)
        },
        _onOutlineColorChange: function(a) {
            this.set("outlineColor", a.color)
        },
        _getFillColor: function() {
            return !this._isLine() &&
                this._hasColorRamp() ? this._getMiddleItem(this.fillColorRamp) : this.fillColor
        },
        _getMiddleItem: function(a) {
            return a[Math.floor(0.5 * (a.length - 1))]
        },
        _getOutlineColor: function() {
            return this._isLine() && this._hasColorRamp() ? this._getMiddleItem(this.outlineColorRamp) : this.outlineColor
        },
        _commitProperties: function() {
            var a = this._editedSymbol;
            this._shouldShowShapeTab(a) && this._updateShapeSize();
            this._shouldShowFillTab(a) && e.setFillColor(a, this._getFillColor());
            this._shouldShowOutlineTab(a) && (e.setOutlineColor(a,
                this._getOutlineColor()), this._updateOutlinePattern(), this._updateOutlineWidth());
            this._updatePreviewSymbol();
            this.emit("style-update")
        },
        _updatePreviewSymbol: function() {
            var a = this._editedSymbol,
                b = this.css.alt,
                c = this.dap_symbolPreview;
            this._symbolPreviewSurface && this._symbolPreviewSurface.destroy();
            h.toggle(c, b, this._blendsIntoBackground(a));
            this._symbolPreviewSurface = e.renderOnSurface(a, c)
        },
        _blendsIntoBackground: function(a) {
            return e.hasColor(a.outline) ? this._isWhitish(a.outline.color) : this._isWhitish(a.color)
        },
        _isWhitish: function(a) {
            return a && 246 < a.r && 246 < a.g && 246 < a.b
        },
        destroy: function() {
            this.inherited(arguments);
            this._symbolPreviewSurface && this._symbolPreviewSurface.destroy()
        },
        _updateSuggestedColors: function(a, b) {
            a.set("suggestedColors", b)
        },
        _updateOutlineWidth: function() {
            e.setOutlineWidth(this._editedSymbol, this.outlineWidth)
        },
        _onWidthChange: function(a) {
            this.set("outlineWidth", a)
        },
        _onSizeChange: function(a) {
            this.set("shapeSize", a)
        },
        _updateShapeSize: function() {
            e.setSize(this._editedSymbol, this.shapeSize)
        },
        _updateOutlinePattern: function() {
            this._shouldShowOutlineTab(this._editedSymbol) && e.setOutlineStyle(this._editedSymbol, e.toFullLineStyle(this.outlinePattern))
        },
        _show: function(a) {
            h.remove(a, this.css.hidden)
        },
        _hide: function(a) {
            h.add(a, this.css.hidden)
        },
        popUp: function(a) {
            g.popUp(this, a)
        }
    })
});