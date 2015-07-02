//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/Deferred", "dojo/_base/array", "dojo/_base/config", "dojo/json", "dojo/sniff", "../kernel", "../Evented", "../request", "../geometry/Extent", "../SpatialReference", "../deferredUtils", "./PixelBlock", "./LercCodec"], function(p, k, q, m, r, s, t, A, u, v, w, x, n, y, z) {
    var l = p(u, {
            declaredClass: "esri.layers.Raster",
            imageServiceUrl: null,
            validPixelTypes: "U1 U2 U4 U8 U16 U32 S8 S16 S32 F32".split(" "),
            validFormats: ["lerc"],
            _eventMap: {
                "raster-read-complete": ["pixelData", "params"]
            },
            constructor: function(a) {
                if (!a) throw "Image Service URL is not defined";
                this.imageServiceUrl = a;
                this.registerConnectEvents()
            },
            read: function(a, b, c) {
                var d = this,
                    f = new q(n._dfdCanceller);
                if (10 > t("ie")) throw "This browser is not supported.";
                if (!a.imageServiceParameters || !a.nBands) throw "Insufficient parameters to read data";
                var e = k.clone(a.imageServiceParameters),
                    g = a.nBands,
                    h = a.pixelType;
                m.some(this.validPixelTypes, function(a) {
                    return a === h
                }) || (e.pixelType = "F32");
                m.some(this.validFormats, function(a) {
                    return a.toLowerCase() === e.format.toLowerCase()
                }) || (e.format = "lerc");
                this._prepareGetImageParameters(e);
                f._pendingDfd = v({
                    url: this.imageServiceUrl + "/exportImage",
                    handleAs: "arraybuffer",
                    content: k.mixin(e, {
                        f: "image"
                    }),
                    load: function(a) {
                        "LERC" === e.format.toUpperCase() ? (a = {
                            pixelBlock: l._lercDecode(a, {
                                width: e.width,
                                height: e.height,
                                planes: g,
                                pixelType: h,
                                noDataValue: e.noData
                            }),
                            extent: e.extent
                        }, d._resolve([a, e], "onRasterReadComplete", b, f)) : (a = Error("Format '" + e.format + "' is not supported."), a.log = r.isDebug, d._resolve([a], null, c, f, !0))
                    },
                    error: function(a) {
                        d._resolve([a], null, c, f, !0)
                    }
                });
                return f
            },
            onRasterReadComplete: function() {},
            _prepareGetImageParameters: function(a) {
                if (a.size && a.bbox) {
                    var b = a.size.split(",");
                    a.width = parseFloat(b[0]);
                    a.height = parseFloat(b[1]);
                    a.extent || (b = a.bbox.split(","), a.extent = new w(parseFloat(b[0]), parseFloat(b[1]), parseFloat(b[2]), parseFloat(b[3]), new x(a.bboxSR)))
                } else {
                    if (!a.width || Math.floor(a.width) !== a.width || !a.height || Math.floor(a.height) !== a.height) throw "Incorrect Image Dimensions";
                    if (!a.extent || "esri.geometry.Extent" !== a.extent.declaredClass) throw "Incorrect extent";
                    var b = a.extent,
                        c = b.spatialReference.wkid ||
                        s.toJson(b.spatialReference.toJson());
                    delete a._ts;
                    k.mixin(a, {
                        bbox: b.xmin + "," + b.ymin + "," + b.xmax + "," + b.ymax,
                        imageSR: c,
                        bboxSR: c,
                        size: a.width + "," + a.height
                    }, a.disableClientCaching ? {
                        _ts: (new Date).getTime()
                    } : {})
                }
            },
            _adjustExtent: function(a, b, c) {
                var d = a.ymax - a.ymin,
                    f = a.xmax - a.xmin;
                c >= b ? a.ymax = a.ymin + f * b / c : (f = d * c / b, a.xmax = a.xmin + f);
                return a
            },
            _resolve: function(a, b, c, d, f) {
                b && this[b].apply(this, a);
                c && c.apply(null, a);
                d && n._resDfd(d, a, f)
            }
        }),
        h = null,
        d = null;
    l._lercDecode = function(a, b) {
        if (!b.planes || Math.floor(b.planes) !==
            b.planes) throw "Number of Bands not specified.";
        if (!b.height || Math.floor(b.height) !== b.height) throw "Height not provided.";
        if (!b.width || Math.floor(b.width) !== b.width) throw "Width not provided.";
        d = b.noDataValue;
        var c = b.pixelType;
        "U1" === c || "U2" === c || "U4" === c || "U8" === c ? (c = "U8", d = Math.pow(2, 8) - 1, h = Uint8Array) : "U16" === c ? (d = d || Math.pow(2, 16) - 1, h = Uint16Array) : "U32" === c ? (d = d || Math.pow(2, 32) - 1, h = Uint32Array) : "S8" === c ? (d = d || 0 - Math.pow(2, 7), h = Int8Array) : "S16" === c ? (d = d || 0 - Math.pow(2, 15), h = Int16Array) : "S32" === c ?
            (d = d || 0 - Math.pow(2, 31), h = Int32Array) : h = Float32Array;
        b.pixelType = c;
        for (var c = 0, k, f = 0, e, c = 0; c < b.planes; c++) {
            var g = z.decode(a, {
                    inputOffset: f,
                    encodedMaskData: k,
                    returnMask: 0 === c ? !0 : !1,
                    returnEncodedMask: 0 === c ? !0 : !1,
                    returnFileInfo: !0,
                    pixelType: h,
                    noDataValue: d
                }),
                f = g.fileInfo.eofOffset;
            0 === c && (k = g.encodedMaskData, e = new y({
                width: b.width,
                height: b.height,
                pixels: [],
                pixelType: b.pixelType,
                mask: g.maskData,
                statistics: []
            }));
            if (g.height !== b.height || g.width !== b.width) throw "The decoded image dimensions are incorrect";
            e.addData({
                pixels: g.pixelData,
                statistics: {
                    minValue: g.minValue,
                    maxValue: g.maxValue,
                    noDataValue: g.noDataValue
                }
            })
        }
        return e
    };
    return l
});