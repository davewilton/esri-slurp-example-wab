//>>built
define(["../../arcgis/Portal", "../../domUtils", "../../kernel", "../../request", "../../symbols/jsonUtils", "../_EventedWidget", "../_Tooltip", "../editing/TemplatePicker", "../util/busyIndicator", "./symbolUtil", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dojo/_base/array", "dojo/_base/declare", "dojo/_base/kernel", "dojo/_base/lang", "dojo/Deferred", "dojo/dom-class", "dojo/dom-construct", "dojo/dom-style", "dojo/promise/all", "dojo/sniff", "dojo/store/Memory", "dojo/store/Observable", "dojox/gfx", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/MarkerSymbolPicker.html", "dijit/form/Select"], function(h,
    k, r, s, l, t, u, v, w, x, y, z, g, m, A, c, f, e, d, B, C, n, p, D, E, F, G) {
    return m("esri.dijit.SymbolStyler.MarkerSymbolPicker", [t, y, z, u], {
        baseClass: "esriMarkerSymbolPicker",
        templateString: G,
        labels: F.symbolEditor,
        portalUrl: "http://arcgis.com/",
        displayMode: "portal",
        _symbolTypesStore: null,
        _symbolItemStore: null,
        _noSymbolsOverlay: null,
        _templatePicker: null,
        _portal: null,
        _portalLoadTimeoutInMs: 3E3,
        _loadingIndicator: null,
        _storageItemKeyBase: "markerSymbolPicker/symbol",
        _defaultSimpleMarkerSymbols: [{
            name: "Circle",
            type: "esriSMS",
            style: "esriSMSCircle",
            color: [0, 0, 128, 128],
            size: 18,
            outline: {
                color: [0, 0, 128, 255],
                width: 1
            }
        }, {
            name: "Square",
            type: "esriSMS",
            style: "esriSMSSquare",
            color: [0, 0, 128, 128],
            size: 18,
            outline: {
                color: [0, 0, 128, 255],
                width: 1
            }
        }, {
            name: "Diamond",
            type: "esriSMS",
            style: "esriSMSDiamond",
            color: [0, 0, 128, 128],
            size: 18,
            outline: {
                color: [0, 0, 128, 255],
                width: 1
            }
        }, {
            name: "Cross",
            type: "esriSMS",
            style: "esriSMSCross",
            color: [0, 0, 128, 128],
            size: 18,
            outline: {
                color: [0, 0, 128, 255],
                width: 1
            }
        }, {
            name: "X",
            type: "esriSMS",
            style: "esriSMSX",
            color: [0, 0, 128,
                128
            ],
            size: 18,
            outline: {
                color: [0, 0, 128, 255],
                width: 1
            }
        }],
        constructor: function(a) {
            m.safeMixin(this, a);
            c.extend(this.constructor, {
                css: {
                    noSymbols: "esriNoSymbols",
                    defaultSymbols: "esriDefaultSymbols",
                    loadingIndicator: "esriLoadingIndicator",
                    loading: "esriLoading",
                    typeInput: "esriTypeInput",
                    container: "esriContainer",
                    overlay: "esriOverlay",
                    content: "esriContent",
                    centerContainer: "esriCenterContainer",
                    table: "esriTable",
                    tableCell: "esriTableCell",
                    centerBlock: "esriCenterBlock"
                }
            })
        },
        postCreate: function() {
            this.inherited(arguments);
            this._symbolTypesStore = new D(new p);
            this._symbolItemStore = new p;
            this.dap_markerCategoryInput.set({
                labelAttr: "name",
                sortByLabel: !1
            });
            this.createTooltip(this.dap_markerCategoryInput, this.labels.selectCategoryTooltip)
        },
        _updateTemplatePickerIfHeightless: function() {
            0 === B.get(this._templatePicker.domNode, "height") && this._templatePicker.update()
        },
        startup: function() {
            this.inherited(arguments);
            var a = new v({
                rows: "auto",
                columns: 6,
                items: [],
                emptyMessage: ""
            }, this.dap_templatePicker);
            a.startup();
            this._templatePicker =
                a;
            a.on("selection-change", c.hitch(this, function() {
                var b = a.getSelected();
                b && (b = x.cloneSymbol(b.item.symbol), this.emit("symbol-select", {
                    selection: b
                }))
            }));
            this._loadingIndicator = w.create(this.dap_symbolViewport);
            this.own(this._loadingIndicator);
            this.dap_markerCategoryInput.on("change", c.hitch(this, function(a) {
                this.clearSelection();
                this._fetchSymbols(a)
            }));
            this._normalizeSymbolStorage();
            this._loadStoredSymbolItems();
            this._setUpSymbolCategories().then(c.hitch(this, this.updateDisplay))
        },
        _fetchSymbols: function(a) {
            var b;
            this._templatePicker.items = [];
            (b = this._symbolItemStore.query({
                id: a
            })[0]) ? (this._saveRecentItem(b), this._updateSymbolOptions(b.items)) : (b = this._symbolTypesStore.query({
                id: a
            }), this._showLoadingIndicator(), this._getSymbolListData(b).then(c.hitch(this, this._symbolItemsFromJson)).then(c.hitch(this, function(b) {
                var c = {
                        id: a,
                        items: b
                    },
                    q;
                this._symbolItemStore.put(c);
                this._saveRecentItem(c);
                (q = this._symbolTypesStore.query({
                    defaultType: !0
                })[0]) && q.id === a && this._saveDefaultItem(c);
                return b
            })).then(c.hitch(this,
                this._updateSymbolOptions)))
        },
        _saveRecentItem: function(a) {
            a = {
                id: a.id,
                items: this._symbolItemsToJson(a.items)
            };
            sessionStorage.setItem(this._getRecentItemKey(), JSON.stringify(a))
        },
        _getRecentItemKey: function() {
            return this._toItemKey("/recent")
        },
        _toItemKey: function(a) {
            return this._storageItemKeyBase + a
        },
        _getDefaultItemKey: function() {
            return this._toItemKey("/default")
        },
        _getTypesItemKey: function() {
            return this._toItemKey("/types")
        },
        _getVersionItemKey: function() {
            return this._toItemKey("/version")
        },
        _saveDefaultItem: function(a) {
            a = {
                id: a.id,
                items: this._symbolItemsToJson(a.items)
            };
            localStorage.setItem(this._getDefaultItemKey(), JSON.stringify(a))
        },
        _showNoSymbolsMessage: function() {
            this._hideLoadingIndicator();
            e.add(this.domNode, this.css.noSymbols);
            this._placeNoSymbolsOverlay()
        },
        _placeNoSymbolsOverlay: function() {
            var a, b, c;
            this._noSymbolsOverlay || (c = this.css, a = d.create("div", {
                "class": c.overlay
            }), b = d.create("div", {
                "class": c.centerContainer + " " + c.table
            }, a), b = d.create("div", {
                "class": c.tableCell
            }, b), b = d.create("div", {
                    "class": c.centerBlock
                },
                b), d.create("div", {
                "class": c.content,
                innerHTML: this.labels.symbolLoadError
            }, b), d.place(a, this.domNode), this._noSymbolsOverlay = a)
        },
        _getStorageVersionKey: function() {
            return r.version + "|" + A.locale
        },
        _normalizeSymbolStorage: function() {
            var a = localStorage.getItem(this._getVersionItemKey()),
                b = this._getStorageVersionKey();
            a !== b && (localStorage.setItem(this._getVersionItemKey(), b), localStorage.removeItem(this._getTypesItemKey()), localStorage.removeItem(this._getDefaultItemKey()), sessionStorage.removeItem(this._getRecentItemKey()))
        },
        _loadStoredSymbolItems: function() {
            var a = this._loadDefaultSymbolItem(),
                b = this._loadRecentSymbolItem();
            a && this._symbolItemStore.put(this._symbolItemsFromSymbolItemJson(a));
            b && this._symbolItemStore.put(this._symbolItemsFromSymbolItemJson(b))
        },
        _loadDefaultSymbolItem: function() {
            var a = localStorage.getItem(this._getDefaultItemKey());
            if (a) return JSON.parse(a)
        },
        _loadRecentSymbolItem: function() {
            var a = sessionStorage.getItem(this._getRecentItemKey());
            if (a) return JSON.parse(a)
        },
        _loadSymbolTypes: function() {
            var a =
                localStorage.getItem(this._getTypesItemKey());
            if (a) return JSON.parse(a)
        },
        _saveSymbolTypes: function(a) {
            localStorage.setItem(this._getTypesItemKey(), JSON.stringify(a))
        },
        _symbolItemsFromSymbolItemJson: function(a) {
            a.items = g.map(a.items, function(a) {
                return {
                    symbol: l.fromJson(a.symbol)
                }
            });
            return a
        },
        _fetchSymbolTypes: function() {
            var a = new f,
                b = this._loadSymbolTypes();
            return b ? (a.resolve(b), a.promise) : this._getSymbolListGroupId().then(c.hitch(this, this._getSymbolListItems)).then(c.hitch(this, function(a) {
                this._saveSymbolTypes(a);
                return a
            }))
        },
        _setUpSymbolCategories: function() {
            this._showLoadingIndicator();
            return this._initPortal().then(c.hitch(this, this._fetchSymbolTypes)).then(c.hitch(this, this._setUpSymbolSelect), c.hitch(this, function() {
                this._showNoSymbolsMessage()
            }))
        },
        _setUpSymbolSelect: function(a) {
            var b = this._symbolTypesStore,
                c, d;
            b.setData(a);
            g.forEach(a, function(a) {
                a.defaultType && (c = a.id)
            });
            if (a = this._loadRecentSymbolItem())
                if (d = b.query({
                        id: a.id
                    })[0]) c = a.id;
            this.dap_markerCategoryInput.set("store", b);
            this.dap_markerCategoryInput.set("value",
                c, !1)
        },
        _showLoadingIndicator: function() {
            8 >= n("ie") ? e.add(this.domNode, this.css.loading) : this._loadingIndicator.show()
        },
        _hideLoadingIndicator: function() {
            8 >= n("ie") ? e.remove(this.domNode, this.css.loading) : this._loadingIndicator.hide()
        },
        _setPortalUrlAttr: function(a) {
            a !== this.portalUrl && this._set("portalUrl", a)
        },
        _initPortal: function() {
            var a = new f,
                b;
            this.portalSelf ? (b = new h.Portal({
                self: this.portalSelf
            }), this.set("portalUrl", b.url)) : b = new h.Portal(this.portalUrl);
            this.own(b.on("load", c.hitch(this, function() {
                this._portal =
                    b;
                a.resolve()
            })));
            setTimeout(function() {
                a.reject()
            }, this._portalLoadTimeoutInMs);
            return a.promise
        },
        _getSymbolListGroupId: function() {
            var a = new f;
            this._portal.queryGroups({
                q: this._portal.symbolSetsGroupQuery
            }).then(function(b) {
                a.resolve(b.results[0].id)
            }, function() {
                a.reject()
            });
            return a.promise
        },
        _getSymbolListItems: function(a) {
            var b = new f,
                d = this._portal;
            a = "group:" + a + ' AND type:"Symbol Set"';
            var e = [];
            a = "vml" === E.renderer ? a + ' AND -typekeywords:"by value"' : a + ' AND (typekeywords:"by value" AND typekeywords:"marker")';
            d.queryItems({
                q: a,
                num: 20,
                sortField: "title"
            }).then(c.hitch(this, function(a) {
                var c, d, f, h;
                g.forEach(a.results, function(a) {
                    c = a.typeKeywords.join(" "); - 1 < c.indexOf("marker") && (d = a.title, f = {
                        name: d,
                        id: a.id,
                        title: a.title,
                        keywords: c,
                        dataUrl: a.itemDataUrl
                    }, (h = -1 < c.indexOf("default")) ? (f.defaultType = !0, e.unshift(f)) : e.push(f))
                }, this);
                0 < e.length ? b.resolve(e) : b.reject()
            }), function() {
                b.reject()
            });
            return b.promise
        },
        _getSymbolListData: function(a) {
            a = g.map(a, function(a) {
                return s({
                    url: a.dataUrl
                }).promise
            });
            return C(a).then(function(a) {
                return a[0]
            })
        },
        _symbolItemsFromJson: function(a) {
            return g.map(a, function(a) {
                return {
                    symbol: l.fromJson(a)
                }
            })
        },
        _symbolItemsToJson: function(a) {
            return g.map(a, function(a) {
                return {
                    symbol: a.symbol.toJson()
                }
            })
        },
        _updateSymbolOptions: function(a) {
            var b = this._templatePicker;
            b.items = a;
            b.update();
            b.domNode.parentNode.scrollTop = 0;
            this._hideLoadingIndicator()
        },
        _setDisplayModeAttr: function(a) {
            this.displayMode !== a && (this._set("displayMode", a), this.updateDisplay(a))
        },
        updateDisplay: function() {
            var a = this.dap_markerCategoryInput;
            this.clearSelection();
            "portal" === this.displayMode ? (this._fetchSymbols(a.value), k.show(a.domNode), e.remove(this.domNode, this.css.defaultSymbols)) : "default" === this.displayMode && (this._updateSymbolOptions(this._symbolItemsFromJson(this._defaultSimpleMarkerSymbols)), k.hide(a.domNode), e.add(this.domNode, this.css.defaultSymbols))
        },
        clearSelection: function() {
            this._templatePicker.clearSelection()
        },
        resetSelection: function() {
            var a = this.dap_markerCategoryInput,
                b = a.get("options");
            a.set("value", b[0]);
            this.clearSelection()
        }
    })
});