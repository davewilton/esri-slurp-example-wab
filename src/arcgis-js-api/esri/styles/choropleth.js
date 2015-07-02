//>>built
define(["dojo/_base/array", "dojo/_base/lang", "dojo/has", "../kernel", "../Color", "./colors"], function(k, x, n, g, q, C) {
    function u(a, b) {
        return k.map(a, function(a) {
            a = new q(a);
            null != b && (a.a = b);
            return a
        })
    }

    function y(a, b) {
        var d, c = 0;
        a.length === b.length && ((d = k.every(a, function(a, c) {
            return a.r === b[c].r && a.g === b[c].g && a.b === b[c].b
        })) ? c = 1 : (d = a.slice(0).reverse(), (d = k.every(d, function(a, c) {
            return a.r === b[c].r && a.g === b[c].g && a.b === b[c].b
        })) && (c = -1)));
        return c
    }

    function z(a, b) {
        var d, c;
        if (c = y(b, a.colors)) d = 0 < c ? a : r.flipColors(a, !0);
        else {
            var f;
            k.some(a.colorsForClassBreaks, function(a) {
                a.numClasses === b.length && (f = a.colors);
                return !!f
            });
            f && (c = y(b, f)) && (d = 0 < c ? a : r.flipColors(a, !0))
        }
        return d
    }

    function v(a, b) {
        var d = a && a.basemapGroups,
            c = a && a.basemaps,
            f, e;
        if (d)
            for (f in d)
                if (c = d[f], c = k.indexOf(c, b), -1 < c) {
                    e = f;
                    break
                }
        e = e || b;
        return a && e ? a.schemes[e] : null
    }

    function A(a) {
        var b = a.basemapGroups;
        a = a.basemaps;
        var d, c = [];
        if (b)
            for (d in b) c = c.concat(b[d]);
        else a && (c = c.concat(a));
        return c
    }

    function s(a, b, d, c, f) {
        var e, g, h = C[a];
        if (h) {
            e = {
                id: c + "/" + f + "/" +
                    a,
                theme: c
            };
            c = b.fillOpacity;
            null == c && -1 !== k.indexOf(B, a) && (c = 0.8);
            e.colors = u(h.stops, c);
            e.colorsForClassBreaks = [];
            for (g in h) "stops" !== g && (g = +g, e.colorsForClassBreaks.push({
                numClasses: g,
                colors: u(h[g], c)
            }));
            e.noDataColor = new q(-1 !== k.indexOf(B, a) ? D : E);
            null != c && (e.noDataColor.a = c || 1);
            switch (d) {
                case "point":
                    e.outline = {
                        color: new q(b.outline.color),
                        width: b.outline.width
                    };
                    e.size = b.size;
                    break;
                case "line":
                    e.width = b.width;
                    break;
                case "polygon":
                    e.outline = {
                        color: new q(b.outline.color),
                        width: b.outline.width
                    }
            }
        }
        return e
    }

    function w(a) {
        "esriGeometryPoint" === a || "esriGeometryMultipoint" === a ? a = "point" : "esriGeometryPolyline" === a ? a = "line" : "esriGeometryPolygon" === a && (a = "polygon");
        return a
    }
    n = {
        color: [128, 128, 128, 1],
        width: 0.5
    };
    g = {
        color: [153, 153, 153, 1],
        width: 0.5
    };
    var h = {
            outline: g,
            fillOpacity: 0.8,
            width: 2,
            size: 8
        },
        p = {
            outline: n,
            fillOpacity: 0.6,
            width: 2,
            size: 8
        },
        E = "#aaaaaa",
        D = "#ffffff",
        B = "highlight-orange-gray highlight-bluegreen-gray highlight-purple-gray highlight-pink-gray highlight-blue-gray highlight-red-gray highlight-orange-gray-dark highlight-blue-gray-dark highlight-orange-gray-bright highlight-blue-gray-bright extremes-orange-gray extremes-bluegreen-gray extremes-purple-gray extremes-pink-gray extremes-blue-gray extremes-red-gray extremes-orange-gray-dark extremes-blue-gray-dark extremes-orange-gray-bright extremes-blue-gray-bright".split(" "),
        l = "seq-single-blues seq-single-greens seq-single-grays seq-single-oranges seq-single-purples seq-single-reds seq-multi-bugn seq-multi-bupu seq-multi-gnbu seq-multi-orrd seq-multi-pubu seq-multi-pubugn seq-multi-purd seq-multi-rdpu seq-multi-ylgn seq-multi-ylgnbu seq-multi-ylorbr seq-multi-ylorrd".split(" "),
        m = "div-brbg div-piyg div-prgn div-puor div-rdbu div-rdgy div-rdylbu div-rdylgn div-spectral".split(" "),
        t = {
            "high-to-low": {
                name: "high-to-low",
                label: "TODO",
                description: "TODO",
                basemaps: "streets gray topo terrain national-geographic oceans osm satellite hybrid dark-gray".split(" "),
                schemes: {
                    streets: {
                        common: h,
                        primary: "seq-yellow-orange-red",
                        secondary: ["seq-yellow-red-purple", "seq-yellow-pink-purple", "seq-yellow-purple-blue", "seq-yellow-green-blue"].concat(l)
                    },
                    gray: {
                        common: h,
                        primary: "seq-yellow-orange-red",
                        secondary: ["seq-orange-red-light", "seq-yellow-red-purple", "seq-yellow-pink-purple", "seq-yellow-purple-blue"].concat(l)
                    },
                    topo: {
                        common: h,
                        primary: "seq-yellow-pink-purple",
                        secondary: ["seq-yellow-purple-blue", "seq-yellow-red-purple", "seq-yellow-orange-red", "seq-yellow-green-blue"].concat(l)
                    },
                    terrain: {
                        common: h,
                        primary: "seq-pink-red",
                        secondary: ["seq-yellow-pink-purple", "seq-yellow-red-purple", "seq-yellow-orange-red", "seq-orange-red-light"].concat(l)
                    },
                    "national-geographic": {
                        common: h,
                        primary: "seq-yellow-red-purple",
                        secondary: ["seq-yellow-orange-red", "seq-yellow-pink-purple", "seq-yellow-purple-blue", "seq-yellow-green-blue"].concat(l)
                    },
                    oceans: {
                        common: h,
                        primary: "seq-yellow-red-purple",
                        secondary: ["seq-yellow-green-blue", "seq-yellow-orange-red", "seq-yellow-pink-purple", "seq-yellow-purple-blue"].concat(l)
                    },
                    osm: {
                        common: h,
                        primary: "seq-red-blue-green",
                        secondary: ["seq-yellow-pink-purple", "seq-yellow-red-purple", "seq-yellow-purple-blue"].concat(l)
                    },
                    satellite: {
                        common: p,
                        primary: "seq-orange-red-dark",
                        secondary: ["seq-yellow-green-blue", "seq-red-blue-green", "seq-yellow-purple-blue"].concat(l)
                    },
                    hybrid: {
                        common: p,
                        primary: "seq-orange-red-dark",
                        secondary: ["seq-yellow-green-blue", "seq-red-blue-green", "seq-yellow-purple-blue"].concat(l)
                    },
                    "dark-gray": {
                        common: p,
                        primary: "seq-yellow-orange-red-bright",
                        secondary: [].concat(l)
                    }
                }
            },
            "above-and-below": {
                name: "above-and-below",
                label: "TODO",
                description: "TODO",
                basemaps: "streets gray topo terrain national-geographic oceans osm satellite hybrid dark-gray".split(" "),
                schemes: {
                    streets: {
                        common: h,
                        primary: "div-bluegreen-yellow-orange",
                        secondary: ["div-orange-yellow-blue-light", "div-green-yellow-redpurple", "div-green-yellow-orange"].concat(m)
                    },
                    gray: {
                        common: h,
                        primary: "div-orange-purple",
                        secondary: ["div-bluegreen-purple", "div-bluegreen-orange", "div-orange-pink"].concat(m)
                    },
                    topo: {
                        common: h,
                        primary: "div-orange-pink",
                        secondary: ["div-redpurple-blue", "div-orange-blue", "div-green-pink"].concat(m)
                    },
                    terrain: {
                        common: h,
                        primary: "div-bluegreen-orange",
                        secondary: ["div-bluegreen-redpurple", "div-green-redpurple", "div-green-orange"].concat(m)
                    },
                    "national-geographic": {
                        common: h,
                        primary: "div-orange-yellow-blue-light",
                        secondary: ["div-bluegreen-yellow-orange", "div-green-yellow-redpurple"].concat(m)
                    },
                    oceans: {
                        common: h,
                        primary: "div-red-yellow-pink",
                        secondary: ["div-blue-green", "div-bluegreen-yellow-redpurple", "div-bluegreen-yellow-orange"].concat(m)
                    },
                    osm: {
                        common: h,
                        primary: "div-bluegreen-pink",
                        secondary: ["div-bluegreen-redpurple", "div-bluegreen-orange", "div-orange-pink"].concat(m)
                    },
                    satellite: {
                        common: p,
                        primary: "div-orange-yellow-blue-dark",
                        secondary: ["div-red-yellow-purple", "div-orange-yellow-pink", "div-orange-yellow-blue-light"].concat(m)
                    },
                    hybrid: {
                        common: p,
                        primary: "div-orange-yellow-blue-dark",
                        secondary: ["div-red-yellow-purple", "div-orange-yellow-pink", "div-orange-yellow-blue-light"].concat(m)
                    },
                    "dark-gray": {
                        common: p,
                        primary: "div-orange-gray-blue",
                        secondary: ["div-yellow-gray-purple", "div-red-gray-blue", "div-green-gray-purple"].concat(m)
                    }
                }
            },
            "centered-on": {
                name: "centered-on",
                label: "TODO",
                description: "TODO",
                basemaps: "streets gray topo terrain national-geographic oceans osm satellite hybrid dark-gray".split(" "),
                schemes: {
                    streets: {
                        common: {
                            outline: g,
                            width: 2,
                            size: 8
                        },
                        primary: "highlight-orange",
                        secondary: ["highlight-bluegreen", "highlight-orange-gray", "highlight-bluegreen-gray"]
                    },
                    gray: {
                        common: {
                            outline: g,
                            width: 2,
                            size: 8
                        },
                        primary: "highlight-orange",
                        secondary: ["highlight-purple",
                            "highlight-orange-gray", "highlight-purple-gray"
                        ]
                    },
                    topo: {
                        common: {
                            outline: g,
                            width: 2,
                            size: 8
                        },
                        primary: "highlight-orange",
                        secondary: ["highlight-pink", "highlight-orange-gray", "highlight-pink-gray"]
                    },
                    terrain: {
                        common: {
                            outline: g,
                            width: 2,
                            size: 8
                        },
                        primary: "highlight-orange",
                        secondary: ["highlight-bluegreen", "highlight-orange-gray", "highlight-bluegreen-gray"]
                    },
                    "national-geographic": {
                        common: {
                            outline: g,
                            width: 2,
                            size: 8
                        },
                        primary: "highlight-orange",
                        secondary: ["highlight-blue", "highlight-orange-gray", "highlight-blue-gray"]
                    },
                    oceans: {
                        common: {
                            outline: g,
                            width: 2,
                            size: 8
                        },
                        primary: "highlight-red",
                        secondary: ["highlight-pink", "highlight-red-gray", "highlight-pink-gray"]
                    },
                    osm: {
                        common: {
                            outline: g,
                            width: 2,
                            size: 8
                        },
                        primary: "highlight-pink",
                        secondary: ["highlight-bluegreen", "highlight-pink-gray", "highlight-bluegreen-gray"]
                    },
                    satellite: {
                        common: {
                            outline: n,
                            width: 2,
                            size: 8
                        },
                        primary: "highlight-orange-dark",
                        secondary: ["highlight-blue-dark", "highlight-orange-gray-dark", "highlight-blue-gray-dark"]
                    },
                    hybrid: {
                        common: {
                            outline: n,
                            width: 2,
                            size: 8
                        },
                        primary: "highlight-orange-dark",
                        secondary: ["highlight-blue-dark", "highlight-orange-gray-dark", "highlight-blue-gray-dark"]
                    },
                    "dark-gray": {
                        common: {
                            outline: n,
                            width: 2,
                            size: 8
                        },
                        primary: "highlight-orange-bright",
                        secondary: ["highlight-blue-bright", "highlight-orange-gray-bright", "highlight-blue-gray-bright"]
                    }
                }
            },
            extremes: {
                name: "extremes",
                label: "TODO",
                description: "TODO",
                basemaps: "streets gray topo terrain national-geographic oceans osm satellite hybrid dark-gray".split(" "),
                schemes: {
                    streets: {
                        common: {
                            outline: g,
                            width: 2,
                            size: 8
                        },
                        primary: "extremesdiv-bluegreen-yellow-orange",
                        secondary: "extremesdiv-orange-yellow-blue-light extremesdiv-green-yellow-redpurple extremesdiv-green-yellow-orange extremes-orange extremes-bluegreen extremes-orange-gray extremes-bluegreen-gray".split(" ")
                    },
                    gray: {
                        common: {
                            outline: g,
                            width: 2,
                            size: 8
                        },
                        primary: "extremesdiv-orange-purple",
                        secondary: "extremesdiv-bluegreen-purple extremesdiv-bluegreen-orange extremesdiv-orange-pink extremes-orange extremes-purple extremes-orange-gray extremes-purple-gray".split(" ")
                    },
                    topo: {
                        common: {
                            outline: g,
                            width: 2,
                            size: 8
                        },
                        primary: "extremesdiv-orange-pink",
                        secondary: "extremesdiv-redpurple-blue extremesdiv-orange-blue extremesdiv-green-pink extremes-orange extremes-pink extremes-orange-gray extremes-pink-gray".split(" ")
                    },
                    terrain: {
                        common: {
                            outline: g,
                            width: 2,
                            size: 8
                        },
                        primary: "extremesdiv-bluegreen-orange",
                        secondary: "extremesdiv-bluegreen-redpurple extremesdiv-green-redpurple extremesdiv-green-orange extremes-orange extremes-bluegreen extremes-orange-gray extremes-bluegreen-gray".split(" ")
                    },
                    "national-geographic": {
                        common: {
                            outline: g,
                            width: 2,
                            size: 8
                        },
                        primary: "extremesdiv-orange-yellow-blue-light",
                        secondary: "extremesdiv-bluegreen-yellow-orange extremesdiv-green-yellow-redpurple extremes-orange extremes-blue extremes-orange-gray extremes-blue-gray".split(" ")
                    },
                    oceans: {
                        common: {
                            outline: g,
                            width: 2,
                            size: 8
                        },
                        primary: "extremesdiv-red-yellow-pink",
                        secondary: "extremesdiv-blue-green extremesdiv-bluegreen-yellow-redpurple extremesdiv-bluegreen-yellow-orange extremes-red extremes-pink extremes-red-gray extremes-pink-gray".split(" ")
                    },
                    osm: {
                        common: {
                            outline: g,
                            width: 2,
                            size: 8
                        },
                        primary: "extremesdiv-bluegreen-pink",
                        secondary: "extremesdiv-bluegreen-redpurple extremesdiv-bluegreen-orange extremesdiv-orange-pink extremes-pink extremes-bluegreen extremes-pink-gray extremes-bluegreen-gray".split(" ")
                    },
                    satellite: {
                        common: {
                            outline: n,
                            width: 2,
                            size: 8
                        },
                        primary: "extremesdiv-orange-yellow-blue-dark",
                        secondary: "extremesdiv-red-yellow-purple extremesdiv-orange-yellow-pink extremesdiv-orange-yellow-blue-light extremes-orange-dark extremes-blue-dark extremes-orange-gray-dark extremes-blue-gray-dark".split(" ")
                    },
                    hybrid: {
                        common: {
                            outline: n,
                            width: 2,
                            size: 8
                        },
                        primary: "extremesdiv-orange-yellow-blue-dark",
                        secondary: "extremesdiv-red-yellow-purple extremesdiv-orange-yellow-pink extremesdiv-orange-yellow-blue-light extremes-orange-dark extremes-blue-dark extremes-orange-gray-dark extremes-blue-gray-dark".split(" ")
                    },
                    "dark-gray": {
                        common: {
                            outline: n,
                            width: 2,
                            size: 8
                        },
                        primary: "extremesdiv-orange-gray-blue",
                        secondary: "extremesdiv-yellow-gray-purple extremesdiv-red-gray-blue extremesdiv-green-gray-purple extremes-orange-bright extremes-blue-bright extremes-orange-gray-bright extremes-blue-gray-bright".split(" ")
                    }
                }
            },
            "group-similar": {
                name: "group-similar",
                label: "TODO",
                description: "TODO",
                basemapGroups: {
                    light: "streets gray topo terrain national-geographic oceans osm".split(" "),
                    dark: ["satellite", "hybrid", "dark-gray"]
                },
                schemes: {
                    light: {
                        common: h,
                        primary: "spectral",
                        secondary: ["cat-dark-6", "cat-light-6"]
                    },
                    dark: {
                        common: p,
                        primary: "spectral",
                        secondary: ["cat-dark-6", "cat-light-6"]
                    }
                }
            }
        },
        r = {};
    x.mixin(r, {
        getAvailableThemes: function(a) {
            var b = [],
                d, c, f;
            for (d in t) c = t[d], f = A(c), a && -1 === k.indexOf(f, a) || b.push({
                name: c.name,
                label: c.label,
                description: c.description,
                basemaps: f
            });
            return b
        },
        getSchemes: function(a) {
            var b = a.theme,
                d = a.basemap,
                c = w(a.geometryType),
                f, e;
            (f = v(t[b], d)) && (e = {
                primaryScheme: s(f.primary, f.common, c, b, d),
                secondarySchemes: k.map(f.secondary, function(a) {
                    return s(a, f.common, c, b, d)
                })
            });
            return e
        },
        getSchemeById: function(a) {
            var b, d, c, f, e;
            e = a.id;
            a = w(a.geometryType);
            if (e && (e = e.split("/"))) d = e[0], c = e[1], f = e[2];
            (e = v(t[d], c)) && (b = s(f, e.common, a, d, c));
            return b
        },
        cloneScheme: function(a) {
            var b;
            a && (b = x.mixin({}, a), b.colors = u(b.colors),
                b.colorsForClassBreaks = k.map(b.colorsForClassBreaks, function(a) {
                    return {
                        numClasses: a.numClasses,
                        colors: u(a.colors)
                    }
                }), b.noDataColor && (b.noDataColor = new q(b.noDataColor)), b.outline && (b.outline = {
                    color: b.outline.color && new q(b.outline.color),
                    width: b.outline.width
                }));
            return b
        },
        flipColors: function(a, b) {
            var d = b ? a : r.cloneScheme(a);
            d.colors.reverse();
            k.forEach(d.colorsForClassBreaks, function(a) {
                a.colors.reverse()
            });
            return d
        },
        getMatchingSchemes: function(a) {
            var b = a.theme,
                d = w(a.geometryType),
                c = a.colors,
                f = t[b];
            a = A(f);
            var e, g = [];
            k.forEach(a, function(a) {
                var h = v(f, a);
                h && ((e = z(s(h.primary, h.common, d, b, a), c)) && g.push(e), k.forEach(h.secondary, function(f) {
                    (e = z(s(f, h.common, d, b, a), c)) && g.push(e)
                }))
            });
            return g
        }
    });
    return r
});