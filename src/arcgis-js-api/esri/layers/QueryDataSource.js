//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../lang", "./DataSource", "../SpatialReference"], function(c, d, h, k, e, f, g) {
    return c(f, {
        declaredClass: "esri.layers.QueryDataSource",
        constructor: function(a) {
            a && (a.oidFields && d.isString(a.oidFields) && (this.oidFields = a.oidFields.split(",")), a.spatialReference && (this.spatialReference = new g(a.spatialReference)))
        },
        toJson: function() {
            var a = {
                type: "queryTable",
                workspaceId: this.workspaceId,
                query: this.query,
                oidFields: this.oidFields && this.oidFields.join(),
                spatialReference: this.spatialReference && this.spatialReference.toJson()
            };
            if (this.geometryType) {
                var b;
                b = "point" === this.geometryType.toLowerCase() ? "esriGeometryPoint" : "multipoint" === this.geometryType.toLowerCase() ? "esriGeometryMultipoint" : "polyline" === this.geometryType.toLowerCase() ? "esriGeometryPolyline" : "polygon" === this.geometryType.toLowerCase() ? "esriGeometryPolygon" : this.geometryType;
                a.geometryType = b
            }
            return e.fixJson(a)
        }
    })
});