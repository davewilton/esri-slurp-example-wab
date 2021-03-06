//>>built
define(["dojo/_base/lang", "dojo/has", "../kernel", "./SimpleMarkerSymbol", "./PictureMarkerSymbol", "./SimpleLineSymbol", "./CartographicLineSymbol", "./SimpleFillSymbol", "./PictureFillSymbol", "./TextSymbol"], function(l, m, n, d, e, f, c, g, h, k) {
    return {
        fromJson: function(a) {
            var b = null;
            switch (a.type) {
                case "esriSMS":
                    b = new d(a);
                    break;
                case "esriPMS":
                    b = new e(a);
                    break;
                case "esriTS":
                    b = new k(a);
                    break;
                case "esriSLS":
                    b = void 0 !== a.cap ? new c(a) : new f(a);
                    break;
                case "esriCLS":
                    b = new c(a);
                    break;
                case "esriSFS":
                    b = new g(a);
                    break;
                case "esriPFS":
                    b =
                        new h(a)
            }
            return b
        },
        getShapeDescriptors: function(a) {
            return a && a.getShapeDescriptors ? a.getShapeDescriptors() : {
                defaultShape: null,
                fill: null,
                stroke: null
            }
        }
    }
});