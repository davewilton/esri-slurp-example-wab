//>>built
define(["dojo/_base/lang", "dojo/has", "../kernel", "./Point", "./Polyline", "./Polygon", "./Multipoint", "./Extent"], function(g, h, k, b, c, d, e, f) {
    return {
        fromJson: function(a) {
            if (void 0 !== a.x && void 0 !== a.y) return new b(a);
            if (void 0 !== a.paths) return new c(a);
            if (void 0 !== a.rings) return new d(a);
            if (void 0 !== a.points) return new e(a);
            if (void 0 !== a.xmin && void 0 !== a.ymin && void 0 !== a.xmax && void 0 !== a.ymax) return new f(a)
        },
        getJsonType: function(a) {
            return a instanceof b ? "esriGeometryPoint" : a instanceof c ? "esriGeometryPolyline" :
                a instanceof d ? "esriGeometryPolygon" : a instanceof f ? "esriGeometryEnvelope" : a instanceof e ? "esriGeometryMultipoint" : null
        },
        getGeometryType: function(a) {
            return "esriGeometryPoint" === a ? b : "esriGeometryPolyline" === a ? c : "esriGeometryPolygon" === a ? d : "esriGeometryEnvelope" === a ? f : "esriGeometryMultipoint" === a ? e : null
        }
    }
});