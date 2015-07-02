//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/Color", "dojo/_base/json", "dojo/has", "dojo/json", "dojo/string", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "dojo/query", "dojo/dom-class", "dojo/number", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/_OnDijitClickMixin", "dijit/_FocusMixin", "dijit/registry", "dijit/form/Button", "dijit/form/CheckBox", "dijit/form/Form", "dijit/form/Select", "dijit/form/TextBox", "dijit/form/NumberSpinner", "dijit/form/ValidationTextBox", "dijit/layout/ContentPane", "dijit/form/ComboBox", "dijit/Dialog", "../../kernel", "../../lang", "./AnalysisBase", "../../symbols/SimpleFillSymbol", "../../symbols/SimpleLineSymbol", "../../toolbars/draw", "../PopupTemplate", "../../layers/FeatureLayer", "../../graphic", "./utils", "./CreditEstimator", "../../symbols/PictureMarkerSymbol", "dijit/form/HorizontalSlider", "dijit/form/HorizontalRule", "dijit/form/HorizontalRuleLabels", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/TraceDownstream.html"], function(r, s, d, g, h, t, e, F, G, k, l, u, H, I, v, J, w, x, y, z, A, K, L, M, N, O, P, Q, R, S, T, U, V, W, B, n, p, m, X, C, D, f, Y, Z, $, aa, ba, q, E) {
    return s([w, x, y, z, A, B], {
        declaredClass: "esri.dijit.analysis.TraceDownstream",
        templateString: E,
        basePath: r.toUrl("."),
        widgetsInTemplate: !0,
        inputLayer: null,
        boundingPolygonLayer: null,
        outputLayerName: null,
        splitDistance: null,
        splitUnits: "Kilometers",
        maxDistance: null,
        maxDistanceUnits: "Kilometers",
        showSelectFolder: !1,
        showChooseExtent: !0,
        showHelp: !0,
        returnFeatureCollection: !1,
        showCredits: !0,
        getResultLyrInfos: !1,
        i18n: null,
        map: null,
        toolName: "TraceDownstream",
        helpFileName: "TraceDownstream",
        resultParameter: "traceLayer",
        constructor: function(a, b) {
            this._pbConnects = [];
            a.containerNode && (this.container = a.containerNode)
        },
        destroy: function() {
            this.inherited(arguments);
            g.forEach(this._pbConnects, h.disconnect);
            delete this._pbConnects
        },
        postMixInProperties: function() {
            this.inherited(arguments);
            d.mixin(this.i18n, q.findHotSpotsTool);
            d.mixin(this.i18n, q.traceDownstreamTool);
            this.set("drawLayerName", this.i18n.blayerName)
        },
        postCreate: function() {
            this.inherited(arguments);
            v.add(this._form.domNode, "esriSimpleForm");
            this._outputLayerInput.set("validator", d.hitch(this, this.validateServiceName));
            this._buildUI()
        },
        startup: function() {},
        _onClose: function(a) {
            a && this._featureLayer && (this.map.removeLayer(this._featureLayer), g.forEach(this.boundingPolygonLayers, function(a, c) {
                a === this._featureLayer && (this._boundingAreaSelect.removeOption({
                    value: c + 1,
                    label: this._featureLayer.name
                }), this.boundingPolygonLayers.splice(c, 1))
            }, this));
            this._handleBoundingBtnChange(!1);
            this.emit("close", {
                save: !a
            })
        },
        clear: function() {
            this._featureLayer && (this.map.removeLayer(this._featureLayer), g.forEach(this.boundingPolygonLayers, function(a, b) {
                a === this._featureLayer && (this._boundingAreaSelect.removeOption({
                    value: b + 1,
                    label: this._featureLayer.name
                }), this.boundingPolygonLayers.splice(b, 1))
            }, this));
            this._handleBoundingBtnChange(!1)
        },
        _handleShowCreditsClick: function(a) {
            a.preventDefault();
            a = {};
            this._form.validate() && (a.inputLayer = e.toJson(f.constructAnalysisInputLyrObj(this.get("inputLayer"))), this.get("boundingPolygonLayer") &&
                (a.boundingPolygonLayer = e.toJson(f.constructAnalysisInputLyrObj(this.boundingPolygonLayer))), this.get("maxDistance") && (a.maximumDistance = this.get("maxDistance"), a.maxDistanceUnits = this.get("maxDistanceUnits")), this.get("splitDistance") && (a.splitDistance = this.get("splitDistance"), a.splitUnits = this.get("splitUnits")), this.returnFeatureCollection || (a.OutputName = e.toJson({
                    serviceProperties: {
                        name: this.get("outputLayerName")
                    }
                })), this.showChooseExtent && this._useExtentCheck.get("checked") && (a.context = e.toJson({
                    extent: this.map.extent._normalize(!0)
                })),
                this.getCreditsEstimate(this.toolName, a).then(d.hitch(this, function(a) {
                    this._usageForm.set("content", a);
                    this._usageDialog.show()
                })))
        },
        _handleSaveBtnClick: function(a) {
            if (this._form.validate()) {
                this._saveBtn.set("disabled", !0);
                a = {};
                var b = {},
                    c;
                a.inputLayer = e.toJson(f.constructAnalysisInputLyrObj(this.get("inputLayer")));
                this.get("boundingPolygonLayer") && (a.boundingPolygonLayer = e.toJson(f.constructAnalysisInputLyrObj(this.boundingPolygonLayer)));
                this.get("maxDistance") && (a.maxDistance = this.get("maxDistance"),
                    a.maxDistanceUnits = this.get("maxDistanceUnits"));
                this.get("splitDistance") && (a.splitDistance = this.get("splitDistance"), a.splitUnits = this.get("splitUnits"), this.getResultLyrInfos = !0);
                this.returnFeatureCollection || (a.OutputName = e.toJson({
                    serviceProperties: {
                        name: this.get("outputLayerName")
                    }
                }));
                this.showChooseExtent && !this.get("DisableExtent") && this._useExtentCheck.get("checked") && (a.context = e.toJson({
                    extent: this.map.extent._normalize(!0)
                }));
                this.returnFeatureCollection && (c = {
                        outSR: this.map.spatialReference
                    },
                    this.showChooseExtent && (c.extent = this.map.extent._normalize(!0)), a.context = e.toJson(c));
                a.returnFeatureCollection = this.returnFeatureCollection;
                b.jobParams = a;
                b.itemParams = {
                    description: this.i18n.itemDescription,
                    tags: k.substitute(this.i18n.itemTags, {
                        layername: this.inputLayer.name,
                        fieldname: !a.field ? "" : a.field
                    }),
                    snippet: this.i18n.itemSnippet
                };
                this.showSelectFolder && (b.itemParams.folder = this.get("folderId"));
                console.log(b);
                this.execute(b)
            }
        },
        _save: function() {},
        _buildUI: function() {
            this._loadConnections();
            this.signInPromise.then(d.hitch(this, f.initHelpLinks, this.domNode, this.showHelp, {
                analysisGpServer: this.analysisGpServer
            }));
            var a = [{
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
            }];
            this._splitTraceUnitsSelect.addOption(a);
            this._maxTraceUnitsSelect.addOption(a);
            this.inputLayer && (u.set(this._interpolateToolDescription, "innerHTML", k.substitute(this.i18n.toolDefine, {
                layername: this.inputLayer.name
            })), this._outputLayerInput.set("value", k.substitute(this.i18n.outputLayerName, {
                layername: this.inputLayer.name
            })), this.set("fields", this.inputLayer));
            this.outputLayerName && this._outputLayerInput.set("value", this.outputLayerName);
            this.maxDistanceUnits && this._maxTraceUnitsSelect.set("value", this.maxDistanceUnits);
            this.maxDistance && this._maxTraceInput.set("value", this.maxDistance);
            this.splitUnits && this._splitTraceUnitsSelect.set("value", this.splitUnits);
            this.splitDistance &&
                this._splitTraceInput.set("value", this.splitDistance);
            if (this.boundingPolygonLayers) {
                this._boundingAreaSelect.addOption({
                    value: "-1",
                    label: this.i18n.defaultBoundingOption,
                    selected: !0
                });
                var b = !1;
                g.forEach(this.boundingPolygonLayers, function(a, d) {
                    "esriGeometryPolygon" === a.geometryType && (b = this.get("boundingPolygonLayer") && this.get("boundingPolygonLayer").name === a.name, this._boundingAreaSelect.addOption({
                        value: d + 1,
                        label: a.name,
                        selected: b
                    }))
                }, this)
            }
            l.set(this._chooseFolderRow, "display", !0 === this.showSelectFolder ?
                "block" : "none");
            this.showSelectFolder && this.getFolderStore().then(d.hitch(this, function(a) {
                this.folderStore = a;
                f.setupFoldersUI({
                    folderStore: this.folderStore,
                    folderId: this.folderId,
                    folderName: this.folderName,
                    folderSelect: this._webMapFolderSelect,
                    username: this.portalUser ? this.portalUser.username : ""
                })
            }));
            l.set(this._chooseExtentDiv, "display", !0 === this.showChooseExtent ? "inline-block" : "none");
            l.set(this._showCreditsLink, "display", !0 === this.showCredits ? "block" : "none")
        },
        _handleBoundingSelectChange: function(a) {
            "-1" ===
            a || this._featureLayer && this.get("boundingPolygonLayer").id === this._featureLayer.id ? this._bndgPolyDrawBtn.set("disabled", !1) : (this._bndgPolyDrawBtn.set("disabled", !0), this._bndgPolyDrawBtn.set("checked", !1))
        },
        _handleBoundingBtnChange: function(a) {
            a ? (this.emit("drawtool-activate", {}), this._featureLayer || this._createBoundingPolyFeatColl(), this._toolbar.activate(m.POLYGON)) : (this._toolbar.deactivate(), this.emit("drawtool-deactivate", {}))
        },
        _loadConnections: function() {
            this.on("start", d.hitch(this, "_onClose", !1));
            this._connect(this._closeBtn, "onclick", d.hitch(this, "_onClose", !0))
        },
        _createBoundingPolyFeatColl: function() {
            var a = f.createPolygonFeatureCollection(this.drawLayerName);
            this._featureLayer = new C(a, {
                id: this.drawLayerName
            });
            this.map.addLayer(this._featureLayer);
            h.connect(this._featureLayer, "onClick", d.hitch(this, function(a) {
                this.map.infoWindow.setFeatures([a.graphic])
            }))
        },
        _addFeatures: function(a) {
            var b = [],
                c = {},
                d = new n(n.STYLE_NULL, new p(p.STYLE_SOLID, new t([0, 0, 0]), 4));
            a = new D(a, d);
            this.map.graphics.add(a);
            c.description = "blayer desc";
            c.title = "blayer";
            a.setAttributes(c);
            b.push(a);
            this._featureLayer.applyEdits(b, null, null);
            if (0 === this.boundingPolygonLayers.length || this.boundingPolygonLayers[this.boundingPolygonLayers.length - 1] !== this._featureLayer) b = this.boundingPolygonLayers.push(this._featureLayer), c = this._boundingAreaSelect.getOptions(), this._boundingAreaSelect.removeOption(c), c = g.map(c, function(a) {
                a.selected = !1;
                return a
            }), c.push({
                value: b,
                label: this._featureLayer.name,
                selected: !0
            }), this._boundingAreaSelect.addOption(c)
        },
        validateServiceName: function(a) {
            var b = /(:|&|<|>|%|#|\?|\\|\"|\/|\+)/.test(a);
            return 0 === a.length || 0 === k.trim(a).length ? (this._outputLayerInput.set("invalidMessage", this.i18n.requiredValue), !1) : b ? (this._outputLayerInput.set("invalidMessage", this.i18n.invalidServiceName), !1) : 98 < a.length ? (this._outputLayerInput.set("invalidMessage", this.i18n.invalidServiceNameLength), !1) : !0
        },
        _setAnalysisGpServerAttr: function(a) {
            a && (this.analysisGpServer = a, this.set("toolServiceUrl", this.analysisGpServer + "/" + this.toolName))
        },
        _setInputLayerAttr: function(a) {
            this.inputLayer = a
        },
        _getInputLayerAttr: function() {
            return this.inputLayer
        },
        _getBoundingPolygonLayerAttr: function() {
            this._boundingAreaSelect && (this.boundingPolygonLayer = null, "-1" !== this._boundingAreaSelect.get("value") && (this.boundingPolygonLayer = this.boundingPolygonLayers[this._boundingAreaSelect.get("value") - 1]));
            return this.boundingPolygonLayer
        },
        _setBoundingPolygonLayerAttr: function(a) {
            this.boundingPolygonLayer = a
        },
        _setBoundingPolygonLayersAttr: function(a) {
            this.boundingPolygonLayers =
                a
        },
        _setSplitUnitsAttr: function(a) {
            this.splitUnits = a
        },
        _getSplitUnitsAttr: function() {
            this._splitTraceUnitsSelect && this._splitTraceUnitsSelect.get("value") && (this.splitUnits = this._splitTraceUnitsSelect.get("value"));
            return this.splitUnits
        },
        _setSplitDistanceAttr: function(a) {
            this.splitDistance = a
        },
        _getSplitDistanceAttr: function() {
            this._splitTraceInput && this._splitTraceInput.get("value") && (this.splitDistance = this._splitTraceInput.get("value"));
            return this.splitDistance
        },
        _setMaxDistanceUnitsAttr: function(a) {
            this.maxDistanceUnits =
                a
        },
        _getMaxDistanceUnitsAttr: function() {
            this._maxTraceUnitsSelect && this._maxTraceUnitsSelect.get("value") && (this.maxDistanceUnits = this._maxTraceUnitsSelect.get("value"));
            return this.maxDistanceUnits
        },
        _setMaxDistanceAttr: function(a) {
            this.maxDistance = a
        },
        _getMaxDistanceAttr: function() {
            this._maxTraceInput && this._maxTraceInput.get("value") && (this.maxDistance = this._maxTraceInput.get("value"));
            return this.maxDistance
        },
        _getOutputLayerNameAttr: function() {
            this._outputLayerInput && (this.outputLayerName = this._outputLayerInput.get("value"));
            return this.outputLayerName
        },
        _setOutputLayerNameAttr: function(a) {
            this.outputLayerName = a
        },
        _setMapAttr: function(a) {
            this.map = a;
            this._toolbar = new m(this.map);
            h.connect(this._toolbar, "onDrawEnd", d.hitch(this, this._addFeatures));
            this._pointtoolbar = new m(this.map);
            h.connect(this._pointtoolbar, "onDrawEnd", d.hitch(this, this._addPointFeatures))
        },
        _getMapAttr: function() {
            return this.map
        },
        _setDrawLayerNameAttr: function(a) {
            this.drawLayerName = a
        },
        _getDrawLayerNameAttr: function() {
            return this._featureLayer.name
        },
        _setDisableRunAnalysisAttr: function(a) {
            this._saveBtn.set("disabled",
                a)
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
        _setShowHelpAttr: function(a) {
            this.showHelp = a
        },
        _getShowHelpAttr: function() {
            return this.showHelp
        },
        _getDrawLayerAttr: function() {
            var a = [];
            this._featureLayer && a.push(this._featureLayer);
            this._pointfeatureLayer && a.push(this._pointfeatureLayer);
            return a
        },
        _setReturnFeatureCollectionAttr: function(a) {
            this.returnFeatureCollection = a
        },
        _getReturnFeatureCollectionAttr: function() {
            return this.returnFeatureCollection
        },
        _setShowCreditsAttr: function(a) {
            this.showCredits = a
        },
        _getShowCreditsAttr: function() {
            return this.showCredits
        },
        _setDisableExtentAttr: function(a) {
            this._useExtentCheck.set("checked", !a);
            this._useExtentCheck.set("disabled", a)
        },
        _getDisableExtentAttr: function() {
            this._useExtentCheck.get("disabled")
        },
        _setFolderIdAttr: function(a) {
            this.folderId = a
        },
        _getFolderIdAttr: function() {
            this._webMapFolderSelect &&
                (this.folderStore && this._webMapFolderSelect.item) && (this.folderId = this._webMapFolderSelect.item ? this.folderStore.getValue(this._webMapFolderSelect.item, "id") : "");
            return this.folderId
        },
        _setFolderNameAttr: function(a) {
            this.folderName = a
        },
        _getFolderNameAttr: function() {
            this._webMapFolderSelect && (this.folderStore && this._webMapFolderSelect.item) && (this.folderName = this.folderStore.getValue(this._webMapFolderSelect.item, "name"));
            return this.folderName
        },
        _connect: function(a, b, c) {
            this._pbConnects.push(h.connect(a,
                b, c))
        }
    })
});