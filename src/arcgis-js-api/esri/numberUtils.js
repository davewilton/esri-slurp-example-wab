//>>built
define(["dojo/has", "dojo/number", "dojo/i18n!dojo/cldr/nls/number", "./kernel"], function(u, q, s, v) {
    var t = function(c, b) {
            return c - b
        },
        d = {
            _reNumber: /^-?(\d+)(\.(\d+))?$/i,
            getDigits: function(c) {
                var b = String(c),
                    a = b.match(d._reNumber);
                c = {
                    integer: 0,
                    fractional: 0
                };
                a && a[1] ? (c.integer = a[1].split("").length, c.fractional = a[3] ? a[3].split("").length : 0) : -1 < b.toLowerCase().indexOf("e") && (a = b.split("e"), b = a[0], a = a[1], b && a && (b = Number(b), a = Number(a), (c = 0 < a) || (a = Math.abs(a)), b = d.getDigits(b), c ? (b.integer += a, b.fractional =
                    a > b.fractional ? 0 : b.fractional - a) : (b.fractional += a, b.integer = a > b.integer ? 1 : b.integer - a), c = b));
                return c
            },
            getFixedNumbers: function(c, b) {
                var a, e;
                a = Number(c.toFixed(b));
                e = a < c ? a + 1 / Math.pow(10, b) : a - 1 / Math.pow(10, b);
                return [a, e]
            },
            getPctChange: function(c, b, a, e) {
                var f = {
                        prev: null,
                        next: null
                    },
                    d;
                null != a && (d = c - a, a = b - a - d, f.prev = Math.floor(Math.abs(100 * a / d)));
                null != e && (d = e - c, a = e - b - d, f.next = Math.floor(Math.abs(100 * a / d)));
                return f
            },
            round: function(c, b) {
                var a = c.slice(0),
                    e, f, r, m, l, g, n, p, h, q = !b || null == b.tolerance ? 2 : b.tolerance,
                    k = b && b.indexes;
                if (k) k.sort(t);
                else {
                    k = [];
                    for (g = 0; g < a.length; g++) k.push(g)
                }
                for (g = 0; g < k.length; g++)
                    if (h = k[g], e = a[h], f = 0 === h ? null : a[h - 1], r = h === a.length - 1 ? null : a[h + 1], m = d.getDigits(e), m = m.fractional) {
                        n = 0;
                        for (p = !1; n <= m && !p;) l = d.getFixedNumbers(e, n), l = l[0], p = d.hasMinimalChange(e, l, f, r, q), n++;
                        p && (a[h] = l)
                    }
                return a
            },
            hasMinimalChange: function(c, b, a, e, f) {
                c = d.getPctChange(c, b, a, e);
                b = null == c.prev || c.prev <= f;
                a = null == c.next || c.next <= f;
                return b && a || c.prev + c.next <= 2 * f
            },
            _reAllZeros: RegExp("\\" + s.decimal + "0+$", "g"),
            _reSomeZeros: RegExp("(\\d)0*$", "g"),
            format: function(c, b) {
                b = b || {
                    places: 20,
                    round: -1
                };
                var a = q.format(c, b);
                a && (a = a.replace(d._reSomeZeros, "$1").replace(d._reAllZeros, ""));
                return a
            }
        };
    return d
});