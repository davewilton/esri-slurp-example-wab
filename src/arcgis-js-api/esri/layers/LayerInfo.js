//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../lang"], function(a, b, d, e, c) {
    return a(null, {
        declaredClass: "esri.layers.LayerInfo",
        constructor: function(a) {
            b.mixin(this, a)
        },
        toJson: function() {
            return c.fixJson({
                defaultVisibility: this.defaultVisibility,
                id: this.id,
                maxScale: this.maxScale,
                minScale: this.minScale,
                name: this.name,
                parentLayerId: this.parentLayerId,
                subLayerIds: this.subLayerIds
            })
        }
    })
});