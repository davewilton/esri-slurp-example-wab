//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../SpatialReference"], function(b, d, e, f, c) {
    return b(null, {
        declaredClass: "esri.geometry.Geometry",
        spatialReference: null,
        type: null,
        cache: void 0,
        setSpatialReference: function(a) {
            this.spatialReference = a;
            return this
        },
        verifySR: function() {
            this.spatialReference || this.setSpatialReference(new c(4326))
        },
        getExtent: function() {
            return null
        },
        clearCache: function() {
            this.cache = void 0
        },
        getCacheValue: function(a) {
            return this.cache && this.cache[a]
        },
        setCacheValue: function(a,
            b) {
            this.cache || (this.cache = {});
            this.cache[a] = b
        }
    })
});