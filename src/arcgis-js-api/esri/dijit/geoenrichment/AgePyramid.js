//>>built
define(["../../declare", "require", "dojo/_base/lang", "./BaseSelectComparison", "dojo/dom-construct", "dojo/number", "dojo/dom-class", "./utils", "./theme", "dojox/charting/Chart", "dojox/charting/axis2d/Default", "dojox/charting/plot2d/Bars", "dojox/charting/plot2d/Lines", "dojox/charting/action2d/Tooltip", "dojox/charting/action2d/Highlight", "dojox/charting/SimpleTheme", "dojo/i18n!../../nls/jsapi"], function(u, C, k, v, f, m, n, w, p, x, y, z, A, q, r, B, c) {
    c = c.geoenrichment.dijit.AgePyramid;
    return u("esri.dijit.geoenrichment.AgePyramid", [v], {
        chart: null,
        _currentTheme: null,
        _themeChangeHandle: null,
        updateUI: function() {
            this.inherited(arguments);
            this._themeChangeHandle || (this._themeChangeHandle = p.on("change", k.hitch(this, this._onThemeChange)));
            this._currentTheme ? this._doUpdateUI() : p.load("AgePyramid").then(k.hitch(this, this._onThemeLoad))
        },
        _onThemeChange: function() {
            this._currentTheme = null;
            this._destroyChart();
            this.updateUI()
        },
        _onThemeLoad: function(a) {
            this._currentTheme = a;
            this._currentTheme.theme = new B(a.theme);
            this._doUpdateUI()
        },
        _doUpdateUI: function() {
            this.ensureChart();
            var a = this.getDataFields();
            this.maleIndices = [];
            this.femaleIndices = [];
            for (var b = a.length / 2, d = Number.NEGATIVE_INFINITY, g = Number.POSITIVE_INFINITY, s, t, e = !0, h = !0, l = 0; l < a.length; l++) {
                var f = l < b;
                f ? this.maleIndices.push(a[l]) : this.femaleIndices.push(a[l]);
                var c = this.getValueByIndex(0, a[l]);
                c > d ? (d = c, s = this.getFieldByIndex(a[l]).alias, e = f) : c < g && (g = c, t = this.getFieldByIndex(a[l]).alias, h = f)
            }
            a = this.setSeriesData(this.chart.getSeries("male_bars"), 0, this.maleIndices, -1);
            b = this.setSeriesData(this.chart.getSeries("female_bars"),
                0, this.femaleIndices, 1);
            this.expanded ? (g = this._getComparisonRow(), d = this.setSeriesData(this.chart.getSeries("male_lines"), g, this.maleIndices, -1), g = this.setSeriesData(this.chart.getSeries("female_lines"), g, this.femaleIndices, 1)) : (this.chart.getSeries("male_lines").update([]), this.chart.getSeries("female_lines").update([]), g = d = Number.NEGATIVE_INFINITY);
            this.extreme = w.getCeiling(Math.max(a, b, d, g), !0);
            this.chart.removeAxis("y");
            this.chart.addAxis("y", {
                type: y,
                min: -this.extreme,
                max: this.extreme,
                minorTicks: !1,
                labelFunc: k.hitch(this, this.getAxisLabel)
            });
            this.chart.render();
            this.expanded && (e ? n.replace(this.max, "AgePyramid_TextMale", "AgePyramid_TextFemale") : n.replace(this.max, "AgePyramid_TextFemale", "AgePyramid_TextMale"), h ? n.replace(this.min, "AgePyramid_TextMale", "AgePyramid_TextFemale") : n.replace(this.min, "AgePyramid_TextFemale", "AgePyramid_TextMale"), this.max.innerHTML = s, this.min.innerHTML = t)
        },
        getAxisLabel: function(a, b, d) {
            b = Math.abs(b);
            return b != this.extreme ? m.format(b, {
                places: 0
            }) : m.format(b / 100, {
                places: 0,
                type: "percent"
            })
        },
        resize: function() {
            this.inherited(arguments);
            this.chart && this.chart.resize()
        },
        ensureChart: function() {
            if (!this.chart) {
                var a = this._currentTheme,
                    b = this.chart = new x(this.chartDiv);
                b.setTheme(a.theme);
                b.addPlot("lines", {
                    type: A,
                    markers: !0
                });
                b.addPlot("bars", {
                    type: z,
                    gap: this.expanded ? 1.5 : 1
                });
                b.addSeries("male_bars", [], k.mixin({
                    plot: "bars"
                }, a.male));
                b.addSeries("female_bars", [], k.mixin({
                    plot: "bars"
                }, a.female));
                b.addSeries("male_lines", [], k.mixin({
                    plot: "lines"
                }, a.line));
                b.addSeries("female_lines", [], k.mixin({
                    plot: "lines"
                }, a.line));
                var d = {
                    text: k.hitch(this, this.getTooltip)
                };
                new q(b, "bars", d);
                new q(b, "lines", d);
                new r(b, "bars", {
                    duration: 1
                });
                new r(b, "lines", {
                    duration: 1,
                    highlight: a.highlight
                })
            }
        },
        getTooltip: function(a) {
            var b = this._currentTheme,
                d, g;
            switch (a.run.name) {
                case "male_bars":
                    d = this.maleIndices[a.index];
                    g = 0;
                    break;
                case "female_bars":
                    d = this.femaleIndices[a.index];
                    g = 0;
                    break;
                case "male_lines":
                    d = this.maleIndices[a.index];
                    g = this._getComparisonRow();
                    break;
                case "female_lines":
                    d = this.femaleIndices[a.index];
                    g = this._getComparisonRow();
                    break;
                default:
                    return ""
            }
            var c = this.getFeatureTitle(g),
                f = this.getFieldByIndex(d).alias;
            d = m.format(this.getValueByIndex(g, d), {
                places: 0
            });
            a = m.format(Math.abs("lines" === a.plot.name ? a.x : a.y) / 100, {
                places: 1,
                type: "percent"
            });
            return "\x3cdiv class\x3d'AgePyramid_Tooltip_Content'\x3e\x3cspan style\x3d'font:" + b.font + "; color:" + b.color + ";'\x3e\x3cb\x3e" + c + "\x3c/b \x3e \x3cbr / \x3e " + f + "\x3cbr/\x3e" + d + " (" + a + ")\x3c/span\x3e\x3c/div\x3e"
        },
        setSeriesData: function(a, b, d, g) {
            var c = [],
                f = 0,
                e,
                h;
            for (e = 0; e < d.length; e++) h = this.getValueByIndex(b, d[e]), c.push(h), f += h;
            b = Number.NEGATIVE_INFINITY;
            for (e = 0; e < d.length; e++) h = 100 * (c[e] / f), c[e] = h * g, h > b && (b = h);
            if ("lines" === a.plot)
                for (e = 0; e < c.length; e++) c[e] = {
                    x: c[e],
                    y: e + 1
                };
            a.update(c);
            return b
        },
        createUI: function(a) {
            this.inherited(arguments);
            a.contentClass.push("AgePyramid_ContentPane");
            this.chartDiv = a.addContent("div", {
                "class": "AgePyramid_Chart"
            })
        },
        createUIExpanded: function(a) {
            this.inherited(arguments);
            var b = a.addContent("div", {
                "class": "AgePyramid_MinMax"
            });
            f.create("div", {
                innerHTML: c.maxLabel
            }, b);
            this.max = f.create("div", {
                "class": "AgePyramid_Text"
            }, b);
            f.create("div", {
                "class": "AgePyramid_MinLabel",
                innerHTML: c.minLabel
            }, b);
            this.min = f.create("div", {
                "class": "AgePyramid_Text"
            }, b);
            b = a.addContent("div", {
                "class": "AgePyramid_Comparison"
            });
            f.create("div", {
                "class": "AgePyramid_ComparisonLabel",
                innerHTML: c.compLabel
            }, b);
            this._createComboBox(b)
        },
        createUICollapsed: function(a) {
            this.inherited(arguments);
            f.create("div", {
                "class": "MenLabel",
                innerHTML: c.menLabel
            }, this.chartDiv);
            f.create("div", {
                "class": "WomenLabel",
                innerHTML: c.womenLabel
            }, this.chartDiv)
        },
        destroy: function() {
            this._destroyChart();
            this._themeChangeHandle && (this._themeChangeHandle.remove(), this._themeChangeHandle = null);
            this.inherited(arguments)
        },
        _destroyChart: function() {
            this.chart && (this.chart.destroy(), this.chart = null)
        }
    })
});