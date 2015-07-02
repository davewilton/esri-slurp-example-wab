//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/query", "dojo/has", "dijit/registry", "dojo/dom-construct", "../tools/ClickableTool", "../tools/GeoExtentDialog", "../tools/GeoExtentView", "../tools/geoExtentUtil", "../../../../kernel"], function(p, m, v, n, w, q, r, s, t, u, f, x) {
    return p([s], {
        postCreate: function() {
            this.inherited(arguments)
        },
        startup: function() {
            if (!this._started) {
                var a = this.findInputWidget();
                a && a.parentXNode && a.parentXNode.gxeDocument && a.parentXNode.gxeDocument.isViewOnly && setTimeout(m.hitch(this,
                    function() {
                        this._handleRequest(a, !1)
                    }), 2E3)
            }
        },
        whenToolClicked: function(a, d) {
            this._handleRequest(d, !0)
        },
        _findInputWgt: function(a, d) {
            var b;
            if ((b = n("[data-gxe-path\x3d'" + a + "']", d)) && 1 === b.length)
                if (b = q.byNode(b[0])) return b.inputWidget;
            return null
        },
        _findViewSection: function(a) {
            return (a = n(".gxeGeoExtentSection .gxeGeoExtentViewSection", a)) && 1 === a.length ? a[0] : null
        },
        _handleRequest: function(a, d) {
            if (a && a.parentXNode) {
                var b = a.parentXNode.getParentElement();
                if (b && (b = b.getParentElement())) {
                    var c = b.gxePath,
                        e =
                        b.domNode,
                        g = this._findInputWgt(c + "/gmd:westBoundLongitude/gco:Decimal", e),
                        h = this._findInputWgt(c + "/gmd:eastBoundLongitude/gco:Decimal", e),
                        k = this._findInputWgt(c + "/gmd:northBoundLatitude/gco:Decimal", e),
                        l = this._findInputWgt(c + "/gmd:southBoundLatitude/gco:Decimal", e);
                    g && (h && k && l) && (c = null, b.gxeDocument && b.gxeDocument.isViewOnly ? d || (c = this._findViewSection(e)) && new u({
                        gxeDocument: b.gxeDocument,
                        xmin: g.getInputValue(),
                        ymin: l.getInputValue(),
                        xmax: h.getInputValue(),
                        ymax: k.getInputValue()
                    }, r.create("div", {}, c)) : d && (b = new t({
                        gxeDocument: b.gxeDocument,
                        xmin: g.getInputValue(),
                        ymin: l.getInputValue(),
                        xmax: h.getInputValue(),
                        ymax: k.getInputValue(),
                        onChange: m.hitch(this, function(a) {
                            g.setInputValue(f.formatCoordinate(a.xmin));
                            h.setInputValue(f.formatCoordinate(a.xmax));
                            k.setInputValue(f.formatCoordinate(a.ymax));
                            l.setInputValue(f.formatCoordinate(a.ymin))
                        })
                    }), b.show()))
                }
            }
        }
    })
});