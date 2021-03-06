//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "./kernel", "./lang"], function(a, b, d, e, c) {
    return a(null, {
        declaredClass: "esri.ServerInfo",
        constructor: function(a) {
            b.mixin(this, a)
        },
        toJson: function() {
            return c.fixJson({
                server: this.server,
                tokenServiceUrl: this.tokenServiceUrl,
                adminTokenServiceUrl: this.adminTokenServiceUrl,
                shortLivedTokenValidity: this.shortLivedTokenValidity,
                owningSystemUrl: this.owningSystemUrl,
                owningTenant: this.owningTenant,
                currentVersion: this.currentVersion,
                hasPortal: this.hasPortal,
                hasServer: this.hasServer,
                webTierAuth: this.webTierAuth
            })
        }
    })
});