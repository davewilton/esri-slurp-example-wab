//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/kernel", "dojo/has", "dojo/query", "dojo/DeferredList", "dojo/dom-class", "dojo/dom-construct", "dojo/string", "dijit/_Widget", "dijit/_Templated", "../../domUtils", "../../graphicsUtils", "../../geometry/Polyline", "../../geometry/Polygon", "../../graphic", "../../undoManager", "../../tasks/query", "../../layers/FeatureLayer", "../../layers/FeatureTemplate", "../../toolbars/draw", "../../toolbars/edit", "../AttributeInspector", "./Util", "./Add", "./Update", "./Delete", "./toolbars/Drawing", "./SelectionHelper", "./TemplatePicker", "../../kernel", "../../config", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/Editor.html", "dijit/ProgressBar", "dojo/NodeList-dom"], function(w,
    d, h, k, u, Q, R, x, v, y, z, A, B, p, C, D, E, q, F, s, t, g, e, m, G, H, I, J, K, L, M, N, S, O, r, P) {
    var n = w([A, B], {
        declaredClass: "esri.dijit.editing.Editor",
        widgetsInTemplate: !0,
        templateString: P,
        onLoad: function() {},
        constructor: function(a, b) {
            a = a || {};
            a.settings || console.error("Editor: please provide 'settings' parameter in the constructor");
            a.settings.layerInfos || console.error("Editor: please provide 'layerInfos' parameter in the constructor");
            this._settings = a.settings;
            this._eConnects = []
        },
        startup: function() {
            this.inherited(arguments);
            this._setDefaultOptions();
            var a = this._settings.layerInfos;
            if (h.every(a, function(a) {
                    return a.featureLayer.loaded
                })) this._initLayers(), this._connectEvents(), this._createWidgets(), this.onLoad(), this.loaded = !0;
            else {
                var b = a.length;
                h.forEach(a, function(a) {
                    a = a.featureLayer;
                    if (a.loaded) b--;
                    else var f = k.connect(a, "onLoad", this, function(a) {
                        k.disconnect(f);
                        f = null;
                        b--;
                        b || (this._initLayers(), this._connectEvents(), this._createWidgets(), this.onLoad(), this.loaded = !0)
                    })
                }, this)
            }
            this._reset();
            this._enableMapClickHandler()
        },
        stopEditing: function(a) {
            this._updateCurrentFeature(d.hitch(this, function() {
                this._clearSelection(!1);
                a && a()
            }))
        },
        destroy: function() {
            this.drawingToolbar && this.drawingToolbar.destroy();
            this.attributeInspector && this.attributeInspector.destroy();
            this.templatePicker && this.templatePicker.destroy();
            this._selectionHelper && this._selectionHelper.destroy();
            this._drawToolbar && this._drawToolbar.deactivate();
            this._reset();
            this._disableMapClickHandler();
            h.forEach(this._eConnects, k.disconnect);
            k.disconnect(this._dtConnect);
            k.disconnect(this._templatePickerOnSelectionChangeEvent);
            this._layer = this._currentGraphic = this._activeType = this._activeTemplate = this._drawingTool = this._drawToolbar = this._editToolbar = this.drawingToolbar = this.attributeInspector = this.templatePicker = this.undoManager = null;
            this._settings.map.infoWindow && this._settings.map.infoWindow.clearFeatures && this._settings.map.infoWindow.clearFeatures();
            this.inherited(arguments)
        },
        _setDefaultOptions: function() {
            this._drawToolbar = this._settings.drawToolbar || new e(this._settings.map);
            this._settings.drawToolbar = this._drawToolbar;
            this._editToolbar = this._settings.editToolbar || new m(this._settings.map, {
                textSymbolEditorHolder: this.domNode
            });
            this._settings.editToolbar = this._editToolbar;
            this._settings.toolbarVisible = this._settings.toolbarVisible || !1;
            this._settings.toolbarOptions = d.mixin({
                reshapeVisible: !1,
                cutVisible: !1,
                mergeVisible: !1
            }, this._settings.toolbarOptions);
            this._settings.createOptions = d.mixin({
                polylineDrawTools: [n.CREATE_TOOL_POLYLINE],
                polygonDrawTools: [n.CREATE_TOOL_POLYGON],
                editAttributesImmediately: !0
            }, this._settings.createOptions);
            this._settings.singleSelectionTolerance = this._settings.singleSelectionTolerance || 3;
            this._settings.maxUndoRedoOperations = this._settings.maxUndoRedoOperations || 10;
            this._settings.editor = this;
            this._usePopup = this._settings.usePopup = this._settings.map.infoWindow._setPagerCallbacks ? !0 : !1;
            this._datePackage = this._settings.datePackage;
            var a = O.defaults;
            this._settings.geometryService = this._settings.geometryService || a.geometryService;
            a.geometryService =
                a.geometryService || this._settings.geometryService
        },
        _initLayers: function() {
            this._settings.layers = [];
            this._settings.userIds = {};
            this._settings.createOnlyLayer = {};
            h.forEach(this._settings.layerInfos, function(a) {
                if (a.featureLayer && a.featureLayer.loaded) {
                    this._settings.layers.push(a.featureLayer);
                    var b = a.featureLayer.id;
                    a.featureLayer.credential && (this._settings.userIds[b] = a.featureLayer.credential.userId);
                    a.userId && (this._settings.userIds[b] = a.userId);
                    var c = a.featureLayer.getEditCapabilities();
                    this._settings.createOnlyLayer[b] =
                        c.canCreate && !c.canUpdate ? !0 : !1;
                    this._isTextSymbolPointLayer(a.featureLayer) && (a.disableAttributeUpdate = !0)
                }
            }, this)
        },
        _reset: function() {
            this._hideAttributeInspector();
            this._editToolbar.deactivate();
            this._editVertices = !0;
            this._drawingTool = this._activeTemplate = this._activeType = this._currentGraphic = this._layer = null;
            this._attributeChanged = !1
        },
        _saveFeatureOnClient: function(a) {
            var b = this.templatePicker.getSelected(),
                c;
            c = b.template ? b.featureLayer.renderer.getSymbol(b.template.prototype) : b.symbolInfo.symbol;
            this._tempGraphic = new q(a, c, b.template.prototype.attributes, null);
            c = this._settings.map;
            c.graphics.add(this._tempGraphic);
            a = this._findCenterPoint(a);
            this._createAttributeInspector(!0);
            c.infoWindow.setTitle(b.featureLayer ? b.featureLayer.name : r.widgets.attributeInspector.NLS_title);
            this.attributeInspector.showFeature(this._tempGraphic, b.featureLayer);
            this._showInfoWindow(a, c.getInfoWindowAnchor(a));
            this._settings.createOnlyLayer[b.featureLayer.id] && (this._infoWindowHideEvent = k.connect(c.infoWindow, "onHide",
                this, "_infoWindowHide"));
            k.disconnect(this._templatePickerOnSelectionChangeEvent);
            this.templatePicker.clearSelection();
            this._drawToolbar.deactivate();
            this._enableMapClickHandler();
            this.drawingToolbar && this.drawingToolbar.deactivate();
            this._templatePickerOnSelectionChangeEvent = k.connect(this.templatePicker, "onSelectionChange", d.hitch(this, "_onCreateFeature"))
        },
        _saveAttributesOnClient: function(a, b, c) {
            this._tempGraphic.attributes[b] = "number" === typeof c && isNaN(c) ? null : c
        },
        _infoWindowHide: function() {
            this._createFeature(this._tempGraphic.geometry,
                this._tempGraphic.attributes);
            k.disconnect(this._infoWindowHideEvent)
        },
        _createFeature: function(a, b) {
            this._editClickPoint = this._findCenterPoint(a);
            a.rings ? this._simplify(a, d.hitch(this, function(a) {
                this._drawingTool !== g.TOOL_AUTO_COMPLETE_POLYGON ? this._applyEdits([{
                    layer: this._layer,
                    adds: [this._createGraphic(a, b)]
                }]) : this._autoComplete(a, d.hitch(this, function(a) {
                    a && a.length && this._applyEdits([{
                        layer: this._layer,
                        adds: h.map(a, d.hitch(this, function(a) {
                            return this._createGraphic(a, b)
                        }))
                    }])
                }))
            })) : this._applyEdits([{
                layer: this._layer,
                adds: [this._createGraphic(a, b)]
            }])
        },
        _updateCurrentFeature: function(a) {
            var b = this._isModified();
            b ? this._updateFeature(b, a) : a && a(!1)
        },
        _updateFeature: function(a, b) {
            var c = a.geometry;
            c.rings ? this._simplify(c, d.hitch(this, function(c) {
                this._applyEdits([{
                    layer: a.getLayer(),
                    updates: [d.mixin(a, {
                        geometry: c
                    })]
                }], b)
            })) : this._applyEdits([{
                layer: a.getLayer(),
                updates: [a]
            }], b)
        },
        _deleteFeature: function(a, b) {
            var c = [];
            a ? c.push({
                layer: a.getLayer(),
                deletes: [a]
            }) : (c = h.map(h.filter(this._settings.layers, function(a) {
                return 0 <
                    a.getSelectedFeatures().length
            }), function(a) {
                return {
                    layer: a,
                    deletes: a.getSelectedFeatures()
                }
            }), (!c || !c.length) && this._currentGraphic && c.push({
                layer: this._layer,
                deletes: [this._currentGraphic]
            }));
            this._applyEdits(c, b)
        },
        _stopEditing: function(a, b, c, f) {
            p.hide(this.progressBar.domNode);
            this._undoRedoAdd();
            var l;
            !0 === a._isSelOnly || 1 === a.mode || 6 === a.mode ? b && b.length && (this.templatePicker.clearSelection(), l = new s, l.objectIds = [b[0].objectId], this._settings.createOnlyLayer[a.id] ? this._settings.map.graphics.remove(this._tempGraphic) :
                this._selectFeatures([a], l, d.hitch(this, "_onEditFeature"))) : ((l = this._selectionHelper.findMapService(this._settings.map, a)) && l.refresh(), b && b.length && (this.templatePicker.clearSelection(), this._settings.createOnlyLayer[a.id] ? this._settings.map.graphics.remove(this._tempGraphic) : H.findFeatures(b, a, d.hitch(this, "_onEditFeature"))));
            f && f.length && (this._clearSelection(!0), this._undoRedo && (l = this._selectionHelper.findMapService(a, this._settings.map)) && l.refresh());
            this._undoRedo && (c && c.length) && ((l = this._selectionHelper.findMapService(a,
                this._settings.map)) && l.refresh(), this.attributeInspector.refresh(), this._undoRedo = !1);
            this.drawingToolbar && this.drawingToolbar._updateUI();
            this._undoRedo = !1
        },
        _undoRedoAdd: function() {
            this._settings._isApplyEditsCall = !1;
            if (this._settings.undoManager && !("CUT" === this._activeTool || "UNION" === this._activeTool)) {
                var a = this._edits && this._edits.length ? this._edits[0] : null;
                if (a) {
                    var b = a.adds || [],
                        c = a.updates || [],
                        f = a.deletes || [],
                        a = {
                            featureLayer: a.layer
                        };
                    b.length ? this.undoManager.add(new I(d.mixin(a, {
                            addedGraphics: b
                        }))) :
                        f.length ? this.undoManager.add(new K(d.mixin(a, {
                            deletedGraphics: f
                        }))) : c.length && this._preUpdates && this.undoManager.add(new J(d.mixin(a, {
                            preUpdatedGraphics: [this._preUpdates],
                            postUpdatedGraphics: c
                        })));
                    this._preUpdates = this._edits = null
                }
            }
        },
        _activateDrawToolbar: function(a) {
            this._layer = a.featureLayer;
            this._activeType = a.type;
            this._drawingTool = (this._activeTemplate = a.template) ? this._activeTemplate.drawingTool : null;
            this._drawTool = this._toDrawTool(this._drawingTool, a.featureLayer);
            k.disconnect(this._dtConnect);
            this._dtConnect = this._settings.createOnlyLayer[a.featureLayer.id] ? k.connect(this._drawToolbar, "onDrawEnd", this, "_saveFeatureOnClient") : k.connect(this._drawToolbar, "onDrawEnd", this, "_createFeature");
            this._editToolbar.deactivate();
            this._disableMapClickHandler();
            this.drawingToolbar ? this.drawingToolbar.activateEditing(this._drawTool, this._layer) : this._drawToolbar.activate(this._drawTool)
        },
        _activateEditToolbar: function(a, b) {
            var c = a.getLayer(),
                f = c ? c.geometryType : null,
                l = this._isTextSymbolPoint(a),
                e = m.MOVE;
            "esriGeometryPoint" !== f && !0 === this._isNotesFeature(a) ? (e = e | m.ROTATE | m.SCALE, this._editVertices = !1) : "esriGeometryPoint" !== f && !0 === this._editVertices ? (e = e | m.ROTATE | m.SCALE, this._editVertices = !1) : l ? (e = e | m.ROTATE | m.SCALE | m.EDIT_TEXT, this._editVertices = !1) : (e |= m.EDIT_VERTICES, this._editVertices = !0);
            this._attributeChanged = this._isModified();
            this._preUpdates = new q(d.clone(a.toJson()));
            var f = c.getEditCapabilities({
                    feature: a,
                    userId: this._settings.userIds[c.id]
                }),
                g = h.filter(this._settings.layerInfos, function(a) {
                    return a.featureLayer.layerId ===
                        c.layerId
                })[0];
            f.canUpdate && (!g.disableGeometryUpdate && c.allowGeometryUpdates) && (this._editToolbar.activate(e, a), l && (this._editToolbar._textEditor._addTextBox(a), this._editToolbar._textSymbolEditor && this._editToolbar._textSymbolEditor.hide()));
            !this._settings.map.infoWindow.isShowing && !this._updateAttributeDisabled(a) && (l = b && b.screenPoint || this._findCenterPoint(a), this._showInfoWindow(l, this._settings.map.getInfoWindowAnchor(l)))
        },
        _createGraphic: function(a, b) {
            var c = new q(a, this._activeType && this._activeType.symbol ||
                this._layer.defaultSymbol, b);
            this._activeTemplate || b ? c.attributes = b || d.mixin({}, this._activeTemplate.prototype.attributes) : (c.attributes = c.attributes || [], h.forEach(this._layer.fields, function(a) {
                c.attributes[a.name] = null
            }, this));
            return c
        },
        _connectEvents: function() {
            var a = this._settings.layers;
            h.forEach(a, function(a) {
                this._connect(a, "onEditsComplete", d.hitch(this, "_stopEditing", a))
            }, this);
            h.forEach(a, function(a) {
                this._connect(a, "onBeforeApplyEdits", d.hitch(this, function() {
                    p.show(this.progressBar.domNode);
                    this._settings._isApplyEditsCall = !0
                }))
            }, this);
            this._connect(this._editToolbar, "onGraphicClick", d.hitch(this, "_activateEditToolbar"));
            this._connect(this._editToolbar, "onGraphicFirstMove", d.hitch(this, "_hideAttributeInspector"));
            this._connect(this._editToolbar, "onVertexFirstMove", d.hitch(this, "_hideAttributeInspector"));
            this._connect(this._editToolbar, "onScaleStart", d.hitch(this, "_hideAttributeInspector"));
            this._connect(this._editToolbar, "onRotateStart", d.hitch(this, "_hideAttributeInspector"))
        },
        _connect: function(a,
            b, c) {
            this._eConnects.push(k.connect(a, b, c))
        },
        _createWidgets: function() {
            this._selectionHelper = new M(this._settings);
            this._createTemplatePicker();
            this._createAttributeInspector();
            this._createDrawingToolbar();
            this._createUndoRedoManager()
        },
        _createTemplatePicker: function() {
            if (this._settings.templatePicker) this.templatePicker = this._settings.templatePicker, p.hide(this.templatePickerDiv);
            else {
                var a = h.filter(this._settings.layers, function(a) {
                    return a.getEditCapabilities().canCreate
                });
                this.templatePicker =
                    new N({
                        "class": "esriTemplatePicker",
                        featureLayers: a,
                        showTooltip: !0,
                        maxLabelLength: this._settings.typesCharacterLimit,
                        columns: "auto",
                        rows: "auto"
                    }, this.templatePickerDiv);
                this.templatePicker.startup();
                this._settings.templatePicker = this.templatePicker
            }
            this._templatePickerOnSelectionChangeEvent = k.connect(this.templatePicker, "onSelectionChange", d.hitch(this, "_onCreateFeature"))
        },
        _createAttributeInspector: function(a) {
            if (this._settings.attributeInspector) this._customAttributeInspector = !0, this.attributeInspector =
                this._settings.attributeInspector;
            else {
                this._customAttributeInspector = !1;
                var b = this._settings.map;
                this.attributeInspector = new G({
                    layerInfos: this._settings.layerInfos,
                    hideNavButtons: this._usePopup,
                    datePackage: this._datePackage
                }, y.create("div"));
                this.attributeInspector.startup();
                b.infoWindow.setContent(this.attributeInspector.domNode);
                b.infoWindow.setTitle(r.widgets.attributeInspector.NLS_title);
                b.infoWindow.resize(350, 375);
                u.query(".esriAttributeInspector .atiLayerName").style({
                    display: "none"
                })
            }
            this._connect(this.attributeInspector,
                "onDelete", d.hitch(this, "_deleteFeature"));
            this._connect(this.attributeInspector, "onNext", d.hitch(this, function(a) {
                this._updateCurrentFeature(d.hitch(this, function() {
                    this._attributeChanged = !1;
                    this._onEditFeature(a)
                }))
            }));
            this._usePopup && this._settings.map.infoWindow._setPagerCallbacks(this.attributeInspector, d.hitch(this.attributeInspector, "next"), d.hitch(this.attributeInspector, "previous"));
            a ? this._connect(this.attributeInspector, "onAttributeChange", d.hitch(this, "_saveAttributesOnClient")) : this._connect(this.attributeInspector,
                "onAttributeChange", d.hitch(this, function(a, b, e) {
                    this._preUpdates = new q(d.clone(a.toJson()));
                    a = a.getLayer();
                    (a = h.filter(a.fields, function(a) {
                        return a.name === b
                    })[0]) && (!a.nullable && "" === e) && (e = null);
                    this._currentGraphic.attributes[b] = "number" === typeof e && isNaN(e) ? null : e;
                    this._updateFeature(this._currentGraphic, null);
                    this._attributeChanged = !1
                }))
        },
        _createDrawingToolbar: function() {
            !0 === this._settings.toolbarVisible && (this.drawingToolbar = new L({
                "class": "esriDrawingToolbar",
                drawToolbar: this._drawToolbar,
                editToolbar: this._editToolbar,
                settings: this._settings,
                onDelete: d.hitch(this, "_deleteFeature"),
                onApplyEdits: d.hitch(this, "_applyEdits"),
                onShowAttributeInspector: d.hitch(this, "_onEditFeature")
            }, this.drawingToolbarDiv))
        },
        _createUndoRedoManager: function() {
            if (this._settings.enableUndoRedo || this._settings.undoManager) this._settings.enableUndoRedo = !0, this.undoManager = this._settings.undoManager, this.undoManager || (this.undoManager = this._settings.undoManager = new F({
                    maxOperations: this._settings.maxUndoRedoOperations
                })),
                this._connect(document, "onkeypress", d.hitch(this, function(a) {
                    if (a.metaKey || a.ctrlKey) "z" === a.charOrCode && this._undo(), "y" === a.charOrCode && this._redo()
                }))
        },
        _enableMapClickHandler: function() {
            this._mapClickHandler = k.connect(this._settings.map, "onClick", d.hitch(this, function(a) {
                this._drawToolbar._geometryType || ("SELECT" === this._activeTool ? this._activeTool = "" : this._updateCurrentFeature(d.hitch(this, function() {
                    this._reset();
                    this._updateSelection(a)
                })))
            }))
        },
        _disableMapClickHandler: function() {
            k.disconnect(this._mapClickHandler)
        },
        _onCreateFeature: function() {
            var a = this.templatePicker.getSelected();
            a ? this._updateCurrentFeature(d.hitch(this, function() {
                this._currentGraphic && this._clearSelection(!1);
                this._reset();
                this._activateDrawToolbar(a)
            })) : (this._reset(), k.disconnect(this._dtConnect), this._drawToolbar.deactivate(), this._enableMapClickHandler(), this.drawingToolbar && this.drawingToolbar.deactivate())
        },
        _isTextSymbolPoint: function(a) {
            if ("point" === a.geometry.type || "multipoint" === a.geometry.type) {
                var b = a.getLayer(),
                    c = b.renderer;
                a = a.symbol || b._getSymbol(a);
                !a && (c.hasVisualVariables() && c.addBreak && c.infos && 1 === c.infos.length) && (a = c.infos[0].symbol || c.defaultSymbol);
                if (a && "textsymbol" === a.type) return !0
            }
            return !1
        },
        _isTextSymbolPointLayer: function(a) {
            return "esriGeometryPoint" === a.geometryType && a.renderer && a.renderer._symbols && a.renderer._symbols[0] && a.renderer._symbols[0].symbol && "textsymbol" === a.renderer._symbols[0].symbol.type ? !0 : !1
        },
        _updateAttributeDisabled: function(a) {
            a = a.getLayer();
            if (!a) return !1;
            var b, c, f = !1;
            for (b = 0; b < this._settings.layerInfos.length; b++)
                if (c =
                    this._settings.layerInfos[b], c.featureLayer == a) {
                    f = c.disableAttributeUpdate;
                    break
                }
            return f
        },
        _onEditFeature: function(a, b) {
            if (a = (d.isArray(a) ? a[0] : a) || null) {
                this._layer = a.getLayer();
                if (!this._customAttributeInspector && !this._updateAttributeDisabled(a)) {
                    b = b || this._editClickPoint || this._findCenterPoint(a);
                    if (1 < this._currentFeatureCount) {
                        this._popupFeatures.indexOf(a);
                        var c = this._currentFeatureCount - this._popupFeatures.indexOf(a) + 1;
                        c > this._currentFeatureCount && (c = 1);
                        this._settings.map.infoWindow.setTitle(z.substitute(r.widgets.popup.NLS_pagingInfo, {
                            index: c,
                            total: this._currentFeatureCount
                        }))
                    } else this._settings.map.infoWindow.setTitle(this._layer ? this._layer.name : r.widgets.attributeInspector.NLS_title);
                    (this.drawingToolbar || !this._settings.map.infoWindow.isShowing) && this._showInfoWindow(b, this._settings.map.getInfoWindowAnchor(b));
                    this._editClickPoint = null
                }
                a !== this._currentGraphic && (this._editVertices = !0, this._currentGraphic = a, a.getDojoShape() && a.getDojoShape().moveToFront(), this._activateEditToolbar(a))
            }
        },
        _applyEdits: function(a, b) {
            a = a || [];
            if (!(0 >= a.length)) {
                this._edits = a;
                var c = [];
                h.forEach(a, function(a) {
                    a.layer && c.push(a.layer.applyEdits(a.adds, a.updates, a.deletes))
                });
                0 < c.length && (this._deferredsList = (new x(c)).addCallback(d.hitch(this, function() {
                    p.hide(this.progressBar.domNode);
                    b && b();
                    var a = this._settings.map;
                    a && (a.infoWindow.reposition && a.infoWindow.isShowing) && a.infoWindow.reposition()
                })))
            }
        },
        _undo: function() {
            this._settings.undoManager && !this._settings._isApplyEditsCall && (this._editToolbar.deactivate(), this._undoRedo = !0, this._settings.undoManager.undo())
        },
        _redo: function() {
            this._settings.undoManager && !this._settings._isApplyEditsCall && (this._editToolbar.deactivate(), this._undoRedo = !0, this._settings.undoManager.redo())
        },
        _simplify: function(a, b) {
            E.prototype.isSelfIntersecting(a) ? this._settings.geometryService.simplify([a], function(a) {
                var f = a && a.length ? a[0] : f;
                b && b(f)
            }) : b && b(a)
        },
        _autoComplete: function(a, b) {
            var c = this._getLayers("esriGeometryPolygon"),
                f = new s;
            f.geometry = a;
            f.returnGeometry = !0;
            this._selectFeatures(c, f, d.hitch(this, function(c) {
                !c || 0 >= c.length ?
                    b && b([a]) : this._settings.geometryService.autoComplete(C.getGeometries(c), this._toPolylines([f.geometry]), function(a) {
                        b && b(a)
                    })
            }))
        },
        _getLayers: function(a) {
            return h.filter(this._settings.layers, function(b) {
                return b.geometryType === a
            })
        },
        _selectFeatures: function(a, b, c, f) {
            this._selectionHelper.selectFeatures(a, b, f || t.SELECTION_NEW, c)
        },
        _updateSelection: function(a) {
            var b = a.mapPoint,
                c = a.graphic;
            this._selectionHelper.selectFeaturesByGeometry(this._settings.layers, b, t.SELECTION_NEW, d.hitch(this, function(a) {
                var e =
                    h.some(a, d.hitch(this, function(a) {
                        return a == c
                    }));
                c && !e ? (a = c.getLayer(), this._isValidLayer(a) ? (e = new s, e.objectIds = [c.attributes[a.objectIdField]], this._selectionHelper.selectFeatures([a], e, t.SELECTION_ADD, d.hitch(this, function(a) {
                    this._updatePopupButtons(a);
                    this._onEditFeature(a, b)
                }))) : this._clearSelection()) : a && a.length ? (this._updatePopupButtons(a), this._onEditFeature(a, b)) : this._clearSelection()
            }));
            c && this._isTextSymbolPoint(c) && (a = 0 | m.MOVE | m.ROTATE | m.SCALE | m.EDIT_TEXT, this._editToolbar.activate(a,
                c))
        },
        _updatePopupButtons: function(a) {
            if (!this._usePopup || !a) this._currentFeatureCount = this._popupFeatures = null;
            else {
                var b = a.length;
                h.forEach([this._settings.map.infoWindow._prevFeatureButton, this._settings.map.infoWindow._nextFeatureButton], d.hitch(this, function(a) {
                    1 < b ? v.remove(a, "hidden") : v.add(a, "hidden")
                }));
                var c = 1 < b ? "block" : "none";
                u.query(".esriAttributeInspector .atiLayerName").style({
                    display: c
                });
                this._currentFeatureCount = b;
                this._popupFeatures = a
            }
        },
        _clearSelection: function(a) {
            this._currentFeatureCount =
                0;
            this._popupFeatures = null;
            this._selectionHelper.clearSelection(a || !1);
            this._reset()
        },
        _findCenterPoint: function(a) {
            a = a.geometry || a;
            var b;
            switch (a.type) {
                case "point":
                    b = a;
                    break;
                case "polyline":
                    b = a.getPoint(0, Math.ceil(a.paths[0].length / 2));
                    break;
                case "polygon":
                    b = a.rings.length - 1, b = a.getPoint(b, a.rings[b].length - 1)
            }
            return this._settings.map.toScreen(b)
        },
        _hideAttributeInspector: function() {
            !this._customAttributeInspector && this._settings.map.infoWindow && this._settings.map.infoWindow.hide()
        },
        _toPolylines: function(a) {
            return h.map(a,
                function(a) {
                    var c = new D(a.spatialReference);
                    h.forEach(a.rings, function(a) {
                        c.addPath(a)
                    });
                    return c
                })
        },
        _isNotesFeature: function(a) {
            var b = a.getLayer(),
                c = b ? b.types || null : null;
            if (!c) return !1;
            var e = a.attributes[b.typeIdField],
                d;
            h.some(c, function(a) {
                return a.id === e ? (d = a.templates, !0) : !1
            });
            if (!d) return !1;
            a = d[0] || null;
            return !a ? !1 : this._isShapeTool(a.drawingTool) ? !0 : !1
        },
        _isValidLayer: function(a) {
            var b, c = this._settings.layerInfos;
            for (b = 0; b < c.length; b++)
                if (a.id == c[b].layerId) return !0;
            return !1
        },
        _isShapeTool: function(a) {
            switch (a) {
                case g.TOOL_ARROW:
                    return e.ARROW;
                case g.TOOL_LEFT_ARROW:
                    return e.LEFT_ARROW;
                case g.TOOL_RIGHT_ARROW:
                    return e.RIGHT_ARROW;
                case g.TOOL_UP_ARROW:
                    return e.UP_ARROW;
                case g.TOOL_DOWN_ARROW:
                    return e.DOWN_ARROW;
                case g.TOOL_CIRCLE:
                    return e.CIRCLE;
                case g.TOOL_ELLIPSE:
                    return e.ELLIPSE;
                case g.TOOL_TRIANGLE:
                    return e.TRIANGLE;
                case g.TOOL_RECTANGLE:
                    return e.RECTANGLE;
                default:
                    return null
            }
        },
        _toDrawTool: function(a, b) {
            var c = b.geometryType;
            switch (a) {
                case g.TOOL_POINT:
                    return e.POINT;
                case g.TOOL_ARROW:
                    return e.ARROW;
                case g.TOOL_LEFT_ARROW:
                    return e.LEFT_ARROW;
                case g.TOOL_RIGHT_ARROW:
                    return e.RIGHT_ARROW;
                case g.TOOL_UP_ARROW:
                    return e.UP_ARROW;
                case g.TOOL_DOWN_ARROW:
                    return e.DOWN_ARROW;
                case g.TOOL_CIRCLE:
                    return e.CIRCLE;
                case g.TOOL_ELLIPSE:
                    return e.ELLIPSE;
                case g.TOOL_TRIANGLE:
                    return e.TRIANGLE;
                case g.TOOL_RECTANGLE:
                    return e.RECTANGLE;
                case g.TOOL_LINE:
                    return e.POLYLINE;
                case g.TOOL_POLYGON:
                    return e.POLYGON;
                case g.TOOL_FREEHAND:
                    return "esriGeometryPolyline" === c ? e.FREEHAND_POLYLINE : e.FREEHAND_POLYGON;
                default:
                    var d = e.POINT;
                    "esriGeometryPolyline" === c ? (d = e.POLYLINE,
                        this._settings.createOptions.polylineDrawTools[0] === n.CREATE_TOOL_FREEHAND_POLYLINE && (d = e.FREEHAND_POLYLINE)) : "esriGeometryPolygon" === c && (d = e.POLYGON, this._settings.createOptions.polygonDrawTools[0] === n.CREATE_TOOL_FREEHAND_POLYGON && (d = e.FREEHAND_POLYGON));
                    return d
            }
        },
        _isModified: function() {
            var a = this._editToolbar.getCurrentState();
            return (a.isModified || this._attributeChanged) && a.graphic ? a.graphic : null
        },
        _showInfoWindow: function(a, b) {
            this._customAttributeInspector || this._settings.map.infoWindow.show(a,
                b)
        }
    });
    d.mixin(n, {
        CREATE_TOOL_POLYLINE: "polyline",
        CREATE_TOOL_FREEHAND_POLYLINE: "freehandpolyline",
        CREATE_TOOL_POLYGON: "polygon",
        CREATE_TOOL_FREEHAND_POLYGON: "freehandpolygon",
        CREATE_TOOL_AUTOCOMPLETE: "autocomplete",
        CREATE_TOOL_RECTANGLE: "rectangle",
        CREATE_TOOL_TRIANGLE: "triangle",
        CREATE_TOOL_CIRCLE: "circle",
        CREATE_TOOL_ELLIPSE: "ellipse",
        CREATE_TOOL_ARROW: "arrow",
        CREATE_TOOL_UP_ARROW: "uparrow",
        CREATE_TOOL_DOWN_ARROW: "downarrow",
        CREATE_TOOL_RIGHT_ARROW: "rightarrow",
        CREATE_TOOL_LEFT_ARROW: "leftarrow"
    });
    return n
});