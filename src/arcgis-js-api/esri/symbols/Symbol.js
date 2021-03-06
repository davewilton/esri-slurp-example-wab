//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../lang", "../Color"], function(d, c, f, g, e, b) {
    return d(null, {
        declaredClass: "esri.symbol.Symbol",
        color: new b([0, 0, 0, 1]),
        type: null,
        constructor: function(a) {
            if (a && c.isObject(a) && (c.mixin(this, a), this.color && e.isDefined(this.color[0]) && (this.color = b.toDojoColor(this.color)), (a = this.type) && 0 === a.indexOf("esri"))) this.type = {
                esriSMS: "simplemarkersymbol",
                esriPMS: "picturemarkersymbol",
                esriSLS: "simplelinesymbol",
                esriCLS: "cartographiclinesymbol",
                esriSFS: "simplefillsymbol",
                esriPFS: "picturefillsymbol",
                esriTS: "textsymbol",
                esriSHD: "shieldlabelsymbol"
            }[a]
        },
        setColor: function(a) {
            this.color = a;
            return this
        },
        toJson: function() {
            return {
                color: b.toJsonColor(this.color)
            }
        }
    })
});