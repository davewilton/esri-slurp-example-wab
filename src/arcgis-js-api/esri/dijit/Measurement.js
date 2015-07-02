//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/_base/Color", "dojo/sniff", "dojo/number", "dojo/dom-style", "dojo/dom-construct", "dojox/gfx", "dijit/_Widget", "dijit/registry", "dijit/Menu", "dijit/MenuItem", "../symbols/PictureMarkerSymbol", "../symbols/SimpleLineSymbol", "../symbols/SimpleFillSymbol", "../symbols/jsonUtils", "../geometry/geodesicUtils", "../geometry/webMercatorUtils", "../geometry/Point", "../geometry/Polyline", "../geometry/Polygon", "../graphic", "../tasks/AreasAndLengthsParameters", "../tasks/LengthsParameters", "../tasks/GeometryService", "../kernel", "../config", "../domUtils", "../lang", "../units", "../WKIDUnitConversion", "../SpatialReference", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "./_EventedWidget", "dojo/text!./templates/Measurement.html", "dojo/i18n!../nls/jsapi", "dijit/form/ToggleButton", "dijit/form/DropDownButton", "dijit/layout/ContentPane"], function(C, G, f, l, d, x, y, z, n, u, H, I, e, A, B, J, s, K, L, v, p, D, h, w, g, M, E, N, V, O, q, P, r, Q, F, R, S, T, U, m) {
    return G([T, I, R, S], {
        declaredClass: "esri.dijit.Measurement",
        widgetsInTemplate: !0,
        templateString: U,
        _map: null,
        _geometryService: null,
        _interpolatedMap: null,
        _mouseImgURL: null,
        _defaultPinURL: null,
        _measureGraphics: [],
        _measureGraphic: null,
        _locationGraphic: null,
        _tempGraphic: null,
        _polylineGraphics: null,
        _polygonGraphic: null,
        _pointSymbol: null,
        _useDefaultPointSymbol: !0,
        _defaultLineSymbol: null,
        _lineSymbol: null,
        _areaLineSymbol: null,
        _defaultFillSymbol: null,
        _fillSymbol: null,
        _borderlessFillSymbol: null,
        _inputPoints: [],
        _unitDictionary: [],
        numberPattern: "#,###,###,##0.0",
        result: null,
        _defaultDistanceUnit: null,
        _defaultAreaUnit: null,
        _defaultLocationUnit: null,
        currentDistanceUnit: null,
        currentAreaUnit: null,
        currentLocationUnit: null,
        _unitStrings: {},
        _locationUnitStrings: [],
        _locationUnitStringsLong: [],
        _distanceUnitStrings: [],
        _distanceUnitStringsLong: [],
        _areaUnitStrings: [],
        _areaUnitStringsLong: [],
        _calculatingMsg: null,
        _gsErrorMsg: null,
        _NLS_Lat: null,
        _NLS_Lon: null,
        _mouseMoveMapHandler: null,
        _mouseClickMapHandler: null,
        _doubleClickMapHandler: null,
        _mouseDragMapHandler: null,
        _clickMapHandler: null,
        _mapExtentChangeHandler: null,
        _geometryAreaHandler: null,
        _snappingCallback: null,
        _calcTimer: null,
        _buttonDijits: {},
        previousTool: null,
        activeTool: null,
        markerLongitude: null,
        markerLatitude: null,
        mouseLongitude: null,
        mouseLatitude: null,
        _eventMap: {
            "measure-start": ["toolName", "unitName"],
            measure: ["toolName", "geometry", "values", "unitName"],
            "measure-end": ["toolName", "geometry",
                "values", "unitName"
            ],
            "tool-change": ["toolName", "unitName", "previousToolName"],
            "unit-change": ["unitName", "toolName"]
        },
        constructor: function(a, b) {
            a = a || {};
            if (a.map) {
                this._map = a.map;
                if (this._map.loaded) this._map.cs = this._checkCS(this._map.spatialReference), this._interpolatedMap = !("Web Mercator" === this._map.cs || "PCS" === this._map.cs);
                else var c = d.connect(this._map, "onLoad", this, function() {
                    d.disconnect(c);
                    c = null;
                    this._map.cs = this._checkCS(this._map.spatialReference);
                    this._interpolatedMap = !("Web Mercator" ===
                        this._map.cs || "PCS" === this._map.cs)
                });
                this._geometryService = O.defaults.geometryService;
                this._mouseImgURL = C.toUrl("./images/cursor16x24.png");
                this._defaultPinURL = C.toUrl("./images/esriGreenPin16x26.png");
                this._defaultLineSymbol = new s(s.STYLE_SOLID, new x([0, 128, 255]), 3);
                this._defaultFillSymbol = new K(s.STYLE_SOLID, new s(s.STYLE_SOLID, new x([0, 128, 255]), 3), new x([0, 0, 0, 0.5]));
                a.pointSymbol ? (this._pointSymbol = a.pointSymbol, this._useDefaultPointSymbol = !1) : (this._pointSymbol = new J(this._defaultPinURL, 16,
                    26), this._pointSymbol.setOffset(0, 12));
                var k = a.fillSymbol || this._defaultFillSymbol;
                this._fillSymbol = k;
                this._areaLineSymbol = k.outline || this._defaultLineSymbol;
                this._borderlessFillSymbol = L.fromJson(k.toJson());
                this._borderlessFillSymbol.setOutline(null);
                this._lineSymbol = a.lineSymbol ? a.lineSymbol : this._defaultLineSymbol;
                this._defaultDistanceUnit = a.defaultLengthUnit ? a.defaultLengthUnit : r.MILES;
                this._defaultAreaUnit = a.defaultAreaUnit ? a.defaultAreaUnit : r.ACRES;
                this._defaultLocationUnit = a.defaultLocationUnit ?
                    a.defaultLocationUnit : r.DECIMAL_DEGREES;
                this._snappingCallback = f.hitch(this, this._snappingCallback);
                a.geometry && (this._userGeometry = a.geometry);
                this._calcTimer = null;
                this.advancedLocationUnits = a.advancedLocationUnits || !1;
                this._NLS_Lon = m.widgets.measurement.NLS_longitude;
                this._NLS_Lat = m.widgets.measurement.NLS_latitude;
                this._gsErrorMsg = m.widgets.measurement.NLS_geometry_service_error;
                this._calculatingMsg = m.widgets.measurement.NLS_calculating
            } else console.log("dijit.MeasureTool: unable to find the 'map' property in parameters")
        },
        startup: function() {
            this._setupDictionaries();
            u.create("img", {
                src: this._mouseImgURL,
                style: "vertical-align:middle"
            }, this.mouseCell);
            this._useDefaultPointSymbol ? (u.create("img", {
                src: this._defaultPinURL,
                style: "vertical-align:middle"
            }, this.pinCell), u.create("img", {
                src: this._defaultPinURL,
                style: "vertical-align:middle"
            }, this.greenPinDiv)) : (this._drawPointGraphics(this.pinCell), this._drawPointGraphics(this.greenPinDiv));
            n.set(this.greenPinDiv, "visibility", "hidden");
            if (this._userGeometry)
                if (this._map.loaded) this._measureCustomGeometry();
                else var a = d.connect(this._map, "onLoad", this, function() {
                    d.disconnect(a);
                    a = null;
                    this._measureCustomGeometry()
                })
        },
        _setupAreaTool: function() {
            this._map.navigationManager.setImmediateClick(!0);
            this._inputPoints = [];
            this._createAreaUnitList();
            this._tempGraphic = new g;
            this._tempGraphic.setSymbol(this._areaLineSymbol);
            this._tempGraphic.setGeometry(new h(this._map.spatialReference));
            this._map.graphics.add(this._tempGraphic);
            "PCS" === this._map.cs && (this._geometryAreaHandler = d.connect(this._geometryService, "onAreasAndLengthsComplete",
                this, "_outputArea"));
            this._mouseClickMapHandler = d.connect(this._map, "onClick", this, "_measureAreaMouseClickHandler");
            this._doubleClickMapHandler = d.connect(this._map, "onDblClick", this, "_measureAreaDblClickHandler")
        },
        _setupDistanceTool: function() {
            this._map.navigationManager.setImmediateClick(!0);
            "PCS" === this._map.cs && (this._projectMapExtent(this._map.extent), this._mapExtentChangeHandler = d.connect(this._map, "onExtentChange", this, "_projectMapExtent"));
            this._inputPoints = [];
            this._createDistanceUnitList();
            this._mouseClickMapHandler = d.connect(this._map, "onClick", this, "_measureDistanceMouseClickHandler");
            this._doubleClickMapHandler = d.connect(this._map, "onDblClick", this, "_measureDistanceDblClickHandler")
        },
        _setupLocationTool: function() {
            this._map.navigationManager.setImmediateClick(!0);
            this._measureGraphics = [];
            this._map.graphics.remove(this._locationGraphic);
            this._createLocationUnitList();
            "PCS" === this._map.cs && (this._projectMapExtent(this._map.extent), this._mapExtentChangeHandler = d.connect(this._map, "onExtentChange",
                f.hitch(this, this._projectMapExtent)));
            this._clickMapHandler = d.connect(this._map, "onClick", this, "_locationClickHandler");
            this._mouseMoveMapHandler = d.connect(this._map, "onMouseMove", this, "_locationMoveHandler");
            this._mouseDragMapHandler = d.connect(this._map, "onMouseDrag", f.hitch(this, function() {
                e.byNode(this.resultValue.domNode).set("disabled", !0)
            }))
        },
        setTool: function(a, b) {
            this.previousTool = this.activeTool || null;
            this._polylineGraphics = [];
            this._resetToolState();
            this._polygonGraphic && (this._map.graphics.remove(this._polygonGraphic),
                this._polygonGraphic = null);
            var c = e.byNode(this._buttonDijits[a].domNode).checked;
            n.set(this._unitDropDown.domNode, "visibility", "visible");
            n.set(this.greenPinDiv, "visibility", "hidden");
            e.byNode(this._buttonDijits.area.domNode).set("checked", !1);
            e.byNode(this._buttonDijits.distance.domNode).set("checked", !1);
            e.byNode(this._buttonDijits.location.domNode).set("checked", !1);
            if (!0 === b || !1 === b) c = b;
            e.byNode(this._buttonDijits[a].domNode).set("checked", c);
            this._toggleStaticLocationTable(!1, !0);
            c ? (this.activeTool =
                a, (this._dblClickZoom = this._map.isDoubleClickZoom) && this._map.disableDoubleClickZoom(), "area" === a ? this._setupAreaTool() : "distance" === a ? this._setupDistanceTool() : "location" === a && (this._setupLocationTool(), n.set(this.greenPinDiv, "visibility", "visible")), this._map.snappingManager && (this._map.snappingManager._startSelectionLayerQuery(), this._map.snappingManager._setUpSnapping())) : (this.activeTool = null, n.set(this._unitDropDown.domNode, "visibility", "hidden"));
            if (this.activeTool !== this.previousTool) this.onToolChange(this.activeTool,
                this.getUnit(), this.previousTool)
        },
        _areaButtonToggle: function() {
            this.clearResult();
            this.setTool("area")
        },
        _distanceButtonToggle: function() {
            this.clearResult();
            this.setTool("distance")
        },
        _locationButtonToggle: function() {
            this.clearResult();
            this.setTool("location")
        },
        _resetToolState: function() {
            var a = this._map;
            a.navigationManager.setImmediateClick(!1);
            this._dblClickZoom && a.enableDoubleClickZoom();
            this._inputPoints = [];
            d.disconnect(this._mouseClickMapHandler);
            d.disconnect(this._mouseMoveMapHandler);
            d.disconnect(this._doubleClickMapHandler);
            d.disconnect(this._mouseDragMapHandler);
            d.disconnect(this._clickMapHandler);
            d.disconnect(this._mapExtentChangeHandler);
            d.disconnect(this._geometryAreaHandler);
            this._mouseClickMapHandler = this._mouseMoveMapHandler = this._doubleClickMapHandler = this._mouseDragMapHandler = this._clickMapHandler = this._mapExtentChangeHandler = this._geometryAreaHandler = null;
            a.snappingManager && a.snappingManager._snappingGraphic && a.graphics.remove(a.snappingManager._snappingGraphic);
            this._map.snappingManager && (this._map.snappingManager._stopSelectionLayerQuery(),
                this._map.snappingManager._killOffSnapping());
            this._unitDropDown._opened && this._unitDropDown.closeDropDown()
        },
        clearResult: function() {
            var a = this._map;
            this.result = 0;
            e.byNode(this.resultValue.domNode).set("content", "\x26nbsp");
            var b;
            for (b = 0; b < this._measureGraphics.length; b++) a.graphics.remove(this._measureGraphics[b]);
            this._measureGraphic = null;
            this._measureGraphics = [];
            a.graphics.remove(this._tempGraphic);
            d.disconnect(this._mouseMoveMapHandler);
            this._mouseMoveMapHandler = null
        },
        show: function() {
            q.show(this.domNode)
        },
        hide: function() {
            q.hide(this.domNode)
        },
        showTool: function(a) {
            this._buttonDijits[a].domNode.style.display = "inline"
        },
        hideTool: function(a) {
            this._buttonDijits[a].domNode.style.display = "none"
        },
        getTool: function() {
            if (this.activeTool) return {
                toolName: this.activeTool,
                unitName: this.getUnit()
            }
        },
        getUnit: function() {
            if ("unit" !== this._unitDropDown.label) return this._unitDropDown.label
        },
        destroy: function() {
            this._resetToolState();
            this.clearResult();
            this.inherited(arguments);
            this._map = this._geometryService = this._measureGraphics =
                this._measureGraphic = this._tempGraphic = null
        },
        onToolChange: function() {},
        onUnitChange: function() {},
        onMeasureStart: function() {},
        onMeasure: function() {},
        onMeasureEnd: function() {},
        measure: function(a) {
            a && (this._userGeometry = a, this._measureCustomGeometry())
        },
        _measureCustomGeometry: function() {
            this.clearResult();
            switch (this._userGeometry.type) {
                case "point":
                    this._measureCustomPoint();
                    break;
                case "polyline":
                    this._measureCustomDistance();
                    break;
                case "polygon":
                    this._measureCustomArea()
            }
        },
        _measureCustomPoint: function() {
            this.setTool("location", !0);
            "Web Mercator" === this._map.cs && this._userGeometry.spatialReference !== this._map.spatialReference && (this._userGeometry = p.geographicToWebMercator(this._userGeometry));
            this._measureGraphic = new g;
            this._measureGraphic.setSymbol(this._pointSymbol);
            this._measureGraphic.setGeometry(this._userGeometry);
            this._measureGraphics.push(this._measureGraphic);
            this._map.graphics.add(this._measureGraphic);
            this._measurePoint(this._userGeometry)
        },
        _measureCustomDistance: function() {
            1 < this._userGeometry.paths[0].length &&
                (this.setTool("distance", !0), this._inputPoints = [], l.forEach(this._userGeometry.paths[0], f.hitch(this, function(a, b) {
                        this._inputPoints.push(a);
                        var c = new g(new D(a[0], a[1], this._userGeometry.spatialReference), this._pointSymbol);
                        this._measureGraphics.push(c);
                        this._map.graphics.add(c);
                        0 !== b && (this.result += this._geodesicDistance(a, this._userGeometry.paths[0][b - 1]))
                    })), this._measureGraphic = new g, this._measureGraphic.setSymbol(this._lineSymbol), this._measureGraphics.push(this._measureGraphic), this._userGeometry =
                    this._densifyGeometry(this._userGeometry), this._measureGraphic.setGeometry(this._userGeometry), this._map.graphics.add(this._measureGraphic), this._showDistance(this.result), this._inputPoints = [], this.onMeasureEnd(this.activeTool, this._userGeometry, this.result, this.getUnit()))
        },
        _measureCustomArea: function() {
            this.setTool("area", !0);
            this._inputPoints = [];
            var a = this._densifyGeometry(this._userGeometry);
            this._measureGraphic = new g;
            this._measureGraphic.setGeometry(a);
            this._measureGraphic.setSymbol(this._fillSymbol);
            this._measureGraphics.push(this._measureGraphic);
            this._map.graphics.add(this._measureGraphic);
            this._getArea(a);
            this._inputPoints = []
        },
        _densifyGeometry: function(a) {
            "Web Mercator" === this._map.cs && (a = p.webMercatorToGeographic(a));
            a = "PCS" === this._map.cs ? a : v.geodesicDensify(a, 5E5);
            "Web Mercator" === this._map.cs && (a = p.geographicToWebMercator(a));
            return a
        },
        _measureAreaMouseClickHandler: function(a) {
            var b;
            this._map.snappingManager && (b = this._map.snappingManager._snappingPoint);
            b = b || a.mapPoint;
            this._inputPoints.push(b);
            this._currentStartPt = b;
            if (1 === this._inputPoints.length) {
                this._tempGraphic.setGeometry(new h(this._map.spatialReference));
                for (a = 0; a < this._measureGraphics.length; a++) this._map.graphics.remove(this._measureGraphics[a]);
                this._measureGraphics = [];
                this.result = 0;
                this._outputResult(this.result, m.widgets.measurement.NLS_area_acres);
                this._mouseMoveMapHandler = d.connect(this._map, "onMouseMove", this, "_measureAreaMouseMoveHandler");
                this.onMeasureStart(this.activeTool, this.getUnit())
            }
            this._measureGraphic = new g;
            this._measureGraphic.setSymbol(this._areaLineSymbol);
            this._measureGraphics.push(this._measureGraphic);
            if (1 < this._inputPoints.length) {
                var c = new h(this._map.spatialReference);
                c.addPath([this._inputPoints[this._inputPoints.length - 2], b]);
                a = new h(this._map.spatialReference);
                a.addPath([this._inputPoints[0], b]);
                b = this._densifyGeometry(c);
                a = this._densifyGeometry(a);
                this._tempGraphic.setGeometry(a);
                this._measureGraphic.setGeometry(b);
                this._polylineGraphics.push(this._measureGraphic);
                this._map.graphics.add(this._measureGraphic);
                if (2 < this._inputPoints.length) {
                    b =
                        new w(this._map.spatialReference);
                    c = [];
                    for (a = 0; a < this._inputPoints.length; a++) c.push([this._inputPoints[a].x, this._inputPoints[a].y]);
                    c.push([this._inputPoints[0].x, this._inputPoints[0].y]);
                    b.addRing(c);
                    this._polygonGraphic ? (this._map.graphics.remove(this._polygonGraphic), this._polylineGraphics.push(this._tempGraphic), this._polygonGraphic = this._generatePolygonFromPaths(), this._map.graphics.add(this._polygonGraphic), this._measureGraphic = this._polygonGraphic, this._polylineGraphics.pop()) : (this._polygonGraphic =
                        this._generatePolygonFromPaths(), this._map.graphics.add(this._polygonGraphic));
                    this._getArea(b)
                }
            } else this._polygonGraphic && (this._map.graphics.remove(this._polygonGraphic), this._polygonGraphic = null)
        },
        _measureAreaMouseMoveHandler: function(a) {
            var b;
            if (0 < this._inputPoints.length) {
                var c = new h(this._map.spatialReference),
                    k;
                this._map.snappingManager && (k = this._map.snappingManager._snappingPoint);
                b = k || a.mapPoint;
                c.addPath([this._currentStartPt, b]);
                a = this._densifyGeometry(c);
                this._tempGraphic.setGeometry(a)
            }
            1 <
                this._inputPoints.length && (a = new h(this._map.spatialReference), a.addPath([b, this._inputPoints[0]]), b = this._densifyGeometry(a), this._tempGraphic.setGeometry(this._tempGraphic.geometry.addPath(b.paths[0])))
        },
        _measureAreaDblClickHandler: function(a) {
            d.disconnect(this._mouseMoveMapHandler);
            this._mouseMoveMapHandler = null;
            "touch" === this._map.navigationManager.eventModel && y("ios") && this._measureAreaMouseClickHandler(a);
            a = new w(this._map.spatialReference);
            var b = [],
                c;
            for (c = 0; c < this._inputPoints.length; c++) b.push([this._inputPoints[c].x,
                this._inputPoints[c].y
            ]);
            b.push([this._inputPoints[0].x, this._inputPoints[0].y]);
            a.addRing(b);
            this._inputPoints = [];
            this.measureGeometry = this._densifyGeometry(a);
            this._polygonGraphic && (this._map.graphics.remove(this._polygonGraphic), this._polylineGraphics.push(this._tempGraphic), this._polygonGraphic = this._generatePolygonFromPaths(), this._map.graphics.add(this._polygonGraphic));
            this._getArea(a);
            this._polylineGraphics = []
        },
        _generatePolygonFromPaths: function() {
            var a = [];
            l.forEach(this._polylineGraphics,
                f.hitch(this, function(b) {
                    l.forEach(b.geometry.paths, f.hitch(this, function(b) {
                        l.forEach(b, f.hitch(this, function(b) {
                            a.push(b)
                        }))
                    }))
                }));
            a.push(a[0]);
            var b = new w(this._map.spatialReference);
            b.addRing(a);
            var b = this._densifyGeometry(b),
                c = new g;
            c.setGeometry(b);
            c.setSymbol(this._borderlessFillSymbol);
            this._measureGraphic = c;
            this._measureGraphics.push(c);
            return c
        },
        _getArea: function(a) {
            var b = [],
                c = new M;
            c.areaUnit = N.UNIT_ACRES;
            c.calculationType = "geodesic";
            w.prototype.isSelfIntersecting(a) ? this._geometryService.simplify([a],
                f.hitch(this, function(a) {
                    l.forEach(a, f.hitch(this, function(d) {
                        "PCS" === this._map.cs ? (c.polygons = a, this._geometryService.areasAndLengths(c)) : ("Web Mercator" === this._map.cs && (d = p.webMercatorToGeographic(d)), b.push(d))
                    }));
                    var d = v.geodesicAreas(b, r.ACRES);
                    this._showArea(d[0])
                })) : ("Web Mercator" === this._map.cs && (a = p.webMercatorToGeographic(a)), b.push(a), "PCS" === this._map.cs ? (c.polygons = b, this._geometryService.areasAndLengths(c)) : (a = v.geodesicAreas(b, r.ACRES), this._showArea(Math.abs(a[0]))))
        },
        _outputArea: function(a) {
            this._showArea(Math.abs(a.areas[0]))
        },
        _showArea: function(a) {
            if (a)
                if (this.result = a, a = e.byNode(this._unitDropDown.domNode).label, a = this._outputResult(this.result, a), this._mouseMoveMapHandler) this.onMeasure(this.activeTool, this._measureGraphic.geometry, a, this.getUnit());
                else this.onMeasureEnd(this.activeTool, this._measureGraphic.geometry, a, this.getUnit())
        },
        _measureDistanceDblClickHandler: function(a) {
            d.disconnect(this._mouseMoveMapHandler);
            this._mouseMoveMapHandler = null;
            "touch" === this._map.navigationManager.eventModel && y("ios") && this._measureDistanceMouseClickHandler(a);
            var b = new h(this._map.spatialReference);
            b.addPath(this._inputPoints);
            b = this._densifyGeometry(b);
            this._measureGraphic.geometry = b;
            "PCS" === this._map.cs ? (a = new E, a.polylines = [b], a.lengthUnit = 9093, a.calculationType = "geodesic", this._geometryService.lengths(a, f.hitch(this, function(a) {
                this.result = a.lengths[0];
                this._showDistance(this.result);
                this._inputPoints = [];
                this.onMeasureEnd(this.activeTool, b, this._outputResult(this.result, this.getUnit()), this.getUnit())
            }))) : (this._inputPoints = [], this.onMeasureEnd(this.activeTool,
                b, this._outputResult(this.result, this.getUnit()), this.getUnit()))
        },
        _measureDistanceMouseClickHandler: function(a) {
            var b;
            this._map.snappingManager && (b = this._map.snappingManager._snappingPoint);
            var c = b || a.mapPoint;
            this._inputPoints.push(c);
            this._currentStartPt = c;
            if (1 === this._inputPoints.length) {
                for (a = 0; a < this._measureGraphics.length; a++) this._map.graphics.remove(this._measureGraphics[a]);
                this._map.graphics.remove(this._tempGraphic);
                this._measureGraphics = [];
                this.result = 0;
                this._outputResult(this.result,
                    m.widgets.measurement.NLS_length_miles);
                this._tempGraphic = new g;
                this._tempGraphic.setSymbol(this._lineSymbol);
                this._map.graphics.add(this._tempGraphic);
                this._mouseMoveMapHandler = d.connect(this._map, "onMouseMove", this, "_measureDistanceMouseMoveHandler");
                this.onMeasureStart(this.activeTool, this.getUnit())
            }
            this._tempGraphic.setGeometry(new h(this._map.spatialReference));
            a = new g;
            a.setSymbol(this._pointSymbol);
            a.setGeometry(c);
            this._measureGraphics.push(a);
            this._map.graphics.add(a);
            1 < this._inputPoints.length &&
                (this._measureGraphic = new g, this._measureGraphic.setSymbol(this._lineSymbol), this._measureGraphics.push(this._measureGraphic), a = new h(this._map.spatialReference), a.addPath([this._inputPoints[this._inputPoints.length - 2], c]), a = this._densifyGeometry(a), this._measureGraphic.setGeometry(a), this._map.graphics.add(this._measureGraphic), "PCS" === this._map.cs ? (b = new E, b.polylines = [a], b.lengthUnit = 9093, b.calculationType = "geodesic", this._geometryService.lengths(b, f.hitch(this, function(a) {
                    this.result += a.lengths[0];
                    this._showDistance(this.result);
                    this.onMeasure(this.activeTool, c, this._outputResult(this.result, this.getUnit()), this.getUnit())
                }))) : (this.result += this._geodesicDistance(this._inputPoints[this._inputPoints.length - 2], c), this._showDistance(this.result), this.onMeasure(this.activeTool, c, this._outputResult(this.result, this.getUnit()), this.getUnit())))
        },
        _measureDistanceMouseMoveHandler: function(a) {
            if (0 < this._inputPoints.length) {
                var b = new h(this._map.spatialReference),
                    c;
                this._map.snappingManager && (c = this._map.snappingManager._snappingPoint);
                a = c || a.mapPoint;
                b.addPath([this._currentStartPt, a]);
                b = this._densifyGeometry(b);
                this._tempGraphic.setGeometry(b);
                b = this._geodesicDistance(this._currentStartPt, a);
                this._showDistance(b + this.result)
            }
        },
        _geodesicDistance: function(a, b) {
            var c = new h(this._map.spatialReference);
            "PCS" === this._map.cs && (a = this._getGCSLocation(a), b = this._getGCSLocation(b));
            c.addPath([a, b]);
            "Web Mercator" === this._map.cs && (c = p.webMercatorToGeographic(c));
            return v.geodesicLengths([c], r.MILES)[0]
        },
        _showDistance: function(a) {
            a && this._outputResult(a,
                e.byNode(this._unitDropDown.domNode).label)
        },
        _locationClickHandler: function(a) {
            var b;
            this._map.snappingManager && (b = this._map.snappingManager._snappingPoint);
            a = b || a.mapPoint;
            this._locationButtonToggle();
            this._locationGraphic = new g;
            this._locationGraphic.setGeometry(a);
            this._locationGraphic.setSymbol(this._pointSymbol);
            this._map.graphics.add(this._locationGraphic);
            this._measureGraphics.push(this._locationGraphic);
            this._calculateLocation(a, !0)
        },
        _locationMoveHandler: function(a) {
            var b;
            this._map.snappingManager &&
                (b = this._map.snappingManager._snappingPoint);
            this._calculateLocation(b || a.mapPoint, !1)
        },
        _calculateLocation: function(a, b) {
            var c, k = "esriDegreeMinuteSeconds" === this.currentLocationUnit || "esriDecimalDegrees" === this.currentLocationUnit ? !1 : !0;
            k && this._mouseMoveMapHandler && (d.disconnect(this._mouseMoveMapHandler), this._mouseMoveMapHandler = null);
            c = this._getGCSLocation(a);
            this._updateLocationUI(c, b, k)
        },
        _updateLocationUI: function(a, b, c) {
            var d, e, t;
            d = a.x;
            e = a.y;
            if (this._interpolatedMap && (this._outOfBoundsCheck = [!1, 1], this._map.spatialReference._isWrappable() ? a = a.normalize() : 180 < a.x ? (a.x = 180, this._outOfBoundsCheck = [!0, 1]) : -180 > a.x && (a.x = -180, this._outOfBoundsCheck = [!0, -1]), a.y = this._roundY(a.y), b)) {
                this._updateMarkerLocation(a.x, a.y);
                d = new F({
                    wkid: 4326
                });
                this._geometryService.project([a], d, f.hitch(this, function(a) {
                    t = a[0];
                    this._outOfBoundsCheck[0] && (t.x = 180 * this._outOfBoundsCheck[1]);
                    this._advancedLocationDisplayHandler(t, t.x, t.y, c, b)
                }));
                return
            }
            b && this._updateMarkerLocation(d, e);
            this._advancedLocationDisplayHandler(a,
                d, e, c, b)
        },
        _advancedLocationDisplayHandler: function(a, b, c, d, e) {
            d ? (e = {
                coordinates: [
                    [b, c]
                ],
                sr: {
                    wkid: 4326
                },
                conversionType: this._unitStrings[this.currentLocationUnit]
            }, this._updateGeocoordinateStringLocation(e, a.geometry)) : (b = this._calculateXY(b, c), e ? (this._updateStaticLocation(b[0], b[1]), this.onMeasureEnd(this.activeTool, a, [b[0], b[1]], this.getUnit())) : this._updateMouseLocation(b[0], b[1]))
        },
        _updateMarkerLocation: function(a, b) {
            this.markerLocationX = a;
            this.markerLocationY = b
        },
        _updateMouseLocation: function(a,
            b) {
            this.mouseLongitude.innerHTML = a;
            this.mouseLatitude.innerHTML = b
        },
        _updateStaticLocation: function(a, b) {
            this._updateMouseLocation(a, b);
            this.markerLongitude.innerHTML = a;
            this.markerLatitude.innerHTML = b
        },
        _updateGeocoordinateStringLocation: function(a, b) {
            this.resultValue.domNode.innerHTML = "\x26nbsp";
            this._geometryService.toGeoCoordinateString(a, f.hitch(this, function(a) {
                clearTimeout(this._calcTimer);
                a ? (this.resultValue.domNode.innerHTML = a, this.onMeasureEnd(this.activeTool, b, a, this.getUnit())) : (this.resultValue.domNode.innerHTML =
                    this._gsErrorMsg, this.onMeasureEnd(this.activeTool, null, null, this.getUnit()))
            }));
            clearTimeout(this._calcTimer);
            this._calcTimer = setTimeout(f.hitch(this, function() {
                this.resultValue.domNode.innerHTML = this._calculatingMsg
            }, 1E3))
        },
        _calculateXY: function(a, b) {
            var c, d, e = m.widgets.measurement;
            if (this.getUnit() === e.NLS_decimal_degrees) c = a.toFixed(6), d = b.toFixed(6), d = this._roundY(d), this._map.spatialReference._isWrappable() || (c = this._roundX(c));
            else if (this.getUnit() === e.NLS_deg_min_sec) {
                var f = e = !1;
                0 > a && (e = !0, a = Math.abs(a));
                0 > b && (f = !0, b = Math.abs(b));
                b = this._roundY(b);
                this._map.spatialReference._isWrappable() || (a = this._roundX(a));
                c = Math.floor(a) + "\u00b0" + Math.floor(60 * (a - Math.floor(a))) + "'" + Math.floor(60 * (60 * (a - Math.floor(a)) - Math.floor(60 * (a - Math.floor(a))))) + '"';
                d = Math.floor(b) + "\u00b0" + Math.floor(60 * (b - Math.floor(b))) + "'" + Math.floor(60 * (60 * (b - Math.floor(b)) - Math.floor(60 * (b - Math.floor(b))))) + '"';
                e && (c = "-" + c);
                f && (d = "-" + d)
            }
            return [c, d]
        },
        _roundY: function(a) {
            90 < a ? a = 90 : -90 > a && (a = -90);
            return a
        },
        _roundX: function(a) {
            180 <
                a ? a = 180 : -180 > a && (a = -180);
            return a
        },
        _getGCSLocation: function(a) {
            if ("Web Mercator" === this._map.cs) a = p.webMercatorToGeographic(a);
            else if ("PCS" === this._map.cs) {
                if (this._map._newExtent) {
                    var b = Math.abs((this._map._newExtent.xmax - this._map._newExtent.xmin) / (this._map.extent.xmax - this._map.extent.xmin)),
                        c = Math.abs((this._map._newExtent.ymax - this._map._newExtent.ymin) / (this._map.extent.ymax - this._map.extent.ymin));
                    a = new D((a.x - this._map.extent.xmin) * b + this._map._newExtent.xmin, (a.y - this._map.extent.ymin) *
                        c + this._map._newExtent.ymin, this._map.spatialReference)
                }
            } else a = a.normalize();
            return a
        },
        _projectMapExtent: function(a) {
            a = new g(a);
            var b = new F({
                wkid: 4326
            });
            this._geometryService.project([a.geometry], b, f.hitch(this, function(a) {
                if (!this._mouseMoveMapHandler && "location" === this.activeTool) {
                    if ("esriDegreeMinuteSeconds" === this.currentLocationUnit || "esriDecimalDegrees" === this.currentLocationUnit) this._mouseMoveMapHandler = d.connect(this._map, "onMouseMove", f.hitch(this, this._locationMoveHandler));
                    this._mouseDragMapHandler =
                        d.connect(this._map, "onMouseDrag", f.hitch(this, function() {
                            e.byNode(this.resultValue.domNode).set("disabled", !0)
                        }))
                }
                this._map._newExtent = a[0]
            }))
        },
        _checkCS: function(a) {
            if (a.wkid) return 3857 === a.wkid || 102100 === a.wkid || 102113 === a.wkid ? "Web Mercator" : P.isDefined(Q[a.wkid]) ? "PCS" : "GCS";
            if (a.wkt) return -1 !== a.wkt.indexOf("WGS_1984_Web_Mercator") ? "Web Mercator" : 0 === a.wkt.indexOf("PROJCS") ? "PCS" : "GCS"
        },
        _switchUnit: function(a) {
            "distance" === this.activeTool ? this.currentDistanceUnit = a : "area" === this.activeTool ?
                this.currentAreaUnit = a : "location" === this.activeTool && (this.currentLocationUnit = a);
            e.byNode(this._unitDropDown.domNode).set("label", this._unitStrings[a]);
            if (null !== this.result) {
                var b = this._outputResult(this.result, this._unitStrings[a]);
                this.onUnitChange(this._unitStrings[a], this.activeTool);
                if (null !== this._measureGraphic) this.onMeasureEnd(this.activeTool, this._measureGraphic.geometry, b, this.getUnit())
            }
        },
        _outputResult: function(a, b) {
            var c = a * this._unitDictionary[b];
            0 === c ? e.byNode(this.resultValue.domNode).set("content",
                "\x26nbsp") : 1E6 < c ? e.byNode(this.resultValue.domNode).set("content", z.format(c.toPrecision(9), {
                pattern: this.numberPattern
            }) + " " + b) : 10 > c ? e.byNode(this.resultValue.domNode).set("content", z.format(c.toFixed(2), {
                pattern: this.numberPattern + "0"
            }) + " " + b) : e.byNode(this.resultValue.domNode).set("content", z.format(c.toFixed(2), {
                pattern: this.numberPattern
            }) + " " + b);
            return c
        },
        _switchLocationUnit: function(a) {
            var b, c;
            e.byNode(this._unitDropDown.domNode).set("label", this._unitStrings[a]);
            this.currentLocationUnit =
                a;
            d.disconnect(this._mouseMoveMapHandler);
            this._mouseMoveMapHandler = null;
            this.onUnitChange(this._unitStrings[a], this.activeTool);
            "esriDegreeMinuteSeconds" === a || "esriDecimalDegrees" === a ? (this._mouseMoveMapHandler = d.connect(this._map, "onMouseMove", this, "_locationMoveHandler"), this._toggleStaticLocationTable(!0, !1), this._locationGraphic && this._calculateLocation(this._locationGraphic.geometry, !0)) : (this._toggleStaticLocationTable(!1, !1), null === this.resultValue || null === this.markerLocationX && null === this.markerLocationY ||
                (b = this.markerLocationX, c = this.markerLocationY, a = {
                    coordinates: [
                        [b, c]
                    ],
                    sr: {
                        wkid: 4326
                    },
                    conversionType: this._unitStrings[a]
                }, this._locationGraphic && this._updateGeocoordinateStringLocation(a, this._locationGraphic.geometry)))
        },
        _toggleStaticLocationTable: function(a, b) {
            b && (this.resultValue.innerHTML = "\x26nbsp", this.markerLongitude.innerHTML = "---", this.markerLatitude.innerHTML = "---", this.mouseLongitude.innerHTML = "---", this.mouseLatitude.innerHTML = "---");
            a ? (q.show(this.resultTable.domNode), q.hide(this.resultValueContainer.domNode)) :
                (q.hide(this.resultTable.domNode), q.show(this.resultValueContainer.domNode), d.disconnect(this._mouseMoveMapHandler))
        },
        _createDistanceUnitList: function() {
            var a, b = new A({
                style: "display: none;"
            });
            l.forEach(this._distanceUnitStrings, f.hitch(this, function(a, d) {
                var e = new B({
                    label: a,
                    onClick: f.hitch(this, function() {
                        this._switchUnit(this._distanceUnitStringsLong[d])
                    })
                });
                e.set("class", "unitDropDown");
                b.addChild(e)
            }));
            e.byNode(this._unitDropDown.domNode).set("dropDown", b);
            this.currentDistanceUnit ? (a = this._unitStrings[this.currentDistanceUnit],
                e.byNode(this._unitDropDown.domNode).set("label", a)) : (a = this._unitStrings[this._defaultDistanceUnit], e.byNode(this._unitDropDown.domNode).set("label", a), this.currentDistanceUnit = this._defaultDistanceUnit)
        },
        _createAreaUnitList: function() {
            var a, b = new A({
                style: "display: none;"
            });
            l.forEach(this._areaUnitStrings, f.hitch(this, function(a, d) {
                var e = new B({
                    label: a,
                    onClick: f.hitch(this, function() {
                        this._switchUnit(this._areaUnitStringsLong[d])
                    })
                });
                e.set("class", "unitDropDown");
                b.addChild(e)
            }));
            e.byNode(this._unitDropDown.domNode).set("dropDown",
                b);
            this.currentAreaUnit ? (a = this._unitStrings[this.currentAreaUnit], e.byNode(this._unitDropDown.domNode).set("label", a)) : (a = this._unitStrings[this._defaultAreaUnit], e.byNode(this._unitDropDown.domNode).set("label", a), this.currentAreaUnit = this._defaultAreaUnit)
        },
        _createLocationUnitList: function() {
            var a;
            a = this._locationUnitStrings;
            var b = new A({
                style: "display: none;"
            });
            if (null === this._geometryService || !1 === this.advancedLocationUnits) a = a.slice(0, 2);
            l.forEach(a, f.hitch(this, function(a, d) {
                var e = new B({
                    label: a,
                    onClick: f.hitch(this, function() {
                        this._switchLocationUnit(this._locationUnitStringsLong[d])
                    })
                });
                e.set("class", "unitDropDown");
                b.addChild(e)
            }));
            e.byNode(this._unitDropDown.domNode).set("dropDown", b);
            this.currentLocationUnit || (this.currentLocationUnit = this._defaultLocationUnit);
            a = this._unitStrings[this.currentLocationUnit];
            e.byNode(this._unitDropDown.domNode).set("label", a);
            ("esriDegreeMinuteSeconds" === this.currentLocationUnit || "esriDecimalDegrees" === this.currentLocationUnit) && this._toggleStaticLocationTable(!0, !1)
        },
        _setupDictionaries: function() {
            var a = m.widgets.measurement;
            this._unitDictionary[a.NLS_length_miles] = 1;
            this._unitDictionary[a.NLS_length_kilometers] = 1.609344;
            this._unitDictionary[a.NLS_length_feet] = 5280;
            this._unitDictionary[a.NLS_length_meters] = 1609.34;
            this._unitDictionary[a.NLS_length_yards] = 1760;
            this._unitDictionary[a.NLS_length_nautical_miles] = 0.869;
            this._unitDictionary[a.NLS_area_acres] = 1;
            this._unitDictionary[a.NLS_area_sq_kilometers] = 0.004047;
            this._unitDictionary[a.NLS_area_sq_miles] = 0.0015625;
            this._unitDictionary[a.NLS_area_sq_feet] = 43560;
            this._unitDictionary[a.NLS_area_sq_meters] = 4046.87;
            this._unitDictionary[a.NLS_area_hectares] = 0.4047;
            this._unitDictionary[a.NLS_area_sq_yards] = 4840;
            this._unitDictionary[a.NLS_area_sq_nautical_miles] = 0.001179874545293396;
            this._unitStrings = {
                esriMiles: a.NLS_length_miles,
                esriKilometers: a.NLS_length_kilometers,
                esriFeet: a.NLS_length_feet,
                esriMeters: a.NLS_length_meters,
                esriYards: a.NLS_length_yards,
                esriNauticalMiles: a.NLS_length_nautical_miles,
                esriAcres: a.NLS_area_acres,
                esriSquareKilometers: a.NLS_area_sq_kilometers,
                esriSquareMiles: a.NLS_area_sq_miles,
                esriSquareFeet: a.NLS_area_sq_feet,
                esriSquareMeters: a.NLS_area_sq_meters,
                esriHectares: a.NLS_area_hectares,
                esriSquareYards: a.NLS_area_sq_yards,
                esriSquareNauticalMiles: a.NLS_area_sq_nautical_miles,
                esriDecimalDegrees: a.NLS_decimal_degrees,
                esriDegreeMinuteSeconds: a.NLS_deg_min_sec,
                esriMGRS: a.NLS_MGRS,
                esriUSNG: a.NLS_USNG,
                esriUTM: a.NLS_UTM,
                esriDDM: a.NLS_DDM,
                esriDD: a.NLS_DD,
                esriGARS: a.NLS_GARS,
                esriGeoRef: a.NLS_GeoRef
            };
            this._locationUnitStrings = [a.NLS_decimal_degrees, a.NLS_deg_min_sec, a.NLS_MGRS, a.NLS_USNG, a.NLS_UTM, a.NLS_GeoRef, a.NLS_GARS];
            this._locationUnitStringsLong = "esriDecimalDegrees esriDegreeMinuteSeconds esriMGRS esriUSNG esriUTM esriGeoRef esriGARS".split(" ");
            this._distanceUnitStrings = [a.NLS_length_miles, a.NLS_length_kilometers, a.NLS_length_feet, a.NLS_length_meters, a.NLS_length_yards, a.NLS_length_nautical_miles];
            this._distanceUnitStringsLong = "esriMiles esriKilometers esriFeet esriMeters esriYards esriNauticalMiles".split(" ");
            this._areaUnitStrings = [a.NLS_area_acres, a.NLS_area_sq_miles, a.NLS_area_sq_kilometers, a.NLS_area_hectares, a.NLS_area_sq_yards, a.NLS_area_sq_feet, a.NLS_area_sq_meters];
            this._areaUnitStringsLong = "esriAcres esriSquareMiles esriSquareKilometers esriHectares esriSquareYards esriSquareFeet esriSquareMeters".split(" ");
            this._buttonDijits = {
                area: this._areaButton,
                distance: this._distanceButton,
                location: this._locationButton
            };
            e.byNode(this._distanceButton.domNode).setLabel(a.NLS_distance);
            e.byNode(this._areaButton.domNode).setLabel(a.NLS_area);
            e.byNode(this._locationButton.domNode).setLabel(a.NLS_location);
            e.byNode(this.resultLabel.domNode).setContent(a.NLS_resultLabel)
        },
        _drawPointGraphics: function(a) {
            var b, c, d;
            c = this._pointSymbol;
            a = u.create("div", {
                "class": "esriLocationResultSymbol"
            }, a);
            a = H.createSurface(a, 10, 10);
            9 > y("ie") && (b = a.getEventSource(), n.set(b, "position", "relative"), n.set(b.parentNode, "position", "relative"));
            c = c.getShapeDescriptors();
            try {
                d = a.createShape(c.defaultShape).setFill(c.fill).setStroke(c.stroke)
            } catch (e) {
                a.clear();
                a.destroy();
                return
            }
            var g = d.getBoundingBox();
            c = g.width;
            b = g.height;
            var h = -(g.x + c / 2),
                g = -(g.y + b / 2);
            a = a.getDimensions();
            a = {
                dx: h + a.width / 2,
                dy: g + a.height / 2
            };
            if (10 < c || 10 < b) c = 5 / (c / 10 > b / 10 ? c : b), f.mixin(a, {
                xx: c,
                yy: c
            });
            d.applyTransform(a)
        }
    })
});