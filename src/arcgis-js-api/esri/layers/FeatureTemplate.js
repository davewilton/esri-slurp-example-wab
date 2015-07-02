//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../lang", "../graphic"], function(b, c, f, g, d, e) {
    b = b(null, {
        declaredClass: "esri.layers.FeatureTemplate",
        constructor: function(a) {
            a && c.isObject(a) && (this.name = a.name, this.description = a.description, this.drawingTool = a.drawingTool, a = a.prototype, this.prototype = new e(a.geometry, null, a.attributes))
        },
        toJson: function() {
            return d.fixJson({
                name: this.name,
                description: this.description,
                drawingTool: this.drawingTool,
                prototype: this.prototype && this.prototype.toJson()
            })
        }
    });
    c.mixin(b, {
        TOOL_AUTO_COMPLETE_POLYGON: "esriFeatureEditToolAutoCompletePolygon",
        TOOL_CIRCLE: "esriFeatureEditToolCircle",
        TOOL_ELLIPSE: "esriFeatureEditToolEllipse",
        TOOL_FREEHAND: "esriFeatureEditToolFreehand",
        TOOL_LINE: "esriFeatureEditToolLine",
        TOOL_NONE: "esriFeatureEditToolNone",
        TOOL_POINT: "esriFeatureEditToolPoint",
        TOOL_POLYGON: "esriFeatureEditToolPolygon",
        TOOL_RECTANGLE: "esriFeatureEditToolRectangle",
        TOOL_ARROW: "esriFeatureEditToolArrow",
        TOOL_TRIANGLE: "esriFeatureEditToolTriangle",
        TOOL_LEFT_ARROW: "esriFeatureEditToolLeftArrow",
        TOOL_RIGHT_ARROW: "esriFeatureEditToolRightArrow",
        TOOL_UP_ARROW: "esriFeatureEditToolUpArrow",
        TOOL_DOWN_ARROW: "esriFeatureEditToolDownArrow"
    });
    return b
});