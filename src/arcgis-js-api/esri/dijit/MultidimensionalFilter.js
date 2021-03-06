//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/connect", "dojo/i18n!../nls/jsapi", "dojo/text!./templates/MultidimensionalFilter.html", "dojo/text!./templates/NumericDimensionItem.html", "dojo/text!./templates/TimeDimensionItem.html", "dojo/text!./templates/PagedDateTimeWidget.html", "dojo/text!./templates/PagedNumberWidget.html", "dojo/store/Memory", "dojo/has", "../kernel", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/form/DateTextBox", "dijit/registry", "dojo/date/locale", "dojo/dom-style", "dojo/query", "../layers/DimensionalDefinition", "../layers/MosaicRule", "dojo/html", "dojo/dom", "dijit/form/FilteringSelect", "dijit/form/ComboBox", "dojox/widget/YearlyCalendar", "dojox/widget/MonthlyCalendar", "dojox/widget/Calendar3Pane", "dojo/_base/array", "dijit/Tooltip", "dijit/form/CheckBox", "dijit/form/Button"], function(p, q, w, s, E, F, G, H, I, r, Q, R, t, u, v, J, d, n, c, K, L, z, g, x, M, N, A, B, y, m) {
    var C = p("PagedDateTimeWidget", [t, u, v], {
            pageCount: 100,
            dimension: "",
            start: "",
            _currentIndex: "",
            displayDate: "",
            store: "",
            prefix: "",
            values: "",
            dateValue: "",
            changeTimeVal: "",
            intervalInfo: {},
            templateString: H,
            constructor: function(a) {
                p.safeMixin(this, a);
                this._i18n = s
            },
            _setValuesAttr: function() {
                this._currentIndex = this.displayDate ? m.indexOf(this.values, this.displayDate) : 0;
                this._checkButtons();
                this._populateValues()
            },
            _setDateValueAttr: function(a) {
                a &&
                    (this._currentIndex = m.indexOf(this.values, a), -1 != this._currentIndex ? this.dateValue = a : (this.dateValue = this._snapToClosest(a), this._currentIndex = m.indexOf(this.values, this.dateValue)))
            },
            _checkButtons: function() {
                1 == this.values.length ? this._setButtonProperties(!0, "default", !0, "default", !0, "default", !0, "default") : 0 == this._currentIndex ? this._setButtonProperties(!0, "default", !0, "default", !1, "pointer", !1, "pointer") : this._currentIndex == this.values.length - 1 ? this._setButtonProperties(!1, "pointer", !1, "pointer", !0, "default", !0, "default") : this._setButtonProperties(!1, "pointer", !1, "pointer", !1, "pointer", !1, "pointer")
            },
            _setButtonProperties: function(a, b, e, l, f, d, h, k) {
                this.StartBtn.set("disabled", a);
                c.set(this.StartBtn.iconNode, "cursor", b);
                this.PreviousBtn.set("disabled", e);
                c.set(this.PreviousBtn.iconNode, "cursor", l);
                this.NextBtn.set("disabled", f);
                c.set(this.NextBtn.iconNode, "cursor", d);
                this.EndBtn.set("disabled", h);
                c.set(this.EndBtn.iconNode, "cursor", k)
            },
            _getTimeArray: function() {
                var a = [],
                    b, e, l, f;
                l = parseInt((new Date(this.values[this._currentIndex])).getTime(),
                    10);
                f = parseInt((new Date(this.values[this._currentIndex])).getTime() + 864E5, 10);
                for (b = 0; b < this.values.length; b++)
                    if (this.values[b] >= l && this.values[b] < f) e = n.format(this._getUTCTime(new Date(this.values[b])), {
                        timePattern: "hh:mm a",
                        selector: "time"
                    }), a.push({
                        id: this.values[b],
                        label: e
                    });
                    else if (0 != a.length) break;
                return a
            },
            _updateTimeDropDown: function() {
                var a = [],
                    a = this._getTimeArray();
                this.timeSelect.reset();
                a = new r({
                    data: a,
                    idProperty: "id"
                });
                this.timeSelect.set({
                    store: a,
                    value: this.values[this._currentIndex]
                })
            },
            _populateValues: function() {
                var a = [],
                    b, e, l;
                l = n.format(this._getUTCTime(new Date(this.values[this._currentIndex])), {
                    datePattern: "yyyy-MM-dd",
                    selector: "date"
                });
                a = this._getTimeArray();
                b = n.format(this._getUTCTime(new Date(this.values[0])), {
                    datePattern: "yyyy-MM-dd",
                    selector: "date"
                });
                e = n.format(this._getUTCTime(new Date(this.values[this.values.length - 1])), {
                    datePattern: "yyyy-MM-dd",
                    selector: "date"
                });
                this.dateSelect = new J({
                    value: l,
                    id: this.prefix + this.dimension + "Date",
                    constraints: {
                        min: b,
                        max: e
                    },
                    popupClass: y,
                    style: "width:95px;",
                    "class": "dijitSelect esriMultidimensionalFilterVariableList"
                }, this.DateSelector);
                this.dateSelect.startup();
                this.dateSelect.on("change", q.hitch(this, this._dateBoxChange));
                a = new r({
                    data: a,
                    idProperty: "id"
                });
                this.timeSelect = new M({
                    store: a,
                    id: this.prefix + this.dimension + "Time",
                    value: this.displayDate,
                    labelAttr: "label",
                    labelType: "text",
                    searchAttr: "label",
                    style: "width:85px;",
                    "class": "dijitSelect esriMultidimensionalFilterVariableList",
                    maxHeight: -1
                }, this.TimeSelector);
                this.timeSelect.startup();
                this.timeSelect.on("change", q.hitch(this, this._timeValueChange));
                this._checkCalendarControlView()
            },
            _checkCalendarControlView: function() {
                var a = [],
                    b = [],
                    e = [],
                    l, f, d, h, k;
                if (this.intervalInfo.intervalUnit) "years" == this.intervalInfo.intervalUnit.toLowerCase() ? (this.dateSelect.set("popupClass", A), c.set(this.timeSelect.domNode, "display", "none")) : "months" == this.intervalInfo.intervalUnit.toLowerCase() ? (this.dateSelect.set("popupClass", B), c.set(this.timeSelect.domNode, "display", "none")) : "days" == this.intervalInfo.intervalUnit.toLowerCase() ?
                    (this.dateSelect.set("popupClass", y), c.set(this.timeSelect.domNode, "display", "none")) : this.dateSelect.set("popupClass", y);
                else {
                    k = 12 > this.values.length ? this.values.length : 12;
                    for (h = 0; h < k; h++) l = n.format(this._getUTCTime(new Date(this.values[h])), {
                            datePattern: "yyyy",
                            selector: "date"
                        }), f = n.format(this._getUTCTime(new Date(this.values[h])), {
                            datePattern: "yyyyMM",
                            selector: "date"
                        }), d = n.format(this._getUTCTime(new Date(this.values[h])), {
                            timePattern: "HH:mm",
                            selector: "time"
                        }), -1 == m.indexOf(b, l) && b.push(l), -1 ==
                        m.indexOf(e, f) && e.push(f), -1 == m.indexOf(a, d) && a.push(d);
                    b.length == k ? (this.dateSelect.set("popupClass", A), c.set(this.timeSelect.domNode, "display", "none")) : e.length == k ? (this.dateSelect.set("popupClass", B), c.set(this.timeSelect.domNode, "display", "none")) : (this.dateSelect.set("popupClass", y), 1 == a.length && c.set(this.timeSelect.domNode, "display", "none"))
                }
            },
            _timeValueChange: function(a) {
                a && (this._currentIndex = m.indexOf(this.values, a), this._checkButtons())
            },
            _updateValues: function() {
                var a;
                a = n.format(this._getUTCTime(new Date(this.values[this._currentIndex])), {
                    datePattern: "yyyy-MM-dd",
                    selector: "date"
                });
                this.dateSelect.set("_onChangeActive", !1);
                this.dateSelect.set("value", a, !1);
                this.dateSelect.set("_onChangeActive", !0);
                this._updateTimeDropDown();
                this._checkButtons()
            },
            _getUTCTime: function(a) {
                a && a.setTime(a.getTime() + 6E4 * a.getTimezoneOffset());
                return a
            },
            _onStartBtnClick: function() {
                this._currentIndex = 0;
                this._updateValues()
            },
            _onPreviousBtnClick: function() {
                this._currentIndex--;
                this._updateValues()
            },
            _onNextBtnClick: function() {
                this._currentIndex++;
                this._updateValues()
            },
            _onEndBtnClick: function() {
                this._currentIndex = this.values.length - 1;
                this._updateValues()
            },
            _snapToClosest: function(a) {
                var b, e, l, f;
                b = Math.abs(a - this.values[0]);
                l = this.values[0];
                for (f = 1; f < this.values.length; f++) e = Math.abs(a - this.values[f]), e < b && (b = e, l = this.values[f], this._currentIndex = f);
                return l
            },
            _dateBoxChange: function(a) {
                var b = [];
                a && (b = 0 < (new Date(a)).getTime() ? (new Date(a)).getTime() : (new Date(a)).getTime() + 86399999, a = this._snapToClosest(parseInt(b, 10)), this.dateSelect.set("_onChangeActive", !1), this.dateSelect.set("value",
                        n.format(this._getUTCTime(new Date(a)), {
                            datePattern: "yyyy-MM-dd",
                            selector: "date"
                        })), this.dateSelect.set("_onChangeActive", !0), n.format(this._getUTCTime(new Date(a)), {
                        datePattern: "yyyy-MM-dd",
                        selector: "date"
                    }) != n.format(new Date(b), {
                        datePattern: "yyyy-MM-dd",
                        selector: "date"
                    }) && (this.dateSelect.focus(), this.dateSelect.set("message", this._i18n.widgets.multidimensionalFilter.dateSnapText)), b = this._getTimeArray(), this.timeSelect.reset(), a = new r({
                        data: b,
                        idProperty: "id"
                    }), this.timeSelect.set({
                        store: a,
                        value: b[0].id
                    }),
                    this._checkButtons())
            }
        }),
        D = p("PagedNumberWidget", [t, u, v], {
            pageCount: 100,
            dimension: "",
            start: "",
            displayNum: "",
            store: "",
            prefix: "",
            values: "",
            numValue: "",
            intervalInfo: {},
            templateString: I,
            constructor: function(a) {
                p.safeMixin(this, a);
                this._i18n = s
            },
            _setValuesAttr: function() {
                this._currentIndex = this.displayNum || 0 == this.displayNum ? m.indexOf(this.values, this.displayNum) : 0;
                this._checkButtons();
                this._populateValues()
            },
            _setNumValueAttr: function(a) {
                if (a || 0 == a) this._currentIndex = m.indexOf(this.values, a), -1 != this._currentIndex ?
                    this.numValue = a : (this.numValue = this._snapToClosest(a), this._currentIndex = m.indexOf(this.values, this.numValue)), this._updateValues()
            },
            _checkButtons: function() {
                1 == this.values.length ? this._setButtonProperties(!0, "default", !0, "default", !0, "default", !0, "default") : 0 == this._currentIndex ? this._setButtonProperties(!0, "default", !0, "default", !1, "pointer", !1, "pointer") : this._currentIndex == this.values.length - 1 ? this._setButtonProperties(!1, "pointer", !1, "pointer", !0, "default", !0, "default") : this._setButtonProperties(!1,
                    "pointer", !1, "pointer", !1, "pointer", !1, "pointer")
            },
            _setButtonProperties: function(a, b, e, l, f, d, h, k) {
                this.StartBtn.set("disabled", a);
                c.set(this.StartBtn.iconNode, "cursor", b);
                this.PreviousBtn.set("disabled", e);
                c.set(this.PreviousBtn.iconNode, "cursor", l);
                this.NextBtn.set("disabled", f);
                c.set(this.NextBtn.iconNode, "cursor", d);
                this.EndBtn.set("disabled", h);
                c.set(this.EndBtn.iconNode, "cursor", k)
            },
            _populateValues: function() {
                var a = [],
                    b;
                for (b in this.values) this.values.hasOwnProperty(b) && a.push({
                    id: this.values[b],
                    label: this.values[b]
                });
                a = new r({
                    data: a,
                    idProperty: "id"
                });
                this.numSelect = new N({
                    store: a,
                    id: this.prefix + this.dimension + "Value",
                    value: this.displayNum,
                    labelAttr: "label",
                    labelType: "text",
                    searchAttr: "label",
                    pageSize: this.pageCount,
                    scrollOnFocus: !0,
                    style: "width:95px;",
                    "class": "dijitSelect esriMultidimensionalFilterVariableList",
                    maxHeight: -1
                }, this.NumberSelector);
                this.numSelect.startup();
                this.numSelect.on("change", q.hitch(this, this._numValueChange))
            },
            _snapToClosest: function(a) {
                var b, e, l, f;
                b = Math.abs(a - this.values[0]);
                l = this.values[0];
                for (f = 1; f < this.values.length; f++) e = Math.abs(a - this.values[f]), e < b && (b = e, l = this.values[f], this._currentIndex = f);
                return l
            },
            _numValueChange: function(a) {
                var b;
                a && (b = this._snapToClosest(a), this.numSelect.set("_onChangeActive", !1), this.numSelect.set("value", b), this.numSelect.set("_onChangeActive", !0), a != b && (this.numSelect.focus(), this.numSelect.set("message", this._i18n.widgets.multidimensionalFilter.numSnapText)), this._currentIndex = m.indexOf(this.values, b), this._checkButtons())
            },
            _updateValues: function() {
                this.numSelect.set("value",
                    this.values[this._currentIndex]);
                this._checkButtons()
            },
            _onStartBtnClick: function() {
                this._currentIndex = 0;
                this._updateValues()
            },
            _onPreviousBtnClick: function() {
                this._currentIndex--;
                this._updateValues()
            },
            _onNextBtnClick: function() {
                this._currentIndex++;
                this._updateValues()
            },
            _onEndBtnClick: function() {
                this._currentIndex = this.values.length - 1;
                this._updateValues()
            }
        }),
        O = p("DateItem", [t, u, v], {
            dimension: "",
            fromText: "",
            toText: "",
            fromDateValue: "",
            toDateValue: "",
            valueCount: "",
            values: [],
            dimensionAlias: "",
            unit: "",
            dateStore: {},
            disabled: !1,
            intervalInfo: {},
            templateString: G,
            constructor: function(a) {
                p.safeMixin(this, a);
                this._i18n = s;
                this.fromText = this._i18n.widgets.multidimensionalFilter.fromTimeText;
                this.toText = this._i18n.widgets.multidimensionalFilter.toTimeText
            },
            _onRangeCheckboxChange: function(a) {
                a ? (c.set(this[this.dimension + "MaxRow"], "display", "table-row"), g.set(x.byId("min" + this.dimension + "DateText"), this._i18n.widgets.multidimensionalFilter.fromTimeText)) : (c.set(this[this.dimension + "MaxRow"], "display", "none"),
                    g.set(x.byId("min" + this.dimension + "DateText"), this._i18n.widgets.multidimensionalFilter.sliceTimeText))
            },
            _onDimensionCheckboxChange: function(a) {
                a ? (d.byId(this.dimension + "RangeCheckbox").get("checked") ? c.set(this[this.dimension + "MaxRow"], "display", "table-row") : c.set(this[this.dimension + "MaxRow"], "display", "none"), c.set(this[this.dimension + "MinRow"], "display", "table-row"), c.set(this[this.dimension + "RangeSpan"], "display", "inline")) : (c.set(this[this.dimension + "MaxRow"], "display", "none"), c.set(this[this.dimension +
                    "MinRow"], "display", "none"), c.set(this[this.dimension + "RangeSpan"], "display", "none"))
            },
            _setUnitAttr: function(a) {
                a && (-1 < a.indexOf("ISO8601") && (this.unit = a.replace("ISO8601", "UTC")), g.set(this.dimensionUnit, "(" + this.unit + ")"), g.set(this.tooltipUnit, "\x3cbr/\x3e   \x3cspan class\x3d'tooltipLeftText'\x3eUnit:\x3c/span\x3e " + this.unit))
            },
            _setDisabledAttr: function(a) {
                this.hasRanges || (a ? (d.byId(this.dimension).set("checked", !1), d.byId(this.dimension).set("disabled", !0), c.set(this.dimensionAlias, "color",
                    "#969696"), c.set(this.dimensionUnit, "color", "#969696"), g.set(this.disabledDimText, "\x3cbr/\x3e" + this._i18n.widgets.multidimensionalFilter.disabledTimeDimensionText)) : (d.byId(this.dimension).set("checked", !0), d.byId(this.dimension).set("disabled", !1), c.set(this.dimensionAlias, "color", "#000000"), c.set(this.dimensionUnit, "color", "#000000"), g.set(this.disabledDimText, "")))
            },
            _updateTooltip: function() {
                this.fromValue = n.format(this._getUTCTime(new Date(this.values[0])), {
                    datePattern: "MM/dd/yyyy",
                    timePattern: "hh:mm:ss a"
                });
                this.toValue = n.format(this._getUTCTime(new Date(this.values[this.values.length - 1])), {
                    datePattern: "MM/dd/yyyy",
                    timePattern: "hh:mm:ss a"
                });
                this.valueCount = this.values.length;
                g.set(this.tooltipFromValue, this.fromValue.toString());
                g.set(this.tooltipToValue, this.toValue.toString());
                g.set(this.tooltipValueCount, this.valueCount.toString())
            },
            _createNewValues: function() {
                var a = [],
                    b;
                for (b in this.values) - 1 == m.indexOf(a, this.values[b][0]) && a.push(this.values[b][0]), -1 == m.indexOf(a, this.values[b][1]) && a.push(this.values[b][1]);
                a.sort(function(a, b) {
                    return a - b
                });
                return a
            },
            _setValuesAttr: function(a) {
                this.hasRanges && (this.values = a = this._createNewValues());
                this._updateTooltip();
                (new C({
                    values: a,
                    id: "min" + this.dimension + "DateTimeBox",
                    dimension: this.dimension,
                    prefix: "min",
                    displayDate: a[0],
                    intervalInfo: this.intervalInfo
                }, this.minDateSelector)).startup();
                (new C({
                    values: a,
                    id: "max" + this.dimension + "DateTimeBox",
                    dimension: this.dimension,
                    prefix: "max",
                    displayDate: a[a.length - 1],
                    intervalInfo: this.intervalInfo
                }, this.maxDateSelector)).startup();
                this.hasRanges && (d.byId(this.dimension + "RangeCheckbox").set("checked", "true"), d.byId(this.dimension + "RangeCheckbox").set("disabled", "true"), this.disabled ? (d.byId(this.dimension).set("checked", !1), d.byId(this.dimension).set("disabled", !0), c.set(this.dimensionAlias, "color", "#969696"), c.set(this.dimensionUnit, "color", "#969696"), g.set(this.disabledDimText, "\x3cbr/\x3e" + this._i18n.widgets.multidimensionalFilter.disabledTimeDimensionText)) : (d.byId(this.dimension).set("checked", !0), d.byId(this.dimension).set("disabled", !1), c.set(this.dimensionAlias, "color", "#000000"), c.set(this.dimensionUnit, "color", "#000000"), g.set(this.disabledDimText, "")))
            },
            _getUTCTime: function(a) {
                a && a.setTime(a.getTime() + 6E4 * a.getTimezoneOffset());
                return a
            }
        }),
        P = p("NumericItem", [t, u, v], {
            dimension: "",
            fromText: "",
            toText: "",
            valueCount: "",
            values: [],
            dimensionAlias: "",
            unit: "",
            disabled: !1,
            intervalInfo: {},
            templateString: F,
            constructor: function(a) {
                p.safeMixin(this, a);
                this._i18n = s;
                this.fromText = this._i18n.widgets.multidimensionalFilter.fromNumericText;
                this.toText = this._i18n.widgets.multidimensionalFilter.toNumericText
            },
            _onRangeCheckboxChange: function(a) {
                a ? (c.set(this[this.dimension + "MaxRow"], "display", "table-row"), g.set(x.byId("min" + this.dimension + "ValueText"), this._i18n.widgets.multidimensionalFilter.fromNumericText)) : (c.set(this[this.dimension + "MaxRow"], "display", "none"), g.set(x.byId("min" + this.dimension + "ValueText"), this._i18n.widgets.multidimensionalFilter.sliceNumberText))
            },
            _onDimensionCheckboxChange: function(a) {
                a ? (d.byId(this.dimension + "RangeCheckbox").get("checked") ?
                    c.set(this[this.dimension + "MaxRow"], "display", "table-row") : c.set(this[this.dimension + "MaxRow"], "display", "none"), c.set(this[this.dimension + "MinRow"], "display", "table-row"), c.set(this[this.dimension + "RangeSpan"], "display", "inline")) : (c.set(this[this.dimension + "MaxRow"], "display", "none"), c.set(this[this.dimension + "MinRow"], "display", "none"), c.set(this[this.dimension + "RangeSpan"], "display", "none"))
            },
            _updateTooltip: function() {
                this.fromValue = this.values[0];
                this.toValue = this.values[this.values.length - 1];
                this.valueCount = this.values.length;
                g.set(this.tooltipFromValue, this.fromValue.toString());
                g.set(this.tooltipToValue, this.toValue.toString());
                g.set(this.tooltipValueCount, this.valueCount.toString())
            },
            _setDisabledAttr: function(a) {
                this.hasRanges || (a ? (d.byId(this.dimension).set("checked", !1), d.byId(this.dimension).set("disabled", !0), c.set(this.dimensionAlias, "color", "#969696"), c.set(this.dimensionUnit, "color", "#969696"), g.set(this.disabledDimText, "\x3cbr/\x3e" + this._i18n.widgets.multidimensionalFilter.disabledNumericDimensionText)) :
                    (d.byId(this.dimension).set("checked", !0), d.byId(this.dimension).set("disabled", !1), c.set(this.dimensionAlias, "color", "#000000"), c.set(this.dimensionUnit, "color", "#000000"), g.set(this.disabledDimText, "")))
            },
            _createNewValues: function() {
                var a = [],
                    b;
                for (b in this.values) - 1 == m.indexOf(a, this.values[b][0]) && a.push(this.values[b][0]), -1 == m.indexOf(a, this.values[b][1]) && a.push(this.values[b][1]);
                a.sort(function(a, b) {
                    return a - b
                });
                return a
            },
            _setValuesAttr: function(a) {
                this.hasRanges && (this.values = a = this._createNewValues());
                this._updateTooltip();
                (new D({
                    values: a,
                    id: "min" + this.dimension + "NumberBox",
                    dimension: this.dimension,
                    prefix: "min",
                    displayNum: a[0],
                    intervalInfo: this.intervalInfo
                }, this.minNumberSelector)).startup();
                (new D({
                    values: a,
                    id: "max" + this.dimension + "NumberBox",
                    dimension: this.dimension,
                    prefix: "max",
                    displayNum: a[a.length - 1],
                    intervalInfo: this.intervalInfo
                }, this.maxNumberSelector)).startup();
                this.hasRanges && (d.byId(this.dimension + "RangeCheckbox").set("checked", "true"), d.byId(this.dimension + "RangeCheckbox").set("disabled",
                    "true"), this.disabled ? (d.byId(this.dimension).set("checked", !1), d.byId(this.dimension).set("disabled", !0), c.set(this.dimensionAlias, "color", "#969696"), c.set(this.dimensionUnit, "color", "#969696"), g.set(this.disabledDimText, "\x3cbr/\x3e" + this._i18n.widgets.multidimensionalFilter.disabledNumericDimensionText)) : (d.byId(this.dimension).set("checked", !0), d.byId(this.dimension).set("disabled", !1), c.set(this.dimensionAlias, "color", "#000000"), c.set(this.dimensionUnit, "color", "#000000"), g.set(this.disabledDimText,
                    "")))
            },
            _setUnitAttr: function(a) {
                a && (-1 < a.indexOf("esri") && (this.unit = a.replace("esri", "")), g.set(this.dimensionUnit, "(" + this.unit + ")"), g.set(this.tooltipUnit, "\x3cbr/\x3e   \x3cspan class\x3d'tooltipLeftText'\x3eUnit:\x3c/span\x3e " + this.unit))
            }
        });
    return p([t, u, v], {
        declaredClass: "esri.dijit.MultidimensionalFilter",
        templateString: E,
        widgetsInTemplate: !0,
        layer: null,
        map: null,
        hideApplyButton: !1,
        _multidimensionalInfo: null,
        _variableStore: null,
        _variableData: [],
        _dimensionStore: null,
        _savedMultidimensionalDefinition: null,
        reset: 0,
        constructor: function(a) {
            p.safeMixin(this, a);
            this._i18n = s
        },
        startup: function() {
            this.inherited(arguments);
            w.subscribe("onMultidimensionalFilterApply", q.hitch(this, "_onClickApplyMultidimensionalFilter"));
            w.subscribe("onMultidimensionalFilterReset", q.hitch(this, "_onClickResetMultidimensionalFilter"))
        },
        postCreate: function() {
            w.connect(this.variableList, "onChange", q.hitch(this, "_onVariableListChange"));
            this.hideApplyButton && c.set(this.applyButton.domNode, "display", "none")
        },
        destroy: function() {
            this.inherited(arguments)
        },
        _setLayerAttr: function(a) {
            if (a) {
                this.inherited(arguments);
                this._dimensionStore = this._cachedDimensions = null;
                this.layer = a;
                var b = q.hitch(this, "_setupDefaults");
                this.layer.loaded ? this._setupDefaults() : w.connect(this.layer, "onLoad", b)
            }
        },
        _setupDefaults: function() {
            this.layer.getMultidimensionalInfo().then(q.hitch(this, function(a) {
                this._multidimensionalInfo = a;
                this._setupVariableFilterDefaults()
            }), function(a) {});
            this.layer.getDefaultMultidimensionalDefinition().then(q.hitch(this, function(a) {
                this.defaultMultidimensionalDefinition =
                    a
            }), function(a) {
                console.log(a)
            })
        },
        _computeDimensionUnion: function(a) {
            var b = [],
                e, d, f, c, h, k;
            if (a) {
                for (e in a)
                    if (a.hasOwnProperty(e))
                        for (d in c = a[e].dimensions, c)
                            if (c.hasOwnProperty(d)) {
                                h = c[d];
                                k = 0;
                                for (f in b) b.hasOwnProperty(f) && h.name == b[f].name && (k = 1);
                                k || b.push(h)
                            }
                return b
            }
        },
        _setupVariableFilterDefaults: function() {
            if (this.layer && this._multidimensionalInfo && this._multidimensionalInfo.variables) {
                var a = this._multidimensionalInfo.variables,
                    b, e;
                this._variableData = [];
                this._variableData.push({
                    name: this._i18n.widgets.multidimensionalFilter.defaultVariableText,
                    label: "\x3chtml\x3e\x3cbody\x3e\x3csection\x3e\x3ctable\x3e\x3ctr\x3e\x3ctd\x3e\x3cb\x3e" + this._i18n.widgets.multidimensionalFilter.defaultVariableText + "\x3c/b\x3e\x3c/td\x3e\x3c/tr\x3e\x3ctr\x3e\x3ctd\x3e\x3cp style\x3d'white-space:pre-wrap;width:50ex'\x3e\x3ci\x3eNo user-defined restriction on Variable.\x3c/i\x3e\x3c/p\x3e\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e\x3c/section\x3e\x3c/body\x3e\x3c/html",
                    dimensions: this._computeDimensionUnion(a)
                });
                for (b in a) a.hasOwnProperty(b) && (e = a[b].unit ? a[b].name +
                    " (" + a[b].unit + ")" : a[b].name, this._variableData.push({
                        name: a[b].name,
                        dimensions: a[b].dimensions,
                        description: a[b].description,
                        label: "\x3chtml\x3e\x3cbody\x3e\x3csection\x3e\x3ctable\x3e\x3ctr\x3e\x3ctd\x3e\x3cb\x3e" + e + "\x3c/b\x3e\x3c/td\x3e\x3c/tr\x3e\x3ctr\x3e\x3ctd\x3e\x3cp style\x3d'white-space:pre-wrap;width:50ex'\x3e\x3ci\x3e" + a[b].description + "\x3c/i\x3e\x3c/p\x3e\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e\x3c/section\x3e\x3c/body\x3e\x3c/html\x3e"
                    }));
                this._variableStore = new r({
                    data: this._variableData,
                    idProperty: "name"
                });
                this.variableList.reset();
                this.variableList.set({
                    store: this._variableStore,
                    labelAttr: "label",
                    labelType: "html",
                    value: this._variableData[0].name
                });
                this._savedMultidimensionalDefinition = null;
                this.layer.mosaicRule && (this.layer.mosaicRule.multidimensionalDefinition && 0 < this.layer.mosaicRule.multidimensionalDefinition.length) && (this._savedMultidimensionalDefinition = this.layer.mosaicRule.multidimensionalDefinition, this._setVariableValueDefault())
            }
        },
        _setVariableValueDefault: function() {
            if (this._savedMultidimensionalDefinition[0].variableName) {
                var a =
                    "" == this._savedMultidimensionalDefinition[0].variableName ? this._i18n.widgets.multidimensionalFilter.defaultVariableText : this._savedMultidimensionalDefinition[0].variableName;
                this.variableList && this.reset && 1 == this.reset ? a != this.variableList.get("value") ? this.variableList.set("value", a) : this._onVariableListChange() : this.variableList.set("value", a)
            }
        },
        _setCachedDimensionProperties: function() {
            var a, b;
            for (a in this._cachedDimensions) this._cachedDimensions.hasOwnProperty(a) && (b = a, d.byId(b) && (this._cachedDimensions[a].selected =
                d.byId(b).get("checked"), this._cachedDimensions[a].isSlice = !d.byId(b + "RangeCheckbox").get("checked"), -1 < b.toLowerCase().indexOf("time") ? this._cachedDimensions[a].values = [Number(d.byId("min" + b + "Time").get("value")), Number(d.byId("max" + b + "Time").get("value"))] : this._cachedDimensions[a].values = [Number(d.byId("min" + b + "Value").get("value")), Number(d.byId("max" + b + "Value").get("value"))]))
        },
        _onVariableListChange: function() {
            var a = this.variableList.get("value"),
                b = this._variableStore.query({
                    name: a
                })[0].dimensions,
                e;
            if (!this._cachedDimensions && this._dimensionStore)
                for (e in this._cachedDimensions = {}, this._variableData[0].dimensions) this._variableData[0].dimensions.hasOwnProperty(e) && (this._cachedDimensions[this._variableData[0].dimensions[e].field] = {});
            this._cachedDimensions && this._setCachedDimensionProperties();
            this._dimensionStore = null;
            this._dimensionStore = new r({
                data: b,
                idProperty: "name"
            });
            this._createDimensionWidgets();
            this._cachedDimensions ? this._displayCachedProperties() : this._savedMultidimensionalDefinition &&
                0 < this._savedMultidimensionalDefinition.length && (b = "" == this._savedMultidimensionalDefinition[0].variableName ? this._i18n.widgets.multidimensionalFilter.defaultVariableText : this._savedMultidimensionalDefinition[0].variableName, a == b && this._setDimensionDefaults())
        },
        _createDimensionWidgets: function() {
            var a, b, e, d;
            this._destroyDimensionWidgets();
            for (a in this._dimensionStore.data) this._dimensionStore.data.hasOwnProperty(a) && (b = this._dimensionStore.data[a].field, e = {
                    hasRegularIntervals: this._dimensionStore.data[a].hasRegularIntervals,
                    interval: this._dimensionStore.data[a].interval,
                    intervalUnit: this._dimensionStore.data[a].intervalUnit
                }, d = this._dimensionStore.data[a].hasRanges && !0 == this._dimensionStore.data[a].hasRanges ? !0 : !1, "StdTime" == b ? (e = new O({
                    dimension: this._dimensionStore.data[a].name,
                    hasRanges: d,
                    dimensionAlias: this._returnFieldAlias(this._dimensionStore.data[a].name),
                    unit: this._dimensionStore.data[a].unit,
                    disabled: this.layer.useMapTime,
                    intervalInfo: e,
                    values: this._dimensionStore.data[a].values
                }), e.placeAt(this.dimensionFilterGrid)) :
                "StdTime" != b && (b = this._isActiveDimension(this._dimensionStore.data[a].name), e = new P({
                    dimension: this._dimensionStore.data[a].name,
                    hasRanges: d,
                    dimensionAlias: this._returnFieldAlias(this._dimensionStore.data[a].name),
                    unit: this._dimensionStore.data[a].unit,
                    disabled: b,
                    intervalInfo: e,
                    values: this._dimensionStore.data[a].values
                }), e.placeAt(this.dimensionFilterGrid)))
        },
        _getUTCTime: function(a) {
            a && a.setTime(a.getTime() + 6E4 * a.getTimezoneOffset());
            return a
        },
        _destroyDimensionWidgets: function() {
            var a = d.findWidgets(this.dimensionFilterGrid),
                b;
            for (b in a) a.hasOwnProperty(b) && a[b].destroyRecursive()
        },
        _displayCachedProperties: function() {
            var a = this._cachedDimensions,
                b, e, d, f, c, h, k;
            for (b in this._dimensionStore.data)
                if (this._dimensionStore.data.hasOwnProperty(b)) {
                    e = 0;
                    for (d in a)
                        if (a.hasOwnProperty(d) && d == this._dimensionStore.data[b].name && a[d].values) {
                            e = 1;
                            f = d;
                            c = a[d].isSlice;
                            h = a[d].values;
                            k = a[d].selected;
                            break
                        }
                    if (e) - 1 < f.toLowerCase().indexOf("time") && !this.layer.useMapTime ? this._updateTimeDimensionValues(f, k, c, h[0], h[1]) : -1 == f.toLowerCase().indexOf("time") &&
                        !this._isActiveDimension(f) && this._updateNumericDimensionValues(f, k, c, h[0], h[1]);
                    else if (f = this._dimensionStore.data[b].name, e = this._dimensionStore.data[b].hasRanges && !0 == this._dimensionStore.data[b].hasRanges ? !0 : !1, -1 == f.toLowerCase().indexOf("time") && !this._isActiveDimension(f) || -1 < f.toLowerCase().indexOf("time") && !this.layer.useMapTime) - 1 < f.toLowerCase().indexOf("time") ? this._updateTimeDimensionValues(f, !1, !e, this._dimensionStore.data[b].extent[0], this._dimensionStore.data[b].extent[1]) : this._updateNumericDimensionValues(f, !1, !e, this._dimensionStore.data[b].extent[0], this._dimensionStore.data[b].extent[1])
                }
        },
        _isActiveDimension: function(a) {
            return this.layer.activeMapDimensions && 0 < this.layer.activeMapDimensions.length && -1 < m.indexOf(this.layer.activeMapDimensions, a)
        },
        _setDimensionDefaults: function() {
            var a = this._savedMultidimensionalDefinition,
                b = 0,
                e, d, f, c, h, k, g;
            for (e in this._dimensionStore.data)
                if (this._dimensionStore.data.hasOwnProperty(e)) {
                    d = 0;
                    g = this._dimensionStore.data[e].values;
                    for (f in a)
                        if (a.hasOwnProperty(f) &&
                            a[f].dimensionName == this._dimensionStore.data[e].name) {
                            d = 1;
                            c = a[f].dimensionName;
                            h = a[f].isSlice;
                            k = a[f].values;
                            if (-1 == m.indexOf(g, k[0]) || 2 == k.length && -1 == m.indexOf(g, k[1])) b = 1;
                            break
                        }
                    if (d) - 1 < c.toLowerCase().indexOf("time") && !this.layer.useMapTime ? h ? this._updateTimeDimensionValues(c, !0, h, k[0], this._dimensionStore.data[e].extent[1]) : this._updateTimeDimensionValues(c, !0, h, k[0], k[1]) : -1 == c.toLowerCase().indexOf("time") && !this._isActiveDimension(c) && (h ? this._updateNumericDimensionValues(c, !0, h, k[0], this._dimensionStore.data[e].extent[1]) :
                        this._updateNumericDimensionValues(c, !0, h, k[0], k[1]));
                    else if (c = this._dimensionStore.data[e].name, -1 == c.toLowerCase().indexOf("time") && !this._isActiveDimension(c) || -1 < c.toLowerCase().indexOf("time") && !this.layer.useMapTime) - 1 < c.toLowerCase().indexOf("time") ? this._updateTimeDimensionValues(c, !1, !0, this._dimensionStore.data[e].extent[0], this._dimensionStore.data[e].extent[1]) : this._updateNumericDimensionValues(c, !1, !0, this._dimensionStore.data[e].extent[0], this._dimensionStore.data[e].extent[1])
                }
            b &&
                this._onClickApplyMultidimensionalFilter();
            this.reset = 0
        },
        _updateTimeDimensionValues: function(a, b, e, c, f) {
            d.byId("min" + a + "DateTimeBox").set("dateValue", c);
            d.byId("max" + a + "DateTimeBox").set("dateValue", f);
            d.byId(a + "RangeCheckbox").set("value", !e);
            d.byId(a).set("checked", b)
        },
        _updateNumericDimensionValues: function(a, b, e, c, f) {
            d.byId("min" + a + "NumberBox").set("numValue", c);
            d.byId("max" + a + "NumberBox").set("numValue", f);
            d.byId(a + "RangeCheckbox").set("value", !e);
            d.byId(a).set("checked", b)
        },
        _returnFieldAlias: function(a) {
            var b =
                this.layer.fields,
                e;
            for (e in b)
                if (b.hasOwnProperty(e) && b[e].name.toLowerCase() == a.toLowerCase()) return b[e].alias
        },
        _onClickApplyMultidimensionalFilter: function() {
            var a = K("input[name\x3ddimensionCheckbox]:checked"),
                b = [],
                e, c, f, g, h;
            for (e = 0; e < a.length; e++) b.push(a[e].id);
            a = [];
            e = d.byId("variableList").get("value") == this._i18n.widgets.multidimensionalFilter.defaultVariableText ? "" : d.byId("variableList").get("value");
            for (c in b) b.hasOwnProperty(c) && (f = b[c], d.byId(f + "RangeCheckbox").get("value") ? -1 < f.toLowerCase().indexOf("time") ?
                (g = d.byId("min" + f + "Time").get("value"), h = d.byId("max" + f + "Time").get("value"), g = [Number(g), Number(h)]) : g = [Number(d.byId("min" + f + "Value").get("value")), Number(d.byId("max" + f + "Value").get("value"))] : -1 < f.toLowerCase().indexOf("time") ? (g = d.byId("min" + f + "Time").get("value"), g = [Number(g)]) : g = [Number(d.byId("min" + f + "Value").get("value"))], (-1 == f.toLowerCase().indexOf("time") && !this._isActiveDimension(f) || -1 < f.toLowerCase().indexOf("time") && !this.layer.useMapTime) && a.push(new L({
                    variableName: e,
                    dimensionName: f,
                    isSlice: !d.byId(f + "RangeCheckbox").get("value"),
                    values: g
                })));
            if (this.layer.mosaicRule && this.layer.mosaicRule.multidimensionalDefinition)
                for (c in this.layer.mosaicRule.multidimensionalDefinition) this.layer.mosaicRule.multidimensionalDefinition.hasOwnProperty(c) && (f = this.layer.mosaicRule.multidimensionalDefinition[c].dimensionName, -1 == f.toLowerCase().indexOf("time") && this._isActiveDimension(f) && a.push(this.layer.mosaicRule.multidimensionalDefinition[c]));
            this.layer.mosaicRule ? (b = this.layer.mosaicRule,
                b.multidimensionalDefinition = a) : this.layer.defaultMosaicRule ? (b = this.layer.defaultMosaicRule, b.multidimensionalDefinition = a) : b = new z({
                multidimensionalDefinition: []
            });
            this.layer.setMosaicRule(b)
        },
        _onClickResetMultidimensionalFilter: function() {
            var a, b, c = [];
            if (this.defaultMultidimensionalDefinition && 0 == this.reset) {
                this.reset = 1;
                this._cachedDimensions = null;
                for (a in this.defaultMultidimensionalDefinition) this.defaultMultidimensionalDefinition.hasOwnProperty(a) && (b = this.defaultMultidimensionalDefinition[a].dimensionName, (-1 == b.toLowerCase().indexOf("time") && !this._isActiveDimension(b) || -1 < b.toLowerCase().indexOf("time") && !this.layer.useMapTime) && c.push(this.defaultMultidimensionalDefinition[a]));
                if (this.layer.mosaicRule && this.layer.mosaicRule.multidimensionalDefinition)
                    for (a in this.layer.mosaicRule.multidimensionalDefinition) this.layer.mosaicRule.multidimensionalDefinition.hasOwnProperty(a) && (b = this.layer.mosaicRule.multidimensionalDefinition[a].dimensionName, -1 == b.toLowerCase().indexOf("time") && this._isActiveDimension(b) &&
                        c.push(this.layer.mosaicRule.multidimensionalDefinition[a]));
                0 == c.length && (c = this.defaultMultidimensionalDefinition);
                this.layer.mosaicRule ? (a = this.layer.mosaicRule, a.multidimensionalDefinition = c) : this.layer.defaultMosaicRule ? (a = this.layer.defaultMosaicRule, a.multidimensionalDefinition = c) : a = new z({
                    multidimensionalDefinition: []
                });
                this.layer.setMosaicRule(a);
                if (this._savedMultidimensionalDefinition = c) this._dimensionStore = null, this._setVariableValueDefault()
            }
        }
    })
});