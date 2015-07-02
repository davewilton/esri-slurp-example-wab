//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../lang", "./Domain"], function(b, c, f, g, d, e) {
    return b([e], {
        declaredClass: "esri.layers.RangeDomain",
        constructor: function(a) {
            a && c.isObject(a) && (this.minValue = a.range[0], this.maxValue = a.range[1])
        },
        toJson: function() {
            var a = this.inherited(arguments);
            a.range = [this.minValue, this.maxValue];
            return d.fixJson(a)
        }
    })
});