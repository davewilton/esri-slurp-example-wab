//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "dojox/gfx/_base", "../kernel", "../lang", "../symbols/TextSymbol", "../symbols/ShieldLabelSymbol"], function(e, c, h, b, k, d, f, g) {
    return e(null, {
        declaredClass: "esri.layers.LabelClass",
        labelPlacement: null,
        labelExpression: null,
        useCodedValues: null,
        symbol: null,
        maxScale: 0,
        minScale: 0,
        where: null,
        sizeInfo: null,
        _labelPlacementLookup: {
            "above-center": "esriServerPointLabelPlacementAboveCenter",
            "above-left": "esriServerPointLabelPlacementAboveLeft",
            "above-right": "esriServerPointLabelPlacementAboveRight",
            "below-center": "esriServerPointLabelPlacementBelowCenter",
            "below-left": "esriServerPointLabelPlacementBelowLeft",
            "below-right": "esriServerPointLabelPlacementBelowRight",
            "center-center": "esriServerPointLabelPlacementCenterCenter",
            "center-left": "esriServerPointLabelPlacementCenterLeft",
            "center-right": "esriServerPointLabelPlacementCenterRight",
            "above-after": "esriServerLinePlacementAboveAfter",
            "above-along": "esriServerLinePlacementAboveAlong",
            "above-before": "esriServerLinePlacementAboveBefore",
            "above-start": "esriServerLinePlacementAboveStart",
            "above-end": "esriServerLinePlacementAboveEnd",
            "below-after": "esriServerLinePlacementBelowAfter",
            "below-along": "esriServerLinePlacementBelowAlong",
            "below-before": "esriServerLinePlacementBelowBefore",
            "below-start": "esriServerLinePlacementBelowStart",
            "below-end": "esriServerLinePlacementBelowEnd",
            "center-after": "esriServerLinePlacementCenterAfter",
            "center-along": "esriServerLinePlacementCenterAlong",
            "center-before": "esriServerLinePlacementCenterBefore",
            "center-start": "esriServerLinePlacementCenterStart",
            "center-end": "esriServerLinePlacementCenterEnd",
            "always-horizontal": "esriServerPolygonPlacementAlwaysHorizontal"
        },
        constructor: function(a) {
            if (a && (c.mixin(this, a), this._labelPlacementLookup.hasOwnProperty(this.labelPlacement) || (this.labelPlacement = d.valueOf(this._labelPlacementLookup, a.labelPlacement)), a.symbol && (this.symbol = "esriSHD" === a.symbol.type ? new g(a.symbol) : new f(a.symbol)), a = this.sizeInfo)) a.minSize && (a.minSize = b.pt2px(a.minSize)), a.maxSize && (a.maxSize = b.pt2px(a.maxSize))
        },
        getSymbol: function() {
            return this.symbol
        },
        toJson: function() {
            var a = this.sizeInfo;
            a && (a = c.mixin({}, a), a.minSize && (a.minSize = b.px2pt(a.minSize)), a.maxSize && (a.maxSize = b.px2pt(a.maxSize)));
            a = {
                labelExpression: this.labelExpression,
                labelExpressionInfo: this.labelExpressionInfo && c.clone(this.labelExpressionInfo),
                useCodedValues: this.useCodedValues,
                maxScale: this.maxScale,
                minScale: this.minScale,
                where: this.where,
                sizeInfo: a,
                labelPlacement: this._labelPlacementLookup.hasOwnProperty(this.labelPlacement) ? this._labelPlacementLookup[this.labelPlacement] : this.labelPlacement,
                symbol: this.symbol && this.symbol.toJson()
            };
            return d.fixJson(a)
        }
    })
});