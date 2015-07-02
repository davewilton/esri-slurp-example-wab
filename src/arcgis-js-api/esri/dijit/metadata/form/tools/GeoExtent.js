//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/fx", "dojo/dom-class", "dojo/dom-geometry", "dojo/dom-style", "dojo/has", "dojo/window", "./geoExtentUtil", "../../base/Templated", "dojo/text!./templates/GeoExtent.html", "dojo/i18n!../../nls/i18nBase", "../../../../map", "../../../../dijit/Geocoder", "../../../../toolbars/draw", "../../../../geometry/Extent", "../../../../geometry/webMercatorUtils", "../../../../kernel"], function(m, e, n, b, g, h, x, p, f, q, r, s, t, u, v, w, l, y) {
    return m([q], {
        _drawnExtent: null,
        _drawtb: null,
        _fitExtent: !1,
        _geocoder: null,
        _initialExtent: null,
        _map: null,
        dialogBroker: null,
        gxeDocument: null,
        i18nBase: s,
        templateString: r,
        basemap: "streets",
        wrapAround180: !1,
        xmin: null,
        ymin: null,
        xmax: null,
        ymax: null,
        postCreate: function() {
            this.inherited(arguments);
            this.okButton.disabled = !0;
            h.set(this.mapNode, "opacity", 0)
        },
        destroyRecursive: function() {
            this._geocoder && this._geocoder.destroyRecursive(!1);
            this._map && this._map.destroy();
            this.inherited(arguments)
        },
        initialize: function() {
            if (this.gxeDocument && this.gxeDocument.gxeContext) {
                this._initialExtent =
                    f.makeGeographicExtent(this.xmin, this.ymin, this.xmax, this.ymax);
                var a = this.gxeDocument.gxeContext,
                    k = this.id + "_map",
                    c = {
                        autoResize: !1,
                        wrapAround180: !1,
                        slider: !0,
                        logo: !0,
                        showAttribution: !0
                    };
                a.wrapAround180 && (c.wrapAround180 = a.wrapAround180);
                a.showMapLogo || (c.logo = !1);
                a.showMapAttribution || (c.showAttribution = !1);
                c.basemap = a.basemap ? a.basemap : "streets";
                var b = this._map = new t(k, c),
                    k = this.id + "_geocoder",
                    d = {
                        map: b
                    };
                a.arcgisGeocoder && (c.arcgisGeocoder = a.arcgisGeocoder);
                this._geocoder = new u(d, k);
                this._geocoder.startup();
                this.own(b.on("load", e.hitch(this, function() {
                    var a = null;
                    this._initialExtent ? (a = this._asWebMercatorExtent(this._initialExtent, !0), b.setExtent(a, this._fitExtent).then(e.hitch(this, function() {
                        this._addGraphic(this._asWebMercatorExtent(this._initialExtent, !1));
                        this._fadeIn()
                    }))) : this._fadeIn();
                    this._drawtb = new v(b, {
                        showTooltips: !1
                    });
                    this._onDrawClick();
                    this.own(this._drawtb.on("draw-end", e.hitch(this, function(a) {
                        a.geometry && (this._drawnExtent = new w(a.geometry.toJson()), this._addGraphic(a.geometry), this.okButton.disabled = !1)
                    })))
                })))
            }
        },
        _addGraphic: function(a) {
            this._map && a && f.addGraphic(this._map, a, !0)
        },
        _asGeographicExtent: function(a) {
            return l.webMercatorToGeographic(a)
        },
        _asWebMercatorExtent: function(a, b) {
            var c = a;
            b && (-170 <= c.xmin && 170 >= c.xmax && -80 <= c.ymin && 80 >= c.ymax) && (c = c.expand(1.05), this._fitExtent = !0);
            return l.geographicToWebMercator(c)
        },
        _fadeIn: function() {
            n.fadeIn({
                node: this.mapNode,
                onEnd: function() {}
            }).play()
        },
        _onCancelClick: function(a) {
            this.onCancelClick(a)
        },
        onCancelClick: function(a) {},
        _onDrawClick: function(a) {
            this._map &&
                this._drawtb && (b.remove(this.navigateButton, "current"), b.add(this.drawButton, "current"), b.remove(this.drawHint, "gxeDisplayNone"), this._drawtb.deactivate(), this._drawtb.activate("extent"), this._map.disableMapNavigation(), this._map.hideZoomSlider())
        },
        _onNavigateClick: function(a) {
            this._map && this._drawtb && (b.remove(this.drawButton, "current"), b.add(this.navigateButton, "current"), b.add(this.drawHint, "gxeDisplayNone"), this._drawtb.deactivate(), this._map.enableMapNavigation(), this._map.showZoomSlider())
        },
        _onOkClick: function(a) {
            a = null;
            this._drawnExtent && (a = this._asGeographicExtent(this._drawnExtent));
            this.onOkClick(a)
        },
        onOkClick: function(a) {},
        resize: function() {
            if (this.dialogBroker) {
                var a = p.getBox(this.ownerDocument),
                    b = g.getMarginBox(this.domNode),
                    c = g.getMarginBox(this.topNode),
                    e = g.getMarginBox(this.bottomNode),
                    d = b.l,
                    f = a.w - 100,
                    a = a.h - b.t - d - 50 - 80 - (c.h + e.h);
                50 > a && (a = 50);
                d = f - 2 * d;
                450 > d && (d = 450);
                1E3 < d && (d = 1E3);
                h.set(this.mapNode, "width", d + "px");
                h.set(this.mapNode, "height", a + "px");
                this._map && (this._map.resize(),
                    this._map.reposition())
            }
        }
    })
});