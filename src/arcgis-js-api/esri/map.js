//>>built
define(["require", "dojo/_base/kernel", "dojo/_base/declare", "dojo/_base/connect", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/event", "dojo/on", "dojo/aspect", "dojo/dom", "dojo/dom-class", "dojo/dom-construct", "dojo/dom-geometry", "dojo/dom-style", "dijit/registry", "./kernel", "./config", "./sniff", "./lang", "./_coremap", "./MapNavigationManager"], function(v, K, L, A, p, r, B, C, M, D, g, E, N, O, P, w, F, h, s, Q, R) {
    var x = {
            up: "panUp",
            right: "panRight",
            down: "panDown",
            left: "panLeft"
        },
        G = {
            upperRight: "panUpperRight",
            lowerRight: "panLowerRight",
            lowerLeft: "panLowerLeft",
            upperLeft: "panUpperLeft"
        },
        e = A.connect,
        l = A.disconnect,
        m = E.create,
        q = O.set,
        y = p.hitch,
        t = N.getMarginBox,
        H = K.deprecated,
        z = p.mixin,
        I = 0;
    return L(Q, {
        declaredClass: "esri.Map",
        constructor: function(a, c) {
            z(this, {
                _slider: null,
                _navDiv: null,
                _mapParams: z({
                    attributionWidth: 0.45,
                    slider: !0,
                    nav: !1,
                    logo: !0,
                    sliderStyle: "small",
                    sliderPosition: "top-left",
                    sliderOrientation: "vertical",
                    autoResize: !0
                }, c || {})
            });
            z(this, {
                isDoubleClickZoom: !1,
                isShiftDoubleClickZoom: !1,
                isClickRecenter: !1,
                isScrollWheelZoom: !1,
                isPan: !1,
                isRubberBandZoom: !1,
                isKeyboardNavigation: !1,
                isPanArrows: !1,
                isZoomSlider: !1
            });
            p.isFunction(w._css) && (w._css = w._css(this._mapParams.force3DTransforms), this.force3DTransforms = this._mapParams.force3DTransforms);
            var b = h("esri-transforms") && h("esri-transitions");
            this.navigationMode = this._mapParams.navigationMode || b && "css-transforms" || "classic";
            "css-transforms" === this.navigationMode && !b && (this.navigationMode = "classic");
            this.fadeOnZoom = s.isDefined(this._mapParams.fadeOnZoom) ? this._mapParams.fadeOnZoom : "css-transforms" === this.navigationMode;
            "css-transforms" !== this.navigationMode && (this.fadeOnZoom = !1);
            this.setMapCursor("default");
            this.smartNavigation = c && c.smartNavigation;
            if (!s.isDefined(this.smartNavigation) && h("mac") && !h("esri-touch") && !h("esri-pointer") && !(3.5 >= h("ff"))) {
                var d = navigator.userAgent.match(/Mac\s+OS\s+X\s+([\d]+)(\.|\_)([\d]+)\D/i);
                d && (s.isDefined(d[1]) && s.isDefined(d[3])) && (b = parseInt(d[1], 10), d = parseInt(d[3], 10), this.smartNavigation = 10 < b || 10 === b && 6 <= d)
            }
            this.showAttribution = s.isDefined(this._mapParams.showAttribution) ?
                this._mapParams.showAttribution : !0;
            this._onLoadHandler_connect = e(this, "onLoad", this, "_onLoadInitNavsHandler");
            var k = m("div", {
                "class": "esriControlsBR" + (this._mapParams.nav ? " withPanArrows" : "")
            }, this.root);
            if (this.showAttribution)
                if (b = p.getObject("esri.dijit.Attribution", !1)) this._initAttribution(b, k);
                else {
                    var J = I++,
                        f = this;
                    this._rids && this._rids.push(J);
                    v(["./dijit/Attribution"], function(a) {
                        var b = f._rids ? r.indexOf(f._rids, J) : -1; - 1 !== b && (f._rids.splice(b, 1), f._initAttribution(a, k))
                    })
                }
            this._mapParams.logo &&
                (b = {}, 6 === h("ie") && (b.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled\x3d'true', sizingMethod\x3d'crop', src\x3d'" + v.toUrl("./images/map/logo-med.png") + "')"), this._ogol = m("div", {
                    style: b
                }, k), this._setLogoSize(), this._onMapResizeLogo_connect = e(this, "onResize", this, "_setLogoSize"), h("esri-touch") || (this._ogol_connect = e(this._ogol, "onclick", this, "_openLogoLink")));
            this.navigationManager = new R(this);
            c && c.basemap && (this._onLoadFix = !0, this.setBasemap(c.basemap), this._onLoadFix = !1);
            if (this.autoResize =
                this._mapParams.autoResize) b = this._getEnclosingResizableWidget(this.container) || window, d = y(this, this.resize), this._rszSignal = C.pausable(b, "resize", d), this._oriSignal = C.pausable(window, "orientationchange", d), M.after(b, "resize", d, !0)
        },
        _getEnclosingResizableWidget: function(a) {
            var c = P.getEnclosingWidget(a);
            return !c ? c : c.resize ? c : this._getEnclosingResizableWidget(a.parentNode)
        },
        _setLogoSize: function() {
            this._ogol && (25E4 > this.root.clientWidth * this.root.clientHeight ? (g.remove(this._ogol, "logo-med"), g.add(this._ogol,
                "logo-sm")) : (g.remove(this._ogol, "logo-sm"), g.add(this._ogol, "logo-med")))
        },
        _initAttribution: function(a, c) {
            var b = m("span", {
                "class": "esriAttribution"
            }, c, "first");
            q(b, "maxWidth", Math.floor(this.width * this._mapParams.attributionWidth) + "px");
            this._connects.push(e(b, "onclick", function() {
                g.contains(this, "esriAttributionOpen") ? g.remove(this, "esriAttributionOpen") : this.scrollWidth > this.clientWidth && g.add(this, "esriAttributionOpen")
            }));
            this.attribution = new a({
                map: this
            }, b)
        },
        _cleanUp: function() {
            this.disableMapNavigation();
            this.navigationManager.destroy();
            var a = this._slider;
            a && (a.destroy && !a._destroyed) && a.destroy();
            var a = this._navDiv,
                c = this.attribution;
            a && E.destroy(a);
            c && c.destroy();
            this._connects.push(this._slider_connect, this._ogol_connect, this._rszSignal, this._oriSignal);
            r.forEach(this._connects, l);
            this.attribution = this.navigationManager = this._rids = this._connects = this._slider_connect = this._ogol_connect = this._rszSignal = this._oriSignal = null;
            this.inherited("_cleanUp", arguments)
        },
        _isPanningOrZooming: function() {
            return this.__panning ||
                this.__zooming
        },
        _canZoom: function(a) {
            var c = this.getLevel();
            return !this.__tileInfo || !(c === this.getMinZoom() && 0 > a || c === this.getMaxZoom() && 0 < a)
        },
        _onLoadInitNavsHandler: function() {
            this.enableMapNavigation();
            this._createNav();
            if ("small" === this._mapParams.sliderStyle || !this._createSlider) this._createSimpleSlider();
            else if (this._mapParams.slider) {
                var a = -1 !== this._getSliderClass(!0).indexOf("Horizontal"),
                    a = [a ? "dijit.form.HorizontalSlider" : "dijit.form.VerticalSlider", a ? "dijit.form.HorizontalRule" : "dijit.form.VerticalRule",
                        a ? "dijit.form.HorizontalRuleLabels" : "dijit.form.VerticalRuleLabels"
                    ];
                if (r.some(a, function(a) {
                        return !p.getObject(a, !1)
                    })) {
                    var a = r.map(a, function(a) {
                            return a.replace(/\./g, "/")
                        }),
                        c = I++,
                        b = this;
                    this._rids && this._rids.push(c);
                    v(a, function() {
                        var a = b._rids ? r.indexOf(b._rids, c) : -1; - 1 !== a && (b._rids.splice(a, 1), b._createSlider.apply(b, arguments))
                    })
                } else a = r.map(a, function(a) {
                    return p.getObject(a, !1)
                }), this._createSlider.apply(this, a)
            }
            l(this._onLoadHandler_connect)
        },
        _createNav: function() {
            if (this._mapParams.nav) {
                var a,
                    c, b, d = g.add,
                    k = this.id;
                this._navDiv = m("div", {
                    id: k + "_navdiv"
                }, this.root);
                d(this._navDiv, "navDiv");
                var h = this.width / 2,
                    f = this.height / 2,
                    n;
                for (b in x) c = x[b], a = m("div", {
                    id: k + "_pan_" + b
                }, this._navDiv), d(a, "fixedPan " + c), "up" === b || "down" === b ? (n = parseInt(t(a).w, 10) / 2, q(a, {
                    left: h - n + "px",
                    zIndex: 30
                })) : (n = parseInt(t(a).h, 10) / 2, q(a, {
                    top: f - n + "px",
                    zIndex: 30
                })), this._connects.push(e(a, "onclick", y(this, this[c])));
                this._onMapResizeNavHandler_connect = e(this, "onResize", this, "_onMapResizeNavHandler");
                for (b in G) c = G[b], a =
                    m("div", {
                        id: k + "_pan_" + b,
                        style: {
                            zIndex: 30
                        }
                    }, this._navDiv), d(a, "fixedPan " + c), this._connects.push(e(a, "onclick", y(this, this[c])));
                this.isPanArrows = !0
            }
        },
        _onMapResizeNavHandler: function(a, c, b) {
            a = this.id;
            c /= 2;
            b /= 2;
            var d = D.byId,
                k, e, f;
            for (k in x) e = d(a + "_pan_" + k), "up" === k || "down" === k ? (f = parseInt(t(e).w, 10) / 2, q(e, "left", c - f + "px")) : (f = parseInt(t(e).h, 10) / 2, q(e, "top", b - f + "px"))
        },
        _createSimpleSlider: function() {
            if (this._mapParams.slider) {
                var a = this._slider = m("div", {
                        id: this.id + "_zoom_slider",
                        "class": this._getSliderClass(),
                        style: {
                            zIndex: 30
                        }
                    }),
                    c = h("esri-touch") && !h("ff") ? "touchstart" : h("esri-pointer") ? navigator.msPointerEnabled ? "MSPointerDown" : "pointerdown" : "onclick",
                    b = m("div", {
                        "class": "esriSimpleSliderIncrementButton"
                    }, a),
                    d = m("div", {
                        "class": "esriSimpleSliderDecrementButton"
                    }, a);
                this._incButton = b;
                this._decButton = d;
                this._simpleSliderZoomHandler(null, null, null, this.getLevel());
                b.innerHTML = "\x3cspan\x3e+\x3c/span\x3e";
                d.innerHTML = "\x3cspan\x3e\x26ndash;\x3c/span\x3e";
                8 > h("ie") && g.add(d, "dj_ie67Fix");
                this._connects.push(e(b,
                    c, this, this._simpleSliderChangeHandler));
                this._connects.push(e(d, c, this, this._simpleSliderChangeHandler));
                "touchstart" == c && (this._connects.push(e(b, "onclick", this, this._simpleSliderChangeHandler)), this._connects.push(e(d, "onclick", this, this._simpleSliderChangeHandler)));
                (-1 < this.getMaxZoom() || -1 < this.getMinZoom()) && this._connects.push(e(this, "onZoomEnd", this, this._simpleSliderZoomHandler));
                10 > h("ie") && D.setSelectable(a, !1);
                this.root.appendChild(a);
                this.isZoomSlider = !0
            }
        },
        _simpleSliderChangeHandler: function(a) {
            B.stop(a);
            a = -1 !== a.currentTarget.className.indexOf("IncrementButton") ? !0 : !1;
            this._extentUtil({
                numLevels: a ? 1 : -1
            })
        },
        _simpleSliderZoomHandler: function(a, c, b, d) {
            var e;
            a = this._incButton;
            c = this._decButton; - 1 < d && d === this.getMaxZoom() ? e = a : -1 < d && d === this.getMinZoom() && (e = c);
            e ? (g.add(e, "esriSimpleSliderDisabledButton"), g.remove(e === a ? c : a, "esriSimpleSliderDisabledButton")) : (g.remove(a, "esriSimpleSliderDisabledButton"), g.remove(c, "esriSimpleSliderDisabledButton"))
        },
        _getSliderClass: function(a) {
            a = a ? "Large" : "Simple";
            var c =
                this._mapParams.sliderOrientation,
                b = this._mapParams.sliderPosition || "",
                c = c && "horizontal" === c.toLowerCase() ? "esri" + a + "SliderHorizontal" : "esri" + a + "SliderVertical";
            if (b) switch (b.toLowerCase()) {
                case "top-left":
                    b = "esri" + a + "SliderTL";
                    break;
                case "top-right":
                    b = "esri" + a + "SliderTR";
                    break;
                case "bottom-left":
                    b = "esri" + a + "SliderBL";
                    break;
                case "bottom-right":
                    b = "esri" + a + "SliderBR"
            }
            return "esri" + a + "Slider " + c + " " + b
        },
        _createSlider: function(a, c, b) {
            if (this._mapParams.slider) {
                var d = m("div", {
                            id: this.id + "_zoom_slider"
                        },
                        this.root),
                    k = F.defaults.map,
                    g = this._getSliderClass(!0),
                    f = -1 !== g.indexOf("Horizontal"),
                    n = this.getNumLevels();
                if (0 < n) {
                    var l, p, u = this._mapParams.sliderLabels,
                        s = !!u;
                    if (k = !1 !== u) {
                        var t = f ? "bottomDecoration" : "rightDecoration";
                        if (!u) {
                            u = [];
                            for (f = 0; f < n; f++) u[f] = ""
                        }
                        r.forEach([{
                            "class": "esriLargeSliderTicks",
                            container: t,
                            count: n,
                            dijitClass: c
                        }, {
                            "class": s && "esriLargeSliderLabels",
                            container: t,
                            count: n,
                            labels: u,
                            dijitClass: b
                        }], function(a) {
                            var b = m("div"),
                                e = a.dijitClass;
                            delete a.dijitClass;
                            d.appendChild(b);
                            e === c ? l = new e(a,
                                b) : p = new e(a, b)
                        })
                    }
                    a = this._slider = new a({
                        id: d.id,
                        "class": g,
                        minimum: this.getMinZoom(),
                        maximum: this.getMaxZoom(),
                        discreteValues: n,
                        value: this.getLevel(),
                        clickSelect: !0,
                        intermediateChanges: !0,
                        style: "z-index:30;"
                    }, d);
                    a.startup();
                    k && (l.startup(), p.startup());
                    this._slider_connect = e(a, "onChange", this, "_onSliderChangeHandler");
                    this._connects.push(e(this, "onExtentChange", this, "_onExtentChangeSliderHandler"));
                    this._connects.push(e(a._movable, "onFirstMove", this, "_onSliderMoveStartHandler"))
                } else {
                    a = this._slider =
                        new a({
                            id: d.id,
                            "class": g,
                            minimum: 0,
                            maximum: 2,
                            discreteValues: 3,
                            value: 1,
                            clickSelect: !0,
                            intermediateChanges: k.sliderChangeImmediate,
                            style: "height:50px; z-index:30;"
                        }, d);
                    b = a.domNode.firstChild.childNodes;
                    for (f = 1; 3 >= f; f++) q(b[f], "visibility", "hidden");
                    a.startup();
                    this._slider_connect = e(a, "onChange", this, "_onDynSliderChangeHandler");
                    this._connects.push(e(this, "onExtentChange", this, "_onExtentChangeDynSliderHandler"))
                }
                b = a.decrementButton;
                a.incrementButton.style.outline = "none";
                b.style.outline = "none";
                a.sliderHandle.style.outline =
                    "none";
                a._onKeyPress = function() {};
                if (a = a._movable) {
                    var v = a.onMouseDown;
                    a.onMouseDown = function(a) {
                        9 > h("ie") && 1 !== a.button || v.apply(this, arguments)
                    }
                }
                this.isZoomSlider = !0
            }
        },
        _onSliderMoveStartHandler: function() {
            l(this._slider_connect);
            l(this._slidermovestop_connect);
            this._slider_connect = e(this._slider, "onChange", this, "_onSliderChangeDragHandler");
            this._slidermovestop_connect = e(this._slider._movable, "onMoveStop", this, "_onSliderMoveEndHandler")
        },
        _onSliderChangeDragHandler: function(a) {
            this._extentUtil({
                targetLevel: a
            })
        },
        _onSliderMoveEndHandler: function() {
            l(this._slider_connect);
            l(this._slidermovestop_connect)
        },
        _onSliderChangeHandler: function(a) {
            this.setLevel(a)
        },
        _updateSliderValue: function(a, c) {
            l(this._slider_connect);
            var b = this._slider,
                d = b._onChangeActive;
            b._onChangeActive = !1;
            b.set("value", a);
            b._onChangeActive = d;
            this._slider_connect = e(b, "onChange", this, c)
        },
        _onExtentChangeSliderHandler: function(a, c, b, d) {
            l(this._slidermovestop_connect);
            this._updateSliderValue(d.level, "_onSliderChangeHandler")
        },
        _onDynSliderChangeHandler: function(a) {
            this._extentUtil({
                numLevels: 0 <
                    a ? 1 : -1
            })
        },
        _onExtentChangeDynSliderHandler: function() {
            this._updateSliderValue(1, "_onDynSliderChangeHandler")
        },
        _openLogoLink: function(a) {
            window.open(F.defaults.map.logoLink, "_blank");
            B.stop(a)
        },
        enableMapNavigation: function() {
            this.navigationManager.enableNavigation()
        },
        disableMapNavigation: function() {
            this.navigationManager.disableNavigation()
        },
        enableDoubleClickZoom: function() {
            this.isDoubleClickZoom || (this.navigationManager.enableDoubleClickZoom(), this.isDoubleClickZoom = !0)
        },
        disableDoubleClickZoom: function() {
            this.isDoubleClickZoom &&
                (this.navigationManager.disableDoubleClickZoom(), this.isDoubleClickZoom = !1)
        },
        enableShiftDoubleClickZoom: function() {
            this.isShiftDoubleClickZoom || (H(this.declaredClass + ": Map.(enable/disable)ShiftDoubleClickZoom deprecated. Shift-Double-Click zoom behavior will not be supported.", null, "v2.0"), this.navigationManager.enableShiftDoubleClickZoom(), this.isShiftDoubleClickZoom = !0)
        },
        disableShiftDoubleClickZoom: function() {
            this.isShiftDoubleClickZoom && (H(this.declaredClass + ": Map.(enable/disable)ShiftDoubleClickZoom deprecated. Shift-Double-Click zoom behavior will not be supported.",
                null, "v2.0"), this.navigationManager.disableShiftDoubleClickZoom(), this.isShiftDoubleClickZoom = !1)
        },
        enableClickRecenter: function() {
            this.isClickRecenter || (this.navigationManager.enableClickRecenter(), this.isClickRecenter = !0)
        },
        disableClickRecenter: function() {
            this.isClickRecenter && (this.navigationManager.disableClickRecenter(), this.isClickRecenter = !1)
        },
        enablePan: function() {
            this.isPan || (this.navigationManager.enablePan(), this.isPan = !0)
        },
        disablePan: function() {
            this.isPan && (this.navigationManager.disablePan(),
                this.isPan = !1)
        },
        enableRubberBandZoom: function() {
            this.isRubberBandZoom || (this.navigationManager.enableRubberBandZoom(), this.isRubberBandZoom = !0)
        },
        disableRubberBandZoom: function() {
            this.isRubberBandZoom && (this.navigationManager.disableRubberBandZoom(), this.isRubberBandZoom = !1)
        },
        enableKeyboardNavigation: function() {
            this.isKeyboardNavigation || (this.navigationManager.enableKeyboardNavigation(), this.isKeyboardNavigation = !0)
        },
        disableKeyboardNavigation: function() {
            this.isKeyboardNavigation && (this.navigationManager.disableKeyboardNavigation(),
                this.isKeyboardNavigation = !1)
        },
        enableScrollWheelZoom: function() {
            this.isScrollWheelZoom || (this.navigationManager.enableScrollWheelZoom(), this.isScrollWheelZoom = !0)
        },
        disableScrollWheelZoom: function() {
            this.isScrollWheelZoom && (this.navigationManager.disableScrollWheelZoom(), this.isScrollWheelZoom = !1)
        },
        showPanArrows: function() {
            this._navDiv && (this._navDiv.style.display = "block", this.isPanArrows = !0)
        },
        hidePanArrows: function() {
            this._navDiv && (this._navDiv.style.display = "none", this.isPanArrows = !1)
        },
        showZoomSlider: function() {
            this._slider &&
                (q(this._slider.domNode || this._slider, "visibility", "visible"), this.isZoomSlider = !0)
        },
        hideZoomSlider: function() {
            this._slider && (q(this._slider.domNode || this._slider, "visibility", "hidden"), this.isZoomSlider = !1)
        }
    })
});