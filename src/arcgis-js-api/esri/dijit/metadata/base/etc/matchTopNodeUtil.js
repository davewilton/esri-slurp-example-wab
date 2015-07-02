//>>built
define(["dojo/_base/lang", "dojo/_base/array", "dojo/has", "../xml/xmlUtil", "../xml/XmlFlattener", "../../../../kernel"], function(l, f, m, n, k, p) {
    return {
        evaluateDomMatch: function(b, c, a) {
            if (!this.hasMatchConditions(b)) return c;
            var d = new k,
                e = [],
                g = b.matchTopNode.length;
            f.forEach(c, function(c) {
                var h = 0;
                f.forEach(b.matchTopNode, function(e) {
                    var g = d.flattenNode(c, a);
                    this._evaluateDomNode(b, c, g, e) && h++
                }, this);
                h === g && e.push(c)
            }, this);
            return e
        },
        evaluateXNodeMatch: function(b, c) {
            if (!this.hasMatchConditions(b)) return !0;
            var a = 0,
                d = b.matchTopNode.length;
            f.forEach(b.matchTopNode, function(b) {
                var d = this._findXNode(c, b.qPath, null);
                d && this._evaluateXNode(d, b) && a++
            }, this);
            return a === d
        },
        hasMatchConditions: function(b) {
            return b.matchTopNode && b.matchTopNode.push && 0 < b.matchTopNode.length ? !0 : !1
        },
        _evaluateDomNode: function(b, c, a, d) {
            var e = c = null;
            b = b.target + "/" + d.qPath;
            if (b in a)(e = a[b]) && 0 < e.length && (c = e[0]);
            else if ("mustNot" !== d.qMode) return !1;
            a = null === d.qValue || c === d.qValue;
            return "mustNot" === d.qMode ? !a : a
        },
        _evaluateXNode: function(b,
            c) {
            var a = b.getXmlValue(),
                a = null === c.qValue || a === c.qValue;
            return "mustNot" === c.qMode ? !a : a
        },
        _findXNode: function(b, c, a) {
            var d = null,
                e = !0;
            if (b._isGxeElement)
                if (null === a) a = "";
                else {
                    0 < a.length && (a += "/");
                    a += b.target;
                    if (c === a) return b;
                    e = !1;
                    0 === c.indexOf(a) && (e = !0)
                } else if (b._isGxeAttribute && (e = !1, null !== a && (0 < a.length && (a += "/"), a += "@" + b.target, c === a))) return b;
            e && f.some(b.getChildren(), function(b) {
                if (d = this._findXNode(b, c, a)) return !0
            }, this);
            return d
        }
    }
});