//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "../kernel", "../graphic", "../SpatialReference", "./NAMessage"], function(c, h, b, k, l, e, f, g) {
    return c(null, {
        declaredClass: "esri.tasks.ServiceAreaSolveResult",
        constructor: function(a) {
            a.saPolygons && (this.serviceAreaPolygons = this._graphicsFromJson(a.saPolygons));
            a.saPolylines && (this.serviceAreaPolylines = this._graphicsFromJson(a.saPolylines));
            a.facilities && (this.facilities = this._graphicsFromJson(a.facilities));
            a.barriers && (this.pointBarriers =
                this._graphicsFromJson(a.barriers));
            a.polylineBarriers && (this.polylineBarriers = this._graphicsFromJson(a.polylineBarriers));
            a.polygonBarriers && (this.polygonBarriers = this._graphicsFromJson(a.polygonBarriers));
            a.messages && (this.messages = b.map(a.messages, function(a, b) {
                return new g(a)
            }))
        },
        serviceAreaPolygons: null,
        serviceAreaPolylines: null,
        facilities: null,
        pointBarriers: null,
        polylineBarriers: null,
        polygonBarriers: null,
        messages: null,
        _graphicsFromJson: function(a) {
            var c = new f(a.spatialReference);
            return b.map(a.features,
                function(a, b) {
                    var d = new e(a);
                    d.geometry.setSpatialReference(c);
                    return d
                })
        }
    })
});