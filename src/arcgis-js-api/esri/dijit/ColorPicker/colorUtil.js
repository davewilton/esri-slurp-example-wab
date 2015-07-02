//>>built
define(["dojo/_base/lang", "esri/Color"], function(h, e) {
    var c = {
        equal: function(a, b) {
            return a && b && a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a
        },
        normalizeHex: function(a) {
            return "#" + h.trim(a).replace(/#/g, "").substr(0, 6)
        },
        normalizeColor: function(a) {
            return new e(a)
        },
        isValidHex: function(a) {
            return c.isShorthandHex(a) || c.isLonghandHex(a)
        },
        _shortHandHex: /^#[0-9A-F]{3}$/i,
        isShorthandHex: function(a) {
            return a && 4 === a.length && c._shortHandHex.test(a)
        },
        _longhandHex: /^#[0-9A-F]{6}$/i,
        isLonghandHex: function(a) {
            return a &&
                7 === a.length && c._longhandHex.test(a)
        },
        getContrastingColor: function(a) {
            return c.isBright(a) ? this.darker(a) : this.brighter(a, 3)
        },
        isBright: function(a) {
            return 127 <= 0.299 * a.r + 0.587 * a.g + 0.114 * a.b
        },
        darker: function(a, b) {
            var d = Math.pow(0.7, b ? b : 1);
            return new e([Math.round(a.r * d), Math.round(a.g * d), Math.round(a.b * d), a.a])
        },
        brighter: function(a, b) {
            var d = Math.pow(0.7, b ? b : 1),
                c = a.r,
                f = a.g,
                g = a.b;
            30 > c && (c = 30);
            30 > f && (f = 30);
            30 > g && (g = 30);
            return new e([Math.min(255, Math.round(c / d)), Math.min(255, Math.round(f / d)), Math.min(255,
                Math.round(g / d)), a.a])
        }
    };
    return c
});