//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/Color", "dojo/_base/json", "dojo/has", "dojo/json", "dojo/string", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "dojo/query", "dojo/dom-class", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/_OnDijitClickMixin", "dijit/_FocusMixin", "dijit/registry", "dijit/form/Button", "dijit/form/CheckBox", "dijit/form/Form", "dijit/form/Select", "dijit/form/TextBox", "dijit/form/ToggleButton", "dijit/form/ValidationTextBox", "dijit/layout/ContentPane", "dijit/form/ComboBox", "dijit/Dialog", "../../kernel", "../../lang", "./AnalysisBase", "../../symbols/SimpleFillSymbol", "../../symbols/SimpleLineSymbol", "../../toolbars/draw", "../PopupTemplate", "../../layers/FeatureLayer", "../../graphic", "./utils", "./CreditEstimator", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/FindHotSpots.html"], function(s, t, f, g, m, u, e, G, H, k, l, n, I, J, d, v, w, x, y, z, K, L, M, N, O, P, Q, R, S, T, U, V, A, B, p, q, r, W, C, D, h, X, E, F) {
    return t([v, w, x, y, z, B], {
        declaredClass: "esri.dijit.analysis.FindHotSpots",
        templateString: F,
        basePath: s.toUrl("."),
        widgetsInTemplate: !0,
        analysisLayer: null,
        analysisField: null,
        aggregationPolygonLayer: null,
        boundingPolygonLayer: null,
        outputLayerName: null,
        showSelectFolder: !1,
        showChooseExtent: !0,
        showHelp: !0,
        returnFeatureCollection: !1,
        showCredits: !0,
        returnProcessInfo: !0,
        i18n: null,
        map: null,
        toolName: "FindHotSpots",
        helpFileName: "FindHotSpots",
        resultParameter: "HotSpotsResultLayer",
        constructor: function(a, b) {
            this._pbConnects = [];
            a.containerNode && (this.container = a.containerNode)
        },
        destroy: function() {
            this.inherited(arguments);
            g.forEach(this._pbConnects, m.disconnect);
            delete this._pbConnects
        },
        postMixInProperties: function() {
            this.inherited(arguments);
            f.mixin(this.i18n, E.findHotSpotsTool);
            this.set("drawLayerName", this.i18n.blayerName)
        },
        postCreate: function() {
            this.inherited(arguments);
            d.add(this._form.domNode, "esriSimpleForm");
            this._outputLayerInput.set("validator", f.hitch(this, this.validateServiceName));
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
            this._handleBoundingBtnClick(!1);
            this.emit("close", {
                save: !a
            })
        },
        clear: function() {
            this._featureLayer &&
                (this.map.removeLayer(this._featureLayer), g.forEach(this.boundingPolygonLayers, function(a, b) {
                    a === this._featureLayer && (this._boundingAreaSelect.removeOption({
                        value: b + 1,
                        label: this._featureLayer.name
                    }), this.boundingPolygonLayers.splice(b, 1))
                }, this), this._featureLayer = null);
            this._boundingDrawBtn.reset();
            this._handleBoundingBtnClick(!1)
        },
        _handleShowCreditsClick: function(a) {
            a.preventDefault();
            a = {};
            var b;
            this._form.validate() && (a.AnalysisLayer = e.toJson(h.constructAnalysisInputLyrObj(this.analysisLayer)),
                "0" !== this._analysFieldSelect.get("value") && (a.AnalysisField = this._analysFieldSelect.get("value")), this._isPoint && "0" === this._analysFieldSelect.get("value") && ("-1" !== this._boundingAreaSelect.get("value") && (b = this.boundingPolygonLayers[this._boundingAreaSelect.get("value") - 1], a.BoundingPolygonLayer = e.toJson(h.constructAnalysisInputLyrObj(b))), "-1" !== this._aggAreaSelect.get("value") && (b = this.aggregationPolygonLayers[this._aggAreaSelect.get("value") - 1], a.AggregationPolygonLayer = e.toJson(h.constructAnalysisInputLyrObj(b)))),
                this.returnFeatureCollection || (a.OutputName = e.toJson({
                    serviceProperties: {
                        name: this._outputLayerInput.get("value")
                    }
                })), this.showChooseExtent && !this.get("DisableExtent") && this._useExtentCheck.get("checked") && (a.Context = e.toJson({
                    extent: this.map.extent._normalize(!0)
                })), this.getCreditsEstimate(this.toolName, a).then(f.hitch(this, function(a) {
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
                a.AnalysisLayer = e.toJson(h.constructAnalysisInputLyrObj(this.analysisLayer));
                "0" !== this._analysFieldSelect.get("value") && (a.AnalysisField = this._analysFieldSelect.get("value"));
                this._isPoint && "0" === this._analysFieldSelect.get("value") && ("-1" !== this._boundingAreaSelect.get("value") && (c = this.boundingPolygonLayers[this._boundingAreaSelect.get("value") - 1], a.BoundingPolygonLayer = e.toJson(h.constructAnalysisInputLyrObj(c))), "-1" !== this._aggAreaSelect.get("value") && (c = this.aggregationPolygonLayers[this._aggAreaSelect.get("value") -
                    1], a.AggregationPolygonLayer = e.toJson(h.constructAnalysisInputLyrObj(c))));
                this.returnFeatureCollection || (a.OutputName = e.toJson({
                    serviceProperties: {
                        name: this._outputLayerInput.get("value")
                    }
                }));
                this.showChooseExtent && !this.get("DisableExtent") && this._useExtentCheck.get("checked") && (a.context = e.toJson({
                    extent: this.map.extent._normalize(!0)
                }));
                this.returnFeatureCollection && (c = {
                    outSR: this.map.spatialReference
                }, this.showChooseExtent && (c.extent = this.map.extent._normalize(!0)), a.context = e.toJson(c));
                a.returnProcessInfo =
                    this.returnProcessInfo;
                b.jobParams = a;
                b.itemParams = {
                    description: this.i18n.itemDescription,
                    tags: k.substitute(this.i18n.itemTags, {
                        layername: this.analysisLayer.name,
                        fieldname: !a.AnalysisField ? "" : a.AnalysisField
                    }),
                    snippet: this.i18n.itemSnippet
                };
                this.showSelectFolder && (b.itemParams.folder = this.get("folderId"));
                this.execute(b)
            }
        },
        _save: function() {},
        _buildUI: function() {
            this._loadConnections();
            this.signInPromise.then(f.hitch(this, h.initHelpLinks, this.domNode, this.showHelp, {
                analysisGpServer: this.analysisGpServer
            }));
            if (this.analysisLayer) {
                if ("esriGeometryPolygon" === this.analysisLayer.geometryType) this._isPoint = !1, n.set(this._hotspotsToolDescription, "innerHTML", k.substitute(this.i18n.hotspotsPolyDefine, {
                    layername: this.analysisLayer.name
                })), l.set(this._optionsRow, "display", "none"), n.set(this._analysisFieldHelpLink, "esriHelpTopic", "AnalysisFieldPoly");
                else if ("esriGeometryPoint" === this.analysisLayer.geometryType || "esriGeometryMultipoint" === this.analysisLayer.geometryType) this._isPoint = !0, n.set(this._hotspotsToolDescription,
                    "innerHTML", k.substitute(this.i18n.hotspotsPointDefine, {
                        layername: this.analysisLayer.name
                    })), d.add(this._analysFieldSelect.domNode, "esriLeadingMargin1"), l.set(this._optionsRow, "display", ""), n.set(this._analysisFieldHelpLink, "esriHelpTopic", "AnalysisFieldPoint"), this._outputLayerInput.set("value", k.substitute(this.i18n.outputLayerName, {
                    layername: this.analysisLayer.name
                }));
                this.set("AnalyisFields", this.analysisLayer);
                "esriGeometryPolygon" === this.analysisLayer.geometryType && this._outputLayerInput.set("value",
                    k.substitute(this.i18n.outputLayerName, {
                        layername: this._analysFieldSelect.getOptions(0).label
                    }))
            }
            this.outputLayerName && this._outputLayerInput.set("value", this.outputLayerName);
            this.boundingPolygonLayers && (this._boundingAreaSelect.addOption({
                value: "-1",
                label: this.i18n.defaultBoundingOption,
                selected: !0
            }), g.forEach(this.boundingPolygonLayers, function(a, b) {
                "esriGeometryPolygon" === a.geometryType && this._boundingAreaSelect.addOption({
                    value: b + 1,
                    label: a.name,
                    selected: !1
                })
            }, this));
            this.aggregationPolygonLayers &&
                (this._aggAreaSelect.addOption({
                    value: "-1",
                    label: this.i18n.defaultAggregationOption,
                    selected: !0
                }), g.forEach(this.aggregationPolygonLayers, function(a, b) {
                    "esriGeometryPolygon" === a.geometryType && this._aggAreaSelect.addOption({
                        value: b + 1,
                        label: a.name,
                        selected: !1
                    })
                }, this));
            l.set(this._chooseFolderRow, "display", !0 === this.showSelectFolder ? "block" : "none");
            this.showSelectFolder && this.getFolderStore().then(f.hitch(this, function(a) {
                this.folderStore = a;
                h.setupFoldersUI({
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
        _handleFieldChange: function(a) {
            "0" === this._analysFieldSelect.get("value") ? (this._outputLayerInput.set("value", k.substitute(this.i18n.outputLayerName, {
                layername: this.analysisLayer.name
            })), this._isPoint && (d.remove(this._optionsDiv,
                "disabled"), l.set(this._optionsRow, "display", ""))) : (this._outputLayerInput.set("value", k.substitute(this.i18n.outputLayerName, {
                layername: this._analysFieldSelect.getOptions(a).label
            })), this._isPoint && (d.add(this._optionsDiv, "disabled"), l.set(this._optionsRow, "display", "none"), this._boundingAreaSelect.set("value", "-1"), this._aggAreaSelect.set("value", "-1"), this.clear(), d.contains(this._optionsDiv, "optionsOpen") && (d.remove(this._optionsDiv, "optionsOpen"), d.add(this._optionsDiv, "optionsClose"))))
        },
        _handleOptionsBtnClick: function() {
            d.contains(this._optionsDiv,
                "disabled") || (d.contains(this._optionsDiv, "optionsClose") ? (d.remove(this._optionsDiv, "optionsClose"), d.add(this._optionsDiv, "optionsOpen")) : d.contains(this._optionsDiv, "optionsOpen") && (d.remove(this._optionsDiv, "optionsOpen"), d.add(this._optionsDiv, "optionsClose")))
        },
        _handleBoundingSelectChange: function(a) {
            var b = "-1" !== this._boundingAreaSelect.get("value");
            this._aggAreaSelect.set("disabled", b);
            d.toggle(this._aggAreaSelect.domNode, "esriAnalysisTextDisabled", b);
            "-1" !== a ? (a = this.boundingPolygonLayers[this._boundingAreaSelect.get("value") -
                1], a.id !== this.drawLayerName && this.clear()) : this.clear();
            this._boundingDrawBtn.reset()
        },
        _handleAggAreaSelectChange: function(a) {
            a = "-1" !== this._aggAreaSelect.get("value");
            this._boundingAreaSelect.set("disabled", a);
            d.toggle(this._boundingAreaSelect.domNode, "esriAnalysisTextDisabled", a);
            this._boundingDrawBtn.set("disabled", a);
            a && (this._boundingDrawBtn.reset(), this.clear());
            d.toggle(this._boundingDrawBtn.domNode, "esriAnalysisTextDisabled", a)
        },
        _handleBoundingBtnClick: function(a) {
            a ? (this.emit("drawtool-activate", {}), this._featureLayer || this._createBoundingPolyFeatColl(), this._toolbar.activate(r.POLYGON)) : (this._toolbar.deactivate(), this.emit("drawtool-deactivate", {}))
        },
        _loadConnections: function() {
            this.on("start", f.hitch(this, "_onClose", !1));
            this._connect(this._closeBtn, "onclick", f.hitch(this, "_onClose", !0))
        },
        _createBoundingPolyFeatColl: function() {
            var a = h.createPolygonFeatureCollection(this.drawLayerName);
            this._featureLayer = new C(a, {
                id: this.drawLayerName
            });
            this.map.addLayer(this._featureLayer);
            m.connect(this._featureLayer,
                "onClick", f.hitch(this, function(a) {
                    this.map.infoWindow.setFeatures([a.graphic])
                }))
        },
        _addFeatures: function(a) {
            var b = [],
                c = {},
                d = new p(p.STYLE_NULL, new q(q.STYLE_SOLID, new u([0, 0, 0]), 4));
            a = new D(a, d);
            this.map.graphics.add(a);
            c.description = "blayer desc";
            c.title = "blayer";
            a.setAttributes(c);
            b.push(a);
            this._featureLayer.applyEdits(b, null, null);
            if (0 === this.boundingPolygonLayers.length || this.boundingPolygonLayers[this.boundingPolygonLayers.length - 1] !== this._featureLayer) b = this.boundingPolygonLayers.push(this._featureLayer),
                c = this._boundingAreaSelect.getOptions(), this._boundingAreaSelect.removeOption(c), c = g.map(c, function(a) {
                    a.selected = !1;
                    return a
                }), c.push({
                    value: b,
                    label: this._featureLayer.name,
                    selected: !0
                }), this._boundingAreaSelect.addOption(c), this._handleBoundingSelectChange(b)
        },
        _setAnalysisGpServerAttr: function(a) {
            a && (this.analysisGpServer = a, this.set("toolServiceUrl", this.analysisGpServer + "/" + this.toolName))
        },
        _setAnalysisLayerAttr: function(a) {
            this.analysisLayer = a
        },
        _setAnalyisFieldsAttr: function(a) {
            var b = a.fields,
                c, d;
            this._isPoint && this._analysFieldSelect.addOption({
                value: "0",
                label: this.i18n.noAnalysisField
            });
            g.forEach(b, function(b, e) {
                    -1 === g.indexOf(["GiZScore", "GiPValue", "Gi_Bin", a.objectIdField], b.name) && -1 !== g.indexOf(["esriFieldTypeSmallInteger", "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeDouble"], b.type) && (c = {
                        value: b.name,
                        label: A.isDefined(b.alias) && "" !== b.alias ? b.alias : b.name
                    }, this.analysisField && c.label === this.analysisField && (c.selected = "selected", d = b.name), this._analysFieldSelect.addOption(c))
                },
                this);
            d && this._analysFieldSelect.set("value", d)
        },
        _setMapAttr: function(a) {
            this.map = a;
            this._toolbar = new r(this.map);
            m.connect(this._toolbar, "onDrawEnd", f.hitch(this, this._addFeatures))
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
        _getDrawLayerAttr: function() {
            return this._featureLayer
        },
        _getDrawToolbarAttr: function() {
            return this._toolbar
        },
        _setDisableRunAnalysisAttr: function(a) {
            this._saveBtn.set("disabled",
                a)
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
            this._webMapFolderSelect && (this.folderStore && this._webMapFolderSelect.item) && (this.folderId = this._webMapFolderSelect.item ? this.folderStore.getValue(this._webMapFolderSelect.item, "id") : "");
            return this.folderId
        },
        _setFolderNameAttr: function(a) {
            this.folderName = a
        },
        _getFolderNameAttr: function() {
            this._webMapFolderSelect &&
                (this.folderStore && this._webMapFolderSelect.item) && (this.folderName = this.folderStore.getValue(this._webMapFolderSelect.item, "name"));
            return this.folderName
        },
        _connect: function(a, b, c) {
            this._pbConnects.push(m.connect(a, b, c))
        }
    })
});