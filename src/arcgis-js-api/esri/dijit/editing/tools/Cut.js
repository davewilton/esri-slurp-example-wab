//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/connect", "dojo/has", "dojo/DeferredList", "../../../graphicsUtils", "../../../graphic", "../../../tasks/query", "../../../layers/FeatureLayer", "../../../toolbars/draw", "../Cut", "./ToggleToolBase", "../../../kernel"], function(h, e, b, g, v, n, p, l, q, r, s, t, u, w) {
    return h([u], {
        declaredClass: "esri.dijit.editing.tools.Cut",
        id: "btnFeatureCut",
        _enabledIcon: "toolbarIcon cutIcon",
        _disabledIcon: "toolbarIcon cutIcon",
        _drawType: s.POLYLINE,
        _enabled: !0,
        _label: "NLS_cutLbl",
        _cutConnects: [],
        activate: function() {
            this._cutConnects.push(g.connect(this._toolbar, "onDrawEnd", this, "_onDrawEnd"));
            this.inherited(arguments)
        },
        deactivate: function() {
            this.inherited(arguments);
            b.forEach(this._cutConnects, g.disconnect);
            this._cutConnects = [];
            this._edits = []
        },
        _onDrawEnd: function(f) {
            var d = this._cutLayers = b.filter(this._settings.layers, function(a) {
                return "esriGeometryPolygon" === a.geometryType || "esriGeometryPolyline" === a.geometryType && a.visible && a._isMapAtVisibleScale()
            });
            this._cutConnects = this._cutConnects.concat(b.map(d,
                e.hitch(this, function(a) {
                    return g.connect(a, "onEditsComplete", e.hitch(this, function(a, c, d) {
                        if (this._settings.undoRedoManager) {
                            var f = this._settings.undoRedoManager;
                            b.forEach(this._edits, e.hitch(this, function(a) {
                                f.add(new t({
                                    featureLayer: a.layer,
                                    addedGraphics: a.adds,
                                    preUpdatedGraphics: a.preUpdates,
                                    postUpdatedGraphics: a.updates
                                }))
                            }), this)
                        }
                        this.onFinished()
                    }))
                })));
            var c = new q;
            c.geometry = f;
            b.forEach(d, function(a, d) {
                this._settings.editor._selectionHelper.selectFeatures([a], c, r.SELECTION_NEW, e.hitch(this,
                    "_cutFeatures", a, c))
            }, this)
        },
        _cutFeatures: function(b, d, c) {
            if (c && c.length) {
                this._edits = [];
                var a = [];
                a.push(this._settings.geometryService.cut(p.getGeometries(c), d.geometry, e.hitch(this, "_cutHandler", b, c)));
                (new n(a)).addCallback(e.hitch(this, function() {
                    this.onApplyEdits(this._edits)
                }))
            }
        },
        _cutHandler: function(f, d, c) {
            var a = [],
                g = [],
                h = b.map(d, function(a) {
                    return new l(e.clone(a.toJson()))
                }),
                m, k;
            b.forEach(c.cutIndexes, function(b, f) {
                m != b ? (m = b, g.push(d[b].setGeometry(c.geometries[f]))) : (k = new l(c.geometries[f],
                    null, e.mixin({}, d[b].attributes), null), k.attributes[d[0].getLayer().objectIdField] = null, a.push(k))
            }, this);
            this._edits.push({
                layer: f,
                adds: a,
                updates: g,
                preUpdates: h
            })
        }
    })
});