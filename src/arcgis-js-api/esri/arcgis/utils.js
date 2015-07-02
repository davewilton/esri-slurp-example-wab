//>>built
define(["require", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/Deferred", "dojo/_base/json", "dojo/_base/url", "dojo/on", "dojo/DeferredList", "dojo/dom-construct", "../kernel", "../config", "../lang", "../request", "../SpatialReference", "../map", "../urlUtils", "../geometry/ScreenPoint", "../geometry/Extent", "../geometry/webMercatorUtils", "../symbols/jsonUtils", "../renderers/jsonUtils", "../dijit/PopupTemplate", "../dijit/Popup", "../tasks/query", "../tasks/GeometryService", "../layers/ArcGISTiledMapServiceLayer", "../layers/FeatureLayer", "dojo/i18n!../nls/jsapi"], function(G, l, k, u, s, H, pb, za, B, qb, F, I, g, y, z, rb, Aa, Ba, C, sb, D, ea, Ca, tb, ub, vb, wb, w, fa) {
    function E(a) {
        return y({
            url: p.arcgisUrl + "/" + a.itemId + "/data",
            content: {
                f: "json"
            },
            callbackParamName: "callback"
        }, {
            disableIdentityLookup: !0,
            _preLookup: !0
        })
    }

    function ga(a, f) {
        var b = {
            f: "json"
        };
        f && (b.token = f);
        return y({
            url: a,
            content: b,
            callbackParamName: "callback"
        }, {
            disableIdentityLookup: !0
        })
    }

    function ha(a) {
        a.itemProperties.layerDefinition && (a.layerDefinition ? (a.layerDefinition.drawingInfo || (a.layerDefinition.drawingInfo = a.itemProperties.layerDefinition.drawingInfo),
            g.isDefined(a.layerDefinition.definitionExpression) || (a.layerDefinition.definitionExpression = a.itemProperties.layerDefinition.definitionExpression), g.isDefined(a.layerDefinition.minScale) || (a.layerDefinition.minScale = a.itemProperties.layerDefinition.minScale), g.isDefined(a.layerDefinition.maxScale) || (a.layerDefinition.maxScale = a.itemProperties.layerDefinition.maxScale)) : a.layerDefinition = a.itemProperties.layerDefinition);
        a.itemProperties.popupInfo && (!a.popupInfo && !a.disablePopup) && (a.popupInfo = a.itemProperties.popupInfo);
        g.isDefined(a.itemProperties.showLabels) && !g.isDefined(a.showLabels) && (a.showLabels = a.itemProperties.showLabels);
        g.isDefined(a.itemProperties.showLegend) && !g.isDefined(a.showLegend) && (a.showLegend = a.itemProperties.showLegend);
        g.isDefined(a.itemProperties.refreshInterval) && !g.isDefined(a.refreshInterval) && (a.refreshInterval = a.itemProperties.refreshInterval)
    }

    function Da(a) {
        ha(a);
        a.itemProperties.layerDefinition && a.layerDefinition && (!g.isDefined(a.layerDefinition.maximumTrackPoints) && g.isDefined(a.itemProperties.layerDefinition.maximumTrackPoints) &&
            (a.layerDefinition.maximumTrackPoints = a.itemProperties.layerDefinition.maximumTrackPoints), !a.layerDefinition.definitionGeometry && a.itemProperties.layerDefinition.definitionGeometry && (a.layerDefinition.definitionGeometry = a.itemProperties.layerDefinition.definitionGeometry));
        a.itemProperties.purgeOptions && !a.purgeOptions && (a.purgeOptions = a.itemProperties.purgeOptions)
    }

    function J(a, f) {
        var b = new s,
            c = a.itemData,
            d = [],
            e = [];
        k.forEach(c.operationalLayers, function(a) {
            if (a.itemId && !a.type) {
                var c = a.url.toLowerCase(); - 1 < c.indexOf("/featureserver") || -1 < c.indexOf("/mapserver/") ? (e.push(a), d.push(E(a))) : -1 < c.indexOf("/mapserver") && -1 === c.indexOf("/mapserver/") && (!a.layers || !g.isDefined(a.minScale) && !g.isDefined(a.maxScale)) ? (e.push(a), d.push(E(a))) : -1 < c.indexOf("/imageserver") && !g.isDefined(a.minScale) && !g.isDefined(a.maxScale) ? (e.push(a), d.push(E(a))) : -1 < c.indexOf("/streamserver") && (e.push(a), d.push(E(a)))
            }
        });
        c.baseMap && c.baseMap.baseMapLayers && k.forEach(c.baseMap.baseMapLayers, function(a) {
            a.itemId && (e.push(a),
                d.push(E(a)))
        });
        if (0 < d.length) {
            var h = {};
            (new B(d)).addCallback(function(c) {
                k.forEach(e, function(a, e) {
                    var b = c[e][1];
                    if (b && !(b instanceof Error) && (h[a.itemId] = b, !a.type)) {
                        var d = a.url.toLowerCase();
                        if ((-1 < d.indexOf("/featureserver") || -1 < d.indexOf("/mapserver/")) && b.layers) k.forEach(b.layers, function(b) {
                            if (d.match("/featureserver/" + b.id + "$") == "/featureserver/" + b.id || d.match("/mapserver/" + b.id + "$") == "/mapserver/" + b.id) a.itemProperties = b, ha(a)
                        });
                        else if (-1 < d.indexOf("/streamserver")) a.itemProperties = b,
                            Da(a);
                        else if (-1 < d.indexOf("/mapserver")) b.layers && !a.layers && (a.layers = b.layers), g.isDefined(b.minScale) && !g.isDefined(a.minScale) && (a.minScale = b.minScale), g.isDefined(b.maxScale) && !g.isDefined(a.maxScale) && (a.maxScale = b.maxScale), g.isDefined(b.refreshInterval) && !g.isDefined(a.refreshInterval) && (a.refreshInterval = b.refreshInterval), b.visibleLayers && !a.visibleLayers && (a.visibleLayers = b.visibleLayers);
                        else if (-1 < d.indexOf("/imageserver") && (g.isDefined(b.minScale) && !g.isDefined(a.minScale) && (a.minScale =
                                b.minScale), g.isDefined(b.maxScale) && !g.isDefined(a.maxScale) && (a.maxScale = b.maxScale), g.isDefined(b.refreshInterval) && !g.isDefined(a.refreshInterval) && (a.refreshInterval = b.refreshInterval), b.popupInfo && (!a.popupInfo && !a.disablePopup) && (a.popupInfo = b.popupInfo), b.renderingRule && !a.renderingRule && (a.renderingRule = b.renderingRule, b.renderingRule.functionName && (a.renderingRule.rasterFunction = b.renderingRule.functionName)), b.bandIds && !a.bandIds && (a.bandIds = b.bandIds), b.mosaicRule && !a.mosaicRule && (a.mosaicRule =
                                b.mosaicRule), b.format && !a.format && (a.format = b.format), g.isDefined(b.compressionQuality) && !g.isDefined(a.compressionQuality) && (a.compressionQuality = b.compressionQuality), b.layerDefinition && b.layerDefinition.definitionExpression && (!g.isDefined(a.layerDefinition) || !g.isDefined(a.layerDefinition.definitionExpression)))) a.layerDefinition = a.layerDefinition || {}, a.layerDefinition.definitionExpression = b.layerDefinition.definitionExpression
                    }
                });
                a.relatedItemsData = h;
                b.callback(a)
            })
        } else b.callback(a);
        return b
    }

    function xb(a, f) {
        var b = new s,
            c = a.itemData,
            d = c.baseMap.baseMapLayers[0];
        if ("BingMapsAerial" === d.type || "BingMapsRoad" === d.type || "BingMapsHybrid" === d.type)
            if (d.portalUrl && F.id) delete f.bingMapsKey, F.id.checkSignInStatus(Aa.urlToObject(p.arcgisUrl).path).then(l.hitch(null, function(a, b, e, c, f) {
                ga(d.portalUrl, f.token).then(l.hitch(null, ia, a, b, e, c), l.hitch(null, K, a, b, e, c))
            }, a, f, c, b), l.hitch(null, function(a, b, e, c, f) {
                ga(d.portalUrl).then(l.hitch(null, ia, a, b, e, c), l.hitch(null, K, a, b, e, c))
            }, a, f, c, b));
            else if (f.bingMapsKey) {
            var e =
                new t({
                    bingMapsKey: f.bingMapsKey,
                    mapStyle: t.MAP_STYLE_AERIAL
                });
            u.connect(e, "onLoad", l.hitch(this, function() {
                b.callback([a, f])
            }));
            u.connect(e, "onError", function(e) {
                delete f.bingMapsKey;
                a.itemData = L(c);
                d = a.itemData.baseMap.baseMapLayers[0];
                d.errors = [];
                d.errors.push({
                    message: "The owner of the application has not provided a valid Bing Key for the Bing Map it includes. Switching to Esri layers."
                });
                b.callback([a, f])
            })
        } else a.itemData = L(c), d = a.itemData.baseMap.baseMapLayers[0], d.errors = [], d.errors.push({
                message: "The owner of the application has not provided a Bing Key for the Bing Map it includes. Switching to Esri layers."
            }),
            b.callback([a, f]);
        else b.callback([a, f]);
        return b
    }

    function ia(a, f, b, c, d) {
        d.bingKey ? (f.bingMapsKey = d.bingKey, d = new t({
            bingMapsKey: f.bingMapsKey,
            mapStyle: t.MAP_STYLE_AERIAL
        }), u.connect(d, "onLoad", l.hitch(this, function() {
            c.callback([a, f])
        })), u.connect(d, "onError", function(e) {
            delete f.bingMapsKey;
            a.itemData = L(b);
            e = a.itemData.baseMap.baseMapLayers[0];
            e.errors = [];
            e.errors.push({
                message: "The owner of the map has not provided a valid Bing Key for the Bing Map it includes. Switching to Esri layers."
            });
            c.callback([a,
                f
            ])
        })) : K(a, f, b, c)
    }

    function K(a, f, b, c) {
        delete f.bingMapsKey;
        a.itemData = L(b);
        b = a.itemData.baseMap.baseMapLayers[0];
        b.errors = [];
        b.errors.push({
            message: "The owner of the map has not provided a Bing Key for the Bing Map it includes. Switching to Esri layers."
        });
        c.callback([a, f])
    }

    function L(a) {
        a.baseMap = "BingMapsAerial" === a.baseMap.baseMapLayers[0].type ? {
                title: "Imagery",
                baseMapLayers: [{
                    id: "World_Imagery_2017",
                    visibility: !0,
                    opacity: 1,
                    url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
                }]
            } :
            "BingMapsRoad" === a.baseMap.baseMapLayers[0].type ? {
                title: "Streets",
                baseMapLayers: [{
                    id: "World_Street_Map_8421",
                    opacity: 1,
                    visibility: !0,
                    url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
                }]
            } : {
                title: "Imagery with Labels",
                baseMapLayers: [{
                    id: "World_Imagery_6611",
                    opacity: 1,
                    visibility: !0,
                    url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
                }, {
                    id: "World_Boundaries_and_Places_1145",
                    isReference: !0,
                    opacity: 1,
                    visibility: !0,
                    url: "http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer"
                }]
            };
        return a
    }

    function ja(a, f, b, c) {
        var d = a.dynamicLayerInfos || a.layerInfos,
            e = f.layers;
        if (e && d)
            if (c.usePopupManager) {
                var h;
                k.forEach(d, function(a) {
                    var c = a.id;
                    if (!a.subLayerIds)
                        for (a = 0; a < e.length; a++) {
                            var d = e[a];
                            if (d.id === c && d.popupInfo) {
                                h || (h = {});
                                h[c] = {
                                    infoTemplate: new b(d.popupInfo),
                                    layerUrl: d.layerUrl
                                };
                                break
                            }
                        }
                });
                h && a.setInfoTemplates(h)
            } else {
                var m = [],
                    q = [],
                    r = [],
                    n = [],
                    v = [],
                    Ea = [];
                k.forEach(d, function(b) {
                    var c = b.id;
                    if (!b.subLayerIds && -1 !== k.indexOf(a.visibleLayers, c))
                        for (b = 0; b < e.length; b++) {
                            var d = e[b];
                            if (d.id ===
                                c) {
                                q.push(c);
                                m.push(d.popupInfo);
                                r.push(d.layerUrl || "");
                                d.layerDefinition && d.layerDefinition.definitionExpression ? n.push(d.layerDefinition.definitionExpression) : n.push("");
                                v.push(g.isDefined(d.minScale) ? d.minScale : null);
                                Ea.push(g.isDefined(d.maxScale) ? d.maxScale : null);
                                break
                            }
                        }
                });
                m.length && (a.__popups = m, a.__popupIds = q, a.__popupUrls = r, a.__popupWhereClauses = n, a.__popupMinScales = v, a.__popupMaxScales = Ea, a.__resourceInfo = f.resourceInfo)
            }
    }

    function ka(a) {
        if (!a) return !1;
        var f = (new pb(p.arcgisUrl)).authority;
        return -1 !== a.indexOf(".arcgis.com/") || -1 !== a.indexOf(f)
    }

    function Fa(a) {
        return !a ? !1 : -1 !== a.indexOf("/services.arcgisonline.com/") || -1 !== a.indexOf("/server.arcgisonline.com/")
    }

    function A(a) {
        if ("https:" === location.protocol && (ka(a) || Fa(a))) a = a.replace("http:", "https:");
        return a
    }

    function la(a, f, b) {
        var c = [],
            d;
        a.displayLevels || (c = k.map(a.resourceInfo.tileInfo.lods, function(a) {
            return a.level
        }));
        a.exclusionAreas && (d = l.clone(a.exclusionAreas), d = k.map(d, function(a) {
            a.geometry = new C(a.geometry);
            return a
        }));
        c =
            new wb(A(a.url), {
                resourceInfo: a.resourceInfo,
                opacity: a.opacity,
                visible: a.visibility,
                displayLevels: a.displayLevels || c,
                id: a.id,
                minScale: a.minScale,
                maxScale: a.maxScale,
                refreshInterval: a.refreshInterval,
                exclusionAreas: d
            });
        b.ignorePopups || ja(c, a, f, b);
        return c
    }

    function ma(a, f) {
        if (!a || !f || 0 === f.length) return [];
        var b = "," + f + ",",
            c = [],
            d, e = ",";
        for (d = 0; d < a.length; d++)
            if (null !== a[d].subLayerIds) {
                if (-1 === b.indexOf("," + a[d].id + ",") || -1 < e.indexOf("," + a[d].id + ",")) e += a[d].subLayerIds.toString() + ","
            } else -1 < b.indexOf("," +
                a[d].id + ",") && -1 === e.indexOf("," + a[d].id + ",") && c.push(a[d].id);
        return c
    }

    function Ga(a, f, b) {
        var c = new Ha;
        c.format = "png24";
        a.resourceInfo && (a.resourceInfo.supportedImageFormatTypes && -1 < a.resourceInfo.supportedImageFormatTypes.indexOf("PNG32")) && (c.format = "png32");
        var c = new Ia(A(a.url), {
                resourceInfo: a.resourceInfo,
                opacity: a.opacity,
                visible: a.visibility,
                id: a.id,
                imageParameters: c,
                minScale: a.minScale,
                maxScale: a.maxScale,
                refreshInterval: a.refreshInterval
            }),
            d = a.visibleLayers;
        if (!a.visibleLayers) {
            var e = "";
            k.forEach(c.layerInfos, function(a) {
                a.defaultVisibility && (e += (0 < e.length ? "," : "") + a.id)
            });
            d = e
        }
        if (a.layers && 0 < a.layers.length) {
            var h = [],
                m = [],
                q, g = [],
                n, v;
            k.forEach(a.layers, function(b) {
                b.layerDefinition && b.layerDefinition.definitionExpression && (h[b.id] = b.layerDefinition.definitionExpression);
                if (b.layerDefinition && b.layerDefinition.source) {
                    q = null;
                    v = b.layerDefinition.source;
                    if ("mapLayer" === v.type) {
                        var c = k.filter(a.resourceInfo.layers, function(a) {
                            return a.id === v.mapLayerId
                        });
                        c.length && (q = l.mixin(c[0], b))
                    } else q =
                        l.mixin({}, b);
                    q && (q.source = v, delete q.popupInfo, q = new Ja(q), a.visibleLayers && (c = "string" == typeof a.visibleLayers ? a.visibleLayers.split(",") : a.visibleLayers, -1 < k.indexOf(c, b.id) ? q.defaultVisibility = !0 : q.defaultVisibility = !1), m.push(q))
                }
                b.layerDefinition && (b.layerDefinition.source && b.layerDefinition.drawingInfo) && (n = new Ka(b.layerDefinition.drawingInfo), g[b.id] = n)
            }, this);
            0 < h.length && c.setLayerDefinitions(h);
            0 < m.length ? (c.setDynamicLayerInfos(m, !0), 0 < g.length && c.setLayerDrawingOptions(g, !0)) : (d = ma(c.layerInfos,
                d), c.setVisibleLayers(d))
        } else d = ma(c.layerInfos, d), c.setVisibleLayers(d);
        b.ignorePopups || ja(c, a, f, b);
        return c
    }

    function yb(a, f, b) {
        var c = new La;
        c.bandIds = a.bandIds;
        null != a.format && (c.format = a.format, null != a.compressionQuality && (c.compressionQuality = a.compressionQuality));
        if (a.renderingRule && a.renderingRule.rasterFunction) {
            var d = new Ma(a.renderingRule);
            c.renderingRule = d
        }
        a.mosaicRule && (d = new Na(a.mosaicRule), c.mosaicRule = d);
        g.isDefined(a.noData) && (c.noData = a.noData);
        g.isDefined(a.noDataInterpretation) &&
            (c.noDataInterpretation = a.noDataInterpretation);
        g.isDefined(a.interpolation) && (c.interpolation = a.interpolation);
        d = a.layerType ? "ArcGISImageServiceVectorLayer" === a.layerType : !1;
        g.isDefined(a.layerType) || (d = a.resourceInfo.hasMultidimensions && ("esriImageServiceDataTypeVector-UV" === a.resourceInfo.serviceDataType || "esriImageServiceDataTypeVector-MagDir" === a.resourceInfo.serviceDataType));
        c = {
            resourceInfo: a.resourceInfo,
            opacity: a.opacity,
            visible: a.visibility,
            id: a.id,
            imageServiceParameters: c,
            minScale: a.minScale,
            maxScale: a.maxScale,
            refreshInterval: a.refreshInterval
        };
        c = d ? new Oa(A(a.url), c) : new Pa(A(a.url), c);
        a.layerDefinition && a.layerDefinition.definitionExpression && c.setDefinitionExpression(a.layerDefinition.definitionExpression, !0);
        !b.ignorePopups && a.popupInfo && c.setInfoTemplate(new f(a.popupInfo));
        return c
    }

    function na(a, f, b) {
        var c = [102113, 102100, 3857],
            d = b || new z(f[0].layerObject.fullExtent.spatialReference),
            e = new z(a.resourceInfo.fullExtent.spatialReference);
        return d.wkt == e.wkt && (d.wkid == e.wkid || g.isDefined(d.latestWkid) &&
            d.latestWkid == e.wkid || g.isDefined(e.latestWkid) && d.wkid == e.latestWkid || g.isDefined(d.latestWkid) && d.latestWkid == e.latestWkid) || d.wkid && e.wkid && k.some(c, function(a) {
            return a === e.wkid
        }) && k.some(c, function(a) {
            return a === d.wkid
        }) ? !0 : !1
    }

    function oa(a, f) {
        if (!f[0].layerObject.tileInfo) return !1;
        var b = [];
        k.forEach(f, function(a) {
            a.baseMapLayer && a.layerObject.tileInfo && (b = b.concat(k.map(a.layerObject.tileInfo.lods, function(a) {
                return a.scale
            })))
        });
        return k.some(a.resourceInfo.tileInfo.lods, function(a) {
            return k.some(b,
                function(b) {
                    return b === a.scale
                })
        })
    }

    function pa(a, f, b, c, d) {
        var e, h = b._clazz;
        if ("OpenStreetMap" === a.type) e = new Qa({
            id: a.id,
            opacity: a.opacity,
            visible: null !== a.visibility && void 0 !== a.visibility ? a.visibility : !0
        });
        else if ("WMS" === a.type) {
            var m = [],
                q = [];
            k.forEach(a.layers, function(a) {
                q.push(new Ra({
                    name: a.name,
                    title: a.title,
                    legendURL: a.legendURL
                }));
                m.push(a.name)
            }, this);
            a.visibleLayers && (m = a.visibleLayers);
            c = {
                extent: new C(a.extent[0][0], a.extent[0][1], a.extent[1][0], a.extent[1][1], new z({
                    wkid: 4326
                })),
                layerInfos: q,
                version: a.version,
                maxWidth: a.maxWidth,
                maxHeight: a.maxHeight,
                getMapURL: a.mapUrl,
                spatialReferences: a.spatialReferences,
                title: a.title,
                copyright: a.copyright,
                minScale: a.minScale || 0,
                maxScale: a.maxScale || 0,
                format: a.format
            };
            e = new Sa(a.url, {
                id: a.id,
                visibleLayers: m,
                format: "png",
                transparent: a.baseMapLayer ? !1 : !0,
                opacity: a.opacity,
                visible: null !== a.visibility ? a.visibility : !0,
                resourceInfo: c,
                refreshInterval: a.refreshInterval
            });
            e.spatialReference.wkid = c.spatialReferences[0]
        } else if ("KML" === a.type) {
            b = a.url;
            if (F.id &&
                (h = F.id.findCredential(Aa.urlToObject(p.arcgisUrl).path))) {
                var r = p.arcgisUrl.substring(p.arcgisUrl.indexOf("//") + 2, p.arcgisUrl.indexOf("/", p.arcgisUrl.indexOf("//") + 3)),
                    n = r.split("."),
                    n = n[n.length - 2] + "." + n[n.length - 1];
                f = b.indexOf(n); - 1 < f && (b = "https://" + r + b.substring(f + n.length), b += "?token\x3d" + h.token)
            }
            e = new Ta(b, {
                id: a.id,
                visible: null !== a.visibility ? a.visibility : !0,
                outSR: c,
                refreshInterval: a.refreshInterval
            });
            u.connect(e, "onLoad", function() {
                (a.opacity || 0 === a.opacity) && e.setOpacity(a.opacity);
                g.isDefined(a.minScale) &&
                    g.isDefined(a.maxScale) && e.setScaleRange(a.minScale, a.maxScale);
                a.visibleFolders && k.forEach(e.folders, function(b) {
                    -1 < k.indexOf(a.visibleFolders, b.id) ? e.setFolderVisibility(b, !0) : e.setFolderVisibility(b, !1)
                }, this)
            })
        } else "WebTiledLayer" === a.type ? (e = new Ua(a.templateUrl, {
                id: a.id,
                visible: null !== a.visibility ? a.visibility : !0,
                opacity: a.opacity,
                copyright: a.copyright,
                fullExtent: a.fullExtent && new C(a.fullExtent),
                initialExtent: a.fullExtent && new C(a.fullExtent),
                subDomains: a.subDomains,
                tileInfo: a.tileInfo ? new Va(a.tileInfo) : null,
                refreshInterval: a.refreshInterval
            }), u.connect(e, "onLoad", function() {
                (g.isDefined(a.minScale) || g.isDefined(a.maxScale)) && e.setScaleRange(a.minScale, a.maxScale)
            })) : "GeoRSS" === a.type ? (e = new Wa(a.url, {
                id: a.id,
                opacity: a.opacity,
                outSpatialReference: c,
                refreshInterval: a.refreshInterval
            }), u.connect(e, "onLoad", function() {
                !1 === a.visibility && e.hide();
                g.isDefined(a.minScale) && g.isDefined(a.maxScale) && e.setScaleRange(a.minScale, a.maxScale);
                var b = e.getFeatureLayers();
                k.forEach(b, function(c) {
                    a.pointSymbol &&
                        "esriGeometryPoint" === c.geometryType ? (c.renderer.symbol = D.fromJson(a.pointSymbol), 1 === b.length && (e.pointSymbol = D.fromJson(a.pointSymbol))) : a.lineSymbol && "esriGeometryPolyline" === c.geometryType ? (c.renderer.symbol = D.fromJson(a.lineSymbol), 1 === b.length && (e.polylineSymbol = D.fromJson(a.lineSymbol))) : a.polygonSymbol && "esriGeometryPolygon" === c.geometryType && (c.renderer.symbol = D.fromJson(a.polygonSymbol), 1 === b.length && (e.polygonSymbol = D.fromJson(a.polygonSymbol)))
                })
            })) : "CSV" == a.type && a.url ? (c = {
                layerDefinition: a.layerDefinition,
                columnDelimiter: a.columnDelimiter,
                id: a.id ? a.id : null,
                visible: null !== a.visibility ? a.visibility : !0,
                opacity: a.opacity,
                refreshInterval: a.refreshInterval
            }, a.locationInfo && (c.latitudeFieldName = a.locationInfo.latitudeFieldName, c.longitudeFieldName = a.locationInfo.longitudeFieldName), b.ignorePopups || (c.infoTemplate = new Ca(a.popupInfo ? a.popupInfo : Xa.generateDefaultPopupInfo(a))), e = new Ya(a.url, c)) : a.layerDefinition && !a.url ? (c = H.fromJson(H.toJson(a)), delete c.id, delete c.opacity, delete c.visibility, e = new w(c, {
                id: a.id,
                opacity: a.opacity,
                visible: a.visibility,
                outFields: ["*"],
                autoGeneralize: !0
            }), !b.ignorePopups && c.popupInfo && e.setInfoTemplate(new h(c.popupInfo)), Za(e)) : "BingMapsAerial" === a.type || "BingMapsRoad" === a.type || "BingMapsHybrid" === a.type ? b.bingMapsKey ? (c = t.MAP_STYLE_AERIAL_WITH_LABELS, "BingMapsAerial" === a.type ? c = t.MAP_STYLE_AERIAL : "BingMapsRoad" === a.type && (c = t.MAP_STYLE_ROAD), e = new t({
                bingMapsKey: b.bingMapsKey,
                mapStyle: c,
                opacity: a.opacity,
                id: a.id
            }), u.connect(e, "onError", l.hitch(this, function(a) {
                a.errors =
                    a.errors || [];
                a.errors.push({
                    message: "This application does not have a valid Bing Key for the Bing layer that is included in this map. [type:" + a.type + "]"
                })
            }, a))) : (a.errors = a.errors || [], a.errors.push({
                message: "This application does not provide a Bing Key for the Bing layer that is included in this map. [type:" + a.type + "]"
            })) : a.resourceInfo && a.resourceInfo.mapName ? e = !0 === a.resourceInfo.singleFusedMapCache && (a.baseMapLayer || na(a, f, c) && oa(a, d)) ? la(a, h, b) : Ga(a, h, b) : a.resourceInfo && a.resourceInfo.pixelSizeX ?
            e = !0 === a.resourceInfo.singleFusedMapCache && (a.baseMapLayer || na(a, f, c) && oa(a, d)) ? la(a, h, b) : yb(a, h, b) : a.resourceInfo && "Feature Layer" === a.resourceInfo.type ? (a.capabilities && (a.resourceInfo.capabilities = a.capabilities), e = new w(A(a.url), {
                    resourceInfo: a.resourceInfo,
                    opacity: a.opacity,
                    visible: a.visibility,
                    id: a.id,
                    mode: ka(a.url) ? w.MODE_AUTO : g.isDefined(a.mode) ? a.mode : w.MODE_ONDEMAND,
                    editable: !1 === b.editable ? !1 : void 0,
                    outFields: ["*"],
                    autoGeneralize: !0,
                    refreshInterval: a.refreshInterval
                }), !b.ignorePopups &&
                a.popupInfo && e.setInfoTemplate(new h(a.popupInfo)), a.layerDefinition && (a.layerDefinition.drawingInfo && a.layerDefinition.drawingInfo.renderer && (c = ea.fromJson(a.layerDefinition.drawingInfo.renderer), c.isMaxInclusive = !0, e.setRenderer(c)), a.layerDefinition.drawingInfo && a.layerDefinition.drawingInfo.labelingInfo && (c = k.map(a.layerDefinition.drawingInfo.labelingInfo, function(a) {
                        return new $a(a)
                    }), e.setLabelingInfo(c)), a.layerDefinition.definitionExpression && e.setDefinitionExpression(a.layerDefinition.definitionExpression),
                    g.isDefined(a.layerDefinition.minScale) && e.setMinScale(a.layerDefinition.minScale), g.isDefined(a.layerDefinition.maxScale) && e.setMaxScale(a.layerDefinition.maxScale)), Za(e)) : a.resourceInfo && a.resourceInfo.streamUrls && (c = {
                resourceInfo: a.resourceInfo,
                opacity: a.opacity,
                visible: a.visibility,
                id: a.id
            }, a.layerDefinition && (n = a.layerDefinition.drawingInfo, a.layerDefinition.definitionGeometry && (r = r || {}, r.geometry = a.layerDefinition.definitionGeometry), g.isDefined(a.layerDefinition.definitionExpression) && (r =
                r || {}, r.where = a.layerDefinition.definitionExpression), g.isDefined(a.layerDefinition.maximumTrackPoints) && (c.maximumTrackPoints = a.layerDefinition.maximumTrackPoints)), r && (c.filter = r), a.purgeOptions && (c.purgeOptions = a.purgeOptions), e = new ab(A(a.url), c), n && n.renderer && (c = n.renderer, e.setRenderer(ea.fromJson(c))), !b.ignorePopups && a.popupInfo && e.setInfoTemplate(new h(a.popupInfo)), a.layerDefinition && (g.isDefined(a.layerDefinition.minScale) && e.setMinScale(a.layerDefinition.minScale), g.isDefined(a.layerDefinition.maxScale) &&
                e.setMaxScale(a.layerDefinition.maxScale)), za.once(e, "error", function(b) {
                a.errors.push({
                    message: "Error loading stream layer. Check websocket url"
                })
            }));
        e && (e.arcgisProps = {
            title: a.title
        }, a.baseMapLayer && (e._basemapGalleryLayerType = a.isReference ? "reference" : "basemap"));
        return e
    }

    function qa(a, f, b, c) {
        k.forEach(a, function(e, d) {
            if (e.url && !e.type) {
                if (0 === d || a[0].layerObject) e.layerObject = pa(e, a, f, b, c)
            } else e.layerObject = pa(e, a, f, b, c)
        });
        var d = k.filter(a, function(a) {
                return !a.isReference
            }),
            e = k.filter(a, function(a) {
                return !!a.isReference
            });
        return a = d.concat(e)
    }

    function ra(a) {
        var f = null;
        a = a[0];
        a.url && !a.type ? a.resourceInfo.spatialReference && (f = new z, a.resourceInfo.spatialReference.wkid && (f.wkid = a.resourceInfo.spatialReference.wkid), a.resourceInfo.spatialReference.wkt && (f.wkt = a.resourceInfo.spatialReference.wkt)) : -1 < a.type.indexOf("BingMaps") || "OpenStreetMap" == a.type ? f = new z({
            wkid: 102100
        }) : "WMS" == a.type && (f = new z({
            wkid: a.spatialReferences[0]
        }));
        return f
    }

    function bb(a, f, b, c, d, e, h) {
        k.forEach(f, function(b, c) {
            b.url && !b.type && (b.resourceInfo =
                a[b.deferredsPos][1], delete b.deferredsPos)
        });
        e = e || ra(f);
        f = qa(f, b, e, h);
        d.callback(f);
        return d
    }

    function Za(a) {
        !window.CanvasRenderingContext2D && (a.renderer && "esri.renderer.HeatmapRenderer" === a.renderer.declaredClass) && a.setRenderer(ea.fromJson({
            type: "simple",
            symbol: {
                color: [77, 77, 77, 255],
                size: 6,
                angle: 0,
                xoffset: 0,
                yoffset: 0,
                type: "esriSMS",
                style: "esriSMSCircle",
                outline: {
                    color: [255, 255, 255, 255],
                    width: 0.75,
                    type: "esriSLS",
                    style: "esriSLSSolid"
                }
            }
        }))
    }

    function cb(a, f) {
        var b = A(a);
        return y({
            url: b,
            content: {
                f: "json"
            },
            callbackParamName: "callback",
            error: function(a, d) {
                a.message = a.message ? a.message + (" [url:" + b + "]") : "[url:" + b + "]";
                f.push(a);
                I.defaults.io.errorHandler(a, d)
            }
        })
    }

    function db(a) {
        var f = p.arcgisUrl + "/" + a.itemId + "/data";
        return y({
            url: f,
            content: {
                f: "json"
            },
            callbackParamName: "callback",
            error: function(b, c) {
                b.message = b.message ? b.message + (" [url:" + f + "]") : "[url:" + f + "]";
                a.errors = a.errors || [];
                a.errors.push(b);
                I.defaults.io.errorHandler(b, c)
            }
        })
    }

    function eb(a, f, b) {
        var c = new s;
        if ((!b.featureCollection || !b.featureCollection.layers) &&
            !b.layers) return console.log("Invalid Feature Collection item data [item id: " + a.itemId + "]: ", b), a.errors = a.errors || [], a.errors.push({
            message: "Invalid Feature Collection item data. [item id: " + a.itemId + "]"
        }), c.errback(), c;
        b.layers && (b.featureCollection = {
            layers: b.layers
        }, delete b.layers, g.isDefined(b.showLegend) && (b.featureCollection.showLegend = b.showLegend, delete b.showLegend));
        fb(a, b.featureCollection, f).then(function(d) {
            b.featureCollection = d;
            a.featureCollection && a.featureCollection.layers ? k.forEach(b.featureCollection.layers,
                function(b, c) {
                    var d = a.featureCollection.layers[c];
                    if (!d.poupInfo && !d.layerDefinition) d.popupInfo = b.popupInfo, d.layerDefinition = b.layerDefinition;
                    else if (d.layerDefinition) {
                        if (g.isDefined(d.layerDefinition.minScale) && g.isDefined(d.layerDefinition.maxScale) && (d.layerDefinition.minScale !== b.layerDefinition.minScale || d.layerDefinition.maxScale !== b.layerDefinition.maxScale)) delete b.layerDefinition.minscale, delete b.layerDefinition.maxScale;
                        d.layerDefinition.drawingInfo && H.toJson(d.layerDefinition.drawingInfo) !==
                            H.toJson(b.layerDefinition.drawingInfo) && delete b.layerDefinition.drawingInfo;
                        d.layerDefinition.showLegend !== b.layerDefinition.showLegend && delete b.layerDefinition.showLegend;
                        d.layerDefinition = l.mixin(d.layerDefinition, b.layerDefinition)
                    } else d.layerDefinition = b.layerDefinition;
                    d.featureSet = b.featureSet;
                    d.nextObjectId = b.nextObjectId
                }) : (a.featureCollection = a.featureCollection || {}, a.featureCollection = l.mixin(a.featureCollection, b.featureCollection));
            c.callback(a)
        });
        return c
    }

    function fb(a, f, b) {
        var c =
            new s;
        G(["./csv"], function(d) {
            var e = [];
            k.forEach(f.layers, function(a) {
                a.featureSet && (a.featureSet.features && a.featureSet.features.length && a.featureSet.features[0].geometry && a.featureSet.features[0].geometry.spatialReference) && (a.deferredsPos = e.length, e.push(d.projectFeatureCollection(a, b, a.featureSet.features[0].geometry.spatialReference)))
            });
            (new B(e)).addCallback(function() {
                k.forEach(f.layers, function(b) {
                    g.isDefined(b.deferredsPos) && (e[b.deferredsPos].results && e[b.deferredsPos].results.length ? b =
                        e[b.deferredsPos].results[0] : (console.log("Errors projecting feature collection. [" + a.title + " - " + b.layerDefinition.name + "]"), b.errors = b.errors || [], b.errors.push({
                            message: "Errors projecting feature collection. [" + a.title + " - " + b.layerDefinition.name + "]"
                        })), delete b.deferredsPos)
                });
                c.callback(f)
            })
        });
        return c
    }

    function M(a, f, b, c) {
        var d = new s,
            e = new s,
            h = [],
            m;
        k.forEach(a.operationalLayers, function(a) {
            a.itemId && "Feature Collection" == a.type && h.push(db(a).then(l.hitch(null, eb, a, b)))
        });
        0 === h.length ? gb(a, f,
            b, c, e) : (m = new B(h), m.addCallback(function(d) {
            gb(a, f, b, c, e)
        }));
        e.then(function(a) {
            h = [];
            k.forEach(a, function(a) {
                a = a.layerObject;
                if (a instanceof w && !a.loaded && !a.loadError) {
                    var b = new s;
                    za.once(a, "load, error", function() {
                        b.callback(a)
                    });
                    h.push(b)
                }
            });
            if (h.length) {
                var b = new s;
                m = new B(h);
                m.addCallback(function() {
                    b.callback(a)
                });
                return b.promise
            }
            return a
        }).then(function(a) {
            var b = [];
            k.forEach(a, function(a) {
                if (a.layerObject instanceof w) {
                    var c = a.layerObject;
                    c.loaded && (c.labelingInfo && (a.showLabels || c._collection)) &&
                        b.push(c)
                }
            });
            b.length ? G(["../layers/LabelLayer"], function(c) {
                var e = new c;
                k.forEach(b, function(a) {
                    e.addFeatureLayer(a)
                });
                a.push({
                    layerObject: e
                });
                d.callback(a)
            }) : d.callback(a)
        });
        return d
    }

    function gb(a, f, b, c, d) {
        var e = [],
            h = [],
            m = [];
        k.forEach(a.operationalLayers, function(a, b) {
            a.featureCollection ? k.forEach(a.featureCollection.layers, function(c, d) {
                    var e = !0;
                    a.visibleLayers && -1 == k.indexOf(a.visibleLayers, d) && (e = !1);
                    c.visibility = a.visibility && e;
                    c.opacity = a.opacity;
                    c.id = (a.id || "operational" + b) + "_" + d;
                    m.push(c)
                },
                this) : m.push(a)
        });
        k.forEach(a.baseMap.baseMapLayers, function(a, b) {
            a.baseMapLayer = !0;
            a.id = a.id || "base" + b;
            e.push(a)
        });
        k.forEach(m, function(a, b) {
            a.id = a.id || "operational" + b;
            e.push(a)
        });
        k.forEach(e, function(a) {
            a.url && !a.type && (a.deferredsPos = h.length, a.errors = a.errors || [], h.push(cb(a.url, a.errors)))
        });
        0 === h.length ? (b = b || ra(e), e = qa(e, f, b, c), d.callback(e)) : (new B(h)).addCallback(function(a) {
            bb(a, e, f, h, d, b, c)
        });
        return d
    }

    function N(a, f, b, c) {
        var d = a.minScale,
            e = a.maxScale;
        if (10.1 >= b.version && f)
            for (a = f.length -
                1; 0 <= a; a--) {
                if (f[a].id == c)
                    if (0 == d && 0 < f[a].minScale ? d = f[a].minScale : 0 < d && 0 == f[a].minScale ? d = b.minScale : 0 < d && 0 < f[a].minScale && (d = Math.min(d, f[a].minScale)), e = Math.max(b.maxScale || 0, f[a].maxScale || 0), b.setScaleRange(d, e), -1 < f[a].parentLayerId) c = f[a].parentLayerId;
                    else break
            } else 10.1 < b.version && (k.forEach(a.layerInfos, function(a) {
                a.id == c && (0 == d && 0 < a.minScale ? d = a.minScale : 0 < d && 0 == a.minScale || 0 < d && 0 < a.minScale && (d = Math.min(d, a.minScale)), e = Math.max(e || 0, a.maxScale || 0))
            }), b.setScaleRange(d, e))
    }

    function O(a,
        f, b, c) {
        var d = a.url,
            e = a.__popupIds,
            h = a.__popupUrls,
            m = a.__popupWhereClauses,
            q = a.__popupMinScales,
            r = a.__popupMaxScales,
            n = a.__resourceInfo,
            v = [];
        k.forEach(a.__popups, function(c, l) {
            if (c) {
                var p, s = [];
                k.forEach(c.fieldInfos, function(a) {
                    "shape" !== a.fieldName.toLowerCase() && s.push(a.fieldName)
                });
                if (a.dynamicLayerInfos && 0 < a.dynamicLayerInfos.length) {
                    var t = k.filter(a.dynamicLayerInfos, function(a) {
                        return e[l] == a.id
                    })[0].source;
                    p = new w(d + "/dynamicLayer", {
                        id: a.id + "_" + e[l],
                        source: t,
                        outFields: s,
                        mode: w.MODE_SELECTION,
                        infoTemplate: c && new b(c),
                        drawMode: !1,
                        visible: a.visible,
                        autoGeneralize: !0
                    });
                    var x = function(b, c) {
                        0 < m[b].length && c.setDefinitionExpression(m[b]);
                        if (!g.isDefined(q[b]) && !g.isDefined(r[b])) N(a, f || n.layers, c, e[b]);
                        else if (g.isDefined(a.minScale) || g.isDefined(a.maxScale)) {
                            var d = a.minScale,
                                h = a.maxScale;
                            0 == d && 0 < q[b] ? d = q[b] : 0 < d && 0 == q[b] || 0 < d && 0 < q[b] && (d = Math.min(d, q[b]));
                            h = Math.max(h || 0, r[b] || 0);
                            c.setScaleRange(d, h)
                        } else c.setScaleRange(q[b], r[b])
                    };
                    p.loaded ? x(l, p) : u.connect(p, "onLoad", function(a) {
                        x(l, p)
                    })
                } else {
                    var y =
                        null,
                        z = d + "/" + e[l];
                    if (h[l].length) z = h[l];
                    else if (f)
                        for (t = 0; t < f.length; t++)
                            if (f[t].id === e[l]) {
                                y = f[t];
                                break
                            }
                    p = new w(A(z), {
                        id: a.id + "_" + e[l],
                        outFields: s,
                        mode: w.MODE_SELECTION,
                        infoTemplate: c && new b(c),
                        drawMode: !1,
                        visible: a.visible,
                        resourceInfo: y,
                        autoGeneralize: !0
                    });
                    p.loaded ? (0 < m[l].length && p.setDefinitionExpression(m[l]), N(a, f || n.layers, p, e[l])) : u.connect(p, "onLoad", function(b) {
                        0 < m[l].length && p.setDefinitionExpression(m[l]);
                        N(a, f || n.layers, b, e[l])
                    })
                }
                v.push(p)
            }
        });
        0 < v.length && (u.connect(a, "onVisibilityChange",
            l.hitch(this, function(a, b) {
                k.forEach(a, function(a) {
                    b ? a.show() : a.hide()
                })
            }, v)), u.connect(c, "onLayerRemove", l.hitch(this, function(a, b, d) {
            a.id === d.id && k.forEach(b, function(a) {
                c.removeLayer(a)
            })
        }, a, v)));
        delete a.__popups;
        delete a.__popupIds;
        delete a.__popupUrls;
        delete a.__popupWhereClauses;
        delete a.__popupMinScales;
        delete a.__popupMaxScales;
        delete a.__resourceInfo;
        return v
    }

    function hb(a) {
        return y({
            url: A(a.url + "/layers"),
            content: {
                f: "json"
            },
            callbackParamName: "callback",
            error: function() {}
        })
    }

    function ib(a,
        f, b) {
        var c = [];
        k.forEach(a, function(a) {
            var b = a.__popups;
            b && (1 < b.length && 10 <= a.version) && (a.__deferredsPos = c.length, c.push(hb(a)))
        });
        var d = [];
        0 < c.length ? (new B(c)).addCallback(function(c) {
            k.forEach(a, function(a) {
                a.__popups && 0 < a.__popups.length && (a.__deferredsPos || 0 === a.__deferredsPos ? (d = d.concat(O(a, c[a.__deferredsPos][1].layers, b, f)), delete a.__deferredsPos) : d = d.concat(O(a, null, b, f)))
            });
            f.addLayers(d)
        }) : (k.forEach(a, function(a) {
            a.__popups && 0 < a.__popups.length && (d = d.concat(O(a, null, b, f)))
        }), f.addLayers(d))
    }

    function jb(a) {
        k.forEach(a, function(a) {
            var b = a.layer;
            b.toJson && (a = b.toJson(), a.featureSet && (b.name && -1 < b.name.indexOf("Text")) && k.forEach(a.featureSet.features, function(a, d) {
                if (a.attributes.TEXT) {
                    var e = b.graphics[d];
                    e.symbol.setText(a.attributes.TEXT);
                    a.symbol.horizontalAlignment && (e.symbol.align = a.symbol.horizontalAlignment);
                    e.setSymbol(e.symbol);
                    e.setAttributes(a.attributes)
                }
            }, this))
        })
    }

    function kb(a) {
        var f = 6;
        k.forEach(a, function(a) {
            if (a = a.renderer) "esri.renderer.SimpleRenderer" === a.declaredClass ?
                ((a = a.symbol) && a.xoffset && (f = Math.max(f, Math.abs(a.xoffset))), a && a.yoffset && (f = Math.max(f, Math.abs(a.yoffset)))) : ("esri.renderer.UniqueValueRenderer" === a.declaredClass || "esri.renderer.ClassBreaksRenderer" === a.declaredClass) && k.forEach(a.infos, function(a) {
                    (a = a.symbol) && a.xoffset && (f = Math.max(f, Math.abs(a.xoffset)));
                    a && a.yoffset && (f = Math.max(f, Math.abs(a.yoffset)))
                })
        });
        return f
    }

    function sa(a) {
        var f = this,
            b = f.infoWindow,
            c = a.graphic;
        if (f.loaded) {
            b.hide();
            b.clearFeatures();
            var d = [];
            k.forEach(f.graphicsLayerIds,
                function(a) {
                    if ((a = f.getLayer(a)) && a instanceof w && a.loaded && a.visible) a.clearSelection(), a.infoTemplate && !a.suspended && d.push(a)
                });
            k.forEach(f.layerIds, function(a) {
                (a = f.getLayer(a)) && (-1 !== a.declaredClass.indexOf("ArcGISImageServiceLayer") && a.loaded && a.visible && a.infoTemplate) && d.push(a)
            });
            c = c && c.getInfoTemplate() ? c : null;
            if (d.length || c) {
                var e = kb(d),
                    h = a.screenPoint,
                    m = f.toMap(new Ba(h.x - e, h.y + e)),
                    e = f.toMap(new Ba(h.x + e, h.y - e)),
                    m = new C(m.x, m.y, e.x, e.y, f.spatialReference),
                    g = new ub;
                g.geometry = m;
                g.timeExtent =
                    f.timeExtent;
                var l = !0,
                    m = k.map(d, function(b) {
                        var c; - 1 !== b.declaredClass.indexOf("ArcGISImageServiceLayer") ? (g.geometry = a.mapPoint, l = !1, c = b.queryVisibleRasters(g, {
                            rasterAttributeTableFieldPrefix: "Raster.",
                            returnDomainValues: !0
                        }), c.addCallback(function() {
                            return b.getVisibleRasters()
                        })) : (c = b.selectFeatures(g), c.addCallback(function() {
                            return b.getSelectedFeatures()
                        }));
                        return c
                    });
                c && (e = new s, e.callback([c]), m.splice(0, 0, e));
                if (!k.some(m, function(a) {
                        return -1 === a.fired
                    })) {
                    var n = c ? 1 : 0;
                    k.forEach(d, function(a) {
                        n = -1 !== a.declaredClass.indexOf("ArcGISImageServiceLayer") ? n + a.getVisibleRasters().length : n + a.getSelectedFeatures().length
                    });
                    if (!n) return
                }
                b.setFeatures(m);
                b.show(a.mapPoint, {
                    closestFirst: l
                })
            }
        }
    }

    function zb(a, f) {
        var b = f.mapOptions || {},
            c;
        b.infoWindow || (c = new tb({
            visibleWhenEmpty: !1
        }, qb.create("div")), b.infoWindow = c);
        !g.isDefined(b.showInfoWindowOnClick) && !f.usePopupManager && (b.showInfoWindowOnClick = !1);
        b = new rb(a, b);
        u.connect(b, "onLayersAddResult", jb);
        return b
    }

    function x(a, f, b, c, d, e) {
        var h, g, q, l;
        c.map ?
            (h = c.map, g = c.clickEventHandle, q = c.clickEventListener, l = c.errors) : (h = zb(c, d), !d.ignorePopups && (!d.disableClickBehavior && !d.usePopupManager) && (g = u.connect(h, "onClick", sa), q = sa));
        h.addLayers(a);
        !d.ignorePopups && !d.usePopupManager && ib(a, h, d._clazz);
        var n = l || [];
        k.forEach(f, function(a) {
            a.errors && (n = n.concat(a.errors))
        }, this);
        h.loaded ? e.callback({
            map: h,
            itemInfo: b,
            errors: n,
            clickEventHandle: g,
            clickEventListener: q
        }) : u.connect(h, "onLoad", function() {
            e.callback({
                map: h,
                itemInfo: b,
                errors: n,
                clickEventHandle: g,
                clickEventListener: q
            })
        })
    }

    function P(a, f, b, c, d) {
        var e = [];
        k.forEach(d, function(a) {
            l.isArray(a.layerObject) ? k.forEach(a.layerObject, function(a) {
                e.push(a)
            }) : e.push(a.layerObject)
        });
        if ("BingMapsAerial" === d[0].type || "BingMapsRoad" === d[0].type || "BingMapsHybrid" === d[0].type) var h = setInterval(function() {
            if (d[0].layerObject && d[0].layerObject.loaded) clearInterval(h), lb(a, f, b, c, d, e);
            else if (d[0].errors) {
                clearInterval(h);
                var k = "";
                d[0].errors && d[0].errors.length && (k = " (" + d[0].errors[0].message + ")");
                c.errback(Error(fa.arcgis.utils.baseLayerError +
                    k))
            }
        }, 10);
        else if (!e[0] && d[0].baseMapLayer) {
            var g = "";
            d[0].errors && d[0].errors.length && (g = " (" + d[0].errors[0].message + ")");
            c.errback(Error(fa.arcgis.utils.baseLayerError + g))
        } else lb(a, f, b, c, d, e)
    }

    function lb(a, f, b, c, d, e) {
        try {
            var h = b.mapOptions || {};
            b.mapOptions = h;
            var m = a.item;
            e = k.filter(e, g.isDefined);
            if (m)
                if (m.extent && m.extent.length)
                    if (h.extent) x(e, d, a, f, b, c);
                    else {
                        var l = new C(m.extent[0][0], m.extent[0][1], m.extent[1][0], m.extent[1][1], new z({
                                wkid: 4326
                            })),
                            r = e[0].spatialReference;
                        4326 === r.wkid ? (h.extent =
                            l, x(e, d, a, f, b, c)) : 102100 === r.wkid || 102113 === r.wkid || 3857 === r.wkid ? (l.xmin = Math.max(l.xmin, -180), l.xmax = Math.min(l.xmax, 180), l.ymin = Math.max(l.ymin, -89.99), l.ymax = Math.min(l.ymax, 89.99), h.extent = sb.geographicToWebMercator(l), x(e, d, a, f, b, c)) : b.geometryServiceURL || I.defaults.geometryService ? (b.geometryServiceURL ? new vb(b.geometryServiceURL) : I.defaults.geometryService).project([l], r, function(k) {
                            k = k[0];
                            h.extent = h.extent || k;
                            x(e, d, a, f, b, c)
                        }, function() {
                            x(e, d, a, f, b, c)
                        }) : c.errback(Error(fa.arcgis.utils.geometryServiceError))
                    } else x(e,
                d, a, f, b, c);
            else x(e, d, a, f, b, c)
        } catch (n) {
            c.errback(n)
        }
    }

    function mb(a) {
        var f = [];
        a = a.baseMap.baseMapLayers.concat(a.operationalLayers);
        k.forEach(a, function(a) {
            var c = {};
            if (a.featureCollection && "CSV" !== a.type) !0 === a.featureCollection.showLegend && k.forEach(a.featureCollection.layers, function(d) {
                !1 !== d.showLegend && (c = {
                        layer: d.layerObject,
                        title: a.title,
                        defaultSymbol: d.renderer && d.renderer.defaultSymbol && d.renderer.defaultLabel ? !0 : !1
                    }, 1 < a.featureCollection.layers.length && (c.title += " - " + d.layerDefinition.name),
                    f.push(c))
            });
            else if (a.baseMapLayer && !0 === a.showLegend && a.layerObject || !a.baseMapLayer && !1 !== a.showLegend && a.layerObject) {
                var d = a.layerObject.renderer,
                    e = a.layerObject.declaredClass,
                    d = !d || d && d.defaultSymbol && d.defaultLabel ? !0 : !1;
                if (10.1 > a.layerObject.version && ("esri.layers.ArcGISDynamicMapServiceLayer" === e || "esri.layers.ArcGISTiledMapServiceLayer" === e) || "esri.layers.ArcGISImageServiceLayer" === e) d = !0;
                c = {
                    layer: a.layerObject,
                    title: a.title,
                    defaultSymbol: d
                };
                a.layers && (e = k.map(k.filter(a.layers, function(a) {
                    return !1 ===
                        a.showLegend
                }), function(a) {
                    return a.id
                }), e.length && (c.hideLayers = e));
                f.push(c)
            }
        });
        return f
    }

    function Ab(a, f) {
        function b(a, b) {
            k.forEach(a, function(a, c) {
                switch (a) {
                    case Q:
                        Ia = b[c];
                        break;
                    case R:
                        Pa = b[c];
                        break;
                    case S:
                        Oa = b[c];
                        break;
                    case ta:
                        Xa = b[c];
                        break;
                    case T:
                        Ya = b[c];
                        break;
                    case ua:
                        Ja = b[c];
                        break;
                    case U:
                        Wa = b[c];
                        break;
                    case va:
                        Ha = b[c];
                        break;
                    case V:
                        La = b[c];
                        break;
                    case W:
                        Ta = b[c];
                        break;
                    case X:
                        $a = b[c];
                        break;
                    case wa:
                        Ka = b[c];
                        break;
                    case Y:
                        Na = b[c];
                        break;
                    case Z:
                        Qa = b[c];
                        break;
                    case $:
                        Ma = b[c];
                        break;
                    case aa:
                        ab = b[c];
                        break;
                    case xa:
                        Va = b[c];
                        break;
                    case ba:
                        t = b[c];
                        break;
                    case ca:
                        Ua = b[c];
                        break;
                    case da:
                        Sa = b[c];
                        break;
                    case ya:
                        Ra = b[c]
                }
            })
        }
        var c = new s,
            d = a.itemData,
            e = [];
        d.baseMap && d.baseMap.baseMapLayers && (e = e.concat(d.baseMap.baseMapLayers));
        d.operationalLayers && (e = e.concat(d.operationalLayers));
        for (var d = k.map(e, function(a) {
                return a && a.layerType
            }), h = [], g = [], e = !1, l = 0; l < d.length; l++) {
            switch (d[l]) {
                case "ArcGISFeatureLayer":
                    -1 === k.indexOf(h, X) && h.push(X);
                    break;
                case "ArcGISImageServiceLayer":
                    -1 === k.indexOf(h, R) && (h.push(R), g.push(V),
                        g.push(Y), g.push($));
                    break;
                case "ArcGISImageServiceVectorLayer":
                    -1 === k.indexOf(h, S) && (h.push(S), g.push(V), g.push(Y), g.push($));
                    break;
                case "ArcGISMapServiceLayer":
                    -1 === k.indexOf(h, Q) && (h.push(Q), g.push(ua), g.push(va), g.push(wa));
                    break;
                case "ArcGISStreamLayer":
                    -1 === k.indexOf(h, aa) && h.push(aa);
                    break;
                case "ArcGISTiledImageServiceLayer":
                case "ArcGISTiledMapServiceLayer":
                    break;
                case "BingMapsAerial":
                case "BingMapsHybrid":
                case "BingMapsRoad":
                    -1 === k.indexOf(h, ba) && h.push(ba);
                    break;
                case "CSV":
                    -1 === k.indexOf(h,
                        T) && (h.push(T), g.push(ta));
                    break;
                case "GeoRSS":
                    -1 === k.indexOf(h, U) && h.push(U);
                    break;
                case "KML":
                    -1 === k.indexOf(h, W) && h.push(W);
                    break;
                case "OpenStreetMap":
                    -1 === k.indexOf(h, Z) && h.push(Z);
                    break;
                case "WebTiledLayer":
                    -1 === k.indexOf(h, ca) && (h.push(ca), g.push(xa));
                    break;
                case "WMS":
                    -1 === k.indexOf(h, da) && (h.push(da), g.push(ya));
                    break;
                default:
                    e = !0
            }
            if (e) break
        }
        e && (h = Bb, g = Cb);
        h.length ? G(h, function() {
            b(h, arguments);
            g.length ? G(g, function() {
                b(g, arguments);
                c.resolve()
            }) : c.resolve()
        }) : c.resolve();
        return c
    }

    function nb(a,
        f, b, c) {
        Ab(c, f).then(function() {
            xb(c, f).then(function(c) {
                var e = c[0],
                    f = c[1];
                if (!e.itemData.operationalLayers || 0 === e.itemData.operationalLayers.length) J(e, f).addCallback(function(c) {
                    M(c.itemData, f).addCallback(l.hitch(null, P, c, a, f, b))
                });
                else {
                    var g = new s,
                        q = e.itemData.baseMap.baseMapLayers.slice(),
                        p = k.filter(e.itemData.baseMap.baseMapLayers, function(a) {
                            return !a.isReference
                        });
                    c = {
                        item: e.item,
                        itemData: {
                            baseMap: {
                                baseMapLayers: p
                            }
                        }
                    };
                    e.itemData.baseMap.baseMapLayers = k.filter(e.itemData.baseMap.baseMapLayers,
                        function(a) {
                            return a.isReference
                        });
                    J(c, f).addCallback(function(b) {
                        M(b.itemData, f).addCallback(l.hitch(null, P, b, a, f, g))
                    });
                    g.then(function(a) {
                        J(e, f).addCallback(function(c) {
                            M(c.itemData, f, a.map.spatialReference, p).addCallback(function(d) {
                                c.itemData.baseMap.baseMapLayers = q;
                                P(c, a, f, b, d)
                            })
                        })
                    }, l.hitch(b, b.errback))
                }
            })
        })
    }

    function ob(a) {
        p._arcgisUrl && 0 < p._arcgisUrl.length && (p.arcgisUrl = p._arcgisUrl);
        var f = p.arcgisUrl + "/" + a,
            b = {},
            c = new s;
        y({
            url: f,
            content: {
                f: "json"
            },
            callbackParamName: "callback",
            load: function(a) {
                b.item =
                    a;
                y({
                    url: f + "/data",
                    content: {
                        f: "json"
                    },
                    callbackParamName: "callback",
                    load: function(a) {
                        b.itemData = a;
                        c.callback(b)
                    },
                    error: function(a) {
                        c.errback(a)
                    }
                })
            },
            error: function(a) {
                c.errback(a)
            }
        });
        return c
    }
    var p, Ia, Pa, Oa, Xa, Ya, Ja, Wa, Ha, La, Ta, $a, Ka, Na, Qa, Ma, ab, Va, t, Ua, Sa, Ra, Q = "../layers/ArcGISDynamicMapServiceLayer",
        R = "../layers/ArcGISImageServiceLayer",
        S = "../layers/ArcGISImageServiceVectorLayer",
        ta = "./csv",
        T = "../layers/CSVLayer",
        ua = "../layers/DynamicLayerInfo",
        U = "../layers/GeoRSSLayer",
        va = "../layers/ImageParameters",
        V = "../layers/ImageServiceParameters",
        W = "../layers/KMLLayer",
        X = "../layers/LabelClass",
        wa = "../layers/LayerDrawingOptions",
        Y = "../layers/MosaicRule",
        Z = "../layers/OpenStreetMapLayer",
        $ = "../layers/RasterFunction",
        aa = "../layers/StreamLayer",
        xa = "../layers/TileInfo",
        ba = "../virtualearth/VETiledLayer",
        ca = "../layers/WebTiledLayer",
        da = "../layers/WMSLayer",
        ya = "../layers/WMSLayerInfo",
        Bb = [Q, R, S, T, U, W, X, Z, aa, ba, ca, da],
        Cb = [ta, ua, va, V, wa, Y, $, xa, ya];
    p = {
        arcgisUrl: location.protocol + "//www.arcgis.com/sharing/rest/content/items",
        getItem: ob,
        createMap: function(a, f, b) {
            var c = new s;
            b = b || {};
            var d = b.infoTemplateClass;
            b._clazz = d && (l.isObject(d) ? d : l.getObject(d)) || Ca;
            l.isString(a) ? ob(a).addCallback(l.hitch(null, nb, f, b, c)).addErrback(l.hitch(c, c.errback)) : nb(f, b, c, a);
            return c
        },
        getLegendLayers: function(a) {
            return a && a.itemInfo && a.itemInfo.itemData ? mb(a.itemInfo.itemData) : []
        },
        _arcgisUrl: null,
        _getItemProps: J,
        _getItemData: E,
        _getBingKey: ga,
        _portalUrlResponse: ia,
        _portalUrlFailure: K,
        _processFSItemProperties: ha,
        _processSSItemProperties: Da,
        _getLayers: M,
        _preBuildLayerObjects: bb,
        _buildLayerObjects: qa,
        _preCreateMap: P,
        _getMapSR: ra,
        _createMap: x,
        _addSelectionLayers: ib,
        _createSelectionFeatureLayers: O,
        _getServiceInfo: cb,
        _getFeatureCollectionItem: db,
        _mergeFeatureCollectionItem: eb,
        _projectFeatureCollection: fb,
        _getLayersInfo: hb,
        _initLayer: pa,
        _loadAsCached: la,
        _loadAsDynamic: Ga,
        _processPopups: ja,
        _onLayersAddResult: jb,
        _sameSpatialReferenceAsBasemap: na,
        _sameTilingSchemeAsBasemap: oa,
        _showPopup: sa,
        _calculateClickTolerance: kb,
        _getVisibleFeatureLayers: ma,
        _updateLayerScaleInfo: N,
        _checkUrl: A,
        _isHostedService: ka,
        _isAgolService: Fa,
        _getLegendLayers: mb
    };
    l.setObject("arcgis.utils", p, F);
    return p
});