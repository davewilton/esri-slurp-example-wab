//>>built
define(["require", "dojo/Evented", "dijit/_WidgetBase", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/Deferred", "dojo/dom", "dojo/dom-attr", "dojo/dom-class", "dojo/dom-style", "dojo/dom-construct", "dojo/keys", "dojo/on", "dojo/promise/all", "dojo/query", "dojo/string", "dojo/i18n!../nls/jsapi", "dojo/text!./Search/templates/Search.html", "dojo/uacss", "dijit/a11yclick", "dijit/_TemplatedMixin", "dijit/focus", "dijit/_FocusMixin", "../InfoTemplate", "../kernel", "../SpatialReference", "../graphic", "../symbols/PictureMarkerSymbol", "../symbols/SimpleMarkerSymbol", "../symbols/SimpleLineSymbol", "../symbols/SimpleFillSymbol", "../geometry/Point", "../geometry/Extent", "../tasks/locator", "../tasks/query", "../symbols/TextSymbol", "../Color", "../symbols/Font", "../geometry/scaleUtils", "../styles/basic"], function(K, L, M, N, k, B, s, C, q, l, D, O, m, r, x, u, P, p, Q, ba, v, R, h, S, T, ca, E, t, U, V, y, W, z, F, X, G, Y, Z, w, $, aa) {
    return N("esri.dijit.Search", [M, R, S, L], {
        templateString: Q,
        reHostedFS: /https?:\/\/services.*\.arcgis\.com/i,
        basePath: K.toUrl("."),
        constructor: function(a, c) {
            this.css = {
                searchGroup: "searchGroup",
                searchInput: "searchInput",
                searchInputGroup: "searchInputGroup",
                searchBtn: "searchBtn",
                searchSubmit: "searchSubmit",
                searchIcon: "searchIcon esriIconZoom",
                searchButtonText: "searchButtonText",
                searchToggle: "searchToggle",
                searchToggleIcon: "searchIcon esriIconDownArrow",
                searchMenu: "searchMenu",
                searchMenuHeader: "menuHeader",
                searchClear: "searchClear",
                searchClearIcon: "searchIcon esriIconClose searchClose",
                searchSpinner: "searchIcon esriIconAjaxLoaderArrow searchSpinner",
                searchSourceName: "sourceName",
                suggestionsMenu: "suggestionsMenu",
                sourcesMenu: "sourcesMenu",
                activeSource: "active",
                hasValue: "hasValue",
                hasButtonMode: "hasButtonMode",
                hasMultipleSources: "hasMultipleSources",
                showSuggestions: "showSuggestions",
                showSources: "showSources",
                showNoResults: "showNoResults",
                searchLoading: "searchLoading",
                searchMoreResults: "moreResults",
                searchMoreResultsList: "resultsList",
                searchMoreResultsHeader: "moreHeader",
                searchMoreResultsItem: "moreItem",
                searchMoreResultsListHeader: "popupHeader",
                searchShowMoreResults: "showMoreResults",
                searchNoResultsMenu: "noResultsMenu",
                searchNoResultsBody: "noResultsBody",
                searchNoResultsHeader: "noResultsHeader",
                searchNoValueIcon: "noValueIcon esriIconNoticeTriangle",
                searchNoValueText: "noValueText",
                searchNoResultsText: "noResultsText",
                searchExpandContainer: "searchExpandContainer",
                searchAnimateContainer: "searchAnimate",
                searchExpanded: "searchExpanded",
                searchCollapsed: "searchCollapsed",
                searchClearFloat: "searchClearFloat"
            };
            this._allIndex = "all";
            this._objectIdIdentifier = "_objectId";
            this._dijitName = "Search Dijit::";
            this._deferreds = [];
            this.options = {
                map: null,
                theme: "arcgisSearch",
                visible: !0,
                value: "",
                sources: [{
                    locator: new X("//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"),
                    singleLineFieldName: "SingleLine",
                    outFields: ["Addr_type"],
                    name: p.widgets.Search.main.esriLocatorName,
                    localSearchOptions: {
                        minScale: 3E5,
                        distance: 5E4
                    },
                    placeholder: p.widgets.Search.main.placeholder,
                    highlightSymbol: (new U(this.basePath + "/Search/images/search-pointer.png", 36, 36)).setOffset(9, 18)
                }],
                activeSourceIndex: 0,
                suggestionDelay: 150,
                enableSourcesMenu: !0,
                enableSuggestionsMenu: !0,
                enableInfoWindow: !0,
                showInfoWindowOnSelect: !0,
                enableSuggestions: !0,
                enableButtonMode: !1,
                autoNavigate: !0,
                autoSelect: !0,
                addLayersFromMap: !1,
                zoomScale: 1E3,
                graphicsLayer: null,
                enableHighlight: !0,
                highlightGraphic: null,
                enableLabel: !1,
                labelSymbol: (new Y).setColor(new Z([181, 56, 46, 0.9])).setFont(new w("14px", w.STYLE_NORMAL, w.VARIANT_NORMAL, w.WEIGHT_BOLD, "Arial")),
                labelGraphic: null,
                infoTemplate: new T(p.widgets.Search.main.searchResult, '\x3cdiv class\x3d"${searchTheme}"\x3e\x3cdiv id\x3d"${searchMoreResultsId}" class\x3d"${searchMoreResults}"\x3e\x3cdiv class\x3d"${searchMoreResultsItem}"\x3e${searchResult}\x3c/div\x3e\x3cdiv\x3e${searchMoreResultsHtml}\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e'),
                searchResults: null,
                suggestResults: null,
                expanded: !1,
                maxResults: 6,
                maxSuggestions: 6,
                locationToAddressDistance: 1500,
                minCharacters: 1
            };
            var b = k.mixin({}, this.options, a);
            this.set("map", b.map);
            this.set("theme", b.theme);
            this.set("visible", b.visible);
            this.set("value", b.value);
            this.set("sources", b.sources);
            this.set("activeSourceIndex", b.activeSourceIndex);
            this.set("suggestionDelay", b.suggestionDelay);
            this.set("enableSourcesMenu", b.enableSourcesMenu);
            this.set("enableSuggestionsMenu", b.enableSuggestionsMenu);
            this.set("enableInfoWindow", b.enableInfoWindow);
            this.set("enableSuggestions", b.enableSuggestions);
            this.set("enableButtonMode", b.enableButtonMode);
            this.set("autoNavigate", b.autoNavigate);
            this.set("autoSelect", b.autoSelect);
            this.set("addLayersFromMap", b.addLayersFromMap);
            this.set("zoomScale", b.zoomScale);
            this.set("graphicsLayer", b.graphicsLayer);
            this.set("enableHighlight", b.enableHighlight);
            this.set("highlightGraphic", b.highlightGraphic);
            this.set("enableLabel", b.enableLabel);
            this.set("labelSymbol", b.labelSymbol);
            this.set("labelGraphic", b.labelGraphic);
            this.set("infoTemplate", b.infoTemplate);
            this.set("searchResults", b.searchResults);
            this.set("suggestResults", b.suggestResults);
            this.set("expanded", b.expanded);
            this.set("minCharacters", b.minCharacters);
            this.set("showInfoWindowOnSelect", b.showInfoWindowOnSelect);
            this.set("maxResults", b.maxResults);
            this.set("maxSuggestions", b.maxSuggestions);
            this.set("locationToAddressDistance", b.locationToAddressDistance);
            this._updateActiveSource();
            this._i18n = p;
            this._defaultSR = new E(4326);
            this.domNode = c
        },
        startup: function() {
            this.sources ||
                (this.sources = []);
            if (this.domNode)
                if (this.map)
                    if (this.map.loaded) this._init();
                    else r.once(this.map, "load", k.hitch(this, function() {
                        this._init()
                    }));
            else this._init();
            else console.log(this._dijitName + " domNode is undefined."), this.destroy()
        },
        postCreate: function() {
            this.inherited(arguments);
            this._moreResultsId = this.id + "_more_results";
            this.own(r(this.submitNode, v, k.hitch(this, this._searchButton)));
            this.own(r(this.sourcesBtnNode, v, k.hitch(this, this._toggleSourcesMenu)));
            this.own(r(this.inputNode, v, k.hitch(this,
                this._inputClick)));
            this.own(r(this.clearNode, v, k.hitch(this, this.clear)));
            this.own(r(this.inputNode, "keyup", k.hitch(this, function(a) {
                this._inputKey(a)
            })));
            this.own(r(this.sourcesBtnNode, "keyup", k.hitch(this, function(a) {
                this._sourceBtnKey(a)
            })));
            this.own(r(this.suggestionsNode, "li:click, li:keyup", k.hitch(this, function(a) {
                this._suggestionsEvent(a)
            })));
            this.own(r(this.sourcesNode, "li:click, li:keyup", k.hitch(this, function(a) {
                this._sourcesEvent(a)
            })));
            this.map && (this.map.infoWindow && this.map.infoWindow.domNode &&
                this.enableInfoWindow) && (this.own(r(this.map.infoWindow.domNode, "#" + this._moreResultsId + "_show:click", k.hitch(this, function() {
                this._showMoreResultsClick()
            }))), this.own(r(this.map.infoWindow.domNode, "#" + this._moreResultsId + "_list li a:click", k.hitch(this, function(a) {
                this._moreResultsClick(a)
            }))));
            this.value && this._checkStatus();
            this._hideMenus();
            this._updateVisible();
            this._insertSources(this.sources);
            this._setPlaceholder(this.activeSourceIndex);
            this._updateButtonMode(this.enableButtonMode);
            this.toggle(this.expanded)
        },
        destroy: function() {
            O.empty(this.domNode);
            this.inherited(arguments)
        },
        clear: function() {
            this._clearGraphics();
            q.set(this.inputNode, "value", "");
            this._changeAttrValue("value", "");
            this.set("searchResults", null);
            this.set("suggestResults", null);
            l.remove(this.containerNode, this.css.hasValue);
            q.set(this.clearNode, "title", "");
            this._hideMenus();
            this._closePopup();
            this._hideLoading();
            h.focus(this.inputNode);
            this.emit("clear-search", {})
        },
        show: function() {
            D.set(this.domNode, "display", "block")
        },
        hide: function() {
            D.set(this.domNode,
                "display", "none")
        },
        expand: function() {
            this.enableButtonMode && (l.add(this.containerNode, this.css.searchExpanded), l.remove(this.containerNode, this.css.searchCollapsed), this._hideMenus(), this.set("expanded", !0))
        },
        collapse: function() {
            this.enableButtonMode && (l.remove(this.containerNode, this.css.searchExpanded), l.add(this.containerNode, this.css.searchCollapsed), this._hideMenus(), this.set("expanded", !1))
        },
        toggle: function(a) {
            this.enableButtonMode && ("undefined" === typeof a && (a = !this.expanded), a ? this.expand() :
                this.collapse())
        },
        search: function(a) {
            var c, b = new s,
                d = this.value,
                e = this.activeSourceIndex;
            a && a.hasOwnProperty("index") && (e = a.index);
            this._showLoading();
            this._hideMenus();
            this._closePopup();
            this._clearGraphics();
            (a = a ? "string" === typeof a ? this._searchSource({
                    text: a
                }) : "object" === typeof a && a.hasOwnProperty("magicKey") ? this._searchSource(a) : "object" === typeof a && a.hasOwnProperty("geometry") ? this._searchSource({
                    geometry: a
                }) : "object" === typeof a && a.hasOwnProperty(this._objectIdIdentifier) ? this._searchSource(a) :
                "object" === typeof a && "point" === a.type ? this._searchSource({
                    point: a
                }) : a instanceof Array && 2 === a.length ? this._searchSource({
                    latlon: a
                }) : this._searchSource({
                    text: d
                }) : this._searchSource({
                    text: d
                })) ? a.then(k.hitch(this, function(a) {
                if (a = this._formatResults(a, e)) {
                    var g = a.results;
                    this.set("searchResults", g);
                    c = {
                        activeSourceIndex: e,
                        results: g,
                        numResults: a.numResults,
                        value: d
                    };
                    0 === a.numResults && (this._noResultsHTML(d), this._showNoResultsMenu());
                    this._hideLoading();
                    this.emit("search-results", c);
                    this._selectFirstResult(g,
                        e);
                    b.resolve(c)
                }
            }), k.hitch(this, function(a) {
                this.set("searchResults", null);
                c = {
                    activeSourceIndex: e,
                    results: null,
                    numResults: 0,
                    value: d,
                    error: a
                };
                this.emit("search-results", c);
                this._hideLoading();
                b.resolve(c)
            })): (this._hideLoading(), b.reject(Error(this._dijitName + " Error processing search query")));
            return b.promise
        },
        suggest: function(a) {
            var c, b, d = new s;
            a || (a = this.value);
            var e = this.activeSourceIndex;
            (c = this._suggestSource({
                text: a
            })) ? c.then(k.hitch(this, function(c) {
                if (c = this._formatResults(c, e)) {
                    var g = c.results;
                    this.set("suggestResults", g);
                    this._insertSuggestions(g);
                    b = {
                        activeSourceIndex: e,
                        results: g,
                        numResults: c.numResults,
                        value: a
                    };
                    this.emit("suggest-results", b);
                    d.resolve(b)
                }
            }), k.hitch(this, function(c) {
                this.set("suggestResults", null);
                this._insertSuggestions();
                b = {
                    activeSourceIndex: e,
                    results: null,
                    numResults: 0,
                    value: a,
                    error: c
                };
                this.emit("suggest-results", b);
                d.resolve(b)
            })): d.reject(Error(this._dijitName + " Error processing suggest query"));
            return d.promise
        },
        select: function(a) {
            var c, b, d, e = this.sources,
                f = this.activeSourceIndex,
                g = this.enableHighlight,
                H = this.enableLabel,
                l = this.autoNavigate,
                I = this.showInfoWindowOnSelect,
                A = this.enableInfoWindow,
                J = this.infoTemplate;
            if (f === this._allIndex) {
                var n = this._getSourceIndexOfResult(a);
                null !== n && (d = e[n], f = n)
            } else d = e[f];
            d && (c = d.highlightSymbol, b = d.labelSymbol, d.hasOwnProperty("enableHighlight") && (g = d.enableHighlight), d.hasOwnProperty("enableLabel") && (H = d.enableLabel), d.hasOwnProperty("autoNavigate") && (l = d.autoNavigate), d.hasOwnProperty("showInfoWindowOnSelect") && (I = d.showInfoWindowOnSelect),
                d.hasOwnProperty("enableInfoWindow") && (A = d.enableInfoWindow), d.hasOwnProperty("infoTemplate") && (J = d.infoTemplate));
            this._hideMenus();
            this._hideLoading();
            if (a.feature) {
                var e = this.highlightGraphic,
                    h = this.graphicsLayer,
                    n = this.labelGraphic;
                c = c || this._getDefaultSymbol(a) || a.feature.symbol;
                b = b || this.labelSymbol || a.feature.symbol;
                var m = k.mixin({}, a.feature.attributes, {
                        searchTheme: this.theme,
                        searchResult: a.name,
                        searchMoreResults: this.css.searchMoreResults,
                        searchMoreResultsItem: this.css.searchMoreResultsItem,
                        searchMoreResultsId: this._moreResultsId,
                        searchMoreResultsHtml: this._moreResultsHTML(a)
                    }),
                    p = null;
                A && (p = J);
                n ? (n.setGeometry(a.feature.geometry), n.setAttributes(m), n.setSymbol(b)) : (n = new t(a.feature.geometry, b, m), H && (h ? h.add(n) : this.map && this.map.graphics && this.map.graphics.add(n)));
                n && (n.symbol && "textsymbol" === n.symbol.type) && n.symbol.setText(a.name);
                e ? (e.setGeometry(a.feature.geometry), e.setAttributes(m), e.setInfoTemplate(p), e.setSymbol(c)) : (e = new t(a.feature.geometry, c, m, p), g && (h ? h.add(e) : this.map &&
                    this.map.graphics && this.map.graphics.add(e)));
                e && (e.symbol && "textsymbol" === e.symbol.type) && e.symbol.setText(a.name);
                this.map && (this.map.infoWindow && A && I) && (this.map.infoWindow.setFeatures([e]), g = this._getPointFromGeometry(e.geometry), this.map.infoWindow.show(g));
                this.map && (l && a && a.hasOwnProperty("extent")) && ("function" === typeof this.map.setExtent ? this.map.setExtent(a.extent) : "function" === typeof this.map.set && this.map.set("extent", a.extent));
                this.set("highlightGraphic", e);
                this.set("labelGraphic", n)
            }
            this.emit("select-result", {
                result: a,
                source: d,
                sourceIndex: f
            })
        },
        focus: function() {
            h.focus(this.inputNode);
            this.map && "function" === typeof this.map.disableKeyboardNavigation && this.map.disableKeyboardNavigation();
            this.emit("focus", {})
        },
        blur: function() {
            h.curNode && h.curNode.blur();
            this._hideMenus();
            this.map && "function" === typeof this.map.enableKeyboardNavigation && this.map.enableKeyboardNavigation();
            this.enableButtonMode && this.loaded && this.collapse();
            this.emit("blur", {})
        },
        _init: function() {
            this._getMapLayers().then(k.hitch(this, function() {
                this.set("loaded", !0);
                this.emit("load", {})
            }))
        },
        _getDefaultSymbol: function(a) {
            var c, b, d, e;
            this.map && (e = this.map.getBasemap());
            e || (e = "topo");
            a && (a.feature && a.feature.geometry) && (d = a.feature.geometry.type);
            if (d) {
                if (a = aa.getSchemes({
                        theme: "default",
                        basemap: e,
                        geometryType: d
                    })) b = a.primaryScheme;
                if (b) {
                    c = b;
                    a = b.color;
                    b = b.size;
                    var f;
                    switch (d) {
                        case "point":
                            f = new V;
                            f.setColor(a);
                            f.setSize(null !== b ? b : c.size);
                            d = new y;
                            d.setColor(c.outline.color);
                            d.setWidth(c.outline.width);
                            f.setOutline(d);
                            break;
                        case "line":
                            f = new y;
                            f.setColor(a);
                            f.setWidth(null !== b ? b : c.width);
                            break;
                        case "polygon":
                            f = new W, f.setColor(a), d = new y, d.setColor(c.outline.color), d.setWidth(c.outline.width), f.setOutline(d)
                    }
                    c = f
                }
            }
            return c
        },
        _selectFirstResult: function(a, c) {
            if (this.autoSelect && a) {
                var b;
                c === this._allIndex ? b = this._getFirstResult(a) : a[c] && a[c][0] && (b = a[c][0]);
                b && this.select(b)
            }
        },
        _getSourceIndexOfResult: function(a) {
            var c = this.searchResults;
            if (c)
                for (var b in c)
                    if (c[b] && c[b].length)
                        for (var d = 0; d < c[b].length; d++)
                            if (c[b][d] === a) return parseInt(b, 10);
            return null
        },
        _getFirstResult: function(a) {
            if (a)
                for (var c in a)
                    if (a[c] && a[c][0]) return a[c][0];
            return !1
        },
        _onFocus: function() {
            this.focus();
            this.inherited(arguments)
        },
        _onBlur: function() {
            this.blur();
            this.inherited(arguments)
        },
        _getMapLayers: function() {
            var a = new s;
            if (this.addLayersFromMap) {
                var c = [],
                    b = [],
                    d = this.map.graphicsLayerIds;
                if (d && d.length) {
                    for (var e = 0; e < d.length; e++) {
                        var f = this.map.getLayer(d[e]);
                        f && (c.push(f), b.push(this._featureLayerLoaded(f)))
                    }
                    b.length ? x(b).then(k.hitch(this, function() {
                        for (var b = this.sources,
                                d = 0; d < c.length; d++) "Feature Layer" === c[d].type && b.push({
                            featureLayer: c[d],
                            enableSuggestions: !0
                        });
                        this.set("sources", b);
                        a.resolve(b)
                    }), k.hitch(this, function(b) {
                        b || (b = Error(this._dijitName + " Error loading a layer"));
                        a.reject(b)
                    })) : a.resolve()
                } else a.resolve()
            } else a.resolve();
            return a.promise
        },
        _moreResultsClick: function(a) {
            var c = a.target;
            a = parseInt(q.get(c, "data-source-index"), 10);
            var b = parseInt(q.get(c, "data-index"), 10),
                d = this.searchResults;
            (c = q.get(c, "data-latlon")) ? (this.set("value", c), this.search()) :
            d && d[a] && (a = d[a][b]) && this.select(a)
        },
        _showMoreResultsClick: function() {
            var a = C.byId(this._moreResultsId);
            if (a) {
                l.toggle(a, this.css.searchShowMoreResults);
                var c = C.byId(this._moreResultsId + "_show");
                c && (l.contains(a, this.css.searchShowMoreResults) ? c.innerHTML = p.widgets.Search.main.hideMoreResults : c.innerHTML = p.widgets.Search.main.showMoreResults)
            }
        },
        _clearGraphics: function() {
            var a = this.highlightGraphic,
                c = this.graphicsLayer,
                b = this.labelGraphic;
            a && (c ? c.remove(a) : this.map && this.map.graphics && this.map.graphics.remove(a));
            b && (c ? c.remove(b) : this.map && this.map.graphics && this.map.graphics.remove(b));
            this.set("labelGraphic", null);
            this.set("highlightGraphic", null)
        },
        _featureLayerLoaded: function(a) {
            var c = new s;
            if (a.loaded) c.resolve();
            else if (a.loadError) c.reject(Error(this._dijitName + " Layer failed to load."));
            else {
                var b, d;
                b = r.once(a, "load", k.hitch(this, function() {
                    d.remove();
                    c.resolve()
                }));
                d = r.once(a, "error", k.hitch(this, function() {
                    b.remove();
                    c.reject(Error(this._dijitName + " Layer could not be loaded."))
                }))
            }
            return c.promise
        },
        _getObjectSize: function(a) {
            var c = 0,
                b;
            for (b in a) a.hasOwnProperty(b) && c++;
            return c
        },
        _sourcesEvent: function(a) {
            var c = a.target,
                b = q.get(c, "data-index"),
                d = u("li", this.sourcesNode),
                c = B.indexOf(d, c);
            b !== this._allIndex && (b = parseInt(b, 10));
            "click" === a.type || a.keyCode === m.ENTER ? (this.set("activeSourceIndex", b), h.focus(this.inputNode), this._hideSourcesMenu()) : a.keyCode === m.UP_ARROW ? (a.stopPropagation(), a.preventDefault(), a = c - 1, 0 > a ? h.focus(this.sourcesBtnNode) : h.focus(d[a])) : a.keyCode === m.DOWN_ARROW ? (a.stopPropagation(),
                a.preventDefault(), a = c + 1, a >= d.length ? h.focus(this.sourcesBtnNode) : h.focus(d[a])) : a.keyCode === m.ESCAPE && (this._hideSourcesMenu(), h.focus(this.inputNode))
        },
        _suggestionsEvent: function(a) {
            var c = a.target,
                b = q.get(c, "data-source-index"),
                d = parseInt(q.get(c, "data-index"), 10),
                e = u("li", this.suggestionsNode),
                f = this.sources,
                c = B.indexOf(e, c);
            b !== this._allIndex && (b = parseInt(b, 10));
            var g;
            this._clearQueryTimeout();
            "click" === a.type || a.keyCode === m.ENTER ? ((e = this.suggestResults) && (e[b] && e[b][d]) && (g = e[b][d]), g && (g.index =
                b, f[b].featureLayer ? (g[this._objectIdIdentifier] = g.feature.attributes[f[b].featureLayer.objectIdField], b = this._getDisplayField(f[b]), b = g.feature.attributes[b]) : b = g.text, b || (b = ""), this.set("value", b), this.search(g), h.focus(this.inputNode))) : a.keyCode === m.BACKSPACE || a.keyCode === m.DELETE ? h.focus(this.inputNode) : a.keyCode === m.UP_ARROW ? (a.stopPropagation(), a.preventDefault(), g = c - 1, 0 > g ? h.focus(this.inputNode) : h.focus(e[g])) : a.keyCode === m.DOWN_ARROW ? (a.stopPropagation(), a.preventDefault(), g = c + 1, g >= e.length ?
                h.focus(this.inputNode) : h.focus(e[g])) : a.keyCode === m.ESCAPE && (this._hideMenus(), h.focus(this.inputNode))
        },
        _getResultName: function(a) {
            return a.name || p.widgets.Search.main.untitledResult
        },
        _getSuggestionName: function(a) {
            return a.text || a.name || p.widgets.Search.main.untitledResult
        },
        _moreResultsHTML: function(a) {
            var c = "",
                b = "",
                d = this.searchResults,
                e = this.sources,
                f = 0;
            if (d) {
                var b = b + ('\x3cdiv class\x3d"' + this.css.searchMoreResultsItem + '"\x3e'),
                    b = b + ('\x3ca href\x3d"javascript:;" id\x3d"' + this._moreResultsId +
                        '_show"\x3e' + p.widgets.Search.main.showMoreResults + "\x3c/a\x3e"),
                    b = b + "\x3c/div\x3e" + ('\x3cdiv class\x3d"' + this.css.searchMoreResultsList + '"\x3e'),
                    b = b + ('\x3cdiv class\x3d"' + this.css.searchMoreResultsHeader + '"\x3e'),
                    b = b + p.widgets.Search.main.moreResultsHeader,
                    b = b + "\x3c/div\x3e",
                    b = b + ('\x3cdiv id\x3d"' + this._moreResultsId + '_list"\x3e'),
                    g;
                for (g in d)
                    if (d[g] && d[g].length) {
                        if (1 < this._getObjectSize(d) && !(1 === d[g].length && d[g][0] === a)) var k = this._getSourceName(g),
                            b = b + ('\x3cdiv class\x3d"' + this.css.searchMoreResultsListHeader +
                                '"\x3e' + k + "\x3c/div\x3e");
                        for (var b = b + "\x3cul\x3e", l = e[g].maxResults || this.maxResults, k = 0; k < d[g].length && k < l; ++k)
                            if (d[g][k] !== a) {
                                var h = this._getResultName(d[g][k]),
                                    b = b + ('\x3cli\x3e\x3ca tabindex\x3d"0" title\x3d"' + h + '" data-index\x3d"' + k + '" data-source-index\x3d"' + g + '" href\x3d"javascript:;"\x3e' + h + "\x3c/a\x3e\x3c/li\x3e");
                                f++
                            }
                        a.feature.attributes && (a.feature.attributes.Addr_type && "LatLong" === a.feature.attributes.Addr_type) && (k = a.name.split(" "), 2 == k.length && (k = k[1] + " " + k[0], b += '\x3cli\x3e\x3ca data-latlon\x3d"' +
                            k + '" tabindex\x3d"0" title\x3d"' + k + '" href\x3d"javascript:;"\x3e' + k + "\x3c/a\x3e\x3c/li\x3e", f++));
                        b += "\x3c/ul\x3e"
                    }
                b += "\x3c/div\x3e";
                b += "\x3c/div\x3e"
            }
            f && (c += b);
            return c
        },
        _validField: function(a, c) {
            return a.getField(c)
        },
        _validFields: function(a, c) {
            if (a && c && c.length) {
                for (var b = 0; b < c.length; b++)
                    if (!this._validField(a, c[b])) return !1;
                return !0
            }
            return !1
        },
        _suggest: function(a) {
            a || (a = {
                index: this.activeSourceIndex,
                text: this.value
            });
            var c = new s;
            this._deferreds.push(c);
            var b = a.index,
                d = this.sources[b],
                e = this.enableSuggestions;
            d.hasOwnProperty("enableSuggestions") && (e = d.enableSuggestions);
            var f = 0,
                g;
            a.hasOwnProperty("text") && (g = k.trim(a.text), f = a.text.length);
            a = d.minCharacters || this.minCharacters;
            if (e && g && f >= a && this._supportsPagination(d)) {
                var l = "";
                d.prefix && (l += d.prefix);
                l += g;
                d.suffix && (l += d.suffix);
                var h = this._defaultSR;
                this.map && (h = this.map.spatialReference);
                e = {};
                if (d.locator) {
                    d.categories && (e.categories = d.categories);
                    d.locator.outSpatialReference = h;
                    if (this.map && (d.localSearchOptions && d.localSearchOptions.hasOwnProperty("distance") &&
                            d.localSearchOptions.hasOwnProperty("minScale")) && (f = this._getScale(), !d.localSearchOptions.minScale || f && f <= parseFloat(d.localSearchOptions.minScale))) e.location = this.map.extent.getCenter(), e.distance = d.localSearchOptions.distance;
                    e.text = l;
                    d.searchExtent && (e.searchExtent = d.searchExtent);
                    d.locator.suggestLocations(e).then(k.hitch(this, function(a) {
                        c.isFulfilled() || c.resolve(a)
                    }), k.hitch(this, function(a) {
                        a || (a = Error(this._dijitName + " Suggest location error"));
                        c.reject(a)
                    }))
                } else d.featureLayer && this._featureLayerLoaded(d.featureLayer).then(k.hitch(this,
                    function() {
                        var a = this._getDisplayField(d),
                            e = d.searchFields || [a],
                            f = this._validField(d.featureLayer, a),
                            g = this._validFields(d.featureLayer, e);
                        if (!f || !g) c.reject(Error(this._dijitName + " Invalid featureLayer field"));
                        else {
                            f = new G;
                            f.outSpatialReference = h;
                            f.returnGeometry = !1;
                            f.num = d.maxSuggestions || this.maxSuggestions;
                            d.searchExtent && (f.geometry = d.searchExtent);
                            g = "";
                            this.reHostedFS.test(d.featureLayer.url) && this._containsNonLatinCharacter(l) && (g = "N");
                            f.outFields = [d.featureLayer.objectIdField, a];
                            if (e && e.length)
                                for (a =
                                    0; a < e.length; a++) f.where = 0 === a ? "" : f.where + " or ", f.where += "UPPER(" + e[a] + ") LIKE " + g + "'%" + l.toUpperCase() + "%'";
                            d.featureLayer.queryFeatures(f, k.hitch(this, function(a) {
                                var d;
                                (a = a.features) && (d = this._hydrateResults(a, b));
                                c.isFulfilled() || c.resolve(d)
                            }), k.hitch(this, function(a) {
                                a || (a = Error(this._dijitName + " suggest queryFeatures error"));
                                c.reject(a)
                            }))
                        }
                    }))
            } else c.resolve();
            return c.promise
        },
        _supportsPagination: function(a) {
            var c;
            a.locator ? c = !0 : a.featureLayer && a.featureLayer.advancedQueryCapabilities &&
                a.featureLayer.advancedQueryCapabilities.supportsPagination && (c = !0);
            return c
        },
        _suggestSource: function(a) {
            var c;
            c = this.sources;
            var b = this.activeSourceIndex;
            if (b === this._allIndex) {
                for (var b = [], d = 0; d < c.length; d++) {
                    var e = a;
                    e.index = d;
                    e = this._suggest(e);
                    b.push(e)
                }
                if (b.length) return x(b)
            } else if (a.index = b, c = c[b]) return this._suggest(a);
            a = new s;
            a.reject(Error(this._dijitName + " No suggestions to perform"));
            return a.promise
        },
        _getPointFromGeometry: function(a) {
            var c;
            switch (a.type) {
                case "extent":
                    c = a.getCenter();
                    break;
                case "multipoint":
                    c = a.getExtent().getCenter();
                    break;
                case "point":
                    c = a;
                    break;
                case "polygon":
                    c = a.getExtent().getCenter();
                    break;
                case "polyline":
                    c = a.getExtent().getCenter()
            }
            return c
        },
        _searchSource: function(a) {
            a.hasOwnProperty("index") || (a.index = this.activeSourceIndex);
            if (a.index === this._allIndex) {
                for (var c = [], b = this.sources, d = 0; d < b.length; d++) {
                    var e = a;
                    e.index = d;
                    (e = this._search(e)) && c.push(e)
                }
                if (c.length) return x(c)
            } else if (a = this._search(a)) return a;
            a = new s;
            a.reject(Error(this._dijitName + " No searches to perform"));
            return a.promise
        },
        _searchButton: function() {
            this.enableButtonMode && !this.expanded ? (this.expand(), h.focus(this.inputNode)) : this.search()
        },
        _search: function(a) {
            a || (a = {
                text: this.value,
                magicKey: null,
                geometry: null,
                point: null,
                index: this.activeSourceIndex,
                latlon: null
            });
            var c, b = new s;
            this._deferreds.push(b);
            var d = a.index,
                e = this.sources[d],
                f;
            a.hasOwnProperty("text") && (f = k.trim(a.text));
            if (e) {
                var g = "";
                e.prefix && (g += e.prefix);
                g += f;
                e.suffix && (g += e.suffix);
                var l = this._defaultSR;
                this.map && (l = this.map.spatialReference);
                if (e.locator)
                    if (a.hasOwnProperty("text") && f) {
                        var h = {};
                        e.categories && (h.categories = e.categories);
                        l && (e.locator.outSpatialReference = l);
                        if (this.map && e.localSearchOptions && e.localSearchOptions.hasOwnProperty("distance") && e.localSearchOptions.hasOwnProperty("minScale")) {
                            var m = this._getScale();
                            if (!e.localSearchOptions.minScale || m && m <= parseFloat(e.localSearchOptions.minScale)) h.location = this.map.extent.getCenter(), h.distance = e.localSearchOptions.distance
                        }
                        h.address = {};
                        h.maxLocations = e.maxResults || this.maxResults;
                        e.searchExtent && (h.searchExtent = e.searchExtent);
                        e.sourceCountry && (h.countryCode = e.sourceCountry);
                        a.magicKey && (h.magicKey = a.magicKey);
                        e.singleLineFieldName ? h.address[e.singleLineFieldName] = g : h.address["Single Line Input"] = g;
                        e.outFields && (h.outFields = e.outFields);
                        e.locator.addressToLocations(h).then(k.hitch(this, function(a) {
                            a = this._hydrateResults(a, d);
                            b.isFulfilled() || b.resolve(a)
                        }), k.hitch(this, function(a) {
                            a || (a = Error(this._dijitName + " addressToLocations error"));
                            b.reject(a)
                        }))
                    } else a.geometry ? (c =
                            this._getPointFromGeometry(a.geometry.geometry)) ? this._reverseGeocodePoint(d, c).then(function(a) {
                            b.isFulfilled() || b.resolve(a)
                        }, function(a) {
                            b.reject(a)
                        }) : b.reject(Error(this._dijitName + " Invalid point to reverse geocode")) : a.point ? this._reverseGeocodePoint(d, a.point).then(function(a) {
                            b.isFulfilled() || b.resolve(a)
                        }, function(a) {
                            b.reject(a)
                        }) : a.latlon ? (h = new z(a.latlon, this._defaultSR), this._reverseGeocodePoint(d, h).then(function(a) {
                            b.isFulfilled() || b.resolve(a)
                        }, function(a) {
                            b.reject(a)
                        })) : a.hasOwnProperty("text") &&
                        !f ? b.isFulfilled() || b.resolve([]) : b.reject(Error(this._dijitName + " Invalid query type for Locator"));
                else e.featureLayer && this._featureLayerLoaded(e.featureLayer).then(k.hitch(this, function() {
                    var h = this._getDisplayField(e),
                        m = e.searchFields || [h],
                        n = this._validField(e.featureLayer, h),
                        p = this._validFields(e.featureLayer, m);
                    if (!n || !p) b.reject(Error(this._dijitName + " Invalid featureLayer field"));
                    else {
                        n = new G;
                        l && (n.outSpatialReference = l);
                        n.returnGeometry = !0;
                        n.outFields = e.outFields ? e.outFields : [h];
                        var r,
                            q;
                        a.hasOwnProperty(this._objectIdIdentifier) || (n.num = e.maxResults || this.maxResults, e.searchExtent && (n.geometry = e.searchExtent), r = e.exactMatch, q = "", this.reHostedFS.test(e.featureLayer.url) && this._containsNonLatinCharacter(g) && (q = "N"));
                        if (a.hasOwnProperty("text") && f) {
                            if (m && m.length)
                                for (h = 0; h < m.length; h++) n.where = 0 === h ? "" : n.where + " or ", n.where = r ? n.where + (m[h] + " \x3d " + q + "'" + g + "'") : n.where + ("UPPER(" + m[h] + ") LIKE " + q + "'%" + g.toUpperCase() + "%'");
                            m = !0
                        } else a.hasOwnProperty(this._objectIdIdentifier) ? (n.objectIds = [a[this._objectIdIdentifier]], m = !0) : a.geometry ? (n.geometry = a.geometry, m = !0) : a.point ? (n.geometry = a.point, m = !0) : a.latlon ? (c = new z(a.latlon, this._defaultSR), n.geometry = c, m = !0) : (a.hasOwnProperty("text") && !f ? b.isFulfilled() || b.resolve([]) : b.reject(Error(this._dijitName + " Invalid query type for FeatureLayer")), m = !1);
                        m && e.featureLayer.queryFeatures(n, k.hitch(this, function(a) {
                            a = a.features;
                            var c;
                            a && (c = this._hydrateResults(a, d));
                            b.isFulfilled() || b.resolve(c)
                        }), k.hitch(this, function(a) {
                            a || (a = Error(this._dijitName +
                                " Search queryFeatures error"));
                            b.reject(a)
                        }))
                    }
                }))
            } else b.reject(Error(this._dijitName + " Source is undefined"));
            return b.promise
        },
        _clearQueryTimeout: function() {
            this._queryTimer && clearTimeout(this._queryTimer)
        },
        _formatResults: function(a, c) {
            var b = {},
                d = 0,
                e;
            if (a) {
                if (c === this._allIndex)
                    for (var f = 0; f < a.length; f++) a[f] && (b[f] = a[f], d += a[f].length, e = !0);
                else b[c] = a, d += a.length, e = !0;
                if (e) return {
                    numResults: d,
                    results: b
                }
            }
        },
        _reverseGeocodePoint: function(a, c) {
            var b = new s,
                d = this.sources[a];
            if (c && d) {
                var e = d.locationToAddressDistance ||
                    this.locationToAddressDistance;
                d.locator.outSpatialReference = this._defaultSR;
                this.map && (d.locator.outSpatialReference = this.map.spatialReference);
                d.locator.locationToAddress(c, e, k.hitch(this, function(c) {
                    c = this._hydrateResults([c], a);
                    b.resolve(c)
                }), k.hitch(this, function(a) {
                    a || (a = Error(this._dijitName + " locationToAddress error"));
                    b.reject(a)
                }))
            } else b.reject(Error(this._dijitName + " no point or active geocoder defined"));
            return b.promise
        },
        _cancelDeferreds: function() {
            if (this._deferreds && this._deferreds.length)
                for (var a =
                        0; a < this._deferreds.length; a++) this._deferreds[a].isFulfilled() || this._deferreds[a].cancel(this._dijitName + " cancelling request");
            this._deferreds = []
        },
        _sourceBtnKey: function(a) {
            if (a) {
                var c = u("li", this.sourcesNode);
                a.keyCode === m.UP_ARROW ? (a.stopPropagation(), a.preventDefault(), this._showSourcesMenu(), (a = c.length) && h.focus(c[a - 1])) : a.keyCode === m.DOWN_ARROW && (a.stopPropagation(), a.preventDefault(), this._showSourcesMenu(), c[0] && h.focus(c[0]))
            }
        },
        _inputKey: function(a) {
            if (a) {
                var c = u("li", this.suggestionsNode),
                    b = this.suggestResults;
                this._cancelDeferreds();
                this._clearQueryTimeout();
                if (a.keyCode === m.TAB || a.keyCode === m.ESCAPE) this._hideMenus();
                else if (a.keyCode === m.UP_ARROW) a.stopPropagation(), a.preventDefault(), b && this._showSuggestionsMenu(), (a = c.length) && h.focus(c[a - 1]);
                else if (a.keyCode === m.DOWN_ARROW) a.stopPropagation(), a.preventDefault(), b && this._showSuggestionsMenu(), c[0] && h.focus(c[0]);
                else {
                    if (a.ctrlKey || a.metaKey || a.keyCode === m.copyKey || a.keyCode === m.LEFT_ARROW || a.keyCode === m.RIGHT_ARROW) return a;
                    this._changeAttrValue("value", this.inputNode.value);
                    this._checkStatus();
                    a.keyCode === m.ENTER ? this.search() : this._queryTimer = setTimeout(k.hitch(this, function() {
                        this.suggest()
                    }), this.suggestionDelay)
                }
            }
        },
        _inputClick: function() {
            this._hideSourcesMenu();
            this._hideNoResultsMenu()
        },
        _getSourceName: function(a) {
            var c = this.sources,
                b = c[a].name;
            !b && c[a].featureLayer && (b = c[a].featureLayer.name);
            b || (b = p.widgets.Search.main.untitledSource);
            return b
        },
        _insertSuggestions: function(a) {
            if (this.enableSuggestionsMenu && this.suggestionsNode) {
                this._hideSourcesMenu();
                this._hideNoResultsMenu();
                var c = "",
                    b = this.sources,
                    d = this.value;
                if (a)
                    for (var e in a)
                        if (a[e] && a[e].length) {
                            var f = this._getSourceName(e);
                            1 < b.length && this.activeSourceIndex === this._allIndex && (c += '\x3cdiv title\x3d"' + f + '" class\x3d"' + this.css.searchMenuHeader + '"\x3e' + f + "\x3c/div\x3e");
                            for (var c = c + "\x3cul\x3e", g = RegExp("(" + d + ")", "gi"), h = b[e].maxSuggestions || this.maxSuggestions, f = 0; f < a[e].length && f < h; ++f) var k = this._getSuggestionName(a[e][f]),
                                c = c + ('\x3cli title\x3d"' + k + '" data-index\x3d"' + f + '" data-source-index\x3d"' +
                                    e + '" role\x3d"menuitem" tabindex\x3d"0"\x3e' + k.replace(g, "\x3cstrong \x3e$1\x3c/strong\x3e") + "\x3c/li\x3e");
                            c += "\x3c/ul\x3e"
                        }(this.suggestionsNode.innerHTML = c) ? this._showSuggestionsMenu(): this._hideSuggestionsMenu()
            }
        },
        _insertSources: function(a) {
            var c = "";
            if (this.enableSourcesMenu && a && 1 < a.length) {
                var b, d, e = this.activeSourceIndex;
                b = "";
                e === this._allIndex && (b = "active");
                c = c + "\x3cul\x3e" + ('\x3cli title\x3d"' + p.widgets.Search.main.all + '" data-index\x3d"' + this._allIndex + '" role\x3d"menuitem" class\x3d"' + b +
                    '" tabindex\x3d"0" class\x3d""\x3e' + p.widgets.Search.main.all + "\x3c/li\x3e");
                for (d = 0; d < a.length; d++) {
                    b = "";
                    d === e && (b = this.css.activeSource);
                    var f = this._getSourceName(d),
                        c = c + ('\x3cli title\x3d"' + f + '" data-index\x3d"' + d + '" role\x3d"menuitem" tabindex\x3d"0" class\x3d"' + b + '"\x3e' + f + "\x3c/li\x3e")
                }
                c += "\x3c/ul\x3e";
                l.add(this.containerNode, this.css.hasMultipleSources)
            } else l.remove(this.containerNode, this.css.hasMultipleSources);
            this.sourcesNode.innerHTML = c
        },
        _showLoading: function() {
            l.add(this.containerNode,
                this.css.searchLoading)
        },
        _hideLoading: function() {
            l.remove(this.containerNode, this.css.searchLoading)
        },
        _checkStatus: function() {
            this.value ? (l.add(this.containerNode, this.css.hasValue), q.set(this.clearNode, "title", p.widgets.Search.main.clearButtonTitle)) : this.clear()
        },
        _closePopup: function() {
            this.enableInfoWindow && (this.map && this.map.infoWindow) && this.map.infoWindow.hide()
        },
        _noResultsHTML: function(a) {
            var c = "",
                b = k.trim(a),
                c = c + ('\x3cdiv class\x3d"' + this.css.searchNoResultsBody + '"\x3e');
            a && b ? (c += '\x3cdiv class\x3d"' +
                this.css.searchNoResultsHeader + '"\x3e', c += p.widgets.Search.main.noResults, c = c + "\x3c/div\x3e" + ('\x3cdiv class\x3d"' + this.css.searchNoResultsText + '"\x3e'), c += P.substitute(p.widgets.Search.main.noResultsFound, {
                    value: '"' + a + '"'
                })) : (c += "\x3cdiv\x3e", c += '\x3cspan class\x3d"' + this.css.searchNoValueIcon + '"\x3e\x3c/span\x3e', c += '\x3cspan class\x3d"' + this.css.searchNoValueText + '"\x3e' + p.widgets.Search.main.emptyValue + "\x3c/span\x3e");
            c += "\x3c/div\x3e";
            c += "\x3c/div\x3e";
            this.noResultsMenuNode.innerHTML = c
        },
        _hideMenus: function() {
            this._hideSourcesMenu();
            this._hideSuggestionsMenu();
            this._hideNoResultsMenu()
        },
        _hideNoResultsMenu: function() {
            l.remove(this.containerNode, this.css.showNoResults)
        },
        _showNoResultsMenu: function() {
            this._hideSourcesMenu();
            this._hideSuggestionsMenu();
            l.add(this.containerNode, this.css.showNoResults)
        },
        _hideSourcesMenu: function() {
            l.remove(this.containerNode, this.css.showSources)
        },
        _hideSuggestionsMenu: function() {
            l.remove(this.containerNode, this.css.showSuggestions)
        },
        _showSourcesMenu: function() {
            this._hideSuggestionsMenu();
            this._hideNoResultsMenu();
            l.add(this.containerNode, this.css.showSources)
        },
        _showSuggestionsMenu: function() {
            this._hideSourcesMenu();
            this._hideNoResultsMenu();
            l.add(this.containerNode, this.css.showSuggestions)
        },
        _toggleSourcesMenu: function() {
            this._hideSuggestionsMenu();
            this._hideNoResultsMenu();
            l.toggle(this.containerNode, this.css.showSources)
        },
        _getFirstStringField: function(a) {
            if (a && (a = a.fields) && a.length)
                for (var c = 0; c < a.length; c++) {
                    var b = a[c];
                    if ("esriFieldTypeString" === b.type) return b.name
                }
            return ""
        },
        _getDisplayField: function(a) {
            return a.displayField ||
                a.featureLayer.displayField || this._getFirstStringField(a.featureLayer)
        },
        _hydrateResult: function(a, c) {
            var b = {},
                d = this._defaultSR,
                e;
            e = this.sources[c];
            var f;
            e.featureLayer && (f = this._getDisplayField(e));
            this.map && (d = this.map.spatialReference);
            if (a.hasOwnProperty("text") && a.hasOwnProperty("magicKey")) return a;
            if (a.hasOwnProperty("feature")) b.feature = new t(a.feature), (e = b.feature.geometry) && e.setSpatialReference(d);
            else if (a.hasOwnProperty("geometry")) {
                var g = a.symbol || null;
                e = a.attributes || {};
                b.feature =
                    new t(a.geometry, g, e, a.infoTemplate || null);
                (e = b.feature.geometry) && e.setSpatialReference(d)
            } else a.hasOwnProperty("location") ? (g = new z(a.location.x, a.location.y, d), e = {}, a.hasOwnProperty("attributes") && (e = a.attributes), a.hasOwnProperty("score") && (e.score = a.score), b.feature = new t(g, null, e, null)) : b.feature = null;
            if (a.hasOwnProperty("extent")) b.extent = new F(a.extent), b.extent.setSpatialReference(new E(d));
            else if (b.feature && b.feature.geometry) switch (b.feature.geometry.type) {
                case "extent":
                    b.extent = b.feature.geometry;
                    break;
                case "multipoint":
                    b.extent = b.feature.geometry.getExtent();
                    break;
                case "polygon":
                    b.extent = b.feature.geometry.getExtent();
                    break;
                case "polyline":
                    b.extent = b.feature.geometry.getExtent();
                    break;
                case "point":
                    this.map ? this._getScale() > this.zoomScale ? b.extent = $.getExtentForScale(this.map, this.zoomScale).centerAt(b.feature.geometry) : b.extent = this.map.extent.centerAt(b.feature.geometry) : b.extent = new F({
                        xmin: b.feature.geometry.x - 0.25,
                        ymin: b.feature.geometry.y - 0.25,
                        xmax: b.feature.geometry.x + 0.25,
                        ymax: b.feature.geometry.y +
                            0.25,
                        spatialReference: this._defaultSR
                    })
            } else b.extent = null;
            a.hasOwnProperty("name") ? b.name = a.name : f && a.hasOwnProperty("attributes") && a.attributes.hasOwnProperty(f) ? b.name = a.attributes[f] : a.hasOwnProperty("Match_addr") && "string" === typeof a.Match_addr ? b.name = a.Match_addr : a.hasOwnProperty("address") && "object" === typeof a.address && a.address.hasOwnProperty("Match_addr") ? b.name = a.address.Match_addr : a.hasOwnProperty("address") && "string" === typeof a.address ? b.name = a.address : a.hasOwnProperty("address") && "object" ===
                typeof a.address && a.address.hasOwnProperty("Address") ? b.name = a.address.Address : b.name = b.feature && b.feature.geometry ? b.feature.geometry.x + "," + b.feature.geometry.y : "";
            return b
        },
        _getScale: function() {
            var a;
            this.map && "function" === typeof this.map.getScale ? a = this.map.getScale() : this.map && "function" === typeof this.map.get && (a = this.map.get("scale"));
            return a
        },
        _hydrateResults: function(a, c) {
            var b = [],
                d = 0;
            if (a && a.length)
                for (d; d < a.length; d++) {
                    var e = this._hydrateResult(a[d], c);
                    b.push(e)
                }
            return b
        },
        _containsNonLatinCharacter: function(a) {
            for (var c =
                    0; c < a.length; c++)
                if (255 < a.charCodeAt(c)) return !0;
            return !1
        },
        _setPlaceholder: function(a) {
            var c = "",
                b = this.sources[a];
            a === this._allIndex ? c = p.widgets.Search.main.placeholder : b && b.placeholder && (c = b.placeholder);
            var d = p.widgets.Search.main.all;
            b && (d = this._getSourceName(a));
            this.sourceNameNode.innerHTML = d;
            q.set(this.inputNode, "placeholder", c);
            q.set(this.inputNode, "title", c)
        },
        _updateActiveSource: function() {
            var a = this.sources,
                c = this.activeSourceIndex,
                b;
            a && a[c] && (b = a[c]);
            b ? this.set("activeSource", b) : this.set("activeSource",
                null)
        },
        _updateVisible: function() {
            this.visible ? this.show() : this.hide()
        },
        _updateButtonMode: function(a) {
            a ? (l.toggle(this.containerNode, this.css.searchExpanded, this.expanded), l.toggle(this.containerNode, this.css.searchCollapsed, !this.expanded), l.add(this.containerNode, this.css.hasButtonMode)) : (l.remove(this.containerNode, this.css.searchExpanded), l.remove(this.containerNode, this.css.searchCollapsed), l.remove(this.containerNode, this.css.hasButtonMode))
        },
        _setDefaultActiveSourceIndex: function() {
            var a = this.sources;
            a && 1 === a.length ? this.set("activeSourceIndex", 0) : this.set("activeSourceIndex", this._allIndex)
        },
        _setSourcesAttr: function(a) {
            this.sources = a;
            this._created && (this._setDefaultActiveSourceIndex(), this._hideMenus(), this._insertSources(a))
        },
        _setActiveSourceIndexAttr: function(a) {
            this.activeSourceIndex = a;
            this._updateActiveSource();
            this._created && (this._setPlaceholder(a), this._hideMenus(), this._insertSources(this.sources))
        },
        _setValueAttr: function(a) {
            this.value = a;
            this._created && (q.set(this.inputNode, "value", a),
                this._checkStatus())
        },
        _setVisibleAttr: function(a) {
            this.visible = a;
            this._created && this._updateVisible()
        },
        _setEnableButtonModeAttr: function(a) {
            this.enableButtonMode = a;
            this._created && this._updateButtonMode(a)
        },
        _setThemeAttr: function(a) {
            this._created && (l.remove(this.domNode, this.theme), l.add(this.domNode, a));
            this.theme = a
        }
    })
});