//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "../kernel", "../graphic", "../request", "../geometry/normalizeUtils", "./Task", "./RouteResult", "./NAMessage"], function(g, l, m, E, F, x, r, n, y, z, A) {
    g = g(y, {
        declaredClass: "esri.tasks.RouteTask",
        _eventMap: {
            "solve-complete": ["result"]
        },
        constructor: function(a) {
            this._url.path += "/solve";
            this._handler = l.hitch(this, this._handler);
            this.registerConnectEvents()
        },
        __msigns: [{
            n: "solve",
            c: 3,
            a: [{
                i: 0,
                p: ["stops.features", "barriers.features", "polylineBarriers.features",
                    "polygonBarriers.features"
                ]
            }],
            e: 2
        }],
        _handler: function(a, g, h, p, e) {
            try {
                var c = [],
                    b = [],
                    f = a.routes ? a.routes.features : [],
                    q = a.stops ? a.stops.features : [],
                    B = a.barriers ? a.barriers.features : [],
                    C = a.polygonBarriers ? a.polygonBarriers.features : [],
                    D = a.polylineBarriers ? a.polylineBarriers.features : [],
                    s = a.messages,
                    k = m.forEach,
                    l = m.indexOf,
                    t = !0,
                    d, u, v = a.routes && a.routes.spatialReference || a.stops && a.stops.spatialReference || a.barriers && a.barriers.spatialReference || a.polygonBarriers && a.polygonBarriers.spatialReference || a.polylineBarriers &&
                    a.polylineBarriers.spatialReference;
                k(a.directions || [], function(a) {
                    c.push(d = a.routeName);
                    b[d] = {
                        directions: a
                    }
                });
                k(f, function(a) {
                    if (-1 === l(c, d = a.attributes.Name)) c.push(d), b[d] = {};
                    b[d].route = a
                });
                k(q, function(a) {
                    u = a.attributes;
                    if (-1 === l(c, d = u.RouteName || "esri.tasks.RouteTask.NULL_ROUTE_NAME")) c.push(d), b[d] = {};
                    "esri.tasks.RouteTask.NULL_ROUTE_NAME" !== d && (t = !1);
                    void 0 === b[d].stops && (b[d].stops = []);
                    b[d].stops.push(a)
                });
                0 < q.length && !0 === t && (b[c[0]].stops = b["esri.tasks.RouteTask.NULL_ROUTE_NAME"].stops,
                    delete b["esri.tasks.RouteTask.NULL_ROUTE_NAME"], c.splice(m.indexOf(c, "esri.tasks.RouteTask.NULL_ROUTE_NAME"), 1));
                var w = [];
                k(c, function(a, c) {
                    b[a].routeName = "esri.tasks.RouteTask.NULL_ROUTE_NAME" === a ? null : a;
                    b[a].spatialReference = v;
                    w.push(new z(b[a]))
                });
                a = function(a) {
                    k(a, function(b, c) {
                        b.geometry && (b.geometry.spatialReference = v);
                        a[c] = new x(b)
                    });
                    return a
                };
                k(s, function(a, b) {
                    s[b] = new A(a)
                });
                var r = {
                    routeResults: w,
                    barriers: a(B),
                    polygonBarriers: a(C),
                    polylineBarriers: a(D),
                    messages: s
                };
                this._successHandler([r],
                    "onSolveComplete", h, e)
            } catch (n) {
                this._errorHandler(n, p, e)
            }
        },
        solve: function(a, g, h, p) {
            var e = a.stops;
            if (e && "esri.tasks.FeatureSet" === e.declaredClass) {
                var c = [],
                    b = !1,
                    f;
                m.forEach(e.features, function(a) {
                    f = a.attributes;
                    if ((!f || !f.RouteName) && !b) b = !0;
                    else if (-1 === m.indexOf(c, f ? f.RouteName : "")) c.push(f ? f.RouteName : "")
                });
                if (1 < c.length && b) throw b = Error("'RouteName' not specified for at least 1 stop in stops FeatureSet."), this.onError(b), h && h(b), b;
            }
            e = p.assembly;
            a = this._encode(l.mixin({}, this._url.query, {
                    f: "json"
                },
                a.toJson(e && e[0])));
            var q = this._handler,
                n = this._errorHandler;
            return r({
                url: this._url.path,
                content: a,
                callbackParamName: "callback",
                load: function(a, b) {
                    q(a, b, g, h, p.dfd)
                },
                error: function(a) {
                    n(a, h, p.dfd)
                }
            })
        },
        onSolveComplete: function() {}
    });
    n._createWrappers(g);
    return g
});