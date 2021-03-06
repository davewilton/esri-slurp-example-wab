//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../geometry/Point", "../geometry/Extent", "./VEAddress"], function(a, b, f, g, c, d, e) {
    return a(null, {
        declaredClass: "esri.virtualearth.VEGeocodeResult",
        constructor: function(a) {
            b.mixin(this, {
                address: null,
                bestView: null,
                calculationMethod: null,
                confidence: null,
                displayName: null,
                entityType: null,
                location: null,
                matchCodes: null
            }, a);
            this.address && (this.address = new e(this.address));
            this.bestView && (this.bestView = new d(this.bestView));
            this.locationArray &&
                (this.calculationMethod = this.locationArray[0].calculationMethod, this.location = new c(this.locationArray[0]))
        }
    })
});