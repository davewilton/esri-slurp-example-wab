//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/json", "dojo/has", "../kernel", "../layerUtils"], function(k, m, e, f, n, p, l) {
    return k(null, {
        declaredClass: "esri.tasks.FindParameters",
        searchText: null,
        contains: !0,
        searchFields: null,
        outSpatialReference: null,
        layerIds: null,
        returnGeometry: !1,
        layerDefinitions: null,
        dynamicLayerInfos: null,
        toJson: function() {
            var a = {
                    searchText: this.searchText,
                    contains: this.contains,
                    returnGeometry: this.returnGeometry,
                    maxAllowableOffset: this.maxAllowableOffset
                },
                b = this.layerIds,
                g = this.searchFields,
                c = this.outSpatialReference;
            b && (a.layers = b.join(","));
            g && (a.searchFields = g.join(","));
            c && (a.sr = c.wkid || f.toJson(c.toJson()));
            a.layerDefs = l._serializeLayerDefinitions(this.layerDefinitions);
            if (this.dynamicLayerInfos && 0 < this.dynamicLayerInfos.length) {
                var h = [];
                e.forEach(this.dynamicLayerInfos, function(a) {
                    if (!a.subLayerIds) {
                        var b = a.id;
                        if (this.layerIds && -1 !== e.indexOf(this.layerIds, b)) {
                            var c = {
                                id: b
                            };
                            c.source = a.source && a.source.toJson();
                            var d;
                            this.layerDefinitions && this.layerDefinitions[b] &&
                                (d = this.layerDefinitions[b]);
                            d && (c.definitionExpression = d);
                            h.push(c)
                        }
                    }
                }, this);
                b = f.toJson(h);
                "[]" === b && (b = "[{}]");
                a.dynamicLayers = b
            }
            return a
        }
    })
});