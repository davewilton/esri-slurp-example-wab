//>>built
define(["../../declare", "dojo/_base/array", "dojo/Deferred", "dojo/promise/all", "../../graphic", "./LocationProviderBase"], function(q, r, n, s, w, t) {
    function u(a, e) {
        function f(c) {
            d < v && (c = b.shift()) && g(c.args, c.dfd)
        }

        function g(c, b) {
            d++;
            var g = e.apply(a, c);
            g.always(function() {
                d--;
                f()
            });
            g.then(b.resolve, b.reject, b.progress)
        }
        var b = [],
            d = 0;
        return function() {
            var c = arguments,
                a = new n;
            b.push({
                args: c,
                dfd: a
            });
            f();
            return a.promise
        }
    }
    var v = 4;
    return q("esri.tasks.locationproviders.LocationProviderRemoteBase", t, {
        _fields: null,
        constructor: function() {
            var a = this._getFieldMapping && this._getFieldMapping();
            this._fields = [];
            if (a)
                for (var e in a) a.hasOwnProperty(e) && this._fields.push({
                    inField: a[e],
                    outField: e
                })
        },
        _throttle: function(a) {
            return u(this, a)
        },
        _createFeatureLookup: function(a) {
            for (var e = {}, f = 0; f < a.length; f++) {
                var g = a[f],
                    b = this._createKey(g);
                if (b) {
                    var d = e[b];
                    d ? d.push(g) : e[b] = [g]
                }
            }
            return e
        },
        _createKey: function(a, e) {
            for (var f = [], g = e || r.map(this._fields, function(b) {
                    return b.inField
                }), b = 0; b < g.length; b++) {
                var d = a.attributes[g[b]];
                if (void 0 !== d && null !== d) f.push(d);
                else return
            }
            return f.join("|||")
        },
        _locate: function(a, e) {
            var f = new n,
                g = this,
                b = [],
                d = [],
                c = [],
                m = this._createFeatureLookup(a),
                k = function(a) {
                    return g._locateBatch(a, e).then(function(a) {
                        a && (b = b.concat(a));
                        f.progress(b)
                    })
                },
                k = this._throttle(k),
                l;
            for (l in m)
                if (m.hasOwnProperty(l)) {
                    var h = m[l],
                        p = this._createQueryExpression(h[0]);
                    p && (h = {
                        key: l,
                        features: h,
                        expression: p
                    }, this._batchWillOverflow(c, h) && (d.push(k(c)), c = []), c.push(h))
                }
            c.length && d.push(k(c));
            s(d).then(function() {
                f.resolve(b)
            });
            return f.promise
        }
    })
});