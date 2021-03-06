//>>built
define(["dojo/_base/kernel", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/json", "dojo/has", "../kernel", "../lang", "../layerUtils"], function(g, b, h, e, l, m, k, f) {
    b = b(null, {
        declaredClass: "esri.layers.ImageParameters",
        constructor: function() {
            this.layerDefinitions = []
        },
        bbox: null,
        extent: null,
        width: null,
        height: null,
        dpi: null,
        format: null,
        imageSpatialReference: null,
        layerOption: null,
        layerIds: null,
        transparent: null,
        timeExtent: null,
        layerTimeOptions: null,
        toJson: function(c) {
            this.bbox && g.deprecated(this.declaredClass + " : Property 'bbox' deprecated. Use property 'extent'.");
            var a = this.bbox || this.extent,
                a = a && c && a._normalize(!0);
            c = this.layerOption;
            var b = a ? a.spatialReference.wkid || e.toJson(a.spatialReference.toJson()) : null,
                d = this.imageSpatialReference,
                a = {
                    dpi: this.dpi,
                    format: this.format,
                    transparent: this.transparent,
                    size: null !== this.width && null !== this.height ? this.width + "," + this.height : null,
                    bbox: a ? a.xmin + "," + a.ymin + "," + a.xmax + "," + a.ymax : null,
                    bboxSR: b,
                    layers: c ? c + ":" + this.layerIds.join(",") : null,
                    imageSR: d ? d.wkid || e.toJson(d.toJson()) : b
                };
            a.layerDefs = f._serializeLayerDefinitions(this.layerDefinitions);
            c = this.timeExtent;
            a.time = c ? c.toJson().join(",") : null;
            a.layerTimeOptions = f._serializeTimeOptions(this.layerTimeOptions);
            return k.filter(a, function(a) {
                if (null !== a) return !0
            })
        }
    });
    h.mixin(b, {
        LAYER_OPTION_SHOW: "show",
        LAYER_OPTION_HIDE: "hide",
        LAYER_OPTION_INCLUDE: "include",
        LAYER_OPTION_EXCLUDE: "exclude"
    });
    return b
});