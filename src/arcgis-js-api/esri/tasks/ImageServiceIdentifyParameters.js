//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/json", "dojo/has", "../kernel", "../lang", "../geometry/jsonUtils"], function(e, g, c, h, k, d, f) {
    return e(null, {
        declaredClass: "esri.tasks.ImageServiceIdentifyParameters",
        geometry: null,
        mosaicRule: null,
        renderingRule: null,
        pixelSizeX: null,
        pixelSizeY: null,
        pixelSize: null,
        returnGeometry: !1,
        returnCatalogItems: !0,
        timeExtent: null,
        toJson: function(a) {
            var b = a && a.geometry || this.geometry;
            a = {
                geometry: b,
                returnGeometry: this.returnGeometry,
                returnCatalogItems: this.returnCatalogItems,
                mosaicRule: this.mosaicRule ? c.toJson(this.mosaicRule.toJson()) : null,
                renderingRule: this.renderingRule ? c.toJson(this.renderingRule.toJson()) : null
            };
            b && (a.geometryType = f.getJsonType(b));
            b = this.timeExtent;
            a.time = b ? b.toJson().join(",") : null;
            d.isDefined(this.pixelSizeX) && d.isDefined(this.pixelSizeY) ? a.pixelSize = c.toJson({
                x: parseFloat(this.pixelSizeX),
                y: parseFloat(this.pixelSizeY)
            }) : this.pixelSize && (a.pixelSize = this.pixelSize ? c.toJson(this.pixelSize.toJson()) : null);
            return a
        }
    })
});