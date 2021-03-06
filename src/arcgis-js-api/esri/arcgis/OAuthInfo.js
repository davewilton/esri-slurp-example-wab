//>>built
define(["../kernel", "../lang", "dojo/_base/declare", "dojo/_base/lang", "dojo/has"], function(d, a, b, c, e) {
    return b(null, {
        declaredClass: "esri.arcgis.OAuthInfo",
        constructor: function(a) {
            c.mixin(this, {
                expiration: 20160,
                minTimeUntilExpiration: 30,
                portalUrl: "https://www.arcgis.com",
                authNamespace: "/",
                popup: !1,
                popupCallbackUrl: "oauth-callback.html",
                popupWindowFeatures: "height\x3d480,width\x3d800,location,resizable,scrollbars,status"
            }, a)
        },
        _oAuthCred: null,
        toJson: function() {
            return a.fixJson({
                appId: this.appId,
                expiration: this.expiration,
                locale: this.locale,
                minTimeUntilExpiration: this.minTimeUntilExpiration,
                portalUrl: this.portalUrl,
                authNamespace: this.authNamespace,
                popup: this.popup,
                popupCallbackUrl: this.popupCallbackUrl,
                popupWindowFeatures: this.popupWindowFeatures
            })
        }
    })
});