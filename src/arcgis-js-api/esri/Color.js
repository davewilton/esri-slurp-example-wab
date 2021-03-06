//>>built
define(["dojo/_base/declare", "dojo/_base/Color", "dojo/has", "./kernel"], function(b, e, c, d) {
    b = b([e], {
        declaredClass: "esri.Color"
    });
    b.toJsonColor = function(a) {
        return a && [a.r, a.g, a.b, 1 < a.a ? a.a : Math.round(255 * a.a)]
    };
    b.toDojoColor = function(a) {
        return a && new e([a[0], a[1], a[2], a[3] / 255])
    };
    d = "named blendColors fromRgb fromHex fromArray fromString".split(" ");
    for (c = 0; c < d.length; c++) b[d[c]] = e[d[c]];
    return b
});