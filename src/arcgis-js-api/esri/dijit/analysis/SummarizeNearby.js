//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/json", "dojo/_base/fx", "dojo/has", "dojo/json", "dojo/string", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "dojo/query", "dojo/dom-class", "dojo/number", "dojo/fx/easing", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/_OnDijitClickMixin", "dijit/_FocusMixin", "dijit/registry", "dijit/form/Button", "dijit/form/CheckBox", "dijit/form/Form", "dijit/form/Select", "dijit/form/TextBox", "dijit/form/ValidationTextBox", "dijit/layout/ContentPane", "dijit/form/ComboBox", "../../kernel", "../../lang", "./AnalysisBase", "./CreditEstimator", "./utils", "./TrafficTime", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/SummarizeNearby.html"], function(y, z, e, g, n, h, u, I, J, k, l, d, m, A, s, q, v, B, C, D, E, F, w, K, L, M, x, N, O, P, Q, R, r, G, S, p, T, t, H) {
    return z([B, C, D, E, F, G], {
        declaredClass: "esri.dijit.analysis.SummarizeNearby",
        templateString: H,
        basePath: y.toUrl("."),
        widgetsInTemplate: !0,
        sumNearbyLayer: null,
        summaryLayers: null,
        summaryFields: null,
        nearType: null,
        outputLayerName: null,
        summarizeMetric: !0,
        summaryLayer: null,
        groupByField: null,
        minorityMajority: !1,
        percentPoints: !1,
        distances: null,
        units: null,
        shapeUnits: null,
        sumShape: !0,
        showSelectFolder: !1,
        showChooseExtent: !0,
        enableTravelModes: !0,
        showHelp: !0,
        showCredits: !0,
        returnFeatureCollection: !1,
        i18n: null,
        toolName: "SummarizeNearby",
        helpFileName: "SummarizeNearby",
        resultParameter: "resultLayer",
        constructor: function(a) {
            this._pbConnects = [];
            this._statsRows = [];
            a.containerNode && (this.container = a.containerNode)
        },
        destroy: function() {
            this.inherited(arguments);
            g.forEach(this._pbConnects, n.disconnect);
            delete this._pbConnects;
            this._driveTimeClickHandles && 0 < this._driveTimeClickHandles.length && (g.forEach(this._driveTimeClickHandles,
                n.disconnect), this._driveTimeClickHandles = null)
        },
        postMixInProperties: function() {
            this.inherited(arguments);
            e.mixin(this.i18n, t.bufferTool);
            e.mixin(this.i18n, t.driveTimes);
            e.mixin(this.i18n, t.summarizeNearbyTool)
        },
        postCreate: function() {
            this.inherited(arguments);
            s.add(this._form.domNode, "esriSimpleForm");
            this._breakValuesInput.set("validator", e.hitch(this, this.validateDistance));
            this._outputLayerInput.set("validator", e.hitch(this, this.validateServiceName));
            this._buildUI()
        },
        startup: function() {},
        _onClose: function(a) {
            a &&
                (this._save(), this.emit("save", {
                    save: !0
                }));
            this.emit("close", {
                save: a
            })
        },
        _handleShowCreditsClick: function(a) {
            a.preventDefault();
            if (this._form.validate()) {
                a = {};
                var b;
                b = this.summaryLayers[this._layersSelect.get("value")];
                a.summaryLayer = h.toJson(p.constructAnalysisInputLyrObj(b));
                a.nearType = this.get("nearType");
                a.sumNearbyLayer = h.toJson(p.constructAnalysisInputLyrObj(this.sumNearbyLayer));
                a.summaryFields = h.toJson(this.get("summaryFields"));
                a.distances = h.toJson(this.get("distances"));
                a.units = this._distanceUnitsSelect.get("value");
                this._trafficTimeWidget.get("checked") && (a.timeOfDay = this._trafficTimeWidget.get("timeOfDay"), "UTC" === this._trafficTimeWidget.get("timeZoneForTimeOfDay") && (a.timeZoneForTimeOfDay = this._trafficTimeWidget.get("timeZoneForTimeOfDay")));
                this.returnFeatureCollection || (a.OutputName = h.toJson({
                    serviceProperties: {
                        name: this._outputLayerInput.get("value")
                    }
                }));
                a.sumShape = this._sumMetricCheck.get("checked");
                if ("esriGeometryPoint" !== b.geometryType || "esriGeometryMultipoint" !== b.geometryType) a.shapeUnits = this.get("shapeUnits");
                "0" !== this._groupBySelect.get("value") && (a.groupByField = this._groupBySelect.get("value"));
                a.returnBoundaries = this.get("returnBoundaries");
                this.showChooseExtent && this._useExtentCheck.get("checked") && (a.context = h.toJson({
                    extent: this.map.extent._normalize(!0)
                }));
                this.getCreditsEstimate(this.toolName, a).then(e.hitch(this, function(a) {
                    this._usageForm.set("content", a);
                    this._usageDialog.show()
                }))
            }
        },
        _handleSaveBtnClick: function() {
            if (this._form.validate())
                if (!this._sumMetricCheck.get("checked") && 0 === this.get("summaryFields").length) this._showMessages(this.i18n.statsRequiredMsg);
                else {
                    this._saveBtn.set("disabled", !0);
                    var a = {},
                        b = {},
                        c, f;
                    c = this.summaryLayers[this._layersSelect.get("value")];
                    a.summaryLayer = h.toJson(p.constructAnalysisInputLyrObj(c));
                    a.nearType = this.get("nearType");
                    a.sumNearbyLayer = h.toJson(p.constructAnalysisInputLyrObj(this.sumNearbyLayer));
                    a.summaryFields = h.toJson(this.get("summaryFields"));
                    a.distances = this.get("distances");
                    a.units = this._distanceUnitsSelect.get("value");
                    this._trafficTimeWidget.get("checked") && (a.timeOfDay = this._trafficTimeWidget.get("timeOfDay"),
                        "UTC" === this._trafficTimeWidget.get("timeZoneForTimeOfDay") && (a.timeZoneForTimeOfDay = this._trafficTimeWidget.get("timeZoneForTimeOfDay")));
                    a.returnBoundaries = this.get("returnBoundaries");
                    this.returnFeatureCollection || (a.OutputName = h.toJson({
                        serviceProperties: {
                            name: this._outputLayerInput.get("value")
                        }
                    }));
                    a.sumShape = this._sumMetricCheck.get("checked");
                    if ("esriGeometryPoint" !== c.geometryType || "esriGeometryMultipoint" !== c.geometryType) a.shapeUnits = this.get("shapeUnits");
                    "0" !== this._groupBySelect.get("value") &&
                        (a.groupByField = this._groupBySelect.get("value"), this.resultParameter = ["resultLayer", "groupBySummary"], a.minorityMajority = this.get("minorityMajority"), a.percentPoints = this.get("percentPoints"));
                    this.showChooseExtent && this._useExtentCheck.get("checked") && (a.context = h.toJson({
                        extent: this.map.extent._normalize(!0)
                    }));
                    this.returnFeatureCollection && (f = {
                        outSR: this.map.spatialReference
                    }, this.showChooseExtent && (f.extent = this.map.extent._normalize(!0)), a.context = h.toJson(f));
                    b.jobParams = a;
                    this._saveBtn.set("disabled", !1);
                    b.itemParams = {
                        description: k.substitute(this.i18n.itemDescription, {
                            sumNearbyLayerName: this.sumNearbyLayer.name,
                            summaryLayerName: c.name
                        }),
                        tags: k.substitute(this.i18n.itemTags, {
                            sumNearbyLayerName: this.sumNearbyLayer.name,
                            summaryLayerName: c.name
                        }),
                        snippet: this.i18n.itemSnippet
                    };
                    this.showSelectFolder && (b.itemParams.folder = this.get("folderId"));
                    this.execute(b)
                }
        },
        _initializeShapeUnits: function(a) {
            this._prevGeometryType && this._prevGeometryType === a || (this._shapeUnitsSelect.removeOption(this._shapeUnitsSelect.getOptions()),
                l.set(this._shapeUnitsSelect.domNode, "display", "esriGeometryPoint" === a || "esriGeometryMultipoint" === a ? "none" : ""), "esriGeometryPolygon" === a ? (this._shapeUnitsSelect.addOption([{
                        value: "SquareMiles",
                        label: this.i18n.sqMiles
                    }, {
                        value: "SquareKilometers",
                        label: this.i18n.sqKm
                    }, {
                        value: "SquareMeters",
                        label: this.i18n.sqMeters
                    }, {
                        value: "Hectares",
                        label: this.i18n.hectares
                    }, {
                        value: "Acres",
                        label: this.i18n.acres
                    }]), "Kilometers" === this.units && !this.shapeUnits ? this.shapeUnits = "SquareKilometers" : "Kilometers" === this.get("shapeUnits") &&
                    this.set("shapeUnits", "SquareKilometers")) : "esriGeometryPolyline" === a && (this._shapeUnitsSelect.addOption([{
                    value: "Miles",
                    label: this.i18n.miles
                }, {
                    value: "Feet",
                    label: this.i18n.feet
                }, {
                    value: "Kilometers",
                    label: this.i18n.kilometers
                }, {
                    value: "Meters",
                    label: this.i18n.meters
                }, {
                    value: "Yards",
                    label: this.i18n.yards
                }]), "Kilometers" === this.units && !this.shapeUnits ? this.shapeUnits = "Kilometers" : "SquareKilometers" === this.get("shapeUnits") && this.set("shapeUnits", "Kilometers")), this._shapeUnitsSelect.set("value", this.get("shapeUnits")),
                this._prevGeometryType = a)
        },
        _handleLayerChange: function(a) {
            a = this.summaryLayers[a];
            this.outputLayerName = k.substitute(this.i18n.outputLayerName, {
                summaryLayerName: a.name,
                sumNearbyLayerName: this.sumNearbyLayer.name
            });
            this._outputLayerInput.set("value", this.outputLayerName);
            d.set(this._addStatsLabel, "innerHTML", k.substitute(this.i18n.addStats, {
                summaryLayerName: a.name
            }));
            this._initializeShapeUnits(a.geometryType);
            "esriGeometryPolygon" === a.geometryType && (d.set(this._sumMetricLabel, "innerHTML", this.i18n.summarizeMetricPoly),
                d.set(this._addStatsHelpLink, "esriHelpTopic", "StatisticsPolygon"));
            if ("esriGeometryPoint" === a.geometryType || "esriGeometryMultipoint" === a.geometryType) d.set(this._sumMetricLabel, "innerHTML", this.i18n.summarizeMetricPoint), d.set(this._addStatsHelpLink, "esriHelpTopic", "StatisticsPoint");
            "esriGeometryPolyline" === a.geometryType && (d.set(this._sumMetricLabel, "innerHTML", this.i18n.summarizeMetricLine), d.set(this._addStatsHelpLink, "esriHelpTopic", "StatisticsLine"));
            this.set("groupBySelect", this.groupByField);
            this._removeStatsRows();
            this._createStatsRow()
        },
        _handleAttrSelectChange: function(a) {
            var b;
            "0" !== a && (a = this.get("statisticSelect"), "0" !== a.get("value") && !a.get("isnewRowAdded") && (b = a.get("removeTd"), l.set(b, "display", "block"), b = a.get("referenceWidget"), e.hitch(b, b._createStatsRow()), b._sumMetricCheck.set("disabled", !1), a.set("isnewRowAdded", !0)))
        },
        _handleStatsValueUpdate: function(a, b, c) {
            this.get("attributeSelect") && (a = this.get("attributeSelect"), "0" !== a.get("value") && "0" !== c && !this.get("isnewRowAdded") &&
                (c = this.get("removeTd"), l.set(c, "display", "block"), c = this.get("referenceWidget"), e.hitch(c, c._createStatsRow()), c._sumMetricCheck.set("disabled", !1), this.set("isnewRowAdded", !0)))
        },
        _handleDistValueChange: function(a) {
            this.set("outputLayerName")
        },
        _handleDistUnitsChange: function(a) {
            this.set("outputLayerName");
            this.set("units", a)
        },
        _handleShapeUnitsChange: function(a) {
            this.set("shapeUnits", a)
        },
        _handleDistanceTypeChange: function(a) {
            this.set("nearType", a);
            var b = -1 !== a.indexOf("Time");
            a = "DrivingTime" === a;
            l.set(this._useTrafficRow, "display", a ? "" : "none");
            this._trafficTimeWidget.set("disabled", !a);
            this._trafficTimeWidget.set("reset", !a);
            b ? (this._distanceUnitsSelect.removeOption(this._distanceUnitsSelect.getOptions()), this._distanceUnitsSelect.addOption([{
                value: "Seconds",
                label: this.i18n.seconds
            }, {
                value: "Minutes",
                label: this.i18n.minutes,
                selected: "selected"
            }, {
                value: "Hours",
                label: this.i18n.hours
            }]), this.set("units", this._distanceUnitsSelect.get("value"))) : (this.get("units") && this.set("units", this.get("units")),
                this._distanceUnitsSelect.removeOption(this._distanceUnitsSelect.getOptions()), this._distanceUnitsSelect.addOption([{
                    value: "Miles",
                    label: this.i18n.miles
                }, {
                    value: "Yards",
                    label: this.i18n.yards
                }, {
                    value: "Feet",
                    label: this.i18n.feet
                }, {
                    type: "separator"
                }, {
                    value: "Kilometers",
                    label: this.i18n.kilometers
                }, {
                    value: "Meters",
                    label: this.i18n.meters
                }]), this._distanceUnitsSelect.set("value", this.units));
            this.set("outputLayerName")
        },
        _handleGroupBySelectChange: function(a) {
            a = "0" === a;
            s.toggle(this._minmajorityLabel, "esriAnalysisTextDisabled",
                a);
            s.toggle(this._percentPointsLabel, "esriAnalysisTextDisabled", a);
            this._percentPointsCheck.set("disabled", a);
            this._minmajorityCheck.set("disabled", a)
        },
        _save: function() {},
        _buildUI: function() {
            var a;
            p.initHelpLinks(this.domNode, this.showHelp);
            this.distances ? this._breakValuesInput.set("value", this.distances.toString().replace(/,/g, " ")) : (this.distances = [], this.distances.push(this._breakValuesInput.get("value")));
            this.get("enableTravelModes") || this._updateTravelModes(this.enableTravelModes);
            this.sumNearbyLayer &&
                (d.set(this._aggregateToolDescription, "innerHTML", k.substitute(this.i18n.summarizeDefine, {
                    sumNearbyLayerName: this.sumNearbyLayer.name
                })), "esriGeometryPoint" !== this.sumNearbyLayer.geometryType && (this.set("enableTravelModes", !1), this._updateTravelModes(!1)));
            this.units && this._distanceUnitsSelect.set("value", this.units);
            this.summaryLayers && g.forEach(this.summaryLayers, function(a, c) {
                a !== this.sumNearbyLayer && (this._layersSelect.addOption({
                        value: c,
                        label: a.name
                    }), this.summaryLayer && this.summaryLayer === a &&
                    this._layersSelect.set("value", c))
            }, this);
            a = this.summaryLayers[this._layersSelect.get("value")];
            this.outputLayerName = k.substitute(this.i18n.outputLayerName, {
                summaryLayerName: a.name,
                sumNearbyLayerName: this.sumNearbyLayer.name
            });
            d.set(this._addStatsLabel, "innerHTML", k.substitute(this.i18n.addStats, {
                summaryLayerName: a.name
            }));
            this._initializeShapeUnits(a.geometryType);
            this.shapeUnits && this._shapeUnitsSelect.set("value", this.shapeUnits);
            "esriGeometryPolygon" === a.geometryType && (d.set(this._sumMetricLabel,
                "innerHTML", this.i18n.summarizeMetricPoly), d.set(this._addStatsHelpLink, "esriHelpTopic", "StatisticsPolygon"));
            if ("esriGeometryPoint" === a.geometryType || "esriGeometryMultipoint" === a.geometryType) d.set(this._sumMetricLabel, "innerHTML", this.i18n.summarizeMetricPoint), d.set(this._addStatsHelpLink, "esriHelpTopic", "StatisticsPoint");
            "esriGeometryPolyline" === a.geometryType && (d.set(this._sumMetricLabel, "innerHTML", this.i18n.summarizeMetricLine), d.set(this._addStatsHelpLink, "esriHelpTopic", "StatisticsLine"));
            this.outputLayerName && this._outputLayerInput.set("value", this.outputLayerName);
            !this.sumShape && this.summaryFields && this._sumMetricCheck.set("checked", this.sumShape);
            this._createStatsRow();
            g.forEach(this.summaryFields, function(a) {
                a = a.split(" ");
                this._currentAttrSelect.set("value", a[0]);
                e.hitch(this._currentAttrSelect, this._handleAttrSelectChange, a[0])();
                this._currentStatsSelect.set("value", a[1]);
                e.hitch(this._currentStatsSelect, this._handleStatsValueUpdate, "value", "", a[1])()
            }, this);
            l.set(this._chooseFolderRow,
                "display", !0 === this.showSelectFolder ? "block" : "none");
            this.showSelectFolder && this.getFolderStore().then(e.hitch(this, function(a) {
                this.folderStore = a;
                p.setupFoldersUI({
                    folderStore: this.folderStore,
                    folderId: this.folderId,
                    folderName: this.folderName,
                    folderSelect: this._webMapFolderSelect,
                    username: this.portalUser ? this.portalUser.username : ""
                })
            }));
            l.set(this._chooseExtentDiv, "display", !0 === this.showChooseExtent ? "inline-block" : "none");
            this.set("groupBySelect", this.groupByField);
            this.minorityMajority && this._minmajorityCheck.set("checked",
                this.minorityMajority);
            this.percentPoints && this._percentPointsCheck.set("checked", this.percentPoints);
            this._handleDistanceTypeChange("StraightLine");
            this._loadConnections()
        },
        validateDistance: function() {
            var a = this,
                b, c = [],
                f, d;
            this.set("distances");
            b = e.trim(this._breakValuesInput.get("value")).split(" ");
            if (0 === b.length) return !1;
            g.forEach(b, function(b) {
                b = q.parse(b);
                if (isNaN(b)) return c.push(0), !1;
                f = q.format(b, {
                    locale: "root"
                });
                r.isDefined(f) ? r.isDefined(f) || (f = q.format(b, {
                    locale: "en-us"
                })) : f = q.format(b, {
                    locale: "en"
                });
                r.isDefined(f) && (d = e.trim(f).match(/\D/g));
                d && g.forEach(d, function(b) {
                    "." === b || "," === b ? c.push(1) : "-" === b && "polygon" === a.inputType ? c.push(1) : c.push(0)
                })
            });
            return -1 !== g.indexOf(c, 0) ? !1 : !0
        },
        _loadConnections: function() {
            this.on("start", e.hitch(this, "_onClose", !0));
            this._connect(this._closeBtn, "onclick", e.hitch(this, "_onClose", !1));
            this._driveTimeClickHandles = [];
            this._driveTimeClickHandles.push(n.connect(this._nearTypeSelect, "onChange", e.hitch(this, "_handleDistanceTypeChange")));
            this.watch("enableTravelModes",
                e.hitch(this, function(a, b, c) {
                    this._updateTravelModes(c)
                }))
        },
        _createStatsRow: function() {
            var a, b, c, f, d;
            f = this.summaryLayers[this._layersSelect.get("value")];
            a = m.create("tr", null, this._afterStatsRow, "before");
            c = m.create("td", {
                style: {
                    width: "45%",
                    maxWidth: "100px"
                }
            }, a);
            b = m.create("td", {
                style: {
                    width: "55%",
                    maxWidth: "104px"
                }
            }, a);
            c = new x({
                maxHeight: 200,
                "class": "esriLeadingMargin1 mediumInput esriTrailingMargin05 attrSelect",
                style: {
                    tableLayout: "fixed",
                    overflowX: "hidden"
                }
            }, m.create("select", null, c));
            this.set("attributes", {
                selectWidget: c,
                summaryLayer: f
            });
            b = new x({
                "class": "mediumInput statsSelect",
                style: {
                    tableLayout: "fixed",
                    overflowX: "hidden"
                }
            }, m.create("select", null, b));
            this.set("statistics", {
                selectWidget: b
            });
            c.set("statisticSelect", b);
            n.connect(c, "onChange", this._handleAttrSelectChange);
            d = m.create("td", {
                "class": "shortTextInput removeTd",
                style: {
                    display: "none",
                    maxWidth: "12px"
                }
            }, a);
            f = m.create("a", {
                    title: this.i18n.removeAttrStats,
                    "class": "closeIcon statsRemove",
                    innerHTML: "\x3cimg src\x3d'" + this.basePath + "/images/close.gif' border\x3d'0''/\x3e"
                },
                d);
            n.connect(f, "onclick", e.hitch(this, this._handleRemoveStatsBtnClick, a));
            this._statsRows.push(a);
            b.set("attributeSelect", c);
            b.set("removeTd", d);
            b.set("isnewRowAdded", !1);
            b.set("referenceWidget", this);
            b.watch("value", this._handleStatsValueUpdate);
            this._currentStatsSelect = b;
            this._currentAttrSelect = c;
            return !0
        },
        _handleRemoveStatsBtnClick: function(a) {
            this._removeStatsRow(a);
            0 === this.get("summaryFields").length && (this._sumMetricCheck.set("disabled", !0), this._sumMetricCheck.set("checked", !0))
        },
        _removeStatsRows: function() {
            g.forEach(this._statsRows,
                this._removeStatsRow, this);
            this._statsRows = []
        },
        _removeStatsRow: function(a) {
            g.forEach(w.findWidgets(a), function(a) {
                a.destroyRecursive()
            });
            m.destroy(a)
        },
        _setAnalysisGpServerAttr: function(a) {
            a && (this.analysisGpServer = a, this.set("toolServiceUrl", this.analysisGpServer + "/" + this.toolName))
        },
        _setSumNearbyLayerAttr: function(a) {
            this.sumNearbyLayer = a
        },
        _setSummaryLayersAttr: function(a) {
            this.summaryLayers = a
        },
        _setSummaryLayerAttr: function(a) {
            this.summaryLayer = a
        },
        _setLayersAttr: function(a) {
            this.summaryLayers = []
        },
        _setAttributesAttr: function(a) {
            if (a.summaryLayer) {
                var b, c;
                b = a.summaryLayer;
                c = a.selectWidget;
                a = b.fields;
                c.addOption({
                    value: "0",
                    label: this.i18n.attribute
                });
                g.forEach(a, function(a) {
                    -1 !== g.indexOf(["esriFieldTypeSmallInteger", "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeDouble"], a.type) && c.addOption({
                        value: a.name,
                        label: r.isDefined(a.alias) && "" !== a.alias ? a.alias : a.name
                    })
                }, this)
            }
        },
        _setStatisticsAttr: function(a) {
            a = a.selectWidget;
            a.addOption({
                value: "0",
                label: this.i18n.statistic
            });
            a.addOption({
                value: "SUM",
                label: this.i18n.sum
            });
            a.addOption({
                value: "MIN",
                label: this.i18n.minimum
            });
            a.addOption({
                value: "MAX",
                label: this.i18n.maximum
            });
            a.addOption({
                value: "MEAN",
                label: this.i18n.average
            });
            a.addOption({
                value: "STDDEV",
                label: this.i18n.standardDev
            })
        },
        _setSummaryFieldsAttr: function(a) {
            this.summaryFields = a
        },
        _getSummaryFieldsAttr: function() {
            var a = "",
                b = [];
            A(".statsSelect", this.domNode).forEach(function(c) {
                var f;
                c = w.byNode(c);
                f = c.get("attributeSelect");
                "0" !== f.get("value") && "0" !== c.get("value") && (a += f.get("value") + " " +
                    c.get("value") + ";", b.push(f.get("value") + " " + c.get("value")))
            });
            return b
        },
        _setGroupBySelectAttr: function(a) {
            var b = this.summaryLayers[this._layersSelect.get("value")],
                c = b.fields;
            0 < this._groupBySelect.getOptions().length && this._groupBySelect.removeOption(this._groupBySelect.getOptions());
            this._groupBySelect.addOption({
                value: "0",
                label: this.i18n.attribute
            });
            g.forEach(c, function(a, c) {
                -1 !== g.indexOf(["esriFieldTypeSmallInteger", "esriFieldTypeInteger", "esriFieldTypeString", "esriFieldTypeDate"], a.type) &&
                    a.name !== b.objectIdField && this._groupBySelect.addOption({
                        value: a.name,
                        label: r.isDefined(a.alias) && "" !== a.alias ? a.alias : a.name
                    })
            }, this);
            a && this._groupBySelect.set("value", a);
            this._handleGroupBySelectChange(this._groupBySelect.get("value"))
        },
        _setDisableRunAnalysisAttr: function(a) {
            this._saveBtn.set("disabled", a)
        },
        _setShowSelectFolderAttr: function(a) {
            this.showSelectFolder = a
        },
        _getShowSelectFolderAttr: function() {
            return this.showSelectFolder
        },
        _setShowChooseExtentAttr: function(a) {
            this.showChooseExtent = a
        },
        _getShowChooseExtentAttr: function() {
            return this.showChooseExtent
        },
        _setMapAttr: function(a) {
            this.map = a
        },
        _getMapAttr: function() {
            return this.map
        },
        _setShowHelpAttr: function(a) {
            this.showHelp = a
        },
        _getShowHelpAttr: function() {
            return this.showHelp
        },
        _setNearTypeAttr: function(a) {
            this.nearType = a
        },
        _getNearTypeAttr: function() {
            return this.nearType
        },
        _setDistancesAttr: function(a) {
            if (a) this.distances = a;
            else if (this._breakValuesInput && this._breakValuesInput.get("value")) {
                a = e.trim(this._breakValuesInput.get("value")).split(" ");
                var b = [];
                g.forEach(a, function(a) {
                    b.push(q.parse(a))
                });
                this.distances = b
            }
        },
        _getDistancesAttr: function() {
            return this.distances
        },
        _setUnitsAttr: function(a) {
            this.units = a
        },
        _getUnitsAttr: function() {
            return this.units
        },
        _setShapeUnitsAttr: function(a) {
            this.shapeUnits = a
        },
        _getShapeUnitsAttr: function() {
            return this.shapeUnits
        },
        _getSumShapeAttr: function() {
            return this._sumMetricCheck.get("checked")
        },
        _setSumShapeAttr: function(a) {
            this.sumShape = a
        },
        _setMinorityMajorityAttr: function(a) {
            this.minorityMajority = a
        },
        _getMinorityMajorityAttr: function(a) {
            this._minmajorityCheck &&
                (this.minorityMajority = this._minmajorityCheck.get("checked"));
            return this.minorityMajority
        },
        _setPercentPointsAttr: function(a) {
            this.percentPoints = a
        },
        _getPercentPointsAttr: function(a) {
            this._percentPointsCheck && (this.percentPoints = this._percentPointsCheck.get("checked"));
            return this.percentPoints
        },
        _setShowCreditsAttr: function(a) {
            this.showCredits = a
        },
        _getShowCreditsAttr: function() {
            return this.showCredits
        },
        _setReturnFeatureCollectionAttr: function(a) {
            this.returnFeatureCollection = a
        },
        _getReturnFeatureCollectionAttr: function() {
            return this.returnFeatureCollection
        },
        _setEnableTravelModesAttr: function(a) {
            this._set("enableTravelModes", a)
        },
        _getReturnBoundariesAttr: function() {
            this._returnBdrycCheck && (this.returnBoundaries = this._returnBdrycCheck.get("checked"));
            return this.returnBoundaries
        },
        _setReturnBoundariesAttr: function(a) {
            this.returnBoundaries = a
        },
        _setFolderIdAttr: function(a) {
            this.folderId = a
        },
        _getFolderIdAttr: function() {
            this._webMapFolderSelect && (this.folderStore && this._webMapFolderSelect.item) && (this.folderId = this._webMapFolderSelect.item ? this.folderStore.getValue(this._webMapFolderSelect.item,
                "id") : "");
            return this.folderId
        },
        _setFolderNameAttr: function(a) {
            this.folderName = a
        },
        _getFolderNameAttr: function() {
            this._webMapFolderSelect && (this.folderStore && this._webMapFolderSelect.item) && (this.folderName = this.folderStore.getValue(this._webMapFolderSelect.item, "name"));
            return this.folderName
        },
        validateServiceName: function(a) {
            var b = /(:|&|<|>|%|#|\?|\\|\"|\/|\+)/.test(a);
            return 0 === a.length || 0 === k.trim(a).length ? (this._outputLayerInput.set("invalidMessage", this.i18n.requiredValue), !1) : b ? (this._outputLayerInput.set("invalidMessage",
                this.i18n.invalidServiceName), !1) : 98 < a.length ? (this._outputLayerInput.set("invalidMessage", this.i18n.invalidServiceNameLength), !1) : !0
        },
        _connect: function(a, b, c) {
            this._pbConnects.push(n.connect(a, b, c))
        },
        _showMessages: function(a) {
            d.set(this._bodyNode, "innerHTML", a);
            u.fadeIn({
                node: this._errorMessagePane,
                easing: v.quadIn,
                onEnd: e.hitch(this, function() {
                    l.set(this._errorMessagePane, {
                        display: ""
                    })
                })
            }).play()
        },
        _handleCloseMsg: function(a) {
            a && a.preventDefault();
            u.fadeOut({
                node: this._errorMessagePane,
                easing: v.quadOut,
                onEnd: e.hitch(this, function() {
                    l.set(this._errorMessagePane, {
                        display: "none"
                    })
                })
            }).play()
        },
        _updateTravelModes: function(a) {
            var b = this._nearTypeSelect.getOptions();
            g.forEach(b, function(b) {
                "StraightLine" !== b.value && (b.disabled = !a)
            });
            this._nearTypeSelect.updateOption(b)
        }
    })
});