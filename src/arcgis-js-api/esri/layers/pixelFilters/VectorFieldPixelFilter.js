//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../../kernel", "../../lang", "dojo/_base/array"], function(t, g, y, z, u, h) {
    return t(null, {
        declaredClass: "esri.layers.pixelFilters.VectorFieldPixelFilter",
        speedUnits: ["esriMetersPerSecond", "esriKilometersPerHour", "esriKnots", "esriFeetPerSecond", "esriMilesPerHour"],
        constructor: function(b) {
            g.mixin(this, b);
            this.isDataUV = b && b.isDataUV ? b.isDataUV : !1;
            this.computeMagnitudeAndDirection = g.hitch(this, this.computeMagnitudeAndDirection);
            this.unitConversionFactor =
                1;
            this._updateUnitConvFactor()
        },
        setUnits: function(b, a) {
            this.inputUnit = b;
            this.outputUnit = a;
            this.unitConversionFactor = 1;
            this._updateUnitConvFactor()
        },
        _updateUnitConvFactor: function() {
            var b = h.indexOf(this.speedUnits, this.inputUnit),
                a = h.indexOf(this.speedUnits, this.outputUnit);
            if (this.inputUnit && this.outputUnit && 0 <= b && 0 <= a) {
                var c = [1, 0.277778, 0.514444, 0.3048, 0.44704, 0];
                this.unitConversionFactor = c[b] / c[a]
            }
        },
        computeMagnitudeAndDirection: function(b) {
            if (!u.isDefined(b)) throw "Could not compute magnitude and direction. No pixel data is available.";
            var a = b.pixelBlock;
            if (!u.isDefined(a) || 2 !== a.getPlaneCount()) throw "Could not compute magnitude and direction. Pixel data does not contain two bands.";
            var c = b.extent,
                g = (c.xmax - c.xmin) / a.width,
                h = (c.ymax - c.ymin) / a.height,
                t = c.xmin + g / 2,
                c = c.ymax - h / 2;
            a.statistics[0].minValue = 0;
            a.statistics[0].maxValue = 0;
            var w = 180 / Math.PI,
                v = [],
                k = 0,
                l = 0,
                f = 0,
                x = !u.isDefined(a.mask),
                m, n, d, e, p, q, r, s;
            p = r = Infinity;
            q = s = -Infinity;
            for (k = 0; k < a.height; k++)
                for (l = 0; l < a.width; l++, f++)
                    if (v.push([t + g * l, c - h * k]), x || a.mask[f]) d = m = a.pixels[0][f] *
                        this.unitConversionFactor, e = n = a.pixels[1][f], this.isDataUV && (d = Math.sqrt(m * m + n * n), e = 90 - w * Math.atan2(n, m), a.pixels[0][f] = d * this.unitConversionFactor, a.pixels[1][f] = e), d > q && (q = d), d < p && (p = d), e > s && (s = e), e < r && (r = e);
            a.statistics[0].maxValue = q;
            a.statistics[0].minValue = p;
            a.statistics[1].maxValue = s;
            a.statistics[1].minValue = r;
            b.locations = v;
            return b
        }
    })
});