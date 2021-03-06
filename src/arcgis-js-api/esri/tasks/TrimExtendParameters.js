//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/json", "dojo/has", "../kernel"], function(a, d, e, c, f, g) {
    a = a(null, {
        declaredClass: "esri.tasks.TrimExtendParameters",
        polylines: null,
        trimExtendTo: null,
        extendHow: null,
        toJson: function() {
            var a = e.map(this.polylines, function(a) {
                    return a.toJson()
                }),
                b = {};
            b.polylines = c.toJson(a);
            b.trimExtendTo = c.toJson(this.trimExtendTo.toJson());
            b.sr = c.toJson(this.polylines[0].spatialReference.toJson());
            b.extendHow = this.extendHow || 0;
            return b
        }
    });
    d.mixin(a, {
        DEFAULT_CURVE_EXTENSION: 0,
        RELOCATE_ENDS: 1,
        KEEP_END_ATTRIBUTES: 2,
        NO_END_ATTRIBUTES: 4,
        NO_EXTEND_AT_FROM: 8,
        NO_EXTEND_AT_TO: 16
    });
    return a
});