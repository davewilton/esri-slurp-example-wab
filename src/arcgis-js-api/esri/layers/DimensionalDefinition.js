//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../lang"], function(c, b, e, f, d) {
    return c(null, {
        declaredClass: "esri.layers.DimensionalDefinition",
        variableName: null,
        dimensionName: null,
        values: [],
        isSlice: !1,
        constructor: function(a) {
            b.isObject(a) && b.mixin(this, a)
        },
        toJson: function() {
            return d.filter({
                variableName: this.variableName,
                dimensionName: this.dimensionName,
                values: this.values,
                isSlice: this.isSlice
            }, function(a) {
                return null !== a
            })
        }
    })
});