//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/json", "dojo/has", "../kernel"], function(e, g, f, h, k) {
    return e(null, {
        declaredClass: "esri.tasks.RelationshipQuery",
        definitionExpression: "",
        relationshipId: null,
        returnGeometry: !1,
        objectIds: null,
        outSpatialReference: null,
        outFields: null,
        toJson: function() {
            var a = {
                    definitionExpression: this.definitionExpression,
                    relationshipId: this.relationshipId,
                    returnGeometry: this.returnGeometry,
                    maxAllowableOffset: this.maxAllowableOffset,
                    geometryPrecision: this.geometryPrecision
                },
                c = this.objectIds,
                d = this.outFields,
                b = this.outSpatialReference;
            c && (a.objectIds = c.join(","));
            d && (a.outFields = d.join(","));
            b && (a.outSR = b.wkid || f.toJson(b.toJson()));
            a._ts = this._ts;
            return a
        }
    })
});