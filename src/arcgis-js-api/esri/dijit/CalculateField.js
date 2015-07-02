//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/json", "dojo/_base/kernel", "dojo/_base/fx", "dojo/has", "dojo/json", "dojo/string", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "dojo/query", "dojo/dom-class", "dojo/_base/event", "dojo/Evented", "dojo/fx/easing", "dojo/store/Memory", "dojo/mouse", "dojo/on", "dojo/_base/window", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/_OnDijitClickMixin", "dijit/_FocusMixin", "dijit/registry", "dijit/form/Button", "dijit/form/CheckBox", "dijit/form/Form", "dijit/form/Select", "dijit/form/MultiSelect", "dijit/form/TextBox", "dijit/form/SimpleTextarea", "dijit/form/ValidationTextBox", "dijit/layout/ContentPane", "dijit/form/ComboBox", "dijit/Dialog", "dijit/Tooltip", "dgrid/OnDemandList", "dgrid/Selection", "dgrid/Keyboard", "dgrid/extensions/DijitRegistry", "dgrid/util/mouse", "put-selector/put", "../kernel", "../lang", "../request", "./SingleFilter", "dojo/i18n!../nls/jsapi", "dojo/text!./templates/CalculateField.html"], function(F, v, d, f, S, w, n, x, T, U, e, k, r, h, V, W, y, G, z, s, A, B, C, H, I, J, K, L, X, M, Y, Z, $, aa, ba, ca, da, ea, fa, ga, t, N, O, P, Q, p, ha, u, q, D, ia, l, R) {
    var E = v([N, P, O, Q]);
    return v([H, I, J, K, L, G], {
        declaredClass: "esri.dijit.CalculateField",
        templateString: R,
        basePath: F.toUrl("."),
        widgetsInTemplate: !0,
        showSelectField: !1,
        showHeader: !0,
        closeOnAdd: !0,
        addButtonClass: "",
        closeButtonClass: "",
        _showMsgTimerInterval: 3E3,
        constructor: function(a) {
            a.containerNode && (this.container = a.containerNode)
        },
        destroy: function() {
            this.inherited(arguments)
        },
        postMixInProperties: function() {
            this.inherited(arguments);
            this.i18n = {};
            d.mixin(this.i18n, l.common);
            d.mixin(this.i18n, l.calculateFields)
        },
        postCreate: function() {
            this.inherited(arguments);
            this._buildUI();
            this._loadEvents();
            var a = ["ar", "he"],
                b, c;
            this.onlineHelpMap = {};
            for (b = 0; b < a.length; b += 1) c = a[b], n.locale && -1 !== n.locale.indexOf(c) && (-1 !== n.locale.indexOf("-") ? -1 !== n.locale.indexOf(c + "-") && (this._isRightToLeft = !0) : this._isRightToLeft = !0);
            this.validate()
        },
        _buildUI: function() {
            var a = [],
                b;
            k.set(this._header,
                "display", this.showHeader ? "block" : "none");
            k.set(this._selCalcFieldDiv, "display", this.showSelectField ? "block" : "none");
            this.field && (b = f.filter(this.layer.fields, function(a) {
                return a.name === this.field
            }, this), this._calcField = b = b[0], r.set(this._calcFieldLabel, "innerHTML", e.substitute(this.i18n.exprLabel, {
                fieldName: b.name
            })));
            if (!this.helperMethods || this.helperMethods && 0 === this.helperMethods.length) b = [{
                type: "NumType",
                label: e.substitute(this.i18n.absFunc, {
                    functionName: "ABS(\x3ci\x3enumber\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e"
                }),
                name: "ABS()"
            }, {
                type: "NumType",
                label: e.substitute(this.i18n.castFunc, {
                    functionName: "CAST(\x3ci\x3enumber\x3c/i\x3e",
                    num: "\x3ci\x3enumber\x3c/i\x3e"
                }),
                name: "CAST()"
            }, {
                type: "NumType",
                label: e.substitute(this.i18n.ceilingFunc, {
                    functionName: "CEILING(\x3ci\x3enumber\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e"
                }),
                name: "CEILING()"
            }, {
                type: "NumType",
                label: e.substitute(this.i18n.cosFunc, {
                    functionName: "COS(\x3ci\x3enumber\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e"
                }),
                name: "COS()"
            }, {
                type: "NumType",
                label: e.substitute(this.i18n.floorFunc, {
                    functionName: "FLOOR(\x3ci\x3enumber\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e"
                }),
                name: "FLOOR()"
            }, {
                type: "NumType",
                label: e.substitute(this.i18n.logFunc, {
                    functionName: "LOG(\x3ci\x3enumber\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e"
                }),
                name: "LOG()"
            }, {
                type: "NumType",
                label: e.substitute(this.i18n.log10Func, {
                    functionName: "LOG10(\x3ci\x3enumber\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e"
                }),
                name: "LOG10()"
            }, {
                type: "NumType",
                label: e.substitute(this.i18n.modFunc, {
                    functionName: "MOD(\x3ci\x3enumber\x3c/i\x3e, \x3ci\x3en\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e",
                    n: "\x3ci\x3en\x3c/i\x3e"
                }),
                name: "MOD(,)"
            }, {
                type: "NumType",
                label: e.substitute(this.i18n.powerFunc, {
                    functionName: "POWER(\x3ci\x3enumber\x3c/i\x3e, \x3ci\x3ey\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e",
                    y: "\x3ci\x3ey\x3c/i\x3e"
                }),
                name: "POWER(,)"
            }, {
                type: "NumType",
                label: e.substitute(this.i18n.roundFunc, {
                    functionName: "ROUND(\x3ci\x3enumber\x3c/i\x3e, \x3ci\x3elength\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e",
                    length: "\x3ci\x3elength\x3c/i\x3e"
                }),
                name: "ROUND(,)"
            }, {
                type: "NumType",
                label: e.substitute(this.i18n.sinFunc, {
                    functionName: "SIN(\x3ci\x3enumber\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e"
                }),
                name: "SIN()"
            }, {
                type: "NumType",
                label: e.substitute(this.i18n.tanFunc, {
                    functionName: "TAN(\x3ci\x3enumber\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e"
                }),
                name: "TAN()"
            }, {
                type: "NumType",
                label: e.substitute(this.i18n.truncateFunc, {
                    functionName: "TRUNCATE(\x3ci\x3enumber\x3c/i\x3e, \x3ci\x3edecimal_place\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e",
                    decimal_place: "\x3ci\x3edecimal_place\x3c/i\x3e"
                }),
                name: "TRUNCATE(,)"
            }, {
                type: "NumType",
                label: e.substitute(this.i18n.nullifFunc, {
                    functionName: "NULLIF(\x3ci\x3enumber\x3c/i\x3e,\x3ci\x3evalue\x3c/i\x3e)",
                    num: "\x3ci\x3enumber\x3c/i\x3e",
                    value: "\x3ci\x3evalue\x3c/i\x3e"
                }),
                name: "NULLIF(,)"
            }, {
                type: "StrType",
                label: e.substitute(this.i18n.char_lengthFunc, {
                    functionName: "CHAR_LENGTH(\x3ci\x3estring\x3c/i\x3e)",
                    str: "\x3ci\x3estring\x3c/i\x3e"
                }),
                name: "CHAR_LENGTH()"
            }, {
                type: "StrType",
                label: e.substitute(this.i18n.concatFunc, {
                    functionName: "CONCAT(\x3ci\x3estring1\x3c/i\x3e, \x3ci\x3estring2\x3c/i\x3e)"
                }),
                name: "CONCAT(,)"
            }, {
                type: "StrType",
                label: e.substitute(this.i18n.positionFunc, {
                    functionName: "POSITION(\x3ci\x3esubstring\x3c/i\x3e, \x3ci\x3estring\x3c/i\x3e)",
                    str: "\x3ci\x3estring\x3c/i\x3e"
                }),
                name: "POSITION(,)"
            }, {
                type: "StrType",
                label: e.substitute(this.i18n.lowerFunc, {
                    functionName: "LOWER(\x3ci\x3estring\x3c/i\x3e)",
                    str: "\x3ci\x3estring\x3c/i\x3e"
                }),
                name: "LOWER()"
            }, {
                type: "StrType",
                label: e.substitute(this.i18n.substringFunc, {
                    functionName: "SUBSTRING(\x3ci\x3estring\x3c/i\x3e, \x3ci\x3estart\x3c/i\x3e, \x3ci\x3elength\x3c/i\x3e)",
                    start: "\x3ci\x3estart\x3c/i\x3e",
                    length: "\x3ci\x3elength\x3c/i\x3e",
                    str: "\x3ci\x3estring\x3c/i\x3e"
                }),
                name: "SUBSTRING(,,)"
            }, {
                type: "StrType",
                label: e.substitute(this.i18n.trimFunc, {
                    functionName: "TRIM(BOTH|LEADING|TRAILING] \u2018 \u2018 FROM expression)",
                    str: "\x3ci\x3estring\x3c/i\x3e"
                }),
                name: "TRIM()"
            }, {
                type: "StrType",
                label: e.substitute(this.i18n.upperFunc, {
                    functionName: "UPPER(\x3ci\x3estring\x3c/i\x3e)",
                    str: "\x3ci\x3estring\x3c/i\x3e"
                }),
                name: "UPPER()"
            }, {
                type: "DateType",
                label: e.substitute(this.i18n.current_dateFunc, {
                    functionName: "CURRENT_DATE()"
                }),
                name: "CURRENT_DATE()"
            }, {
                type: "DateType",
                label: e.substitute(this.i18n.current_timeFunc, {
                    functionName: "CURRENT_TIME()"
                }),
                name: "CURRENT_TIME()"
            }, {
                type: "DateType",
                label: e.substitute(this.i18n.current_timestampFunc, {
                    functionName: "CURRENT_TIMESTAMP()"
                }),
                name: "CURRENT_TIMESTAMP()"
            }], f.forEach(b, function(a) {
                a.label = "\x3cb\x3e" + a.label.substring(0, a.label.lastIndexOf(":") + 1) + "\x3c/b\x3e\x3cbr/\x3e " + a.label.substring(a.label.lastIndexOf(":") + 1)
            }, this), this.set("helperMethods",
                b);
            (!this.operators || this.operators && 0 === this.operators.length) && this.set("operators", "+-/*()".split(""));
            this._operatorBtns = [];
            f.forEach(this.operators, function(a) {
                this._operatorBtns.push(new M({
                    value: a,
                    label: a,
                    style: {
                        width: "4em"
                    },
                    onClick: d.hitch(this, this._updateExpression, {
                        value: a,
                        type: "operator"
                    })
                }, h.create("div", null, this._operatorCtr)))
            }, this);
            this.layer && (this.layer.fields && 0 < this.layer.fields.length) && (a = this._createIds(this.layer.fields), b = f.map(this.layer.fields, function(a) {
                return {
                    label: a.name,
                    value: a.name
                }
            }), this._selCalcField.addOption(b), this._selCalcField.set("value", this.field));
            this.fieldsStore = new s({
                data: a
            });
            this.attributeList = new E({
                renderRow: d.hitch(this, this._renderAttributesRow),
                selectionMode: "single",
                store: this.fieldsStore
            }, this._attributeListCtr);
            a = this._createIds(this.get("helperMethods"));
            this.operatorStore = new s({
                data: a
            });
            this.helpersList = new E({
                renderRow: d.hitch(this, this._renderOperatorRow),
                selectionMode: "single",
                store: this.operatorStore
            }, this._helpersListCtr)
        },
        _loadEvents: function() {
            this.watch("fields",
                d.hitch(this, this._handleFieldsChange));
            this.watch("field", d.hitch(this, this._handleFieldChange));
            if (this.showSelectField) this._selCalcField.on("change", d.hitch(this, this._handleSelcCalFieldChange));
            this._expressionForm.watch("value", d.hitch(this, this._handleHelperTypeChange));
            this._expressionForm.on("focus", d.hitch(this, this._setfocus));
            this._exprBox.watch("value", d.hitch(this, this._handleExpChange));
            this.attributeList.on("dgrid-select", d.hitch(this, function(a) {
                this._updateExpression({
                    value: a.rows[0].data,
                    type: "field"
                })
            }));
            this.helpersList.on("dgrid-select", d.hitch(this, function(a) {
                this._updateExpression({
                    value: a.rows[0].data,
                    type: "helper"
                })
            }));
            this.attributeList.on(p.enterRow, d.hitch(this, function(a) {
                a = this.attributeList.row(a);
                var b, c;
                b = a.data.alias || a.data.name;
                c = this._getTypeLabel(a.data.type);
                this._showTooltip(a.element, "\x3cb\x3e" + b + "\x3c/b\x3e: " + c)
            }));
            this.attributeList.on(p.leaveRow, d.hitch(this, function(a) {
                a = this.attributeList.row(a);
                this._hideTooltip(a.element)
            }));
            this.helpersList.on(p.enterRow,
                d.hitch(this, function(a) {
                    a = this.helpersList.row(a);
                    this._showTooltip(a.element, a.data.label)
                }));
            this.helpersList.on(p.leaveRow, d.hitch(this, function(a) {
                a = this.helpersList.row(a);
                this._hideTooltip(a.element)
            }));
            this.attributeList.on("dgrid-refresh-complete", d.hitch(this, this._setfocus));
            this.helpersList.on("dgrid-refresh-complete", d.hitch(this, this._setfocus));
            this._exprBox.on("blur", d.hitch(this, function() {
                this._exprBox.textbox.setSelectionRange && "number" == typeof this._exprBox.textbox.selectionStart ?
                    this._exprBox.set("cursorPosition", [this._exprBox.textbox.selectionStart, this._exprBox.textbox.selectionEnd]) : this._exprBox.set("cursorPosition", this._getCursorRange(this._exprBox.textbox))
            }));
            this._exprBox.on("focus", d.hitch(this, function() {
                var a = this._exprBox.get("cursorPosition");
                a && (this._exprBox.textbox.setSelectionRange && "number" == typeof this._exprBox.textbox.selectionStart ? this._exprBox.textbox.setSelectionRange(a[1], a[1]) : this._setCaretPosition(this._exprBox.textbox, a[1], a[1]))
            }));
            B(this._calcFieldLabel,
                A.enter, d.hitch(this, function(a) {
                    a = "";
                    a = this._getTypeLabel(this._calcField.type);
                    this._showTooltip(this._calcFieldLabel, "\x3cb\x3e" + this._calcField.alias + "\x3c/b\x3e: " + a)
                }));
            B(this._calcFieldLabel, A.leave, d.hitch(this, function(a) {
                this._hideTooltip(this._calcFieldLabel)
            }))
        },
        startup: function() {
            this.inherited(arguments);
            this.attributeList.startup();
            this.helpersList.startup();
            this._setHelperType()
        },
        reset: function() {
            u.show(this.domNode);
            this._expressionForm.reset();
            this._handleCloseMsg();
            this._setHelperType()
        },
        _close: function() {
            this.emit("close", {});
            u.hide(this.domNode)
        },
        _createIds: function(a) {
            var b = [];
            a && 0 < a.length && (b = f.map(a, function(a, b) {
                return d.mixin(a, {
                    id: b
                })
            }));
            return b
        },
        _renderAttributesRow: function(a) {
            var b = h.create("div", {
                    "class": "esriCalExpRowOuter"
                }),
                c = h.create("div", {
                    "class": "esriCalcExpLabelRow"
                }, b);
            h.create("div", {
                "class": "esriCalcFieldTextTrimWithEllipses",
                innerHTML: a.name
            }, c);
            return b
        },
        _renderOperatorRow: function(a) {
            var b = h.create("div", {
                    "class": "esriCalExpRowOuter"
                }),
                c = h.create("div", {
                    "class": "esriCalcExpLabelRow"
                }, b);
            h.create("div", {
                "class": "esriCalcFieldTextTrimWithEllipses",
                innerHTML: a.name
            }, c);
            return b
        },
        _handleFieldsChange: function(a, b, c) {
            a = [];
            this.layer && (this.layer.fields && 0 < this.layer.fields.length) && (0 < this._selCalcField.getOptions().length && this._selCalcField.removeOption(this._selCalcField.getOptions()), a = this._createIds(this.layer.fields), b = f.map(this.layer.fields, function(a) {
                return {
                    label: a.name,
                    value: a.name
                }
            }), this._selCalcField.addOption(b), this._selCalcField.set("value",
                this.field));
            this.fieldsStore = new s({
                data: a
            });
            this.attributeList.set("store", this.fieldsStore)
        },
        _handleFieldChange: function(a, b, c) {
            r.set(this._calcFieldLabel, "innerHTML", e.substitute(this.i18n.exprLabel, {
                fieldName: c
            }));
            this._setHelperType();
            this._setfocus()
        },
        _setHelperType: function() {
            var a;
            this.field ? (a = f.filter(this.layer.fields, function(a) {
                return a.name === this.field
            }, this), a = a[0], q.isDefined(a) ? (this._calcField = a, "esriFieldTypeDate" === a.type ? this._dateRadioBtn.set("checked", !0) : "esriFieldTypeString" ===
                a.type ? this._strRadioBtn.set("checked", !0) : -1 !== f.indexOf(["esriFieldTypeSmallInteger", "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeDouble"], a.type) && this._numRadioBtn.set("checked", !0)) : this._strRadioBtn.set("checked", !0)) : this._strRadioBtn.set("checked", !0)
        },
        _handleHelperTypeChange: function(a, b, c) {
            this.helpersList.set("query", {
                type: c.functionType
            });
            "DateType" === c.functionType ? this.attributeList.set("query", {
                type: "esriFieldTypeDate"
            }) : "StrType" === c.functionType ? this.attributeList.set("query", {
                type: "esriFieldTypeString"
            }) : "NumType" === c.functionType && this.attributeList.set("query", function(a) {
                return -1 !== f.indexOf(["esriFieldTypeSmallInteger", "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeDouble"], a.type)
            });
            this.helpersList.refresh();
            this.attributeList.refresh()
        },
        _handleSelcCalFieldChange: function(a) {
            this.set("field", a)
        },
        _handleRemoveBtnClick: function() {
            this._exprBox.set("value", "");
            this._setfocus()
        },
        _handleAddButtonClick: function(a) {
            y.stop(a);
            var b = {
                    f: "json"
                },
                c;
            this._exprBox.get("value") ?
                (this._handleCloseMsg(), b.calcExpression = w.toJson(this.get("expression")), b.sqlFormat = "standard", this.layer.getDefinitionExpression && this.layer.getDefinitionExpression() ? b.where = this.layer.getDefinitionExpression() : q.isDefined(this.layer.definitionExpression) && "" !== this.layer.definitionExpression && (b.where = this.layer.definitionExpression), u.id.getCredential(this.layer.url + "/calculate").then(d.hitch(this, function(a) {
                    b.token = a.token;
                    c = D({
                        url: this.layer.url + "/calculate",
                        content: b
                    }, {
                        usePost: !0
                    });
                    this.emit("calculate-start", {
                        calcPromise: c.promise
                    });
                    this._addBtn.set("disabled", !0);
                    this._showLoading();
                    c.then(d.hitch(this, function(a) {
                        this._addBtn.set("disabled", !1);
                        this._hideLoading();
                        var c = {};
                        d.mixin(c, {
                            calcExpression: w.fromJson(b.calcExpression)[0].sqlExpression,
                            where: b.where,
                            sqlFormat: b.sqlFormat
                        }, a);
                        this.emit("calculate-success", c);
                        this.layer.refresh();
                        this._showMessages(e.substitute(this.i18n.successMsg, {
                            count: a.updatedFeatureCount
                        }), !0);
                        this.closeOnAdd && this._close()
                    }), d.hitch(this, this._handleErrorResponse))
                }), d.hitch(this,
                    this._handleErrorResponse))) : this._addBtn.set("disabled", !0)
        },
        _handleErrorResponse: function(a) {
            this._addBtn.set("disabled", !1);
            this._hideLoading();
            this.emit("calculate-error", a);
            this._showMessages(e.substitute(this.i18n.exprFailedMsg, {
                expr: this._exprBox.get("value")
            }) + "\x3cbr/\x3e" + a.details.toString())
        },
        _handleCloseButtonClick: function(a) {
            y.stop(a);
            this._close()
        },
        _showTooltip: function(a, b) {
            var c = h.create("label", {
                innerHTML: b,
                className: "esriSmallFont"
            });
            this._isRightToLeft ? t.show(c.outerHTML, a, ["after"], !0) : t.show(c.outerHTML, a, ["after"])
        },
        _hideTooltip: function(a, b) {
            t.hide(a)
        },
        _setfocus: function() {
            this._exprBox.focus()
        },
        _showMessages: function(a, b) {
            r.set(this._bodyNode, "innerHTML", a);
            x.fadeIn({
                node: this._errorMessagePane,
                easing: z.quadIn,
                onEnd: d.hitch(this, function() {
                    k.set(this._errorMessagePane, {
                        display: ""
                    })
                })
            }).play();
            b && window.setTimeout(d.hitch(this, this._handleCloseMsg), this._showMsgTimerInterval)
        },
        _handleCloseMsg: function(a) {
            a && a.preventDefault();
            "none" !== k.get(this._errorMessagePane, "display") &&
                x.fadeOut({
                    node: this._errorMessagePane,
                    easing: z.quadOut,
                    onEnd: d.hitch(this, function() {
                        k.set(this._errorMessagePane, {
                            display: "none"
                        })
                    })
                }).play()
        },
        validate: function() {
            var a = !0;
            this.layer ? this.field ? this.layer.supportsCalculate ? !this.layer.userIsAdmin && !this.layer.getEditCapabilities().canUpdate && (e.substitute(this.i18n.lyrUpdateCapMsg, {
                layername: this.layer.name
            }), a = !1) : (e.substitute(this.i18n.lyrSupportCalMsg, {
                layername: this.layer.name
            }), a = !1) : a = !1 : a = !1;
            this._addBtn.set("disabled", !a);
            return a
        },
        _validateExpObj: function(a) {
            var b = !0;
            a || (b = !1);
            b ? this._handleCloseMsg() : this._showMessages(void 0);
            return b
        },
        _updateExpression: function(a) {
            var b = this._exprBox.get("cursorPosition"),
                c = this._exprBox.get("value"),
                d = "",
                e = 0,
                m, g;
            if (this._validateExpObj(a)) {
                this._exprStack || (this._exprStack = []);
                0 < this._exprStack.length && (g = this._exprStack[this._exprStack.length - 1]);
                if (!b || !c) b = [0, 0];
                "operator" === a.type ? (m = " " + a.value + " ", e = m.length) : "helper" === a.type ? (m = a.value.name, e = -1 !== a.value.name.indexOf(",") ? a.value.name.indexOf(",") : a.value.name.length -
                    1) : "field" === a.type && (d = q.isDefined(g) && "helper" === g.type && -1 !== g.value.name.indexOf("MOD") && -1 !== f.indexOf(["esriFieldTypeSmallInteger", "esriFieldTypeInteger", "esriFieldTypeSingle"], a.value.type), g = q.isDefined(g) && "helper" === g.type && -1 !== g.value.name.indexOf("MOD") && "esriFieldTypeDouble" === a.value.type, m = "esriFieldTypeDouble" === this._calcField.type && !d && -1 !== f.indexOf(["esriFieldTypeSmallInteger", "esriFieldTypeInteger", "esriFieldTypeSingle"], a.value.type) ? "CAST(" + a.value.name + " AS FLOAT)" : -1 !== f.indexOf(["esriFieldTypeSmallInteger",
                    "esriFieldTypeInteger", "esriFieldTypeSingle"
                ], this._calcField.type) && g ? "CAST(" + a.value.name + " AS INT)" : a.value.name, e = m.length + 1);
                d = c.substring(0, b[0]) + m + c.substring(b[1]);
                this._exprBox.set("value", d);
                this._exprBox.focus();
                this._exprBox.textbox.setSelectionRange && "number" == typeof this._exprBox.textbox.selectionStart ? (this._exprBox.textbox.setSelectionRange(b[0] + e, b[0] + e), this._exprBox.set("cursorPosition", [b[0] + e, b[0] + e])) : (this._setCaretPosition(this._exprBox.textbox, b[0] + e, b[0] + e), this._exprBox.set("cursorPosition",
                    this._getCursorRange(this._exprBox.textbox)));
                this._setfocus();
                this._exprStack.push(a)
            }
        },
        _setCaretPosition: function(a, b, c) {
            a.setSelectionRange && "number" == typeof a.selectionStart ? a.setSelectionRange(b, c) : "undefined" != typeof a.createTextRange && (a = a.createTextRange(), a.collapse(!0), a.moveEnd("character", c), a.moveStart("character", b), a.select())
        },
        _getCaretPosition: function(a) {
            var b = 0;
            if (C.doc.selection) a.focus(), b = C.doc.selection.createRange(), b.moveStart("character", -a.value.length), b = b.text.length;
            else if (a.selectionStart || "number" == typeof a.selectionStart) b = a.selectionStart;
            return b
        },
        _getCursorRange: function(a) {
            var b, c;
            a.setSelectionRange && "number" == typeof a.selectionStart ? (b = a.selectionStart, c = a.selectionEnd) : "undefined" != typeof a.createTextRange && (b = this._getCaretPosition(a), c = this._getCaretPosition(a));
            return [b, c]
        },
        _handleExpChange: function(a, b, c) {
            this._addBtn.set("disabled", !c);
            this._validateBtn.set("disabled", !c);
            this._removeBtn.set("disabled", !c)
        },
        _handleValidationBtnClick: function() {
            var a = {
                    sql: this.field + " \x3d " + this._exprBox.get("value"),
                    sqlType: "where",
                    f: "json"
                },
                a = D({
                    url: this.layer.url + "/validateSQL",
                    content: a
                }, {
                    usePost: !0
                });
            this._addBtn.set("disabled", !0);
            this._validateBtn.set("disabled", !0);
            this._showLoading();
            a.then(d.hitch(this, function(a) {
                var c;
                this._hideLoading();
                this._validateBtn.set("disabled", !1);
                this._addBtn.set("disabled", !a.isValidSQL);
                a.isValidSQL ? this._handleCloseMsg() : a.validationErrors && 0 < a.validationErrors.length ? (c = "", f.forEach(a.validationErrors, function(a) {
                    if (a.params &&
                        l.calculateFields.errorCodes[a.errorCode]) {
                        var b = {},
                            d;
                        for (d in a.params) a.params.hasOwnProperty(d) && (b[d] = a.params[d]);
                        c += e.substitute(l.calculateFields.errorCodes[a.errorCode], b) + "\x3cbr/\x3e"
                    } else c += (l.calculateFields.errorCodes[a.errorCode] || a.description) + "\x3cbr/\x3e"
                }, this), this._showMessages(c, !1)) : this._showMessages(l.calculateFields.invalidExpression)
            }), d.hitch(this, function(a) {
                this._hideLoading();
                this._validateBtn.set("disabled", !1);
                this._addBtn.set("disabled", !1)
            }))
        },
        _showLoading: function() {
            k.set(this._underlay,
                "display", "block")
        },
        _hideLoading: function() {
            k.set(this._underlay, "display", "none")
        },
        _getTypeLabel: function(a) {
            var b; - 1 !== f.indexOf(["esriFieldTypeSmallInteger", "esriFieldTypeInteger", "esriFieldTypeSingle"], a) ? b = this.i18n.integerLabel : "esriFieldTypeDouble" === a ? b = this.i18n.doubleLabel : "esriFieldTypeDate" === a ? b = this.i18n.dateLabel : "esriFieldTypeString" === a && (b = this.i18n.stringLabel);
            return b
        },
        _setLayerAttr: function(a) {
            this._set("layer", a);
            this._set("fields", a.fields)
        },
        _setFieldsAttr: function(a) {
            this._set("fields",
                a)
        },
        _setFieldAttr: function(a) {
            this._set("field", a)
        },
        _setHelperMethodsAttr: function(a) {
            this._set("helperMethods", a)
        },
        _setOperatorsAttr: function(a) {
            this._set("operators", a)
        },
        _setShowSelectFieldAttr: function(a) {
            this._set("showSelectField", a)
        },
        _setShowHeaderAttr: function(a) {
            this._set("showHeader", a)
        },
        _setCloseOnAddAttr: function(a) {
            this._set("closeOnAdd", a)
        },
        _getExpressionAttr: function() {
            var a = this._exprBox.get("value"),
                b, c;
            if (a) return a.split(" "), c = [], b = {
                    field: this.field
                }, b.sqlExpression = a, c.push(b),
                c;
            this._addBtn.set("disabled", !0)
        },
        _setAddButtonClassAttr: function(a) {
            this._set("addButtonClass", a)
        },
        _setCloseButtonClassAttr: function(a) {
            this._set("closeButtonClass", a)
        }
    })
});