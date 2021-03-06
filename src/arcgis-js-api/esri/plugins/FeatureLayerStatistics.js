//>>built
define(["dojo/_base/lang", "dojo/_base/array", "dojo/_base/declare", "dojo/has", "dojo/Deferred", "dojo/on", "dojo/promise/all", "dojo/when", "../kernel", "../config", "../SpatialReference", "../tasks/query", "../tasks/StatisticDefinition", "../tasks/GenerateRendererTask", "../tasks/UniqueValueDefinition", "../tasks/ClassBreaksDefinition", "../tasks/GenerateRendererParameters", "../tasks/generateRenderer", "../tasks/GeometryService", "../tasks/ProjectParameters", "../layers/TileInfo", "../layers/HeatmapManager", "../workers/heatmapCalculator", "../geometry/mathUtils", "../geometry/webMercatorUtils", "../geometry/Point", "../geometry/Extent"], function(u, q, H, W, p, B, I, C, X, y, x, t, D, J, K, L, z, M, N, O, P, Q, E, F, G, R, S) {
    y = y.defaults;
    var T = E.prototype._calculateIntensityMatrix,
        U = E.calculateStats,
        V = Q.prototype._getScreenPoints,
        A = H(null, {
            declaredClass: "esri.plugins.FeatureLayerStatistics",
            sampleSize: 500,
            generalizeForScale: 4E5,
            generalizeForResolution: 105,
            mapWidth: 1280,
            mapHeight: 800,
            minDistance: 12,
            minLength: 30,
            minSize: 15,
            minPixels: 15,
            samplingThreshold: 2E4,
            numBins: 10,
            numClasses: 5,
            classificationMethod: "equal-interval",
            standardDeviationInterval: 1,
            geometryServiceUrl: window.location.protocol +
                "//utility.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer",
            tileInfo: new P({
                rows: 256,
                cols: 256,
                dpi: 96,
                format: "JPEG",
                compressionQuality: 90,
                origin: {
                    x: -2.0037508342787E7,
                    y: 2.0037508342787E7
                },
                spatialReference: {
                    wkid: 102100,
                    latestWkid: 3857
                },
                lods: [{
                    level: 0,
                    resolution: 156543.03392800014,
                    scale: 5.91657527591555E8
                }, {
                    level: 1,
                    resolution: 78271.51696399994,
                    scale: 2.95828763795777E8
                }, {
                    level: 2,
                    resolution: 39135.75848200009,
                    scale: 1.47914381897889E8
                }, {
                    level: 3,
                    resolution: 19567.87924099992,
                    scale: 7.3957190948944E7
                }, {
                    level: 4,
                    resolution: 9783.93962049996,
                    scale: 3.6978595474472E7
                }, {
                    level: 5,
                    resolution: 4891.96981024998,
                    scale: 1.8489297737236E7
                }, {
                    level: 6,
                    resolution: 2445.98490512499,
                    scale: 9244648.868618
                }, {
                    level: 7,
                    resolution: 1222.992452562495,
                    scale: 4622324.434309
                }, {
                    level: 8,
                    resolution: 611.4962262813797,
                    scale: 2311162.217155
                }, {
                    level: 9,
                    resolution: 305.74811314055756,
                    scale: 1155581.108577
                }, {
                    level: 10,
                    resolution: 152.87405657041106,
                    scale: 577790.554289
                }, {
                    level: 11,
                    resolution: 76.43702828507324,
                    scale: 288895.277144
                }, {
                    level: 12,
                    resolution: 38.21851414253662,
                    scale: 144447.638572
                }, {
                    level: 13,
                    resolution: 19.10925707126831,
                    scale: 72223.819286
                }, {
                    level: 14,
                    resolution: 9.554628535634155,
                    scale: 36111.909643
                }, {
                    level: 15,
                    resolution: 4.77731426794937,
                    scale: 18055.954822
                }, {
                    level: 16,
                    resolution: 2.388657133974685,
                    scale: 9027.977411
                }, {
                    level: 17,
                    resolution: 1.1943285668550503,
                    scale: 4513.988705
                }, {
                    level: 18,
                    resolution: 0.5971642835598172,
                    scale: 2256.994353
                }, {
                    level: 19,
                    resolution: 0.29858214164761665,
                    scale: 1128.497176
                }]
            }),
            constructor: function(a) {
                u.mixin(this, a);
                this._scaleCache = this._sampleCache =
                    null;
                this._gsTask = y.geometryService || new N(this.geometryServiceUrl);
                if (this.layer.loaded) this._createGRTask();
                else B.once(this.layer, "load", u.hitch(this, this._createGRTask))
            },
            destroy: function() {
                this.layer = this._grTask = this._scaleCache = this._sampleCache = null
            },
            getUniqueValues: function(a) {
                var b = new p;
                !a || !a.field ? this._rejectDfd(b, "FeatureLayerStatistics.getUniqueValues: 'field' parameter is missing.") : this._callAfterLoad(this._findUniqueValues, {
                    dfd: b,
                    params: a
                });
                return b.promise
            },
            getFieldStatistics: function(a) {
                var b =
                    new p;
                !a || !a.field ? this._rejectDfd(b, "FeatureLayerStatistics.getFieldStatistics: 'field' parameter is missing.") : this._callAfterLoad(this._getFieldStats, {
                    dfd: b,
                    params: a
                });
                return b.promise
            },
            getSpatialStatistics: function(a) {
                var b = new p;
                !a || !a.features || !a.features.length ? this._rejectDfd(b, "FeatureLayerStatistics.getSpatialStatistics: 'features' parameter is missing or it has no features.") : this._callAfterLoad(this._spatialStats, {
                    dfd: b,
                    params: a
                });
                return b.promise
            },
            getSuggestedSizeRange: function(a) {
                var b =
                    new p;
                this._callAfterLoad(this._getSizeRange, {
                    dfd: b,
                    params: a
                });
                return b.promise
            },
            getHeatmapStatistics: function(a) {
                var b = new p;
                this._callAfterLoad(this._getHeatmapStats, {
                    dfd: b,
                    params: a
                });
                return b.promise
            },
            getHistogram: function(a) {
                var b = new p;
                !a || !a.field ? this._rejectDfd(b, "FeatureLayerStatistics.getHistogram: 'field' parameter is missing.") : this._callAfterLoad(this._getHistogram, {
                    dfd: b,
                    params: a
                });
                return b.promise
            },
            getSampleFeatures: function(a) {
                var b = new p;
                this._callAfterLoad(this._sampleFeatures, {
                    dfd: b,
                    params: a
                });
                return b.promise
            },
            getSuggestedScaleRange: function(a) {
                var b = new p;
                this._callAfterLoad(this._scaleRange, {
                    dfd: b,
                    params: a
                });
                return b.promise
            },
            getClassBreaks: function(a) {
                var b = new p;
                !a || !a.field ? this._rejectDfd(b, "FeatureLayerStatistics.getClassBreaks: 'field' parameter is missing.") : this._callAfterLoad(this._findClassBreaks, {
                    dfd: b,
                    params: a
                });
                return b.promise
            },
            _srcQuery: "service-query",
            _srcGenRend: "service-generate-renderer",
            _srcMemory: "features-in-memory",
            _log10e: Math.LOG10E,
            _reNumber: /\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*/gi,
            _isCollection: function() {
                return !this.layer.url
            },
            _getFieldStats: function(a) {
                var b = this,
                    c = a.params,
                    d = this.layer.getField(c.field);
                this._rejectNonNumeric(a.dfd, d, "getFieldStatistics") || (this._isCollection() ? this._statsFromMemory(c).then(function(b) {
                    a.dfd.resolve(b)
                }).otherwise(function(c) {
                    b._rejectDfd(a.dfd, "FeatureLayerStatistics.getFieldStatistics: unable to calculate field statistics.")
                }) : (c.normalizationType ? this._statsFromGenRend(c) : this._statsFromQuery(c)).then(function(b) {
                    a.dfd.resolve(b)
                }).otherwise(function(d) {
                    b._statsFromMemory(c).then(function(b) {
                        a.dfd.resolve(b)
                    }).otherwise(function(c) {
                        b._rejectDfd(a.dfd,
                            "FeatureLayerStatistics.getFieldStatistics: unable to calculate field statistics.")
                    })
                }))
            },
            _statsFromQuery: function(a) {
                var b = this.layer,
                    c = new p;
                if (b.url && b.supportsStatistics) {
                    var d = new t,
                        f = this,
                        g = this._getRangeExpr(a.field, a.minValue, a.maxValue);
                    g && (d.where = g);
                    d.outStatistics = q.map("min max avg stddev count sum var".split(" "), function(b) {
                        var c = new D;
                        c.statisticType = b;
                        c.onStatisticField = a.field;
                        c.outStatisticFieldName = "var" === b ? "variance" : b;
                        return c
                    });
                    b.queryFeatures(d).then(function(a) {
                        a = (a = a && a.features) &&
                            a[0] && a[0].attributes;
                        var b, d = {
                            source: f._srcQuery
                        };
                        for (b in a) d[b.toLowerCase()] = a[b];
                        d.min === d.max && (null != d.min && null == d.stddev) && (d.stddev = d.variance = 0);
                        c.resolve(d)
                    }).otherwise(function(a) {
                        f._rejectDfd(c, "FeatureLayerStatistics: Statistics query operation failed.")
                    })
                } else this._rejectDfd(c, "FeatureLayerStatistics: Statistics query requires a layer that supports statistics.");
                return c.promise
            },
            _statsFromMemory: function(a) {
                var b = new p,
                    c;
                if ("percent-of-total" === a.normalizationType) {
                    c = this._calcStatsFromMemory({
                        field: a.field
                    }).sum;
                    if (null == c) {
                        this._rejectDfd(b, "getFieldStatistics: invalid normalizationTotal.");
                        return
                    }
                    a = u.mixin({
                        normalizationTotal: c
                    }, a)
                }
                b.resolve(this._calcStatsFromMemory(a));
                return b.promise
            },
            _calcStatsFromMemory: function(a) {
                var b = this._getDataValues(this.layer.graphics, a);
                a = this._calcStatistics(b, !a.normalizationType);
                a.source = this._srcMemory;
                return a
            },
            _getDataValues: function(a, b) {
                var c = b.field,
                    d = b.normalizationType,
                    f = b.normalizationField,
                    g = b.normalizationTotal,
                    e = null == b.minValue ? -Infinity : b.minValue,
                    k = null ==
                    b.maxValue ? Infinity : b.maxValue,
                    l, h, m, n = [];
                q.forEach(a, function(a) {
                    m = (l = a.attributes) && l[c];
                    d && null != m && (h = l && parseFloat(l[f]), "log" === d && 0 != m ? m = Math.log(m) * this._log10e : "percent-of-total" === d && !isNaN(g) && 0 != g ? m = 100 * (m / g) : "field" === d && (!isNaN(h) && 0 != h) && (m /= h));
                    null != m && (!isNaN(m) && m >= e && m <= k) && n.push(m)
                }, this);
                return n
            },
            _calcStatistics: function(a, b) {
                var c = Infinity,
                    d = -Infinity,
                    f = 0,
                    g = null,
                    e = null,
                    k = null,
                    l = null;
                q.forEach(a, function(a) {
                    f++;
                    g += a;
                    a < c && (c = a);
                    a > d && (d = a)
                });
                if (f) {
                    var e = g / f,
                        h = 0;
                    q.forEach(a, function(a) {
                        h +=
                            Math.pow(a - e, 2)
                    });
                    l = b ? 1 < f ? h / (f - 1) : 0 : 0 < f ? h / f : 0;
                    k = Math.sqrt(l)
                }
                return {
                    min: f ? c : null,
                    max: f ? d : null,
                    count: f,
                    sum: g,
                    avg: e,
                    stddev: k,
                    variance: l
                }
            },
            _statsFromGenRend: function(a) {
                var b = new p,
                    c = this,
                    d = a.normalizationType,
                    f = a.normalizationField;
                this.getClassBreaks({
                    field: a.field,
                    classificationMethod: "standard-deviation",
                    standardDeviationInterval: 0.25,
                    normalizationType: d,
                    normalizationField: "field" === d ? f : void 0,
                    minValue: a.minValue,
                    maxValue: a.maxValue
                }).then(function(a) {
                    var d, f, l;
                    q.some(a.classBreakInfos, function(a,
                        b) {
                        a.hasAvg && (d = a);
                        return !!d
                    });
                    d && (l = d.maxValue - d.minValue, f = d.minValue + l / 2, l *= 4);
                    b.resolve({
                        min: a.minValue,
                        max: a.maxValue,
                        avg: f,
                        stddev: l,
                        source: c._srcGenRend
                    })
                }).otherwise(function(a) {
                    c._rejectDfd(b, "FeatureLayerStatistics.getFieldStatistics: unable to calculate class breaks.")
                });
                return b.promise
            },
            _spatialStats: function(a) {
                var b = a.params.features,
                    c = this.layer.geometryType,
                    d = {},
                    c = {
                        point: "esriGeometryPoint" === c,
                        mPoint: "esriGeometryMultipoint" === c,
                        line: "esriGeometryPolyline" === c,
                        polygon: "esriGeometryPolygon" ===
                            c
                    };
                c.point ? d = this._getPointStats(b) : c.mPoint ? d = this._getPointStats(b, !0) : c.line ? d = this._getLineStats(b) : c.polygon && (d = this._getPolygonStats(b));
                d.avgXY = this._getAvgXY(b, c);
                a.dfd.resolve(d)
            },
            _getPointStats: function(a, b) {
                var c, d, f = a.length,
                    g, e, k = {},
                    l = {},
                    h = 0,
                    m = 0,
                    n = Infinity,
                    s = -Infinity,
                    r = 0,
                    p = 0,
                    q, w, v = [];
                if (b)
                    for (c = 0; c < f; c++) a[c].geometry && v.push.apply(v, a[c].geometry.points);
                else v = a;
                f = v.length;
                for (c = 0; c < f; c++)
                    if (b ? (k.x = v[c][0], k.y = v[c][1], g = k) : g = v[c].geometry, g) {
                        q = Infinity;
                        w = -Infinity;
                        for (d = 0; d < f; d++) d !==
                            c && (b ? (l.x = v[d][0], l.y = v[d][1], e = l) : e = v[d].geometry, e && (e = F.getLength(g, e), 0 < e && (e < q && (q = e), e < n && (n = e), e > w && (w = e), e > s && (s = e))));
                        Infinity !== q && (++r, h += q); - Infinity !== w && (++p, m += w)
                    }
                return {
                    minDistance: Infinity !== n ? n : null,
                    maxDistance: -Infinity !== s ? s : null,
                    avgMinDistance: r ? h / r : null,
                    avgMaxDistance: p ? m / p : null
                }
            },
            _getLineStats: function(a) {
                var b, c = a.length,
                    d, f = {},
                    g = {},
                    e = Infinity,
                    k = -Infinity,
                    l = 0,
                    h = 0;
                for (b = 0; b < c; b++)
                    if (d = a[b].geometry) d = this._getLineLength(d, f, g), 0 < d && (++h, l += d, d < e && (e = d), d > k && (k = d));
                return {
                    minLength: Infinity !==
                        e ? e : null,
                    maxLength: -Infinity !== k ? k : null,
                    avgLength: h ? l / h : null
                }
            },
            _getLineLength: function(a, b, c) {
                a = a.paths;
                var d, f = a.length,
                    g, e, k = 0;
                for (d = 0; d < f; d++) g = a[d], e = g[0], g = g[g.length - 1], e && g && (b.x = e[0], b.y = e[1], c.x = g[0], c.y = g[1], e = F.getLength(b, c), 0 < e && (k += e));
                return k
            },
            _getPolygonStats: function(a) {
                var b, c = a.length,
                    d, f = Infinity,
                    g = -Infinity,
                    e = 0,
                    k = 0;
                for (b = 0; b < c; b++)
                    if (a[b].geometry && (d = a[b].geometry.getExtent())) d = (d.getWidth() + d.getHeight()) / 2, 0 < d && (++k, e += d, d < f && (f = d), d > g && (g = d));
                return {
                    minSize: Infinity !== f ?
                        f : null,
                    maxSize: -Infinity !== g ? g : null,
                    avgSize: k ? e / k : null
                }
            },
            _getAvgXY: function(a, b) {
                var c, d, f, g = a.length,
                    e, k, l, h, m = null,
                    n = null,
                    s = 0,
                    r;
                for (c = 0; c < g; c++)
                    if (d = a[c].geometry)
                        if (b.point) ++s, m += d.x, n += d.y;
                        else if (b.mPoint) {
                    l = d.points;
                    k = l.length;
                    for (d = 0; d < k; d++) ++s, m += l[d][0], n += l[d][1]
                } else if (b.line) {
                    h = d.paths;
                    e = h.length;
                    for (d = 0; d < e; d++) {
                        l = h[d];
                        k = l.length;
                        for (f = 0; f < k; f++) ++s, m += l[f][0], n += l[f][1]
                    }
                } else if (b.polygon) {
                    h = d.rings;
                    e = h.length;
                    for (d = 0; d < e; d++) {
                        l = h[d];
                        k = l.length;
                        for (f = 0; f < k; f++) ++s, m += l[f][0], n += l[f][1]
                    }
                }
                null !=
                    m && null != n && (r = {
                        x: m / s,
                        y: n / s
                    });
                return r
            },
            _getSizeRange: function(a) {
                var b = this,
                    c = this.layer,
                    d = c.getMap();
                "esriGeometryPolygon" !== c.geometryType ? this._rejectDfd(a.dfd, "FeatureLayerStatistics.getSuggestedSizeRange: not supported for points and lines.") : d ? this._getFeatures(d, a.params).then(function(c) {
                    b.getSpatialStatistics({
                        features: c
                    }).then(function(c) {
                        b._calcSizeRange(c, d, a.dfd)
                    }).otherwise(function(c) {
                        b._rejectDfd(a.dfd, "FeatureLayerStatistics.getSuggestedSizeRange: unable to calculate spatial statistics.")
                    })
                }).otherwise(function(c) {
                    b._rejectDfd(a.dfd,
                        c.message)
                }) : this._rejectDfd(a.dfd, "FeatureLayerStatistics.getSuggestedSizeRange: layer has to be added to the map.")
            },
            _getFeatures: function(a, b) {
                var c = new p,
                    d = this,
                    f;
                b && b.useMapExtent ? (f = new t, f.geometry = a.extent, f = this.layer.queryFeatures(f)) : f = {
                    features: this.layer.graphics.slice(0)
                };
                C(f).then(function(a) {
                    (a = a && a.features) && a.length ? c.resolve(a) : d._rejectDfd(c, "FeatureLayerStatistics.getSuggestedSizeRange: layer has 0 features.")
                }).otherwise(function(a) {
                    d._rejectDfd(c, "FeatureLayerStatistics.getSuggestedSizeRange: unable to query features.")
                });
                return c.promise
            },
            _calcSizeRange: function(a, b, c) {
                var d = a && a.avgSize;
                b = b.getResolution();
                var f;
                null == d || isNaN(d) || !b ? this._rejectDfd(c, "FeatureLayerStatistics.getSuggestedSizeRange: invalid average feature size.") : (d = Math.ceil(d / b), b = Math.ceil(d / 4), 4 > b ? b = 4 : 16 < b && (b = 16), f = 5 * b, f = 50 > f ? 50 : f, null == f || isNaN(f) ? this._rejectDfd(c, "FeatureLayerStatistics.getSuggestedSizeRange: invalid maxSize.") : c.resolve({
                    minSize: b,
                    maxSize: f,
                    spatialStatistics: a,
                    avgFeatureSize: d
                }))
            },
            _getHeatmapStats: function(a) {
                var b = this,
                    c = this.layer,
                    d = a.params,
                    f = a.dfd,
                    g = d.fieldOffset;
                a = d.field && this.layer.getField(d.field);
                if (!d.field || !this._rejectNonNumeric(f, a, "getHeatmapStatistics")) d.field && null == g ? c.statisticsPlugin.getFieldStatistics({
                    field: d.field
                }).then(function(a) {
                    b._calcHeatmapStats(a, g, d, f)
                }).otherwise(function(a) {
                    b._rejectDfd(f, "FeatureLayerStatistics.getHeatmapStatistics: unable to calculate field statistics.")
                }) : this._calcHeatmapStats(null, g, d, f)
            },
            _calcHeatmapStats: function(a, b, c, d) {
                var f = this;
                if (a) {
                    var g = a.min,
                        e =
                        a.max;
                    a.count ? g === e && 0 === g ? b = 1 : 0 >= e ? b = "abs" : 0 > g && (b = -1.01 * g) : b = 1
                }
                this._heatStatsFromMemory(c, b).then(function(c) {
                    c.fieldStatistics = a;
                    c.fieldOffset = b;
                    d.resolve(c)
                }).otherwise(function(a) {
                    f._rejectDfd(d, "FeatureLayerStatistics.getHeatmapStatistics: unable to calculate heatmap statistics.")
                })
            },
            _heatStatsFromMemory: function(a, b) {
                var c = new p,
                    d = this.layer,
                    f = d.graphics,
                    g = f.length,
                    e = d.getMap();
                if (!g) return c.resolve({
                    count: 0,
                    min: null,
                    max: null,
                    avg: null,
                    stddev: null,
                    source: this._srcMemory
                }), c.promise;
                (d = (d =
                    e && T(V(f, e, d), e.width, e.height, a.blurRadius || 10, a.field, b)) && d.matrix && U(d.matrix)) ? c.resolve({
                    count: g,
                    min: d.min,
                    max: d.max,
                    avg: d.mean,
                    stddev: d.stdDev,
                    source: this._srcMemory
                }): this._rejectDfd(c, "FeatureLayerStatistics.getHeatmapStatistics: unable to calculate heatmap statistics.");
                return c.promise
            },
            _getHistogram: function(a) {
                var b = this,
                    c = a.params,
                    d = c.minValue,
                    f = c.maxValue,
                    g = null != d && null != f,
                    e = this.layer.getField(c.field);
                this._rejectNonNumeric(a.dfd, e, "getHistogram") || (c.normalizationType || c.classificationMethod &&
                    "equal-interval" !== c.classificationMethod ? this._binParamsFromGenRend(c).then(function(e) {
                        g ? d > e.max || f < e.min ? b._rejectDfd(a.dfd, "FeatureLayerStatistics.getHistogram: custom value range is beyond field value range.") : (e = b._getFieldExpr(c, e.normTotal), e = b._getRangeExpr(e, d, f), b._binParamsFromGenRend(c, e).then(function(c) {
                                b._getBins(a, c.sqlExpr, c.min, c.max, c.intervals, c.source, c.normTotal, c.excludeZerosExpr)
                            }).otherwise(function(c) {
                                b._rejectDfd(a.dfd, "FeatureLayerStatistics.getHistogram: unable to calculate histogram parameters using custom min/max values.")
                            })) :
                            b._getBins(a, e.sqlExpr, e.min, e.max, e.intervals, e.source, e.normTotal, e.excludeZerosExpr)
                    }).otherwise(function(c) {
                        b._rejectDfd(a.dfd, "FeatureLayerStatistics.getHistogram: unable to calculate min/max from generate renderer operation.")
                    }) : g ? this._getBins(a, null, d, f, null, "parameters") : this.getFieldStatistics(c).then(function(c) {
                        c.count ? b._getBins(a, null, c.min, c.max, null, c.source) : b._rejectDfd(a.dfd, "FeatureLayerStatistics.getHistogram: cannot calculate histogram for 0 features (statistics.count \x3d 0).")
                    }).otherwise(function(c) {
                        b._rejectDfd(a.dfd,
                            "FeatureLayerStatistics.getHistogram: unable to calculate min/max.")
                    }))
            },
            _getBins: function(a, b, c, d, f, g, e, k) {
                var l = this,
                    h = a.params.field,
                    m = a.params.numBins || this.numBins,
                    n = (d - c) / m,
                    s, r = c,
                    p;
                if (!f) {
                    f = [];
                    for (s = 1; s <= m; s++) p = r + n, f.push([r, p]), r = p
                }
                b = b || h;
                this._isCollection() ? this._countBinsInMemory(a, c, d, f, e, g) : this._queryBins(b, f, k).then(function(b) {
                    b = q.map(b, function(a, b) {
                        return {
                            minValue: f[b][0],
                            maxValue: f[b][1],
                            count: a
                        }
                    });
                    a.dfd.resolve({
                        bins: b,
                        minValue: c,
                        maxValue: d,
                        normalizationTotal: e,
                        source: l._srcQuery,
                        statisticsSource: g
                    })
                }).otherwise(function(b) {
                    l._countBinsInMemory(a, c, d, f, e, g)
                })
            },
            _countBinsInMemory: function(a, b, c, d, f, g) {
                var e = this;
                this._binsFromMemory(a.params, b, c, d, f).then(function(d) {
                    a.dfd.resolve({
                        bins: d,
                        minValue: b,
                        maxValue: c,
                        normalizationTotal: f,
                        source: e._srcMemory,
                        statisticsSource: g
                    })
                }).otherwise(function(b) {
                    e._rejectDfd(a.dfd, "FeatureLayerStatistics: unable to calculate histogram.")
                })
            },
            _queryBins: function(a, b, c) {
                var d = this.layer,
                    f, g, e = [],
                    k = b.length;
                for (f = 0; f < k; f++) g = new t, g.where = (c ? c +
                    " AND " : "") + a + " \x3e\x3d " + b[f][0] + (null !== b[f][1] ? " AND " + a + (f === k - 1 ? " \x3c\x3d " : " \x3c ") + b[f][1] : ""), e.push(g);
                return I(q.map(e, function(a) {
                    return d.queryCount(a)
                }))
            },
            _binsFromMemory: function(a, b, c, d, f) {
                var g = new p,
                    e = a.field,
                    k = a.normalizationType;
                a = a.normalizationField;
                var l = this.layer.graphics,
                    h, m, n, s, r, q = [];
                if (!l.length) return this._rejectDfd(g, "Layer has 0 features in memory."), g.promise;
                s = d.length;
                for (n = 0; n < s; n++) q.push({
                    minValue: d[n][0],
                    maxValue: d[n][1],
                    count: 0
                });
                s = l.length;
                for (n = 0; n < s; n++) h =
                    (m = (h = l[n]) && h.attributes) && m[e], null != h && (k ? (r = null, m = m && parseFloat(m[a]), "log" === k && 0 != h ? r = Math.log(h) * this._log10e : "percent-of-total" === k && !isNaN(f) && 0 != f ? r = 100 * (h / f) : "field" === k && (!isNaN(m) && 0 != m) && (r = h / m)) : r = h, null != r && (!isNaN(r) && r >= b && r <= c) && (h = this._binIndex(d, r), -1 < h && q[h].count++));
                g.resolve(q);
                return g.promise
            },
            _binIndex: function(a, b) {
                var c, d, f = -1;
                for (c = a.length - 1; 0 <= c; c--)
                    if (d = a[c][0], b >= d) {
                        f = c;
                        break
                    }
                return f
            },
            _binParamsFromGenRend: function(a, b) {
                var c = this.layer,
                    d = new p,
                    f = this,
                    g = this._getGRWhereInfo(c,
                        a),
                    e = g.where,
                    k = a.numBins || this.numBins,
                    l = this._createCBDefn(a, k),
                    h = new z;
                h.classificationDefinition = l;
                h.where = e ? e + (b ? " AND " + b : "") : b;
                !this._isCollection() && 10.1 <= c.version ? this._grTask.execute(h).then(function(b) {
                    f._resolveBinParams(b, g, f._srcGenRend, a, d)
                }).otherwise(function(b) {
                    f._binParamsFromMemory(k, g, f._srcMemory, a, d)
                }) : f._binParamsFromMemory(k, g, f._srcMemory, a, d);
                return d.promise
            },
            _binParamsFromMemory: function(a, b, c, d, f) {
                var g = this;
                this._cbFromMemory(d, a).then(function(a) {
                    g._resolveBinParams(a,
                        b, c, d, f)
                }).otherwise(function(a) {
                    g._rejectDfd(f, "FeatureLayerStatistics.getHistogram: unable to calculate class breaks.")
                })
            },
            _resolveBinParams: function(a, b, c, d, f) {
                var g, e, k = [],
                    l = a.infos;
                e = l.length;
                g = l[0].minValue;
                e = l[e - 1].maxValue;
                q.forEach(l, function(a, b) {
                    k.push([a.minValue, a.maxValue])
                });
                f.resolve({
                    min: g,
                    max: e,
                    intervals: k,
                    sqlExpr: this._getFieldExpr(d, a.normalizationTotal),
                    excludeZerosExpr: b.excludeZerosExpr,
                    normTotal: a.normalizationTotal,
                    source: c
                })
            },
            _getGRWhereInfo: function(a, b) {
                var c = b.field,
                    d =
                    b.normalizationType,
                    f = b.normalizationField,
                    g = a.getDefinitionExpression(),
                    e;
                "log" === d ? e = "(NOT " + c + " \x3d 0)" : "field" === d && (e = "(NOT " + f + " \x3d 0)");
                return {
                    where: e ? e + (g ? " AND " + g : "") : g,
                    excludeZerosExpr: e
                }
            },
            _getFieldExpr: function(a, b) {
                var c = a.field,
                    d = a.normalizationType,
                    f = a.normalizationField,
                    g = c;
                "percent-of-total" === d ? g = "((" + c + " / " + b + ") * 100)" : "log" === d ? g = "(log(" + c + ") * " + this._log10e + ")" : "field" === d && (g = "(" + c + " / " + f + ")");
                return g
            },
            _getRangeExpr: function(a, b, c) {
                b = null != b ? a + " \x3e\x3d " + b : "";
                a = null !=
                    c ? a + " \x3c\x3d " + c : "";
                c = "";
                return (c = b && a ? b + " AND " + a : b || a) ? "(" + c + ")" : ""
            },
            _sampleFeatures: function(a) {
                var b = this,
                    c = a.params,
                    d = a.dfd,
                    f = this.layer,
                    g = f.graphics;
                a = this._sampleCache;
                var e = c && c.resample,
                    k = c && c.sampleSize || this.sampleSize;
                a && !e ? d.resolve(this._cloneSample(a)) : (d._time = {
                    start: this._getTime()
                }, g.length && k <= g.length ? this._resolveSample(d, this._pickItems(g, k), this._srcMemory) : (a = new t, a.where = "1\x3d1", d._time.countStart = this._getTime(), f.queryCount(a).then(function(a) {
                    d._time.countEnd = b._getTime();
                    d._totalFeatures = a;
                    k > f.maxRecordCount && (k = f.maxRecordCount);
                    var e;
                    if (a)
                        if (a <= k) e = new t, e.where = "1\x3d1", b._queryFeatures(e, c, f, g, d);
                        else if (a <= b.samplingThreshold) a = new t, a.where = "1\x3d1", d._time.idStart = b._getTime(), f.queryIds(a).then(function(a) {
                        d._time.idEnd = b._getTime();
                        var e = new t;
                        e.objectIds = b._pickItems(a, k);
                        b._queryFeatures(e, c, f, g, d)
                    }).otherwise(function(a) {
                        e = new t;
                        e.where = "1\x3d1";
                        b._queryFeatures(e, c, f, g, d)
                    });
                    else {
                        e = new t;
                        e.where = "1\x3d1";
                        if ((a = f.advancedQueryCapabilities) && a.supportsPagination) e.num =
                            k;
                        b._queryFeatures(e, c, f, g, d)
                    } else b._resolveSample(d, [], b._srcQuery)
                }).otherwise(function(a) {
                    b._resolveSample(d, b._pickItems(g, g.length), b._srcMemory)
                })))
            },
            _queryFeatures: function(a, b, c, d, f) {
                var g = this;
                a.outSpatialReference = b && b.spatialReference;
                a.maxAllowableOffset = b && b.maxAllowableOffset;
                a.outFields = b && b.outFields;
                f._time.featStart = this._getTime();
                c.queryFeatures(a).then(function(a) {
                    f._time.featEnd = g._getTime();
                    g._resolveSample(f, a && a.features || [], g._srcQuery)
                }).otherwise(function(a) {
                    g._resolveSample(f,
                        g._pickItems(d, d.length), g._srcMemory)
                })
            },
            _pickItems: function(a, b) {
                var c = a.length,
                    d = [],
                    f, g = [];
                if (b >= c) g = a.slice(0);
                else
                    for (; g.length < b;) f = this._getRandomInt(0, c), -1 === q.indexOf(d, f) && (d.push(f), g.push(a[f]));
                return g
            },
            _getRandomInt: function(a, b) {
                return Math.floor(Math.random() * (b - a)) + a
            },
            _resolveSample: function(a, b, c) {
                b = b || [];
                var d, f = b.length,
                    g;
                for (d = 0; d < f && !(g = (g = b[d].geometry) && g.spatialReference); d++);
                a._time.end = (new Date).getTime();
                d = a._time;
                a._time = null;
                this._sampleCache = {
                    features: b,
                    spatialReference: g &&
                        new x(g.toJson()),
                    source: c,
                    time: this._getTimeStats(d),
                    totalFeatures: a._totalFeatures
                };
                a.resolve(this._cloneSample(this._sampleCache))
            },
            _cloneSample: function(a) {
                return {
                    features: q.map(a.features, function(a) {
                        return new a.constructor(a.toJson())
                    }),
                    spatialReference: a.spatialReference && new x(a.spatialReference.toJson()),
                    source: a.source,
                    time: u.clone(a.time),
                    totalFeatures: a.totalFeatures
                }
            },
            _getTimeStats: function(a) {
                var b = this._getTimeDiff;
                return {
                    total: b(a.start, a.end),
                    features: b(a.featStart, a.featEnd),
                    featureIds: b(a.idStart,
                        a.idEnd),
                    featureCount: b(a.countStart, a.countEnd)
                }
            },
            _getTimeDiff: function(a, b) {
                var c, d;
                null != a && null != b && (c = b - a, d = "millisecond", 1E3 <= c && (c /= 1E3, d = "second", 60 <= c && (c /= 60, d = "minute")), c = {
                    value: Number(c.toFixed(2)),
                    unit: d
                });
                return c
            },
            _getTime: function() {
                return (new Date).getTime()
            },
            _scaleRange: function(a) {
                var b = this,
                    c = a.params,
                    d = this.layer,
                    f = this.layer.geometryType,
                    g = {
                        point: "esriGeometryPoint" === f,
                        mPoint: "esriGeometryMultipoint" === f,
                        line: "esriGeometryPolyline" === f,
                        polygon: "esriGeometryPolygon" === f
                    },
                    f =
                    c && c.sampleSize || this.sampleSize,
                    e = c && c.map || d.getMap(),
                    k = c && c.mapWidth || this.mapWidth,
                    l = c && c.mapHeight || this.mapHeight,
                    h = c && c.generalizeForScale || this.generalizeForScale,
                    m, n;
                e && e.__tileInfo ? (m = e.__tileInfo, n = e.spatialReference, e = e.extent.getWidth() / e.width / e.getScale() * h) : (m = this.tileInfo, n = m.spatialReference, e = this.generalizeForResolution / this.generalizeForScale * h);
                this.getSampleFeatures({
                    sampleSize: f,
                    spatialReference: n,
                    maxAllowableOffset: e,
                    outFields: []
                }).then(function(f) {
                    var e = b._projectExtent(d.fullExtent,
                            n),
                        h = f.features;
                    h && h.length ? b.getSpatialStatistics({
                        features: h
                    }).then(function(d) {
                        C(e).always(function(e) {
                            e = e && e.hasOwnProperty("xmin") ? e : null;
                            var h = b._getLODForMinScale(c, d, g, m),
                                n = g.polygon ? b._getLODForMaxScale(c, d, g, m) : null;
                            b._processScaleRange(a.dfd, h, n, m, k, l, e, f, d, g)
                        })
                    }).otherwise(function(c) {
                        b._rejectDfd(a.dfd, "FeatureLayerStatistics.getSuggestedScaleRange: unable to calculate spatial statistics.")
                    }) : b._rejectDfd(a.dfd, "FeatureLayerStatistics.getSuggestedScaleRange: sampling returned 0 features.")
                }).otherwise(function(c) {
                    b._rejectDfd(a.dfd,
                        "FeatureLayerStatistics.getSuggestedScaleRange: unable to sample features.")
                })
            },
            _processScaleRange: function(a, b, c, d, f, g, e, k, l, h) {
                var m = l.avgXY,
                    n = m && new R(m.x, m.y, k.spatialReference && new x(k.spatialReference.toJson())),
                    s = this,
                    r, p = h.polygon ? c ? Math.floor(c.scale) : null : 0;
                d = d.lods;
                var q;
                b && (e && n) && (q = this._findClosestLOD(d, b, e, n, f, g));
                r = (b = q || b) ? Math.ceil(b.scale) : null;
                b || c ? b && n ? this._countAtView(n, b, f, g).then(function(b) {
                    var c;
                    b || (b = k.features[0], c = h.point ? b.geometry : (b = b.geometry && b.geometry.getExtent()) &&
                        b.getCenter());
                    s._resolveScaleRange(a, r, p, c || n, k, l)
                }).otherwise(function(b) {
                    s._resolveScaleRange(a, r, p, n, k, l)
                }) : this._resolveScaleRange(a, r, p, n, k, l) : this._rejectDfd(a, "FeatureLayerStatistics.getSuggestedScaleRange: unable to find optimal scale range.")
            },
            _resolveScaleRange: function(a, b, c, d, f, g) {
                b < c ? this._rejectDfd(a, "FeatureLayerStatistics.getSuggestedScaleRange: invalid scale range - calculated minScale is less than maxScale.") : a.resolve({
                    minScale: b,
                    maxScale: c,
                    center: d,
                    sampleInfo: f,
                    spatialStatistics: g
                })
            },
            _countAtView: function(a, b, c, d) {
                a = this._getExtentFromCenter(a, b, c, d);
                b = new t;
                b.geometry = a;
                return this.layer.queryCount(b).promise
            },
            _projectExtent: function(a, b) {
                if (a.spatialReference.equals(b)) return new a.constructor(a.toJson());
                if (G.canProject(a.spatialReference, b)) return G.project(a, b);
                var c = new O;
                c.geometries = [a];
                c.outSR = b;
                return this._gsTask.project(c).then(function(a) {
                    return a && a[0]
                })
            },
            _getLODForMinScale: function(a, b, c, d) {
                var f = a && a.minDistance || this.minDistance,
                    g = a && a.minLength || this.minLength;
                a = a && a.minSize || this.minSize;
                var e, k, l;
                c.point ? (e = b.avgMinDistance, l = f) : c.mPoint ? (e = b.avgMinDistance, l = f) : c.line ? (e = b.avgLength, l = g) : c.polygon && (e = b.avgSize, l = a);
                0 < e && (k = this._findLOD(d, e, l));
                return k
            },
            _getLODForMaxScale: function(a, b, c, d) {
                var f = this.mapWidth,
                    g = a && a.maxDistance || f / 4,
                    e = a && a.maxLength || f / 4;
                a = a && a.maxSize || f / 2;
                var k, l, h;
                c.point ? (k = b.minDistance, h = g) : c.mPoint ? (k = b.minDistance, h = g) : c.line ? (k = b.minLength, h = e) : c.polygon && (k = b.minSize, h = a);
                0 < k && (l = this._findLOD(d, k, null, h));
                return l
            },
            _findLOD: function(a,
                b, c, d) {
                a = a && a.lods;
                var f, g, e, k;
                if (a && a.length) {
                    var l = null != d,
                        h = l ? 0 : a.length - 1,
                        m = l ? -1 : 1;
                    for (e = l ? a.length - 1 : 0; l ? e >= h : e <= h; e += m)
                        if (g = a[e], k = Math.round(b / g.resolution), l) {
                            if (k <= d) {
                                f = g;
                                break
                            }
                        } else if (k >= c) {
                        f = g;
                        break
                    }
                }
                return f
            },
            _getExtentFromCenter: function(a, b, c, d) {
                c = c / 2 * b.resolution;
                b = d / 2 * b.resolution;
                return new S(a.x - c, a.y - b, a.x + c, a.y + b, new x(a.spatialReference.toJson()))
            },
            _findClosestLOD: function(a, b, c, d, f, g) {
                var e, k = a.length,
                    l, h;
                for (e = 0; e < k; e++)
                    if (!(a[e].level < b.level))
                        if (l = this._getExtentFromCenter(d,
                                a[e], f, g), l.contains(c)) {
                            if (e === k - 1) {
                                h = a[e];
                                break
                            }
                        } else {
                            h = a[e - 1];
                            break
                        }
                return h = h && h.level > b.level ? h : null
            },
            _findUniqueValues: function(a) {
                var b = this,
                    c = a.params,
                    d = this.layer.getField(c.field);
                d ? this._isCollection() ? this._uvFromMemory(c).then(function(c) {
                    b._resolveUVDfd(c, a, d, b._srcMemory)
                }).otherwise(function(c) {
                    b._rejectDfd(a.dfd, "FeatureLayerStatistics: unable to calculate unique values.")
                }) : this._uvFromStatisticsQuery(c).then(function(c) {
                    b._resolveUVDfd(c, a, d, b._srcQuery)
                }).otherwise(function(f) {
                    b._uvFromGenRenderer(c,
                        d).then(function(c) {
                        b._resolveUVDfd(c, a, d, b._srcGenRend)
                    }).otherwise(function(f) {
                        b._uvFromMemory(c).then(function(c) {
                            b._resolveUVDfd(c, a, d, b._srcMemory)
                        }).otherwise(function(c) {
                            b._rejectDfd(a.dfd, "FeatureLayerStatistics: unable to calculate unique values.")
                        })
                    })
                }) : this._rejectDfd(a.dfd, "FeatureLayerStatistics.getUniqueValues: unknown 'field'.")
            },
            _uvFromStatisticsQuery: function(a) {
                var b = this.layer,
                    c = new p;
                if (b.supportsStatistics) {
                    var d = "countOF" + a.field,
                        f = this,
                        g = new D;
                    g.statisticType = "count";
                    g.onStatisticField =
                        a.field;
                    g.outStatisticFieldName = d;
                    var e = new t;
                    e.outStatistics = [g];
                    e.groupByFieldsForStatistics = [a.field];
                    b.queryFeatures(e).then(function(g) {
                        var l, h, m = {},
                            n, p;
                        q.forEach(g.features, function(b) {
                            l = b.attributes;
                            h = this._getAttributeVal(l, a.field);
                            n = this._getAttributeVal(l, d);
                            null === h && 0 === n && (p = !0);
                            if (null == h || "" === h || "string" === typeof h && "" === u.trim(h)) h = null;
                            null == m[h] ? m[h] = {
                                count: n,
                                data: h
                            } : m[h].count += n
                        }, f);
                        p ? (e = new t, e.where = a.field + " is NULL", b.queryCount(e).then(function(a) {
                            m["null"].count += a || 0;
                            c.resolve({
                                count: m
                            })
                        }).otherwise(function(a) {
                            c.resolve({
                                count: m
                            })
                        })) : c.resolve({
                            count: m
                        })
                    }).otherwise(function(a) {
                        f._rejectDfd(c, "FeatureLayerStatistics: Statistics query operation failed.")
                    })
                } else this._rejectDfd(c, "FeatureLayerStatistics: Statistics query requires a layer that supports statistics.");
                return c.promise
            },
            _uvFromGenRenderer: function(a, b) {
                var c = this.layer,
                    d = new p,
                    f = this;
                if (10.1 <= c.version) {
                    var g = new K;
                    g.attributeField = a.field;
                    var e = new z;
                    e.classificationDefinition = g;
                    e.where = c.getDefinitionExpression();
                    this._grTask.execute(e).then(function(a) {
                        var c = {},
                            e, g = -1 < q.indexOf(f._numericTypes, b.type);
                        q.forEach(a.infos, function(a) {
                            e = a.value;
                            if (null == e || "" === e || "string" === typeof e && ("" === u.trim(e) || "\x3cnull\x3e" === e.toLowerCase())) e = null;
                            null == c[e] ? c[e] = {
                                count: a.count,
                                data: g && e ? Number(e) : e
                            } : c[e].count += a.count
                        });
                        d.resolve({
                            count: c
                        })
                    }).otherwise(function(a) {
                        f._rejectDfd(d, "FeatureLayerStatistics: Generate renderer operation failed.")
                    })
                } else this._rejectDfd(d, "FeatureLayerStatistics: Generate renderer operation requires server version 10.1 or later.");
                return d.promise
            },
            _uvFromMemory: function(a) {
                var b = this.layer,
                    c = new p,
                    d = a.field,
                    f, g, e = {};
                q.forEach(b.graphics, function(a) {
                    g = (f = a.attributes) && f[d];
                    if (null == g || "" === g || "string" === typeof g && "" === u.trim(g)) g = null;
                    null == e[g] ? e[g] = {
                        count: 1,
                        data: g
                    } : e[g].count++
                });
                c.resolve({
                    count: e
                });
                return c.promise
            },
            _resolveUVDfd: function(a, b, c, d) {
                var f = a.count;
                c = this.layer.getDomain(c.name);
                var g;
                a = [];
                b.params.includeAllCodedValues && (c && "codedValue" === c.type) && q.forEach(c.codedValues, function(a) {
                    a = a.code;
                    f.hasOwnProperty(a) ||
                        (f[a] = {
                            data: a,
                            count: 0
                        })
                });
                for (g in f) c = f[g], a.push({
                    value: c.data,
                    count: c.count
                });
                b.dfd.resolve({
                    source: d,
                    uniqueValueInfos: a
                })
            },
            _findClassBreaks: function(a) {
                var b = this,
                    c = a.params,
                    d = c.minValue,
                    f = c.maxValue,
                    g = null != d || null != f,
                    e = c.classificationMethod,
                    k = "percent-of-total" === c.normalizationType,
                    l = c.numClasses || this.numClasses,
                    h = !1 !== c.analyzeData,
                    m = this.layer.getField(c.field);
                if (!this._rejectNonNumeric(a.dfd, m, "getClassBreaks")) {
                    if (g)
                        if (h) {
                            if (k && null == c.normalizationTotal) {
                                this._rejectDfd(a.dfd, "FeatureLayerStatistics.getClassBreaks: normalizationTotal is required when minValue/maxValue are specified.");
                                return
                            }
                        } else {
                            if (null == d || null == f) {
                                this._rejectDfd(a.dfd, "FeatureLayerStatistics.getClassBreaks: both minValue AND maxValue are required when data analysis is disabled.");
                                return
                            }
                            if (e && "equal-interval" !== e) {
                                this._rejectDfd(a.dfd, "FeatureLayerStatistics.getClassBreaks: data analysis can be disabled only for equal-interval classification.");
                                return
                            }
                            if (k && null == c.normalizationTotal) {
                                this._rejectDfd(a.dfd, "FeatureLayerStatistics.getClassBreaks: normalizationTotal is required when data analysis is disabled.");
                                return
                            }
                        } else if (!h) {
                        this._rejectDfd(a.dfd, "FeatureLayerStatistics.getClassBreaks: both minValue AND maxValue are required when data analysis is disabled.");
                        return
                    }
                    h ? this._cbFromGenRend(c, l).then(function(d) {
                        b._resolveCBDfd(a.dfd, c, d, b._srcGenRend)
                    }).otherwise(function(d) {
                        g ? b._rejectDfd(a.dfd, "FeatureLayerStatistics.getClassBreaks: cannot calculate class breaks in-memory when minValue/maxValue are specified.") : b._cbFromMemory(c, l).then(function(d) {
                            b._resolveCBDfd(a.dfd, c, d, b._srcMemory)
                        }).otherwise(function(c) {
                            b._rejectDfd(a.dfd,
                                "FeatureLayerStatistics: unable to calculate class breaks.")
                        })
                    }) : this._cbFromInterpolation(c, l).then(function(d) {
                        b._resolveCBDfd(a.dfd, c, d, b._srcMemory)
                    }).otherwise(function(c) {
                        b._rejectDfd(a.dfd, "FeatureLayerStatistics: unable to calculate class breaks.")
                    })
                }
            },
            _cbFromGenRend: function(a, b) {
                var c = this.layer,
                    d = new p,
                    f = this;
                if (c.url && 10.1 <= c.version) {
                    var g = this._createCBDefn(a, b),
                        c = this._getGRWhereInfo(c, a).where,
                        e = this._getFieldExpr(a, a.normalizationTotal),
                        e = this._getRangeExpr(e, a.minValue, a.maxValue),
                        k = new z;
                    k.classificationDefinition = g;
                    k.where = c ? c + (e ? " AND " + e : "") : e;
                    this._grTask.execute(k).then(function(a) {
                        d.resolve(a)
                    }).otherwise(function(a) {
                        f._rejectDfd(d, "FeatureLayerStatistics: Generate renderer operation failed.")
                    })
                } else this._rejectDfd(d, "FeatureLayerStatistics: Generate renderer operation requires server version 10.1 or later.");
                return d.promise
            },
            _cbFromMemory: function(a, b) {
                var c = new p,
                    d = this.layer.graphics;
                if (d.length) {
                    var f = this._createCBDefn(a, b),
                        g;
                    if ("percent-of-total" === a.normalizationType) {
                        g =
                            this._calcStatsFromMemory({
                                field: a.field
                            }).sum;
                        if (null == g) return this._rejectDfd(c, "FeatureLayerStatistics: Invalid normalizationTotal."), c.promise;
                        a = u.mixin({
                            normalizationTotal: g
                        }, a)
                    }
                    c.resolve(M.createClassBreaksRenderer({
                        features: d,
                        definition: f,
                        values: this._getDataValues(d, a)
                    }))
                } else this._rejectDfd(c, "Layer has 0 features in memory.");
                return c.promise
            },
            _cbFromInterpolation: function(a, b) {
                var c = new p,
                    d = a.minValue,
                    f = a.maxValue;
                if (d >= f || !b || 1 > b) this._rejectDfd(c, "FeatureLayerStatistics.getClassBreaks: invalid input parameters: minValue, maxValue or numClasses.");
                else {
                    var g = [],
                        e, k, l = (f - d) / b;
                    for (e = 0; e < b; e++) k = d + e * l, g.push({
                        minValue: k,
                        maxValue: k + l
                    });
                    g[b - 1].maxValue = f;
                    c.resolve({
                        infos: g,
                        normalizationTotal: a.normalizationTotal
                    })
                }
                return c.promise
            },
            _createCBDefn: function(a, b) {
                var c = a.field,
                    d = a.classificationMethod || this.classificationMethod,
                    f = a.normalizationType,
                    g = a.normalizationField,
                    e = new L;
                e.classificationField = c;
                e.breakCount = b;
                e.classificationMethod = d;
                e.standardDeviationInterval = "standard-deviation" === d ? a.standardDeviationInterval || this.standardDeviationInterval :
                    void 0;
                e.normalizationType = f;
                e.normalizationField = "field" === f ? g : void 0;
                return e
            },
            _resolveCBDfd: function(a, b, c, d) {
                var f = c.infos,
                    g = f[0].minValue,
                    e = f[f.length - 1].maxValue,
                    k = "standard-deviation" === b.classificationMethod,
                    l = this._reNumber,
                    h, m, n, f = q.map(f, function(a) {
                        n = a.label;
                        m = {
                            minValue: a.minValue,
                            maxValue: a.maxValue,
                            label: n
                        };
                        k && n && (h = n.match(l), h = q.map(h, function(a) {
                            return +u.trim(a)
                        }), 2 === h.length ? (m.minStdDev = h[0], m.maxStdDev = h[1], 0 > h[0] && 0 < h[1] && (m.hasAvg = !0)) : 1 === h.length && (-1 < n.indexOf("\x3c") ? (m.minStdDev =
                            null, m.maxStdDev = h[0]) : -1 < n.indexOf("\x3e") && (m.minStdDev = h[0], m.maxStdDev = null)));
                        return m
                    });
                a.resolve({
                    minValue: g,
                    maxValue: e,
                    classBreakInfos: f,
                    normalizationTotal: c.normalizationTotal,
                    source: d
                })
            },
            _rejectDfd: function(a, b) {
                a.reject(Error(b))
            },
            _rejectNonNumeric: function(a, b, c) {
                var d;
                if (b) {
                    if (b.name === this.layer.objectIdField || -1 === q.indexOf(this._numericTypes, b.type)) this._rejectDfd(a, "FeatureLayerStatistics." + c + ": 'field' should be numeric."), d = !0
                } else this._rejectDfd(a, "FeatureLayerStatistics." + c +
                    ": unknown 'field'."), d = !0;
                return d
            },
            _getAttributeVal: function(a, b) {
                var c, d;
                b = b.toLowerCase();
                if (a)
                    for (d in a)
                        if (d.toLowerCase() === b) {
                            c = a[d];
                            break
                        }
                return c
            },
            _callAfterLoad: function(a, b) {
                if (this.layer.loaded) a.call(this, b);
                else B.once(this.layer, "load", u.hitch(this, a, b))
            },
            _numericTypes: ["esriFieldTypeInteger", "esriFieldTypeSmallInteger", "esriFieldTypeSingle", "esriFieldTypeDouble"],
            _createGRTask: function() {
                this._grTask = new J(this.layer, {
                    source: this.layer.source,
                    gdbVersion: this.layer.gdbVersion
                })
            }
        });
    u.mixin(A, {
        add: function(a, b) {
            if (!a.statisticsPlugin) {
                var c = b || {};
                c.layer = a;
                a.statisticsPlugin = new A(c)
            }
        },
        remove: function(a) {
            a.statisticsPlugin && (a.statisticsPlugin.destroy(), delete a.statisticsPlugin)
        }
    });
    return A
});