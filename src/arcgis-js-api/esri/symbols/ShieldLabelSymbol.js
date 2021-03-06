//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/sniff", "dojox/gfx/_base", "../kernel", "../lang", "../urlUtils", "./MarkerSymbol", "./Font"], function(c, f, k, e, q, l, m, n, p) {
    var g = {
        url: "",
        width: 12,
        height: 12,
        angle: 0,
        xoffset: 0,
        yoffset: 0
    };
    c = c(n, {
        declaredClass: "esri.symbol.ShieldLabelSymbol",
        type: "shieldlabelsymbol",
        color: [255, 255, 255, 1],
        width: 32,
        height: 32,
        font: e.defaultFont,
        constructor: function(a, b, d, h, c) {
            a ? f.isString(a) ? (this.url = a, b && (this.color = b), d && (this.width = d), h && (this.height = h), void 0 !== c && (this.font = c)) :
                (this.width = e.pt2px(a.width), this.height = e.pt2px(a.height), b = a.imageData, !(9 > k("ie")) && b && (d = this.url, this.url = "data:" + (a.contentType || "image") + ";base64," + b, this.imageData = d)) : f.mixin(this, g)
        },
        getStroke: function() {
            return null
        },
        getFill: function() {
            return this.color
        },
        setWidth: function(a) {
            this.width = a;
            return this
        },
        setHeight: function(a) {
            this.height = a;
            return this
        },
        setUrl: function(a) {
            a !== this.url && (delete this.imageData, delete this.contentType);
            this.url = a;
            return this
        },
        setFont: function(a) {
            this.font = a;
            return this
        },
        setText: function(a) {
            this.text = a;
            return this
        },
        getWidth: function() {
            return this.width
        },
        getHeight: function() {
            return this.height
        },
        getShapeDescriptors: function() {
            return {
                defaultShape: {
                    type: "image",
                    x: -Math.round(this.width / 2),
                    y: -Math.round(this.height / 2),
                    width: this.width,
                    height: this.height,
                    src: this.url || ""
                },
                fill: null,
                stroke: null
            }
        },
        toJson: function() {
            var a = this.url,
                b = this.imageData;
            if (0 === a.indexOf("data:")) var d = a,
                a = b,
                b = d.indexOf(";base64,") + 8,
                b = d.substr(b);
            var a = m.getAbsoluteUrl(a),
                d = e.px2pt(this.width),
                d = isNaN(d) ? void 0 : d,
                c = e.px2pt(this.height),
                c = isNaN(c) ? void 0 : c,
                a = l.fixJson(f.mixin(this.inherited("toJson", arguments), {
                    type: "esriSHD",
                    url: a,
                    imageData: b,
                    contentType: this.contentType,
                    width: d,
                    height: c
                }));
            this.font ? (b = new p(this.font), a.font = b.toJson()) : a.font = null;
            delete a.size;
            a.imageData || delete a.imageData;
            return a
        }
    });
    c.defaultProps = g;
    return c
});