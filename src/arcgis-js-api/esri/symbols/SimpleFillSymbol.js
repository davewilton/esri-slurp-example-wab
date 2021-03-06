//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/Color", "dojo/has", "dojox/gfx/_base", "../kernel", "../lang", "./FillSymbol", "./SimpleLineSymbol", "require"], function(b, d, g, n, h, p, e, k, l, m) {
    var c = {
            STYLE_SOLID: "solid",
            STYLE_NULL: "none",
            STYLE_HORIZONTAL: "horizontal",
            STYLE_VERTICAL: "vertical",
            STYLE_FORWARD_DIAGONAL: "forwarddiagonal",
            STYLE_BACKWARD_DIAGONAL: "backwarddiagonal",
            STYLE_CROSS: "cross",
            STYLE_DIAGONAL_CROSS: "diagonalcross",
            STYLE_FORWARDDIAGONAL: "forwarddiagonal",
            STYLE_BACKWARDDIAGONAL: "backwarddiagonal",
            STYLE_DIAGONALCROSS: "diagonalcross"
        },
        f = {
            style: c.STYLE_SOLID,
            color: [0, 0, 0, 0.25]
        };
    b = b(k, {
        declaredClass: "esri.symbol.SimpleFillSymbol",
        type: "simplefillsymbol",
        patternUrlPrefix: m.toUrl("../images/symbol/sfs/"),
        _styles: {
            solid: "esriSFSSolid",
            none: "esriSFSNull",
            horizontal: "esriSFSHorizontal",
            vertical: "esriSFSVertical",
            forwarddiagonal: "esriSFSForwardDiagonal",
            backwarddiagonal: "esriSFSBackwardDiagonal",
            cross: "esriSFSCross",
            diagonalcross: "esriSFSDiagonalCross"
        },
        constructor: function(a, b, c) {
            a ? d.isString(a) ? (this.style =
                a, void 0 !== b && (this.outline = b), void 0 !== c && (this.color = c)) : this.style = e.valueOf(this._styles, a.style) : (d.mixin(this, f), this.outline = new l(this.outline), this.color = new g(this.color))
        },
        setStyle: function(a) {
            this.style = a;
            return this
        },
        getStroke: function() {
            return this.outline && this.outline.getStroke()
        },
        getFill: function() {
            var a = this.style;
            return a === c.STYLE_NULL ? null : a === c.STYLE_SOLID ? this.color : d.mixin({}, h.defaultPattern, {
                src: this.patternUrlPrefix + a + ".png",
                width: 10,
                height: 10
            })
        },
        getShapeDescriptors: function() {
            return {
                defaultShape: {
                    type: "path",
                    path: "M -10,-10 L 10,0 L 10,10 L -10,10 L -10,-10 E"
                },
                fill: this.getFill(),
                stroke: this.getStroke()
            }
        },
        toJson: function() {
            return e.fixJson(d.mixin(this.inherited("toJson", arguments), {
                type: "esriSFS",
                style: this._styles[this.style]
            }))
        }
    });
    d.mixin(b, c);
    b.defaultProps = f;
    return b
});