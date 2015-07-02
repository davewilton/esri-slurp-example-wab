//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "../kernel", "../graphic", "../SpatialReference", "./DirectionsFeatureSet", "./NAMessage"], function(d, m, b, n, p, f, g, h, k) {
    return d(null, {
        declaredClass: "esri.tasks.ClosestFacilitySolveResult",
        constructor: function(a) {
            a.directions && (this.directions = [], b.forEach(a.directions, function(a, l) {
                var e = [],
                    c = [];
                b.forEach(a.features, function(a, b) {
                    c[b] = a.compressedGeometry;
                    e[b] = a.strings
                });
                a.strings = e;
                this.directions[l] = new h(a, c)
            }, this));
            a.routes &&
                (this.routes = this._graphicsFromJson(a.routes));
            a.facilities && (this.facilities = this._graphicsFromJson(a.facilities));
            a.incidents && (this.incidents = this._graphicsFromJson(a.incidents));
            a.barriers && (this.pointBarriers = this._graphicsFromJson(a.barriers));
            a.polylineBarriers && (this.polylineBarriers = this._graphicsFromJson(a.polylineBarriers));
            a.polygonBarriers && (this.polygonBarriers = this._graphicsFromJson(a.polygonBarriers));
            a.messages && (this.messages = b.map(a.messages, function(a, b) {
                return new k(a)
            }))
        },
        routes: null,
        facilities: null,
        incidents: null,
        pointBarriers: null,
        polylineBarriers: null,
        polygonBarriers: null,
        directions: null,
        messages: null,
        _graphicsFromJson: function(a) {
            var d = new g(a.spatialReference);
            return b.map(a.features, function(a, b) {
                var c = new f(a);
                c.geometry.setSpatialReference(d);
                return c
            })
        }
    })
});