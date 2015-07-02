//>>built
define(["dojo/_base/array", "dojo/_base/lang", "dojo/has", "../kernel", "../Color", "./colors"], function(l, r, m, e, g, s) {
    function p(b, a) {
        return l.map(b, function(b) {
            b = new g(b);
            null != a && (b.a = a);
            return b
        })
    }

    function q(b, a, f) {
        var c;
        if (b = s[b]) switch (c = {}, c.colors = p(b.stops, a.fillOpacity), c.noDataColor = new g(a.noDataColor), null != a.fillOpacity && (c.noDataColor.a = a.fillOpacity || 1), f) {
            case "point":
                c.outline = {
                    color: new g(a.outline.color),
                    width: a.outline.width
                };
                c.size = a.size;
                break;
            case "line":
                c.width = a.width;
                break;
            case "polygon":
                c.outline = {
                    color: new g(a.outline.color),
                    width: a.outline.width
                }
        }
        return c
    }

    function t(b) {
        "esriGeometryPoint" === b || "esriGeometryMultipoint" === b ? b = "point" : "esriGeometryPolyline" === b ? b = "line" : "esriGeometryPolygon" === b && (b = "polygon");
        return b
    }
    m = {
        color: [153, 153, 153, 1],
        width: 1
    };
    e = "tropical-bliss desert-blooms under-the-sea vibrant-rainbow ocean-bay prairie-summer pastel-chalk".split(" ");
    var h = {
            "default": {
                name: "default",
                label: "Default",
                description: "Default theme for visualizing features by their type.",
                basemapGroups: {
                    light: "streets gray topo terrain national-geographic oceans osm".split(" "),
                    dark: ["satellite", "hybrid", "dark-gray"]
                },
                pointSchemes: {
                    light: {
                        common: {
                            noDataColor: "#aaaaaa",
                            outline: m,
                            size: 8
                        },
                        primary: "cat-dark",
                        secondary: ["cat-light"].concat(e)
                    },
                    dark: {
                        common: {
                            noDataColor: "#aaaaaa",
                            outline: {
                                color: [26, 26, 26, 1],
                                width: 1
                            },
                            size: 8
                        },
                        primary: "cat-light",
                        secondary: ["cat-dark"].concat(e)
                    }
                },
                lineSchemes: {
                    light: {
                        common: {
                            noDataColor: "#aaaaaa",
                            width: 2
                        },
                        primary: "cat-dark",
                        secondary: ["cat-light"].concat(e)
                    },
                    dark: {
                        common: {
                            noDataColor: "#aaaaaa",
                            width: 2
                        },
                        primary: "cat-light",
                        secondary: ["cat-dark"].concat(e)
                    }
                },
                polygonSchemes: {
                    light: {
                        common: {
                            noDataColor: "#aaaaaa",
                            outline: m,
                            fillOpacity: 0.8
                        },
                        primary: "cat-dark",
                        secondary: ["cat-light"].concat(e)
                    },
                    dark: {
                        common: {
                            noDataColor: "#aaaaaa",
                            outline: {
                                color: [51, 51, 51, 1],
                                width: 1
                            },
                            fillOpacity: 0.8
                        },
                        primary: "cat-light",
                        secondary: ["cat-dark"].concat(e)
                    }
                }
            }
        },
        n = {};
    (function() {
        var b, a, f, c, d, e, g, k;
        for (b in h)
            for (c in a = h[b], f = a.basemapGroups, d = n[b] = {
                    basemaps: [].concat(f.light).concat(f.dark),
                    point: {},
                    line: {},
                    polygon: {}
                }, f) {
                e = f[c];
                for (g = 0; g < e.length; g++) k = e[g], a.pointSchemes && (d.point[k] =
                    a.pointSchemes[c]), a.lineSchemes && (d.line[k] = a.lineSchemes[c]), a.polygonSchemes && (d.polygon[k] = a.polygonSchemes[c])
            }
    })();
    return {
        getAvailableThemes: function(b) {
            var a = [],
                f, c, d;
            for (f in h) c = h[f], d = n[f], b && -1 === l.indexOf(d.basemaps, b) || a.push({
                name: c.name,
                label: c.label,
                description: c.description,
                basemaps: d.basemaps.slice(0)
            });
            return a
        },
        getSchemes: function(b) {
            var a = b.theme,
                f = b.basemap,
                c = t(b.geometryType);
            b = n[a];
            var d, e;
            (d = (d = b && b[c]) && d[f]) && (e = {
                primaryScheme: q(d.primary, d.common, c),
                secondarySchemes: l.map(d.secondary,
                    function(a) {
                        return q(a, d.common, c)
                    })
            });
            return e
        },
        cloneScheme: function(b) {
            var a;
            b && (a = r.mixin({}, b), a.colors = p(a.colors), a.noDataColor && (a.noDataColor = new g(a.noDataColor)), a.outline && (a.outline = {
                color: a.outline.color && new g(a.outline.color),
                width: a.outline.width
            }));
            return a
        }
    }
});