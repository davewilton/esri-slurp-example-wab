//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel"], function(b, c, d, e) {
    return b(null, {
        declaredClass: "esri.tasks.RasterData",
        constructor: function(a) {
            a && c.mixin(this, a)
        },
        url: null,
        format: null,
        itemID: null,
        toJson: function() {
            var a = {};
            this.url && (a.url = this.url);
            this.format && (a.format = this.format);
            this.itemID && (a.itemID = this.itemID);
            return a
        }
    })
});