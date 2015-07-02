//>>built
define(["dojo/_base/array", "dojo/_base/lang", "dojo/has", "../kernel", "../Color"], function(f, n, q, r, p) {
    function d(a, b) {
        return f.map(a, function(a) {
            a = new p(a);
            null != b && (a.a = b);
            return a
        })
    }
    var l = {
            v1: "#85c1c8 #90a1be #9c8184 #a761aa #af4980 #b83055 #c0182a #c80000 #d33300 #de6600 #e99900 #f4cc00 #ffff00".split(" "),
            v2: "#f3e4e5 #e4becb #d498b2 #c57298 #b95685 #ae3972 #a21d5e #96004b #ab006f #c00093 #d500b7 #ea00db #ff00ff".split(" "),
            v3: "#d4e3f5 #b3c5f7 #93a6fa #7288fc #566ffd #3955fe #1d3bfe #0022ff #334ecc #667a99 #99a766 #ccd333 #ffff00".split(" "),
            v4: "#0022c8 #2b1ca7 #551785 #801164 #aa0b43 #d50621 #ff0000 #ff3900 #ff7100 #ffaa00 #ffc655 #ffe3aa #ffffff".split(" ")
        },
        g = {
            "default": {
                name: "default",
                label: "Default",
                description: "Default theme for visualizing features using heatmap.",
                basemapGroups: {
                    light: "streets gray topo terrain national-geographic oceans osm".split(" "),
                    dark: ["satellite", "hybrid", "dark-gray"]
                },
                schemes: {
                    light: {
                        primary: "v1",
                        secondary: ["v2", "v3", "v4"]
                    },
                    dark: {
                        primary: "v4",
                        secondary: ["v1", "v2", "v3"]
                    }
                }
            }
        },
        k = {};
    (function() {
        var a, b, c, e,
            m, f, h, d;
        for (a in g)
            for (e in b = g[a], c = b.basemapGroups, m = k[a] = {
                    basemaps: [].concat(c.light).concat(c.dark)
                }, c) {
                f = c[e];
                for (h = 0; h < f.length; h++) d = f[h], b.schemes && (m[d] = b.schemes[e])
            }
    })();
    return {
        getAvailableThemes: function(a) {
            var b = [],
                c, e, d;
            for (c in g) e = g[c], d = k[c], a && -1 === f.indexOf(d.basemaps, a) || b.push({
                name: e.name,
                label: e.label,
                description: e.description,
                basemaps: d.basemaps.slice(0)
            });
            return b
        },
        getSchemes: function(a) {
            var b = a.basemap;
            a = k[a.theme];
            var c;
            (b = a && a[b]) && (c = {
                primaryScheme: {
                    colors: d(l[b.primary],
                        0.7)
                },
                secondarySchemes: f.map(b.secondary, function(a) {
                    return {
                        colors: d(l[a], 0.7)
                    }
                })
            });
            return c
        },
        cloneScheme: function(a) {
            var b;
            a && (b = n.mixin({}, a), b.colors = d(b.colors));
            return b
        }
    }
});