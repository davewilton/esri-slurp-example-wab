//>>built
define(["./kernel", "dojo/_base/connect", "dojo/_base/lang", "dojo/dom-style", "dojo/has"], function(r, n, s, p, q) {
    var d = {
        show: function(a) {
            if (a = d.getNode(a)) a.style.display = "block"
        },
        getNode: function(a) {
            return a && a.domNode || a
        },
        hide: function(a) {
            if (a = d.getNode(a)) a.style.display = "none"
        },
        toggle: function(a) {
            if (a = d.getNode(a)) a.style.display = "none" === a.style.display ? "block" : "none"
        },
        documentBox: 8 >= q("ie") ? {
            w: document.documentElement.clientWidth,
            h: document.documentElement.clientHeight
        } : {
            w: window.innerWidth,
            h: window.innerHeight
        },
        setScrollable: function(a) {
            if (a = this.getNode(a)) {
                var d = 0,
                    g = 0,
                    h = 0,
                    k = 0,
                    l = 0,
                    m = 0;
                return [n.connect(a, "ontouchstart", function(e) {
                    d = e.touches[0].screenX;
                    g = e.touches[0].screenY;
                    h = a.scrollWidth;
                    k = a.scrollHeight;
                    l = a.clientWidth;
                    m = a.clientHeight
                }), n.connect(a, "ontouchmove", function(e) {
                    e.preventDefault();
                    var f = a.firstChild;
                    f instanceof Text && (f = a.childNodes[1]);
                    var b = f._currentX || 0,
                        c = f._currentY || 0,
                        b = b + (e.touches[0].screenX - d);
                    0 < b ? b = 0 : 0 > b && Math.abs(b) + l > h && (b = -1 * (h - l));
                    f._currentX = b;
                    c += e.touches[0].screenY - g;
                    0 < c ? c = 0 : 0 > c && Math.abs(c) + m > k && (c = -1 * (k - m));
                    f._currentY = c;
                    p.set(f, {
                        "-webkit-transition-property": "-webkit-transform",
                        "-webkit-transform": "translate(" + b + "px, " + c + "px)"
                    });
                    d = e.touches[0].screenX;
                    g = e.touches[0].screenY
                })]
            }
        }
    };
    return d
});