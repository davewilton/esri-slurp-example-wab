//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel"], function(a, b, c, d) {
    return a(null, {
        declaredClass: "esri.virtualearth.VEAddress",
        constructor: function(a) {
            b.mixin(this, {
                addressLine: null,
                adminDistrict: null,
                countryRegion: null,
                district: null,
                formattedAddress: null,
                locality: null,
                postalCode: null,
                postalTown: null
            }, a)
        }
    })
});