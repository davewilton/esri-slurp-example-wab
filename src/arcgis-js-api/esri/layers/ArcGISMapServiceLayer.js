//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "../kernel", "../lang", "../request", "../SpatialReference", "../geometry/Extent", "./LayerInfo"], function(c, k, l, q, r, f, m, n, g, p) {
    return c(null, {
        declaredClass: "esri.layers.ArcGISMapServiceLayer",
        infoTemplates: null,
        constructor: function(a, d) {
            this.layerInfos = [];
            d && (this.infoTemplates = d.infoTemplates || null);
            var e = this._params = {},
                b = this._url.query ? this._url.query.token : null;
            b && (e.token = b)
        },
        setInfoTemplates: function(a) {
            this.infoTemplates = a
        },
        _load: function() {
            m({
                url: this._url.path,
                content: k.mixin({
                    f: "json"
                }, this._params),
                callbackParamName: "callback",
                load: this._initLayer,
                error: this._errorHandler
            })
        },
        spatialReference: null,
        initialExtent: null,
        fullExtent: null,
        description: null,
        units: null,
        _initLayer: function(a, d) {
            try {
                this._findCredential();
                (this.credential && this.credential.ssl || a && a._ssl) && this._useSSL();
                this.description = a.description;
                this.copyright = a.copyrightText;
                this.spatialReference = a.spatialReference && new n(a.spatialReference);
                this.initialExtent = a.initialExtent && new g(a.initialExtent);
                this.fullExtent = a.fullExtent && new g(a.fullExtent);
                this.units = a.units;
                this.maxRecordCount = a.maxRecordCount;
                this.maxImageHeight = a.maxImageHeight;
                this.maxImageWidth = a.maxImageWidth;
                this.supportsDynamicLayers = a.supportsDynamicLayers;
                var e = this.layerInfos = [],
                    b = a.layers,
                    h = this._defaultVisibleLayers = [];
                l.forEach(b, function(a, b) {
                    e[b] = new p(a);
                    a.defaultVisibility && h.push(a.id)
                });
                this.visibleLayers || (this.visibleLayers = h);
                this.version = a.currentVersion;
                this.version || (this.version = "capabilities" in a || "tables" in
                    a ? 10 : "supportedImageFormatTypes" in a ? 9.31 : 9.3);
                this.capabilities = a.capabilities;
                f.isDefined(a.minScale) && !this._hasMin && this.setMinScale(a.minScale);
                f.isDefined(a.maxScale) && !this._hasMax && this.setMaxScale(a.maxScale)
            } catch (c) {
                this._errorHandler(c)
            }
        }
    })
});