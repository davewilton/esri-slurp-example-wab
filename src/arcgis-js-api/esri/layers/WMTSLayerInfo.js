//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel"], function(b, c, d, e) {
    return b(null, {
        declaredClass: "esri.layers.WMTSLayerInfo",
        identifier: null,
        tileMatrixSet: null,
        format: null,
        style: null,
        tileInfo: null,
        title: null,
        fullExtent: null,
        initialExtent: null,
        description: null,
        dimension: null,
        constructor: function(a) {
            a && (this.title = a.title, this.tileMatrixSet = a.tileMatrixSet, this.format = a.format, this.style = a.style, this.tileInfo = a.tileInfo, this.fullExtent = a.fullExtent, this.initialExtent = a.initialExtent,
                this.identifier = a.identifier, this.description = a.description, this.dimension = a.dimension)
        }
    })
});