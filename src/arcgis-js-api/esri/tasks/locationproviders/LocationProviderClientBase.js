//>>built
define(["../../declare", "dojo/Deferred", "dojo/promise/all", "../../graphic", "./LocationProviderBase", "../../SpatialReference", "../../geometry/jsonUtils"], function(f, g, p, u, q, r, v) {
    var s = 100,
        t = 25;
    return f("esri.tasks.locationproviders.LocationProviderClientBase", q, {
        inSpatialReference: null,
        constructor: function(c) {
            this.inSpatialReference || (this.inSpatialReference = new r(4326))
        },
        _locate: function(c, k) {
            function l() {
                setTimeout(function() {
                    for (var f = +new Date + s, a = []; f > +new Date && d < c.length;) {
                        var h = c[d],
                            g = m.getGeometry(h);
                        (h.geometry = g) && a.push(h);
                        ++d
                    }
                    k.outSpatialReference ? n.push(m._project(a, k.outSpatialReference).then(function() {
                        b = b.concat(a);
                        e.progress(a)
                    })) : (b = b.concat(a), e.progress(a));
                    d < c.length ? l() : p(n).then(function() {
                        e.resolve(b)
                    })
                }, t)
            }
            var n = [],
                b = [],
                e = new g,
                m = this,
                d = 0;
            l();
            return e.promise
        }
    })
});