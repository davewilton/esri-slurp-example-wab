//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/Color", "dojo/has", "dojox/gfx/_base", "../kernel", "../lang", "./LineSymbol"], function(a, b, h, m, k, n, e, l) {
    var c = {
            STYLE_SOLID: "solid",
            STYLE_DASH: "dash",
            STYLE_DOT: "dot",
            STYLE_DASHDOT: "dashdot",
            STYLE_DASHDOTDOT: "longdashdotdot",
            STYLE_NULL: "none",
            STYLE_SHORTDASH: "shortdash",
            STYLE_SHORTDOT: "shortdot",
            STYLE_SHORTDASHDOT: "shortdashdot",
            STYLE_SHORTDASHDOTDOT: "shortdashdotdot",
            STYLE_LONGDASH: "longdash",
            STYLE_LONGDASHDOT: "longdashdot"
        },
        f = {
            color: [0, 0, 0, 1],
            style: c.STYLE_SOLID,
            width: 1
        };
    a = a(l, {
        declaredClass: "esri.symbol.SimpleLineSymbol",
        type: "simplelinesymbol",
        _styles: {
            solid: "esriSLSSolid",
            dash: "esriSLSDash",
            dot: "esriSLSDot",
            dashdot: "esriSLSDashDot",
            longdashdotdot: "esriSLSDashDotDot",
            none: "esriSLSNull",
            insideframe: "esriSLSInsideFrame",
            shortdash: "esriSLSShortDash",
            shortdot: "esriSLSShortDot",
            shortdashdot: "esriSLSShortDashDot",
            shortdashdotdot: "esriSLSShortDashDotDot",
            longdash: "esriSLSLongDash",
            longdashdot: "esriSLSLongDashDot"
        },
        constructor: function(d, a, g) {
            d ? b.isString(d) ? (this.style =
                d, a && (this.color = a), g && (this.width = g)) : this.style = e.valueOf(this._styles, d.style) || c.STYLE_SOLID : (b.mixin(this, f), this.color = new h(this.color), this.width = k.pt2px(this.width))
        },
        setStyle: function(a) {
            this.style = a;
            return this
        },
        getStroke: function() {
            return this.style === c.STYLE_NULL || 0 === this.width ? null : {
                color: this.color,
                style: this.style,
                width: this.width
            }
        },
        getFill: function() {
            return null
        },
        getShapeDescriptors: function() {
            return {
                defaultShape: {
                    type: "path",
                    path: "M -15,0 L 15,0 E"
                },
                fill: null,
                stroke: this.getStroke()
            }
        },
        toJson: function() {
            return e.fixJson(b.mixin(this.inherited("toJson", arguments), {
                type: "esriSLS",
                style: this._styles[this.style]
            }))
        }
    });
    b.mixin(a, c);
    a.defaultProps = f;
    return a
});