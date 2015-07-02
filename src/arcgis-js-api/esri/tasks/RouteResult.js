//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "../kernel", "../graphic", "./DirectionsFeatureSet"], function(c, l, d, m, n, e, k) {
    return c(null, {
        declaredClass: "esri.tasks.RouteResult",
        constructor: function(a) {
            var f = a.spatialReference,
                b = a.route;
            if (a.directions) {
                var g = [],
                    h = [];
                d.forEach(a.directions.features, function(a, b) {
                    h[b] = a.compressedGeometry;
                    g[b] = a.strings
                });
                a.directions.strings = g;
                this.directions = new k(a.directions, h)
            }
            this.routeName = a.routeName;
            b && (b.geometry && (b.geometry.spatialReference =
                f), this.route = new e(b));
            if (a.stops) {
                var c = this.stops = [];
                d.forEach(a.stops, function(a, b) {
                    a.geometry && (a.geometry.spatialReference = f);
                    c[a.attributes.Sequence - 1] = new e(a)
                })
            }
        },
        routeName: null,
        directions: null,
        route: null,
        stops: null
    })
});