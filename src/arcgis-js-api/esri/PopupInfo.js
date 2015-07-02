//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/json", "dojo/i18n", "dojo/has", "dojo/Deferred", "dojo/sniff", "dojo/promise/all", "./lang", "./kernel", "./request", "./tasks/query", "./tasks/QueryTask", "./tasks/StatisticDefinition", "dojo/i18n!dojo/cldr/nls/number"], function(F, g, p, z, K, L, C, G, t, m, M, H, D, I, J, E) {
    return F(null, {
        declaredClass: "esri.PopupInfo",
        initialize: function(a, b) {
            if (a) {
                g.mixin(this, b);
                this.info = a;
                this.title = this.getTitle;
                this.content = this.getContent;
                var c = this._fieldLabels = {},
                    d = this._fieldsMap = {};
                a.fieldInfos && p.forEach(a.fieldInfos, function(a) {
                    c[a.fieldName] = a.label;
                    d[a.fieldName] = a
                });
                this._relatedFieldPrefix = "relationships/";
                this.titleHasRelatedFields = !!(a.title && -1 !== a.title.indexOf("{" + this._relatedFieldPrefix))
            }
        },
        toJson: function() {
            return z.fromJson(z.toJson(this.info))
        },
        getTitle: function() {},
        getContent: function() {},
        getFieldInfo: function(a) {
            var b;
            p.some(this.info && this.info.fieldInfos, function(c) {
                c.fieldName === a && (b = c);
                return !!b
            });
            return b
        },
        getComponents: function(a) {
            var b = this.info,
                c = new C,
                d, e;
            b.fieldInfos && (e = p.filter(b.fieldInfos, function(a) {
                return -1 !== a.fieldName.indexOf(this._relatedFieldPrefix)
            }, this));
            e && 0 < e.length && (d = this._getRelatedRecords({
                graphic: a,
                fieldsInfo: e
            }));
            d ? d.always(g.hitch(this, function() {
                c.resolve(this._getPopupValues(a))
            })) : c.resolve(this._getPopupValues(a));
            return c.promise
        },
        getAttachments: function(a) {
            var b = a.getLayer();
            a = a.attributes;
            if (this.info.showAttachments && (b && b.hasAttachments && b.objectIdField) && (a = a && a[b.objectIdField])) return b.queryAttachmentInfos(a)
        },
        _getPopupValues: function(a, b) {
            var c = this.info,
                d = a.getLayer(),
                e = g.clone(a.attributes) || {},
                f = g.clone(e),
                q = c.fieldInfos,
                h = "",
                k = "",
                w, n, l, u, r, A = d && d._getDateOpts && d._getDateOpts().properties,
                s = {
                    dateFormat: {
                        properties: A,
                        formatter: "DateFormat" + this._insertOffset(this._dateFormats.shortDateShortTime)
                    }
                };
            if (this._relatedInfo)
                for (u in this._relatedInfo)
                    if (this._relatedInfo.hasOwnProperty(u)) {
                        var v = this._relatedInfo[u],
                            t = this._relatedLayersInfo[u];
                        v && (p.forEach(v.relatedFeatures, function(a) {
                            for (r in a.attributes)
                                if (a.attributes.hasOwnProperty(r) &&
                                    "esriRelCardinalityOneToOne" === t.relation.cardinality) {
                                    var b = this._toRelatedFieldName([t.relation.id, r]);
                                    e[b] = f[b] = a.attributes[r]
                                }
                        }, this), p.forEach(v.relatedStatsFeatures, function(a) {
                            for (r in a.attributes)
                                if (a.attributes.hasOwnProperty(r)) {
                                    var b = this._toRelatedFieldName([t.relation.id, r]);
                                    e[b] = f[b] = a.attributes[r]
                                }
                        }, this))
                    }
            q && p.forEach(q, function(a) {
                n = a.fieldName;
                f[n] = this._formatValue(f[n], n, s);
                A && (a.format && a.format.dateFormat) && (a = p.indexOf(A, n), -1 < a && A.splice(a, 1))
            }, this);
            if (d) {
                u = d.types;
                var z =
                    (v = d.typeIdField) && e[v];
                for (n in e)
                    if (e.hasOwnProperty(n) && -1 === n.indexOf(this._relatedFieldPrefix) && (l = e[n], m.isDefined(l))) {
                        var x = this._getDomainName(d, a, u, z, n, l);
                        m.isDefined(x) ? f[n] = x : n === v && (x = this._getTypeName(d, a, l), m.isDefined(x) && (f[n] = x))
                    }
            }
            c.title && (h = this._processFieldsInLinks(this._fixTokens(c.title), e), h = g.trim(m.substitute(f, h, s) || ""));
            if (b) return {
                title: h
            };
            c.description && (k = this._processFieldsInLinks(this._fixTokens(c.description), e), k = g.trim(m.substitute(f, k, s) || ""));
            q && (w = [], p.forEach(q,
                function(a) {
                    (n = a.fieldName) && a.visible && w.push([a.label || n, m.substitute(f, "${" + n + "}", s) || ""])
                }));
            var y, B;
            c.mediaInfos && (y = [], p.forEach(c.mediaInfos, function(a) {
                B = 0;
                l = a.value;
                switch (a.type) {
                    case "image":
                        var b = l.sourceURL,
                            b = b && g.trim(m.substitute(e, this._fixTokens(b)));
                        B = !!b;
                        break;
                    case "piechart":
                    case "linechart":
                    case "columnchart":
                    case "barchart":
                        B = p.some(l.fields, function(a) {
                            return m.isDefined(e[a]) || -1 !== a.indexOf(this._relatedFieldPrefix) && this._relatedInfo
                        }, this);
                        break;
                    default:
                        return
                }
                if (B) {
                    a = g.clone(a);
                    l = a.value;
                    var b = a.title ? this._processFieldsInLinks(this._fixTokens(a.title), e) : "",
                        c = a.caption ? this._processFieldsInLinks(this._fixTokens(a.caption), e) : "";
                    a.title = b ? g.trim(m.substitute(f, b, s) || "") : "";
                    a.caption = c ? g.trim(m.substitute(f, c, s) || "") : "";
                    if ("image" === a.type) l.sourceURL = m.substitute(e, this._fixTokens(l.sourceURL)), l.linkURL && (l.linkURL = g.trim(m.substitute(e, this._fixTokens(l.linkURL)) || ""));
                    else {
                        var d, h;
                        p.forEach(l.fields, function(a, b) {
                            if (-1 !== a.indexOf(this._relatedFieldPrefix)) h = this._getRelatedChartInfos(a,
                                l, e, s), h instanceof Array ? l.fields = h : l.fields[b] = h;
                            else {
                                var c = e[a],
                                    c = void 0 === c ? null : c;
                                d = e[l.normalizeField] || 0;
                                c && d && (c /= d);
                                l.fields[b] = {
                                    y: c,
                                    tooltip: (this._fieldLabels[a] || a) + ":\x3cbr/\x3e" + this._formatValue(c, a, s, !!d)
                                }
                            }
                        }, this)
                    }
                    y.push(a)
                }
            }, this));
            return {
                title: h,
                description: k,
                fields: w && w.length ? w : null,
                mediaInfos: y && y.length ? y : null,
                formatted: f,
                editSummary: d && d.getEditSummary ? d.getEditSummary(a) : ""
            }
        },
        _getRelatedChartInfos: function(a, b, c, d) {
            var e, f, q, h, k, g;
            e = [];
            g = this._fromRelatedFieldName(a);
            k = g[0];
            f = this._relatedInfo[k];
            k = this._relatedLayersInfo[k];
            f && p.forEach(f.relatedFeatures, function(f) {
                f = f.attributes;
                var l, k;
                for (k in f)
                    if (f.hasOwnProperty(k) && k === g[1]) {
                        l = {};
                        h = f[k];
                        b.normalizeField && (q = -1 !== b.normalizeField.indexOf(this._relatedFieldPrefix) ? f[this._fromRelatedFieldName(b.normalizeField)[1]] : c[b.normalizeField]);
                        h && q && (h /= q);
                        if (b.tooltipField)
                            if (-1 !== b.tooltipField.indexOf(this._relatedFieldPrefix)) {
                                var m = this._fromRelatedFieldName(b.tooltipField)[1];
                                l.tooltip = f[m] + ":\x3cbr/\x3e" + this._formatValue(h,
                                    f[m], d, !!q)
                            } else l.tooltip = (this._fieldLabels[a] || a) + ":\x3cbr/\x3e" + this._formatValue(h, b.tooltipField, d, !!q);
                        else l.tooltip = h;
                        l.y = h;
                        e.push(l)
                    }
            }, this);
            return "esriRelCardinalityOneToMany" === k.relation.cardinality || "esriRelCardinalityManyToMany" === k.relation.cardinality ? e : e[0]
        },
        _dateFormats: {
            shortDate: "(datePattern: 'M/d/y', selector: 'date')",
            shortDateLE: "(datePattern: 'd/M/y', selector: 'date')",
            longMonthDayYear: "(datePattern: 'MMMM d, y', selector: 'date')",
            dayShortMonthYear: "(datePattern: 'd MMM y', selector: 'date')",
            longDate: "(datePattern: 'EEEE, MMMM d, y', selector: 'date')",
            shortDateShortTime: "(datePattern: 'M/d/y', timePattern: 'h:mm a', selector: 'date and time')",
            shortDateLEShortTime: "(datePattern: 'd/M/y', timePattern: 'h:mm a', selector: 'date and time')",
            shortDateShortTime24: "(datePattern: 'M/d/y', timePattern: 'H:mm', selector: 'date and time')",
            shortDateLEShortTime24: "(datePattern: 'd/M/y', timePattern: 'H:mm', selector: 'date and time')",
            shortDateLongTime: "(datePattern: 'M/d/y', timePattern: 'h:mm:ss a', selector: 'date and time')",
            shortDateLELongTime: "(datePattern: 'd/M/y', timePattern: 'h:mm:ss a', selector: 'date and time')",
            shortDateLongTime24: "(datePattern: 'M/d/y', timePattern: 'H:mm:ss', selector: 'date and time')",
            shortDateLELongTime24: "(datePattern: 'd/M/y', timePattern: 'H:mm:ss', selector: 'date and time')",
            longMonthYear: "(datePattern: 'MMMM y', selector: 'date')",
            shortMonthYear: "(datePattern: 'MMM y', selector: 'date')",
            year: "(datePattern: 'y', selector: 'date')"
        },
        _reHref: /href\s*=\s*\"([^\"]+)\"/ig,
        _reHrefApos: /href\s*=\s*\'([^\']+)\'/ig,
        _fixTokens: function(a) {
            return a.replace(/(\{[^\{\r\n]+\})/g, "$$$1")
        },
        _encodeAttributes: function(a) {
            a = g.clone(a) || {};
            var b, c;
            for (b in a)
                if ((c = a[b]) && "string" === typeof c) c = encodeURIComponent(c).replace(/\'/g, "\x26apos;"), a[b] = c;
            return a
        },
        _processFieldsInLinks: function(a, b) {
            var c = this._encodeAttributes(b),
                d = this;
            a && (a = a.replace(this._reHref, function(a, f) {
                return d._addValuesToHref(a, f, b, c)
            }).replace(this._reHrefApos, function(a, f) {
                return d._addValuesToHref(a, f, b, c)
            }));
            return a
        },
        _addValuesToHref: function(a,
            b, c, d) {
            b = b && g.trim(b);
            return m.substitute(b && 0 === b.indexOf("${") ? c : d, a)
        },
        _formatValue: function(a, b, c, d) {
            var e = this._fieldsMap[b],
                f = e && e.format;
            b = "number" === typeof a && -1 === p.indexOf(c.dateFormat.properties, b) && (!f || !f.dateFormat);
            if (!m.isDefined(a) || !e || !m.isDefined(f)) return b ? this._forceLTR(a) : a;
            var q = "",
                h = [],
                e = f.hasOwnProperty("places") || f.hasOwnProperty("digitSeparator"),
                k = f.hasOwnProperty("digitSeparator") ? f.digitSeparator : !0;
            if (e) q = "NumberFormat", h.push("places: " + (m.isDefined(f.places) && (!d ||
                0 < f.places) ? Number(f.places) : "Infinity")), h.length && (q += "(" + h.join(",") + ")");
            else if (f.dateFormat) q = "DateFormat" + this._insertOffset(this._dateFormats[f.dateFormat] || this._dateFormats.shortDateShortTime);
            else return b ? this._forceLTR(a) : a;
            a = m.substitute({
                myKey: a
            }, "${myKey:" + q + "}", c) || "";
            e && !k && E.group && (a = a.replace(RegExp("\\" + E.group, "g"), ""));
            return b ? this._forceLTR(a) : a
        },
        _forceLTR: function(a) {
            var b = G("ie");
            return b && 10 >= b ? a : "\x3cspan class\x3d'esriNumericValue'\x3e" + a + "\x3c/span\x3e"
        },
        _insertOffset: function(a) {
            a &&
                (a = m.isDefined(this.utcOffset) ? a.replace(/\)\s*$/, ", utcOffset:" + this.utcOffset + ")") : a);
            return a
        },
        _getDomainName: function(a, b, c, d, e, f) {
            return (a = a.getDomain && a.getDomain(e, {
                feature: b
            })) && a.codedValues ? a.getName(f) : null
        },
        _getTypeName: function(a, b, c) {
            return (a = a.getType && a.getType(b)) && a.name
        },
        _getRelatedRecords: function(a) {
            var b = a.graphic,
                c = new C,
                d;
            this._relatedLayersInfo ? this._queryRelatedLayers(b).then(g.hitch(this, function(a) {
                this._setRelatedRecords(b, a);
                c.resolve(a)
            }), g.hitch(this, this._handlerErrorResponse,
                c)) : this._getRelatedLayersInfo(a).then(g.hitch(this, function(a) {
                for (d in a) a.hasOwnProperty(d) && a[d] && (this._relatedLayersInfo[d].relatedLayerInfo = a[d]);
                this._queryRelatedLayers(b).then(g.hitch(this, function(a) {
                    this._setRelatedRecords(b, a);
                    c.resolve(a)
                }), g.hitch(this, this._handlerErrorResponse, c))
            }), g.hitch(this, this._handlerErrorResponse, c));
            return c.promise
        },
        _getRelatedLayersInfo: function(a) {
            var b = a.fieldsInfo,
                c, d, e = {};
            c = a.graphic.getLayer();
            this._relatedLayersInfo || (this._relatedLayersInfo = {});
            p.forEach(b, function(a) {
                    var b, d, e, g;
                    b = this._fromRelatedFieldName(a.fieldName);
                    d = b[0];
                    b = b[1];
                    d && (this._relatedLayersInfo[d] || (p.some(c.relationships, function(a) {
                        if (a.id == d) return g = a, !0
                    }), g && (this._relatedLayersInfo[d] = {
                        relation: g,
                        relatedFields: [],
                        outStatistics: []
                    })), this._relatedLayersInfo[d] && (this._relatedLayersInfo[d].relatedFields.push(b), a.statisticType && (e = new J, e.statisticType = a.statisticType, e.onStatisticField = b, e.outStatisticFieldName = b, this._relatedLayersInfo[d].outStatistics.push(e))))
                },
                this);
            for (d in this._relatedLayersInfo) this._relatedLayersInfo.hasOwnProperty(d) && this._relatedLayersInfo[d] && (a = this._relatedLayersInfo[d].relation, a = c.url.replace(/[0-9]+$/, a.relatedTableId), this._relatedLayersInfo[d].relatedLayerUrl = a, e[d] = H({
                url: a,
                content: {
                    f: "json"
                },
                callbackParamName: "callback"
            }));
            return t(e)
        },
        _queryRelatedLayers: function(a) {
            var b = {},
                c;
            for (c in this._relatedLayersInfo) this._relatedLayersInfo.hasOwnProperty(c) && (b[c] = this._queryRelatedLayer({
                graphic: a,
                relatedInfo: this._relatedLayersInfo[c]
            }));
            return t(b)
        },
        _queryRelatedLayer: function(a) {
            var b, c, d, e, f, g, h, k, m, n;
            b = a.graphic;
            c = b.getLayer().url.match(/[0-9]+$/g)[0];
            k = a.relatedInfo;
            h = k.relatedLayerInfo;
            m = k.relatedLayerUrl;
            n = k.relation;
            p.some(h.relationships, function(a) {
                if (a.relatedTableId === parseInt(c, 10)) return d = a, !0
            }, this);
            d && (a = new D, p.some(h.fields, function(a) {
                    if (a.name === d.keyField) return f = -1 !== p.indexOf(["esriFieldTypeSmallInteger", "esriFieldTypeInteger", "esriFieldTypeSingle", "esriFieldTypeDouble"], a.type) ? "number" : "string", !0
                }), e = "string" ===
                f ? d.keyField + "\x3d'" + b.attributes[n.keyField] + "'" : d.keyField + "\x3d" + b.attributes[n.keyField], a.where = e, a.outFields = k.relatedFields, k.outStatistics && (0 < k.outStatistics.length && h.supportsStatistics) && (g = new D, g.where = a.where, g.outFields = a.outFields, g.outStatistics = k.outStatistics), b = new I(m), e = [], e.push(b.execute(a)), g && e.push(b.execute(g)));
            return t(e)
        },
        _setRelatedRecords: function(a, b) {
            this._relatedInfo = [];
            for (var c in b)
                if (b.hasOwnProperty(c) && b[c]) {
                    var d = b[c];
                    this._relatedInfo[c] = {};
                    this._relatedInfo[c].relatedFeatures =
                        d[0].features;
                    m.isDefined(d[1]) && (this._relatedInfo[c].relatedStatsFeatures = d[1].features)
                }
        },
        _handlerErrorResponse: function(a, b) {
            a.reject(b)
        },
        _fromRelatedFieldName: function(a) {
            var b = []; - 1 !== a.indexOf(this._relatedFieldPrefix) && (a = a.split("/"), b = a.slice(1));
            return b
        },
        _toRelatedFieldName: function(a) {
            var b = "";
            a && 0 < a.length && (b = this._relatedFieldPrefix + a[0] + "/" + a[1]);
            return b
        }
    })
});