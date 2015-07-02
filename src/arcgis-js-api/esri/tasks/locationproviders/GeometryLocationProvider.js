//>>built
define(["../../declare", "dojo/json", "../../geometry/jsonUtils", "./LocationProviderClientBase"], function(d, f, e, g) {
    return d("esri.tasks.locationproviders.GeometryLocationProvider", g, {
        geometryField: null,
        getGeometry: function(a) {
            if (a = a.attributes[this.geometryField]) try {
                "string" === typeof a && (a = f.parse(a));
                var c;
                a.spatialReference || (c = this.inSpatialReference);
                var b = e.fromJson(a);
                if (b && e.getJsonType(b) === this.geometryType) return c && b.setSpatialReference(c), b
            } catch (d) {}
        }
    })
});