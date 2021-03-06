//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/Color", "dojo/has", "dojox/gfx/_base", "../kernel", "../lang", "./MarkerSymbol", "./SimpleLineSymbol"], function(d, m, s, u, p, v, q, t, r) {
    var e = {
            STYLE_CIRCLE: "circle",
            STYLE_SQUARE: "square",
            STYLE_CROSS: "cross",
            STYLE_X: "x",
            STYLE_DIAMOND: "diamond",
            STYLE_PATH: "path",
            STYLE_TARGET: "target"
        },
        n = {
            style: e.STYLE_CIRCLE,
            color: [255, 255, 255, 0.25],
            size: 12,
            angle: 0,
            xoffset: 0,
            yoffset: 0
        };
    d = d(t, {
        declaredClass: "esri.symbol.SimpleMarkerSymbol",
        type: "simplemarkersymbol",
        _styles: {
            circle: "esriSMSCircle",
            square: "esriSMSSquare",
            cross: "esriSMSCross",
            x: "esriSMSX",
            diamond: "esriSMSDiamond",
            path: "esriSMSPath"
        },
        constructor: function(a, b, c, d) {
            a ? m.isString(a) ? (this.style = a, b && (this.size = b), c && (this.outline = c), d && (this.color = d)) : (this.style = q.valueOf(this._styles, this.style), a.outline && (this.outline = new r(a.outline))) : (m.mixin(this, n), this.size = p.pt2px(this.size), this.outline = new r(this.outline), this.color = new s(this.color));
            this.style || (this.style = e.STYLE_CIRCLE)
        },
        setStyle: function(a) {
            this.style = a;
            return this
        },
        setPath: function(a) {
            this.path = a;
            this.setStyle(e.STYLE_PATH);
            return this
        },
        setOutline: function(a) {
            this.outline = a;
            return this
        },
        getStroke: function() {
            return this.outline && this.outline.getStroke()
        },
        getFill: function() {
            return this.color
        },
        _setDim: function(a, b, c) {
            this._targetWidth = a;
            this._targetHeight = b;
            this._spikeSize = c
        },
        getShapeDescriptors: function() {
            var a, b, c, d = this.style,
                l = (this.size || p.pt2px(n.size)) / 2,
                f = 0 - l,
                h = 0 + l,
                k = 0 - l,
                g = 0 + l;
            switch (d) {
                case e.STYLE_CIRCLE:
                    a = {
                        type: "circle",
                        cx: 0,
                        cy: 0,
                        r: l
                    };
                    b = this.getFill();
                    if (c = this.getStroke()) c.style = c.style || "Solid";
                    break;
                case e.STYLE_CROSS:
                    a = {
                        type: "path",
                        path: "M " + f + ",0 L " + h + ",0 M 0," + k + " L 0," + g + " E"
                    };
                    b = null;
                    c = this.getStroke();
                    break;
                case e.STYLE_DIAMOND:
                    a = {
                        type: "path",
                        path: "M " + f + ",0 L 0," + k + " L " + h + ",0 L 0," + g + " L " + f + ",0 E"
                    };
                    b = this.getFill();
                    c = this.getStroke();
                    break;
                case e.STYLE_SQUARE:
                    a = {
                        type: "path",
                        path: "M " + f + "," + g + " L " + f + "," + k + " L " + h + "," + k + " L " + h + "," + g + " L " + f + "," + g + " E"
                    };
                    b = this.getFill();
                    c = this.getStroke();
                    break;
                case e.STYLE_X:
                    a = {
                        type: "path",
                        path: "M " +
                            f + "," + g + " L " + h + "," + k + " M " + f + "," + k + " L " + h + "," + g + " E"
                    };
                    b = null;
                    c = this.getStroke();
                    break;
                case e.STYLE_PATH:
                    a = {
                        type: "path",
                        path: this.path || ""
                    }, b = this.getFill(), c = this.getStroke()
            }
            return {
                defaultShape: a,
                fill: b,
                stroke: c
            }
        },
        toJson: function() {
            var a = m.mixin(this.inherited("toJson", arguments), {
                    type: "esriSMS",
                    style: this._styles[this.style]
                }),
                b = this.outline;
            b && (a.outline = b.toJson());
            a.path = this.path;
            return q.fixJson(a)
        }
    });
    m.mixin(d, e);
    d.defaultProps = n;
    return d
});