//>>built
define(["dojo/_base/kernel", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/sniff", "dojox/xml/parser", "../kernel", "../lang", "../request", "../WKIDUnitConversion", "../SpatialReference", "../geometry/Point", "../geometry/Extent", "../geometry/webMercatorUtils", "./TiledMapServiceLayer", "./TileInfo", "./WMTSLayerInfo", "dojo/query"], function(h, D, w, k, z, E, K, x, F, y, A, B, C, G, H, I, J) {
    return D([H], {
        declaredClass: "esri.layers.WMTSLayer",
        copyright: null,
        extent: null,
        tileUrl: null,
        spatialReference: null,
        tileInfo: null,
        constructor: function(a,
            b) {
            this.version = "1.0.0";
            this.tileUr = this._url = a;
            this.serviceMode = "RESTful";
            this._parseCapabilities = w.hitch(this, this._parseCapabilities);
            this._getCapabilitiesError = w.hitch(this, this._getCapabilitiesError);
            b || (b = {});
            if (b.serviceMode)
                if ("KVP" === b.serviceMode || "RESTful" === b.serviceMode) this.serviceMode = b.serviceMode;
                else {
                    console.error("WMTS mode could only be 'KVP' or 'RESTful'");
                    return
                }
            this.layerInfo = new J;
            b.layerInfo && (this.layerInfo = b.layerInfo, this._identifier = b.layerInfo.identifier, this._tileMatrixSetId =
                b.layerInfo.tileMatrixSet, b.layerInfo.format && (this.format = "image/" + b.layerInfo.format), this._style = b.layerInfo.style, this.title = b.layerInfo.title, this._dimension = b.layerInfo.dimension);
            b.resourceInfo ? (this.version = b.resourceInfo.version, b.resourceInfo.getTileUrl && (this._url = this.tileUrl = b.resourceInfo.getTileUrl), this.copyright = b.resourceInfo.copyright, this.layerInfos = b.resourceInfo.layerInfos, this._parseResourceInfo(), this.loaded = !0, this.onLoad(this)) : this._getCapabilities();
            this._formatDictionary = {
                "image/png": ".png",
                "image/png8": ".png",
                "image/png24": ".png",
                "image/png32": ".png",
                "image/jpg": ".jpg",
                "image/jpeg": ".jpeg",
                "image/gif": ".gif",
                "image/bmp": ".bmp",
                "image/tiff": ".tif",
                "image/jpgpng": "",
                "image/jpegpng": "",
                "image/unknown": ""
            }
        },
        setActiveLayer: function(a) {
            this.setVisibleLayer(a)
        },
        setVisibleLayer: function(a) {
            this._setActiveLayer(a);
            this.refresh(!0)
        },
        getTileUrl: function(a, b, f) {
            a = this._levelToLevelValue[a];
            a = this.resourceUrls && 0 < this.resourceUrls.length ? this.resourceUrls[b % this.resourceUrls.length].template.replace(/\{Style\}/gi,
                this._style).replace(/\{TileMatrixSet\}/gi, this._tileMatrixSetId).replace(/\{TileMatrix\}/gi, a).replace(/\{TileRow\}/gi, b).replace(/\{TileCol\}/gi, f).replace(/\{dimensionValue\}/gi, this._dimension) : this.UrlTemplate.replace(/\{level\}/gi, a).replace(/\{row\}/gi, b).replace(/\{col\}/gi, f);
            return a = this.addTimestampToURL(a)
        },
        getTileUrlTemplate: function(a) {
            var b = a.identifier,
                f = a.tileMatrixSet,
                c = a.format,
                e = a.style,
                d = a.dimension;
            b ? a = k.filter(this.layers, function(a) {
                return a.identifier === b
            })[0] : (a = this.layers[0],
                b = this.layers[0].identifier);
            if (a) {
                if (c) {
                    if (-1 === c.indexOf("image/") && (c = "image/" + c), -1 === k.indexOf(a.formats, c)) {
                        console.error("The layer doesn't support the format of " + c);
                        this.onError(Error("The layer doesn't support the format of " + c));
                        return
                    }
                } else c = a.formats[0], -1 === c.indexOf("image/") && (c = "image/" + c);
                if (e) {
                    if (-1 === k.indexOf(a.styles, e)) {
                        console.error("The layer doesn't support the style of " + e);
                        this.onError(Error("The layer doesn't support the style of " + e));
                        return
                    }
                } else e = a.styles[0];
                if (!d &&
                    a.dimensions) d = a.dimensions[0];
                else if (-1 === k.indexOf(a.dimensions, d)) {
                    console.error("The layer doesn't support the dimension of " + d);
                    this.onError(Error("The layer doesn't support the dimension of " + d));
                    return
                }
                var g;
                if (f) {
                    if (g = k.filter(a.tileMatrixSetInfos, function(a) {
                            return a.tileMatrixSet === f
                        })[0], !g) {
                        console.error("The tileMatrixSetId " + f + " is not supported by the layer of " + b);
                        this.onError(Error("The tileMatrixSetId " + f + " is not supported by the layer of " + b));
                        return
                    }
                } else(g = k.filter(a.tileMatrixSetInfos,
                    function(a) {
                        return "GoogleMapsCompatible" === a.tileMatrixSet
                    })[0]) || (g = a.tileMatrixSetInfos[0]), f = g.tileMatrixSet;
                return this._getTileUrlTemplate(b, f, c, e, d)
            }
            console.error("couldn't find the layer " + b);
            this.onError(Error("couldn't find the layer " + b))
        },
        _getTileUrlTemplate: function(a, b, f, c, e) {
            var d;
            a || (a = this._identifier);
            b || (b = this._tileMatrixSetId);
            f || (f = this.format);
            c || (c = this._style);
            if (this.resourceUrls && 0 < this.resourceUrls.length) return d = this.resourceUrls[0].template, d.indexOf(".xxx") === d.length -
                4 && (d = d.slice(0, d.length - 4)), d = d.replace(/\{Style\}/gi, c), d = d.replace(/\{TileMatrixSet\}/gi, b), d = d.replace(/\{TileMatrix\}/gi, "{level}"), d = d.replace(/\{TileRow\}/gi, "{row}"), d = d.replace(/\{TileCol\}/gi, "{col}"), d = d.replace(/\{dimensionValue\}/gi, e);
            "KVP" === this.serviceMode ? d = this._url + "SERVICE\x3dWMTS\x26VERSION\x3d" + this.version + "\x26REQUEST\x3dGetTile\x26LAYER\x3d" + a + "\x26STYLE\x3d" + c + "\x26FORMAT\x3d" + f + "\x26TILEMATRIXSET\x3d" + b + "\x26TILEMATRIX\x3d{level}\x26TILEROW\x3d{row}\x26TILECOL\x3d{col}" :
                "RESTful" === this.serviceMode && (e = "", this._formatDictionary[f.toLowerCase()] && (e = this._formatDictionary[f.toLowerCase()]), d = this._url + a + "/" + c + "/" + b + "/{level}/{row}/{col}" + e);
            return d
        },
        _parseResourceInfo: function() {
            var a = this.layerInfos,
                b;
            "KVP" === this.serviceMode && (this._url += -1 < this._url.indexOf("?") ? "" : "?");
            for (b = 0; b < a.length; b++)
                if ((!this._identifier || a[b].identifier === this._identifier) && (!this.title || a[b].title === this.title) && (!this._tileMatrixSetId || a[b].tileMatrixSet === this._tileMatrixSetId) &&
                    (!this.format || "image/" + a[b].format === this.format) && (!this._style || a[b].style === this._style)) {
                    w.mixin(this, {
                        description: a[b].description,
                        tileInfo: a[b].tileInfo,
                        spatialReference: a[b].tileInfo.spatialReference,
                        fullExtent: a[b].fullExtent,
                        initialExtent: a[b].initialExtent,
                        _identifier: a[b].identifier,
                        _tileMatrixSetId: a[b].tileMatrixSet,
                        format: "image/" + a[b].format,
                        _style: a[b].style
                    });
                    break
                }
            this._setActiveLayer();
            this.UrlTemplate = this._getTileUrlTemplate();
            this._levelToLevelValue = [];
            k.forEach(this.tileInfo.lods,
                function(a) {
                    this._levelToLevelValue[a.level] = a.levelValue ? a.levelValue : a.level
                }, this)
        },
        _getCapabilities: function() {
            var a;
            "KVP" === this.serviceMode ? a = -1 < this._url.indexOf("?") ? this._url + "\x26request\x3dGetCapabilities\x26service\x3dWMTS\x26version\x3d" + this.version : this._url + "?request\x3dGetCapabilities\x26service\x3dWMTS\x26version\x3d" + this.version : "RESTful" === this.serviceMode && (a = this._url + "/" + this.version + "/WMTSCapabilities.xml");
            F({
                url: a,
                handleAs: "text",
                load: this._parseCapabilities,
                error: this._getCapabilitiesError
            })
        },
        _parseCapabilities: function(a) {
            a = a.replace(/ows:/gi, "");
            a = E.parse(a);
            var b = h.query("Contents", a)[0];
            if (b) {
                var f = h.query("OperationsMetadata", a)[0],
                    c = h.query("[name\x3d'GetTile']", f)[0],
                    f = this._url,
                    c = h.query("Get", c),
                    e;
                for (e = 0; e < c.length; e++) {
                    var d = h.query("Constraint", c[e])[0];
                    if (!d || this._getTagWithChildTagValue("AllowedValues", "Value", this.serviceMode, d)) {
                        f = c[e].attributes[0].nodeValue;
                        break
                    }
                } - 1 === f.indexOf("/1.0.0/") && "RESTful" === this.serviceMode && (f += "/");
                "KVP" === this.serviceMode && (f += -1 < f.indexOf("?") ?
                    "" : "?");
                this._url = f;
                this.copyright = this._getTagValues("Capabilities\x3eServiceIdentification\x3eAccessConstraints", a)[0];
                a = h.query("Layer", b);
                var g, s = [];
                this.layers = [];
                k.forEach(a, function(a) {
                    g = this._getTagValues("Identifier", a)[0];
                    s.push(g);
                    this.layers.push(this._getWMTSLayerInfo(g, a, b))
                }, this);
                this._setActiveLayer();
                this.loaded = !0;
                this.onLoad(this)
            } else console.error("The WMTS capabilities XML is not valid"), this.onError(Error("The WMTS capabilities XML is not valid"))
        },
        _setActiveLayer: function(a) {
            a ||
                (a = {});
            a.identifier && (this._identifier = a.identifier);
            a.tileMatrixSet && (this._tileMatrixSetId = a.tileMatrixSet);
            a.format && (this.format = a.format);
            a.style && (this._style = a.style);
            a.dimension && (this._dimension = a.dimension);
            if (this.layers)
                if (this._identifier ? a = k.filter(this.layers, function(a) {
                        return a.identifier === this._identifier
                    }, this)[0] : (a = this.layers[0], this._identifier = this.layers[0].identifier), a) {
                    if (this.format) {
                        if (-1 === this.format.indexOf("image/") && (this.format = "image/" + this.format), -1 === k.indexOf(a.formats,
                                this.format)) {
                            console.error("The layer doesn't support the format of " + this.format);
                            this.onError(Error("The layer doesn't support the format of " + this.format));
                            return
                        }
                    } else this.format = a.formats[0], -1 === this.format.indexOf("image/") && (this.format = "image/" + this.format);
                    if (this._style) {
                        if (-1 === k.indexOf(a.styles, this._style)) {
                            console.error("The layer doesn't support the style of " + this._style);
                            this.onError(Error("The layer doesn't support the style of " + this._style));
                            return
                        }
                    } else this._style = a.styles[0];
                    if (!this._dimension && a.dimensions) this._dimension = a.dimensions[0];
                    else if (-1 === k.indexOf(a.dimensions, this._dimension)) {
                        console.error("The layer doesn't support the dimension of " + this._dimension);
                        this.onError(Error("The layer doesn't support the dimension of " + this._dimension));
                        return
                    }
                    var b;
                    if (this._tileMatrixSetId) {
                        if (b = k.filter(a.tileMatrixSetInfos, function(a) {
                                return a.tileMatrixSet === this._tileMatrixSetId
                            }, this)[0], !b) {
                            console.error("The tileMatrixSetId " + this._tileMatrixSetId + " is not supported by the layer of " +
                                this._identifier);
                            this.onError(Error("The tileMatrixSetId " + this._tileMatrixSetId + " is not supported by the layer of " + this._identifier));
                            return
                        }
                    } else(b = k.filter(a.tileMatrixSetInfos, function(a) {
                        return "GoogleMapsCompatible" === a.tileMatrixSet
                    })[0]) || (b = a.tileMatrixSetInfos[0]), this._tileMatrixSetId = b.tileMatrixSet;
                    this.description = a.description;
                    this.title = a.title;
                    this.spatialReference = b.tileInfo.spatialReference;
                    this.tileInfo = b.tileInfo;
                    this._levelToLevelValue = [];
                    k.forEach(this.tileInfo.lods, function(a) {
                        this._levelToLevelValue[a.level] =
                            a.levelValue ? a.levelValue : a.level
                    }, this);
                    102100 === this.spatialReference.wkid || 102113 === this.spatialReference.wkid ? this.fullExtent = this.initialExtent = G.geographicToWebMercator(a.gcsExtent) : 4326 === this.spatialReference.wkid ? this.fullExtent = this.initialExtent = a.gcsExtent : (this.fullExtent = b.fullExtent, this.initialExtent = b.initialExtent);
                    this.resourceUrls = a.resourceUrls;
                    this.UrlTemplate = this._getTileUrlTemplate();
                    this.layerInfo = {
                        identifier: this._identifier,
                        tileMatrixSet: this._tileMatrixSetId,
                        format: this.format,
                        style: this._style,
                        fullExtent: this.fullExtent,
                        initialExtent: this.initialExtent,
                        tileInfo: this.tileInfo,
                        title: this.title,
                        description: this.description
                    }
                } else console.error("couldn't find the layer " + this._identifier), this.onError(Error("couldn't find the layer " + this._identifier))
        },
        _getWMTSLayerInfo: function(a, b, f) {
            var c = this._getTagValues("Abstract", b)[0],
                e = this._getTagValues("Title", b)[0],
                d = h.query("WGS84BoundingBox", b)[0],
                g = d ? this._getTagValues("LowerCorner", d)[0].split(" ") : ["-180", "-90"],
                s = d ? this._getTagValues("UpperCorner",
                    d)[0].split(" ") : ["180", "90"],
                d = parseFloat(g[0]),
                g = parseFloat(g[1]),
                t = parseFloat(s[0]),
                s = parseFloat(s[1]),
                d = new C(d, g, t, s, new A({
                    wkid: 4326
                })),
                s = this._getTagValues("Identifier", h.query("Style", b)[0]),
                u = this._getTagValues("Identifier", h.query("Dimension", b)[0]),
                m = this._getTagValues("Value", h.query("Dimension", b)[0]) || this._getTagValues("Default", h.query("Dimension", b)[0]),
                g = this._getTagValues("Format", b);
            f = this._getLayerMatrixInfos(b, f);
            a = {
                identifier: a,
                tileMatrixSetInfos: f,
                formats: g,
                styles: s,
                title: e,
                description: c,
                gcsExtent: d,
                dimensions: m
            };
            b = h.query("ResourceURL", b);
            var r = [],
                l;
            k.forEach(b, function(a) {
                l = a.getAttribute("template");
                u && m && (l = l.replace("{" + u + "}", "{dimensionValue}"));
                r.push({
                    template: l,
                    format: a.getAttribute("format"),
                    resourceType: a.getAttribute("resourceType")
                })
            });
            r && 0 < r.length && (a.resourceUrls = r);
            return a
        },
        _getLayerMatrixInfos: function(a, b) {
            var f, c = [];
            this._allMatrixInfos || (this._allMatrixInfos = []);
            var e = this._getTagValues("TileMatrixSet", a);
            if (e && 0 !== e.length) return k.forEach(e, function(d) {
                var e;
                if (0 < this._allMatrixInfos.length)
                    for (f = 0; f < this._allMatrixInfos.length; f++)
                        if (this._allMatrixInfos[f].tileMatrixSet == d) {
                            e = this._allMatrixInfos[f];
                            break
                        }
                e || (e = this._getLayerMatrixInfo(d, a, b), this._allMatrixInfos.push(e));
                c.push(e)
            }, this), c
        },
        _getLayerMatrixInfo: function(a, b, f) {
            var c, e, d, g, k = [];
            b = this._getTagWithChildTagValue("TileMatrixSetLink", "TileMatrixSet", a, b);
            var t = this._getTagValues("TileMatrix", b),
                u = this._getTagWithChildTagValue("TileMatrixSet", "Identifier", a, f),
                m = this._getTagValues("SupportedCRS",
                    u)[0];
            c = parseInt(m.split(":").pop(), 10);
            if (900913 == c || 3857 == c) c = 102100;
            if (-1 < m.toLowerCase().indexOf("crs84") || -1 < m.toLowerCase().indexOf("crs:84")) c = 4326, g = !0;
            else if (-1 < m.toLowerCase().indexOf("crs83") || -1 < m.toLowerCase().indexOf("crs:83")) c = 4269, g = !0;
            else if (-1 < m.toLowerCase().indexOf("crs27") || -1 < m.toLowerCase().indexOf("crs:27")) c = 4267, g = !0;
            var r = new A({
                    wkid: c
                }),
                l = h.query("TileMatrix", u)[0];
            f = parseInt(this._getTagValues("TileWidth", l)[0], 10);
            b = parseInt(this._getTagValues("TileHeight", l)[0], 10);
            e = this._getTagValues("TopLeftCorner", l)[0].split(" ");
            var q = e[0],
                v = e[1];
            1 < q.split("E").length && (e = q.split("E"), q = e[0] * Math.pow(10, e[1]));
            1 < v.split("E").length && (e = v.split("E"), v = e[0] * Math.pow(10, e[1]));
            var q = parseFloat(q),
                v = parseFloat(v),
                w = g && 4326 === c && 90 === q && -180 === v;
            for (e = 0; e < this._flippingAxisForWkids.length; e++)
                if (m.split(":").pop() >= this._flippingAxisForWkids[e][0] && m.split(":").pop() <= this._flippingAxisForWkids[e][1] || 4326 === c && (!g || w)) {
                    4326 === c && 90 < q && (q = "90");
                    d = new B(v, q, r);
                    break
                }
            e === this._flippingAxisForWkids.length &&
                (d = new B(q, v, r));
            if (0 === t.length) {
                t = h.query("TileMatrix", u);
                for (e = 0; e < t.length; e++) g = this._getLodFromTileMatrix(t[e], c, e), k.push(g)
            } else
                for (e = 0; e < t.length; e++) g = this._getTagWithChildTagValue("TileMatrix", "Identifier", t[e], u), g = this._getLodFromTileMatrix(g, c, e), k.push(g);
            c = h.query("BoundingBox", u)[0];
            var n, p;
            c && (n = this._getTagValues("LowerCorner", c)[0].split(" "), p = this._getTagValues("UpperCorner", c)[0].split(" "));
            n && 1 < n.length && p && 1 < p.length ? (l = parseFloat(n[0]), c = parseFloat(n[1]), n = parseFloat(p[0]),
                p = parseFloat(p[1])) : (n = this._getTagValues("MatrixWidth", l)[0], c = this._getTagValues("MatrixHeight", l)[0], l = d.x, p = d.y, n = l + n * b * k[0].resolution, c = p - c * f * k[0].resolution);
            p = n = new C(l, c, n, p, r);
            d = new I({
                dpi: 90.71428571428571,
                spatialReference: r,
                format: this.format,
                rows: f,
                cols: b,
                origin: d,
                lods: k
            });
            return {
                tileMatrixSet: a,
                fullExtent: p,
                initialExtent: n,
                tileInfo: d
            }
        },
        _getCapabilitiesError: function(a) {
            console.error("Failed to get capabilities xml");
            this.onError(a)
        },
        _getLodFromTileMatrix: function(a, b, f) {
            var c = this._getTagValues("Identifier",
                a)[0];
            a = this._getTagValues("ScaleDenominator", a)[0];
            1 < a.split("E").length ? (a = a.split("E"), a = a[0] * Math.pow(10, a[1])) : a = parseFloat(a);
            b = x.isDefined(y[b]) ? y.values[y[b]] : 111194.6519066546;
            return {
                level: f,
                levelValue: c,
                scale: a,
                resolution: 7 * a / 25E3 / b
            }
        },
        _getTag: function(a, b) {
            var f = h.query(a, b);
            return f && 0 < f.length ? f[0] : null
        },
        _getTagValues: function(a, b) {
            var f = [],
                c = a.split("\x3e"),
                e, d;
            e = h.query(c[0], b)[0];
            if (1 < c.length) {
                for (d = 1; d < c.length - 1; d++) e = h.query(c[d], e)[0];
                c = h.query(c[c.length - 1], e)
            } else c = h.query(c[0],
                b);
            c && 0 < c.length && k.forEach(c, function(a) {
                9 > z("ie") ? f.push(a.childNodes.length ? a.childNodes[0].nodeValue : "") : f.push(a.textContent)
            });
            return f
        },
        _getAttributeValues: function(a, b, f) {
            a = h.query(a, f);
            var c = [];
            a && 0 < a.length && k.forEach(a, function(a) {
                c.push(a.getAttribute(b))
            });
            return c
        },
        _getTagWithChildTagValue: function(a, b, f, c) {
            c = c.childNodes;
            var e, d;
            for (d = 0; d < c.length; d++)
                if (-1 < c[d].nodeName.indexOf(a) && (9 > z("ie") ? x.isDefined(h.query(b, c[d])[0]) && (e = h.query(b, c[d])[0].childNodes[0].nodeValue) : x.isDefined(h.query(b,
                        c[d])[0]) && (e = h.query(b, c[d])[0].textContent), e === f || f.split(":") && e === f.split(":")[1])) return c[d]
        },
        _flippingAxisForWkids: [
            [3819, 3819],
            [3821, 3824],
            [3889, 3889],
            [3906, 3906],
            [4001, 4025],
            [4027, 4036],
            [4039, 4047],
            [4052, 4055],
            [4074, 4075],
            [4080, 4081],
            [4120, 4176],
            [4178, 4185],
            [4188, 4216],
            [4218, 4289],
            [4291, 4304],
            [4306, 4319],
            [4322, 4326],
            [4463, 4463],
            [4470, 4470],
            [4475, 4475],
            [4483, 4483],
            [4490, 4490],
            [4555, 4558],
            [4600, 4646],
            [4657, 4765],
            [4801, 4811],
            [4813, 4821],
            [4823, 4824],
            [4901, 4904],
            [5013, 5013],
            [5132, 5132],
            [5228,
                5229
            ],
            [5233, 5233],
            [5246, 5246],
            [5252, 5252],
            [5264, 5264],
            [5324, 5340],
            [5354, 5354],
            [5360, 5360],
            [5365, 5365],
            [5370, 5373],
            [5381, 5381],
            [5393, 5393],
            [5451, 5451],
            [5464, 5464],
            [5467, 5467],
            [5489, 5489],
            [5524, 5524],
            [5527, 5527],
            [5546, 5546],
            [2044, 2045],
            [2081, 2083],
            [2085, 2086],
            [2093, 2093],
            [2096, 2098],
            [2105, 2132],
            [2169, 2170],
            [2176, 2180],
            [2193, 2193],
            [2200, 2200],
            [2206, 2212],
            [2319, 2319],
            [2320, 2462],
            [2523, 2549],
            [2551, 2735],
            [2738, 2758],
            [2935, 2941],
            [2953, 2953],
            [3006, 3030],
            [3034, 3035],
            [3038, 3051],
            [3058, 3059],
            [3068, 3068],
            [3114,
                3118
            ],
            [3126, 3138],
            [3150, 3151],
            [3300, 3301],
            [3328, 3335],
            [3346, 3346],
            [3350, 3352],
            [3366, 3366],
            [3389, 3390],
            [3416, 3417],
            [3833, 3841],
            [3844, 3850],
            [3854, 3854],
            [3873, 3885],
            [3907, 3910],
            [4026, 4026],
            [4037, 4038],
            [4417, 4417],
            [4434, 4434],
            [4491, 4554],
            [4839, 4839],
            [5048, 5048],
            [5105, 5130],
            [5253, 5259],
            [5269, 5275],
            [5343, 5349],
            [5479, 5482],
            [5518, 5519],
            [5520, 5520],
            [20004, 20032],
            [20064, 20092],
            [21413, 21423],
            [21473, 21483],
            [21896, 21899],
            [22171, 22177],
            [22181, 22187],
            [22191, 22197],
            [25884, 25884],
            [27205, 27232],
            [27391, 27398],
            [27492,
                27492
            ],
            [28402, 28432],
            [28462, 28492],
            [30161, 30179],
            [30800, 30800],
            [31251, 31259],
            [31275, 31279],
            [31281, 31290],
            [31466, 31700],
            [900913, 900913]
        ]
    })
});