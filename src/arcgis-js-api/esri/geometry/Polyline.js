//>>built
define(["dojo/_base/declare", "dojo/_base/array", "dojo/_base/lang", "dojo/has", "../kernel", "../lang", "../SpatialReference", "./Geometry", "./Point", "./Extent"], function(e, k, c, C, D, z, A, B, h, w) {
    var y = {
        type: "polyline",
        paths: null
    };
    e = e(B, {
        declaredClass: "esri.geometry.Polyline",
        constructor: function(a) {
            c.mixin(this, y);
            this.paths = [];
            this._path = 0;
            a && (c.isArray(a) ? this.paths = c.isArray(a[0][0]) ? a : [a] : a.paths ? c.mixin(this, a) : this.spatialReference = a, this.spatialReference && (this.spatialReference = new A(this.spatialReference)));
            this.verifySR()
        },
        addPath: function(a) {
            this.clearCache();
            this._path = this.paths.length;
            this.paths[this._path] = [];
            c.isArray(a[0]) ? k.forEach(a, this._addPointArr, this) : k.forEach(a, this._addPoint, this);
            return this
        },
        _addPointArr: function(a) {
            this.paths[this._path].push(a)
        },
        _addPoint: function(a) {
            this.paths[this._path].push([a.x, a.y])
        },
        _insertPoints: function(a, b) {
            this.clearCache();
            this._path = b;
            this.paths[this._path] || (this.paths[this._path] = []);
            k.forEach(a, this._addPoint, this)
        },
        _validateInputs: function(a, b) {
            return null !==
                a && void 0 !== a && (0 > a || a >= this.paths.length) || null !== b && void 0 !== a && (0 > b || b >= this.paths[a].length) ? !1 : !0
        },
        getPoint: function(a, b) {
            if (this._validateInputs(a, b)) return new h(this.paths[a][b], this.spatialReference)
        },
        setPoint: function(a, b, d) {
            if (this._validateInputs(a, b)) return this.clearCache(), this.paths[a][b] = [d.x, d.y], this
        },
        insertPoint: function(a, b, d) {
            if (this._validateInputs(a) && z.isDefined(b) && 0 <= b && b <= this.paths[a].length) return this.clearCache(), this.paths[a].splice(b, 0, [d.x, d.y]), this
        },
        removePath: function(a) {
            if (this._validateInputs(a,
                    null)) {
                this.clearCache();
                a = this.paths.splice(a, 1)[0];
                var b, d = a.length,
                    f = this.spatialReference;
                for (b = 0; b < d; b++) a[b] = new h(a[b], f);
                return a
            }
        },
        removePoint: function(a, b) {
            if (this._validateInputs(a, b)) return this.clearCache(), new h(this.paths[a].splice(b, 1)[0], this.spatialReference)
        },
        getExtent: function() {
            var a;
            a = this.getCacheValue("_extent");
            var b = this.getCacheValue("_partwise");
            if (a) return a = new w(a), a._partwise = b, a;
            a = this.paths;
            var d = a.length;
            if (d && a[0].length) {
                var f, g, c, e, l, m, n, k, h = e = a[0][0][0],
                    x = l =
                    a[0][0][1],
                    p = Math.min,
                    q = Math.max,
                    r = this.spatialReference,
                    b = [],
                    s, t, u, v;
                for (m = 0; m < d; m++) {
                    f = a[m];
                    s = t = f[0] && f[0][0];
                    u = v = f[0] && f[0][1];
                    k = f.length;
                    for (n = 0; n < k; n++) g = f[n], c = g[0], g = g[1], h = p(h, c), x = p(x, g), e = q(e, c), l = q(l, g), s = p(s, c), u = p(u, g), t = q(t, c), v = q(v, g);
                    b.push(new w({
                        xmin: s,
                        ymin: u,
                        xmax: t,
                        ymax: v,
                        spatialReference: r ? r.toJson() : null
                    }))
                }
                a = {
                    xmin: h,
                    ymin: x,
                    xmax: e,
                    ymax: l,
                    spatialReference: r ? r.toJson() : null
                };
                b = 1 < b.length ? b : null;
                this.setCacheValue("_extent", a);
                this.setCacheValue("_partwise", b);
                a = new w(a);
                a._partwise =
                    b;
                return a
            }
        },
        toJson: function() {
            var a = {
                    paths: c.clone(this.paths)
                },
                b = this.spatialReference;
            b && (a.spatialReference = b.toJson());
            return a
        }
    });
    e.defaultProps = y;
    return e
});