//>>built
define(["dojo/_base/sniff", "./kernel"], function(a, m) {
    var c = a("ff"),
        e = a("ie"),
        k = void 0 === e && 7 <= a("trident"),
        g = a("webkit"),
        f = a("opera"),
        l = a("chrome"),
        n = a("safari"),
        h = navigator.userAgent,
        d;
    (d = h.match(/(iPhone|iPad|CPU)\s+OS\s+(\d+\_\d+)/i)) && a.add("esri-iphone", parseFloat(d[2].replace("_", ".")));
    (d = h.match(/Android\s+(\d+\.\d+)/i)) && a.add("esri-android", parseFloat(d[1]));
    (d = h.match(/Fennec\/(\d+\.\d+)/i)) && a.add("esri-fennec", parseFloat(d[1]));
    0 <= h.indexOf("BlackBerry") && 0 <= h.indexOf("WebKit") && a.add("esri-blackberry",
        1);
    a.add("esri-touch", a("esri-iphone") || a("esri-android") || a("esri-blackberry") || 6 <= a("esri-fennec") || (c || g) && document.createTouch ? !0 : !1);
    a.add("esri-pointer", navigator.pointerEnabled || navigator.msPointerEnabled);
    m._getDOMAccessor = function(a) {
        var b = "";
        c ? b = "Moz" : g ? b = "Webkit" : e ? b = "ms" : f && (b = "O");
        return b + a.charAt(0).toUpperCase() + a.substr(1)
    };
    a.add("esri-phonegap", !!window.cordova);
    a.add("esri-cors", a("esri-phonegap") || "XMLHttpRequest" in window && "withCredentials" in new XMLHttpRequest);
    a.add("esri-file-upload",
        window.FormData && window.FileList ? !0 : !1);
    a.add("esri-workers", window.Worker ? !0 : !1);
    a.add("esri-transforms", k || 9 <= e || 3.5 <= c || 4 <= l || 3.1 <= n || 10.5 <= f || 3.2 <= a("esri-iphone") || 2.1 <= a("esri-android"));
    a.add("esri-transitions", k || 10 <= e || 4 <= c || 4 <= l || 3.1 <= n || 10.5 <= f || 3.2 <= a("esri-iphone") || 2.1 <= a("esri-android"));
    a.add("esri-transforms3d", k || 10 <= c || 12 <= l || 4 <= n || 3.2 <= a("esri-iphone") || 3 <= a("esri-android"));
    a.add("esri-url-encodes-apostrophe", function() {
        var a = window.document.createElement("a");
        a.href = "?'";
        return -1 <
            a.href.indexOf("?%27")
    });
    3 > a("esri-android") && (a.add("esri-transforms", !1, !1, !0), a.add("esri-transitions", !1, !1, !0), a.add("esri-transforms3d", !1, !1, !0));
    m._css = function(d) {
        var b = a("esri-transforms3d");
        if (void 0 !== d && null !== d) b = d;
        else if (b && (l || n && !a("esri-iphone"))) b = !1;
        var h = b ? "translate3d(" : "translate(",
            k = b ? l ? ",-1px)" : ",0px)" : ")",
            m = b ? "scale3d(" : "scale(",
            p = b ? ",1)" : ")",
            q = b ? "rotate3d(0,0,1," : "rotate(",
            r = b ? "matrix3d(" : "matrix(",
            s = b ? ",0,0," : ",",
            t = b ? ",0,0,0,0,1,0," : ",",
            u = b ? ",0,1)" : ")";
        return {
            names: {
                transition: g &&
                    "-webkit-transition" || c && "MozTransition" || f && "OTransition" || e && "msTransition" || "transition",
                transform: g && "-webkit-transform" || c && "MozTransform" || f && "OTransform" || e && "msTransform" || "transform",
                transformName: g && "-webkit-transform" || c && "-moz-transform" || f && "-o-transform" || e && "-ms-transform" || "transform",
                origin: g && "-webkit-transform-origin" || c && "MozTransformOrigin" || f && "OTransformOrigin" || e && "msTransformOrigin" || "transformOrigin",
                endEvent: g && "webkitTransitionEnd" || c && "transitionend" || f && "oTransitionEnd" ||
                    e && "MSTransitionEnd" || "transitionend"
            },
            translate: function(a, b) {
                return h + a + "px," + b + "px" + k
            },
            scale: function(a) {
                return m + a + "," + a + p
            },
            rotate: function(a) {
                return q + a + "deg)"
            },
            matrix: function(a) {
                return r + a.xx + "," + a.xy + s + a.yx + "," + a.yy + t + a.dx.toFixed(10) + (c ? "px," : ",") + a.dy.toFixed(10) + (c ? "px" : "") + u
            },
            getScaleFromMatrix: function(a) {
                if (!a) return 1;
                a = a.toLowerCase();
                var b = -1 < a.indexOf("matrix3d") ? "matrix3d(" : "matrix(";
                return Number(a.substring(b.length, a.indexOf(",")))
            }
        }
    };
    return a
});