//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/json", "dojo/_base/Deferred", "dojo/has", "../kernel", "../request", "../deferredUtils", "./Task", "../geometry/Extent", "../geometry/Polyline", "../geometry/Polygon", "../geometry/Multipoint", "../geometry/jsonUtils"], function(u, l, s, k, n, A, B, p, q, y, w, x, v, z, r) {
    u = u(y, {
        declaredClass: "esri.tasks.GeometryService",
        _eventMap: {
            "areas-and-lengths-complete": ["result"],
            "auto-complete-complete": ["geometries"],
            "buffer-complete": ["geometries"],
            "convex-hull-complete": ["geometry"],
            "cut-complete": ["result"],
            "densify-complete": ["geometries"],
            "difference-complete": ["geometries"],
            "distance-complete": ["distance"],
            "generalize-complete": ["geometries"],
            "intersect-complete": ["geometries"],
            "label-points-complete": ["geometries"],
            "lengths-complete": ["result"],
            "offset-complete": ["geometries"],
            "project-complete": ["geometries"],
            "relation-complete": ["relations"],
            "reshape-complete": ["geometry"],
            "simplify-complete": ["geometries"],
            "trim-extend-complete": ["geometries"],
            "union-complete": ["geometry"]
        },
        constructor: function(a) {
            a = l.hitch;
            this._projectHandler = a(this, this._projectHandler);
            this._simplifyHandler = a(this, this._simplifyHandler);
            this._bufferHandler = a(this, this._bufferHandler);
            this._areasAndLengthsHandler = a(this, this._areasAndLengthsHandler);
            this._lengthsHandler = a(this, this._lengthsHandler);
            this._labelPointsHandler = a(this, this._labelPointsHandler);
            this._relationHandler = a(this, this._relationHandler);
            this._convexHullHandler = a(this, this._convexHullHandler);
            this._unionHandler = a(this, this._unionHandler);
            this._autoCompleteHandler = a(this, this._autoCompleteHandler);
            this._reshapeHandler = a(this, this._reshapeHandler);
            this._cutHandler = a(this, this._cutHandler);
            this._intersectHandler = a(this, this._intersectHandler);
            this._differenceHandler = a(this, this._differenceHandler);
            this._trimExtendHandler = a(this, this._trimExtendHandler);
            this._densifyHandler = a(this, this._densifyHandler);
            this._generalizeHandler = a(this, this._densifyHandler);
            this._offsetHandler = a(this, this._offsetHandler);
            this._distanceHandler = a(this, this._distanceHandler);
            this._toGeoCoordinateHandler = a(this, this._toGeoCoordinateHandler);
            this._fromGeoCoordinateHandler = a(this, this._fromGeoCoordinateHandler);
            this.registerConnectEvents()
        },
        _encodeGeometries: function(a) {
            var h = [],
                e, b = a.length;
            for (e = 0; e < b; e++) h.push(a[e].toJson());
            return {
                geometryType: r.getJsonType(a[0]),
                geometries: h
            }
        },
        _decodeGeometries: function(a, h, e) {
            var b = r.getGeometryType(h);
            a = a.geometries;
            var f = [],
                c = {
                    spatialReference: e.toJson()
                },
                g = l.mixin;
            s.forEach(a, function(a, e) {
                f[e] = new b(g(a, c))
            });
            return f
        },
        _toProjectGeometry: function(a) {
            var h =
                a.spatialReference.toJson();
            return a instanceof w ? new v({
                rings: [
                    [
                        [a.xmin, a.ymin],
                        [a.xmin, a.ymax],
                        [a.xmax, a.ymax],
                        [a.xmax, a.ymin],
                        [a.xmin, a.ymin]
                    ]
                ],
                spatialReference: h
            }) : new x({
                paths: [
                    [].concat(a.points)
                ],
                spatialReference: h
            })
        },
        _fromProjectedGeometry: function(a, h, e) {
            return "esriGeometryEnvelope" === h ? (a = a.rings[0], new w(a[0][0], a[0][1], a[2][0], a[2][1], e)) : new z({
                points: a.paths[0],
                spatialReference: e.toJson()
            })
        },
        project: function(a, h, e, b) {
            var f = l.mixin({}, this._url.query, {
                    f: "json"
                }),
                c;
            a.geometries ? (b = e, e =
                h, h = a.outSR, c = a.geometries[0], f = l.mixin(f, a.toJson())) : (c = a[0], f = l.mixin(f, {
                outSR: h.wkid || k.toJson(h.toJson()),
                inSR: c.spatialReference.wkid || k.toJson(c.spatialReference.toJson()),
                geometries: k.toJson(this._encodeGeometries(a))
            }));
            var g = r.getJsonType(c),
                d = this._projectHandler,
                m = this._errorHandler,
                t = new n(q._dfdCanceller);
            t._pendingDfd = p({
                url: this._url.path + "/project",
                content: f,
                callbackParamName: "callback",
                load: function(a, c) {
                    d(a, c, g, h, e, b, t)
                },
                error: function(a) {
                    m(a, b, t)
                }
            });
            return t
        },
        _projectHandler: function(a,
            h, e, b, f, c, g) {
            try {
                var d = this._decodeGeometries(a, e, b);
                this._successHandler([d], "onProjectComplete", f, g)
            } catch (m) {
                this._errorHandler(m, c, g)
            }
        },
        onProjectComplete: function() {},
        simplify: function(a, h, e) {
            var b = a[0].spatialReference,
                f = l.mixin({}, this._url.query, {
                    f: "json",
                    sr: b.wkid ? b.wkid : k.toJson(b.toJson()),
                    geometries: k.toJson(this._encodeGeometries(a))
                }),
                c = r.getJsonType(a[0]),
                g = this._simplifyHandler,
                d = this._errorHandler,
                m = new n(q._dfdCanceller);
            m._pendingDfd = p({
                url: this._url.path + "/simplify",
                content: f,
                callbackParamName: "callback",
                load: function(a, d) {
                    g(a, d, c, b, h, e, m)
                },
                error: function(a) {
                    d(a, e, m)
                }
            });
            return m
        },
        _simplifyHandler: function(a, h, e, b, f, c, g) {
            try {
                var d = this._decodeGeometries(a, e, b);
                this._successHandler([d], "onSimplifyComplete", f, g)
            } catch (m) {
                this._errorHandler(m, c, g)
            }
        },
        onSimplifyComplete: function() {},
        convexHull: function(a, h, e) {
            var b = a[0].spatialReference;
            a = l.mixin({}, this._url.query, {
                f: "json",
                sr: k.toJson(b.toJson()),
                geometries: k.toJson(this._encodeGeometries(a))
            });
            var f = this._convexHullHandler,
                c = this._errorHandler,
                g = new n(q._dfdCanceller);
            g._pendingDfd = p({
                url: this._url.path + "/convexHull",
                content: a,
                callbackParamName: "callback",
                load: function(a, c) {
                    f(a, c, b, h, e, g)
                },
                error: function(a) {
                    c(a, e, g)
                }
            });
            return g
        },
        _convexHullHandler: function(a, h, e, b, f, c) {
            try {
                var g = r.fromJson(a.geometry).setSpatialReference(e);
                this._successHandler([g], "onConvexHullComplete", b, c)
            } catch (d) {
                this._errorHandler(d, f, c)
            }
        },
        onConvexHullComplete: function() {},
        union: function(a, h, e) {
            var b = a[0].spatialReference;
            a = l.mixin({}, this._url.query, {
                f: "json",
                sr: k.toJson(b.toJson()),
                geometries: k.toJson(this._encodeGeometries(a))
            });
            var f = this._unionHandler,
                c = this._errorHandler,
                g = new n(q._dfdCanceller);
            g._pendingDfd = p({
                url: this._url.path + "/union",
                content: a,
                callbackParamName: "callback",
                load: function(a, c) {
                    f(a, c, b, h, e, g)
                },
                error: function(a) {
                    c(a, e, g)
                }
            });
            return g
        },
        _unionHandler: function(a, h, e, b, f, c) {
            try {
                var g = r.fromJson(a.geometry).setSpatialReference(e);
                this._successHandler([g], "onUnionComplete", b, c)
            } catch (d) {
                this._errorHandler(d, f, c)
            }
        },
        onUnionComplete: function() {},
        autoComplete: function(a, h, e, b) {
            var f = a[0].spatialReference;
            a = l.mixin({},
                this._url.query, {
                    f: "json",
                    sr: k.toJson(f.toJson()),
                    polygons: k.toJson(this._encodeGeometries(a).geometries),
                    polylines: k.toJson(this._encodeGeometries(h).geometries)
                });
            var c = this._autoCompleteHandler,
                g = this._errorHandler,
                d = new n(q._dfdCanceller);
            d._pendingDfd = p({
                url: this._url.path + "/autoComplete",
                content: a,
                callbackParamName: "callback",
                load: function(a, g) {
                    c(a, g, f, e, b, d)
                },
                error: function(a) {
                    g(a, b, d)
                }
            });
            return d
        },
        _autoCompleteHandler: function(a, h, e, b, f, c) {
            try {
                var g = a.geometries;
                a = [];
                var d, m = g.length;
                for (d =
                    0; d < m; d++) a[d] = new v({
                    spatialReference: e,
                    rings: g[d].rings
                });
                this._successHandler([a], "onAutoCompleteComplete", b, c)
            } catch (t) {
                this._errorHandler(t, f, c)
            }
        },
        onAutoCompleteComplete: function() {},
        reshape: function(a, h, e, b) {
            var f = a.spatialReference;
            a = l.mixin({}, this._url.query, {
                f: "json",
                sr: k.toJson(f.toJson()),
                target: k.toJson({
                    geometryType: r.getJsonType(a),
                    geometry: a.toJson()
                }),
                reshaper: k.toJson(h.toJson())
            });
            var c = this._reshapeHandler,
                g = this._errorHandler,
                d = new n(q._dfdCanceller);
            d._pendingDfd = p({
                url: this._url.path +
                    "/reshape",
                content: a,
                callbackParamName: "callback",
                load: function(a, g) {
                    c(a, g, f, e, b, d)
                },
                error: function(a) {
                    g(a, b, d)
                }
            });
            return d
        },
        _reshapeHandler: function(a, h, e, b, f, c) {
            try {
                var g = r.fromJson(a.geometry).setSpatialReference(e);
                this._successHandler([g], "onReshapeComplete", b, c)
            } catch (d) {
                this._errorHandler(d, f, c)
            }
        },
        onReshapeComplete: function() {},
        cut: function(a, h, e, b) {
            var f = a[0].spatialReference,
                c = s.map(a, function(a) {
                    return a.toJson()
                });
            a = l.mixin({}, this._url.query, {
                f: "json",
                sr: k.toJson(f.toJson()),
                target: k.toJson({
                    geometryType: r.getJsonType(a[0]),
                    geometries: c
                }),
                cutter: k.toJson(h.toJson())
            });
            var g = this._cutHandler,
                d = this._errorHandler,
                m = new n(q._dfdCanceller);
            m._pendingDfd = p({
                url: this._url.path + "/cut",
                content: a,
                callbackParamName: "callback",
                load: function(a, d) {
                    g(a, d, f, e, b, m)
                },
                error: function(a) {
                    d(a, b, m)
                }
            });
            return m
        },
        _cutHandler: function(a, h, e, b, f, c) {
            try {
                var g = a.geometries,
                    d = {};
                d.cutIndexes = a.cutIndexes;
                d.geometries = [];
                s.forEach(g, function(a) {
                    d.geometries.push(r.fromJson(a).setSpatialReference(e))
                });
                this._successHandler([d], "onCutComplete", b, c)
            } catch (m) {
                this._errorHandler(m,
                    f, c)
            }
        },
        onCutComplete: function() {},
        intersect: function(a, h, e, b) {
            var f = a[0].spatialReference;
            a = l.mixin({}, this._url.query, {
                f: "json",
                sr: k.toJson(f.toJson()),
                geometries: k.toJson(this._encodeGeometries(a)),
                geometry: k.toJson({
                    geometryType: r.getJsonType(h),
                    geometry: h.toJson()
                })
            });
            var c = this._intersectHandler,
                g = this._errorHandler,
                d = new n(q._dfdCanceller);
            d._pendingDfd = p({
                url: this._url.path + "/intersect",
                content: a,
                callbackParamName: "callback",
                load: function(a, g) {
                    c(a, g, f, e, b, d)
                },
                error: function(a) {
                    g(a, b, d)
                }
            });
            return d
        },
        _intersectHandler: function(a, h, e, b, f, c) {
            try {
                var g = [];
                s.forEach(a.geometries, function(a) {
                    g.push(r.fromJson(a).setSpatialReference(e))
                });
                this._successHandler([g], "onIntersectComplete", b, c)
            } catch (d) {
                this._errorHandler(d, f, c)
            }
        },
        onIntersectComplete: function() {},
        difference: function(a, h, e, b) {
            var f = a[0].spatialReference;
            a = l.mixin({}, this._url.query, {
                f: "json",
                sr: k.toJson(f.toJson()),
                geometries: k.toJson(this._encodeGeometries(a)),
                geometry: k.toJson({
                    geometryType: r.getJsonType(h),
                    geometry: h.toJson()
                })
            });
            var c = this._differenceHandler,
                g = this._errorHandler,
                d = new n(q._dfdCanceller);
            d._pendingDfd = p({
                url: this._url.path + "/difference",
                content: a,
                callbackParamName: "callback",
                load: function(a, g) {
                    c(a, g, f, e, b, d)
                },
                error: function(a) {
                    g(a, b, d)
                }
            });
            return d
        },
        _differenceHandler: function(a, h, e, b, f, c) {
            try {
                var g = [];
                s.forEach(a.geometries, function(a) {
                    g.push(r.fromJson(a).setSpatialReference(e))
                });
                this._successHandler([g], "onDifferenceComplete", b, c)
            } catch (d) {
                this._errorHandler(d, f, c)
            }
        },
        onDifferenceComplete: function() {},
        buffer: function(a,
            h, e) {
            var b = l.mixin({}, this._url.query, {
                    f: "json"
                }, a.toJson()),
                f = a.outSpatialReference || a.geometries[0].spatialReference,
                c = this._bufferHandler,
                g = this._errorHandler,
                d = new n(q._dfdCanceller);
            d._pendingDfd = p({
                url: this._url.path + "/buffer",
                content: b,
                callbackParamName: "callback",
                load: function(a, b) {
                    c(a, b, f, h, e, d)
                },
                error: function(a) {
                    g(a, e, d)
                }
            });
            return d
        },
        _bufferHandler: function(a, h, e, b, f, c) {
            try {
                var g = a.geometries;
                a = [];
                var d, m = g.length;
                for (d = 0; d < m; d++) a[d] = new v({
                    spatialReference: e,
                    rings: g[d].rings
                });
                this._successHandler([a],
                    "onBufferComplete", b, c)
            } catch (k) {
                this._errorHandler(k, f, c)
            }
        },
        onBufferComplete: function() {},
        areasAndLengths: function(a, h, e) {
            a = l.mixin({}, this._url.query, {
                f: "json"
            }, a.toJson());
            var b = this._areasAndLengthsHandler,
                f = this._errorHandler,
                c = new n(q._dfdCanceller);
            c._pendingDfd = p({
                url: this._url.path + "/areasAndLengths",
                content: a,
                callbackParamName: "callback",
                load: function(a, d) {
                    b(a, d, h, e, c)
                },
                error: function(a) {
                    f(a, e, c)
                }
            });
            return c
        },
        _areasAndLengthsHandler: function(a, h, e, b, f) {
            try {
                this._successHandler([a], "onAreasAndLengthsComplete",
                    e, f)
            } catch (c) {
                this._errorHandler(c, b, f)
            }
        },
        onAreasAndLengthsComplete: function() {},
        lengths: function(a, h, e) {
            a = l.mixin({}, this._url.query, {
                f: "json"
            }, a.toJson());
            var b = this._lengthsHandler,
                f = this._errorHandler,
                c = new n(q._dfdCanceller);
            c._pendingDfd = p({
                url: this._url.path + "/lengths",
                content: a,
                callbackParamName: "callback",
                load: function(a, d) {
                    b(a, d, h, e, c)
                },
                error: function(a) {
                    f(a, e, c)
                }
            });
            return c
        },
        _lengthsHandler: function(a, h, e, b, f) {
            try {
                this._successHandler([a], "onLengthsComplete", e, f)
            } catch (c) {
                this._errorHandler(c,
                    b, f)
            }
        },
        onLengthsComplete: function() {},
        labelPoints: function(a, h, e) {
            var b = s.map(a, function(a) {
                    return a.toJson()
                }),
                f = a[0].spatialReference,
                b = l.mixin({}, this._url.query, {
                    f: "json",
                    sr: f.wkid ? f.wkid : k.toJson(f.toJson()),
                    polygons: k.toJson(b)
                }),
                c = this._labelPointsHandler,
                g = this._errorHandler,
                d = new n(q._dfdCanceller);
            d._pendingDfd = p({
                url: this._url.path + "/labelPoints",
                content: b,
                callbackParamName: "callback",
                load: function(b, g) {
                    c(b, g, a, f, h, e, d)
                },
                error: function(a) {
                    g(a, e, d)
                }
            });
            return d
        },
        _labelPointsHandler: function(a,
            h, e, b, f, c, g) {
            try {
                var d = [];
                s.forEach(a.labelPoints, function(a) {
                    d.push(r.fromJson(a).setSpatialReference(b))
                });
                this._successHandler([d], "onLabelPointsComplete", f, g)
            } catch (m) {
                this._errorHandler(m, c, g)
            }
        },
        onLabelPointsComplete: function() {},
        relation: function(a, h, e) {
            a = l.mixin({}, this._url.query, {
                f: "json"
            }, a.toJson());
            var b = this._relationHandler,
                f = this._errorHandler,
                c = new n(q._dfdCanceller);
            c._pendingDfd = p({
                url: this._url.path + "/relation",
                content: a,
                callbackParamName: "callback",
                load: function(a, d) {
                    b(a, d, h, e,
                        c)
                },
                error: function(a) {
                    f(a, e, c)
                }
            });
            return c
        },
        _relationHandler: function(a, h, e, b, f) {
            try {
                this._successHandler([a.relations], "onRelationComplete", e, f)
            } catch (c) {
                this._errorHandler(c, b, f)
            }
        },
        onRelationComplete: function() {},
        trimExtend: function(a, h, e) {
            var b = l.mixin({}, this._url.query, {
                    f: "json"
                }, a.toJson()),
                f = a.sr,
                c = this._trimExtendHandler,
                g = this._errorHandler,
                d = new n(q._dfdCanceller);
            d._pendingDfd = p({
                url: this._url.path + "/trimExtend",
                content: b,
                callbackParamName: "callback",
                load: function(a, b) {
                    c(a, b, f, h, e, d)
                },
                error: function(a) {
                    g(a, e, d)
                }
            });
            return d
        },
        _trimExtendHandler: function(a, h, e, b, f, c) {
            try {
                var g = a.geometries;
                a = [];
                var d, m = g.length;
                for (d = 0; d < m; d++) a[d] = new x({
                    spatialReference: e,
                    paths: g[d].paths
                });
                this._successHandler([a], "onTrimExtendComplete", b, c)
            } catch (k) {
                this._errorHandler(k, f, c)
            }
        },
        onTrimExtendComplete: function() {},
        densify: function(a, h, e) {
            var b = l.mixin({}, this._url.query, {
                    f: "json"
                }, a.toJson()),
                f = a.geometries[0].spatialReference,
                c = this._densifyHandler,
                g = this._errorHandler,
                d = new n(q._dfdCanceller);
            d._pendingDfd =
                p({
                    url: this._url.path + "/densify",
                    content: b,
                    callbackParamName: "callback",
                    load: function(a, b) {
                        c(a, b, f, h, e, d)
                    },
                    error: function(a) {
                        g(a, e, d)
                    }
                });
            return d
        },
        _densifyHandler: function(a, h, e, b, f, c) {
            try {
                var g = [];
                s.forEach(a.geometries, function(a) {
                    g.push(r.fromJson(a).setSpatialReference(e))
                });
                this._successHandler([g], "onDensifyComplete", b, c)
            } catch (d) {
                this._errorHandler(d, f, c)
            }
        },
        onDensifyComplete: function() {},
        generalize: function(a, h, e) {
            var b = l.mixin({}, this._url.query, {
                    f: "json"
                }, a.toJson()),
                f = a.geometries[0].spatialReference,
                c = this._generalizeHandler,
                g = this._errorHandler,
                d = new n(q._dfdCanceller);
            d._pendingDfd = p({
                url: this._url.path + "/generalize",
                content: b,
                callbackParamName: "callback",
                load: function(a, b) {
                    c(a, b, f, h, e, d)
                },
                error: function(a) {
                    g(a, e, d)
                }
            });
            return d
        },
        _generalizeHandler: function(a, h, e, b, f, c) {
            try {
                var g = [];
                s.forEach(a.geometries, function(a) {
                    g.push(r.fromJson(a).setSpatialReference(e))
                });
                this._successHandler([g], "onGeneralizeComplete", b, c)
            } catch (d) {
                this._errorHandler(d, f, c)
            }
        },
        onGeneralizeComplete: function() {},
        offset: function(a,
            h, e) {
            var b = l.mixin({}, this._url.query, {
                    f: "json"
                }, a.toJson()),
                f = a.geometries[0].spatialReference,
                c = this._offsetHandler,
                g = this._errorHandler,
                d = new n(q._dfdCanceller);
            d._pendingDfd = p({
                url: this._url.path + "/offset",
                content: b,
                callbackParamName: "callback",
                load: function(a, b) {
                    c(a, b, f, h, e, d)
                },
                error: function(a) {
                    g(a, e, d)
                }
            });
            return d
        },
        _offsetHandler: function(a, h, e, b, f, c) {
            try {
                var g = [];
                s.forEach(a.geometries, function(a) {
                    g.push(r.fromJson(a).setSpatialReference(e))
                });
                this._successHandler([g], "onOffsetComplete", b,
                    c)
            } catch (d) {
                this._errorHandler(d, f, c)
            }
        },
        onOffsetComplete: function() {},
        distance: function(a, h, e) {
            var b = l.mixin({}, this._url.query, {
                    f: "json"
                }, a.toJson()),
                f = a.geometry1.spatialReference,
                c = this._distanceHandler,
                g = this._errorHandler,
                d = new n(q._dfdCanceller);
            d._pendingDfd = p({
                url: this._url.path + "/distance",
                content: b,
                callbackParamName: "callback",
                load: function(a, b) {
                    c(a, b, f, h, e, d)
                },
                error: function(a) {
                    g(a, e, d)
                }
            });
            return d
        },
        _distanceHandler: function(a, h, e, b, f, c) {
            try {
                a = a && a.distance, this._successHandler([a], "onDistanceComplete",
                    b, c)
            } catch (g) {
                this._errorHandler(g, f, c)
            }
        },
        onDistanceComplete: function() {},
        toGeoCoordinateString: function(a, h, e) {
            var b = {};
            l.isObject(a.sr) ? b.sr = a.sr.wkid || k.toJson(a.sr.toJson()) : b.sr = a.sr;
            b.coordinates = k.toJson(a.coordinates);
            b.conversionType = a.conversionType || "MGRS";
            b.conversionMode = a.conversionMode;
            b.numOfDigits = a.numOfDigits;
            b.rounding = a.rounding;
            b.addSpaces = a.addSpaces;
            a = l.mixin({}, this._url.query, {
                f: "json"
            }, b);
            var f = this._toGeoCoordinateHandler,
                c = this._errorHandler,
                g = new n(q._dfdCanceller);
            g._pendingDfd =
                p({
                    url: this._url.path + "/toGeoCoordinateString",
                    content: a,
                    callbackParamName: "callback",
                    load: function(a, b) {
                        f(a, b, h, e, g)
                    },
                    error: function(a) {
                        c(a, e, g)
                    }
                });
            return g
        },
        _toGeoCoordinateHandler: function(a, h, e, b, f) {
            try {
                this._successHandler([a.strings], "onToGeoCoordinateStringComplete", e, f)
            } catch (c) {
                this._errorHandler(c, b, f)
            }
        },
        onToGeoCoordinateStringComplete: function() {},
        fromGeoCoordinateString: function(a, h, e) {
            var b = {};
            l.isObject(a.sr) ? b.sr = a.sr.wkid || k.toJson(a.sr.toJson()) : b.sr = a.sr;
            b.strings = k.toJson(a.strings);
            b.conversionType = a.conversionType || "MGRS";
            b.conversionMode = a.conversionMode;
            a = l.mixin({}, this._url.query, {
                f: "json"
            }, b);
            var f = this._fromGeoCoordinateHandler,
                c = this._errorHandler,
                g = new n(q._dfdCanceller);
            g._pendingDfd = p({
                url: this._url.path + "/fromGeoCoordinateString",
                content: a,
                callbackParamName: "callback",
                load: function(a, b) {
                    f(a, b, h, e, g)
                },
                error: function(a) {
                    c(a, e, g)
                }
            });
            return g
        },
        _fromGeoCoordinateHandler: function(a, h, e, b, f) {
            try {
                this._successHandler([a.coordinates], "onToGeoCoordinateStringComplete", e, f)
            } catch (c) {
                this._errorHandler(c,
                    b, f)
            }
        },
        onFromGeoCoordinateStringComplete: function() {}
    });
    l.mixin(u, {
        UNIT_METER: 9001,
        UNIT_GERMAN_METER: 9031,
        UNIT_FOOT: 9002,
        UNIT_SURVEY_FOOT: 9003,
        UNIT_CLARKE_FOOT: 9005,
        UNIT_FATHOM: 9014,
        UNIT_NAUTICAL_MILE: 9030,
        UNIT_SURVEY_CHAIN: 9033,
        UNIT_SURVEY_LINK: 9034,
        UNIT_SURVEY_MILE: 9035,
        UNIT_KILOMETER: 9036,
        UNIT_CLARKE_YARD: 9037,
        UNIT_CLARKE_CHAIN: 9038,
        UNIT_CLARKE_LINK: 9039,
        UNIT_SEARS_YARD: 9040,
        UNIT_SEARS_FOOT: 9041,
        UNIT_SEARS_CHAIN: 9042,
        UNIT_SEARS_LINK: 9043,
        UNIT_BENOIT_1895A_YARD: 9050,
        UNIT_BENOIT_1895A_FOOT: 9051,
        UNIT_BENOIT_1895A_CHAIN: 9052,
        UNIT_BENOIT_1895A_LINK: 9053,
        UNIT_BENOIT_1895B_YARD: 9060,
        UNIT_BENOIT_1895B_FOOT: 9061,
        UNIT_BENOIT_1895B_CHAIN: 9062,
        UNIT_BENOIT_1895B_LINK: 9063,
        UNIT_INDIAN_FOOT: 9080,
        UNIT_INDIAN_1937_FOOT: 9081,
        UNIT_INDIAN_1962_FOOT: 9082,
        UNIT_INDIAN_1975_FOOT: 9083,
        UNIT_INDIAN_YARD: 9084,
        UNIT_INDIAN_1937_YARD: 9085,
        UNIT_INDIAN_1962_YARD: 9086,
        UNIT_INDIAN_1975_YARD: 9087,
        UNIT_FOOT_1865: 9070,
        UNIT_RADIAN: 9101,
        UNIT_DEGREE: 9102,
        UNIT_ARCMINUTE: 9103,
        UNIT_ARCSECOND: 9104,
        UNIT_GRAD: 9105,
        UNIT_GON: 9106,
        UNIT_MICRORADIAN: 9109,
        UNIT_ARCMINUTE_CENTESIMAL: 9112,
        UNIT_ARCSECOND_CENTESIMAL: 9113,
        UNIT_MIL6400: 9114,
        UNIT_BRITISH_1936_FOOT: 9095,
        UNIT_GOLDCOAST_FOOT: 9094,
        UNIT_INTERNATIONAL_CHAIN: 109003,
        UNIT_INTERNATIONAL_LINK: 109004,
        UNIT_INTERNATIONAL_YARD: 109001,
        UNIT_STATUTE_MILE: 9093,
        UNIT_SURVEY_YARD: 109002,
        UNIT_50KILOMETER_LENGTH: 109030,
        UNIT_150KILOMETER_LENGTH: 109031,
        UNIT_DECIMETER: 109005,
        UNIT_CENTIMETER: 109006,
        UNIT_MILLIMETER: 109007,
        UNIT_INTERNATIONAL_INCH: 109008,
        UNIT_US_SURVEY_INCH: 109009,
        UNIT_INTERNATIONAL_ROD: 109010,
        UNIT_US_SURVEY_ROD: 109011,
        UNIT_US_NAUTICAL_MILE: 109012,
        UNIT_UK_NAUTICAL_MILE: 109013,
        UNIT_SQUARE_INCHES: "esriSquareInches",
        UNIT_SQUARE_FEET: "esriSquareFeet",
        UNIT_SQUARE_YARDS: "esriSquareYards",
        UNIT_ACRES: "esriAcres",
        UNIT_SQUARE_MILES: "esriSquareMiles",
        UNIT_SQUARE_MILLIMETERS: "esriSquareMillimeters",
        UNIT_SQUARE_CENTIMETERS: "esriSquareCentimeters",
        UNIT_SQUARE_DECIMETERS: "esriSquareDecimeters",
        UNIT_SQUARE_METERS: "esriSquareMeters",
        UNIT_ARES: "esriAres",
        UNIT_HECTARES: "esriHectares",
        UNIT_SQUARE_KILOMETERS: "esriSquareKilometers"
    });
    return u
});