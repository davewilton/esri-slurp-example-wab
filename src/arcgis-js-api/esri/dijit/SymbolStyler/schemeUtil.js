//>>built
define(["../../Color", "dojo/_base/array", "dojo/_base/lang"], function(g, e, h) {
    var d = {
        getColorRamps: function(a, b) {
            var c = d.getColorRampsWithSchemes(a, b);
            return e.map(c, function(b) {
                return b.colors
            })
        },
        getColorRampsWithSchemes: function(a, b) {
            var c = d._unify(a),
                f = [];
            e.forEach(c, function(a) {
                var c = !!a.colorsForClassBreaks,
                    c = 0 < b ? c ? d._maxSupportedClassBreakColors(a.colorsForClassBreaks, b) : a.colors : a.colors;
                f.push({
                    colors: c,
                    scheme: a
                })
            });
            return f
        },
        _unify: function(a) {
            return [a.primaryScheme].concat(a.secondarySchemes)
        },
        _maxSupportedClassBreakColors: function(a, b) {
            for (var c, f = a.length, d, e = 0; e < f; e++) {
                d = a[e];
                if (b < d.numClasses) break;
                c = d.colors
            }
            return c
        },
        getFillColors: function(a) {
            a = d._unify(a);
            var b = [],
                c;
            e.forEach(a, function(a) {
                c = a.marker || a;
                c.colors ? b = b.concat(c.colors) : b.push(c.color)
            });
            return d._removeDuplicates(b)
        },
        _removeDuplicates: function(a) {
            var b = {},
                c;
            return e.filter(a, function(a) {
                (c = !b[a.toHex()]) && (b[a.toHex()] = 1);
                return c
            })
        },
        getOutlineColors: function(a) {
            a = d._unify(a);
            var b = [],
                c;
            e.forEach(a, function(a) {
                c = a.marker ||
                    a;
                c.outline ? b.push(c.outline.color) : c.colors ? b = b.concat(c.colors) : b.push(c.color)
            });
            return d._removeDuplicates(b)
        },
        flipColors: function(a) {
            a.colors && a.colors.reverse();
            a.colorsForClassBreaks && e.forEach(a.colorsForClassBreaks, function(a) {
                1 < a.numClasses && a.colors.reverse()
            })
        },
        cloneScheme: function(a) {
            var b;
            a && (b = h.mixin({}, a), b.colors = d._createColors(b.colors), b.colorsForClassBreaks = e.map(b.colorsForClassBreaks, function(a) {
                    return {
                        numClasses: a.numClasses,
                        colors: d._createColors(a.colors)
                    }
                }), b.noDataColor &&
                (b.noDataColor = new g(b.noDataColor)), b.outline && (b.outline = {
                    color: b.outline.color && new g(b.outline.color),
                    width: b.outline.width
                }));
            return b
        },
        _createColors: function(a, b) {
            return e.map(a, function(a) {
                a = new g(a);
                null != b && (a.a = b);
                return a
            })
        }
    };
    return d
});