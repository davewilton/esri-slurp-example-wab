//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/json", "dojo/has", "../kernel", "../config", "../request", "./ServiceGeneratedFeatureCollection"], function(a, f, b, g, h, c, d, e) {
    return a([e], {
        declaredClass: "esri.layers.GeoRSSLayer",
        serviceUrl: location.protocol + "//utility.arcgis.com/sharing/rss",
        constructor: function(a, b) {
            c.defaults.geoRSSService && (this.serviceUrl = c.defaults.geoRSSService);
            this._createLayer()
        },
        parse: function() {
            return this._io = d({
                url: this.serviceUrl,
                content: {
                    url: this.url,
                    refresh: this.loaded ?
                        !0 : void 0,
                    outSR: this._outSR ? b.toJson(this._outSR.toJson()) : void 0
                },
                callbackParamName: "callback"
            })
        },
        _initLayer: function(a) {
            this.inherited(arguments);
            this.loaded || (this.loaded = !0, this.onLoad(this))
        }
    })
});