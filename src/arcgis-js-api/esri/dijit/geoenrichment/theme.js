//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/Evented", "dojo/dom-class", "dojo/dom-construct", "./dom", "dojo/Deferred", "../../extend"], function(g, d, k, l, f, p, q, m, n) {
    function h(c, b) {
        for (var a in b)
            if (b.hasOwnProperty(a)) try {
                c[a] = b[a].constructor == Object ? h(c[a], b[a]) : b[a]
            } catch (e) {
                c[a] = b[a]
            }
            return c
    }
    var e = "common";
    d = new(d([l], {
        set: function(c, b) {
            this.change(c, e, b);
            e = b;
            this.emit("change")
        },
        get: function() {
            return e
        },
        load: function(c) {
            function b() {
                f && f.remove();
                a.resolve(d)
            }
            var a = new m,
                d = null,
                f = g.on("error",
                    b);
            g(["./themes/common/" + c], function(a) {
                d = k.clone(a);
                !e || "common" == e ? b() : g(["./themes/" + e + "/" + c], function(a) {
                    h(d, a);
                    b()
                })
            });
            return a.promise
        },
        change: function(c, b, a) {
            b && "common" != b && f.remove(c, b);
            a && "common" != a && f.add(c, a)
        }
    }));
    n("esri.dijit.geoenrichment.theme", d);
    return d
});