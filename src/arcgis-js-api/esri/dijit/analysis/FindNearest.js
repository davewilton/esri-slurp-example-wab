//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/json", "dojo/has", "dojo/json", "dojo/string", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "dojo/query", "dojo/dom-class", "dojo/number", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/_OnDijitClickMixin", "dijit/_FocusMixin", "dijit/registry", "dijit/form/Button", "dijit/form/CheckBox", "dijit/form/Form", "dijit/form/Select", "dijit/form/TextBox", "dijit/form/ValidationTextBox", "dijit/layout/ContentPane", "dijit/form/ComboBox", "dijit/form/NumberSpinner", "dijit/form/NumberTextBox", "../../kernel", "./AnalysisBase", "./CreditEstimator", "./utils", "./TrafficTime", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/FindNearest.html"], function(p, q, c, k, l, e, z, A, f, h, n, B, C, r, D, s, t, u, v, w, E, F, G, H, I, J, K, L, M, N, O, P, x, Q, g, R, m, y) {
    return q([s, t, u, v, w, x], {
        declaredClass: "esri.dijit.analysis.FindNearest",
        templateString: y,
        basePath: p.toUrl("."),
        widgetsInTemplate: !0,
        analysisLayer: null,
        nearLayers: null,
        summaryFields: null,
        outputLayerName: null,
        nearLayer: null,
        searchCutoff: 100,
        searchCutoffUnits: "Miles",
        measurementType: "StraightLine",
        maxCount: 1,
        returnFeatureCollection: !1,
        showSelectFolder: !1,
        showChooseExtent: !0,
        showCredits: !0,
        enableTravelModes: !0,
        showHelp: !0,
        i18n: null,
        toolName: "FindNearest",
        helpFileName: "FindNearest",
        resultParameter: ["nearestLayer", "connectingLinesLayer"],
        _timeObj: null,
        constructor: function(a) {
            this._pbConnects = [];
            this._statsRows = [];
            this._timeObj = {
                hours: 1,
                minutes: 0,
                seconds: 0
            };
            a.containerNode && (this.container = a.containerNode)
        },
        destroy: function() {
            this.inherited(arguments);
            k.forEach(this._pbConnects, l.disconnect);
            delete this._pbConnects;
            this._driveTimeClickHandles && 0 < this._driveTimeClickHandles.length && (k.forEach(this._driveTimeClickHandles,
                l.disconnect), this._driveTimeClickHandles = null)
        },
        postMixInProperties: function() {
            this.inherited(arguments);
            c.mixin(this.i18n, m.bufferTool);
            c.mixin(this.i18n, m.driveTimes);
            c.mixin(this.i18n, m.FindNearestTool)
        },
        postCreate: function() {
            this.inherited(arguments);
            r.add(this._form.domNode, "esriSimpleForm");
            this._outputLayerInput.set("validator", c.hitch(this, this.validateServiceName, this._outputLayerInput));
            this._hoursInput.set("validator", c.hitch(this, this.validateTime, "hours"));
            this._minutesInput.set("validator",
                c.hitch(this, this.validateTime, "minutes"));
            this._secondsInput.set("validator", c.hitch(this, this.validateTime, "seconds"));
            this._buildUI()
        },
        startup: function() {},
        _onClose: function(a) {
            a && (this._save(), this.emit("save", {
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
                b = this.nearLayers[this._layersSelect.get("value")];
                a.nearLayer = e.toJson(g.constructAnalysisInputLyrObj(b));
                a.measurementType = this.get("measurementType");
                a.analysisLayer =
                    e.toJson(g.constructAnalysisInputLyrObj(this.analysisLayer));
                !0 === this._searchCutoffInput.get("value") ? (a.searchCutoff = this.get("searchCutoff"), -1 !== this.get("measurementType").indexOf("Time") ? a.searchCutoffUnits = "Minutes" : a.searchCutoffUnits = this.get("searchCutoffUnits")) : a.searchCutoff = null;
                !0 === this._limitSearchRangeCheck.get("value") ? a.maxCount = this.get("maxCount") : a.maxCount = null;
                this._trafficTimeWidget.get("checked") && (a.timeOfDay = this._trafficTimeWidget.get("timeOfDay"), "UTC" === this._trafficTimeWidget.get("timeZoneForTimeOfDay") &&
                    (a.timeZoneForTimeOfDay = this._trafficTimeWidget.get("timeZoneForTimeOfDay")));
                this.returnFeatureCollection || (a.OutputName = e.toJson({
                    serviceProperties: {
                        name: this._outputLayerInput.get("value")
                    }
                }));
                this.showChooseExtent && this._useExtentCheck.get("checked") && (a.context = e.toJson({
                    extent: this.map.extent._normalize(!0)
                }));
                this.getCreditsEstimate(this.toolName, a).then(c.hitch(this, function(a) {
                    this._usageForm.set("content", a);
                    this._usageDialog.show()
                }))
            }
        },
        _handleSaveBtnClick: function() {
            if (this._form.validate()) {
                this._saveBtn.set("disabled", !0);
                var a = {},
                    b = {},
                    d, c;
                d = this.nearLayers[this._layersSelect.get("value")];
                a.nearLayer = e.toJson(g.constructAnalysisInputLyrObj(d));
                a.measurementType = this.get("measurementType");
                a.analysisLayer = e.toJson(g.constructAnalysisInputLyrObj(this.analysisLayer));
                this._limitSearchRangeCheck.get("checked") ? (a.searchCutoff = this.get("searchCutoff"), -1 === this.get("measurementType").indexOf("Time") && (a.searchCutoffUnits = this.get("searchCutoffUnits"))) : a.searchCutoff = null;
                this._findNearestCheck.get("checked") ? a.maxCount =
                    this.get("maxCount") : a.maxCount = null;
                this._trafficTimeWidget.get("checked") && (a.timeOfDay = this._trafficTimeWidget.get("timeOfDay"), "UTC" === this._trafficTimeWidget.get("timeZoneForTimeOfDay") && (a.timeZoneForTimeOfDay = this._trafficTimeWidget.get("timeZoneForTimeOfDay")));
                this.returnFeatureCollection || (a.OutputName = e.toJson({
                    serviceProperties: {
                        name: this._outputLayerInput.get("value")
                    }
                }));
                this.showChooseExtent && this._useExtentCheck.get("checked") && (a.context = e.toJson({
                    extent: this.map.extent._normalize(!0)
                }));
                this.returnFeatureCollection && (c = {
                    outSR: this.map.spatialReference
                }, this.showChooseExtent && (c.extent = this.map.extent._normalize(!0)), a.context = e.toJson(c));
                b.jobParams = a;
                this._saveBtn.set("disabled", !1);
                b.itemParams = {
                    description: f.substitute(this.i18n.itemDescription, {
                        sumNearbyLayerName: this.analysisLayer.name,
                        summaryLayerName: d.name
                    }),
                    tags: f.substitute(this.i18n.itemTags, {
                        sumNearbyLayerName: this.analysisLayer.name,
                        summaryLayerName: d.name
                    }),
                    snippet: this.i18n.itemSnippet
                };
                this.showSelectFolder && (b.itemParams.folder =
                    this.get("folderId"));
                console.log(b);
                this.execute(b)
            }
        },
        _handleLayerChange: function(a) {
            this.outputLayerName = f.substitute(this.i18n.outputLayerName, {
                layer: this.nearLayers[a].name,
                sumNearbyLayerName: this.analysisLayer.name
            });
            this._outputLayerInput.set("value", this.outputLayerName)
        },
        _handleLimitSearchCheckChange: function(a) {
            -1 !== this.get("measurementType").indexOf("Time") ? (this._hoursInput.set("disabled", !a), this._minutesInput.set("disabled", !a), this._secondsInput.set("disabled", !a)) : (this._distanceUnitsSelect.set("disabled", !a), this._searchCutoffInput.set("disabled", !a))
        },
        _handleFindNearestCheckChange: function(a) {
            this._maxCountInput.set("disabled", !a)
        },
        _handleTimeUnitsChange: function(a) {},
        _handleDistValueChange: function(a) {
            this.set("outputLayerName")
        },
        _handleDistUnitsChange: function(a) {
            this.set("outputLayerName");
            console.log("setting", a);
            this.set("searchCutoffUnits", a)
        },
        _handleDistanceTypeChange: function(a) {
            var b = -1 !== a.indexOf("Time"),
                d = "DrivingTime" === a;
            this.set("measurementType", a);
            h.set(this._useTrafficRow, "display",
                d ? "" : "none");
            h.set(this._distanceLimitRow, "display", d ? "none" : "");
            h.set(this._timeLimitRow, "display", d ? "" : "none");
            this._trafficTimeWidget.set("disabled", "DrivingTime" !== a);
            this._trafficTimeWidget.set("reset", "DrivingTime" !== a);
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
            }])) : (this.get("searchCutoffUnits") &&
                this.set("searchCutoffUnits", this.get("searchCutoffUnits")), this._distanceUnitsSelect.removeOption(this._distanceUnitsSelect.getOptions()), this._distanceUnitsSelect.addOption([{
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
                }]), "StraightLine" === a && this._distanceUnitsSelect.addOption([{
                    type: "separator"
                }, {
                    value: "NauticalMiles",
                    label: this.i18n.nautMiles
                }]),
                this._distanceUnitsSelect.set("value", this.searchCutoffUnits));
            this.set("outputLayerName")
        },
        _save: function() {},
        _buildUI: function() {
            g.initHelpLinks(this.domNode, this.showHelp);
            this.get("enableTravelModes") || this._updateTravelModes(this.enableTravelModes);
            this.analysisLayer && (n.set(this._aggregateToolDescription, "innerHTML", f.substitute(this.i18n.summarizeDefine, {
                    sumNearbyLayerName: this.analysisLayer.name
                })), n.set(this._forLocationLabel, "innerHTML", f.substitute(this.i18n.forEachLocationLabel, {
                    sumNearbyLayerName: this.analysisLayer.name
                })),
                "esriGeometryPoint" !== this.analysisLayer.geometryType && (this.set("enableTravelModes", !1), this._updateTravelModes(!1)));
            this.nearLayers && k.forEach(this.nearLayers, function(a, b) {
                    a !== this.analysisLayer && (this._layersSelect.addOption({
                        value: b,
                        label: a.name
                    }), this.outputLayerName || (this.outputLayerName = f.substitute(this.i18n.outputLayerName, {
                        layer: a.name,
                        sumNearbyLayerName: this.analysisLayer.name
                    }), this.outputLinesLayerName = f.substitute(this.i18n.outputConnectingLayerName, {
                        layer: a.name,
                        sumNearbyLayerName: this.analysisLayer.name
                    })))
                },
                this);
            this.outputLayerName && this._outputLayerInput.set("value", this.outputLayerName);
            this.nearLayer && this._layersSelect.set();
            h.set(this._chooseFolderRow, "display", !0 === this.showSelectFolder ? "block" : "none");
            this.showSelectFolder && this.getFolderStore().then(c.hitch(this, function(a) {
                this.folderStore = a;
                g.setupFoldersUI({
                    folderStore: this.folderStore,
                    folderId: this.folderId,
                    folderName: this.folderName,
                    folderSelect: this._webMapFolderSelect,
                    username: this.portalUser ? this.portalUser.username : ""
                })
            }));
            h.set(this._chooseExtentDiv,
                "display", !0 === this.showChooseExtent ? "inline-block" : "none");
            this.measurementType && -1 === this.measurementType.indexOf("Time") ? (this.searchCutoffUnits && this._distanceUnitsSelect.set("value", this.searchCutoffUnits), this.searchCutoff && this._searchCutoffInput.set("value", this.searchCutoff)) : this.measurementType && -1 !== this.measurementType.indexOf("Time") && this._timeObj !== this.searchCutoff && (this._hoursInput.set("value", parseInt(this.searchCutoff.hours, 10)), this._minutesInput.set("value", parseInt(this.searchCutoff.minutes,
                10)), this._secondsInput.set("value", parseInt(this.searchCutoff.seconds, 10)), this._timeObj.hours = parseInt(this.searchCutoff.hours, 10), this._timeObj.minutes = parseInt(this.searchCutoff.minutes, 10), this._timeObj.seconds = parseInt(this.searchCutoff.seconds, 10));
            this._handleDistanceTypeChange(this.measurementType);
            this.maxCount && this._maxCountInput.set("value", this.maxCount);
            this._loadConnections()
        },
        _loadConnections: function() {
            this.on("start", c.hitch(this, "_onClose", !0));
            this._connect(this._closeBtn, "onclick",
                c.hitch(this, "_onClose", !1));
            this._connect(this._measureMethodSelect, "onChange", c.hitch(this, "_handleDistanceTypeChange"));
            this.watch("enableTravelModes", c.hitch(this, function(a, b, d) {
                this._updateTravelModes(d)
            }))
        },
        _setAnalysisGpServerAttr: function(a) {
            a && (this.analysisGpServer = a, this.set("toolServiceUrl", this.analysisGpServer + "/" + this.toolName))
        },
        _setAnalysisLayerAttr: function(a) {
            this.analysisLayer = a
        },
        _getAnalysisLayerAttr: function(a) {
            return this.analysisLayer
        },
        _setNearLayersAttr: function(a) {
            this.nearLayers =
                a
        },
        _setLayersAttr: function(a) {
            this.nearLayers = []
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
        _setSearchCutoffUnitsAttr: function(a) {
            this.searchCutoffUnits = a
        },
        _getSearchCutoffUnitsAttr: function() {
            return this.searchCutoffUnits
        },
        _setMeasurementTypeAttr: function(a) {
            this.measurementType = a
        },
        _getMeasurementTypeAttr: function() {
            return this.measurementType
        },
        _getSearchCutoffAttr: function() {
            this.measurementType && "DrivingTime" === this.measurementType ? this._timeObj && (this.searchCutoff = 60 * this._timeObj.hours + this._timeObj.minutes + this._timeObj.seconds / 60) : this.searchCutoff = this._searchCutoffInput.get("value");
            return this.searchCutoff
        },
        _setSearchCutoffAttr: function(a) {
            a && (this.searchCutoff = a)
        },
        _getMaxCountAttr: function() {
            return this.maxCount = this._maxCountInput.get("value")
        },
        _setMaxCountAttr: function(a) {
            this.maxCount = a
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
            this._set("enableTravelModes",
                a)
        },
        _setFolderIdAttr: function(a) {
            this.folderId = a
        },
        _getFolderIdAttr: function() {
            this._webMapFolderSelect && (this.folderStore && this._webMapFolderSelect.item) && (this.folderId = this._webMapFolderSelect.item ? this.folderStore.getValue(this._webMapFolderSelect.item, "id") : "");
            return this.folderId
        },
        _setFolderNameAttr: function(a) {
            this.folderName = a
        },
        _getFolderNameAttr: function() {
            this._webMapFolderSelect && (this.folderStore && this._webMapFolderSelect.item) && (this.folderName = this.folderStore.getValue(this._webMapFolderSelect.item,
                "name"));
            return this.folderName
        },
        validateServiceName: function(a, b) {
            var d = /(:|&|<|>|%|#|\?|\\|\"|\/|\+)/.test(b);
            return 0 === b.length || 0 === f.trim(b).length ? (this._outputLayerInput.set("invalidMessage", this.i18n.requiredValue), !1) : d ? (this._outputLayerInput.set("invalidMessage", this.i18n.invalidServiceName), !1) : 98 < b.length ? (this._outputLayerInput.set("invalidMessage", this.i18n.invalidServiceNameLength), !1) : !0
        },
        validateTime: function(a, b) {
            var d = !0,
                c;
            c = parseInt(b, 10);
            "hours" === a ? this._timeObj.hours = c : "minutes" ===
                a ? this._timeObj.minutes = c : "seconds" === a && (this._timeObj.seconds = c);
            0 === this._timeObj.hours && (0 === this._timeObj.minutes && 0 === this._timeObj.seconds) && (d = !1);
            return d
        },
        _connect: function(a, b, c) {
            this._pbConnects.push(l.connect(a, b, c))
        },
        _updateTravelModes: function(a) {
            var b = this._measureMethodSelect.getOptions();
            k.forEach(b, function(b) {
                "StraightLine" !== b.value && (b.disabled = !a)
            });
            this._measureMethodSelect.updateOption(b)
        }
    })
});