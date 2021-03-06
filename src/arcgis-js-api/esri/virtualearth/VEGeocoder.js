//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/Deferred", "dojo/has", "../kernel", "../urlUtils", "../tasks/Task", "./VEGeocodeResult", "../deferredUtils", "../request"], function(k, b, l, m, t, u, n, p, q, r, s) {
    return k(p, {
        declaredClass: "esri.virtualearth.VEGeocoder",
        constructor: function(a) {
            try {
                a = b.mixin({
                    bingMapsKey: null
                }, a || {});
                var d = window.location.protocol;
                "file:" === d && (d = "http:");
                this.url = d + "//serverapi.arcgisonline.com/veadaptor/production/services/geocode/geocode";
                this._url = n.urlToObject(this.url);
                this._queue = [];
                this.bingMapsKey = a.bingMapsKey;
                this.culture = a.culture || "en-US";
                this._errorHandler = b.hitch(this, this._errorHandler);
                this._addressToLocationsHandler = b.hitch(this, this._addressToLocationsHandler);
                if (!this.bingMapsKey) throw Error("BingMapsKey must be provided.");
            } catch (c) {
                throw this.onError(c), c;
            }
        },
        addressToLocations: function(a, d, c) {
            if (this.bingMapsKey) {
                var g = b.mixin({}, this._url.query, {
                        query: a,
                        token: this.bingMapsKey,
                        culture: this.culture
                    }),
                    e = this._addressToLocationsHandler,
                    h = this._errorHandler,
                    f = new m(r._dfdCanceller);
                f._pendingDfd = s({
                    url: this._url.path,
                    content: g,
                    callbackParamName: "callback",
                    load: function(a, b) {
                        e(a, b, d, c, f)
                    },
                    error: function(a) {
                        h(a, c, f)
                    }
                });
                return f
            }
            console.debug("Server token not retrieved. Queing request to be executed after server token retrieved.");
            this._queue.push(arguments)
        },
        _addressToLocationsHandler: function(a, b, c, g, e) {
            try {
                l.forEach(a, function(b, c) {
                    a[c] = new q(b)
                }), this._successHandler([a], "onAddressToLocationsComplete", c, e)
            } catch (h) {
                this._errorHandler(h, g, e)
            }
        },
        onAddressToLocationsComplete: function() {},
        setBingMapsKey: function(a) {
            this.bingMapsKey = a
        },
        setCulture: function(a) {
            this.culture = a
        }
    })
});