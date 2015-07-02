//>>built
define(["../../kernel", "../_EventedWidget", "../_Tooltip", "./_DelayedUpdate", "./colorRampUtil", "./schemeUtil", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/a11yclick", "dojo/_base/array", "dojo/_base/declare", "dojo/_base/lang", "dojo/dom-class", "dojo/dom-construct", "dojo/dom-style", "dojo/has", "dojo/on", "dojo/query", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/ColorRampPicker.html", "dojo/NodeList-dom", "dijit/form/Button"], function(z, q, r, s, f, d, t, u, l, c, m, g, v, n, h, A, k, p, w, x) {
    return m("esri.dijit.SymbolStyler.ColorRampPicker", [q, t, u, s, r], {
        baseClass: "esriColorRampPicker",
        templateString: x,
        labels: w.symbolEditor,
        schemes: null,
        selected: null,
        numStops: 0,
        _schemesChanged: !1,
        _selectedChanged: !1,
        _numStopsChanged: !1,
        _orientationChanged: !1,
        _commitPropsTrigger: null,
        _colorRampSurfaces: null,
        _previewRampSurface: null,
        _rampsAndSchemes: null,
        constructor: function(a) {
            m.safeMixin(this, a);
            g.extend(this.constructor, {
                css: {
                    item: "esriItem",
                    selected: "esriSelected",
                    container: "esriContainer",
                    list: "esriList",
                    preview: "esriPreview",
                    flipper: "esriFlipper",
                    viewport: "esriViewport"
                }
            });
            this._colorRampSurfaces = [];
            this._commitPropsTrigger = this.createUpdateTrigger(this._commitProperties, this)
        },
        _commitProperties: function() {
            var a, b;
            if (this._schemesChanged || this._numStopsChanged) this._numStopsChanged = this._schemesChanged = !1, a = d.getColorRampsWithSchemes(this.schemes, this.numStops), b = this._hasStops(), this._rampsAndSchemes = a, n.empty(this.dap_colorRampPicker), this._colorRampSurfaces = [], c.forEach(a, function(a) {
                    this._createColorRampItem({
                        colors: a.colors,
                        hasStops: b
                    })
                },
                this), this._renderSuggestions();
            this._selectedChanged && (this._selectedChanged = !1, this._renderSelected());
            this._orientationChanged && (this._orientationChanged = !1, this._renderSelected(), this._renderSuggestions());
            this.selected || this.set("selected", this._rampsAndSchemes[0])
        },
        _hasStops: function() {
            return 0 < this.numStops
        },
        _createColorRampItem: function(a) {
            var b = a.colors;
            a = a.numClasses;
            var e = n.create("div", {
                    className: this.css.item,
                    tabIndex: 0
                }, this.dap_colorRampPicker),
                y = h.get(e, "height"),
                c = h.get(e, "width"),
                b = f.createColorRamp({
                    node: e,
                    width: c,
                    height: y,
                    colors: b,
                    numClasses: a
                });
            this._colorRampSurfaces.push(b)
        },
        _renderSuggestions: function() {
            var a = this._colorRampSurfaces,
                b = this._rampsAndSchemes,
                e = this._hasStops();
            c.forEach(a, function(a, c) {
                f.updateColorRamp({
                    ramp: a,
                    colors: b[c].colors,
                    hasStops: e
                })
            })
        },
        _renderSelected: function() {
            var a = this.selected.colors,
                b = this.dap_previewRamp,
                e = h.get(b, "height"),
                c = h.get(b, "width"),
                d = this._hasStops();
            this._previewRampSurface ? f.updateColorRamp({
                ramp: this._previewRampSurface,
                colors: a,
                hasStops: d
            }) : this._previewRampSurface = f.createColorRamp({
                node: b,
                height: e,
                width: c,
                colors: a,
                hasStops: d
            })
        },
        getStyle: function() {
            return this.get("selected")
        },
        _setSchemesAttr: function(a) {
            this._schemesChanged = !0;
            this._set("schemes", d.cloneScheme(a));
            this._commitPropsTrigger()
        },
        _getSelectedAttr: function() {
            var a = this.selected,
                b = {
                    colors: d._createColors(a.colors)
                };
            a.scheme && (b.scheme = d.cloneScheme(a.scheme));
            return b
        },
        _setSelectedAttr: function(a) {
            g.isArray(a) && (a = {
                colors: a
            });
            this._selectedChanged = !0;
            this._set("selected", a);
            this._commitPropsTrigger();
            this.emit("color-ramp-change", this.get("selected"))
        },
        _getSuggestions: function() {
            return c.map(this._rampsAndSchemes, function(a) {
                return a.colors
            })
        },
        _setNumStopsAttr: function(a) {
            this._numStopsChanged = !0;
            this._set("numStops", 0 < a ? a : 0);
            this._commitPropsTrigger()
        },
        postCreate: function() {
            this.inherited(arguments);
            this._addHandlers();
            this.createTooltips([{
                node: this.dap_colorFlipper,
                label: this.labels.flipColorsTooltip
            }, {
                node: this.dap_colorRampPicker,
                label: this.labels.selectRampTooltip
            }])
        },
        _addHandlers: function() {
            this.own(k(this.dap_colorRampPicker, k.selector("." + this.css.item, l), g.partial(this._rampClickHandler, this)));
            this.own(k(this.dap_colorFlipper, l, g.hitch(this, function() {
                this.flipColors()
            })))
        },
        _rampClickHandler: function(a) {
            var b = a.css.selected,
                c = "." + a.css.item,
                d = p("." + a.css.item, a.dap_colorRampPicker).indexOf(this);
            p(c, a.dap_colorRampPicker).removeClass(b);
            v.add(this, b);
            a.set("selected", a._rampsAndSchemes[d])
        },
        flipColors: function() {
            var a = this._rampsAndSchemes,
                b = this.selected; - 1 === c.indexOf(this._getSuggestions(), b.colors) && b.colors.reverse();
            c.forEach(a, function(a) {
                d.flipColors(a.scheme)
            });
            this._orientationChanged = !0;
            this.set("selected", b);
            this._commitPropsTrigger()
        },
        destroy: function() {
            this.inherited(arguments);
            c.forEach(this._colorRampSurfaces, function(a) {
                a.destroy()
            });
            this._previewRampSurface && this._previewRampSurface.destroy()
        }
    })
});