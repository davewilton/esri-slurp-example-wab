//>>built
define(["../../declare", "dojo/_base/lang", "dojo/string", "./_Wizard", "./InfographicsOptions", "./InfographicsMainPage", "./DataBrowser", "./lang", "dojo/i18n!../../nls/jsapi"], function(r, a, w, s, n, t, u, v, x) {
    return r("esri.dijit.geoenrichment.InfographicsConfig", [s], {
        options: null,
        constructor: function() {
            this.pages.m = new t({
                onAddVariables: a.hitch(this, this._addVariables),
                onOK: a.hitch(this, this._onOK),
                onCancel: a.hitch(this, this._onCancel)
            })
        },
        startup: function() {
            this.inherited(arguments);
            this.options || this.set("options",
                new n);
            this.loadPage("m")
        },
        _setOptionsAttr: function(d) {
            this._set("options", d);
            this.pages.m.set("options", d)
        },
        _getCountryIDAttr: function() {
            return this.pages.m.get("countryID")
        },
        _setCountryIDAttr: function(d) {
            this.pages.m.set("countryID", d)
        },
        _addVariables: function() {
            var d = this,
                e = this.get("countryID"),
                b = this.pages.db;
            b ? b.set("countryID", e) : (b = new u({
                    countryID: e,
                    countryBox: !1,
                    multiSelect: !0,
                    title: this.pages.m.nls.mainTitle
                }), b.on("back", a.hitch(this, this.loadPage, "m")), b.on("cancel", a.hitch(this, this._onCancel)),
                b.on("ok", a.hitch(this, this._applyVariables)), this.pages.db = b);
            var g = [];
            this.options.getItems(e).then(function(e) {
                for (var h = 0; h < e.length; h++) {
                    var a = e[h];
                    !("OneVar" != a.type || 1 != a.variables.length) && g.push(a.variables[0])
                }
                b.set("selection", g);
                d.loadPage("db")
            })
        },
        _applyVariables: function() {
            function a(b) {
                if (!k)
                    for (var c = 0; c < g.length; c++) k[g[c].id] = g[c];
                return k[b]
            }
            for (var e = this, b = this.pages.m.get("countryID"), g = this.pages.db.dataCollections[b], k = null, h = {}, p = this.pages.db.get("selection"), l = 0; l < p.length; l++) {
                var f =
                    p[l];
                if (v.endsWith(f, ".*"))
                    for (var f = f.split(".")[0], q = a(k).variables, m = 0; m < q.length; m++) h[f + "." + q[m].id] = !0;
                else h[f] = !0
            }
            this.options.getItems(b).then(function(b) {
                var c, a;
                for (c = b.length - 1; 0 <= c; c--)
                    if (a = b[c], !("OneVar" != a.type || 1 != a.variables.length)) {
                        var d = a.variables[0];
                        h[d] ? h[d] = !1 : b.splice(c, 1)
                    }
                for (c = 0; c < g.length; c++)
                    for (var d = g[c].variables, f = 0; f < d.length; f++) a = g[c].id + "." + d[f].id, h[a] && (a = new n.Item("OneVar", [a]), a.title = d[f].alias, b.push(a));
                e.loadPage("m");
                e.pages.m.set("options", e.options)
            })
        },
        _onOK: function() {
            this.emit("ok")
        },
        _onCancel: function() {
            this.emit("cancel")
        }
    })
});