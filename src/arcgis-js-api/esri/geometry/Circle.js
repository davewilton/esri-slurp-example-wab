//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../lang", "./Point", "./Polygon", "./geodesicUtils", "./webMercatorUtils", "../WKIDUnitConversion", "../units"], function(n, p, t, u, l, q, k, r, m, h, s) {
    return n(k, {
        declaredClass: "esri.geometry.Circle",
        _unitToMeters: {
            esriCentimeters: 0.01,
            esriDecimeters: 0.1,
            esriFeet: 0.3048,
            esriInches: 0.0254,
            esriKilometers: 1E3,
            esriMeters: 1,
            esriMiles: 1609.34,
            esriMillimeters: 0.0010,
            esriNauticalMiles: 1852,
            esriYards: 0.9144,
            esriDecimalDegrees: 111320
        },
        constructor: function(a, c) {
            var b;
            a.center ? b = a : (b = c || {}, b.center = a);
            this.center = p.isArray(b.center) ? new q(b.center[0], b.center[1]) : b.center;
            this.radius = b.radius || 1E3;
            this.radiusUnit = b.radiusUnit || s.METERS;
            this.geodesic = !0 === b.geodesic ? !0 : !1;
            this.numberOfPoints = b.numberOfPoints || 60;
            this._init()
        },
        toJson: function() {
            return this.inherited(arguments)
        },
        _init: function() {
            var a = this.radius * this._unitToMeters[this.radiusUnit],
                c = this._srType(this.center.spatialReference);
            if (this.geodesic) {
                var b;
                switch (c) {
                    case "webMercator":
                        b = m.webMercatorToGeographic(this.center);
                        break;
                    case "projected":
                        console.error("Creating a geodesic circle requires the center to be specified in web mercator or geographic coordinate system");
                        break;
                    case "geographic":
                        b = this.center
                }
                a = this._createGeodesicCircle(b, a, this.numberOfPoints);
                "webMercator" === c && (a = m.geographicToWebMercator(a))
            } else {
                var d;
                "webMercator" === c || "projected" === c ? d = a / this._convert2Meters(1, this.center.spatialReference) : "geographic" === c && (d = a / this._unitToMeters.esriDecimalDegrees);
                a = this._createPlanarCircle(this.center, d,
                    this.numberOfPoints)
            }
            this.spatialReference = a.spatialReference;
            this.addRing(a.rings[0]);
            this.verifySR()
        },
        _createGeodesicCircle: function(a, c, b) {
            for (var d = 0, e = Math.PI / 180, f = [], g; d < 2 * Math.PI;) g = r._directGeodeticSolver(a.y * e, a.x * e, d, c), f.push([g.x, g.y]), d += Math.PI / (b / 2);
            f.push(f[0]);
            return new k(f)
        },
        _createPlanarCircle: function(a, c, b) {
            for (var d = 0, e = [], f, g; d < 2 * Math.PI;) f = a.x + Math.cos(d) * c, g = a.y + Math.sin(d) * c, e.push([f, g]), d += Math.PI / (b / 2);
            e.push(e[0]);
            a = new k(a.spatialReference);
            a.addRing(e);
            return a
        },
        _srType: function(a) {
            return a.isWebMercator() ? "webMercator" : l.isDefined(h[a.wkid]) || a.wkt && 0 === a.wkt.indexOf("PROJCS") ? "projected" : "geographic"
        },
        _convert2Meters: function(a, c) {
            var b;
            if (l.isDefined(h[c.wkid])) b = h.values[h[c.wkid]];
            else {
                b = c.wkt;
                var d = b.lastIndexOf(",") + 1,
                    e = b.lastIndexOf("]]");
                b = parseFloat(b.substring(d, e))
            }
            return a * b
        }
    })
});