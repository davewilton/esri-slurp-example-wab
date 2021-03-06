//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "../kernel", "../lang", "../renderers/jsonUtils", "./LabelClass"], function(d, e, c, k, l, f, g, h) {
    return d(null, {
        declaredClass: "esri.layers.LayerDrawingOptions",
        constructor: function(a) {
            if (a && (e.mixin(this, a), a.renderer && (this.renderer = g.fromJson(a.renderer)), a.labelingInfo && 0 < a.labelingInfo.length)) {
                this.labelingInfo = [];
                var b;
                c.forEach(a.labelingInfo, function(a) {
                    b = new h(a);
                    this.labelingInfo.push(b)
                }, this)
            }
        },
        toJson: function() {
            var a = {
                renderer: this.renderer &&
                    this.renderer.toJson(),
                transparency: this.transparency,
                scaleSymbols: this.scaleSymbols,
                showLabels: this.showLabels
            };
            this.labelingInfo && 0 < this.labelingInfo.length && (a.labelingInfo = [], c.forEach(this.labelingInfo, function(b) {
                a.labelingInfo.push(b.toJson())
            }));
            return f.fixJson(a)
        }
    })
});