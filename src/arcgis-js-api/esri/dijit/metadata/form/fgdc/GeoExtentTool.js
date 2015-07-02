//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/query", "dijit/registry", "dojo/dom-construct", "dojo/has", "../tools/ClickableTool", "../tools/GeoExtentDialog", "../tools/GeoExtentView", "../tools/geoExtentUtil", "../../../../kernel"], function(n, m, u, d, p, q, v, r, s, t, f, w) {
    return n([r], {
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
        whenToolClicked: function(a, c) {
            this._handleRequest(c, !0)
        },
        _findInputWgt: function(a, c) {
            var b;
            if ((b = d("[data-gxe-path\x3d'" + a + "']", c)) && 1 === b.length)
                if (b = p.byNode(b[0])) return b.inputWidget;
            return null
        },
        _findViewSection: function(a) {
            return (a = d(".gxeGeoExtentSection .gxeGeoExtentViewSection", a)) && 1 === a.length ? a[0] : null
        },
        _handleRequest: function(a, c) {
            if (a && a.parentXNode) {
                var b = a.parentXNode.getParentElement();
                if (b) {
                    var e = b.domNode,
                        g = this._findInputWgt("/metadata/idinfo/spdom/bounding/westbc",
                            e),
                        h = this._findInputWgt("/metadata/idinfo/spdom/bounding/eastbc", e),
                        k = this._findInputWgt("/metadata/idinfo/spdom/bounding/northbc", e),
                        l = this._findInputWgt("/metadata/idinfo/spdom/bounding/southbc", e);
                    if (g && h && k && l) {
                        var d = null;
                        b.gxeDocument && b.gxeDocument.isViewOnly ? c || (d = this._findViewSection(e)) && new t({
                            gxeDocument: b.gxeDocument,
                            xmin: g.getInputValue(),
                            ymin: l.getInputValue(),
                            xmax: h.getInputValue(),
                            ymax: k.getInputValue()
                        }, q.create("div", {}, d)) : c && (b = new s({
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
                        }), b.show())
                    }
                }
            }
        }
    })
});