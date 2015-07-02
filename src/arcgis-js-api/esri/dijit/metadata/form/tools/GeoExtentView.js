//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/fx", "dojo/dom-class", "dojo/dom-style", "dojo/has", "./geoExtentUtil", "../../base/Templated", "dojo/text!./templates/GeoExtentView.html", "dojo/i18n!../../nls/i18nBase", "../../../../map", "../../../../geometry/Extent", "../../../../geometry/webMercatorUtils", "../../../../kernel"], function(h, d, k, q, c, r, f, l, m, n, p, s, g, t) {
    return h([l], {
        _fitExtent: !1,
        _initialExtent: null,
        _interval: null,
        _map: null,
        _wasInitialized: !1,
        gxeDocument: null,
        i18nBase: n,
        templateString: m,
        xmin: null,
        ymin: null,
        xmax: null,
        ymax: null,
        postCreate: function() {
            this.inherited(arguments);
            c.set(this.mapNode, "opacity", 0);
            if (this._initialExtent = f.makeGeographicExtent(this.xmin, this.ymin, this.xmax, this.ymax)) var a = null,
                e = this.domNode,
                a = this._interval = setInterval(d.hitch(this, function() {
                    !this._wasInitialized && 0 !== e.offsetHeight && (clearInterval(a), this._wasInitialized = !0, this.initialize())
                }), 500);
            else c.set(this.domNode, "display", "none")
        },
        destroyRecursive: function() {
            null !== this._interval && clearInterval(this._interval);
            this._map && this._map.destroy();
            this._map = null;
            this.inherited(arguments)
        },
        initialize: function() {
            if (this.gxeDocument && this.gxeDocument.gxeContext) {
                var a = this.gxeDocument.gxeContext,
                    e = this.id + "_map",
                    b = {
                        autoResize: !1,
                        wrapAround180: !1,
                        slider: !1,
                        logo: !0,
                        showAttribution: !0
                    };
                a.wrapAround180 && (b.wrapAround180 = !0);
                a.showMapLogo || (b.logo = !1);
                a.showMapAttribution || (b.showAttribution = !1);
                b.basemap = a.basemap ? a.basemap : "streets";
                var c = this._map = new p(e, b);
                this.own(c.on("load", d.hitch(this, function() {
                    var a = null;
                    this._initialExtent && (a = this._asWebMercatorExtent(this._initialExtent, !0), c.setExtent(a, this._fitExtent).then(d.hitch(this, function() {
                        this._addGraphic(this._asWebMercatorExtent(this._initialExtent, !1));
                        this._fadeIn()
                    })))
                })))
            }
        },
        _addGraphic: function(a) {
            this._map && a && f.addGraphic(this._map, a, !0)
        },
        _asGeographicExtent: function(a) {
            return g.webMercatorToGeographic(a)
        },
        _asWebMercatorExtent: function(a, c) {
            var b = a;
            c && (-170 <= b.xmin && 170 >= b.xmax && -80 <= b.ymin && 80 >= b.ymax) && (b = b.expand(1.05), this._fitExtent = !0);
            return g.geographicToWebMercator(b)
        },
        _fadeIn: function() {
            k.fadeIn({
                node: this.mapNode,
                onEnd: function() {}
            }).play()
        }
    })
});