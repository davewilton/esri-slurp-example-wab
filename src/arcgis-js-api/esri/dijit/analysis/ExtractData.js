//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/Color", "dojo/_base/connect", "dojo/_base/json", "dojo/_base/fx", "dojo/has", "dojo/json", "dojo/string", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "dojo/query", "dojo/dom-class", "dojo/number", "dojo/date/locale", "dojo/fx/easing", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/_OnDijitClickMixin", "dijit/_FocusMixin", "dijit/registry", "dijit/form/Button", "dijit/form/CheckBox", "dijit/form/Form", "dijit/form/Select", "dijit/form/TextBox", "dijit/form/ToggleButton", "dijit/form/ValidationTextBox", "dijit/layout/ContentPane", "dijit/form/ComboBox", "dijit/form/RadioButton", "dijit/Dialog", "dojox/form/CheckedMultiSelect", "../../kernel", "../../lang", "./AnalysisBase", "./CreditEstimator", "../../geometry/jsonUtils", "../../toolbars/draw", "../../graphic", "../../layers/FeatureLayer", "./utils", "../../geometry/Point", "../../geometry/Polyline", "../../geometry/Polygon", "../../geometry/Multipoint", "../../geometry/Extent", "../../symbols/SimpleFillSymbol", "../../symbols/SimpleLineSymbol", "../../SpatialReference", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/ExtractData.html"], function(w, x, c, e, r, n, f, s, N, O, p, h, y, P, Q, z, R, A, t, B, C, D, E, F, S, T, U, V, W, X, Y, Z, $, aa, ba, ca, da, ea, G, H, fa, ga, u, v, I, g, ha, ia, J, ja, K, l, m, L, q, M) {
    return x([B, C, D, E, F, H], {
        declaredClass: "esri.dijit.analysis.ExtractData",
        templateString: M,
        basePath: w.toUrl("."),
        widgetsInTemplate: !0,
        showSelectFolder: !1,
        showChooseExtent: !1,
        showHelp: !0,
        showCredits: !0,
        clip: !1,
        dataFormat: "CSV",
        inputLayers: null,
        featureLayers: null,
        outputLayerName: null,
        i18n: null,
        toolName: "ExtractData",
        helpFileName: "ExtractData",
        resultParameter: "contentID",
        constructor: function(a, b) {
            this._pbConnects = [];
            a.containerNode && (this.container = a.containerNode)
        },
        destroy: function() {
            this.inherited(arguments);
            e.forEach(this._pbConnects, n.disconnect);
            delete this._pbConnects
        },
        postMixInProperties: function() {
            this.inherited(arguments);
            this.i18n = {};
            c.mixin(this.i18n, q.common);
            c.mixin(this.i18n, q.analysisTools);
            c.mixin(this.i18n, q.extractDataTool)
        },
        postCreate: function() {
            this.inherited(arguments);
            z.add(this._form.domNode, "esriSimpleForm");
            h.set(this._inputLayersSelect.selectNode,
                "width", "90%");
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
        clear: function() {
            this._extentArea && (this.map.graphics.remove(this._extentArea), this._extentArea = null);
            this._featureLayer && (this.map.removeLayer(this._featureLayer), this._featureLayer = null);
            this._toolbar.deactivate()
        },
        _buildJobParams: function() {
            var a = {},
                b, k, d = [];
            k = e.map(this._inputLayersSelect.get("value"),
                function(a) {
                    return this.featureLayers[parseInt(a, 10)]
                }, this);
            b = [];
            b = e.map(k, function(a) {
                return f.toJson(g.constructAnalysisInputLyrObj(a))
            }, this);
            a.InputLayers = b;
            a.Clip = this.get("clip");
            a.DataFormat = this._dataFormatSelect.get("value");
            if ("-1" !== this._extentSelect.get("value") || this._extentArea) this._extentArea ? (this._featureLayer || (this._featureLayer = this._createBoundingPolyFeatColl(), this.map.addLayer(this._featureLayer)), d.push(this._extentArea), this._featureLayer.applyEdits(d, null, null), a.Extent =
                f.toJson(g.constructAnalysisInputLyrObj(this._featureLayer))) : a.Extent = f.toJson(g.constructAnalysisInputLyrObj(this.featureLayers[parseInt(this._extentSelect.get("value"), 10) - 1])), a.context = f.toJson({
                extent: this.get("extent")
            });
            else {
                b = new l(l.STYLE_NULL, new m(m.STYLE_SOLID, new r([0, 0, 0]), 4));
                k = this._createBoundingPolyFeatColl();
                var d = this.map.extent._normalize(!0),
                    c = new J(d.spatialReference);
                c.addRing([
                    [d.xmin, d.ymin],
                    [d.xmin, d.ymax],
                    [d.xmax, d.ymax],
                    [d.xmax, d.ymin],
                    [d.xmin, d.ymin]
                ]);
                k.add(new v(c,
                    b));
                a.Extent = f.toJson(g.constructAnalysisInputLyrObj(k));
                a.context = f.toJson({
                    extent: this.map.extent._normalize(!0)
                })
            }
            a.OutputName = f.toJson({
                itemProperties: {
                    title: this._outputLayerInput.get("value"),
                    description: this.i18n.itemDescription,
                    tags: this.i18n.itemTags,
                    snippet: this.i18n.itemSnippet,
                    folderId: this._webMapFolderSelect.item ? this.folderStore.getValue(this._webMapFolderSelect.item, "id") : ""
                }
            });
            return a
        },
        _handleShowCreditsClick: function(a) {
            var b = {};
            a.preventDefault();
            this._form.validate() && (b = this._buildJobParams(),
                b.InputLayers = f.toJson(b.InputLayers), this.getCreditsEstimate(this.toolName, b).then(c.hitch(this, function(a) {
                    this._usageForm.set("content", a);
                    this._usageDialog.show()
                })))
        },
        _handleSaveBtnClick: function(a) {
            a = {};
            var b = {};
            this._form.validate() && (this._saveBtn.set("disabled", !0), a = this._buildJobParams(), b.jobParams = a, this._featureLayer && (this.map.removeLayer(this._featureLayer), this._featureLayer = null), this._extentArea && (this.map.graphics.remove(this._extentArea), this._extentArea = null), this.execute(b))
        },
        _save: function() {},
        _buildUI: function() {
            var a;
            this._loadConnections();
            this.signInPromise.then(c.hitch(this, g.initHelpLinks, this.domNode, this.showHelp, {
                analysisGpServer: this.analysisGpServer
            }));
            a = A.format(new Date, {
                datePattern: "MMMM d yyyy",
                timePattern: "h.m.s a"
            });
            this._outputLayerInput.set("value", p.substitute(this.i18n.outputfileName, {
                datetime: a
            }));
            this.outputLayerName && this._outputLayerInput.set("value", this.outputLayerName);
            this.featureLayers && (this._extentSelect.addOption({
                    value: "-1",
                    label: this.i18n.sameAsDisplay
                }),
                e.forEach(this.featureLayers, function(a, c) {
                    this._inputLayersSelect.addOption({
                        value: c,
                        label: a.name,
                        selected: this.featureLayers && -1 !== e.indexOf(this.inputLayers, a)
                    });
                    this._extentSelect.addOption({
                        value: c + 1,
                        label: p.substitute(this.i18n.sameAsLayer, {
                            layername: a.name
                        })
                    })
                }, this));
            this.outputLayerName && this._outputLayerInput.set("value", this.outputLayerName);
            h.set(this._chooseFolderRow, "display", !0 === this.showSelectFolder ? "block" : "none");
            this.showSelectFolder && this.getFolderStore().then(c.hitch(this, function(a) {
                this.folderStore =
                    a;
                g.setupFoldersUI({
                    folderStore: this.folderStore,
                    folderId: this.folderId,
                    folderName: this.folderName,
                    folderSelect: this._webMapFolderSelect,
                    username: this.portalUser ? this.portalUser.username : ""
                })
            }));
            h.set(this._chooseExtentDiv, "display", !0 === this.showChooseExtent ? "inline-block" : "none");
            this.clip && this._clipRadioBtn.set("value", this.clip);
            this.dataFormat && this._dataFormatSelect.set("value", this.dataFormat)
        },
        _loadConnections: function() {
            this.on("start", c.hitch(this, "_onClose", !0));
            this._connect(this._closeBtn,
                "onclick", c.hitch(this, "_onClose", !1))
        },
        _handleDataFormatSelectChange: function() {
            var a, b;
            b = !1;
            "CSV" === this._dataFormatSelect.get("value") ? (b = e.some(this._inputLayersSelect.get("value"), function(b) {
                a = this.featureLayers[parseInt(b, 10)];
                return "esriGeometryPolyline" === a.geometryType || "esriGeometryPolygon" === a.geometryType
            }, this)) ? (this._showMessages(this.i18n.linesCSVValidationMsg), this.set("disableRunAnalysis", !0)) : (this._handleCloseMsg(), this.set("disableRunAnalysis", !1)) : (this._handleCloseMsg(), this.set("disableRunAnalysis", !1))
        },
        _handleExtentSelectChange: function(a) {
            var b;
            this._drawExtentBtn.set("disabled", "-1" !== this._extentSelect.get("value"));
            this._extentArea && (this.map.graphics.remove(this._extentArea), this._extentArea = null, this._extentSelect.updateOption({
                value: "-1",
                label: this.i18n.sameAsDisplay
            }));
            "-1" !== a ? (b = this.featureLayers[parseInt(a - 1, 10)].toJson(), a = this.featureLayers[parseInt(a - 1, 10)], this.set("extent", G.isDefined(b.layerDefinition.extent) ? b.layerDefinition.extent : this._getLayerFullExtent(a))) : this.set("extent",
                this.map.extent._normalize(!0))
        },
        _getLayerFullExtent: function(a) {
            var b = null;
            e.forEach(a.graphics, function(a, c) {
                var e = this._getExtent(a.geometry);
                e && (b = b ? b.union(e) : e)
            }, this);
            return b
        },
        _getExtent: function(a) {
            if (!a) return null;
            var b = null;
            if ("esri.geometry.Extent" === a.declaredClass) b = a;
            else if ("esri.geometry.Point" === a.declaredClass) b = new K(a.x - 1E-4, a.y - 1E-4, a.x + 1E-4, a.y + 1E-4, a.spatialReference);
            else if (b = a.getExtent()) b.spatialReference = new L(a.spatialReference.toJson());
            return b
        },
        _handleExtentBtnClick: function(a) {
            a.preventDefault();
            this.emit("drawtool-activate", {});
            this._toolbar.activate(u.POLYGON);
            this._featureLayer && (this.map.removeLayer(this._featureLayer), this._featureLayer = null);
            this._extentArea && (this.map.graphics.remove(this._extentArea), this._extentArea = null)
        },
        _addFeatures: function(a) {
            this.emit("drawtool-deactivate", {});
            this._toolbar.deactivate();
            var b;
            b = new l(l.STYLE_NULL, new m(m.STYLE_SOLID, new r([0, 0, 0]), 4));
            this.set("extent", a.getExtent());
            this._extentArea = new v(a, b);
            this.map.graphics.add(this._extentArea);
            this._extentSelect.updateOption({
                value: "-1",
                label: this.i18n.drawnBoundary
            })
        },
        _setExtentAttr: function(a) {
            this.extent = a
        },
        _getExtentAttr: function() {
            return this.extent
        },
        _setAnalysisGpServerAttr: function(a) {
            a && (this.analysisGpServer = a, this.set("toolServiceUrl", this.analysisGpServer + "/" + this.toolName))
        },
        _setFeatureLayersAttr: function(a) {
            this.featureLayers = e.filter(a, function(a) {
                return -1 !== a.capabilities.indexOf("Extract")
            })
        },
        _getFeatureLayersAttr: function() {
            return this.featureLayers
        },
        _setInputLayersAttr: function(a) {
            this.inputLayers = a
        },
        _getInputLayersAttr: function() {
            return this.inputLayers =
                e.map(this._inputLayersSelect.get("value"), function(a) {
                    return this.featureLayers[parseInt(a, 10)]
                }, this)
        },
        _setClipAttr: function(a) {
            this.clip = a
        },
        _getClipAttr: function() {
            return this.clip = this._clipRadioBtn.get("checked")
        },
        _setDataFormatAttr: function(a) {
            this.dataFormat = a
        },
        _getDataFormatAttr: function() {
            return this._dataFormatSelect.get("value")
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
            this.map = a;
            this._toolbar = new u(this.map);
            this.set("extent", this.map.extent._normalize(!0));
            n.connect(this._toolbar, "onDrawEnd", c.hitch(this, this._addFeatures))
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
        _setShowCreditsAttr: function(a) {
            this.showCredits = a
        },
        _getShowCreditsAttr: function() {
            return this.showCredits
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
            this._webMapFolderSelect && (this.folderStore && this._webMapFolderSelect.item) && (this.folderName =
                this.folderStore.getValue(this._webMapFolderSelect.item, "name"));
            return this.folderName
        },
        validateServiceName: function(a) {
            var b = /(:|&|<|>|%|#|\?|\\|\"|\/|\+)/.test(a);
            return 0 === a.length || 0 === p.trim(a).length ? (this._outputLayerInput.set("invalidMessage", this.i18n.requiredValue), !1) : b ? (this._outputLayerInput.set("invalidMessage", this.i18n.invalidServiceName), !1) : 98 < a.length ? (this._outputLayerInput.set("invalidMessage", this.i18n.invalidServiceNameLength), !1) : !0
        },
        _connect: function(a, b, c) {
            this._pbConnects.push(n.connect(a,
                b, c))
        },
        _showMessages: function(a) {
            y.set(this._bodyNode, "innerHTML", a);
            s.fadeIn({
                node: this._errorMessagePane,
                easing: t.quadIn,
                onEnd: c.hitch(this, function() {
                    h.set(this._errorMessagePane, {
                        display: ""
                    })
                })
            }).play()
        },
        _handleCloseMsg: function(a) {
            a && a.preventDefault();
            s.fadeOut({
                node: this._errorMessagePane,
                easing: t.quadOut,
                onEnd: c.hitch(this, function() {
                    h.set(this._errorMessagePane, {
                        display: "none"
                    })
                })
            }).play()
        },
        _createBoundingPolyFeatColl: function() {
            return new I({
                layerDefinition: null,
                featureSet: {
                    features: [],
                    geometryType: "esriGeometryPolygon"
                },
                layerDefinition: {
                    currentVersion: 10.11,
                    copyrightText: "",
                    defaultVisibility: !0,
                    relationships: [],
                    isDataVersioned: !1,
                    supportsRollbackOnFailureParameter: !0,
                    supportsStatistics: !0,
                    supportsAdvancedQueries: !0,
                    geometryType: "esriGeometryPolygon",
                    minScale: 0,
                    maxScale: 0,
                    objectIdField: "OBJECTID",
                    templates: [],
                    type: "Feature Layer",
                    displayField: "TITLE",
                    visibilityField: "VISIBLE",
                    name: "Boundary",
                    hasAttachments: !1,
                    typeIdField: "TYPEID",
                    capabilities: "Query",
                    allowGeometryUpdates: !0,
                    htmlPopupType: "",
                    hasM: !1,
                    hasZ: !1,
                    globalIdField: "",
                    supportedQueryFormats: "JSON",
                    hasStaticData: !1,
                    maxRecordCount: -1,
                    indexes: [],
                    types: [],
                    drawingInfo: {
                        renderer: {
                            type: "simple",
                            symbol: {
                                color: [0, 0, 0, 255],
                                outline: {
                                    color: [0, 0, 0, 255],
                                    width: 3,
                                    type: "esriSLS",
                                    style: "esriSLSSolid"
                                },
                                type: "esriSFS",
                                style: "esriSFSNull"
                            },
                            label: "",
                            description: ""
                        },
                        transparency: 0,
                        labelingInfo: null,
                        fixedSymbols: !0
                    },
                    fields: [{
                        alias: "OBJECTID",
                        name: "OBJECTID",
                        type: "esriFieldTypeOID",
                        editable: !1
                    }, {
                        alias: "Title",
                        name: "TITLE",
                        length: 50,
                        type: "esriFieldTypeString",
                        editable: !0
                    }, {
                        alias: "Visible",
                        name: "VISIBLE",
                        type: "esriFieldTypeInteger",
                        editable: !0
                    }, {
                        alias: "Description",
                        name: "DESCRIPTION",
                        length: 1073741822,
                        type: "esriFieldTypeString",
                        editable: !0
                    }, {
                        alias: "Type ID",
                        name: "TYPEID",
                        type: "esriFieldTypeInteger",
                        editable: !0
                    }]
                }
            }, {
                id: "boundary"
            })
        }
    })
});