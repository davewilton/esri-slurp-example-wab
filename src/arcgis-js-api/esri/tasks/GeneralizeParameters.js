//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/json", "dojo/has", "../kernel", "../geometry/jsonUtils"], function(b, f, d, c, g, h, e) {
    return b(null, {
        declaredClass: "esri.tasks.GeneralizeParameters",
        geometries: null,
        deviationUnit: null,
        maxDeviation: null,
        toJson: function() {
            var b = d.map(this.geometries, function(a) {
                    return a.toJson()
                }),
                a = {};
            this.geometries && 0 < this.geometries.length && (a.geometries = c.toJson({
                geometryType: e.getJsonType(this.geometries[0]),
                geometries: b
            }), a.sr = c.toJson(this.geometries[0].spatialReference.toJson()));
            this.deviationUnit && (a.deviationUnit = this.deviationUnit);
            this.maxDeviation && (a.maxDeviation = this.maxDeviation);
            return a
        }
    })
});