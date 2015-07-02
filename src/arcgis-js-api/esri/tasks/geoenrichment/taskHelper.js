//>>built
define(["dojo/_base/lang", "dojo/Deferred", "dojo/json", "../../request", "../../extend"], function(g, n, h, p, k) {
    var f = {
        invokeMethod: function(b, c, a, f, g, h) {
            function k(a) {
                var c;
                try {
                    c = f(a)
                } catch (d) {
                    l(d);
                    return
                }
                e && e.resolve(c);
                b[g](c)
            }

            function l(a) {
                e && e.reject(a);
                b[h](a)
            }
            var d = null,
                e = null,
                e = new n(function() {
                    d && (d.cancel(), d = null)
                });
            try {
                var m = a ? a() : {};
                m.f = "json";
                b.token && (m.token = b.token);
                d = p({
                    url: b.url + c,
                    content: m,
                    handleAs: "json"
                });
                d.then(k, l)
            } catch (q) {
                l(q)
            }
            return e.promise
        },
        jsonToRest: function(b) {
            var c = {},
                a;
            for (a in b) g.isString(b[a]) ? c[a] = b[a] : c[a] = h.stringify(b[a]);
            return c
        },
        throwEmptyResponse: function() {
            throw Error("Geoenrichment service returned empty response");
        }
    };
    k("esri.tasks.geoenrichment.taskHelper", f);
    return f
});