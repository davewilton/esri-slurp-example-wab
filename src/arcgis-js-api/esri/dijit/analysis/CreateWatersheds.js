//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/Color", "dojo/_base/json", "dojo/has", "dojo/json", "dojo/string", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "dojo/query", "dojo/dom-class", "dojo/number", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/_OnDijitClickMixin", "dijit/_FocusMixin", "dijit/registry", "dijit/form/Button", "dijit/form/CheckBox", "dijit/form/Form", "dijit/form/Select", "dijit/form/TextBox", "dijit/form/NumberSpinner", "dijit/form/ValidationTextBox", "dijit/layout/ContentPane", "dijit/form/ComboBox", "dijit/Dialog", "../../kernel", "../../lang", "./AnalysisBase", "../../symbols/SimpleFillSymbol", "../../symbols/SimpleLineSymbol", "../../toolbars/draw", "../PopupTemplate", "../../layers/FeatureLayer", "../../graphic", "./utils", "./CreditEstimator", "../../symbols/PictureMarkerSymbol", "dijit/form/HorizontalSlider", "dijit/form/HorizontalRule", "dijit/form/HorizontalRuleLabels", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/CreateWatersheds.html"], function(l, m, b, n, e, z, c, A, B, f, h, p, C, D, q, E, r, s, t, u, v, F, G, H, I, J, K, L, M, N, O, P, Q, R, w, S, T, k, U, V, W, g, X, Y, Z, $, aa, x, y) {
    return m([r, s, t, u, v, w], {
        declaredClass: "esri.dijit.analysis.CreateWatersheds",
        templateString: y,
        basePath: l.toUrl("."),
        widgetsInTemplate: !0,
        inputLayer: null,
        searchDistance: null,
        searchUnits: "Meters",
        outputLayerName: null,
        showSelectFolder: !1,
        showChooseExtent: !0,
        showHelp: !0,
        returnFeatureCollection: !1,
        showCredits: !0,
        i18n: null,
        map: null,
        toolName: "CreateWatersheds",
        helpFileName: "CreateWatersheds",
        resultParameter: ["watershedLayer",
            "snapPourPtsLayer"
        ],
        constructor: function(a, d) {
            this._pbConnects = [];
            a.containerNode && (this.container = a.containerNode)
        },
        destroy: function() {
            this.inherited(arguments);
            n.forEach(this._pbConnects, e.disconnect);
            delete this._pbConnects
        },
        postMixInProperties: function() {
            this.inherited(arguments);
            b.mixin(this.i18n, x.createWatershedTool)
        },
        postCreate: function() {
            this.inherited(arguments);
            q.add(this._form.domNode, "esriSimpleForm");
            this._outputLayerInput.set("validator", b.hitch(this, this.validateServiceName));
            this._buildUI()
        },
        startup: function() {},
        _onClose: function(a) {
            this.emit("close", {
                save: !a
            })
        },
        clear: function() {},
        _handleShowCreditsClick: function(a) {
            a.preventDefault();
            a = {};
            this._form.validate() && (a.inputLayer = c.toJson(g.constructAnalysisInputLyrObj(this.get("inputLayer"))), a.searchDistance = this.get("searchDistance"), a.searchUnits = this.get("searchUnits"), this.returnFeatureCollection || (a.OutputName = c.toJson({
                    serviceProperties: {
                        name: this.get("outputLayerName")
                    }
                })), this.showChooseExtent && this._useExtentCheck.get("checked") &&
                (a.context = c.toJson({
                    extent: this.map.extent._normalize(!0)
                })), this.getCreditsEstimate(this.toolName, a).then(b.hitch(this, function(a) {
                    this._usageForm.set("content", a);
                    this._usageDialog.show()
                })))
        },
        _handleSaveBtnClick: function(a) {
            if (this._form.validate()) {
                this._saveBtn.set("disabled", !0);
                a = {};
                var d = {},
                    b;
                a.inputLayer = c.toJson(g.constructAnalysisInputLyrObj(this.get("inputLayer")));
                a.searchDistance = this.get("searchDistance");
                a.searchUnits = this.get("searchUnits");
                this.returnFeatureCollection || (a.OutputName =
                    c.toJson({
                        serviceProperties: {
                            name: this.get("outputLayerName")
                        }
                    }));
                this.showChooseExtent && !this.get("disableExtent") && this._useExtentCheck.get("checked") && (a.context = c.toJson({
                    extent: this.map.extent._normalize(!0)
                }));
                this.returnFeatureCollection && (b = {
                    outSR: this.map.spatialReference
                }, this.showChooseExtent && (b.extent = this.map.extent._normalize(!0)), a.context = c.toJson(b));
                a.returnFeatureCollection = this.returnFeatureCollection;
                d.jobParams = a;
                d.itemParams = {
                    description: this.i18n.itemDescription,
                    tags: f.substitute(this.i18n.itemTags, {
                        layername: this.inputLayer.name,
                        fieldname: !a.field ? "" : a.field
                    }),
                    snippet: this.i18n.itemSnippet
                };
                this.showSelectFolder && (d.itemParams.folder = this.get("folderId"));
                console.log(d);
                this.execute(d)
            }
        },
        _save: function() {},
        _buildUI: function() {
            this._loadConnections();
            this.signInPromise.then(b.hitch(this, g.initHelpLinks, this.domNode, this.showHelp, {
                analysisGpServer: this.analysisGpServer
            }));
            this.inputLayer && (p.set(this._interpolateToolDescription, "innerHTML", f.substitute(this.i18n.toolDefine, {
                    layername: this.inputLayer.name
                })),
                this._outputLayerInput.set("value", f.substitute(this.i18n.outputLayerName, {
                    layername: this.inputLayer.name
                })));
            this.outputLayerName && this._outputLayerInput.set("value", this.outputLayerName);
            h.set(this._chooseFolderRow, "display", !0 === this.showSelectFolder ? "block" : "none");
            this.showSelectFolder && this.getFolderStore().then(b.hitch(this, function(a) {
                this.folderStore = a;
                g.setupFoldersUI({
                    folderStore: this.folderStore,
                    folderId: this.folderId,
                    folderName: this.folderName,
                    folderSelect: this._webMapFolderSelect,
                    username: this.portalUser ?
                        this.portalUser.username : ""
                })
            }));
            h.set(this._chooseExtentDiv, "display", !0 === this.showChooseExtent ? "inline-block" : "none");
            h.set(this._showCreditsLink, "display", !0 === this.showCredits ? "block" : "none");
            this._distanceUnitsSelect.addOption([{
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
            }]);
            this.searchUnits && this._distanceUnitsSelect.set("value",
                this.searchUnits);
            this.searchDistance && this._searchDistanceInput.set("value", this.searchDistance)
        },
        _loadConnections: function() {
            this.on("start", b.hitch(this, "_onClose", !1));
            this._connect(this._closeBtn, "onclick", b.hitch(this, "_onClose", !0))
        },
        validateServiceName: function(a) {
            var b = /(:|&|<|>|%|#|\?|\\|\"|\/|\+)/.test(a);
            return 0 === a.length || 0 === f.trim(a).length ? (this._outputLayerInput.set("invalidMessage", this.i18n.requiredValue), !1) : b ? (this._outputLayerInput.set("invalidMessage", this.i18n.invalidServiceName), !1) : 98 < a.length ? (this._outputLayerInput.set("invalidMessage", this.i18n.invalidServiceNameLength), !1) : !0
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
        _getOutputLayerNameAttr: function() {
            this._outputLayerInput && (this.outputLayerName = this._outputLayerInput.get("value"));
            return this.outputLayerName
        },
        _setOutputLayerNameAttr: function(a) {
            this.outputLayerName =
                a
        },
        _setMapAttr: function(a) {
            this.map = a;
            this._toolbar = new k(this.map);
            e.connect(this._toolbar, "onDrawEnd", b.hitch(this, this._addFeatures));
            this._pointtoolbar = new k(this.map);
            e.connect(this._pointtoolbar, "onDrawEnd", b.hitch(this, this._addPointFeatures))
        },
        _getMapAttr: function() {
            return this.map
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
            this.showChooseExtent =
                a
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
        _setSearchUnitsAttr: function(a) {
            this.searchUnits = a
        },
        _getSearchUnitsAttr: function() {
            this._distanceUnitsSelect && this._distanceUnitsSelect.get("value") && (this.searchUnits = this._distanceUnitsSelect.get("value"));
            return this.searchUnits
        },
        _setSearchDistanceAttr: function(a) {
            this.searchDistance = a
        },
        _getSearchDistanceAttr: function() {
            this._searchDistanceInput && this._searchDistanceInput.get("value") &&
                (this.searchDistance = this._searchDistanceInput.get("value"));
            return this.searchDistance
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
            this._webMapFolderSelect && (this.folderStore && this._webMapFolderSelect.item) &&
                (this.folderName = this.folderStore.getValue(this._webMapFolderSelect.item, "name"));
            return this.folderName
        },
        _connect: function(a, b, c) {
            this._pbConnects.push(e.connect(a, b, c))
        }
    })
});