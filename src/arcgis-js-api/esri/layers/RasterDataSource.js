//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../lang", "./DataSource"], function(a, d, e, f, b, c) {
    return a(c, {
        declaredClass: "esri.layers.RasterDataSource",
        toJson: function() {
            return b.fixJson({
                type: "raster",
                workspaceId: this.workspaceId,
                dataSourceName: this.dataSourceName
            })
        }
    })
});