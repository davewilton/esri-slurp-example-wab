//>>built
define(["../../kernel", "dijit/_TemplatedMixin", "dijit/_WidgetBase", "dojo/_base/declare", "dojo/_base/lang", "dojo/dom-style", "dojo/has", "dojo/i18n!../../nls/jsapi", "dojo/text!./templates/ScalePreview.html"], function(k, c, d, e, f, b, l, g, h) {
    return e([d, c], {
        declaredClass: "esri.dijit.VisibleScaleRangeSlider.ScalePreview",
        baseClass: "esriScalePreview",
        templateString: h,
        labels: g.visibleScaleRangeSlider,
        constructor: function() {
            f.extend(this.constructor, {
                css: {
                    header: "esriHeader",
                    thumbnail: "esriThumbnail"
                }
            })
        },
        source: null,
        _setSourceAttr: function(a) {
            this.source !== a && (this._set("source", a), b.set(this.dap_scalePreviewThumbnail, "backgroundImage", a))
        },
        backgroundPosition: null,
        _setBackgroundPositionAttr: function(a) {
            this.backgroundPosition !== a && (this._set("backgroundPosition", a), b.set(this.dap_scalePreviewThumbnail, "backgroundPosition", a))
        }
    })
});