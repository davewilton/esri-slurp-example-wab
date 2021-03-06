//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/has", "../../../layers/FeatureLayer", "../../../tasks/query", "../../../toolbars/draw", "./ToggleToolBase", "../../../kernel"], function(f, d, g, e, n, h, k, l, m, p) {
    return f([m], {
        declaredClass: "esri.dijit.editing.tools.Reshape",
        id: "btnFeatureReshape",
        _enabledIcon: "toolbarIcon reshapeIcon",
        _disabledIcon: "toolbarIcon reshapeIcon",
        _drawType: l.POLYLINE,
        _enabled: !0,
        _label: "NLS_reshapeLbl",
        activate: function() {
            e.disconnect(this._rConnect);
            this._rConnect = e.connect(this._toolbar, "onDrawEnd", this, "_onDrawEnd");
            this.inherited(arguments)
        },
        deactivate: function() {
            this.inherited(arguments);
            e.disconnect(this._rConnect);
            delete this._rConnect
        },
        _onDrawEnd: function(c) {
            var b = this._settings.layers,
                a = new k;
            a.geometry = c;
            c = this._reshapeLayers = g.filter(b, function(a) {
                return "esriGeometryPolygon" === a.geometryType || "esriGeometryPolyline"
            });
            this._settings.editor._selectionHelper.selectFeatures(c, a, h.SELECTION_NEW, d.hitch(this, "_reshape", a))
        },
        _reshape: function(c,
            b) {
            1 === b.length && this._settings.geometryService.reshape(b[0].geometry, c.geometry, d.hitch(this, function(a) {
                a = [b[0].setGeometry(a)];
                this.onApplyEdits([{
                    layer: b[0].getLayer(),
                    updates: a
                }], d.hitch(this, function() {
                    this._settings.editor._selectionHelper.clearSelection(!1);
                    this.onFinished()
                }))
            }))
        }
    })
});