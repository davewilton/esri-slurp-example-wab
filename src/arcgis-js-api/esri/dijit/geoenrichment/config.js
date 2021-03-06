//>>built
define([], function() {
    return {
        portalUrl: location.protocol + "//arcgis.com",
        server: location.protocol + "//geoenrich.arcgis.com/arcgis/rest/services/World/GeoenrichmentServer",
        levels: ["Admin3", "Admin2"],
        highestLevel: "Admin1",
        locatorUrl: location.protocol + "//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
        addressFormat: "${Address}, ${City}, ${Region} ${Postal}"
    }
});