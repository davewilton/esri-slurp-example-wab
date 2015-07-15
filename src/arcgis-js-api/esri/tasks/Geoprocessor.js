//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/Deferred", "dojo/_base/json", "dojo/has", "dojo/io-query", "../kernel", "../request", "../deferredUtils", "../geometry/normalizeUtils", "./Task", "./FeatureSet", "./JobInfo", "./GPMessage", "./LinearUnit", "./DataFile", "./RasterData", "./Date", "./ParameterValue", "./GPResultImageLayer", "../layers/ArcGISDynamicMapServiceLayer", "../layers/MapImage"], function(p, h, s, q, m, H, t, I, l, r, u, v, w, n, x, y, z, A, B, C, D, E, F) {
    p = p(v, {
        declaredClass: "esri.tasks.Geoprocessor",
        _eventMap: {
            "execute-complete": ["results",
                "messages"
            ],
            "get-result-data-complete": ["result"],
            "get-result-image-complete": ["mapImage"],
            "get-result-image-layer-complete": ["layer"],
            "job-cancel": ["jobInfo"],
            "job-complete": ["jobInfo"],
            "status-update": ["jobInfo"]
        },
        constructor: function(a) {
            this._jobUpdateHandler = h.hitch(this, this._jobUpdateHandler);
            this._getJobStatus = h.hitch(this, this._getJobStatus);
            this._getResultDataHandler = h.hitch(this, this._getResultDataHandler);
            this._getResultImageHandler = h.hitch(this, this._getResultImageHandler);
            this._executeHandler =
                h.hitch(this, this._executeHandler);
            this._updateTimers = [];
            this.registerConnectEvents()
        },
        updateDelay: 1E3,
        processSpatialReference: null,
        outputSpatialReference: null,
        outSpatialReference: null,
        setUpdateDelay: function(a) {
            this.updateDelay = a
        },
        setProcessSpatialReference: function(a) {
            this.processSpatialReference = a
        },
        setOutputSpatialReference: function(a) {
            this._setOutSR(a)
        },
        setOutSpatialReference: function(a) {
            this._setOutSR(a)
        },
        __msigns: [{
            n: "execute",
            c: 3,
            a: [{
                i: 0,
                p: ["*"]
            }],
            e: 2,
            f: 1
        }, {
            n: "submitJob",
            c: 4,
            a: [{
                i: 0,
                p: ["*"]
            }],
            e: 3
        }],
        _setOutSR: function(a) {
            this.outSpatialReference = this.outputSpatialReference = a
        },
        _getOutSR: function() {
            return this.outSpatialReference || this.outputSpatialReference
        },
        _gpEncode: function(a, c, b) {
            for (var e in a) {
                var d = a[e];
                h.isArray(d) ? a[e] = m.toJson(s.map(d, function(a) {
                    return this._gpEncode({
                        item: a
                    }, !0).item
                }, this)) : d instanceof Date && (a[e] = d.getTime())
            }
            return this._encode(a, c, b)
        },
        _decode: function(a) {
            var c = a.dataType,
                b = new C(a);
            if (-1 !== s.indexOf(["GPBoolean", "GPDouble", "GPLong", "GPString"], c)) return b;
            if ("GPLinearUnit" === c) b.value = new y(b.value);
            else if ("GPFeatureRecordSetLayer" === c || "GPRecordSet" === c) b.value = new w(b.value);
            else if ("GPDataFile" === c) b.value = new z(b.value);
            else if ("GPDate" === c) a = b.value, h.isString(a) ? b.value = new B({
                date: a
            }) : b.value = new Date(a);
            else if ("GPRasterData" === c || "GPRasterDataLayer" === c) a = a.value.mapImage, b.value = a ? new F(a) : new A(b.value);
            else if (-1 !== c.indexOf("GPMultiValue:")) {
                var e = c.split(":")[1];
                a = b.value;
                b.value = s.map(a, function(a) {
                    return this._decode({
                        paramName: "_name",
                        dataType: e,
                        value: a
                    }).value
                }, this)
            } else console.log(this.declaredClass + " : GP Data type not handled. : " + b.dataType), b = null;
            return b
        },
        submitJob: function(a, c, b, e, d) {
            var g = this._getOutSR(),
                f = d.assembly;
            a = this._gpEncode(h.mixin({}, this._url.query, {
                f: "json",
                "env:outSR": g ? g.wkid || m.toJson(g.toJson()) : null,
                "env:processSR": this.processSpatialReference ? this.processSpatialReference.wkid || m.toJson(this.processSpatialReference.toJson()) : null
            }, a), null, f && f[0]);
            var k = this._jobUpdateHandler,
                G = this._errorHandler;
            return l({
                url: this._url.path + "/submitJob",
                content: a,
                callbackParamName: "callback",
                load: function(a, f) {
                    k(a, f, !1, c, b, d.dfd)
                },
                error: function(a) {
                    G(a, e, d.dfd)
                }
            })
        },
        _jobUpdateHandler: function(a, c, b, e, d, g) {
            var f = a.jobId;
            c = new n(a);
            this._successHandler([c], "onStatusUpdate", d, b && g);
            if (!b) switch (clearTimeout(this._updateTimers[f]), this._updateTimers[f] = null, g && g.progress(c), a.jobStatus) {
                case n.STATUS_SUBMITTED:
                case n.STATUS_EXECUTING:
                case n.STATUS_WAITING:
                case n.STATUS_NEW:
                    var k = this._getJobStatus;
                    this._updateTimers[f] =
                        setTimeout(function() {
                            k(f, b, e, d, g)
                        }, this.updateDelay);
                    break;
                default:
                    this._successHandler([c], "onJobComplete", e, g)
            }
        },
        _getJobStatus: function(a, c, b, e, d) {
            var g = this._jobUpdateHandler;
            l({
                url: this._url.path + "/jobs/" + a,
                content: h.mixin({}, this._url.query, {
                    f: "json"
                }),
                callbackParamName: "callback",
                load: function(a, k) {
                    g(a, k, c, b, e, d)
                },
                error: this._errorHandler
            })
        },
        _getResultDataHandler: function(a, c, b, e, d) {
            try {
                var g = this._decode(a);
                this._successHandler([g], "onGetResultDataComplete", b, d)
            } catch (f) {
                this._errorHandler(f,
                    e, d)
            }
        },
        getResultData: function(a, c, b, e) {
            var d = this._getResultDataHandler,
                g = this._errorHandler,
                f = new q(r._dfdCanceller);
            f._pendingDfd = l({
                url: this._url.path + "/jobs/" + a + "/results/" + c,
                content: h.mixin({}, this._url.query, {
                    f: "json",
                    returnType: "data"
                }),
                callbackParamName: "callback",
                load: function(a, c) {
                    d(a, c, b, e, f)
                },
                error: function(a) {
                    g(a, e, f)
                }
            });
            return f
        },
        checkJobStatus: function(a, c, b) {
            var e = this._jobUpdateHandler,
                d = this._errorHandler,
                g = new q(r._dfdCanceller);
            g._pendingDfd = l({
                url: this._url.path + "/jobs/" + a,
                content: h.mixin({},
                    this._url.query, {
                        f: "json"
                    }),
                callbackParamName: "callback",
                load: function(a, b) {
                    e(a, b, !0, null, c, g)
                },
                error: function(a) {
                    d(a, b, g)
                }
            });
            return g
        },
        cancelJob: function(a, c, b) {
            var e = this._errorHandler,
                d = new q(r._dfdCanceller);
            d._pendingDfd = l({
                url: this._url.path + "/jobs/" + a + "/cancel",
                content: h.mixin({}, this._url.query, {
                    f: "json"
                }),
                callbackParamName: "callback",
                load: h.hitch(this, function(a, b) {
                    this._successHandler([a], "onJobCancel", c, d)
                }),
                error: function(a) {
                    e(a, b, d)
                }
            });
            return d
        },
        execute: function(a, c, b, e) {
            var d = this._getOutSR(),
                g = e.assembly;
            a = this._gpEncode(h.mixin({}, this._url.query, {
                f: "json",
                "env:outSR": d ? d.wkid || m.toJson(d.toJson()) : null,
                "env:processSR": this.processSpatialReference ? this.processSpatialReference.wkid || m.toJson(this.processSpatialReference.toJson()) : null
            }, a), null, g && g[0]);
            var f = this._executeHandler,
                k = this._errorHandler;
            return l({
                url: this._url.path + "/execute",
                content: a,
                callbackParamName: "callback",
                load: function(a, d) {
                    f(a, d, c, b, e.dfd)
                },
                error: function(a) {
                    k(a, b, e.dfd)
                }
            })
        },
        _executeHandler: function(a, c, b, e, d) {
            try {
                var g =
                    a.results,
                    f, k, h = a.messages;
                f = 0;
                for (k = g.length; f < k; f++) g[f] = this._decode(g[f]);
                f = 0;
                for (k = h.length; f < k; f++) h[f] = new x(h[f]);
                this._successHandler([g, h], "onExecuteComplete", b, d)
            } catch (l) {
                this._errorHandler(l, e, d)
            }
        },
        _getResultImageHandler: function(a, c, b, e, d) {
            try {
                var g = this._decode(a);
                this._successHandler([g], "onGetResultImageComplete", b, d)
            } catch (f) {
                this._errorHandler(f, e, d)
            }
        },
        getResultImage: function(a, c, b, e, d) {
            var g = this._getResultImageHandler,
                f = this._errorHandler;
            b = this._gpEncode(h.mixin({}, this._url.query, {
                f: "json"
            }, b.toJson()));
            var k = new q(r._dfdCanceller);
            k._pendingDfd = l({
                url: this._url.path + "/jobs/" + a + "/results/" + c,
                content: b,
                callbackParamName: "callback",
                load: function(a, b) {
                    g(a, b, e, d, k)
                },
                error: function(a) {
                    f(a, d, k)
                }
            });
            return k
        },
        cancelJobStatusUpdates: function(a) {
            clearTimeout(this._updateTimers[a]);
            this._updateTimers[a] = null
        },
        getResultImageLayer: function(a, c, b, e) {
            if (null == c) {
                var d = this._url.path.indexOf("/GPServer/");
                a = this._url.path.substring(0, d) + "/MapServer/jobs/" + a
            } else a = this._url.path + "/jobs/" +
                a + "/results/" + c;
            this._url.query && (a += "?" + t.objectToQuery(this._url.query));
            c = null == c ? new E(a, {
                imageParameters: b
            }) : new D(a, {
                imageParameters: b
            }, !0);
            this.onGetResultImageLayerComplete(c);
            e && e(c);
            return c
        },
        onStatusUpdate: function() {},
        onJobComplete: function() {},
        onExecuteComplete: function() {},
        onGetResultDataComplete: function() {},
        onGetResultImageComplete: function() {},
        onGetResultImageLayerComplete: function() {},
        onJobCancel: function() {}
    });
    u._createWrappers(p);
    return p
});