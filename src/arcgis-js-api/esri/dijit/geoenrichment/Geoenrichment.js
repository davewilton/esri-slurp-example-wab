//>>built
define(["../../declare", "dojo/_base/lang", "dojo/on", "dojo/string", "dojo/promise/all", "./bufferTitle", "../../geometry/Polygon", "../../units", "./DataProvider", "../../tasks/geoenrichment/GeoenrichmentTask", "../../tasks/geoenrichment/EnrichParameters", "../../tasks/geoenrichment/RingBuffer", "../../tasks/geoenrichment/DriveBuffer", "../../tasks/geoenrichment/GeographyLevel", "../../tasks/geoenrichment/GeometryStudyArea", "../../tasks/geoenrichment/AddressStudyArea", "../../tasks/geoenrichment/studyAreaFromJson", "./config", "./lang", "./_Invoke", "dojo/when", "../../tasks/locator", "../../tasks/FeatureSet", "../../graphic"], function(e, k, l, v, w, x, d, K, y, z, A, r, B, s, C, D, t, m, u, E, F, G, L, M) {
    var p = e(null, {
        _keys: null,
        _values: null,
        _capacity: 5,
        constructor: function(a) {
            this._keys = [];
            this._values = {};
            a && (this._capacity = a)
        },
        getValue: function(a) {
            return this._values[a]
        },
        setValue: function(a, b) {
            this._keys.push(a);
            this._values[a] = b;
            this._removeOverflow()
        },
        hasValue: function(a) {
            return this._values.hasOwnProperty(a)
        },
        _removeOverflow: function() {
            if (this._keys.length > this._capacity)
                for (var a = this._keys.splice(0, this._keys.length - this._capacity),
                        b = 0; b < a.length; b++) delete this._values[a[b]]
        },
        setCapacity: function(a) {
            this._capacity = a;
            this._removeOverflow()
        }
    });
    d = e(null, {
        _values: null,
        constructor: function(a) {
            this._values = new p(a)
        },
        getValue: function(a) {
            var b = this.keyToString(a);
            if (this._values.hasValue(b)) return this._values.getValue(b);
            var c = this;
            return this.keyToValue(a).then(function(a) {
                c._values.setValue(b, a);
                return a
            })
        },
        keyToString: function(a) {
            return JSON.stringify(a)
        },
        keyToValue: function(a) {
            throw "Not implemented";
        },
        setCapacity: function(a) {
            this._values.setCapacity(a)
        }
    });
    var H = e([d], {
            keyToString: function(a) {
                return JSON.stringify(a.toJson())
            },
            keyToValue: function(a) {
                return (new G(m.locatorUrl)).locationToAddress(a).then(function(a) {
                    return v.substitute(m.addressFormat, a.address, function(a) {
                        return a || ""
                    })
                }, function(a) {
                    return ""
                })
            }
        }),
        I = e([d], {
            _countryValues: null,
            _geometries: null,
            constructor: function() {
                this._countryValues = new p;
                this._geometries = new p(3)
            },
            keyToValue: function(a) {
                var b = this,
                    c = t(a.studyArea),
                    e = c.returnGeometry,
                    q, g;
                e && (g = c.toJson(), delete g.returnGeometry, delete g.comparisonLevels,
                    delete g.attributes, g = JSON.stringify(g), q = this._geometries.hasValue(g));
                var l = e && !q,
                    h = new z(m.server);
                h.token = m.token;
                for (var d = null, f = c.comparisonGeographyLevels.length - 1; 0 <= f; f--) "Admin1" == c.comparisonGeographyLevels[f].layerID && (d = c.comparisonGeographyLevels.splice(f, 1)[0]);
                var n, k;
                d && (n = JSON.stringify({
                    variables: a.variables,
                    country: a.country
                }), (k = this._countryValues.hasValue(n)) || c.comparisonGeographyLevels.push(d));
                f = new A;
                f.forStorage = !1;
                f.countryID = a.country;
                f.variables = a.variables;
                if (c.returnGeometry =
                    l) f.outSR = c.geometry ? c.geometry.spatialReference : a.outSR;
                f.studyAreas.push(c);
                return h.enrich(f).then(function(a) {
                    var c = a.featureSets[0].features;
                    d && (k ? c.push(b._countryValues.getValue(n)) : b._countryValues.setValue(n, c[c.length - 1]));
                    e && (q ? c[0].geometry = b._geometries.getValue(g) : b._geometries.setValue(g, c[0].geometry));
                    return a.featureSets[0]
                })
            },
            setCapacity: function(a) {
                this.inherited(arguments);
                this._countryValues.setCapacity(a)
            }
        }),
        J = e([d], {
            metadata: null,
            _enrichCache: null,
            _addressCache: null,
            constructor: function(a) {
                this._enrichCache =
                    new I(a);
                this._addressCache = new H(3)
            },
            keyToValue: function(a) {
                var b = this,
                    c = [],
                    e = a.returnAddress;
                delete a.returnAddress;
                c.push(this._enrichCache.getValue(a));
                var d = t(a.studyArea);
                e && c.push(this._addressCache.getValue(d.geometry));
                return w(c).then(function(a) {
                    var c = a[0],
                        h = c.features[0];
                    h.attributes[b.metadata.name] || (h.attributes[b.metadata.name] = x(d.getGeomType(), d.options), e ? h.attributes[b.metadata.address] = a[1] : d instanceof D && (h.attributes[b.metadata.address] = d.address.text));
                    return c
                })
            },
            setCapacity: function(a) {
                this.inherited(arguments);
                this._enrichCache.setCapacity(a)
            }
        });
    return e("esri.dijit.geoenrichment.Geoenrichment", [y, E], {
        country: null,
        returnGeometry: !1,
        returnAddress: !1,
        returnData: !0,
        studyArea: null,
        outSR: null,
        buffer: null,
        variables: null,
        levels: null,
        highestLevel: null,
        data: null,
        restartOnDone: !1,
        requests: null,
        started: !1,
        cache: null,
        constructor: function() {
            this.buffer = new r;
            this.cache = new J;
            this.cache.metadata = this.metadata
        },
        handleResponse: function(a) {
            try {
                this.data = a, this.onDone(null)
            } catch (b) {
                this.onDone(b)
            }
        },
        handleError: function(a) {
            this.onDone(a)
        },
        onDone: function(a) {
            this.requests = null;
            a ? "CancelError" !== a.name && (console.log(a), l.emit(this, "error", a)) : l.emit(this, "data");
            this.restartOnDone ? (this.invalidate(), this.restartOnDone = !1) : (l.emit(this, "end"), this.started = !1)
        },
        requestData: function() {
            if (this.studyArea && this.variables && this.buffer) {
                this.requests = [];
                this.started || (l.emit(this, "start"), this.started = !0);
                var a, b = this.buffer;
                a = !1;
                if (this.studyArea instanceof C) switch (this.studyArea.geometry.type) {
                    case "point":
                        a = this.returnAddress;
                        break;
                    case "polyline":
                        this.buffer instanceof
                        B && (b = new r);
                        break;
                    case "polygon":
                        b = null
                }
                var c = k.clone(this.studyArea);
                !c.options && b && (c.options = b);
                if (this.levels)
                    for (b = 0; b < this.levels.length; b++) c.comparisonGeographyLevels.push(new s({
                        layerID: this.levels[b]
                    }));
                this.highestLevel && c.comparisonGeographyLevels.push(new s({
                    layerID: this.highestLevel
                }));
                c.returnGeometry = this.returnGeometry;
                a = F(this.cache.getValue({
                    country: this.country,
                    variables: this.variables,
                    returnData: this.returnData,
                    studyArea: c.toJson(),
                    outSR: this.outSR,
                    returnAddress: a
                }));
                this.requests.push(a);
                a.then(k.hitch(this, this.handleResponse), k.hitch(this, this.handleError))
            }
        },
        invalidate: function() {
            this.pendingInvoke("requestData") || (this.requests ? this.restartOnDone = !0 : (this.geometry = null, this.invoke("requestData")))
        },
        setStudyArea: function(a) {
            this.studyArea = a;
            this.invalidate()
        },
        setBuffer: function(a) {
            this.buffer = a;
            this.invalidate()
        },
        getBuffer: function() {
            return this.buffer
        },
        invalidateData: function() {
            this.data = null;
            this.invalidate()
        },
        setVariables: function(a) {
            u.arraysEqual(this.variables, a) || (this.variables =
                a, this.invalidateData())
        },
        setGeoLevels: function(a, b) {
            u.arraysEqual(this.levels, a) && this.highestLevel == b || (this.levels = a, this.highestLevel = b, this.invalidateData())
        },
        setCacheLimit: function(a) {
            this.cache.setCapacity(a)
        },
        getData: function() {
            return this.data
        },
        getGeometry: function() {
            return this.data.features[0].geometry
        },
        isBusy: function() {
            return this.pendingInvoke("requestData") || this.requests || this.restartOnDone
        },
        stop: function() {
            this.restartOnDone = !1;
            this.cancelInvoke("requestData");
            if (this.requests)
                for (var a =
                        this.requests.slice(0), b = 0; b < a.length; b++) a[b].cancel()
        },
        setReturnAddress: function(a) {
            this.returnAddress != a && (this.returnAddress = a) && this.invalidateData()
        }
    })
});