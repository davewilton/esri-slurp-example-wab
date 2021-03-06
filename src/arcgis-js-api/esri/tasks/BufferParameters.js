//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/json", "dojo/has", "../kernel", "../geometry/Polygon", "../geometry/jsonUtils"], function(f, n, h, c, p, q, k, l) {
    return f(null, {
        declaredClass: "esri.tasks.BufferParameters",
        geometries: null,
        outSpatialReference: null,
        bufferSpatialReference: null,
        distances: null,
        unit: null,
        unionResults: !1,
        geodesic: !1,
        toJson: function() {
            var b = {
                    unit: this.unit,
                    unionResults: this.unionResults,
                    geodesic: this.geodesic
                },
                g = this.distances,
                d = this.outSpatialReference,
                e = this.bufferSpatialReference,
                f = h.map(this.geometries, function(a) {
                    a = "extent" === a.type ? k.fromExtent(a) : a;
                    return a.toJson()
                }, this),
                a = this.geometries;
            if (a && 0 < a.length) {
                var m = "extent" === a[0].type ? "esriGeometryPolygon" : l.getJsonType(a[0]);
                b.geometries = c.toJson({
                    geometryType: m,
                    geometries: f
                });
                b.inSR = a[0].spatialReference.wkid ? a[0].spatialReference.wkid : c.toJson(a[0].spatialReference.toJson())
            }
            g && (b.distances = g.join(","));
            d && (b.outSR = d.wkid ? d.wkid : c.toJson(d.toJson()));
            e && (b.bufferSR = e.wkid ? e.wkid : c.toJson(e.toJson()));
            return b
        }
    })
});