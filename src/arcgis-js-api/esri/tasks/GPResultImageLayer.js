//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/json", "dojo/has", "dojo/io-query", "../kernel", "../layers/ArcGISDynamicMapServiceLayer"], function(b, e, g, k, h, l, c) {
    return b(c, {
        declaredClass: "esri.tasks._GPResultImageLayer",
        constructor: function(d, a) {
            a && (a.imageParameters && a.imageParameters.extent) && (this.initialExtent = this.fullExtent = a.imageParameters.extent, this.spatialReference = this.initialExtent.spatialReference);
            this.getImageUrl = e.hitch(this, this.getImageUrl);
            this.loaded = !0;
            this.onLoad(this)
        },
        getImageUrl: function(d, a, b, c) {
            var f = d.spatialReference.wkid;
            c(this._url.path + "?" + h.objectToQuery(e.mixin(this._params, {
                f: "image",
                bbox: g.toJson(d.toJson()),
                bboxSR: f,
                imageSR: f,
                size: a + "," + b
            })))
        }
    })
});