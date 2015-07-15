//>>built
define(["../../declare", "./BaseWidget", "./dom", "dojo/dom-class", "dojo/dom-construct", "dojo/dom-attr", "dojo/query", "dojo/string", "./lang", "dojo/i18n!../../nls/jsapi", "./utils", "./formatVariable"], function(q, u, r, m, n, h, v, w, t, l, x, p) {
    l = l.geoenrichment.dijit.OneVar;
    return q("esri.dijit.geoenrichment.OneVar", [u], {
        constructor: function() {
            this._state = {
                sortBy: 1,
                sortDesc: !0
            }
        },
        _calculate: function() {
            var d = this.getDataFields(),
                f = this.getFieldByIndex(d[0]);
            this.primary.innerHTML = this.formatByIndex(0, d[0]) + " ";
            return {
                firstCol: f
            }
        },
        updateUIExpanded: function() {
            this.inherited(arguments);
            var d = this._calculate().firstCol,
                f = null,
                a;
            if (d) {
                var g = [],
                    e = this.data.features.length;
                for (a = 0; a < e; a++) {
                    var c = [];
                    f || (f = c);
                    c.push(this.getFeatureTitle(a));
                    c.push(this.getValueByName(a, d.name));
                    g.push(c)
                }
                this.site.innerHTML = l.subtitleSite2;
                this._sortRows(g);
                a = this.getValueByName(0, d.name);
                if (c = t.isNumber(a)) {
                    var b = this.getValueByName(e - 1, d.name),
                        e = this.getFeatureTitle(e - 1);
                    a = 1 - b / a;
                    0.0050 > Math.abs(a) && (a = 0);
                    this.comp.innerHTML = w.substitute(0 > a ? l.lessThan :
                        0 < a ? l.moreThan : l.same, {
                            site: e
                        })
                } else this.comp.innerHTML = "";
                for (var e = this.table, k = g.length + 1; 1 < e.rows.length;) e.deleteRow(-1);
                b = e.rows[0];
                if (c)
                    for (; 4 > b.cells.length;) b.insertCell(-1);
                else
                    for (; 2 < b.cells.length;) n.destroy(b.cells[b.cells.length - 1]);
                for (a = 1; a < k; a++) b = e.insertRow(-1), 0 === a % 2 && 0 < a && (b.className = "AlternatingRow"), h.set(b.insertCell(-1), "class", "OneVarMultiComparison_TextColumn"), h.set(b.insertCell(-1), "class", "OneVarMultiComparison_ValueColumn"), c && (b = h.set(b.insertCell(-1), "class", "OneVarMultiComparison_ChartColumn"),
                    h.set(b, "colspan", "2"));
                k = Number.NEGATIVE_INFINITY;
                if (c) {
                    for (a = 0; a < g.length; a++) g[a][1] > k && (k = g[a][1]);
                    k = x.getCeiling(k);
                    e.rows[0].cells[2].innerHTML = p(d, 0);
                    e.rows[0].cells[3].innerHTML = p(d, k)
                }
                for (a = 0; a < g.length; a++)
                    if (b = e.rows[a + 1], b.cells[0].innerHTML = g[a][0], b.cells[1].innerHTML = p(d, g[a][1]), c) {
                        var s;
                        g[a] === f ? (m.remove(b, "OneVarMultiComparison_Row"), m.add(b, "OneVarMultiComparison_CurrentRow"), s = "OneVarMultiComparison_Expanded_CurrentBar") : (m.remove(b, "OneVarMultiComparison_CurrentRow"), m.add(b,
                            "OneVarMultiComparison_Row"), s = "OneVarMultiComparison_Expanded_Bar");
                        var q = r.pct(g[a][1] / k);
                        b.cells[2].innerHTML = "\x3cdiv class\x3d'" + s + "' style\x3d'width:" + q + "' /\x3e";
                        h.set(b.cells[0], "style", "width:50%");
                        h.set(b.cells[1], "style", "width:20%")
                    } else h.set(b.cells[0], "style", "width:50%"), h.set(b.cells[1], "style", "width:50%")
            }
        },
        updateUICollapsed: function() {
            this.inherited(arguments);
            var d = this._calculate().firstCol,
                f = null,
                a;
            if (d) {
                var g = [],
                    e = this.data.features.length;
                for (a = 0; a < e; a++) {
                    var c = [];
                    f || (f = c);
                    c.push(this.getFeatureTitle(a));
                    c.push(this.getValueByName(a, d.name));
                    g.push(c)
                }
                this._sortRows(g);
                var c = this.getValueByName(0, d.name),
                    e = this.table,
                    b = g.length + 1;
                for (a = e.rows.length; a < b; a++) {
                    var k = e.insertRow(-1);
                    0 === a % 2 && (k.className = "AlternatingRow");
                    h.set(k.insertCell(-1), "class", "OneVarMultiComparison_TextColumn");
                    h.set(k.insertCell(-1), "class", "OneVarMultiComparison_ValueColumn")
                }
                for (; e.rows.length > b;) e.deleteRow(-1);
                a = t.isNumber(c);
                c = v("col", this.table);
                a ? (h.set(c[0], "style", "width:70%"), h.set(c[1],
                    "style", "width:30%")) : (h.set(c[0], "style", "width:50%"), h.set(c[1], "style", "width:50%"));
                for (a = 0; a < g.length; a++) c = e.rows[a + 1], c.cells[0].innerHTML = g[a][0], c.cells[1].innerHTML = p(d, g[a][1]), g[a] === f ? (m.remove(c, "OneVarMultiComparison_Row"), m.add(c, "OneVarMultiComparison_CurrentRow")) : (m.remove(c, "OneVarMultiComparison_CurrentRow"), m.add(c, "OneVarMultiComparison_Row"))
            }
        },
        createUIExpanded: function(d) {
            this.inherited(arguments);
            var f = d.addHeader("div", {
                    "class": "OneVarMultiComparison_Value"
                }),
                f = n.create("table", {
                    cellpadding: "0",
                    cellspacing: "0"
                }, f),
                a = f.insertRow(0),
                a = a.insertCell(-1);
            this.site = n.create("span", {
                "class": "OneVarMultiComparison_Expanded_Value_Site"
            }, a);
            a = f.insertRow(-1);
            a = a.insertCell(-1);
            this.primary = n.create("span", {
                "class": "OneVarMultiComparison_Expanded_Value_Primary"
            }, a);
            this.comp = n.create("span", {
                "class": "OneVarMultiComparison_Comparison"
            }, a);
            this.table = d.addContent("table", {
                "class": "OneVarMultiComparison_Table"
            });
            r.createCols(this.table, [0.5, 0.2, 0.15, 0.15]);
            a = this.table.insertRow(-1);
            this._appendSortHeader(a, l.areaCol, 0, {
                "class": "OneVarMultiComparison_TextColumnHeader"
            });
            this._appendSortHeader(a, l.valueCol, 1, {
                "class": "OneVarMultiComparison_ValueColumnHeader"
            });
            h.set(a.insertCell(-1), "class", "OneVarMultiComparison_ChartColumnHeader_Lower");
            h.set(a.insertCell(-1), "class", "OneVarMultiComparison_ChartColumnHeader_Upper");
            this.autoHeight && d.contentClass.push("OneVarMultiComparison_Expanded_ContentPane");
            d.addFooter("div")
        },
        createUICollapsed: function(d) {
            this.inherited(arguments);
            var f =
                d.addHeader("div", {
                    "class": "OneVarMultiComparison_Value"
                }),
                f = n.create("table", {
                    cellpadding: "0",
                    cellspacing: "0"
                }, f),
                a = f.insertRow(0),
                a = a.insertCell(-1);
            this.site = n.create("span", {
                "class": "OneVarMultiComparison_Expanded_Value_Site"
            }, a);
            a = f.insertRow(-1);
            a = a.insertCell(-1);
            this.primary = n.create("span", {
                "class": "OneVarMultiComparison_Expanded_Value_Primary"
            }, a);
            this.table = d.addContent("table", {
                "class": "OneVarMultiComparison_Table"
            });
            r.createCols(this.table, [0.7, 0.3]);
            a = this.table.insertRow(-1);
            this._appendSortHeader(a,
                l.areaCol, 0, {
                    "class": "OneVarMultiComparison_TextColumnHeader"
                });
            this._appendSortHeader(a, l.valueCol, 1, {
                "class": "OneVarMultiComparison_ValueColumnHeader"
            });
            h.set(a.insertCell(-1), "class", "OneVarMultiComparison_ChartColumnHeader_Lower");
            h.set(a.insertCell(-1), "class", "OneVarMultiComparison_ChartColumnHeader_Upper");
            this.autoHeight && d.contentClass.push("OneVarMultiComparison_Expanded_ContentPane");
            d.addFooter("div")
        }
    })
});