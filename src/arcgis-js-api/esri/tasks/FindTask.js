//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/Deferred", "dojo/has", "../kernel", "../request", "../deferredUtils", "./Task", "./FindResult"], function(h, g, k, l, s, t, m, n, p, q) {
    return h(p, {
        declaredClass: "esri.tasks.FindTask",
        constructor: function(a, b) {
            this._url.path += "/find";
            this._handler = g.hitch(this, this._handler);
            this.gdbVersion = b && b.gdbVersion
        },
        _handler: function(a, b, e, f, d) {
            try {
                var c = [];
                k.forEach(a.results, function(a, b) {
                    c[b] = new q(a)
                });
                this._successHandler([c], "onComplete", e, d)
            } catch (r) {
                this._errorHandler(r,
                    f, d)
            }
        },
        execute: function(a, b, e) {
            a = this._encode(g.mixin({}, this._url.query, {
                f: "json"
            }, a.toJson()));
            var f = this._handler,
                d = this._errorHandler;
            this.gdbVersion && (a.gdbVersion = this.gdbVersion);
            var c = new l(n._dfdCanceller);
            c._pendingDfd = m({
                url: this._url.path,
                content: a,
                callbackParamName: "callback",
                load: function(a, d) {
                    f(a, d, b, e, c)
                },
                error: function(a) {
                    d(a, e, c)
                }
            });
            return c
        },
        onComplete: function() {}
    })
});