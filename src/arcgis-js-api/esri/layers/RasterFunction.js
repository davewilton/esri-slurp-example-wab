//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../lang"], function(e, d, g, h, f) {
    var c = e(null, {
        declaredClass: "esri.layers.RasterFunction",
        functionName: null,
        arguments: null,
        functionArguments: null,
        variableName: null,
        outputPixelType: null,
        constructor: function(a) {
            if (d.isObject(a)) {
                var b = 0;
                this.functionName = a.rasterFunction;
                this.functionArguments = d.clone(a.rasterFunctionArguments || a.arguments);
                d.mixin(this, a);
                if (a = this.functionArguments)
                    if (a.Raster = this._toRasterFunction(a.Raster), a.Raster2 =
                        this._toRasterFunction(a.Raster2), a.DEM = this._toRasterFunction(a.DEM), a.FillRaster = this._toRasterFunction(a.FillRaster), a.Rasters && a.Rasters.length)
                        for (b = 0; b < a.Rasters.length; b++) a.Rasters[b] = this._toRasterFunction(a.Rasters[b])
            }
        },
        _toRasterFunction: function(a) {
            return a && (a.rasterFunction || a.functionName) ? new c(a) : a
        },
        _rfToJson: function(a) {
            a && "esri.layers.RasterFunction" === a.declaredClass && (a = a.toJson());
            return a
        },
        toJson: function() {
            var a = d.clone(this.functionArguments || this.arguments);
            if (a && (a.Raster =
                    this._rfToJson(a.Raster), a.Raster2 = this._rfToJson(a.Raster2), a.DEM = this._rfToJson(a.DEM), a.FillRaster = this._rfToJson(a.FillRaster), a.Rasters && a.Rasters.length)) {
                var b, c = [];
                for (b = 0; b < a.Rasters.length; b++) c.push(this._rfToJson(a.Rasters[b]));
                a.Rasters = c
            }
            return f.filter({
                rasterFunction: this.functionName,
                rasterFunctionArguments: a,
                variableName: this.variableName,
                outputPixelType: this.outputPixelType ? this.outputPixelType : null
            }, function(a) {
                if (null !== a && void 0 !== a) return !0
            })
        }
    });
    return c
});