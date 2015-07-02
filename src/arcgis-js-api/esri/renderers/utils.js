//>>built
define(["dojo/_base/lang", "dojo/_base/array", "dojo/has", "dojo/date/locale", "../kernel", "../numberUtils", "dojo/i18n!../nls/jsapi", "dojo/i18n!dojo/cldr/nls/gregorian"], function(q, h, u, m, v, k, r, s) {
    var l = {},
        t = {
            millisecond: 0,
            second: 1,
            minute: 2,
            hour: 3,
            day: 4,
            month: 5,
            year: 6
        },
        n = {
            millisecond: [{
                formatLength: "long",
                selector: "date"
            }, {
                formatLength: "medium",
                selector: "time"
            }],
            second: [{
                formatLength: "long",
                selector: "date"
            }, {
                formatLength: "medium",
                selector: "time"
            }],
            minute: [{
                formatLength: "long",
                selector: "date"
            }, {
                formatLength: "short",
                selector: "time"
            }],
            hour: [{
                formatLength: "long",
                selector: "date"
            }, {
                formatLength: "short",
                selector: "time"
            }],
            day: [{
                formatLength: "long",
                selector: "date"
            }],
            month: [{
                formatLength: "long",
                selector: "date"
            }],
            year: [{
                selector: "year"
            }]
        };
    q.mixin(l, {
        createColorStops: function(a) {
            var b = a.values,
                e = a.colors,
                f = a.labelIndexes;
            a = [];
            return a = h.map(b, function(a, d) {
                var g = "";
                0 === d ? g = "\x3c " : d === b.length - 1 && (g = "\x3e ");
                return {
                    value: a,
                    color: e[d],
                    label: !f || -1 < h.indexOf(f, d) ? g + k.format(a) : null
                }
            })
        },
        updateColorStops: function(a) {
            var b =
                a.stops;
            a = a.changes;
            var e = [],
                f, c = h.map(b, function(a) {
                    return a.value
                });
            h.forEach(a, function(a) {
                e.push(a.index);
                c[a.index] = a.value
            });
            f = k.round(c, {
                indexes: e
            });
            h.forEach(b, function(a, g) {
                a.value = c[g];
                var e = "";
                0 === g ? e = "\x3c " : g === b.length - 1 && (e = "\x3e ");
                a.label = null != a.label ? e + k.format(f[g]) : null
            })
        },
        createClassBreakLabel: function(a) {
            var b = a.minValue,
                e = a.maxValue,
                f = a.isFirstBreak ? "" : "\x3e ";
            a = "percent-of-total" === a.normalizationType ? "%" : "";
            b = null == b ? "" : k.format(b);
            e = null == e ? "" : k.format(e);
            return f + b + a + " " +
                r.smartMapping.minToMax + " " + e + a
        },
        setLabelsForClassBreaks: function(a) {
            var b = a.classBreaks,
                e = a.classificationMethod,
                f = a.normalizationType,
                c = [];
            b && b.length && ("standard-deviation" === e ? console.log("setLabelsForClassBreaks: cannot set labels for class breaks generated using 'standard-deviation' method.") : a.round ? (c.push(b[0].minValue), h.forEach(b, function(a) {
                c.push(a.maxValue)
            }), c = k.round(c), h.forEach(b, function(a, b) {
                a.label = l.createClassBreakLabel({
                    minValue: 0 === b ? c[0] : c[b],
                    maxValue: c[b + 1],
                    isFirstBreak: 0 ===
                        b,
                    normalizationType: f
                })
            })) : h.forEach(b, function(a, b) {
                a.label = l.createClassBreakLabel({
                    minValue: a.minValue,
                    maxValue: a.maxValue,
                    isFirstBreak: 0 === b,
                    normalizationType: f
                })
            }))
        },
        updateClassBreak: function(a) {
            var b = a.classBreaks,
                e = a.normalizationType,
                f = a.change,
                c = f.index,
                f = f.value,
                d = -1,
                g = -1,
                h = b.length;
            "standard-deviation" === a.classificationMethod ? console.log("updateClassBreak: cannot update labels for class breaks generated using 'standard-deviation' method.") : (0 === c ? d = c : c === h ? g = c - 1 : (g = c - 1, d = c), -1 < d && d < h &&
                (a = b[d], a.minValue = f, a.label = l.createClassBreakLabel({
                    minValue: a.minValue,
                    maxValue: a.maxValue,
                    isFirstBreak: 0 === d,
                    normalizationType: e
                })), -1 < g && g < h && (a = b[g], a.maxValue = f, a.label = l.createClassBreakLabel({
                    minValue: a.minValue,
                    maxValue: a.maxValue,
                    isFirstBreak: 0 === g,
                    normalizationType: e
                })))
        },
        calculateDateFormatInterval: function(a) {
            var b, e, f = a.length,
                c, d, g, k, p, l, m = Infinity,
                n;
            a = h.map(a, function(a) {
                return new Date(a)
            });
            for (b = 0; b < f - 1; b++) {
                c = a[b];
                g = [];
                p = Infinity;
                l = "";
                for (e = b + 1; e < f; e++) d = a[e], d = c.getFullYear() !==
                    d.getFullYear() && "year" || c.getMonth() !== d.getMonth() && "month" || c.getDate() !== d.getDate() && "day" || c.getHours() !== d.getHours() && "hour" || c.getMinutes() !== d.getMinutes() && "minute" || c.getSeconds() !== d.getSeconds() && "second" || "millisecond", k = t[d], k < p && (p = k, l = d), g.push(d);
                p < m && (m = p, n = l)
            }
            return n
        },
        createUniqueValueLabel: function(a) {
            var b = a.value,
                e = a.fieldInfo,
                f = a.domain;
            a = a.dateFormatInterval;
            var c = String(b);
            if (f = f && f.codedValues ? f.getName(b) : null) c = f;
            else if ("number" === typeof b)
                if ("esriFieldTypeDate" ===
                    e.type) {
                    var d = new Date(b);
                    if (a && n[a]) var g = h.map(n[a], function(a) {
                            return m.format(d, a)
                        }).reverse(),
                        c = 1 == g.length ? g[0] : s["dateTimeFormat-medium"].replace(/\'/g, "").replace(/\{(\d+)\}/g, function(a, b) {
                            return g[b]
                        });
                    else c = m.format(d)
                } else c = k.format(b);
            return c
        }
    });
    return l
});