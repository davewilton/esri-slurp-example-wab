//>>built
define(["require", "dojo/on", "dojo/Evented", "dojo/has", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/Deferred", "dojo/_base/array", "dojo/text!./GeocodeReview/templates/Review.html", "dojo/i18n!../nls/jsapi", "dojo/store/Memory", "dojo/string", "dojo/dom", "dojo/dom-style", "dijit/_WidgetBase", "dijit/_OnDijitClickMixin", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dgrid/OnDemandGrid", "dgrid/Selection", "dgrid/Keyboard", "dgrid/editor", "dgrid/extensions/DijitRegistry", "dgrid/extensions/ColumnHider", "../graphic", "../geometry/Extent", "../geometry/Point", "../geometry/webMercatorUtils", "../symbols/PictureMarkerSymbol", "../tasks/query", "../layers/FeatureLayer", "../layers/GraphicsLayer", "../request", "../arcgis/utils", "../kernel"], function(z, h, A, P, p, e, B, t, C, f, k, l, D, q, E, F, G, H, I, J, K, r, L, M, m, u, N, v, s, w, n, O, x, y, Q) {
    return p([E, F, G, H, A], {
        baseClass: "esriReviewContainer",
        basePath: z.toUrl("./GeocodeReview/"),
        loaded: !1,
        templateString: C,
        widgetsInTemplate: !0,
        i18n: f,
        constructor: function(a, b) {
            p.safeMixin(this, a);
            this.StandardGrid = p([L, I, J, K, r, M]);
            this._defineGridStores();
            this._defineColumns();
            this.stackContainerID = b + "_StackContainerNode";
            this.headerID = b + "_HeaderNode";
            this.unmatchedUC = f.widgets.geocodeReview.unmatchedUC;
            this.matchedUC = f.widgets.geocodeReview.matchedUC;
            this.reviewedUC = f.widgets.geocodeReview.reviewedUC;
            this.suggestionGraphic || (this.suggestionGraphic = new s(this.basePath.toString() + "images/EsriBluePinCircle26.png", 26, 26), this.suggestionGraphic.setOffset(0, 12));
            this.matchGraphic || (this.matchGraphic = new s(this.basePath.toString() + "images/EsriGreenPinCircle26.png", 26, 26), this.matchGraphic.setOffset(0, 12));
            this.highlightGraphic || (this.highlightGraphic = new s(this.basePath.toString() + "images/EsriYellowPinCircle26.png", 26, 26), this.highlightGraphic.setOffset(0,
                12));
            this._keywordMap = {};
            this._keywordArray = [];
            this._arcgisUrl = e.getObject("esri.arcgis.utils.arcgisUrl");
            this._singleLineInput = !0
        },
        postCreate: function() {
            this.inherited(arguments);
            this._generateGrids();
            this.graphicsLayer = new O;
            this.map.addLayer(this.graphicsLayer);
            this._listenerHandles = [this.StackControllerNode.on("selectChild", e.hitch(this, function() {
                    this.clearGridSelection();
                    this.StackContainerNode.selectedChildWidget && (this.currentTab = this.StackContainerNode.selectedChildWidget, this.currentTabId =
                        this.StackContainerNode.selectedChildWidget.id);
                    this.resize();
                    this.graphicsLayer.clear();
                    this.emit("tab-change", {});
                    this.geocodeMatch && this.geocodeMatch.reset()
                })), h(this.map, "resize", e.hitch(this, function() {
                    this.resize()
                })), h(window, "resize", e.hitch(this, function() {
                    this.resize()
                })), h(this._gridUnmatchedRef, "dgrid-select", e.hitch(this, function(a) {
                    a.rows[0].data.oid ? (this.currentSelectedRow = this._unmatchedStore.get(a.rows[0].data.oid), this._selectGridRowEvent(a.rows[0].data.oid, this.currentSelectedRow)) :
                        (this.currentSelectedRow = this._unmatchedStore.get(a.rows[0].data[this._tableLayer.objectIdField]), this._selectGridRowEvent(a.rows[0].data[this._tableLayer.objectIdField], this._unmatchedStore.get(a.rows[0].data[this._tableLayer.objectIdField])))
                })), h(this._gridMatchedRef, "dgrid-select", e.hitch(this, function(a) {
                    this.currentSelectedRow = this._matchedStore.get(a.rows[0].data[this._featureLayer.objectIdField]);
                    this._selectGridRowEvent(a.rows[0].data[this._featureLayer.objectIdField], this._matchedStore.get(a.rows[0].data[this._featureLayer.objectIdField]))
                })),
                h(this._gridReviewedRef, "dgrid-select", e.hitch(this, function(a) {
                    this.currentSelectedRow = this._reviewedStore.get(a.rows[0].data.id);
                    this._drawReviewedRow(a.rows[0].data)
                })), h(this._gridMatchedRef, "dgrid-datachange", e.hitch(this, function(a) {
                    var b = null,
                        d, c = a.cell.row.data;
                    this._matchedStore.get(a.cell.row.id).updated = !0;
                    this._matchedStore.get(a.cell.row.id)[a.cell.column.field] = a.value;
                    this._matchedStore.get(a.cell.row.id).location && (b = this._matchedStore.get(a.cell.row.id).location);
                    d = this._singleLineInput ? {
                        id: c[this._featureLayer.objectIdField],
                        address: c[this._keywordMap.Address],
                        location: b,
                        featureType: c.featureType,
                        reviewed: c.reviewed,
                        updated: !0,
                        sourceCountry: this._sourceCountry
                    } : {
                        id: c[this._featureLayer.objectIdField],
                        address: this._formatLocatorOptions(c),
                        location: b,
                        featureType: c.featureType,
                        reviewed: c.reviewed,
                        updated: !0,
                        sourceCountry: this._sourceCountry
                    };
                    this.emit("row-datachange", {
                        newAddress: a.value,
                        oldAddress: a.oldValue,
                        location: b,
                        rowData: c,
                        returnData: d
                    });
                    this.geocodeMatch && this.geocodeMatch.geocodeAddress(d);
                    this._applyAddressEdits(this._matchedStore.get(a.cell.row.id))
                })), h(this._gridUnmatchedRef, "dgrid-datachange", e.hitch(this, function(a) {
                    var b = null,
                        d, c = a.cell.row.data;
                    this._unmatchedStore.get(a.cell.row.id).updated = !0;
                    this._unmatchedStore.get(a.cell.row.id)[a.cell.column.field] = a.value;
                    this._unmatchedStore.get(a.cell.row.id).location && (b = this._unmatchedStore.get(a.cell.row.id).location);
                    d = this._singleLineInput ? {
                        id: c[this._tableLayer.objectIdField],
                        address: c[this._keywordMap.Address],
                        location: b,
                        featureType: c.featureType,
                        reviewed: c.reviewed,
                        updated: !0,
                        sourceCountry: this._sourceCountry
                    } : {
                        id: c[this._tableLayer.objectIdField],
                        address: this._formatLocatorOptions(c),
                        location: b,
                        featureType: c.featureType,
                        reviewed: c.reviewed,
                        updated: !0,
                        sourceCountry: this._sourceCountry
                    };
                    this.emit("row-datachange", {
                        newAddress: a.value,
                        oldAddress: a.oldValue,
                        location: b,
                        rowData: c,
                        returnData: d
                    });
                    this.geocodeMatch && this.geocodeMatch.geocodeAddress(d);
                    this._applyAddressEdits(this._unmatchedStore.get(a.cell.row.id))
                }))
            ];
            this.geocodeMatch && this._listenerHandles.push(this._geocodeMatchHandler())
        },
        startup: function() {
            this.inherited(arguments);
            this.domNode && this.map && (this.map.loaded ? this._init() : h(this.map, "load", e.hitch(this, function() {
                this._init()
            })))
        },
        matchFeature: function(a) {
            var b;
            b = this.currentSelectedRow;
            b.updated = !0;
            b.reviewed = !0;
            b.oid = b[this._unmatchedStore.idProperty];
            b.location = a.newLocation;
            this._applyEdits(b);
            0 < this._reviewedStore.query({
                featureID: a.featureID,
                featureType: a.featureType
            }).total ? (b = this._reviewedStore.query({
                    featureID: a.featureID,
                    featureType: a.featureType
                })[0], b.newLocation =
                a.newLocation) : this._reviewedArray.push({
                id: this._reviewedArray.length,
                featureID: a.featureID,
                address: a.address,
                oldLocation: a.oldLocation,
                newLocation: a.newLocation,
                featureType: a.featureType
            });
            this._reviewedStore = new k({
                data: this._reviewedArray,
                idProperty: "id"
            });
            this._gridReviewedRef.set("store", this._reviewedStore);
            this._updateTabText();
            this.refreshGrids();
            this.emit("match", {
                id: this._reviewedArray.length,
                featureID: a.featureID,
                address: a.address,
                oldLocation: a.oldLocation,
                newLocation: a.newLocation,
                featureType: a.featureType
            })
        },
        clearGridSelection: function() {
            this._gridUnmatchedRef.clearSelection();
            this._gridMatchedRef.clearSelection();
            this._gridReviewedRef.clearSelection()
        },
        refreshGrids: function() {
            this._gridUnmatchedRef.refresh();
            this._gridMatchedRef.refresh();
            this._gridReviewedRef.refresh()
        },
        resizeGrids: function() {
            this._gridUnmatchedRef.resize();
            this._gridMatchedRef.resize();
            this._gridReviewedRef.resize()
        },
        destroy: function() {
            t.forEach(this._listenerHandles, function(a) {
                a.remove()
            });
            this.map && (this.map.infoWindow.clearFeatures(),
                this.map.infoWindow.hide(), this.map.removeLayer(this.graphicsLayer));
            this.map = this.graphicsLayer = null;
            this.inherited(arguments)
        },
        _init: function() {
            this.loaded = !0;
            this.emit("load", {});
            this.resize();
            y.arcgisUrl = this._arcgisUrl;
            y.getItem(this.itemId).then(e.hitch(this, function(a) {
                var b = a.item.url || a.item.item;
                a.item.typeKeywords[6] && this._getPublishParams().then(e.hitch(this, function() {
                    this._getDataFromFeatureService(b)
                }))
            }), function(a) {})
        },
        _applyEdits: function(a) {
            var b = new m;
            b.attributes = a;
            "unmatched" ===
            a.featureType && this._featureLayer && this._tableLayer ? (this._tableLayer.applyEdits(null, null, [b]).then(function(a, b, g) {}), b.geometry = a.location, this._featureLayer.applyEdits([b], null, null).then(function(a, b, g) {})) : "matched" === a.featureType && this._featureLayer && (b.geometry = a.location, this._featureLayer.applyEdits(null, [b], null).then(function(a, b, g) {}))
        },
        resize: function() {
            var a = q.get(this.domNode, "height"),
                b = q.get(D.byId(this.headerID), "height");
            q.set(this.StackContainerNode.domNode, "height", a - b + "px");
            this.StackContainerNode.resize();
            this.resizeGrids();
            this._tab1Node.resize();
            this._tab2Node.resize();
            this._tab3Node.resize()
        },
        _applyAddressEdits: function(a) {
            var b = new m;
            b.attributes = a;
            "unmatched" === a.featureType ? this._tableLayer.applyEdits(null, [b], null).then(function(a, b, g) {}) : this._featureLayer.applyEdits(null, [b], null).then(function(a, b, g) {})
        },
        _selectGridRowEvent: function(a, b) {
            var d;
            d = this._singleLineInput ? {
                id: a,
                address: b[this._keywordMap.Address],
                location: b.location,
                featureType: b.featureType,
                reviewed: b.reviewed,
                updated: b.updated,
                sourceCountry: this._sourceCountry
            } : {
                id: a,
                address: this._formatLocatorOptions(b),
                location: b.location,
                featureType: b.featureType,
                reviewed: b.reviewed,
                updated: b.updated,
                sourceCountry: this._sourceCountry
            };
            this.emit("row-select", d);
            this.geocodeMatch && this.geocodeMatch.geocodeAddress(d)
        },
        _calcGraphicsExtent: function(a) {
            var b = a[0].geometry,
                d = b.getExtent(),
                c, g, e = a.length;
            null === d && (d = new u(b.x, b.y, b.x, b.y, b.spatialReference));
            for (g = 1; g < e; g++) b = a[g].geometry, c = b.getExtent(), null === c && (c = new u(b.x,
                b.y, b.x, b.y, b.spatialReference)), d = d.union(c);
            return d
        },
        _drawReviewedRow: function(a) {
            this.graphicsLayer.clear();
            var b = a.newLocation,
                d = new m(b, this.matchGraphic),
                c;
            a.oldLocation ? (a = a.oldLocation, a = new m(a, this.highlightGraphic), c = [a, d], a = this._calcGraphicsExtent(c), this.map.setExtent(a, !0).then(e.hitch(this, function() {
                var a;
                for (a = 0; a < c.length; a++) this.graphicsLayer.add(c[a])
            }))) : this.map.centerAt(b).then(e.hitch(this, function() {
                this.graphicsLayer.add(d)
            }))
        },
        _getPublishParams: function() {
            var a = new B;
            x({
                url: this._arcgisUrl + "/" + this.itemId + "/info/publishParameters.json",
                content: {
                    f: "json"
                },
                handleAs: "json",
                callbackParamName: "callback",
                load: e.hitch(this, function(b) {
                    var d, c;
                    this._pubParams = b;
                    Object.keys || (Object.keys = function(a) {
                        var b = [],
                            c;
                        for (c in a) a.hasOwnProperty(c) && b.push(c);
                        return b
                    });
                    if (1 === Object.keys(b.addressFields).length) {
                        for (d in b.addressFields) b.addressFields.hasOwnProperty(d) && (this._keywordMap.Address = b.addressFields[d], this._keywordArray.push(b.addressFields[d]));
                        this._singleLineInput = !0
                    } else
                        for (c in this._singleLineInput = !1, b.addressFields) b.addressFields.hasOwnProperty(c) && (this._keywordMap[c] = b.addressFields[c], this._keywordArray.push(b.addressFields[c]));
                    b.sourceCountry && !this._keywordMap.CountryCode && ("world" !== b.sourceCountry.toLowerCase() && "wo" !== b.sourceCountry.toLowerCase()) && (this._sourceCountry = b.sourceCountry);
                    b.geocodeServiceUrl && (this._locatorURL = b.geocodeServiceUrl, this.geocodeMatch && (this.geocodeMatch._customLocator || this.geocodeMatch.updateLocatorURL(this._locatorURL)));
                    a.resolve(!0)
                })
            });
            return a.promise
        },
        _formatLocatorOptions: function(a) {
            var b = [],
                d;
            for (d in this._keywordMap) this._keywordMap.hasOwnProperty(d) && (b[d] = a[this._keywordMap[d]]);
            return b
        },
        _getDataFromFeatureService: function(a) {
            var b = a + "/0",
                d = a + "/1";
            x({
                url: a,
                content: {
                    f: "json"
                },
                handleAs: "json",
                callbackParamName: "callback",
                load: e.hitch(this, function(a) {
                    this._fsData = a;
                    0 !== a.layers.length ? (this._featureLayer = new n(b, {
                            mode: n.MODE_SELECTION,
                            outFields: ["*"]
                        }), this._featureLayer.userIsAdmin = !0, this._listenerHandles.push(this._layerLoad())) :
                        this._featureLayer = !1;
                    0 !== a.tables.length ? (this._tableLayer = new n(d, {
                        mode: n.MODE_SELECTION,
                        outFields: ["*"]
                    }), this._tableLayer.userIsAdmin = !0, this._listenerHandles.push(this._tableLoad())) : (this._tableLayer = !1, this.StackContainerNode.removeChild(this.StackContainerNode.getChildren()[0]))
                })
            });
            this.resize()
        },
        _geocodeMatchHandler: function() {
            return this.geocodeMatch.on("match", e.hitch(this, function(a) {
                this.matchFeature(a)
            }))
        },
        _layerLoad: function() {
            return h(this._featureLayer, "load", e.hitch(this, function() {
                this._queryFeatureLayer()
            }))
        },
        _tableLoad: function() {
            return h(this._tableLayer, "load", e.hitch(this, function() {
                this._queryTableLayer()
            }))
        },
        _queryFeatureLayer: function() {
            var a, b, d, c = [],
                g = new w;
            g.where = "1 \x3d 1";
            this._featureLayer.queryFeatures(g).then(e.hitch(this, function(e) {
                for (a = 0; a < e.features.length; a++) e.features[a].attributes.updated = !1, e.features[a].attributes.reviewed = !1, e.features[a].attributes.featureType = "matched", d = e.features[a].attributes, b = new N(e.features[a].geometry.getLongitude(), e.features[a].geometry.getLatitude()),
                    d.location = b, c.push(d);
                this._test_idKeyword = this._featureLayer.objectIdField;
                this._gridMatchedRef.set("columns", this._updateColumns(e));
                this._matchedStore = new k({
                    data: c,
                    idProperty: this._featureLayer.objectIdField
                });
                this._gridMatchedRef.set("store", this._matchedStore);
                this._updateTabText()
            }))
        },
        _queryTableLayer: function() {
            var a, b, d = [],
                c = new w;
            c.where = "1 \x3d 1";
            this._tableLayer.queryFeatures(c).then(e.hitch(this, function(c) {
                if (0 !== c.features.length) {
                    for (a = 0; a < c.features.length; a++) c.features[a].attributes.updated = !1, c.features[a].attributes.reviewed = !1, c.features[a].attributes.featureType = "unmatched", b = c.features[a].attributes, d.push(b);
                    this._gridUnmatchedRef.set("columns", this._updateColumns(c));
                    this._unmatchedStore = new k({
                        data: d,
                        idProperty: this._tableLayer.objectIdField
                    });
                    this._gridUnmatchedRef.set("store", this._unmatchedStore);
                    this._updateTabText()
                } else this._tableLayer = !1, delete this._fsData.tables[0], this.StackContainerNode.removeChild(this.StackContainerNode.getChildren()[0])
            }))
        },
        _updateTabText: function() {
            this._unmatchedStore.query({
                    reviewed: !1
                }).total ===
                this._unmatchedStore.data.length ? this._tab1Node.set("title", l.substitute(f.widgets.geocodeReview.unmatchedTotal, {
                    count: this._unmatchedStore.data.length
                })) : this._tab1Node.set("title", l.substitute(f.widgets.geocodeReview.unmatchedRemaining, {
                    count1: this._unmatchedStore.query({
                        reviewed: !1
                    }).total,
                    count2: this._unmatchedStore.data.length
                }));
            this._tab2Node.set("title", l.substitute(f.widgets.geocodeReview.matchedTotal, {
                count: this._matchedStore.data.length
            }));
            this._tab3Node.set("title", l.substitute(f.widgets.geocodeReview.reviewedTotal, {
                count: this._reviewedStore.data.length
            }))
        },
        _generateGrids: function() {
            this._generateUnmatchedGrid();
            this._generateMatchedGrid();
            this._generateReviewedGrid()
        },
        _generateUnmatchedGrid: function() {
            this._gridUnmatchedRef = new this.StandardGrid({
                store: this._unmatchedStore,
                columns: this._unmatchedColumns,
                noDataMessage: f.widgets.geocodeReview.review.noDataMsg1,
                selectionMode: "extended",
                allowSelectAll: !1,
                cellNavigation: !1
            }, this._grid1Node);
            this._gridUnmatchedRef.startup();
            this._gridUnmatchedRef.resize()
        },
        _generateMatchedGrid: function() {
            this._gridMatchedRef =
                new this.StandardGrid({
                    store: this._matchedStore,
                    columns: this._matchedColumns,
                    noDataMessage: f.widgets.geocodeReview.review.noDataMsg2,
                    selectionMode: "extended",
                    allowSelectAll: !1,
                    cellNavigation: !1
                }, this._grid2Node);
            this._gridMatchedRef.startup();
            this._gridMatchedRef.resize()
        },
        _generateReviewedGrid: function() {
            this._gridReviewedRef = new this.StandardGrid({
                store: this._reviewedStore,
                columns: this._reviewedColumns,
                noDataMessage: f.widgets.geocodeReview.review.noDataMsg3,
                selectionMode: "extended",
                allowSelectAll: !1,
                cellNavigation: !1
            }, this._grid3Node);
            this._gridReviewedRef.startup();
            this._gridReviewedRef.resize()
        },
        _defineColumns: function() {
            this._unmatchedColumns = [];
            this._matchedColumns = [];
            this._reviewedColumns = [{
                label: f.widgets.geocodeReview.idProperty,
                field: "id",
                hidden: !0
            }, {
                label: f.widgets.geocodeReview.review.columnSelectedAddress,
                field: "address",
                formatter: e.hitch(this, function(a) {
                    return "\x3cimg src\x3d'" + this.basePath.toString() + "images/EsriGreenPinCircle26.png' /\x3e" + a
                }),
                get: e.hitch(this, function(a) {
                    var b =
                        "",
                        b = "",
                        d;
                    if ("object" === typeof a.address)
                        for (d in a.address) a.address.hasOwnProperty(d) && null !== a.address[d] && "Loc_name" !== d && (b += a.address[d] + " ");
                    else b = a.address;
                    return b
                })
            }, {
                label: f.widgets.geocodeReview.review.columnOriginalLocation,
                field: "oldLocation",
                formatter: function(a) {
                    return a
                },
                get: e.hitch(this, function(a) {
                    var b;
                    a.oldLocation && (b = v.webMercatorToGeographic(a.oldLocation));
                    return a.oldLocation ? "X: " + b.x + "\x3cbr /\x3eY: " + b.y : "None"
                })
            }, {
                label: f.widgets.geocodeReview.review.columnSelectedLocation,
                field: "newLocation",
                formatter: function(a) {
                    return a
                },
                get: e.hitch(this, function(a) {
                    a = v.webMercatorToGeographic(a.newLocation);
                    return "X: " + a.x + "\x3cbr /\x3eY: " + a.y
                })
            }, {
                label: "Type",
                field: "featureType",
                hidden: !0
            }]
        },
        _updateColumns: function(a) {
            var b, d, c = [];
            if (a && a.fields) {
                for (b = 0; b < a.fields.length; b++) d = a.fields[b].name === this._keywordMap.Address || a.fields[b].name === this._keywordMap[a.fields[b].name] ? new r({
                    label: a.fields[b].alias || a.fields[b].name,
                    field: a.fields[b].name,
                    editor: "text",
                    editOn: "dblclick",
                    autoSave: !0
                }) : -1 !== t.indexOf(this._keywordArray, a.fields[b].name) ? new r({
                    label: a.fields[b].alias || a.fields[b].name,
                    field: a.fields[b].name,
                    editor: "text",
                    editOn: "dblclick",
                    autoSave: !0
                }) : {
                    label: a.fields[b].alias || a.fields[b].name,
                    field: a.fields[b].name,
                    hidden: !0
                }, a.fields[b].name === this._featureLayer.objectIdField ? c.splice(0, 0, {
                    label: a.fields[b].name,
                    field: a.fields[b].alias,
                    hidden: !0
                }) : c.push(d);
                c.push({
                    label: f.widgets.geocodeReview.reviewedUC,
                    field: "reviewed",
                    formatter: function(a) {
                        return a
                    },
                    get: e.hitch(this,
                        function(a) {
                            return a.reviewed ? "\x3cimg src\x3d'" + this.basePath.toString() + "images/save.png' /\x3e" : ""
                        })
                })
            }
            return c
        },
        _defineGridStores: function() {
            this._unmatchedStore = new k({
                data: "",
                idProperty: this._idProperty
            });
            this._matchedStore = new k({
                data: "",
                idProperty: this._idProperty
            });
            this._reviewedArray = [];
            this._reviewedStore = new k({
                data: this._reviewedArray,
                idProperty: this._idProperty
            })
        }
    })
});