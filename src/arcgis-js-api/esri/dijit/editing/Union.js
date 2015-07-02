//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../../kernel", "../../OperationBase", "./Cut"], function(b, e, f, g, c, d) {
    return b(c, {
        declaredClass: "esri.dijit.editing.Union",
        type: "edit",
        label: "Union Features",
        constructor: function(a) {
            a = a || {};
            this._cut = new d({
                featureLayer: a.featureLayer,
                addedGraphics: a.deletedGraphics,
                preUpdatedGraphics: a.preUpdatedGraphics,
                postUpdatedGraphics: a.postUpdatedGraphics
            })
        },
        performUndo: function() {
            this._cut.performRedo()
        },
        performRedo: function() {
            this._cut.performUndo()
        }
    })
});