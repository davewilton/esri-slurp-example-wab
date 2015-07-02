//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../config", "./DynamicMapServiceLayer", "./ImageServiceLayerMixin"], function(d, e, k, l, f, g, h) {
    return d([g, h], {
        declaredClass: "esri.layers.ArcGISImageServiceLayer",
        constructor: function(b, a) {
            this._initialize(b, a);
            this.useMapImage = a && a.useMapImage || !1
        },
        refresh: function(b) {
            if (b) this.inherited(arguments);
            else {
                var a = this.disableClientCaching;
                this.disableClientCaching = !0;
                this.inherited(arguments);
                this.disableClientCaching = a
            }
        },
        exportMapImage: function(b,
            a) {
            var c = f.defaults.map,
                c = e.mixin({
                    size: c.width + "," + c.height
                }, this._params, b ? b.toJson(this.normalization) : {}, {
                    f: "json"
                });
            delete c._ts;
            this._exportMapImage(this._url.path + "/exportImage", c, a)
        }
    })
});