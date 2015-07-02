//>>built
define(["../../declare", "./BaseWidget", "dojo/_base/lang", "dojo/on", "require", "dojo/dom-construct", "dojo/dom-attr", "dojo/dom-class", "dojo/query", "dojo/i18n!../../nls/jsapi", "./dom"], function(p, u, q, r, v, g, e, l, m, f, n) {
    f = f.geoenrichment.dijit.Tapestry;
    p = p("esri.dijit.geoenrichment.Tapestry", [u], {
        currentTop: 0,
        updateUIExpanded: function() {
            this.inherited(arguments);
            0 === this.currentTop ? this.updateListUIExpanded() : this.updateViewUIExpanded()
        },
        updateUICollapsed: function() {
            this.inherited(arguments);
            0 === this.currentTop ? this.updateListUICollapsed() :
                this.updateViewUICollapsed()
        },
        createUI: function(a) {
            a.contentClass.push("Tapestry");
            this.inherited(arguments)
        },
        createUIExpanded: function(a) {
            this.inherited(arguments);
            0 === this.currentTop ? this.createListUIExpanded(a) : this.createViewUIExpanded(a)
        },
        createUICollapsed: function(a) {
            this.inherited(arguments);
            0 === this.currentTop ? this.createListUICollapsed(a) : this.createViewUICollapsed(a)
        },
        updateListUIExpanded: function() {
            for (var a = 1; 4 > a; a++) {
                var b = 5 * (a - 1);
                if (this.noValue(a)) {
                    s(this.table, a, b, 5);
                    l.remove("arr" +
                        a, "Tapestry_RightArrowCell");
                    break
                }
                l.add("arr" + a, "Tapestry_RightArrowCell");
                var c = this.table.rows[b++];
                c.cells[0].innerHTML = this.formatByName(0, d.get(d.Percentage, a));
                c.cells[1].innerHTML = this.getValueByName(0, d.get(d.Name, a));
                c = this.table.rows[b++];
                c.cells[0].innerHTML = "(" + this.formatByName(0, d.get(d.Value, a)) + " " + f.hhLabel + ")";
                c = this.table.rows[b++];
                c.cells[1].innerHTML = f.hhTypeLabel;
                c.cells[2].innerHTML = this.getValueByName(0, d.get(d.Type, a));
                c = this.table.rows[b++];
                c.cells[1].innerHTML = f.medianAgeLabel;
                c.cells[2].innerHTML = this.getValueByName(0, d.get(d.Age, a));
                c = this.table.rows[b++];
                c.cells[1].innerHTML = f.incomeLabel;
                c.cells[2].innerHTML = this.getValueByName(0, d.get(d.Income, a))
            }
        },
        updateListUICollapsed: function() {
            for (var a = 1; 4 > a; a++) {
                var b = 2 * (a - 1);
                if (this.noValue(a)) {
                    s(this.table, a, b, 2, !0);
                    l.remove("arr" + a, "Tapestry_RightArrowCell");
                    break
                }
                l.add("arr" + a, "Tapestry_RightArrowCell");
                var c = this.table.rows[b++];
                c.cells[0].children[0].innerHTML = this.formatByName(0, d.get(d.Percentage, a));
                c.cells[1].innerHTML =
                    this.getValueByName(0, d.get(d.Name, a));
                c = this.table.rows[b++];
                c.cells[0].innerHTML = "(" + this.formatByName(0, d.get(d.Value, a)) + " " + f.hhLabel + ")"
            }
        },
        updateViewUIExpanded: function() {
            if (this.noValue(this.currentTop)) m('td:not([".Tapestry_LeftArrowCell"])', this.table).forEach(function(a) {
                g.empty(a)
            });
            else {
                var a = this.table.rows[0];
                a.cells[1].innerHTML = this.getValueByName(0, d.get(d.Name, this.currentTop));
                var a = this.table.rows[1],
                    b = this.formatByName(0, d.get(d.Code, this.currentTop));
                1 == b.length && (b = "0" + b);
                k.bindTopIcon(a.cells[1],
                    b);
                for (b = 0; 6 > b; b++) a = this.table.rows[b + 2], a.cells[1].innerHTML = k.labels[b], a.cells[2].innerHTML = this.getValueByName(0, d.get(k.values[b], this.currentTop))
            }
        },
        updateViewUICollapsed: function() {
            if (this.noValue(this.currentTop)) m("td", this.table).forEach(function(a) {
                "LeftArrow" != a.className && g.empty(a)
            });
            else {
                this.table.rows[0].cells[0].children[0].rows[0].cells[1].innerHTML = this.getValueByName(0, d.get(d.Name, this.currentTop));
                for (var a = 0; 6 > a; a++) {
                    var b = this.table.rows[a + 1];
                    b.cells[0].innerHTML = k.labels[a];
                    b.cells[1].innerHTML = this.getValueByName(0, d.get(k.values[a], this.currentTop))
                }
            }
        },
        createListUIExpanded: function(a) {
            this.table && this.table.innerHTML && g.destroy(this.table);
            this.table = a.addContent("table", {
                "class": "Tapestry_Table",
                cellpadding: "0",
                cellspacing: "0"
            });
            n.createCols(this.table, [null, null, 1, null]);
            for (a = 1; 4 > a; a++) {
                var b = this.table.insertRow(-1),
                    c = b.insertCell(-1);
                e.set(c, "class", "Tapestry_PrcCell Tapestry_Top" + h[a]);
                e.set(c, "rowspan", "2");
                c = b.insertCell(-1);
                e.set(c, "class", "Tapestry_HeaderCell Tapestry_Top" +
                    h[a] + " Tapestry_LeftCell topName");
                e.set(c, "colspan", "3");
                b = this.table.insertRow(-1);
                c = b.insertCell(-1);
                e.set(c, "class", "Tapestry_ValueCell Tapestry_Top" + h[a] + " Tapestry_LeftCell");
                e.set(c, "colspan", "3");
                this.addTextRows(a)
            }
        },
        addTextRows: function(a) {
            for (var b = 0; 3 > b; b++) {
                var c = this.table.insertRow(-1);
                c.insertCell(-1);
                e.set(c.insertCell(-1), "class", "Tapestry_AttrCell");
                e.set(c.insertCell(-1), "class", "Tapestry_TextCell");
                0 === b && (c = c.insertCell(-1), e.set(c, "rowspan", "3"), t(c, a, this))
            }
        },
        updateMode: function(a) {
            this.currentTop =
                a;
            this.destroy(!0);
            this.update()
        },
        createListUICollapsed: function(a) {
            this.table && this.table.innerHTML && g.destroy(this.table);
            this.table = a.addContent("table", {
                "class": "Tapestry_Table",
                cellpadding: "0",
                cellspacing: "0"
            });
            n.createCols(this.table, [null, 1, null]);
            for (a = 1; 4 > a; a++) {
                var b = this.table.insertRow(-1),
                    c = b.insertCell(-1);
                e.set(c, "class", "Tapestry_ListCell Tapestry_Top" + h[a] + " Tapestry_PrcCell");
                e.set(c, "rowspan", "2");
                g.create("div", null, c);
                e.set(b.insertCell(-1), "class", "Tapestry_HeaderCell Tapestry_ListCell Tapestry_Top" +
                    h[a] + " Tapestry_LeftCell");
                c = b.insertCell(-1);
                e.set(c, "rowspan", "2");
                e.set(c, "class", "Tapestry_ListCell");
                t(c, a, this);
                e.set(this.table.insertRow(-1).insertCell(-1), "class", "Tapestry_HeaderCell Tapestry_Top" + h[a] + " Tapestry_LeftCell")
            }
        },
        createViewUIExpanded: function(a) {
            this.table && this.table.innerHTML && g.destroy(this.table);
            this.table = a.addContent("table", {
                "class": "Tapestry_Table",
                cellpadding: "1",
                cellspacing: "0"
            });
            n.createCols(this.table, [null, null, 1]);
            a = this.table.insertRow(0);
            var b = a.insertCell(-1);
            e.set(b, "class", "Tapestry_LeftArrowCell");
            r(b, "click", q.hitch(this, this.updateMode, 0));
            a = a.insertCell(-1);
            e.set(a, "class", "Tapestry_HeaderCell Tapestry_Top" + h[this.currentTop] + "");
            e.set(a, "colspan", "2");
            a = this.table.insertRow(-1);
            a.insertCell(-1);
            b = a.insertCell(-1);
            e.set(b, "colspan", "2");
            for (b = 0; 6 > b; b++) a = this.table.insertRow(-1), e.set(a.insertCell(-1), "class", 0 === b ? "Tapestry_AttrCell Tapestry_TopCell" : "Tapestry_AttrCell"), e.set(a.insertCell(-1), "class", 0 === b ? "Tapestry_AttrCell Tapestry_TopCell" :
                "Tapestry_AttrCell"), e.set(a.insertCell(-1), "class", 0 === b ? "Tapestry_TextCell Tapestry_TopCell" : "Tapestry_TextCell")
        },
        createViewUICollapsed: function(a) {
            this.table && this.table.innerHTML && g.destroy(this.table);
            this.table = a.addContent("table", {
                "class": "Tapestry_Table",
                cellpadding: "1",
                cellspacing: "0"
            });
            n.createCols(this.table, [null, 1]);
            a = this.table.insertRow(0);
            a = a.insertCell(-1);
            e.set(a, "colspan", "2");
            e.set(a, "class", "LeftArrow");
            a = g.create("table", null, a).insertRow(0);
            e.set(a.insertCell(-1), "class",
                "Tapestry_LeftArrowCell");
            r(this.table.rows[0].cells[0].children[0].rows[0].cells[0], "click", q.hitch(this, this.updateMode, 0));
            e.set(a.insertCell(-1), "class", "Tapestry_HeaderCell Tapestry_Top" + h[this.currentTop]);
            for (var b = 0; 6 > b; b++) a = this.table.insertRow(-1), e.set(a.insertCell(-1), "class", 0 === b ? "Tapestry_AttrCell Tapestry_TopCell" : "Tapestry_AttrCell Tapestry_ViewCell"), e.set(a.insertCell(-1), "class", 0 === b ? "Tapestry_TextCell Tapestry_TopCell" : "Tapestry_TextCell Tapestry_ViewCell")
        },
        noValue: function(a) {
            a =
                Number(this.getValueByName(0, d.get(d.Value, a)));
            return !a || 0 >= a
        }
    });
    var d = {
            Code: "CODE",
            Name: "NAME",
            Value: "VALUE",
            Percentage: "PRC",
            Type: "TYPE",
            Age: "AGE",
            Income: "INCOME",
            Employment: "EMP",
            Education: "EDU",
            Residental: "RSD",
            Race: "RACE",
            get: function(a, b) {
                return "TOP" + b + a
            }
        },
        t = function(a, b, c) {
            g.create("div", {
                "class": "Tapestry_RightArrowCell",
                id: "arr" + b
            }, a);
            r(a, "click", q.hitch(c, c.updateMode, b))
        },
        h = {
            1: "One",
            2: "Two",
            3: "Three"
        },
        s = function(a, b, c, d, e) {
            for (var f = c; f < c + d; f++) m("td", a.rows[f]).forEach(function(a) {
                0 ===
                    m("#arr" + b, a).length && g.empty(a);
                e && -1 < a.className.indexOf("Tapestry_PrcCell") && g.create("div", null, a)
            })
        },
        k = {
            labels: [f.hhTypeLabel, f.medianAgeLabel, f.incomeLabel, f.employmentLabel, f.educationLabel, f.residentialLabel],
            values: [d.Type, d.Age, d.Income, d.Employment, d.Education, d.Residental],
            bindTopIcon: function(a, b) {
                g.empty(a);
                var c = v.toUrl("./images/tapestry" + b + ".png");
                g.create("div", {
                    "class": "Tapestry_ViewImage",
                    style: "background-image:url('" + c + "')"
                }, a)
            }
        };
    return p
});