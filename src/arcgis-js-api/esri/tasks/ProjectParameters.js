//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/json", "dojo/has", "../kernel", "../lang", "../geometry/jsonUtils"], function(c, g, d, b, h, k, e, f) {
    return c(null, {
        declaredClass: "esri.tasks.ProjectParameters",
        geometries: null,
        outSR: null,
        transformation: null,
        transformForward: null,
        toJson: function() {
            var c = d.map(this.geometries, function(a) {
                    return a.toJson()
                }),
                a = {};
            a.outSR = this.outSR.wkid || b.toJson(this.outSR.toJson());
            a.inSR = this.geometries[0].spatialReference.wkid || b.toJson(this.geometries[0].spatialReference.toJson());
            a.geometries = b.toJson({
                geometryType: f.getJsonType(this.geometries[0]),
                geometries: c
            });
            this.transformation && (a.transformation = this.transformation.wkid || b.toJson(this.transformation));
            e.isDefined(this.transformForward) && (a.transformForward = this.transformForward);
            return a
        }
    })
});