//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/event", "dojo/_base/json", "dojo/dom-attr", "dojo/has", "dojo/i18n", "dojo/io-query", "dojo/i18n!../../nls/jsapi", "dojo/json", "dojo/string", "dojo/query", "dojo/dom-style", "dojo/data/ItemFileWriteStore", "dijit/registry", "../../kernel", "../../lang", "./HelpWindow", "../../tasks/query"], function(h, d, m, p, q, A, r, B, C, s, t, D, n, u, v, w, x, E, k, y, z) {
    h = {};
    d.mixin(h, {
        _helpDialog: null,
        initHelpLinks: function(a, b, c) {
            this._helpDialog || (this._helpDialog = new y);
            if (a) {
                var f = x.byNode(a),
                    h = f ? f.get("helpFileName") : c && c.helpFileName ? c.helpFileName : null;
                u("[esriHelpTopic]", a).forEach(function(f, g, l) {
                    f && (v.set(f, "display", !k.isDefined(b) || !0 === b ? "" : "none"), p.connect(f, "onclick", d.hitch(this, function(b) {
                        q.stop(b);
                        this._helpDialog.show(b, {
                            helpId: r.get(f, "esriHelpTopic"),
                            helpFileName: h,
                            analysisGpServer: c && c.analysisGpServer ? c.analysisGpServer : null,
                            helpParentNode: a
                        })
                    })))
                }, this)
            }
        },
        constructAnalysisFeatColl: function(a) {
            var b = {},
                c;
            b.featureCollection = a.layerDefinition;
            for (c in b.featureCollection) b.featureCollection.hasOwnProperty(c) && "objectIdField" === c && (b.featureCollection.objectIdFieldName = d.clone(b.featureCollection.objectIdField), delete b.featureCollection.objectIdField);
            b.featureCollection.features = a.featureSet.features;
            return b
        },
        constructAnalysisInputLyrObj: function(a) {
            var b = {};
            if (a.url && !a._collection) b = {
                    url: a.url
                }, a.getDefinitionExpression && a.getDefinitionExpression() ? b.filter = a.getDefinitionExpression() : k.isDefined(a.definitionExpression) && "" !== a.definitionExpression &&
                (b.filter = a.definitionExpression), a.credential && (b.serviceToken = a.credential.token), -1 !== b.url.indexOf("?") && (a = b.url.substring(b.url.indexOf("?") + 1, b.url.length), a = s.queryToObject(a), d.mixin(b, a), b.url = b.url.substring(0, b.url.indexOf("?")));
            else if (!a.url || a._collection) b = a.toJson();
            return b
        },
        buildReport: function(a, b) {
            var c = "";
            b || (b = {}, d.mixin(b, t.analysisMsgCodes));
            m.forEach(a, function(a, h) {
                var e, g, l;
                "string" === typeof a.message ? (e = k.isDefined(b[a.messageCode]) ? b[a.messageCode] : a.message, c += a.style.substring(0,
                    a.style.indexOf("\x3c/")) + (!this._isEmptyObject(a.params) ? n.substitute(e, a.params) : e) + a.style.substring(a.style.indexOf("\x3c/"))) : d.isArray(a.message) && (l = [], g = d.clone(a.style), m.forEach(a.message, function(c, d) {
                    g = g.replace(/<\//, "${" + d + "}");
                    e = k.isDefined(b[a.messageCode + "_" + d]) ? b[a.messageCode + "_" + d] : c;
                    e = !this._isEmptyObject(a.params) ? n.substitute(e, a.params) : e;
                    l.push(e + "\x3c/")
                }, this), g = n.substitute(g, l), c += g)
            }, this);
            return c
        },
        getLayerFeatureCount: function(a, b) {
            var c = new z;
            c.geometry = b.geometry ||
                "";
            c.where = b.where || "1\x3d1";
            c.geometryType = b.geometryType || "esriGeometryEnvelope";
            return a.queryCount(c)
        },
        createPolygonFeatureCollection: function(a) {
            var b;
            b = {
                layerDefinition: null,
                featureSet: {
                    features: [],
                    geometryType: "esriGeometryPolygon"
                }
            };
            b.layerDefinition = {
                currentVersion: 10.2,
                copyrightText: "",
                defaultVisibility: !0,
                relationships: [],
                isDataVersioned: !1,
                supportsRollbackOnFailureParameter: !0,
                supportsStatistics: !0,
                supportsAdvancedQueries: !0,
                geometryType: "esriGeometryPolygon",
                minScale: 0,
                maxScale: 0,
                objectIdField: "OBJECTID",
                templates: [],
                type: "Feature Layer",
                displayField: "TITLE",
                visibilityField: "VISIBLE",
                name: a,
                hasAttachments: !1,
                typeIdField: "TYPEID",
                capabilities: "Query",
                allowGeometryUpdates: !0,
                htmlPopupType: "",
                hasM: !1,
                hasZ: !1,
                globalIdField: "",
                supportedQueryFormats: "JSON",
                hasStaticData: !1,
                maxRecordCount: -1,
                indexes: [],
                types: [],
                drawingInfo: {
                    renderer: {
                        type: "simple",
                        symbol: {
                            color: [0, 0, 0, 255],
                            outline: {
                                color: [0, 0, 0, 255],
                                width: 3,
                                type: "esriSLS",
                                style: "esriSLSSolid"
                            },
                            type: "esriSFS",
                            style: "esriSFSNull"
                        },
                        label: "",
                        description: ""
                    },
                    transparency: 0,
                    labelingInfo: null,
                    fixedSymbols: !0
                },
                fields: [{
                    alias: "OBJECTID",
                    name: "OBJECTID",
                    type: "esriFieldTypeOID",
                    editable: !1
                }, {
                    alias: "Title",
                    name: "TITLE",
                    length: 50,
                    type: "esriFieldTypeString",
                    editable: !0
                }, {
                    alias: "Visible",
                    name: "VISIBLE",
                    type: "esriFieldTypeInteger",
                    editable: !0
                }, {
                    alias: "Description",
                    name: "DESCRIPTION",
                    length: 1073741822,
                    type: "esriFieldTypeString",
                    editable: !0
                }, {
                    alias: "Type ID",
                    name: "TYPEID",
                    type: "esriFieldTypeInteger",
                    editable: !0
                }]
            };
            return b
        },
        createPointFeatureCollection: function(a) {
            var b;
            b = {
                layerDefinition: null,
                featureSet: {
                    features: [],
                    geometryType: "esriGeometryPoint"
                }
            };
            b.layerDefinition = {
                objectIdField: "OBJECTID",
                templates: [],
                type: "Feature Layer",
                drawingInfo: {
                    renderer: {
                        field1: "TYPEID",
                        type: "simple",
                        symbol: {
                            height: 24,
                            xoffset: 0,
                            yoffset: 12,
                            width: 24,
                            contentType: "image/png",
                            type: "esriPMS",
                            url: "http://static.arcgis.com/images/Symbols/Basic/GreenStickpin.png"
                        },
                        description: "",
                        value: "0",
                        label: "Stickpin"
                    }
                },
                displayField: "TITLE",
                visibilityField: "VISIBLE",
                name: a,
                hasAttachments: !1,
                typeIdField: "TYPEID",
                capabilities: "Query",
                types: [],
                geometryType: "esriGeometryPoint",
                fields: [{
                    alias: "OBJECTID",
                    name: "OBJECTID",
                    type: "esriFieldTypeOID",
                    editable: !1
                }, {
                    alias: "Title",
                    name: "TITLE",
                    length: 50,
                    type: "esriFieldTypeString",
                    editable: !0
                }, {
                    alias: "Visible",
                    name: "VISIBLE",
                    type: "esriFieldTypeInteger",
                    editable: !0
                }, {
                    alias: "Description",
                    name: "DESCRIPTION",
                    length: 1073741822,
                    type: "esriFieldTypeString",
                    editable: !0
                }, {
                    alias: "Type ID",
                    name: "TYPEID",
                    type: "esriFieldTypeInteger",
                    editable: !0
                }]
            };
            return b
        },
        createFolderStore: function(a,
            b) {
            var c = new w({
                data: {
                    identifier: "id",
                    label: "name",
                    items: []
                }
            });
            c.newItem({
                name: b,
                id: ""
            });
            m.forEach(a, function(a) {
                c.newItem({
                    name: a.title,
                    id: a.id
                })
            });
            return c
        },
        setupFoldersUI: function(a) {
            a.folderSelect.set("store", a.folderStore);
            k.isDefined(a.folderId) ? a.folderStore.get(a.folderId).then(d.hitch(this, function(b) {
                a.folderSelect.set("value", b.name)
            })) : a.folderName ? a.folderStore.fetch({
                query: {
                    name: a.folderName
                },
                onComplete: d.hitch(this, function(b) {
                    a.folderSelect.set("value", b[0].name)
                })
            }) : a.username ? a.folderSelect.set("value",
                a.username) : a.folderStore.get("").then(function(b) {
                a.folderSelect.set("value", b.name)
            }, this)
        },
        _isEmptyObject: function(a) {
            for (var b in a)
                if (a.hasOwnProperty(b)) return !1;
            return !0
        }
    });
    return h
});