//>>built
define(["../../../declare", "dojo/string", "dojo/_base/lang", "dojo/aspect", "dojo/dom-class", "dojo/dom-construct", "dojo/dom-geometry", "dojo/query", "dojo/i18n!../../../nls/jsapi", "dojo/text!./templates/DataCollectionsPage.html", "dojo/on", "../CheckList", "../_WizardPage", "../Pagination", "dojo/store/Memory", "dgrid/List", "dgrid/Selection", "dijit/_WidgetBase", "../AnimationHelper", "dijit/Tooltip", "dojo/_base/window", "dojo/has", "dijit/layout/ContentPane", "dijit/form/Select", "./SearchTextBox"], function(p, l, e, q, r, g, m, s, h, t, k, u, v, y, w, z, A, B, C, n, x, D) {
    h =
        h.geoenrichment.dijit.DataCollectionsPage;
    return p([v], {
        templateString: t,
        nls: h,
        baseClass: "DataCollectionsPage",
        _checkList: null,
        selectedCategory: null,
        selectedCollection: null,
        selectedVariables: [],
        shoppingCart: null,
        variableInfo: null,
        multiSelect: !0,
        flyAnim: null,
        icon: null,
        constructor: function() {
            this._ltr = m.isBodyLtr()
        },
        buildRendering: function() {
            this.inherited(arguments);
            this._checkList = new u({
                onSelect: e.hitch(this, this._onSelectVariable),
                onDeselect: e.hitch(this, this._onDeselectVariable),
                selectionMode: this.multiSelect ?
                    "toggle" : "single"
            }, this.divVariables);
            this._checkList.renderRow = e.hitch(this, this._renderRow);
            this.pagination.createItemContainer = this._createItemContainer;
            this.pagination.updateItemContainer = this._updateItemContainer;
            q.after(this.layoutGrid, "resize", e.hitch(this.pagination, this.pagination.resize))
        },
        _createItemContainer: function() {
            return g.create("div", {
                "class": "DataCollectionButton DataBrowser_Clickable TrimWithEllipses"
            })
        },
        _updateItemContainer: function(a, b) {
            a.innerHTML = b.metadata.title;
            a.data = b
        },
        _renderRow: function(a, b) {
            var c = g.create("div", {
                    style: "width:100%"
                }),
                f = g.create("div", {
                    "class": "TrimWithEllipses"
                });
            "single" != this.selectionMode && g.create("div", {
                "class": "dijit dijitInline dijitCheckBox VarCheck"
            }, f);
            var d = g.create("div", {
                "class": "DataBrowserInfoIcon"
            }, f);
            g.create("span", {
                "class": "VarLabel",
                innerHTML: a.description ? a.description : a.alias
            }, f);
            g.place(f, c);
            k(d, "click", e.hitch(this, this._toggleTooltip, d, a));
            k(d, "mouseenter", e.hitch(this, this._showTooltip, d, a));
            k(d, "mouseleave", e.hitch(this,
                this._hideTooltip, d, a));
            k(d, "mousedown,touchstart,MSPointerDown,dgrid-cellfocusin", function(a) {
                a.stopPropagation && a.stopPropagation()
            });
            return c
        },
        _toggleTooltip: function(a, b, c) {
            c.stopPropagation && c.stopPropagation();
            this._icon ? this._hideTooltip() : this._showTooltip(a, b, c)
        },
        _showTooltip: function(a, b, c) {
            this._icon = a;
            this.variableInfo.set("variable", b);
            n.show(this.variableInfo.domNode.outerHTML, a, ["above", "below"]);
            c.stopPropagation && c.stopPropagation();
            k.once(x.doc, "click", e.hitch(this, this._hideTooltip))
        },
        _hideTooltip: function() {
            n.hide(this._icon);
            this._icon = null
        },
        _setSelectedCategoryAttr: function(a) {
            this._set("selectedCategory", a);
            if (a) {
                var b = {
                    categoryName: a.name
                };
                this.categoryName.innerHTML = l.substitute(h.categoryName, b);
                this._checkList.set("store", new w({
                    data: this.theMostPopularVars(a, 3)
                }));
                this.pagination.set("items", a.dataCollections);
                this.spnShowAll.innerHTML = l.substitute(h.showAll, b);
                this._started && this.resize();
                this._setState("done")
            }
        },
        theMostPopularVars: function(a, b) {
            var c = [];
            if (a) {
                for (var f = {}, d = 0; d < a.dataCollections.length; d++)
                    for (var e = 0; e < a.dataCollections[d].variables.length; e++) {
                        var g = a.dataCollections[d].variables[e];
                        f[g.idDesc] = g
                    }
                for (var h in f) f.hasOwnProperty(h) && c.push(f[h]);
                c = c.sort(function(a, b) {
                    return (b.popularity ? b.popularity : 0) - (a.popularity ? a.popularity : 0)
                }).slice(0, b)
            }
            return c
        },
        _onSelectVariable: function(a) {
            var b = this._checkList.get("selectedItems");
            this.flyAnim && a.parentType && (a = this._checkList.row(a.rows[0]).element, this.flyAnim.fly(s(".VarLabel", a)[0], "DataBrowser_SelectVar", ["top", this._ltr ? "right" : "left"]));
            this._set("selectedVariables", b);
            for (a = 0; a < b.length; a++) this.shoppingCart.addVariable(b[a])
        },
        _onDeselectVariable: function(a) {
            this.shoppingCart.removeVariable(a.rows[0].data.idDesc)
        },
        _onSelectCollection: function(a) {
            var b = a.data;
            if (this.flyAnim) {
                if (!this._ltr) {
                    var c = m.position(a);
                    a.style.right = "" + (window.innerWidth - c.x - c.w) + "px"
                }
                c = this.flyAnim.fly(a, "Breadcrumb_SelectDC", null, !0);
                r.remove(c, ["dgrid-row", "dgrid-selected", "TrimWithEllipses"]);
                this._ltr || (a.style.right =
                    "auto")
            }
            this._set("selectedCollections", [b]);
            this.onSelect(this._get("selectedCategory"), b.metadata.title)
        },
        _showAll: function() {
            this._set("selectedCollections", this._get("selectedCategory").dataCollections);
            this.onSelect(this._get("selectedCategory"), this._get("selectedCategory").name)
        },
        _gotoCategories: function() {
            this.gotoCategories()
        },
        gotoCategories: function() {},
        syncWithShoppingCart: function() {
            for (var a = this._checkList.store.data, b = this.shoppingCart.content, c = 0; c < a.length; c++) this._checkList.select(a[c],
                null, !!b[a[c].idDesc])
        },
        onRemoveElementFromShoppingCart: function(a) {
            for (var b = this._checkList.store.data, c = 0; c < b.length; c++)
                if (a === b[c].idDesc) {
                    this._checkList.select(b[c], null, !1);
                    break
                }
        },
        _search: function() {
            if (this.txbSearch.get("value")) {
                for (var a = this.txbSearch.get("value"), b = this._get("selectedCategory").dataCollections, c = [], f, d = 0; d < b.length; d++) {
                    f = {
                        id: b[d].id,
                        metadata: b[d].metadata,
                        keywords: b[d].keywords,
                        variables: []
                    };
                    for (var e = 0; e < b[d].variables.length; e++) this._match(b[d].variables[e], a) &&
                        f.variables.push(b[d].variables[e]);
                    0 < f.variables.length && c.push(f)
                }
                0 < c.length ? (this._set("selectedCollections", c), this.onSelect(this._get("selectedCategory"), "'" + a + "' " + l.substitute(h.from, {
                    categoryName: this._get("selectedCategory").name
                }))) : this.txbSearch.showTooltip(l.substitute(h.noResults, {
                    seachKey: a
                }))
            }
        },
        _match: function(a, b) {
            return a.alias && -1 !== a.alias.toLowerCase().indexOf(b.toLowerCase()) || a.description && -1 !== a.description.toLowerCase().indexOf(b.toLowerCase()) || a.fieldCategory && -1 !== a.fieldCategory.toLowerCase().indexOf(b.toLowerCase())
        }
    })
});