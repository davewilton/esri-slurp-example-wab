//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/json", "dojo/_base/fx", "dojo/has", "dojo/json", "dojo/string", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "dojo/query", "dojo/dom-class", "dojo/fx/easing", "dojo/number", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/_OnDijitClickMixin", "dijit/_FocusMixin", "dijit/registry", "dijit/form/Button", "dijit/form/CheckBox", "dijit/form/Form", "dijit/form/Select", "dijit/form/TextBox", "dijit/form/ValidationTextBox", "dijit/layout/ContentPane", "dijit/form/ComboBox", "../../kernel", "../../lang", "./AnalysisBase", "./CreditEstimator", "./utils", "./TrafficTime", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/ConnectOriginsToDestinations.html"], function(s, t, c, g, n, f, p, C, D, k, d, q, E, F, u, r, G, v, w, x, y, z, H, I, J, K, L, M, N, O, P, Q, l, A, R, h, S, m, B) {
    return t([v, w, x, y, z, A], {
        declaredClass: "esri.dijit.analysis.ConnectOriginsToDestinations",
        templateString: B,
        basePath: s.toUrl("."),
        widgetsInTemplate: !0,
        originsLayer: null,
        destinationsLayer: null,
        measurementType: "DrivingTime",
        outputLayerName: null,
        showSelectFolder: !1,
        showChooseExtent: !0,
        showHelp: !0,
        showCredits: !0,
        distanceDefaultUnits: "Miles",
        returnFeatureCollection: !1,
        originsLayerRouteIDField: null,
        destinationsLayerRouteIDField: null,
        enableTravelModes: !0,
        i18n: null,
        toolName: "ConnectOriginsToDestinations",
        helpFileName: "ConnectOriginsToDestinations",
        resultParameter: ["routesLayer", "unassignedOriginsLayer", "unassignedDestinationsLayer"],
        constructor: function(a, b) {
            this._pbConnects = [];
            a.containerNode && (this.container = a.containerNode)
        },
        destroy: function() {
            this.inherited(arguments);
            g.forEach(this._pbConnects, n.disconnect);
            delete this._pbConnects
        },
        postMixInProperties: function() {
            this.inherited(arguments);
            c.mixin(this.i18n, m.common);
            c.mixin(this.i18n,
                m.bufferTool);
            c.mixin(this.i18n, m.driveTimes);
            c.mixin(this.i18n, m.routeOriginDestinationPairsTool)
        },
        postCreate: function() {
            this.inherited(arguments);
            u.add(this._form.domNode, "esriSimpleForm");
            this._outputLayerInput.set("validator", c.hitch(this, this.validateServiceName));
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
            a = {};
            this._form.validate() && (a.originsLayer =
                f.toJson(h.constructAnalysisInputLyrObj(this.originsLayer)), a.destinationsLayer = f.toJson(h.constructAnalysisInputLyrObj(this.get("destinationsLayer"))), a.measurementType = this.get("measurementType"), "none" !== d.get(this._routeIdRow, "display") && (a.originsLayerRouteIDField = this.get("originsLayerRouteIDField"), a.destinationsLayerRouteIDField = this.get("destinationsLayerRouteIDField")), this._trafficTimeWidget.get("checked") && (a.timeOfDay = this._trafficTimeWidget.get("timeOfDay"), "UTC" === this._trafficTimeWidget.get("timeZoneForTimeOfDay") &&
                    (a.timeZoneForTimeOfDay = this._trafficTimeWidget.get("timeZoneForTimeOfDay"))), this.returnFeatureCollection || (a.OutputName = f.toJson({
                    serviceProperties: {
                        name: this._outputLayerInput.get("value")
                    }
                })), this.showChooseExtent && this._useExtentCheck.get("checked") && (a.context = f.toJson({
                    extent: this.map.extent._normalize(!0)
                })), this.getCreditsEstimate(this.toolName, a).then(c.hitch(this, function(a) {
                    this._usageForm.set("content", a);
                    this._usageDialog.show()
                })))
        },
        _handleSaveBtnClick: function(a) {
            a = {};
            var b = {},
                e;
            this._form.validate() &&
                (this._saveBtn.set("disabled", !0), a.originsLayer = f.toJson(h.constructAnalysisInputLyrObj(this.originsLayer)), a.destinationsLayer = f.toJson(h.constructAnalysisInputLyrObj(this.get("destinationsLayer"))), a.measurementType = this.get("measurementType"), "none" !== d.get(this._routeIdRow, "display") && (a.originsLayerRouteIDField = this.get("originsLayerRouteIDField"), a.destinationsLayerRouteIDField = this.get("destinationsLayerRouteIDField")), this._trafficTimeWidget.get("checked") && (a.timeOfDay = this._trafficTimeWidget.get("timeOfDay"),
                    "UTC" === this._trafficTimeWidget.get("timeZoneForTimeOfDay") && (a.timeZoneForTimeOfDay = this._trafficTimeWidget.get("timeZoneForTimeOfDay"))), this.returnFeatureCollection || (a.OutputName = f.toJson({
                    serviceProperties: {
                        name: this._outputLayerInput.get("value")
                    }
                })), this.showChooseExtent && this._useExtentCheck.get("checked") && (a.context = f.toJson({
                    extent: this.map.extent._normalize(!0)
                })), this.returnFeatureCollection && (e = {
                        outSR: this.map.spatialReference
                    }, this.showChooseExtent && (e.extent = this.map.extent._normalize(!0)),
                    a.context = f.toJson(e)), b.jobParams = a, b.itemParams = {
                    description: k.substitute(this.i18n.itemDescription, {
                        layername: this.originsLayer.name,
                        distance_field: a.Distances || a.Field,
                        units: a.Units
                    }),
                    tags: k.substitute(this.i18n.itemTags, {
                        layername: this.originsLayer.name,
                        destnlayername: this.destinationsLayer.name
                    }),
                    snippet: this.i18n.itemSnippet
                }, this.showSelectFolder && (b.itemParams.folder = this.get("folderId")), this.execute(b))
        },
        _save: function() {},
        _buildUI: function() {
            h.initHelpLinks(this.domNode, this.showHelp);
            q.set(this._tripCalToolDescription, "innerHTML", k.substitute(this.i18n.toolDefine, {
                layername: this.originsLayer.name
            }));
            d.set(this._chooseFolderRow, "display", !0 === this.showSelectFolder ? "block" : "none");
            this.showSelectFolder && this.getFolderStore().then(c.hitch(this, function(a) {
                this.folderStore = a;
                h.setupFoldersUI({
                    folderStore: this.folderStore,
                    folderId: this.folderId,
                    folderName: this.folderName,
                    folderSelect: this._webMapFolderSelect,
                    username: this.portalUser ? this.portalUser.username : ""
                })
            }));
            d.set(this._chooseExtentDiv,
                "display", !0 === this.showChooseExtent ? "inline-block" : "none");
            this.get("enableTravelModes") || this._updateTravelModes(this.enableTravelModes);
            this.measurementType && (this._measureMethodSelect.set("value", this.measurementType), this._handleMeasurementTypeChange(this.measurementType));
            this.featureLayers && g.forEach(this.featureLayers, function(a, e) {
                    this._destPointLyrSelect.addOption({
                        value: e + 1,
                        label: a.name
                    });
                    this.destinationsLayer && this.destinationsLayer === a && this._destPointLyrSelect.set("value", this.destinationsLayer)
                },
                this);
            this.destinationsLayer || (this._destPointLyrSelect.set("value", 1), this.set("destinationsLayer", this.featureLayers[0]));
            this.originsLayer && this.originsLayer.graphics && 1 >= this.originsLayer.graphics.length || this.destinationsLayer && 1 >= this.destinationsLayer.graphics.length ? d.set(this._routeIdRow, "display", "none") : d.set(this._routeIdRow, "display", "table");
            if (this.originsLayer && this.originsLayer.graphics && 1 < this.originsLayer.graphics.length) {
                var a = this.originsLayer.fields;
                this._originRouteIdSelect.removeOption(this._originRouteIdSelect.getOptions());
                g.forEach(a, function(a, e) {
                    -1 !== g.indexOf(["esriFieldTypeSmallInteger", "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeString", "esriFieldTypeDate"], a.type) && this._originRouteIdSelect.addOption({
                        value: a.name,
                        label: l.isDefined(a.alias) && "" !== a.alias ? a.alias : a.name
                    })
                }, this);
                this.originsLayerRouteIDField && this._orginRouteIdSelect.set("value", this.originsLayerRouteIDField)
            }
            this._loadConnections()
        },
        _setAnalysisGpServerAttr: function(a) {
            a && (this.analysisGpServer = a, this.set("toolServiceUrl", this.analysisGpServer +
                "/" + this.toolName))
        },
        _setOriginsLayerAttr: function(a) {
            "esriGeometryPoint" === a.geometryType && (this.originsLayer = a)
        },
        _getOriginsLayerAttr: function() {
            return this.originsLayer
        },
        _setFeatureLayersAttr: function(a) {
            this.featureLayers = g.filter(a, function(a) {
                if (a !== this.originsLayer && "esriGeometryPoint" === a.geometryType) return !0
            }, this)
        },
        _getFeatureLayersAttr: function(a) {
            return this.featureLayers
        },
        _setDisableRunAnalysisAttr: function(a) {
            this._saveBtn.set("disabled", a)
        },
        validateServiceName: function(a) {
            var b = /(:|&|<|>|%|#|\?|\\|\"|\/|\+)/.test(a);
            return 0 === a.length || 0 === k.trim(a).length ? (this._outputLayerInput.set("invalidMessage", this.i18n.requiredValue), !1) : b ? (this._outputLayerInput.set("invalidMessage", this.i18n.invalidServiceName), !1) : 98 < a.length ? (this._outputLayerInput.set("invalidMessage", this.i18n.invalidServiceNameLength), !1) : !0
        },
        _setShowSelectFolderAttr: function(a) {
            this.showSelectFolder = a
        },
        _getShowSelectFolderAttr: function() {
            return this.showSelectFolder
        },
        _setMapAttr: function(a) {
            this.map = a
        },
        _getMapAttr: function() {
            return this.map
        },
        _setMeasurementTypeAttr: function(a) {
            this.measurementType = a
        },
        _getMeasurementTypeAttr: function() {
            return this.measurementType
        },
        _setDistanceDefaultUnitsAttr: function(a) {
            this.distanceDefaultUnits = a
        },
        _getDistanceDefaultUnitsAttr: function() {
            return this.distanceDefaultUnits
        },
        _setShowCreditsAttr: function(a) {
            this.showCredits = a
        },
        _getShowCreditsAttr: function() {
            return this.showCredits
        },
        _setShowChooseExtentAttr: function(a) {
            this.showChooseExtent = a
        },
        _getShowChooseExtentAttr: function() {
            return this.showChooseExtent
        },
        _setReturnFeatureCollectionAttr: function(a) {
            this.returnFeatureCollection = a
        },
        _getReturnFeatureCollectionAttr: function() {
            return this.returnFeatureCollection
        },
        _setShowHelpAttr: function(a) {
            this.showHelp = a
        },
        _getShowHelpAttr: function() {
            return this.showHelp
        },
        _setDestinationsLayerAttr: function(a) {
            this.destinationsLayer = a
        },
        _getDestinationsLayerAttr: function() {
            this._destPointLyrSelect && (this.destinationsLayer = this.featureLayers[this._destPointLyrSelect.get("value") - 1]);
            return this.destinationsLayer
        },
        _setOriginsLayerRouteIDFieldAttr: function(a) {
            this.originsLayerRouteIDField =
                a
        },
        _getOriginsLayerRouteIDFieldAttr: function() {
            this._originRouteIdSelect && this._isRouteIdAvailable() && (this.originsLayerRouteIDField = this._originRouteIdSelect.get("value"));
            return this.originsLayerRouteIDField
        },
        _setDestinationsLayerRouteIDFieldAttr: function(a) {
            this.destinationsLayerRouteIDField = a
        },
        _getDestinationsLayerRouteIDFieldAttr: function() {
            this._destnRouteIdSelect && this._isRouteIdAvailable && (this.destinationsLayerRouteIDField = this._destnRouteIdSelect.get("value"));
            return this.destinationsLayerRouteIDField
        },
        _setOutputLayerNameAttr: function(a) {
            this.outputLayerName = a;
            this._outputLayerInput && this._outputLayerInput.set("value", this.outputLayerName)
        },
        _setEnableTravelModesAttr: function(a) {
            this._set("enableTravelModes", a)
        },
        _setFolderIdAttr: function(a) {
            this.folderId = a
        },
        _getFolderIdAttr: function() {
            this._webMapFolderSelect && (this.folderStore && this._webMapFolderSelect.item) && (this.folderId = this._webMapFolderSelect.item ? this.folderStore.getValue(this._webMapFolderSelect.item, "id") : "");
            return this.folderId
        },
        _setFolderNameAttr: function(a) {
            this.folderName =
                a
        },
        _getFolderNameAttr: function() {
            this._webMapFolderSelect && (this.folderStore && this._webMapFolderSelect.item) && (this.folderName = this.folderStore.getValue(this._webMapFolderSelect.item, "name"));
            return this.folderName
        },
        _loadConnections: function() {
            this.on("start", c.hitch(this, "_onClose", !0));
            this._connect(this._closeBtn, "onclick", c.hitch(this, "_onClose", !1));
            n.connect(this._measureMethodSelect, "onChange", c.hitch(this, this._handleMeasurementTypeChange));
            this.watch("enableTravelModes", c.hitch(this, function(a,
                b, e) {
                this._updateTravelModes(e)
            }))
        },
        _connect: function(a, b, e) {
            this._pbConnects.push(n.connect(a, b, e))
        },
        _handleDestnRouteIdChange: function(a) {
            !this._autoSelRtId && l.isDefined(this._originRouteIdSelect.getOptions(a)) && (this._autoSelRtId = !0, this._originRouteIdSelect.set("value", a))
        },
        _handleOriginRouteIdChange: function(a) {
            !this._autoSelRtId && l.isDefined(this._destnRouteIdSelect.getOptions(a)) && (this._autoSelRtId = !0, this._destnRouteIdSelect.set("value", a))
        },
        _handleMeasurementTypeChange: function(a) {
            var b =
                "DrivingTime" === a;
            this.set("measurementType", a);
            d.set(this._useTrafficLabelRow, "display", b ? "" : "none");
            this._trafficTimeWidget.set("disabled", !b);
            this._trafficTimeWidget.set("reset", !b)
        },
        _handleDestinationLayerChange: function(a) {
            var b;
            this._autoSelRtId && (this._autoSelRtId = !1);
            this._destnRouteIdSelect.removeOption(this._destnRouteIdSelect.getOptions());
            this.originsLayer.graphics && 1 < this.originsLayer.graphics.length && 1 < this.featureLayers[a - 1].graphics.length ? this.featureLayers[a - 1].graphics && this.featureLayers[a -
                1].graphics.length !== this.originsLayer.graphics.length ? (this._showMessages(this.i18n.inValidNumberRecordsMsg), this.set("disableRunAnalysis", !0), d.set(this._routeIdRow, "display", "none")) : (this._handleCloseMsg(), d.set(this._routeIdRow, "display", "table"), this.set("disableRunAnalysis", !1), b = this.featureLayers[a - 1].fields, g.forEach(b, function(a, b) {
                -1 !== g.indexOf(["esriFieldTypeSmallInteger", "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeString", "esriFieldTypeDate"], a.type) && this._destnRouteIdSelect.addOption({
                    value: a.name,
                    label: l.isDefined(a.alias) && "" !== a.alias ? a.alias : a.name
                })
            }, this)) : (d.set(this._routeIdRow, "display", "none"), this.set("disableRunAnalysis", !1), this._handleCloseMsg());
            this._outputLayerInput.set("value", k.substitute(this.i18n.outputLayerName, {
                layername: this.originsLayer.name,
                destnlayername: this.featureLayers[a - 1].name
            }))
        },
        _isRouteIdAvailable: function() {
            var a = !1;
            this.originsLayer.graphics && 1 < this.originsLayer.graphics.length && 1 < this.featureLayers[this._destPointLyrSelect.get("value") - 1].graphics.length &&
                this.originsLayer.graphics && this.originsLayer.graphics.length === this.featureLayers[this._destPointLyrSelect.get("value") - 1].graphics.length && (a = !0);
            return a
        },
        _showMessages: function(a) {
            q.set(this._bodyNode, "innerHTML", a);
            p.fadeIn({
                node: this._errorMessagePane,
                easing: r.quadIn,
                onEnd: c.hitch(this, function() {
                    d.set(this._errorMessagePane, {
                        display: ""
                    })
                })
            }).play()
        },
        _handleCloseMsg: function(a) {
            a && a.preventDefault();
            p.fadeOut({
                node: this._errorMessagePane,
                easing: r.quadOut,
                onEnd: c.hitch(this, function() {
                    d.set(this._errorMessagePane, {
                        display: "none"
                    })
                })
            }).play()
        },
        _updateTravelModes: function(a) {
            var b = this._measureMethodSelect.getOptions();
            g.forEach(b, function(b) {
                "StraightLine" !== b.value && (b.disabled = !a)
            });
            this._measureMethodSelect.updateOption(b)
        }
    })
});