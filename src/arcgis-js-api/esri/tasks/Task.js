//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/json", "dojo/has", "../kernel", "../deferredUtils", "../urlUtils", "../Evented"], function(l, h, m, r, s, n, p, q) {
    return l(q, {
        declaredClass: "esri.tasks._Task",
        _eventMap: {
            error: ["error"],
            complete: ["result"]
        },
        constructor: function(a, c) {
            a && h.isString(a) && (this._url = p.urlToObject(this.url = a));
            c && c.requestOptions && (this.requestOptions = c.requestOptions);
            this.normalization = !0;
            this._errorHandler = h.hitch(this, this._errorHandler);
            this.registerConnectEvents()
        },
        _useSSL: function() {
            var a =
                this._url,
                c = /^http:/i;
            this.url && (this.url = this.url.replace(c, "https:"));
            a && a.path && (a.path = a.path.replace(c, "https:"))
        },
        _encode: function(a, c, e) {
            var d, b, g = {},
                f, k;
            for (f in a)
                if ("declaredClass" !== f && (d = a[f], b = typeof d, null !== d && void 0 !== d && "function" !== b))
                    if (h.isArray(d)) {
                        g[f] = [];
                        k = d.length;
                        for (b = 0; b < k; b++) g[f][b] = this._encode(d[b])
                    } else "object" === b ? d.toJson && (b = d.toJson(e && e[f]), "esri.tasks.FeatureSet" === d.declaredClass && b.spatialReference && (b.sr = b.spatialReference, delete b.spatialReference), g[f] = c ?
                        b : m.toJson(b)) : g[f] = d;
            return g
        },
        _successHandler: function(a, c, e, d) {
            c && this[c].apply(this, a);
            e && e.apply(null, a);
            d && n._resDfd(d, a)
        },
        _errorHandler: function(a, c, e) {
            this.onError(a);
            c && c(a);
            e && e.errback(a)
        },
        setNormalization: function(a) {
            this.normalization = a
        },
        onError: function() {}
    })
});