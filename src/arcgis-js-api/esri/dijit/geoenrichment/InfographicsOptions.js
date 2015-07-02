//>>built
define(["../../declare", "dojo/_base/lang", "dojo/Deferred", "dojo/string", "../../tasks/geoenrichment/studyAreaOptionsFromJson", "../../tasks/geoenrichment/GeoenrichmentTask", "./lang", "./config", "./InfographicsOptionsItem"], function(g, w, x, B, y, z, m, p, t) {
    function A(a, d) {
        var c = parseFloat(a.index),
            b = parseFloat(d.index);
        return isNaN(c) && isNaN(b) ? 0 : isNaN(c) ? 1 : isNaN(b) ? -1 : c - b
    }

    function u(a, d) {
        for (var c = 0; c < a.length; c++) {
            var b = a[c];
            if (b.type == d.type && m.arraysEqual(b.variables, d.variables)) return {
                report: b,
                index: c
            }
        }
        return null
    }

    function q(a, d) {
        if (a)
            for (var c in a)
                if (a.hasOwnProperty(c)) {
                    d[c] = [];
                    for (var b = 0; b < a[c].length; b++) {
                        var h = {};
                        v(a[c][b], h);
                        d[c].push(h)
                    }
                }
    }

    function v(a, d) {
        d.type = a.type || ("OneVarMultiComparison" == a.report ? "OneVar" : a.report);
        if (a.dataCollection)
            if (a.vars) {
                d.variables = [];
                for (var c = 0; c < a.vars.length; c++) d.variables.push(a.dataCollection + "." + a.vars[c])
            } else d.variables = [a.dataCollection + ".*"];
        else d.variables = a.variables;
        m.isBoolean(a.isVisible) ? d.isVisible = a.isVisible : m.isBoolean(a.checked) && (d.isVisible =
            a.checked)
    }
    g = g("esri.dijit.geoenrichment.InfographicsOptions", null, {
        _items: null,
        _loaded: null,
        studyAreaOptions: null,
        theme: "common",
        constructor: function(a) {
            this._loaded = {};
            this.studyAreaOptions = y(a && (a.buffer || a.studyAreaOptions));
            this._items = {};
            a && (q(a.reports || a.items, this._items), a.theme && (this.theme = a.theme))
        },
        toJson: function() {
            var a = {};
            q(this._items, a);
            return {
                studyAreaOptions: this.studyAreaOptions.toJson(),
                items: a,
                theme: this.theme
            }
        },
        getItems: function(a) {
            var d = new x;
            if (this._loaded[a]) d.resolve(this._items[a]);
            else {
                var c = new z(p.server);
                c.token = p.token;
                c.getDataCollections(a, null, ["id", "alias"]).then(w.hitch(this, this._mergeItems, a, d), function(a) {
                    d.reject(a)
                })
            }
            return d.promise
        },
        _mergeItems: function(a, d, c) {
            try {
                var b, h, l = [];
                for (b = 0; b < c.length; b++) {
                    var k = c[b].metadata.infographics;
                    if (k) {
                        var f = JSON.parse(k),
                            n;
                        for (n in f)
                            if (f.hasOwnProperty(n)) {
                                var g = new t(n, [c[b].id + ".*"]),
                                    r;
                                for (r in f[n]) f[n].hasOwnProperty(r) && (g[r] = f[n][r]);
                                (h = u(l, g)) ? l[h.index] = g: l.push(g)
                            }
                    }
                }
                var s, e = this._items[a];
                e || (e = [], e.push(new t("OneVar", ["KeyGlobalFacts.AVGHHSZ"])), this._items[a] = e);
                for (b = e.length - 1; 0 <= b; b--)
                    if (h = u(l, e[b])) v(e[b], h.report), e[b] = h.report, l.splice(h.index, 1);
                    else {
                        if ("OneVar" == e[b].type && 1 == e[b].variables.length) {
                            var m, p = e[b].variables[0];
                            if (!s) {
                                s = {};
                                for (k = 0; k < c.length; k++)
                                    for (f = 0; f < c[k].variables.length; f++) s[c[k].id + "." + c[k].variables[f].id] = c[k].variables[f]
                            }
                            if (m = s[p]) {
                                e[b].title = m.alias;
                                continue
                            }
                        }
                        e.splice(b, 1);
                        b--
                    }
                for (b = 0; b < l.length; b++) e.push(l[b]);
                e.sort(A);
                this._loaded[a] = !0;
                d.resolve(e)
            } catch (q) {
                d.reject(q)
            }
        }
    });
    g.Item = t;
    return g
});