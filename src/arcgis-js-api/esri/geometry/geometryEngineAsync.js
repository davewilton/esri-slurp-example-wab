//>>built
define(["require", "exports", "module", "esri/geometry/Geometry", "esri/workers/WorkerClient", "esri/geometry/jsonUtils", "dojo/Deferred"], function(u, B, x, s, y, z, k) {
    function g(b) {
        if (null === b || void 0 === b) return null;
        switch (b.type) {
            case "point":
                return {
                    x: b.x,
                    y: b.y
                };
            case "multipoint":
                return {
                    points: b.points
                };
            case "polyline":
                return {
                    paths: b.paths
                };
            case "polygon":
                return {
                    rings: b.rings
                };
            case "extent":
                return {
                    xmin: b.xmin,
                    ymin: b.ymin,
                    xmax: b.xmax,
                    ymax: b.ymax
                }
        }
        return null
    }

    function n(b, a) {
        if (null === b) return null;
        var c = z.fromJson(b);
        c.setSpatialReference(a);
        return c
    }

    function l(b) {
        return null == b || void 0 === b ? null : -1 != b.q ? {
            wkid: b.wkid
        } : "" === b.wkt || void 0 === b.wkt || null === b.wkt ? {
            r: b.wkt
        } : null
    }

    function t(b, a, c) {
        var d = new k,
            e = a.spatialReference;
        h.a({
            action: b,
            geoma: g(a),
            geomb: g(c),
            spatialReference: l(a.spatialReference)
        }).then(function(a) {
            0 === a.status ? d.reject(Error(a.error.message)) : d.resolve(n(a.result, e))
        }, function(a) {
            d.reject(a)
        });
        return d.promise
    }

    function q(b, a, c) {
        var d = new k;
        h.a({
            action: b,
            geoma: g(a),
            geomb: g(c),
            spatialReference: l(a.spatialReference)
        }).then(function(a) {
            0 === a.status ? d.reject(Error(a.error.message)) : d.resolve(a.result)
        }, function(a) {
            d.reject(a)
        });
        return d.promise
    }
    var A = function() {
            function b() {
                this.c = !1;
                this.i = null;
                this.i = new y(this.l(), !1)
            }
            b.prototype.l = function() {
                return u.p ? u.p("./geometryenginewebworker") : x.id.replace(/\/[^\/]*$/ig, "/") + "./geometryenginewebworker"
            };
            return b
        }(),
        h = function() {
            function b() {}
            b.a = function(a) {
                var c = new k;
                b.g.push({
                    task: a,
                    d: c
                });
                b.f();
                return c.promise
            };
            b.f = function() {
                if (0 <
                    b.g.length) {
                    for (var a = null, c = 0; c < b.b.length; c++)
                        if (!1 === b.b[c].c) {
                            a = b.b[c];
                            break
                        }
                    null === a && b.b.length < b.e && (a = new A, b.b.push(a));
                    if (null !== a) {
                        var d = this.g.shift();
                        a.c = !0;
                        a.i.postMessage(d.task).then(function(c) {
                            a.c = !1;
                            try {
                                d.d.resolve(c)
                            } catch (f) {}
                            b.f()
                        }, function(c) {
                            a.c = !1;
                            try {
                                d.d.reject(c)
                            } catch (f) {}
                            b.f()
                        })
                    }
                }
            };
            b.b = [];
            b.g = [];
            b.e = 4;
            return b
        }();
    return function() {
        function b() {}
        b._removeAllWorkers = function() {
            h.b = []
        };
        b._setMaxWorkers = function(a) {
            b._removeAllWorkers();
            h.e = a
        };
        b._getMaxWorkers = function() {
            return h.e
        };
        b._getNumWorkers = function() {
            return h.b.length
        };
        b.extendedSpatialReferenceInfo = function(a) {
            var c = new k;
            h.a({
                action: "extendedspatialreferenceinfo",
                spatialReference: l(a)
            }).then(function(a) {
                0 === a.status ? c.reject(Error(a.error.message)) : c.resolve(a.result)
            }, function(a) {
                c.reject(a)
            });
            return c.promise
        };
        b.equals = function(a, c) {
            return null === a && null !== c || null === c && null !== a ? !1 : q("equals", a, c)
        };
        b.intersects = function(a, c) {
            if (null === a || null === c) throw Error("Illegal Argument Exception");
            return q("intersects", a,
                c)
        };
        b.touches = function(a, c) {
            if (null === a || null === c) throw Error("Illegal Argument Exception");
            return q("touches", a, c)
        };
        b.within = function(a, c) {
            if (null === a || null === c) throw Error("Illegal Argument Exception");
            return q("within", a, c)
        };
        b.disjoint = function(a, c) {
            if (null === a || null === c) throw Error("Illegal Argument Exception");
            return q("disjoint", a, c)
        };
        b.overlaps = function(a, c) {
            if (null === a || null === c) throw Error("Illegal Argument Exception");
            return q("overlaps", a, c)
        };
        b.crosses = function(a, c) {
            if (null === a || null ===
                c) throw Error("Illegal Argument Exception");
            return q("crosses", a, c)
        };
        b.contains = function(a, c) {
            if (null === a || null === c) throw Error("Illegal Argument Exception");
            return q("contains", a, c)
        };
        b.isSimple = function(a) {
            return q("issimple", a, null)
        };
        b.clip = function(a, c) {
            return t("clip", a, c)
        };
        b.simplify = function(a) {
            var c = new k,
                d = a.spatialReference;
            h.a({
                action: "simplify",
                geoma: g(a),
                spatialReference: l(a.spatialReference)
            }).then(function(a) {
                0 === a.status ? c.reject(Error(a.error.message)) : c.resolve(n(a.result, d))
            }, function(a) {
                c.reject(a)
            });
            return c.promise
        };
        b.rotate = function(a, c, d) {
            var b = new k,
                f = a.spatialReference;
            if (void 0 === d || null === d) switch (a.type) {
                case "point":
                    d = a;
                    break;
                case "extent":
                    d = a.getCenter();
                    break;
                default:
                    d = a.getExtent().getCenter()
            }
            h.a({
                action: "rotate",
                geoma: g(a),
                spatialReference: l(a.spatialReference),
                angle: c,
                rotpt: g(d)
            }).then(function(a) {
                0 === a.status ? b.reject(Error(a.error.message)) : b.resolve(n(a.result, f))
            }, function(a) {
                b.reject(a)
            });
            return b.promise
        };
        b.flipHorizontal = function(a, c) {
            var d = new k,
                b = a.spatialReference;
            if (void 0 ===
                c || null === c) switch (a.type) {
                case "point":
                    c = a;
                    break;
                case "extent":
                    c = a.getCenter();
                    break;
                default:
                    c = a.getExtent().getCenter()
            }
            h.a({
                action: "fliph",
                geoma: g(a),
                spatialReference: l(a.spatialReference),
                flippt: g(c)
            }).then(function(a) {
                0 === a.status ? d.reject(Error(a.error.message)) : d.resolve(n(a.result, b))
            }, function(a) {
                d.reject(a)
            });
            return d.promise
        };
        b.flipVertical = function(a, c) {
            var d = new k,
                b = a.spatialReference;
            if (void 0 === c || null === c) switch (a.type) {
                case "point":
                    c = a;
                    break;
                case "extent":
                    c = a.getCenter();
                    break;
                default:
                    c =
                        a.getExtent().getCenter()
            }
            h.a({
                action: "flipv",
                geoma: g(a),
                spatialReference: l(a.spatialReference),
                flippt: g(c)
            }).then(function(a) {
                0 === a.status ? d.reject(Error(a.error.message)) : d.resolve(n(a.result, b))
            }, function(a) {
                d.reject(a)
            });
            return d.promise
        };
        b.distance = function(a, c, d) {
            var b = new k;
            h.a({
                action: "distance",
                geoma: g(a),
                geomb: g(c),
                spatialReference: l(a.spatialReference),
                distanceunits: d
            }).then(function(a) {
                0 === a.status ? b.reject(Error(a.error.message)) : b.resolve(a.result)
            }, function(a) {
                b.reject(a)
            });
            return b.promise
        };
        b.relate = function(a, c, b) {
            var e = new k;
            h.a({
                action: "relate",
                geoma: g(a),
                geomb: g(c),
                relation: b,
                spatialReference: l(a.spatialReference)
            }).then(function(a) {
                0 === a.status ? e.reject(Error(a.error.message)) : e.resolve(a.result)
            }, function(a) {
                e.reject(a)
            });
            return e.promise
        };
        b.nearestCoordinate = function(a, c, b) {
            var e = new k,
                f = a.spatialReference;
            h.a({
                action: "nearestcoord",
                geoma: g(a),
                geomb: g(c),
                spatialReference: l(a.spatialReference),
                testinterior: void 0 === b ? !0 : b
            }).then(function(a) {
                0 === a.status ? e.reject(Error(a.error.message)) :
                    (a.result.coordinate = n(a.result.coordinate, f), e.resolve(a.result))
            }, function(a) {
                e.reject(a)
            });
            return e.promise
        };
        b.nearestVertex = function(a, c) {
            var b = new k,
                e = a.spatialReference;
            h.a({
                action: "nearestvertex",
                geoma: g(a),
                geomb: g(c),
                spatialReference: l(a.spatialReference)
            }).then(function(a) {
                0 === a.status ? b.reject(Error(a.error.message)) : (a.result.coordinate = n(a.result.coordinate, e), b.resolve(a.result))
            }, function(a) {
                b.reject(a)
            });
            return b.promise
        };
        b.nearestVertices = function(a, c, b, e) {
            var f = new k,
                m = a.spatialReference;
            h.a({
                action: "nearestvertices",
                geoma: g(a),
                geomb: g(c),
                spatialReference: l(a.spatialReference),
                searchradius: b,
                maxreturn: e
            }).then(function(a) {
                if (0 === a.status) f.reject(Error(a.error.message));
                else {
                    for (var c = 0; c < a.result.length; c++) a.result[c].coordinate = n(a.result[c].coordinate, m);
                    f.resolve(a.result)
                }
            }, function(a) {
                f.reject(a)
            });
            return f.promise
        };
        b.cut = function(a, c) {
            var b = new k,
                e = a.spatialReference;
            h.a({
                action: "cut",
                geoma: g(a),
                geomb: g(c),
                spatialReference: l(a.spatialReference)
            }).then(function(a) {
                if (0 === a.status) b.reject(Error(a.error.message));
                else {
                    for (var c = 0; c < a.result.length; c++) a.result[c] = n(a.result[c], e);
                    b.resolve(a.result)
                }
            }, function(a) {
                b.reject(a)
            });
            return b.promise
        };
        b.generalize = function(a, c, b, e) {
            var f = new k,
                m = a.spatialReference;
            h.a({
                action: "generalize",
                geoma: g(a),
                maxdeviation: c,
                removedegenerateparts: b,
                maxdeviationunit: e,
                spatialReference: l(a.spatialReference)
            }).then(function(a) {
                0 === a.status ? f.reject(Error(a.error.message)) : f.resolve(n(a.result, m))
            }, function(a) {
                f.reject(a)
            });
            return f.promise
        };
        b.densify = function(a, c, b) {
            var e = new k,
                f = a.spatialReference;
            h.a({
                action: "densify",
                geoma: g(a),
                maxsegmentlength: c,
                maxsegmentlengthunit: b,
                spatialReference: l(a.spatialReference)
            }).then(function(a) {
                0 === a.status ? e.reject(Error(a.error.message)) : e.resolve(n(a.result, f))
            }, function(a) {
                e.reject(a)
            });
            return e.promise
        };
        b.intersect = function(a, c) {
            return a instanceof s ? t("intersect", a, c) : b.m(a, c)
        };
        b.m = function(a, c) {
            for (var b = new k, e = [], f = 0; f < a.length; f++) e.push(g(a[f]));
            var m = c.spatialReference;
            h.a({
                action: "intersectmany",
                geom: g(c),
                geometries: e,
                spatialReference: l(c.spatialReference)
            }).then(function(a) {
                if (0 ===
                    a.status) b.reject(Error(a.error.message));
                else {
                    for (var c = 0; c < a.result.length; c++) a.result[c] = n(a.result[c], m);
                    b.resolve(a.result)
                }
            }, function(a) {
                b.reject(a)
            });
            return b.promise
        };
        b.difference = function(a, c) {
            return a instanceof s ? t("difference", a, c) : b.k(a, c)
        };
        b.k = function(a, c) {
            for (var b = new k, e = [], f = 0; f < a.length; f++) e.push(g(a[f]));
            var m = c.spatialReference;
            h.a({
                action: "differencemany",
                geom: g(c),
                geometries: e,
                spatialReference: l(c.spatialReference)
            }).then(function(a) {
                if (0 === a.status) b.reject(Error(a.error.message));
                else {
                    for (var c = 0; c < a.result.length; c++) a.result[c] = n(a.result[c], m);
                    b.resolve(a.result)
                }
            }, function(a) {
                b.reject(a)
            });
            return b.promise
        };
        b.symmetricDifference = function(a, c) {
            return a instanceof s ? t("symdifference", a, c) : b.o(a, c)
        };
        b.o = function(a, c) {
            for (var b = new k, e = [], f = 0; f < a.length; f++) e.push(g(a[f]));
            var m = c.spatialReference;
            h.a({
                action: "symdifferencemany",
                geom: g(c),
                geometries: e,
                spatialReference: l(c.spatialReference)
            }).then(function(a) {
                if (0 === a.status) b.reject(Error(a.error.message));
                else {
                    for (var c =
                            0; c < a.result.length; c++) a.result[c] = n(a.result[c], m);
                    b.resolve(a.result)
                }
            }, function(a) {
                b.reject(a)
            });
            return b.promise
        };
        b.union = function(a, c) {
            void 0 === c && (c = null);
            var b = new k,
                e = [];
            if (null === a) return b.resolve(null), b.promise;
            a instanceof s && (a = [a], null !== c && a.push(c));
            if (0 === a.length) return b.resolve(null), b.promise;
            for (var f = 0; f < a.length; f++) e.push(g(a[f]));
            var m = a[0].spatialReference;
            h.a({
                action: "unionmany",
                geometries: e,
                spatialReference: l(m)
            }).then(function(a) {
                0 === a.status ? b.reject(Error(a.error.message)) :
                    b.resolve(n(a.result, m))
            }, function(a) {
                b.reject(a)
            });
            return b.promise
        };
        b.buffer = function(a, c, d, e) {
            void 0 === e && (e = !1);
            if (a instanceof s) {
                var f = new k,
                    m = a.spatialReference;
                h.a({
                    action: "buffer",
                    geoma: g(a),
                    spatialReference: l(a.spatialReference),
                    distance: c,
                    unit: d,
                    geodesic: !1,
                    geodesicmaxdeviation: NaN,
                    geodesiccurvetype: 0
                }).then(function(a) {
                    0 === a.status ? f.reject(Error(a.error.message)) : f.resolve(n(a.result, m))
                }, function(a) {
                    f.reject(a)
                });
                return f.promise
            }
            return b.h(a, c, d, !1, e, 0, NaN)
        };
        b.geodesicBuffer = function(a,
            c, d, e, f, m) {
            if (a instanceof s) {
                var p = new k;
                void 0 === f && (f = NaN);
                void 0 === e && (e = 0);
                var r = a.spatialReference;
                h.a({
                    action: "buffer",
                    geoma: g(a),
                    spatialReference: l(a.spatialReference),
                    distance: c,
                    unit: d,
                    geodesic: !0,
                    geodesicmaxdeviation: f,
                    geodesiccurvetype: e
                }).then(function(a) {
                    0 === a.status ? p.reject(Error(a.error.message)) : p.resolve(n(a.result, r))
                }, function(a) {
                    p.reject(a)
                });
                return p.promise
            }
            return b.h(a, c, d, !0, e, f, m)
        };
        b.h = function(a, b, d, e, f, m, p) {
            var r = new k,
                v = [];
            void 0 === p && (p = NaN);
            void 0 === m && (m = 0);
            if (null ===
                a || 0 === a.length) return r.resolve(null), r.promise;
            for (var q = 0; q < a.length; q++) v.push(g(a[q]));
            var w = a[0].spatialReference;
            h.a({
                action: "buffermany",
                geometries: v,
                spatialReference: l(w),
                distances: b,
                tounionresults: f,
                unit: d,
                geodesic: e,
                geodesicmaxdeviation: p,
                geodesiccurvetype: m
            }).then(function(a) {
                if (0 === a.status) r.reject(Error(a.error.message));
                else {
                    for (var b = 0; b < a.result.length; b++) a.result[b] = n(a.result[b], w);
                    r.resolve(a.result)
                }
            }, function(a) {
                r.reject(a)
            });
            return r.promise
        };
        b.convexHull = function(a, c) {
            void 0 ===
                c && (c = !1);
            if (a instanceof s) {
                var d = new k,
                    e = a.spatialReference;
                h.a({
                    action: "convexhull",
                    geoma: g(a),
                    spatialReference: l(a.spatialReference)
                }).then(function(a) {
                    0 === a.status ? d.reject(Error(a.error.message)) : d.resolve(n(a.result, e))
                }, function(a) {
                    d.reject(a)
                });
                return d.promise
            }
            return b.j(a, c)
        };
        b.j = function(a, b) {
            for (var d = new k, e = [], f = 0; f < a.length; f++) e.push(g(a[f]));
            var l = 0 < a.length ? a[0].spatialReference : null;
            h.a({
                action: "convexhullmany",
                geometries: e,
                merge: b
            }).then(function(a) {
                if (0 === a.status) d.reject(Error(a.error.message));
                else {
                    for (var b = 0; b < a.result.length; b++) a.result[b] = n(a.result[b], l);
                    d.resolve(a.result)
                }
            }, function(a) {
                d.reject(a)
            });
            return d.promise
        };
        b.offset = function(a, c, d, e, f, m) {
            if (a instanceof s) {
                var p = new k,
                    r = a.spatialReference;
                h.a({
                    action: "offset",
                    geoma: g(a),
                    spatialReference: l(a.spatialReference),
                    distance: c,
                    joins: e,
                    bevelratio: f,
                    flattenerror: m,
                    offsetunit: d
                }).then(function(a) {
                    0 === a.status ? p.reject(Error(a.error.message)) : p.resolve(n(a.result, r))
                }, function(a) {
                    p.reject(a)
                });
                return p.promise
            }
            return b.n(a, c, d, e,
                f, m)
        };
        b.n = function(a, b, d, e, f, m) {
            for (var p = new k, r = [], q = 0; q < a.length; q++) r.push(g(a[q]));
            var s = 0 < a.length ? a[0].spatialReference : null;
            h.a({
                action: "offsetmany",
                geometries: r,
                spatialReference: l(s),
                distance: b,
                joins: e,
                bevelratio: f,
                offsetunit: d,
                flattenerror: m
            }).then(function(a) {
                if (0 === a.status) p.reject(Error(a.error.message));
                else {
                    for (var b = 0; b < a.result.length; b++) a.result[b] = n(a.result[b], s);
                    p.resolve(a.result)
                }
            }, function(a) {
                p.reject(a)
            });
            return p.promise
        };
        b.planarArea = function(a, b) {
            var d = new k;
            h.a({
                action: "area",
                geoma: g(a),
                unit: b,
                spatialReference: l(a.spatialReference)
            }).then(function(a) {
                0 === a.status ? d.reject(Error(a.error.message)) : d.resolve(a.result)
            }, function(a) {
                d.reject(a)
            });
            return d.promise
        };
        b.planarLength = function(a, b) {
            var d = new k;
            h.a({
                action: "length",
                geoma: g(a),
                unit: b,
                spatialReference: l(a.spatialReference)
            }).then(function(a) {
                0 === a.status ? d.reject(Error(a.error.message)) : d.resolve(a.result)
            }, function(a) {
                d.reject(a)
            });
            return d.promise
        };
        b.geodesicArea = function(a, b, d) {
            var e = new k;
            h.a({
                action: "geodesicarea",
                geoma: g(a),
                unit: b,
                geodesiccurvetype: d,
                spatialReference: l(a.spatialReference)
            }).then(function(a) {
                0 === a.status ? e.reject(Error(a.error.message)) : e.resolve(a.result)
            }, function(a) {
                e.reject(a)
            });
            return e.promise
        };
        b.geodesicLength = function(a, b, d) {
            var e = new k;
            h.a({
                action: "geodesiclength",
                geoma: g(a),
                unit: b,
                geodesiccurvetype: d,
                spatialReference: l(a.spatialReference)
            }).then(function(a) {
                0 === a.status ? e.reject(Error(a.error.message)) : e.resolve(a.result)
            }, function(a) {
                e.reject(a)
            });
            return e.promise
        };
        b.JoinType = {
            Round: 0,
            Bevel: 1,
            Miter: 2,
            Square: 3
        };
        b.GeodeticCurveType = {
            Geodesic: 0,
            Loxodrome: 1,
            GreatElliptic: 2,
            NormalSection: 3,
            ShapePreserving: 4
        };
        return b
    }()
});