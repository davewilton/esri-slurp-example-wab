//>>built
define(["../../domUtils", "../../kernel", "../_EventedWidget", "../_Tooltip", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dojo/_base/declare", "dojo/_base/array", "dojo/_base/lang", "dojo/dom-construct", "dojo/dom-prop", "dojo/has", "dojo/keys", "dojo/number", "dojo/on", "dojo/query", "dojo/string", "dojox/html/entities", "dojox/lang/functional/object", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/ScaleMenu.html", "dijit/form/TextBox"], function(d, A, m, n, p, q, r, s, b, f, g, B, t, e, k, u, h, v, w, x, y) {
    return r([m, p, q, n], {
        declaredClass: "esri.dijit.VisibleScaleRangeSlider.ScaleMenu",
        templateString: y,
        baseClass: "esriScaleMenu",
        labels: x.visibleScaleRangeSlider,
        _recommendedScales: {
            world: 1E8,
            continent: 5E7,
            countriesBig: 25E6,
            countriesSmall: 12E6,
            statesProvinces: 6E6,
            stateProvince: 3E6,
            counties: 15E5,
            county: 75E4,
            metropolitanArea: 32E4,
            cities: 16E4,
            city: 8E4,
            town: 4E4,
            neighborhood: 2E4,
            streets: 1E4,
            street: 5E3,
            buildings: 2500,
            building: 1250
        },
        _elementValueMap: null,
        _elements: null,
        _scaleRangeCategories: null,
        _scaleRanges: null,
        _originalScaleInputValue: null,
        constructor: function() {
            b.extend(this.constructor, {
                css: {
                    header: "esriHeader",
                    section: "esriSection",
                    content: "esriContent",
                    current: "esriCurrent",
                    input: "esriInput",
                    list: "esriList",
                    item: "esriItem",
                    inline: "esriInline",
                    selectable: "esriSelectable"
                }
            })
        },
        buildRendering: function() {
            this.inherited(arguments);
            var a = this.labels,
                c = a.featuredScaleLabels,
                l = this._recommendedScales,
                z = this.css.item + " " + this.css.selectable,
                b;
            s.forEach(w.keys(l), function(a) {
                    b = c[a];
                    a = h.substitute(b, {
                        scaleLabel: this._formatScale(l[a])
                    });
                    f.create("li", {
                        innerHTML: a,
                        className: z
                    }, this.dap_recommendedScales)
                },
                this);
            var d = f.create("span", {
                    innerHTML: a.setTo,
                    className: this.css.inline
                }),
                e = f.create("span", {
                    innerHTML: a.selectOne,
                    className: this.css.inline
                });
            g.set(this.dap_scaleListHeader, "innerHTML", h.substitute(a.setToSelectOne, {
                setTo: d.outerHTML,
                selectOne: e.outerHTML
            }))
        },
        _formatScale: function(a) {
            return "1:" + e.format(a)
        },
        postCreate: function() {
            this.inherited(arguments);
            this.own(k(this.domNode, k.selector("." + this.css.item + "." + this.css.selectable, "click"), b.hitch(this, function(a) {
                this._emitScaleSelected(this._parseScale(a.target.innerHTML))
            })));
            this.dap_scaleInput.on("keyDown", b.hitch(this, function(a) {
                a.keyCode === t.ENTER && this._handleCustomScaleInput()
            }));
            this.createTooltip(this.dap_scaleInput, this.labels.customScaleInputTooltip)
        },
        _emitScaleSelected: function(a) {
            this.emit("scale-selected", {
                scale: a
            })
        },
        _handleCustomScaleInput: function() {
            var a = this._parseScale(this.dap_scaleInput.get("value"));
            isNaN(a) || this._emitScaleSelected(a)
        },
        _parseScale: function(a) {
            a = v.decode(a).replace(/.*\(/, "").replace(/\).*$/, "").replace(/.*1:/, "").replace(/[^0-9.\s]/g,
                "");
            return e.parse(a)
        },
        _setCurrentScaleAttr: function(a) {
            var c = this._formatScale(a.scale);
            g.set(this.dap_currentScaleLabel, "innerHTML", a.label);
            this.dap_scaleInput.set("value", c, !1);
            this._originalScaleInputValue = c;
            c = h.substitute(this.labels.featuredScaleLabels.current, {
                scaleLabel: this._formatScale(a.mapScale)
            });
            g.set(this.dap_currentScaleItem, "innerHTML", c);
            this._scaleRanges = a.ranges;
            this._hideOutOfScaleRanges()
        },
        _hideOutOfScaleRanges: function() {
            var a = u("." + this.css.item + "." + this.css.selectable, this.dap_recommendedScales),
                c = this._scaleRanges,
                b;
            a.forEach(function(a) {
                a !== this.dap_currentScaleItem && (b = this._parseScale(a.innerHTML), c.contains(b) ? d.show(a) : d.hide(a))
            }, this)
        }
    })
});