//>>built
define(["../../declare", "dojo/_base/lang", "dojo/_base/array", "../../request", "./LocationProviderRemoteBase"], function(l, c, m, n, p) {
    return l("esri.tasks.locationproviders.LocatorLocationProvider", p, {
        locator: null,
        addressFields: null,
        constructor: function() {
            this.geometryType = "esriGeometryPoint"
        },
        _getFieldMapping: function() {
            return this.addressFields
        },
        _init: function() {
            if (this.locator) {
                var a = this.getInherited(arguments);
                return n({
                    url: this.locator.url,
                    content: {
                        f: "json"
                    },
                    callbackParamName: "callback"
                }).then(c.hitch(this,
                    function(b) {
                        this._batchSize = b.locatorProperties && b.locatorProperties.SuggestedBatchSize || 1;
                        a.call(this)
                    }))
            }
        },
        _batchWillOverflow: function(a, b) {
            return a.length + 1 > this._batchSize
        },
        _locateBatch: function(a, b) {
            var q = this,
                d = function(b) {
                    for (var d = [], g = 0; g < b.length; g++) {
                        var f = b[g],
                            c = 1 === q._batchSize ? 0 : f.attributes.ResultID,
                            e = a[c];
                        if ((e = e && e.features) && f.score && f.location) {
                            for (var h = 0; h < e.length; h++) {
                                var k = e[h];
                                k.geometry = f.location;
                                d.push(k)
                            }
                            a[c] = null
                        }
                    }
                    return d
                };
            return 1 === this._batchSize ? this.locator.addressToLocations({
                address: a[0].expression,
                outFields: ""
            }).then(d) : this.locator.addressesToLocations({
                addresses: m.map(a, function(a, b) {
                    return c.mixin(a.expression, {
                        OBJECTID: b
                    })
                }),
                outFields: ""
            }).then(d)
        },
        _createQueryExpression: function(a) {
            for (var b = {}, c = 0; c < this._fields.length; c++) {
                var d = this._fields[c];
                b[d.outField] = a.attributes[d.inField]
            }
            return b
        }
    })
});