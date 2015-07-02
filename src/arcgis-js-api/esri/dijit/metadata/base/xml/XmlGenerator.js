//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "./xmlUtil", "../../../../kernel"], function(w, m, l, x, r, y) {
    return w(null, {
        nl: "\r\n",
        tb: "\t",
        xmlHeader: '\x3c?xml version\x3d"1.0" encoding\x3d"UTF-8"?\x3e',
        constructor: function(a) {
            m.mixin(this, a)
        },
        generate: function(a, b, e, d) {
            a = {
                gxeDocument: a,
                transformer: d
            };
            b = this._collect(b, null, {
                ignoreOptionallyOff: !1,
                validationTracker: e
            });
            b = this._walk(b, !0, a);
            e && e.whenComplete();
            return b
        },
        _checkTarget: function(a, b, e) {
            var d, c = "",
                f = "";
            d = b.widget;
            b = d.target;
            a.transformer && (b = a.transformer.checkTarget(d, b));
            a = [b];
            d.inputWidget && d.inputWidget.subTarget && (d = m.trim(d.inputWidget.subTarget), 0 < d.length && (a.push(d), b = d, c = e + "\x3c" + a[0] + "\x3e", f = e + "\x3c/" + a[0] + "\x3e"));
            return {
                aNames: a,
                sBegin: c,
                sEnd: f,
                sName: b
            }
        },
        _collect: function(a, b, e) {
            var d, c, f;
            f = c = !1;
            a._isGxeElement ? (f = a._isOptionallyOff, a.multiplicityHeader && a.multiplicityHeader.useTabs && (f = a.multiplicityHeader._isOptionallyOff)) : f = a._isOptionallyOff;
            if (a._isGxeElement) {
                if (e.ignoreOptionallyOff ||
                    !f) c = {
                    isAttribute: !1,
                    widget: a,
                    depth: 0,
                    xvalue: null,
                    serialize: !0,
                    references: [],
                    attributeRefs: [],
                    elementRefs: []
                }, c.xvalue = a.checkXmlValue(), a.isDocumentTitle && (e.validationTracker.documentTitle = c.xvalue), f = a.validateValue(e.validationTracker), f.isValid || (c.serialize = !1), b && (c.depth = b.depth + 1, b.references.push(c), b.elementRefs.push(c)), b = c, c = !0
            } else if (a._isGxeAttribute) {
                if (e.ignoreOptionallyOff || !f) d = {
                    isAttribute: !0,
                    widget: a,
                    xvalue: null,
                    serialize: !0
                }, d.xvalue = a.checkXmlValue(), a.isDocumentTitle && (e.validationTracker.documentTitle =
                    d.xvalue), f = a.validateValue(e.validationTracker), f.isValid || (d.serialize = !1), b && (b.references.push(d), b.attributeRefs.push(d), d.serialize && a.isIsoCodeListValue ? (b.xvalue = d.xvalue, null === d.xvalue && (b.serialize = !1)) : !d.serialize && a.isIsoCodeListValue && (b.serialize = !1))
            } else if (e.ignoreOptionallyOff || !f) c = !0;
            c && l.forEach(a.getChildren(), function(a) {
                this._collect(a, b, e)
            }, this);
            return b
        },
        _renderNamespaces: function(a, b, e, d) {
            if (!b) return a;
            b = e.getNamespaces();
            d.transformer && (b = d.transformer.toDocumentType.getNamespaces());
            l.forEach(b, function(b) {
                b.prefix && b.uri && (a += " xmlns:" + b.prefix + '\x3d"' + b.uri + '"')
            });
            return a
        },
        _walk: function(a, b, e) {
            if (!a.serialize) return "";
            var d = function(a, b, d, e, c, f, g) {
                    c = e + "\x3c" + d + c;
                    0 === f.length && 0 === g.length ? c += "/\x3e" : (c += "\x3e", 0 < f.length && (c += f), 0 < g.length && (c += g + e), c += "\x3c/" + d + "\x3e");
                    return a + c + b
                },
                c, f, k = "",
                n = "",
                g = this.nl,
                s = "",
                p = [];
            for (c = 0; c < a.depth; c++) g += this.tb;
            b && (k = this._renderNamespaces(k, b, e.gxeDocument, e));
            a.serialize && null !== a.xvalue && (a.xvalue.push ? l.forEach(a.xvalue, function(a) {
                    p.push(r.escape(a))
                },
                this) : s = r.escape(a.xvalue));
            l.forEach(a.attributeRefs, function(a) {
                a.serialize && null !== a.xvalue && (f = r.escape(a.xvalue), k += " " + a.widget.target.replace("@", "") + '\x3d"' + f + '"')
            }, this);
            l.forEach(a.elementRefs, function(a) {
                a = this._walk(a, !1, e);
                null !== a && 0 < a.length && (n += a)
            }, this);
            var m = 0 === k.length && 0 === s.length && 0 === p.length && 0 === n.length;
            if (m && !a.widget.serializeIfEmpty) return null;
            var q = this._checkTarget(e, a, g),
                t = q.sBegin,
                u = q.sEnd,
                v = q.sName;
            for (c = 0; c < q.aNames.length - 1; c++) g += this.tb;
            var h = null;
            m && a.widget.serializeIfEmpty ?
                h = t + g + "\x3c" + v + "/\x3e" + u : 0 === p.length ? h = d(t, u, v, g, k, s, n) : (h = "", l.forEach(p, function(a) {
                    h += d(t, u, v, g, k, a, n)
                }));
            b && (h = this.xmlHeader + h);
            return h
        }
    })
});