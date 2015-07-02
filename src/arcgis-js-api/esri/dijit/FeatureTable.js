//>>built
define(["dojo/aspect", "dojo/on", "dojo/Evented", "dojo/has", "dojo/number", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/text!../dijit/FeatureTable/templates/FeatureTable.html", "dojo/i18n!../nls/jsapi", "dojo/store/Cache", "dojo/store/Memory", "dojo/store/Observable", "dojo/string", "dojo/dom-construct", "dojo/dom-class", "dojo/fx/Toggler", "dijit/_WidgetBase", "dijit/_OnDijitClickMixin", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/Dialog", "dijit/Menu", "dijit/MenuItem", "dijit/form/DropDownButton", "dijit/form/TimeTextBox", "dijit/form/DateTextBox", "dijit/form/Button", "dgrid/OnDemandGrid", "dgrid/Selection", "dgrid/Keyboard", "dgrid/editor", "dgrid/extensions/DijitRegistry", "dgrid/extensions/ColumnHider", "dgrid/extensions/ColumnResizer", "../kernel", "../lang", "../config", "../geometry/Extent", "../layers/FeatureLayer", "../tasks/query", "../tasks/StatisticDefinition", "../tasks/QueryTask", "../dijit/FeatureLayerQueryStore", "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dojo/query!css2", "dojo/domReady!"], function(y, l, F, ba, p, u, c, h, G, q, H, v, z, I, e, t, J, K, L, M, N, O, A, w, P, Q, B, R, S, T, U, V, W, X, Y, ca, n, x, C, D, r, Z, $, aa, da, ea) {
    return u([K, L, M, N, F], {
        baseClass: "esriFeatureTable",
        basePath: require.toUrl("esri/dijit/FeatureTable/"),
        loaded: !1,
        templateString: G,
        widgetsInTemplate: !0,
        i18n: q,
        map: null,
        idProperty: "id",
        columns: [],
        dataStore: null,
        grid: null,
        gridMenu: null,
        _featureSet: null,
        featureLayer: null,
        currentLayer: null,
        dateOptions: {
            timeEnabled: !1,
            timePattern: "HH:mm:ss",
            datePattern: "YYYY-MM-DD"
        },
        hiddenFields: [],
        outFields: ["*"],
        readOnly: !1,
        gridOptions: {},
        noDataMessage: "No Data",
        allowSelectAll: !1,
        cellNavigation: !1,
        selectionMode: "extended",
        _layerInfo: {},
        _editorTrackingInfos: {},
        _gridHeaderText: "${gridTitle} (${featureCount} features, ${featureSelectedCount} selected)",
        _gridTitle: "Placeholder",
        _featureCount: 0,
        _featureSelectedCount: 0,
        _currentSelectedRows: [],
        _currentSelectedRowIds: [],
        _filteredRowIds: [],
        disableLayerClick: !0,
        syncSelection: !0,
        updateLayerSelection: !1,
        _batchCount: 0,
        _defaultBatchCount: 25,
        _defaultFeatureCount: 2E3,
        _toggler: null,
        constructor: function(a, b) {
            u.safeMixin(this, a);
            b && (this.gridId = b + "_grid", this.bcNodeId = b + "_bcNode", this.gridMenuId = b + "_gridMenu", this.gridContainerId = b + "_gridContainer", this.optionNodeId = b + "_optionNode", this.StandardGrid = u([W, S, T, U, X, Y]), this._listenerHandles = [], this.currentLayer = a.featureLayer || null, this.map = a.map || null, this.dateOptions = a.dateOptions || this.dateOptions, this.hiddenFields = a.hiddenFields || [], this.readOnly = a.readOnly || !1, a.gridOptions && (this.gridOptions = a.gridOptions || {}, this.noDataMessage =
                a.gridOptions.noDataMessage || this.noDataMessage, this.allowSelectAll = a.gridOptions.allowSelectAll || this.allowSelectAll, this.cellNavigation = a.gridOptions.cellNavigation || this.cellNavigation, this.selectionMode = a.gridOptions.selectionMode || this.selectionMode))
        },
        postCreate: function() {
            this.inherited(arguments);
            this.map && l(this.map, "load", c.hitch(this, function() {}))
        },
        startup: function() {
            this.currentLayer && this.currentLayer.loadError ? this._showLoadError(this.currentLayer.loadError.message) : (this.inherited(arguments),
                this.domNode && this.currentLayer.loaded ? this._init() : (l(this.currentLayer, "load", c.hitch(this, function() {
                    this._init()
                })), l(this.currentLayer, "error", c.hitch(this, function() {
                    this.currentLayer.loadError ? this._showLoadError(this.currentLayer.loadError.message) : this._showLoadError("")
                }))))
        },
        destroy: function() {
            h.forEach(this._listenerHandles, function(a) {
                a.remove()
            });
            this.map && (this.map.infoWindow.clearFeatures(), this.map.infoWindow.hide());
            this.map = null;
            this.grid && (this.grid._destroyColumns(), this.grid.destroy());
            this._bcNode.destroyRecursive();
            delete this.columns;
            delete this._layerInfo;
            this._featureSet = this.params = this.hiddenFields = this.idProperty = this.dateOptions = this.featureLayer = this.currentLayer = this.gridMenu = this.dataStore = this.columns = this.grid = null;
            this.inherited(arguments)
        },
        resize: function() {
            this._resize()
        },
        _init: function() {
            this._userIds = {};
            var a = this.currentLayer.id;
            this.currentLayer.credential && (this._userIds[a] = this.currentLayer.credential.userId);
            this._layerInfo.userId && (this._userIds[a] = this._layerInfo.userId);
            this._layerInfo.showAttachments = this.currentLayer.hasAttachments ? n.isDefined(this._layerInfo.showAttachments) ? this._layerInfo.showAttachments : !0 : !1;
            this._layerInfo.isEditable = this.currentLayer.isEditable() ? n.isDefined(this._layerInfo.isEditable) ? this._layerInfo.isEditable : !0 : !1;
            this._layerInfo.typeIdField = this.currentLayer.typeIdField;
            this._layerInfo.layerId = this.currentLayer.id;
            this._layerInfo.types = this.currentLayer.types;
            this._layerInfo.fields = this.currentLayer.fields;
            this._layerInfo._fieldInfo = [];
            this._layerInfo._features = [];
            this._getEditingInfo();
            this.idProperty = this.currentLayer.objectIdField;
            this.grid = this._initGrid();
            this.grid.startup();
            this.grid.resize();
            this._listenerHandles.push(this._gridSelectEvent());
            this._listenerHandles.push(this._gridDeselectEvent());
            this._listenerHandles.push(this._gridRefreshEvent());
            this._createTableMenu();
            this._toggler = this._createTableToggle();
            this._listenerHandles.push(this._tableToggleClickEvent());
            this._listenerHandles.push(this._columnClickEvent());
            this.loaded = !0;
            this.emit("load", this.loaded);
            this.grid.noDataMessage = "";
            this._gridHeaderNode.innerHTML = "Loading Feature Data...";
            this._resize();
            this._toggleLoadingIndicator(!0);
            this._getFeatureCount().then(c.hitch(this, this._queryFeatureLayer));
            this._listenerHandles.push(this._layerClickEvent())
        },
        selectRows: function(a) {
            var b = [],
                f = [],
                d;
            this.grid.clearSelection();
            a[0] && "esri.Graphic" === a[0].declaredClass && (h.forEach(a, c.hitch(this, function(a) {
                f.push(a.attributes[this.idProperty])
            })), a = f);
            if (1 === a.length) {
                d =
                    a[0];
                a = this.dataStore.get(a);
                var m = this.dataStore.data.indexOf(a);
                this.grid.select(d);
                this._updateGridSelection([a]);
                this._updateGridHeaderText();
                this.grid.scrollTo({
                    x: 0,
                    y: this.grid.rowHeight * m
                });
                this.grid.row(d).element && this.grid.row(d).element.scrollIntoView()
            } else h.forEach(a, c.hitch(this, function(a) {
                b.push(this.dataStore.get(a))
            })), this._updateGridSelection(b), this._updateGridHeaderText()
        },
        _layerClickEvent: function() {
            return l(this.currentLayer, "click", c.hitch(this, function(a) {
                if (!this.disableLayerClick &&
                    a.graphic && a.graphic.attributes && a.graphic.attributes[this.idProperty]) {
                    var b = a.graphic.attributes[this.idProperty];
                    a = new r;
                    a.returnGeometry = this.map ? !0 : !1;
                    a.objectIds = [b];
                    this.currentLayer.selectFeatures(a, D.SELECTION_NEW, c.hitch(this, function(a) {
                        if (a.length) {
                            if (this.map) {
                                var d = this._calcGraphicsExtent(a).getCenter();
                                this.map.centerAt(d).then(c.hitch(this, function() {
                                    this.map.infoWindow.setFeatures(a)
                                }))
                            }
                            var d = this.dataStore.get(b),
                                m = this.dataStore.data.indexOf(d);
                            this.grid.clearSelection();
                            this.grid.select(b);
                            this._updateGridSelection([d]);
                            this._updateGridHeaderText();
                            this.grid.scrollTo({
                                x: 0,
                                y: this.grid.rowHeight * m
                            });
                            this.grid.row(b).element && this.grid.row(b).element.scrollIntoView()
                        }
                    }))
                }
            }))
        },
        filterSelectedRecords: function(a) {
            a ? this._showSelectedRecords() : this.grid.set("query", {})
        },
        _selectFeatures: function() {},
        _updateGridSelection: function(a) {
            a ? (this._currentSelectedRowIds = [], this._currentSelectedRows = a, this._featureSelectedCount = a.length, h.forEach(a, c.hitch(this, function(a) {
                    this._currentSelectedRowIds.push(a[this.idProperty])
                }))) :
                (this._currentSelectedRowIds = [], this._currentSelectedRows = [], this._featureSelectedCount = 0)
        },
        _showInfoWindow: function() {},
        _hideInfoWindow: function() {},
        _getEditingInfo: function() {
            var a = [];
            this.currentLayer.editFieldsInfo && (this.currentLayer.editFieldsInfo.creatorField && a.push(this.currentLayer.editFieldsInfo.creatorField), this.currentLayer.editFieldsInfo.creationDateField && a.push(this.currentLayer.editFieldsInfo.creationDateField), this.currentLayer.editFieldsInfo.editorField && a.push(this.currentLayer.editFieldsInfo.editorField),
                this.currentLayer.editFieldsInfo.editDateField && a.push(this.currentLayer.editFieldsInfo.editDateField));
            this._editorTrackingInfos[this.currentLayer.id] = a
        },
        _gridRefreshEvent: function() {
            return l(this.grid, "dgrid-refresh-complete", c.hitch(this, function(a) {
                this.grid.columns[0] && this.emit("dgrid-refresh-complete", a)
            }))
        },
        _gridSelectEvent: function() {
            return l(this.grid, "dgrid-select", c.hitch(this, function(a) {
                this.emit("dgrid-select", a.rows);
                var b = [];
                h.forEach(a.rows, c.hitch(this, function(a) {
                    b.push(a.data)
                }));
                this._updateGridSelection(b);
                this._updateGridHeaderText();
                this.map && (this.map.infoWindow.clearFeatures(), this.map.infoWindow.hide(), a = new r, a.returnGeometry = this.map ? !0 : !1, a.objectIds = this._currentSelectedRowIds, this.updateLayerSelection && this.map.getLayer(this.currentLayer.id).selectFeatures(a, D.SELECTION_NEW, c.hitch(this, function(a) {
                    if (a.length) {
                        var b = this._calcGraphicsExtent(a).getCenter();
                        this.map.centerAt(b).then(c.hitch(this, function() {
                            this.map.infoWindow.setFeatures(a)
                        }))
                    }
                })))
            }))
        },
        _gridDeselectEvent: function() {
            return l(this.grid,
                "dgrid-deselect", c.hitch(this, function(a) {
                    this.emit("dgrid-deselect", a.rows);
                    this._updateGridSelection();
                    this._updateGridHeaderText()
                }))
        },
        _getFeatureCount: function() {
            var a = new r;
            a.returnGeometry = !1;
            a.returnIdsOnly = !1;
            a.where = "1\x3d1";
            x.defaults.io.timeout = 1E4;
            return this.currentLayer.queryCount(a).then(c.hitch(this, function(a) {
                x.defaults.io.timeout = 6E4;
                return this._featureCount = a
            }), function() {
                x.defaults.io.timeout = 6E4;
                this._featureCount = this._defaultFeatureCount;
                console.log("Could not get feature count. Defaulting to 2000 features");
                return null
            })
        },
        _queryFeatureLayer: function() {
            var a = new r;
            a.where = "1\x3d1";
            a.outFields = this.outFields;
            a.returnGeometry = !1;
            this.currentLayer.queryFeatures(a, c.hitch(this, function(a) {
                var f = n.isDefined(this.currentLayer.maxRecordCount) ? this.currentLayer.maxRecordCount : 1E3;
                this._batchCount = Math.min(f, this._defaultBatchCount);
                this._toggleLoadingIndicator(!1);
                this.grid.noDataMessage = this.noDataMessage;
                this._featureSet = a;
                this._generateColumnsFromFields(a.fields);
                this.grid.set("columns", this.columns);
                this._updateGridHeaderText();
                a.exceededTransferLimit ? this._generateCacheStore() : this._generateMemoryStore(a.features);
                this._layerInfo._features = a.features;
                this.grid.set("store", this.dataStore)
            }), c.hitch(this, function(a) {
                this._showLoadError(a.message)
            }))
        },
        _generateColumnsFromFields: function(a) {
            var b = [];
            h.forEach(a, c.hitch(this, function(a, d) {
                var m = this._layerInfo.typeIdField && a.name === this._layerInfo.typeIdField || !1,
                    e = this.currentLayer.fields[d].domain || !1,
                    g = -1 !== h.indexOf(this.hiddenFields, a.name) || "esriFieldTypeOID" === a.type ||
                    "esriFieldTypeGlobalID" === a.type || -1 !== h.indexOf(this._editorTrackingInfos[this.currentLayer.id], a.name),
                    k = this._layerInfo.isEditable && this._layerInfo.isEditable && a.name !== this.idProperty && !1 === this.readOnly,
                    E = "esriFieldTypeDate" === a.type;
                this._layerInfo._fieldInfo[d] = {
                    idx: d,
                    name: a.name,
                    type: a.type,
                    isDomainField: e,
                    isTypeIdField: m,
                    isHidden: g,
                    isEditable: k,
                    isNullable: this.currentLayer.fields[d].nullable || !1,
                    isDate: E
                };
                E ? k ? b.push(this._generateDateTimeEditorColumn(a, this._layerInfo._fieldInfo[d])) : b.push(this._generateDateTimeColumn(a,
                    this._layerInfo._fieldInfo[d])) : e ? b.push({
                    label: a.alias,
                    field: a.name,
                    type: a.type,
                    hidden: g,
                    get: c.hitch(this, function(b) {
                        b = this._findFirst(this.currentLayer.fields[d].domain.codedValues, "code", b[a.name]);
                        return null !== b ? b.name : null
                    })
                }) : m ? b.push({
                    label: a.alias,
                    field: a.name,
                    type: a.type,
                    hidden: g,
                    get: c.hitch(this, function(b) {
                        b = this._findFirst(this._layerInfo.types, "id", b[a.name]);
                        return null !== b ? b.name : null
                    })
                }) : b.push({
                    label: a.alias,
                    field: a.name,
                    type: a.type,
                    hidden: g,
                    get: c.hitch(this, function(b) {
                        var d, c =
                            this._findFirst(this._layerInfo.types, "id", b[this._layerInfo.typeIdField]);
                        c && (c.domains && c.domains[a.name] && c.domains[a.name].codedValues) && (d = this._findFirst(c.domains[a.name].codedValues, "code", b[a.name]));
                        return d ? d.name : b[a.name]
                    })
                })
            }));
            this.columns = b
        },
        _generateDateTimeColumn: function(a, b) {
            return {
                label: a.alias,
                field: a.name,
                type: a.type,
                hidden: b.isHidden,
                get: c.hitch(this, function(b) {
                    b = "" === b[a.name] ? null : new Date(b[a.name]);
                    this.dateOptions.timeEnabled || (b = b.toDateString());
                    return b
                })
            }
        },
        _generateDateTimeEditorColumn: function(a,
            b) {
            return this.dateOptions.timeEnabled ? {
                label: a.alias,
                field: a.name,
                type: a.type,
                hidden: b.isHidden,
                get: c.hitch(this, function(b) {
                    return "" === b[a.name] ? null : new Date(b[a.name])
                }),
                renderCell: c.hitch(this, function(a, b, c, e) {
                    (new B({
                        value: b,
                        datePattern: this.dateOptions.datePattern
                    })).placeAt(c);
                    (new Q({
                        value: b,
                        timePattern: this.dateOptions.timePattern
                    })).placeAt(c)
                })
            } : V({
                label: a.alias,
                field: a.name,
                type: a.type,
                hidden: b.isHidden,
                get: c.hitch(this, function(b) {
                    return "" === b[a.name] ? null : new Date(b[a.name])
                })
            }, B)
        },
        _generateCacheStore: function() {
            var a = new aa({
                    layer: this.currentLayer,
                    objectIds: null,
                    totalCount: this._featureCount,
                    batchCount: this._batchCount,
                    where: "1\x3d1",
                    orderByFields: ""
                }),
                b = new v;
            this.dataStore = new H(a, b, {})
        },
        _generateMemoryStore: function(a) {
            var b = [];
            h.forEach(a, c.hitch(this, function(a) {
                b.push(a.attributes)
            }));
            this.dataStore = new z(new v({
                data: b,
                idProperty: this.idProperty
            }))
        },
        _initGrid: function() {
            this.dataStore = new z(new v({
                data: null,
                idProperty: this.idProperty
            }));
            var a = new this.StandardGrid({
                store: this.dataStore,
                columns: this.columns,
                noDataMessage: this.noDataMessage,
                selectionMode: this.selectionMode,
                allowSelectAll: this.allowSelectAll,
                cellNavigation: this.cellNavigation
            }, this.gridId);
            y.before(a, "removeRow", c.hitch(this, function(b) {
                h.forEach(this.columns.length, c.hitch(this, function(c, d) {
                    var e = a.cell(b, d).element;
                    (e = (e.contents || e).widget) && e.destroyRecursive()
                }))
            }));
            y.after(a, "renderHeader", c.hitch(this, function() {
                a._sortListener.remove()
            }));
            return a
        },
        _resize: function() {
            this._bcNode.resize();
            this._gridMenu.resize();
            this._gridContainer.resize();
            this.grid && this.grid.resize()
        },
        _updateGridHeaderText: function() {
            this._gridHeaderNode.innerHTML = I.substitute(this._gridHeaderText, {
                gridTitle: this.currentLayer.name,
                featureCount: this._featureCount,
                featureSelectedCount: this._featureSelectedCount
            })
        },
        _columnClickEvent: function() {
            return l(this.grid, ".dgrid-header .dgrid-cell:click", c.hitch(this, this._showColumnMenu))
        },
        _showColumnMenu: function(a) {
            this.columnMenu && (this._oldColumnMenu = this.columnMenu, this.columnMenu = null);
            this.columnMenu =
                new A({});
            var b = this.grid.cell(a),
                f = b.column.id,
                d = this.columns[f].type,
                e = ["iconSortAscending", "iconSortDescending"],
                s = [this._sortAscending, this._sortDescending];
            h.forEach([q.widgets.FeatureTable.sortAsc, q.widgets.FeatureTable.sortDesc], c.hitch(this, function(a, b) {
                var d = new w({
                    label: a,
                    iconClass: e[b],
                    baseClass: "esriFeatureTable_menuItem",
                    onClick: c.hitch(this, s[b], f)
                });
                this.columnMenu.addChild(d)
            }));
            if (this.currentLayer.supportsStatistics && ("esriFieldTypeDouble" === d || "esriFieldTypeSingle" === d || "esriFieldTypeInteger" ===
                    d || "esriFieldTypeSmallInteger" === d)) d = new w({
                label: "Statistics",
                iconClass: "iconTableStatistics",
                baseClass: "esriFeatureTable_menuItem",
                onClick: c.hitch(this, this._getColumnStats, f)
            }), this.columnMenu.addChild(d);
            this.columnMenu.startup();
            this.columnMenu._openMyself({
                target: a.target,
                delegatedTarget: b,
                iframe: null,
                coords: {
                    x: a.pageX,
                    y: a.pageY
                }
            });
            l(this.columnMenu, "close", c.hitch(this, function() {
                this._oldColumnMenu && (this._oldColumnMenu.destroyRecursive(), this._oldColumnMenu = null)
            }))
        },
        _sortAscending: function(a,
            b) {
            this.grid.set("sort", [{
                attribute: this.columns[a].field,
                ascending: !0
            }])
        },
        _sortDescending: function(a, b) {
            this.grid.set("sort", [{
                attribute: this.columns[a].field,
                descending: !0
            }])
        },
        _getColumnStats: function(a, b) {
            var f = this.columns[a].field,
                d = new r;
            d.outFields = [f];
            d.outStatistics = [];
            d.where = "1\x3d1";
            var e = "countField sumField minField maxField avgField stddevField".split(" ");
            h.forEach("count sum min max avg stddev".split(" "), c.hitch(this, function(a, b) {
                var c = new Z;
                c.statisticType = a;
                c.onStatisticField =
                    f;
                c.outStatisticFieldName = e[b];
                c.displayFieldName = f;
                d.outStatistics.push(c)
            }));
            var s = [];
            0 < this._filteredRowIds.length && (s = this._filteredRowIds);
            d.where && 0 < s.length && (d.where = "(" + d.where + ") AND (" + this.idProperty + " IN (" + s.toString() + "))");
            (new $(this.currentLayer.url)).execute(d).then(c.hitch(this, function(a) {
                a.features && a.features.length && this._showStatisticsDialog(a, f)
            }), function(a) {
                console.log("Could not get statistics.", a ? a.message : a)
            })
        },
        _showStatisticsDialog: function(a, b) {
            this.statisticsDialog &&
                this.statisticsDialog.destroy();
            var f = a.features[0].attributes,
                d = {
                    pattern: "#,###,###,##0.########"
                },
                m = "Number of Values;Sum of Values;Minimum;Maximum;Average;Standard Deviation".split(";"),
                h = e.create("div", {
                    className: "esriAGOTableStatistics",
                    innerHTML: ""
                });
            e.create("div", {
                className: "header",
                innerHTML: "Field: " + b
            }, h);
            e.create("div", {
                className: "hzLine",
                innerHTML: ""
            }, h);
            var g = e.create("table", {
                    className: "attrTable",
                    innerHTML: "",
                    style: {
                        cellpadding: 0,
                        cellspacing: 0
                    }
                }, h),
                k = {},
                l;
            for (l in f) f.hasOwnProperty(l) &&
                (k[l.toLowerCase()] = f[l]);
            f = e.create("tbody", {}, g);
            g = e.create("tr", {
                valign: "top"
            }, f);
            e.create("td", {
                "class": "attrName",
                innerHTML: m[0]
            }, g);
            e.create("td", {
                "class": "attrValue",
                innerHTML: n.isDefined(k.countfield) ? p.format(k.countfield, d) : ""
            }, g);
            g = e.create("tr", {
                valign: "top"
            }, f);
            e.create("td", {
                "class": "attrName",
                innerHTML: m[1]
            }, g);
            e.create("td", {
                "class": "attrValue",
                innerHTML: n.isDefined(k.sumfield) ? p.format(k.sumfield, d) : ""
            }, g);
            g = e.create("tr", {
                valign: "top"
            }, f);
            e.create("td", {
                    "class": "attrName",
                    innerHTML: m[2]
                },
                g);
            e.create("td", {
                "class": "attrValue",
                innerHTML: n.isDefined(k.minfield) ? p.format(k.minfield, d) : ""
            }, g);
            g = e.create("tr", {
                valign: "top"
            }, f);
            e.create("td", {
                "class": "attrName",
                innerHTML: m[3]
            }, g);
            e.create("td", {
                "class": "attrValue",
                innerHTML: n.isDefined(k.maxfield) ? p.format(k.maxfield, d) : ""
            }, g);
            g = e.create("tr", {
                valign: "top"
            }, f);
            e.create("td", {
                "class": "attrName",
                innerHTML: m[4]
            }, g);
            e.create("td", {
                "class": "attrValue",
                innerHTML: n.isDefined(k.avgfield) ? p.format(p.round(k.avgfield, this._roundPos(k.avgfield)), d) : ""
            }, g);
            g = e.create("tr", {
                valign: "top"
            }, f);
            e.create("td", {
                "class": "attrName",
                innerHTML: m[5]
            }, g);
            e.create("td", {
                "class": "attrValue",
                innerHTML: n.isDefined(k.stddevfield) ? p.format(p.round(k.stddevfield, this._roundPos(k.stddevfield)), d) : ""
            }, g);
            e.create("div", {
                className: "break",
                innerHTML: ""
            }, h);
            this.statisticsDialog = new O({
                title: "Statistics",
                content: h,
                baseClass: "esriFeatureTable_dialog"
            });
            d = e.create("button", {
                type: "button"
            }, this.statisticsDialog.containerNode);
            new R({
                label: "Close",
                baseClass: "primary dijitButton",
                onClick: c.hitch(this, function() {
                    this.statisticsDialog.hide()
                })
            }, d);
            this.statisticsDialog.show()
        },
        _defaultSortOrder: function() {
            this.grid.set("sort", [{
                attribute: this.idProperty,
                ascending: !0
            }])
        },
        _filterRows: function() {},
        _showSelectedRecords: function() {
            var a = this._filteredRowIds = this._currentSelectedRowIds;
            this._currentSelectedRows && this._currentSelectedRowIds && this.grid.set("query", c.hitch(this, function(b, c, d) {
                return ~a.indexOf(b[this.idProperty]) ? !0 : !1
            }))
        },
        _centerOnSelection: function() {
            var a = this._currentSelectedRowIds,
                b = new r;
            b.objectIds = a;
            b.outFields = ["*"];
            0 < this._currentSelectedRows.length && 0 < this._currentSelectedRowIds.length && this.currentLayer.queryFeatures(b, c.hitch(this, function(a) {
                this.map.setExtent(this._calcGraphicsExtent(a.features))
            }))
        },
        clearSelection: function() {
            this._clearSelection()
        },
        _clearSelection: function() {
            this._currentSelectedRowIds = [];
            this._currentSelectedRows = [];
            this._featureSelectedCount = 0;
            this._filteredRowIds = [];
            this.grid.set("query", {});
            this._updateGridHeaderText();
            this.map && (this.map.infoWindow.clearFeatures(),
                this.map.infoWindow.hide())
        },
        _deleteSelectedFeatures: function() {},
        _showAttachments: function() {},
        _showHideColumns: function() {
            this.grid._toggleColumnHiderMenu()
        },
        _exportToCSV: function() {},
        _createTableToggle: function() {
            var a = new J({
                node: this.gridContainerId
            });
            this._toggleOpened = !0;
            return a
        },
        _tableToggleClickEvent: function() {
            return l(this.tableCloseButton, "click", c.hitch(this, function() {
                this._toggleOpened ? (t.remove(this.tableCloseButton, "toggleOpened"), t.add(this.tableCloseButton, "toggleClosed"), this._toggler.hide(),
                    this._gridContainer.domNode.style.display = "none") : (t.remove(this.tableCloseButton, "toggleClosed"), t.add(this.tableCloseButton, "toggleOpened"), this._toggler.show(), this._gridContainer.domNode.style.display = "block");
                this._resize();
                this._toggleOpened = !this._toggleOpened
            }))
        },
        _createTableMenu: function() {
            this.gridMenu = new A({});
            var a = [this._defaultSortOrder, this._showSelectedRecords, this._clearSelection, this._showHideColumns];
            h.forEach([q.widgets.FeatureTable.defaultSort, q.widgets.FeatureTable.showSelected,
                q.widgets.FeatureTable.clearSelection, q.widgets.FeatureTable.toggleColumns
            ], c.hitch(this, function(b, e) {
                var d = new w({
                    label: b,
                    baseClass: "esriFeatureTable_menuItem",
                    onClick: c.hitch(this, a[e])
                });
                this.gridMenu.addChild(d)
            }));
            new P({
                label: q.widgets.geocodeMatch.match.tableOptionsLabel,
                dropDown: this.gridMenu
            }, this.optionNodeId);
            this.gridMenu.startup()
        },
        _roundPos: function(a) {
            return 1E3 <= a ? 0 : 10 <= a ? 2 : 0 <= a ? 4 : 6
        },
        _calcGraphicsExtent: function(a) {
            var b = a[0].geometry,
                c = b.getExtent(),
                d, e, h = a.length;
            null === c && (c = new C(b.x,
                b.y, b.x, b.y, b.spatialReference));
            for (e = 1; e < h; e++) b = a[e].geometry, d = b.getExtent(), null === d && (d = new C(b.x, b.y, b.x, b.y, b.spatialReference)), c = c.union(d);
            return c
        },
        _toggleLoadingIndicator: function(a) {
            this._gridLoadingIndicatorNode.style.display = a ? "block" : "none"
        },
        _findFirst: function(a, b, c) {
            return (a = h.filter(a, function(a) {
                return a.hasOwnProperty(b) && a[b] === c
            })) && a.length ? a[0] : null
        },
        _showLoadError: function() {
            this._toggleLoadingIndicator(!1);
            this._gridHeaderNode.innerHTML = "Error Loading Data."
        }
    })
});