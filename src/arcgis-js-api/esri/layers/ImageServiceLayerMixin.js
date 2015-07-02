//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/Deferred", "dojo/_base/array", "dojo/_base/json", "dojo/_base/config", "dojo/has", "dojo/io-query", "../kernel", "../config", "../lang", "../request", "../deferredUtils", "../urlUtils", "../geometry/Extent", "../geometry/Point", "../geometry/Polygon", "./MosaicRule", "./RasterFunction", "./DimensionalDefinition", "./Raster", "./PixelBlock", "./pixelFilters/VectorFieldPixelFilter", "./TimeInfo", "./Field", "../graphic", "../tasks/ImageServiceIdentifyTask", "../tasks/ImageServiceIdentifyParameters"], function(I,
    e, l, w, u, D, U, J, V, K, x, t, k, E, C, L, M, p, F, G, N, H, O, P, Q, R, S, T) {
    return I(null, {
        declaredClass: "esri.layers.ImageServiceLayerMixin",
        _eventMap: {
            "rendering-change": !0,
            "mosaic-rule-change": !0
        },
        constructor: function(a, b) {},
        _initialize: function(a, b) {
            this._url = E.urlToObject(a);
            this.raster = new N(a);
            this.infoTemplate = b && b.infoTemplate;
            var c = b && b.imageServiceParameters;
            this.format = c && c.format;
            this.compressionTolerance = c && c.compressionTolerance ? c.compressionTolerance : 0.01;
            this.interpolation = c ? c.interpolation : null;
            this.compressionQuality =
                c ? c.compressionQuality : null;
            this.bandIds = c ? c.bandIds : null;
            this.mosaicRule = c ? c.mosaicRule : null;
            this.renderingRule = c ? c.renderingRule : null;
            this.useMapDimensionValue = b && b.hasOwnProperty("useMapDimensionValue") ? !!b.useMapDimensionValue : !0;
            this.activeMapDimensions = b && b.activeMapDimensions;
            this._params = e.mixin({}, this._url.query, {
                f: "image",
                interpolation: this.interpolation,
                format: this.format,
                compressionQuality: this.compressionQuality,
                bandIds: this.bandIds ? this.bandIds.join(",") : null
            }, c ? c.toJson() : {});
            this.pixelFilter =
                b && b.pixelFilter;
            this.originalPixelData = this.pixelData = null;
            this.hasDataChanged = !0;
            this._requestDataHandler = e.hitch(this, this._requestDataHandler);
            this._requestDataErrorHandler = e.hitch(this, this._requestDataErrorHandler);
            this._initLayer = e.hitch(this, this._initLayer);
            this._queryVisibleRastersHandler = e.hitch(this, this._queryVisibleRastersHandler);
            this._visibleRasters = [];
            this._rasterAttributeTableFields = [];
            this._rasterAttributeTableFeatures = [];
            this._loadCallback = b && b.loadCallback;
            (c = b && b.resourceInfo) ?
            this._initLayer(c): t({
                url: this._url.path,
                content: e.mixin({
                    f: "json"
                }, this._url.query),
                callbackParamName: "callback",
                load: this._initLayer,
                error: this._errorHandler
            });
            this.registerConnectEvents()
        },
        disableClientCaching: !1,
        _initLayer: function(a, b) {
            if (!(null === a || void 0 === a)) {
                this._findCredential();
                (this.credential && this.credential.ssl || a && a._ssl) && this._useSSL();
                var c = this.minScale,
                    d = this.maxScale;
                e.mixin(this, a);
                this.minScale = c;
                this.maxScale = d;
                this.initialExtent = this.fullExtent = this.extent = new C(a.extent);
                this.spatialReference = this.initialExtent.spatialReference;
                this.pixelSizeX = parseFloat(this.pixelSizeX);
                this.pixelSizeY = parseFloat(this.pixelSizeY);
                for (var f = this.minValues, m = this.maxValues, h = this.meanValues, s = this.stdvValues, n = this.bands = [], c = 0, d = this.bandCount; c < d; c++) n[c] = {
                    min: f[c],
                    max: m[c],
                    mean: h[c],
                    stddev: s[c]
                };
                this.timeInfo = (c = this.timeInfo) && c.timeExtent ? new P(c) : null;
                d = this.fields = [];
                if (f = a.fields)
                    for (c = 0; c < f.length; c++) d.push(new Q(f[c]));
                this.version = a.currentVersion;
                this.version || (this.version =
                    "fields" in a || "objectIdField" in a || "timeInfo" in a ? 10 : 9.3);
                x.isDefined(a.minScale) && !this._hasMin && this.setMinScale(a.minScale);
                x.isDefined(a.maxScale) && !this._hasMax && this.setMaxScale(a.maxScale);
                c = {};
                a.defaultMosaicMethod ? (c.method = a.defaultMosaicMethod, c.operation = a.mosaicOperator, c.sortField = a.sortField, c.sortValue = a.sortValue) : c.method = p.METHOD_NONE;
                this.defaultMosaicRule = new p(c);
                this.defaultMosaicRule.ascending = !0;
                this._setDefaultRenderingRule(!0);
                this._isScientificData() && (!this.mosaicRule ||
                    this.mosaicRule && !this.mosaicRule.multidimensionalDefinition) && this._setDefaultMultidimensionalDefinition(!0);
                10 < this.version && this.hasRasterAttributeTable && this.getRasterAttributeTable().then(e.hitch(this, function(a) {
                    a && (a.features && 0 < a.features.length) && (this._rasterAttributeTableFeatures = e.clone(a.features));
                    a && (a.fields && 0 < a.fields.length) && (this._rasterAttributeTableFields = e.clone(a.fields))
                }));
                this._isVectorData() && !x.isDefined(this.pixelFilter) && (this.vectorFieldPixelFilter = new O, this.vectorFieldPixelFilter.isDataUV =
                    "esriImageServiceDataTypeVector-UV" === this.serviceDataType, this.pixelFilter = this.vectorFieldPixelFilter.computeMagnitudeAndDirection, this.getKeyProperties().then(e.hitch(this, this._setFlowRepresentation)));
                this.loaded = !0;
                this.onLoad(this);
                if (c = this._loadCallback) delete this._loadCallback, c(this)
            }
        },
        getKeyProperties: function() {
            var a = this._url.path + "/keyProperties",
                b = new l(k._dfdCanceller);
            10 < this.version ? (b._pendingDfd = t({
                url: a,
                content: {
                    f: "json"
                },
                handleAs: "json",
                callbackParamName: "callback"
            }), b._pendingDfd.then(function(a) {
                    b.callback(a)
                },
                function(a) {
                    b.errback(a)
                })) : (a = Error("Layer does not have key properties"), a.log = D.isDebug, b.errback(a));
            return b
        },
        getRasterAttributeTable: function() {
            var a = this._url.path + "/rasterAttributeTable",
                b = new l(k._dfdCanceller);
            10 < this.version && this.hasRasterAttributeTable ? (b._pendingDfd = t({
                url: a,
                content: {
                    f: "json"
                },
                handleAs: "json",
                callbackParamName: "callback"
            }), b._pendingDfd.then(function(a) {
                b.callback(a)
            }, function(a) {
                b.errback(a)
            })) : (a = Error("Layer does not support raster attribute table"), a.log = D.isDebug,
                b.errback(a));
            return b
        },
        _getRasterAttributeTableFeatures: function() {
            var a = new l;
            if (this._rasterAttributeTableFeatures && 0 < this._rasterAttributeTableFeatures.length) return a.resolve(this._rasterAttributeTableFeatures), a;
            if (10 < this.version && this.hasRasterAttributeTable) return a = this.getRasterAttributeTable(), a.then(e.hitch(this, function(a) {
                a && (a.features && 0 < a.features.length) && (this._rasterAttributeTableFeatures = e.clone(a.features))
            })), a;
            a.resolve(this._rasterAttributeTableFeatures);
            return a
        },
        getCustomRasterFields: function(a) {
            var b =
                a ? a.rasterAttributeTableFieldPrefix : "",
                c = {
                    name: "Raster.ItemPixelValue",
                    alias: "Item Pixel Value",
                    domain: null,
                    editable: !1,
                    length: 50,
                    type: "esriFieldTypeString"
                };
            a = this.fields ? e.clone(this.fields) : [];
            var d = a.length;
            a[d] = {
                name: "Raster.ServicePixelValue",
                alias: "Service Pixel Value",
                domain: null,
                editable: !1,
                length: 50,
                type: "esriFieldTypeString"
            };
            if (this.capabilities && -1 < this.capabilities.toLowerCase().indexOf("catalog") || this.fields && 0 < this.fields.length) a[d + 1] = c;
            if (x.isDefined(this.pixelFilter) && ("esriImageServiceDataTypeVector-UV" ===
                    this.serviceDataType || "esriImageServiceDataTypeVector-MagDir" === this.serviceDataType)) a[d + 2] = {
                name: "Raster.Magnitude",
                alias: "Magnitude",
                domain: null,
                editable: !1,
                type: "esriFieldTypeDouble"
            }, a[d + 3] = {
                name: "Raster.Direction",
                alias: "Direction",
                domain: null,
                editable: !1,
                type: "esriFieldTypeDouble"
            };
            this._rasterAttributeTableFields && 0 < this._rasterAttributeTableFields.length && (c = w.filter(this._rasterAttributeTableFields, function(a) {
                return "esriFieldTypeOID" !== a.type && "value" !== a.name.toLowerCase()
            }), c = w.map(c,
                function(a) {
                    var c = e.clone(a);
                    c.name = b + a.name;
                    return c
                }), a = a.concat(c));
            return a
        },
        _prepareGetImageParameters: function(a, b, c, d) {
            d = x.isDefined(d) ? d : this._params;
            var f = a.spatialReference.wkid || u.toJson(a.spatialReference.toJson());
            delete d._ts;
            e.mixin(d, {
                bbox: a.xmin + "," + a.ymin + "," + a.xmax + "," + a.ymax,
                imageSR: f,
                bboxSR: f,
                size: b + "," + c
            }, this.disableClientCaching ? {
                _ts: (new Date).getTime()
            } : {});
            delete d.compressionTolerance;
            d.format && "LERC" === d.format.toUpperCase() && (d.compressionTolerance = this.compressionTolerance);
            d.token = this._getToken()
        },
        getImageUrl: function(a, b, c, d, f) {
            f = x.isDefined(f) ? f : this._params;
            this._prepareGetImageParameters(a, b, c, f);
            a = e.clone(f);
            this._cleanupRequestParams(a);
            b = this._url.path + "/exportImage?";
            c = E.addProxy(b + J.objectToQuery(e.mixin(a, {
                f: "image"
            })));
            var m = a.token;
            c.length > K.defaults.io.postLength || this.useMapImage ? this._jsonRequest = t({
                url: b,
                content: e.mixin(a, {
                    f: "json"
                }),
                callbackParamName: "callback",
                load: function(a, b) {
                    var c = a.href;
                    m && (c += -1 === c.indexOf("?") ? "?token\x3d" + m : "\x26token\x3d" +
                        m);
                    d(E.addProxy(c))
                },
                error: this._errorHandler
            }) : d(c)
        },
        onRenderingChange: function() {},
        onMosaicRuleChange: function() {},
        setInterpolation: function(a, b) {
            this.interpolation = this._params.interpolation = a;
            b || this.refresh(!0)
        },
        setCompressionQuality: function(a, b) {
            this.compressionQuality = this._params.compressionQuality = a;
            b || this.refresh(!0)
        },
        setCompressionTolerance: function(a, b) {
            this.compressionTolerance = a;
            b || this.refresh(!0)
        },
        setBandIds: function(a, b) {
            var c = !1;
            this.bandIds !== a && (c = !0);
            this.bandIds = a;
            this._params.bandIds =
                a.join(",");
            if (c && !b) this.onRenderingChange();
            b || this.refresh(!0)
        },
        setDefaultBandIds: function(a) {
            this.bandIds = this._params.bandIds = null;
            a || this.refresh(!0)
        },
        setDisableClientCaching: function(a) {
            this.disableClientCaching = a
        },
        setMosaicRule: function(a, b) {
            var c = !1;
            this.mosaicRule !== a && (c = !0);
            this.mosaicRule = a;
            this._params.mosaicRule = u.toJson(a.toJson());
            if (c && !b) this.onMosaicRuleChange();
            b || this.refresh(!0)
        },
        setRenderingRule: function(a, b) {
            var c = !1;
            this.renderingRule !== a && (c = !0);
            this.renderingRule = a;
            this._params.renderingRule =
                a ? u.toJson(a.toJson()) : null;
            if (c && !b) this.onRenderingChange();
            b || this.refresh(!0)
        },
        setImageFormat: function(a, b) {
            this.format = this._params.format = a;
            b || this.refresh(!0)
        },
        setInfoTemplate: function(a) {
            this.infoTemplate = a
        },
        setDefinitionExpression: function(a, b) {
            var c = this.mosaicRule ? this.mosaicRule.toJson() : {};
            this.mosaicRule || (this.defaultMosaicRule ? c = this.defaultMosaicRule.toJson() : c.method = p.METHOD_NONE);
            c.where = a;
            c = new p(c);
            this.setMosaicRule(c, b);
            return this
        },
        getDefinitionExpression: function() {
            return this.mosaicRule ?
                this.mosaicRule.where : null
        },
        setPixelFilter: function(a) {
            this.pixelFilter = a
        },
        getPixelData: function(a) {
            return a ? this.originalPixelData : this.pixelData
        },
        redraw: function() {
            this.hasDataChanged = !1;
            this._setPixelData(this.originalPixelData)
        },
        queryVisibleRasters: function(a, b, c, d) {
            var f = this._map,
                e = k._fixDfd(new l(k._dfdCanceller));
            this._visibleRasters = [];
            var h, s, n = !0,
                g;
            if (this.infoTemplate && this.infoTemplate.info && this.infoTemplate.info.fieldInfos && 0 < this.infoTemplate.info.fieldInfos.length) {
                n = !1;
                g = this.infoTemplate.info;
                for (h = 0; h < g.fieldInfos.length; h++)
                    if ((s = g.fieldInfos[h]) && "raster.servicepixelvalue" !== s.fieldName.toLowerCase() && (s.visible || g.title && -1 < g.title.toLowerCase().indexOf(s.fieldName.toLowerCase()))) {
                        n = !0;
                        break
                    }
            }
            h = new T;
            h.geometry = a.geometry;
            h.returnGeometry = this._map.spatialReference.equals(this.spatialReference);
            h.returnCatalogItems = n;
            h.timeExtent = a.timeExtent;
            h.mosaicRule = this.mosaicRule ? this.mosaicRule : null;
            h.renderingRule = this.renderingRule ? this.renderingRule : null;
            f && (a = new L((f.extent.xmax - f.extent.xmin) /
                (2 * f.width), (f.extent.ymax - f.extent.ymin) / (2 * f.height), f.extent.spatialReference), h.pixelSize = a);
            var r = this;
            a = new S(this.url);
            (e._pendingDfd = a.execute(h)).addCallbacks(function(a) {
                r._queryVisibleRastersHandler(a, b, c, d, e)
            }, function(a) {
                r._resolve([a], null, d, e, !0)
            });
            return e
        },
        _queryVisibleRastersHandler: function(a, b, c, d, f) {
            function m() {
                var a = this.getCustomRasterFields(b),
                    d = this._getDomainFields(a),
                    g = b ? b.returnDomainValues : !1,
                    m = b && b.rasterAttributeTableFieldPrefix,
                    k, l, p, r, z, t, v, u, y;
                this._getRasterAttributeTableFeatures().then(e.hitch(this,
                    function(a) {
                        for (k = 0; k < n.length; k++) {
                            q = n[k];
                            q.setInfoTemplate(this.infoTemplate);
                            q._layer = this;
                            if (h) {
                                l = h;
                                s && s.length >= k && (p = s[k], l = p.replace(/ /gi, ", "));
                                q.attributes["Raster.ItemPixelValue"] = l;
                                q.attributes["Raster.ServicePixelValue"] = h;
                                if (this.pixelFilter) {
                                    y = l.replace(" ", "").split(",");
                                    var b = new H({
                                        height: 1,
                                        width: 1,
                                        pixelType: "F32",
                                        pixels: [],
                                        statistics: []
                                    });
                                    w.forEach(y, function(a) {
                                        b.addData({
                                            pixels: [a],
                                            statistics: {
                                                minValue: a,
                                                maxValue: a,
                                                noDataValue: null
                                            }
                                        })
                                    });
                                    this.pixelFilter({
                                        pixelBlock: b,
                                        extent: new C(0,
                                            0, 0, 0, this._map.spatialReference)
                                    });
                                    if ("esriImageServiceDataTypeVector-UV" === this.serviceDataType || "esriImageServiceDataTypeVector-MagDir" === this.serviceDataType) q.attributes["Raster.Magnitude"] = b.pixels[0][0], q.attributes["Raster.Direction"] = b.pixels[1][0]
                                }
                                if (a && 0 < a.length && (r = w.filter(a, function(a) {
                                        if (a && a.attributes) return a.attributes.hasOwnProperty("Value") ? a.attributes.Value == l : a.attributes.VALUE == l
                                    }), 0 < r.length && (z = e.clone(r[0]), m && z))) {
                                    u = {};
                                    for (t in z.attributes) z.attributes.hasOwnProperty(t) &&
                                        (v = m + t, u[v] = z.attributes[t]);
                                    z.attributes = u;
                                    q.attributes = e.mixin(q.attributes, z.attributes)
                                }
                            }
                            g && (d && 0 < d.length) && w.forEach(d, function(a) {
                                if (a) {
                                    var b = q.attributes[a.name];
                                    x.isDefined(b) && (b = this._getDomainValue(a.domain, b), x.isDefined(b) && (q.attributes[a.name] = b))
                                }
                            }, this);
                            A.push(q);
                            this._visibleRasters.push(q)
                        }
                        this._resolve([A, null, !0], null, c, f)
                    }))
            }
            var h = a.value,
                s, n, g = 0,
                r = 0,
                k = this,
                l = this.objectIdField,
                p;
            if (a.catalogItems) {
                d = 0;
                var y, B, v = a.catalogItems.features.length;
                y = 0;
                n = Array(v);
                s = Array(v);
                p = Array(v);
                for (g = 0; g < v; g++) - 1 < a.properties.Values[g].toLowerCase().indexOf("nodata") && y++;
                y = v - y;
                for (g = 0; g < v; g++) B = -1 < a.properties.Values[g].toLowerCase().indexOf("nodata") ? y++ : d++, n[B] = a.catalogItems.features[g], s[B] = a.properties.Values[g], p[B] = n[B].attributes[l]
            }
            this._visibleRasters = [];
            var q;
            a = -1 < h.toLowerCase().indexOf("nodata");
            h && (!n && !a) && (l = "ObjectId", n = [], q = new R(new C(this.fullExtent), null, {
                ObjectId: 0
            }), n.push(q));
            var A = [];
            n ? !this._map.spatialReference.equals(this.spatialReference) && p && 0 < p.length ? t({
                url: this._url.path +
                    "/query",
                content: {
                    f: "json",
                    objectIds: p.join(","),
                    returnGeometry: !0,
                    outSR: u.toJson(k._map.spatialReference.toJson()),
                    outFields: l
                },
                handleAs: "json",
                callbackParamName: "callback",
                load: function(a) {
                    if (0 === a.features.length) k._resolve([A, null, null], null, c, f);
                    else {
                        for (g = 0; g < a.features.length; g++)
                            for (r = 0; r < n.length; r++) n[r].attributes[l] == a.features[g].attributes[l] && (n[r].geometry = new M(a.features[g].geometry), n[r].geometry.setSpatialReference(k._map.spatialReference));
                        m.call(k)
                    }
                },
                error: function(a) {
                    k._resolve([A,
                        null, null
                    ], null, c, f)
                }
            }) : m.call(this) : this._resolve([A, null, null], null, c, f)
        },
        getVisibleRasters: function() {
            var a = this._visibleRasters,
                b = [],
                c;
            for (c in a) a.hasOwnProperty(c) && b.push(a[c]);
            return b
        },
        _getDomainFields: function(a) {
            if (a) {
                var b = [];
                w.forEach(a, function(a) {
                    if (a.domain) {
                        var d = {};
                        d.name = a.name;
                        d.domain = a.domain;
                        b.push(d)
                    }
                });
                return b
            }
        },
        _getDomainValue: function(a, b) {
            if (a && a.codedValues) {
                var c;
                w.some(a.codedValues, function(a) {
                    return a.code === b ? (c = a.name, !0) : !1
                });
                return c
            }
        },
        _requestData: function(a,
            b, c) {
            a = e.clone(a);
            var d = a._normalize(!0);
            this._prepareGetImageParameters(d, b, c);
            b = e.clone(this._params);
            this._cleanupRequestParams(b);
            b.extent = a;
            b = {
                imageServiceParameters: b,
                nBands: Math.min(this.bandCount, 3),
                pixelType: this.pixelType
            };
            this.raster.read(b, this._requestDataHandler, this._requestDataErrorHandler)
        },
        _requestDataHandler: function(a) {
            this.originalPixelData = a;
            this.hasDataChanged = !0;
            this._setPixelData(a)
        },
        _setPixelData: function(a) {
            a = this._clonePixelData(a);
            this.pixelFilter && this.pixelFilter(a);
            this.pixelData = a;
            this._drawPixelData()
        },
        _drawPixelData: function() {},
        _requestDataErrorHandler: function(a) {},
        _clonePixelData: function(a) {
            if (null === a || void 0 === a) return a;
            var b = {};
            a.extent && (b.extent = e.clone(a.extent));
            a = a.pixelBlock;
            if (null === a || void 0 === a) return b;
            b.pixelBlock = a.clone();
            return b
        },
        getMultidimensionalInfo: function() {
            var a = this._url.path + "/multiDimensionalInfo",
                b = new l(k._dfdCanceller);
            if (this._multidimensionalInfo) return b.resolve(this._multidimensionalInfo), b;
            10.3 <= this.version && this.hasMultidimensions ?
                (b._pendingDfd = t({
                    url: a,
                    content: {
                        f: "json"
                    },
                    handleAs: "json",
                    callbackParamName: "callback"
                }), b._pendingDfd.then(e.hitch(this, function(a) {
                    this._multidimensionalInfo = a.multidimensionalInfo;
                    b.callback(a.multidimensionalInfo)
                }), function(a) {
                    b.errback(a)
                })) : (a = Error("Layer does not support multidimensional info"), a.log = D.isDebug, b.errback(a));
            return b
        },
        getDefaultMultidimensionalDefinition: function() {
            var a, b, c, d, f = [],
                m = new l(k._dfdCanceller);
            if (this._defaultMultidimensionalDefinition) return m.resolve(this._defaultMultidimensionalDefinition),
                m;
            m._pendingDfd = this.getMultidimensionalInfo();
            m._pendingDfd.then(e.hitch(this, function(e) {
                a = e;
                b = a.variables[0].name;
                c = a.variables[0].dimensions;
                for (d in c) c.hasOwnProperty(d) && (c[d].hasRanges && !0 == c[d].hasRanges ? f.push(new G({
                    variableName: b,
                    dimensionName: c[d].name,
                    isSlice: !1,
                    values: [c[d].values[0][0], c[d].values[0][1]]
                })) : f.push(new G({
                    variableName: b,
                    dimensionName: c[d].name,
                    isSlice: !0,
                    values: [c[d].extent[0]]
                })));
                this._defaultMultidimensionalDefinition = f;
                m.callback(f)
            }), function(a) {
                m.errback(a)
            });
            return m
        },
        _setDefaultMultidimensionalDefinition: function(a) {
            var b, c = {};
            this.getDefaultMultidimensionalDefinition().then(e.hitch(this, function(d) {
                b = d;
                0 < b.length && (this.mosaicRule ? (c = e.clone(this.mosaicRule), c.multidimensionalDefinition = b) : this.defaultMosaicRule ? (c = e.clone(this.defaultMosaicRule), c.multidimensionalDefinition = b) : c = new p({
                    multidimensionalDefinition: b
                }), this.setMosaicRule(c, a))
            }))
        },
        _setDefaultRenderingRule: function(a) {
            var b = {};
            if (!this.renderingRule && "esri.layers.ArcGISImageServiceVectorLayer" !==
                this.declaredClass && this.rasterFunctionInfos && this.rasterFunctionInfos.length && "None" != this.rasterFunctionInfos[0].name) b.rasterFunction = this.rasterFunctionInfos[0].name;
            else if (!this.renderingRule && "esri.layers.ArcGISImageServiceVectorLayer" == this.declaredClass && 10.3 < this.version) {
                var c = "esriImageServiceDataTypeVector-UV" === this.serviceDataType ? 7 : 10;
                new F;
                b.rasterFunction = "Resample";
                b.rasterFunctionArguments = {
                    ResamplingType: c,
                    InputCellSize: {
                        x: this.pixelSizeX,
                        y: this.pixelSizeY
                    }
                }
            }
            b.hasOwnProperty("rasterFunction") &&
                (this.defaultRenderingRule = new F(b), this.setRenderingRule(this.defaultRenderingRule, a))
        },
        _cleanupRequestParams: function(a) {
            if (!a) return a;
            if (a.time && a.mosaicRule) {
                var b = new p(u.fromJson(a.mosaicRule));
                if (b && b.multidimensionalDefinition && 0 < b.multidimensionalDefinition.length) {
                    var c = w.filter(b.multidimensionalDefinition, function(a) {
                        return "StdTime" !== a.dimensionName
                    });
                    b.multidimensionalDefinition = c;
                    a.mosaicRule = dojo.toJson(b.toJson())
                }
            }
            b = "displayOnPan drawMode styling id opacity visible resourceInfo useMapDimensionValue extent".split(" ");
            for (imageParam in b) a.hasOwnProperty(b[imageParam]) && delete a[b[imageParam]];
            return a
        },
        _isScientificData: function() {
            return "esriImageServiceDataTypeVector-UV" === this.serviceDataType || "esriImageServiceDataTypeVector-MagDir" === this.serviceDataType || "esriImageServiceDataTypeScientific " === this.serviceDataType
        },
        _isVectorData: function() {
            return "esriImageServiceDataTypeVector-UV" === this.serviceDataType || "esriImageServiceDataTypeVector-MagDir" === this.serviceDataType
        },
        _createPixelData: function(a) {
            a = new H({
                width: 2,
                height: 2,
                pixels: a,
                pixelType: this.pixelType,
                statistics: a
            });
            var b = this.fullExtent.getCenter(),
                b = new C(b.x, b.y, b.x + this.pixelSizeX, b.y + this.pixelSizeY, this.spatialReference);
            return {
                pixelBlock: a,
                extent: b
            }
        },
        _resolve: function(a, b, c, d, e) {
            b && this[b].apply(this, a);
            c && c.apply(null, a);
            d && k._resDfd(d, a, e)
        }
    })
});