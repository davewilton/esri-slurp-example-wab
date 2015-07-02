//>>built
define(["../../symbol", "dojo/Deferred", "dojo/dom-construct", "dojo/on", "dojox/gfx"], function(f, m, h, k, n) {
    var g = {
        isPoint: function(a) {
            return g._isType(a, "marker")
        },
        _isType: function(a, c) {
            return a && -1 < a.type.indexOf(c + "symbol")
        },
        isLine: function(a) {
            return g._isType(a, "line")
        },
        isPolygon: function(a) {
            return g._isType(a, "fill")
        },
        getOutline: function(a) {
            return "simplelinesymbol" === a.type || "cartographiclinesymbol" === a.type ? a : a.outline
        },
        cloneSymbol: function(a) {
            return f.jsonUtils.fromJson(a.toJson())
        },
        setOutlineWidth: function(a,
            c) {
            !isNaN(c) && a && g.getOutline(a).setWidth(c)
        },
        setOutlineStyle: function(a, c) {
            if (c && a) {
                var d = g.getOutline(a);
                c = d.color ? c : f.SimpleLineSymbol.STYLE_NULL;
                d.setStyle(c)
            }
        },
        setSize: function(a, c) {
            if (a && !isNaN(c)) {
                var d = a.width,
                    b = c,
                    e;
                if (d != b)
                    if ("picturemarkersymbol" === a.type) {
                        if (e = a.url, a.setHeight(a.height / a.width * b), a.setWidth(b), e && !("http://" === e || -1 === e.indexOf("http://") && -1 === e.indexOf("data:")))
                            if (a.xoffset || a.yoffset) b = a.width, d = b / d, a.setOffset(Math.round(a.xoffset * d), Math.round(a.yoffset * d))
                    } else a.setSize(b)
            }
        },
        getMarkerLength: function(a) {
            return isNaN(a.width) ? a.size : Math.max(a.width, a.height)
        },
        hasColor: function(a) {
            return a && a.color
        },
        setFillColor: function(a, c) {
            a.setColor(c)
        },
        setOutlineColor: function(a, c) {
            g.getOutline(a).setColor(c)
        },
        renderOnSurface: function(a, c) {
            if (a) {
                var d = 80,
                    b = 30,
                    e = g.isLine(a),
                    l = a.outline ? 1.5 * a.outline.width : 1;
                if (e) d = 190, b = 20;
                else if ("simplemarkersymbol" === a.type) b = d = a.size;
                else if ("picturemarkersymbol" === a.type) {
                    if (!a.url || "http://" === a.url || -1 === a.url.indexOf("http://") && -1 === a.url.indexOf("https://") &&
                        -1 === a.url.indexOf("data:")) return;
                    b = d = Math.max(a.width, a.height)
                }
                d = n.createSurface(c, d + l, b + l);
                b = f.jsonUtils.getShapeDescriptors(a);
                e && (b.defaultShape.path = "M -90,0 L 90,0 E");
                e = d.createShape(b.defaultShape).setFill(b.fill).setStroke(b.stroke);
                b = d.getDimensions();
                e.applyTransform({
                    dx: 0.5 * b.width,
                    dy: 0.5 * b.height
                });
                return d
            }
        },
        toFullLineStyle: function(a) {
            switch (a) {
                case "dot":
                    a = f.SimpleLineSymbol.STYLE_DOT;
                    break;
                case "dash":
                    a = f.SimpleLineSymbol.STYLE_DASH;
                    break;
                case "dashdot":
                    a = f.SimpleLineSymbol.STYLE_DASHDOT;
                    break;
                case "dashdotdot":
                    a = f.SimpleLineSymbol.STYLE_DASHDOTDOT;
                    break;
                default:
                    a = f.SimpleLineSymbol.STYLE_SOLID
            }
            return a
        },
        testImageUrl: function(a) {
            var c = new m,
                d = c.promise,
                b = h.create("img"),
                e, f;
            e = k(b, "load", function() {
                0 === b.width && 0 === b.height ? c.reject() : c.resolve()
            });
            f = k(b, "error", function() {
                c.reject()
            });
            b.src = a;
            d.always(function() {
                e.remove();
                f.remove();
                h.destroy(b)
            });
            return d
        }
    };
    return g
});