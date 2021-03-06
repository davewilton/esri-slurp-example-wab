//>>built
define(["dojo/_base/declare", "dojo/_base/array", "dojo/_base/lang", "dojo/has", "../kernel", "../request", "./BasemapLayer"], function(c, d, b, k, e, f, g) {
    return c(null, {
        declaredClass: "esri.dijit.Basemap",
        id: null,
        title: "",
        thumbnailUrl: null,
        layers: null,
        itemId: null,
        basemapGallery: null,
        constructor: function(a, h) {
            a = a || {};
            !a.layers && !a.itemId && console.error("esri.dijit.Basemap: unable to find the 'layers' property in parameters");
            this.id = a.id;
            this.itemId = a.itemId;
            this.layers = a.layers;
            this.title = a.title || "";
            this.thumbnailUrl =
                a.thumbnailUrl;
            this.basemapGallery = h
        },
        getLayers: function(a) {
            if (this.layers) return this.layers;
            if (this.itemId) return a = f({
                url: (a || e.dijit._arcgisUrl) + "/content/items/" + this.itemId + "/data",
                content: {
                    f: "json"
                },
                callbackParamName: "callback",
                error: b.hitch(this, function(a, b) {
                    if (this.basemapGallery) this.basemapGallery.onError("esri.dijit.Basemap: could not access basemap item.");
                    else console.error("esri.dijit.Basemap: could not access basemap item.")
                })
            }), a.addCallback(b.hitch(this, function(a, b) {
                if (a.baseMap) return this.layers = [], d.forEach(a.baseMap.baseMapLayers, function(a) {
                    this.layers.push(new g(a))
                }, this), this.layers;
                if (this.basemapGallery) this.basemapGallery.onError("esri.dijit.Basemap: could not access basemap item.");
                else console.error("esri.dijit.Basemap: could not access basemap item.");
                return []
            })), a
        }
    })
});