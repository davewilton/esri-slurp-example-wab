//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "dijit/form/Button", "./ToolBase", "../../../kernel"], function(c, d, e, a, b, f) {
    return c([a, b], {
        declaredClass: "esri.dijit.editing.tools.ButtonToolBase",
        postCreate: function() {
            this.inherited(arguments);
            this._setShowLabelAttr && this._setShowLabelAttr(!1)
        },
        destroy: function() {
            a.prototype.destroy.apply(this, arguments);
            b.prototype.destroy.apply(this, arguments)
        }
    })
});