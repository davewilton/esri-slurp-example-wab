//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../../kernel", "../GraphicsLayer", "../../geometry/Extent", "../../geometry/Point", "../../geometry/Polygon"], function(B, E, F, G, C, z, D, A) {
    return B(C, {
        declaredClass: "esri.layers.labelLayerUtils.StaticLabel",
        constructor: function() {
            this._preparedLabels = [];
            this._placedLabels = [];
            this._extent = null;
            this._ymax = this._ymin = this._xmax = this._xmin = 0;
            this._scale = 1;
            this._LINE_STEP_CONST = 1.5;
            this._POLYGON_X_STEP_CONST = 1;
            this._POLYGON_Y_STEP_CONST = 0.75
        },
        setMap: function(b,
            a) {
            this._labelLayer = a;
            this._map = b;
            this._xmin = b.extent.xmin;
            this._xmax = b.extent.xmax;
            this._ymin = b.extent.ymin;
            this._ymax = b.extent.ymax;
            this._scale = (this._xmax - this._xmin) / b.width
        },
        _process: function(b) {
            var a, d, f, c, g, k, e, h, n;
            this._preparedLabels = b;
            this._placedLabels = [];
            for (b = this._preparedLabels.length - 1; 0 <= b; b--) {
                a = this._preparedLabels[b];
                g = a.labelWidth;
                k = a.labelHeight;
                h = (e = a.options) && e.lineLabelPlacement ? e.lineLabelPlacement : "PlaceAtCenter";
                n = e && e.lineLabelPosition ? e.lineLabelPosition : "Above";
                d = e &&
                    e.labelRotation ? e.labelRotation : !0;
                f = a.angle * (Math.PI / 180);
                c = e && e.howManyLabels ? e.howManyLabels : "OneLabel";
                var m = [];
                if ("point" === a.geometry.type) this._generatePointPositions(a.geometry.x, a.geometry.y, a.text, f, g, k, a.symbolWidth, a.symbolHeight, e, m);
                else if ("multipoint" === a.geometry.type)
                    for (d = 0; d < a.geometry.points.length; d++) this._generatePointPositions(a.geometry.points[d][0], a.geometry.points[d][1], a.text, f, g, k, a.symbolWidth, a.symbolHeight, e, m);
                else if ("polyline" === a.geometry.type)
                    if ("PlaceAtStart" ===
                        h) this._generateLinePositionsPlaceAtStart(a.geometry, !0, a.text, g, k, 2 * a.symbolHeight + k, h, n, d, m);
                    else if ("PlaceAtEnd" === h) this._generateLinePositionsPlaceAtEnd(a.geometry, !0, a.text, g, k, 2 * a.symbolHeight + k, h, n, d, m);
                else {
                    e = [];
                    var l = a.geometry.getExtent(),
                        p = this._map.extent;
                    if (l.getWidth() < g * this._scale && l.getHeight() < g * this._scale) continue;
                    else 0.5 * l.getWidth() < p.getWidth() && 0.5 * l.getHeight() < p.getHeight() ? (p = 0.1 * Math.min(this._map.width, this._map.height) * this._scale, this._generateLinePositionsPlaceAtCenter(a.geometry, !1, p, a.text, g, k, 2 * a.symbolHeight + k, h, n, d, e)) : (p = this._LINE_STEP_CONST * Math.min(this._map.width, this._map.height) * this._scale, this._generateLinePositionsPlaceAtCenter(a.geometry, !0, p, a.text, g, k, 2 * a.symbolHeight + k, h, n, d, e));
                    this._postSorting(l, e, m)
                } else if ("polygon" === a.geometry.type)
                    for (d = 0; d < a.geometry.rings.length; d++) h = a.geometry.rings[d], A.prototype.isClockwise(h) && (n = this._calcRingExtent(h), n.xmax - n.xmin < 4 * g * this._scale && n.ymax - n.ymin < 4 * k * this._scale || this._generatePolygonPositionsForManyLabels(h,
                        a.geometry.spatialReference, a.text, f, g, k, m));
                for (d = 0; d < m.length && !(h = m[d].x, n = m[d].y, void 0 !== m[d].angle && (f = m[d].angle), e = this._findPlace(a, a.text, h, n, f, g, k), "OneLabel" === c && e && this._labelLayer._isWithinScreenArea(new D(h, n, a.geometry.spatialReference))); d++);
            }
            return this._placedLabels
        },
        _generatePointPositions: function(b, a, d, f, c, g, k, e, h, n) {
            d = h && h.pointPriorities ? h.pointPriorities : "AboveRight";
            c = (k + c) * this._scale;
            g = (e + g) * this._scale;
            switch (d.toLowerCase()) {
                case "aboveleft":
                    b -= c;
                    a += g;
                    break;
                case "abovecenter":
                    a +=
                        g;
                    break;
                case "aboveright":
                    b += c;
                    a += g;
                    break;
                case "centerleft":
                    b -= c;
                    break;
                case "centercenter":
                    break;
                case "centerright":
                    b += c;
                    break;
                case "belowleft":
                    b -= c;
                    a -= g;
                    break;
                case "belowcenter":
                    a -= g;
                    break;
                case "belowright":
                    b += c;
                    a -= g;
                    break;
                default:
                    return
            }
            n.push({
                x: b,
                y: a
            })
        },
        _generateLinePositionsPlaceAtStart: function(b, a, d, f, c, g, k, e, h, n) {
            k = f * this._scale;
            var m = this._LINE_STEP_CONST * Math.min(this._map.width, this._map.height) * this._scale,
                l, p, t, r, u, v, q, w;
            for (l = 0; l < b.paths.length; l++) {
                var s = b.paths[l],
                    y = k,
                    x = 0;
                for (p = 0; p <
                    s.length - 1; p++) t = s[p][0], r = s[p][1], u = s[p + 1][0], v = s[p + 1][1], q = u - t, w = v - r, q = Math.sqrt(q * q + w * w), x + q > y ? (x = this._generatePositionsOnLine(b.spatialReference, a, y, m, x, t, r, u, v, d, f, c, g, e, h, n), y = m) : x += q
            }
        },
        _generateLinePositionsPlaceAtEnd: function(b, a, d, f, c, g, k, e, h, n) {
            k = f * this._scale;
            var m = this._LINE_STEP_CONST * Math.min(this._map.width, this._map.height) * this._scale,
                l, p, t, r, u, v, q, w;
            for (l = 0; l < b.paths.length; l++) {
                var s = b.paths[l],
                    y = k,
                    x = 0;
                for (p = s.length - 2; 0 <= p; p--) t = s[p + 1][0], r = s[p + 1][1], u = s[p][0], v = s[p][1], q = u - t,
                    w = v - r, q = Math.sqrt(q * q + w * w), x + q > y ? (x = this._generatePositionsOnLine(b.spatialReference, a, y, m, x, t, r, u, v, d, f, c, g, e, h, n), y = m) : x += q
            }
        },
        _generateLinePositionsPlaceAtCenter: function(b, a, d, f, c, g, k, e, h, n, m) {
            var l, p, t, r, u, v, q, w;
            for (e = 0; e < b.paths.length; e++) {
                var s = b.paths[e];
                if (!(2 > s.length)) {
                    var y = 0;
                    for (l = 0; l < s.length - 1; l++) t = s[l][0], r = s[l][1], u = s[l + 1][0], v = s[l + 1][1], q = u - t, w = v - r, y += Math.sqrt(q * q + w * w);
                    var x = 0;
                    for (l = 0; l < s.length - 1; l++) {
                        t = s[l][0];
                        r = s[l][1];
                        u = s[l + 1][0];
                        v = s[l + 1][1];
                        q = u - t;
                        w = v - r;
                        q = Math.sqrt(q * q + w * w);
                        if (x + q > y / 2) break;
                        x += q
                    }
                    l == s.length - 1 && l--;
                    t = s[l][0];
                    r = s[l][1];
                    u = s[l + 1][0];
                    v = s[l + 1][1];
                    q = u - t;
                    w = v - r;
                    x = y / 2 - x;
                    w = Math.atan2(w, q);
                    q = t + x * Math.cos(w);
                    w = r + x * Math.sin(w);
                    t = this._angleAndShifts(t, r, u, v, k, h, n);
                    m.push({
                        x: q + t.shiftX,
                        y: w + t.shiftY,
                        angle: t.angle
                    });
                    var y = q,
                        z = w,
                        x = 0;
                    for (p = l; p < s.length - 1; p++) p == l ? (t = y, r = z) : (t = s[p][0], r = s[p][1]), u = s[p + 1][0], v = s[p + 1][1], q = u - t, w = v - r, q = Math.sqrt(q * q + w * w), x = x + q > d ? this._generatePositionsOnLine(b.spatialReference, a, d, d, x, t, r, u, v, f, c, g, k, h, n, m) : x + q;
                    x = 0;
                    for (p = l; 0 <= p; p--) p == l ? (t =
                        y, r = z) : (t = s[p + 1][0], r = s[p + 1][1]), u = s[p][0], v = s[p][1], q = u - t, w = v - r, q = Math.sqrt(q * q + w * w), x = x + q > d ? this._generatePositionsOnLine(b.spatialReference, a, d, d, x, t, r, u, v, f, c, g, k, h, n, m) : x + q
                }
            }
        },
        _generatePositionsOnLine: function(b, a, d, f, c, g, k, e, h, n, m, l, p, t, r, u) {
            n = Math.atan2(h - k, e - g);
            m = g;
            l = k;
            var v = m,
                q = l;
            do
                if (c = d - c, m += c * Math.cos(n), l += c * Math.sin(n), this._belongs(m, l, g, k, e, h)) c = this._angleAndShifts(g, k, e, h, p, t, r), d = m + c.shiftX, q = l + c.shiftY, a ? this._labelLayer._isWithinScreenArea(new z(d, q, d, q, b)) && u.push({
                    x: d,
                    y: q,
                    angle: c.angle
                }) : u.push({
                    x: d,
                    y: q,
                    angle: c.angle
                }), v = m, q = l, c = 0, d = f;
                else return b = e - v, h -= q, Math.sqrt(b * b + h * h);
            while (1)
        },
        _postSorting: function(b, a, d) {
            if (b && 0 < a.length) {
                var f = 0.5 * (b.xmin + b.xmax);
                b = 0.5 * (b.ymin + b.ymax);
                for (var c = a[0].x, g = a[0].y, k = Math.sqrt((c - f) * (c - f) + (g - b) * (g - b)), e = a[0].angle, h = 0; h < a.length; h++) {
                    var n = a[h].x,
                        m = a[h].y,
                        l = Math.sqrt((n - f) * (n - f) + (m - b) * (m - b));
                    l < k && (c = n, g = m, k = l, e = a[h].angle)
                }
                d.push({
                    x: c,
                    y: g,
                    angle: e
                })
            }
        },
        _belongs: function(b, a, d, f, c, g) {
            if (c == d && g == f) return !1;
            if (c > d) {
                if (b > c || b < d) return !1
            } else if (b <
                c || b > d) return !1;
            if (g > f) {
                if (a > g || a < f) return !1
            } else if (a < g || a > f) return !1;
            return !0
        },
        _angleAndShifts: function(b, a, d, f, c, g, k) {
            for (b = Math.atan2(f - a, d - b); b > Math.PI / 2;) b -= Math.PI;
            for (; b < -(Math.PI / 2);) b += Math.PI;
            f = Math.sin(b);
            var e = Math.cos(b);
            d = a = 0;
            "Above" == g && (a = c * f * this._scale, d = c * e * this._scale);
            "Below" == g && (a = -c * f * this._scale, d = -c * e * this._scale);
            c = [];
            c.angle = k ? -b : 0;
            c.shiftX = -a;
            c.shiftY = d;
            return c
        },
        _generatePolygonPositionsForManyLabels: function(b, a, d, f, c, g, k) {
            f = this._calcRingExtent(b);
            if (0.75 * (f.xmax -
                    f.xmin) > this._map.width * this._scale || 0.75 * (f.ymax - f.ymin) > this._map.height * this._scale) {
                var e = this._findCentroidForRing(b);
                g = this._map.width * this._scale < f.xmax - f.xmin ? this._POLYGON_X_STEP_CONST * this._map.width * this._scale : this._POLYGON_X_STEP_CONST * (f.xmax - f.xmin);
                c = this._map.height * this._scale < f.ymax - f.ymin ? this._POLYGON_Y_STEP_CONST * this._map.height * this._scale : this._POLYGON_Y_STEP_CONST * (f.ymax - f.ymin);
                var h = e[0] - Math.round((e[0] - f.xmin) / g) * g,
                    n = e[1] - Math.round((e[1] - f.ymin) / c) * c,
                    m, e = !0;
                for (m = n; m <
                    f.ymax; m += c)
                    if (e = !e, !(m < this._ymin || m > this._ymax))
                        for (n = h + (e ? 0 : g / 2); n < f.xmax; n += g) this._labelLayer._isWithinScreenArea(new z(n, m, n, m, a)) && this._isPointWithinRing(d, b, n, m) && k.push({
                            x: n,
                            y: m
                        })
            } else {
                e = this._findCentroidForRing(b);
                for (f = 0; 10 > f; f++)
                    if (c = e[0], h = e[1] + (f % 2 ? -1 : 1) * Math.floor(f / 2) * g * this._scale, this._labelLayer._isWithinScreenArea(new z(c, h, c, h, a)) && this._isPointWithinRing(d, b, c, h)) {
                        k.push({
                            x: c,
                            y: h
                        });
                        break
                    }
            }
        },
        _calcRingExtent: function(b) {
            var a, d;
            d = new z;
            for (a = 0; a < b.length - 1; a++) {
                var f = b[a][0],
                    c = b[a][1];
                if (void 0 === d.xmin || f < d.xmin) d.xmin = f;
                if (void 0 === d.ymin || c < d.ymin) d.ymin = c;
                if (void 0 === d.xmax || f > d.xmax) d.xmax = f;
                if (void 0 === d.ymax || c > d.ymax) d.ymax = c
            }
            return d
        },
        _isPointWithinPolygon: function(b, a, d, f) {
            var c;
            for (c = 0; c < a.rings.length; c++)
                if (this._isPointWithinRing(b, a.rings[c], d, f)) return !0;
            return !1
        },
        _isPointWithinRing: function(b, a, d, f) {
            var c, g, k, e, h = [],
                n = a.length;
            for (b = 0; b < n - 1; b++)
                if (c = a[b][0], g = a[b][1], k = a[b + 1][0], e = a[b + 1][1], !(c == k && g == e)) {
                    if (g == e)
                        if (f == g) h.push(c);
                        else continue;
                    c == k ?
                        (g < e && (f >= g && f < e) && h.push(c), g > e && (f <= g && f > e) && h.push(c)) : (g = (k - c) / (e - g) * (f - g) + c, c < k && (g >= c && g < k) && h.push(g), c > k && (g <= c && g > k) && h.push(g))
                }
            h.sort(function(a, b) {
                return a - b
            });
            for (b = 0; b < h.length - 1; b++)
                if (c = h[b], k = h[b + 1], d >= c && d < k)
                    if (b % 2) break;
                    else return !0;
            return !1
        },
        _findCentroidForRing: function(b) {
            for (var a = b.length, d = [0, 0], f = 0, c = b[0][0], g = b[0][1], k = 1; k < a - 1; k++) {
                var e = b[k][0],
                    h = b[k][1],
                    n = b[k + 1][0],
                    m = b[k + 1][1],
                    l = (e - c) * (m - g) - (n - c) * (h - g);
                d[0] += l * (c + e + n);
                d[1] += l * (g + h + m);
                f += l
            }
            d[0] /= 3 * f;
            d[1] /= 3 * f;
            return d
        },
        _findCentroidForFeature: function(b) {
            for (var a = 0, d = [0, 0], f = 0; f < b.rings.length; f++)
                for (var c = b.rings[f], g = c.length, k = c[0][0], e = c[0][1], h = 1; h < g - 1; h++) {
                    var n = c[h][0],
                        m = c[h][1],
                        l = c[h + 1][0],
                        p = c[h + 1][1],
                        t = (n - k) * (p - e) - (l - k) * (m - e);
                    d[0] += t * (k + n + l);
                    d[1] += t * (e + m + p);
                    a += t
                }
            d[0] /= 3 * a;
            d[1] /= 3 * a;
            return d
        },
        _findPlace: function(b, a, d, f, c, g, k) {
            if (isNaN(d) || isNaN(f)) return !1;
            for (var e = 0; e < this._placedLabels.length; e++) {
                var h = this._placedLabels[e].angle,
                    n = this._placedLabels[e].width * this._scale,
                    m = this._placedLabels[e].height *
                    this._scale,
                    l = this._placedLabels[e].x - d,
                    p = this._placedLabels[e].y - f;
                if (0 === c && 0 === h) {
                    if (this._findPlace2(-g * this._scale, -k * this._scale, g * this._scale, k * this._scale, l - n, p - m, l + n, p + m)) return !1
                } else {
                    var t = new z(-g * this._scale, -k * this._scale, g * this._scale, k * this._scale, null),
                        r = 0,
                        u = 1;
                    0 !== c && (r = Math.sin(c), u = Math.cos(c));
                    var v = l * u - p * r,
                        l = l * r + p * u,
                        h = h - c,
                        r = Math.sin(h),
                        u = Math.cos(h),
                        q = -n * u - -m * r,
                        p = -n * r + -m * u,
                        h = +n * u - -m * r,
                        w = +n * r + -m * u,
                        n = v + q,
                        m = l - p,
                        r = v + h,
                        u = l - w,
                        q = v - q,
                        p = l + p,
                        v = v - h,
                        l = l + w,
                        h = new A;
                    h.addRing([
                        [n, m],
                        [r, u],
                        [q, p],
                        [v, l],
                        [n, m]
                    ]);
                    if (t.intersects(h)) return !1
                }
            }
            for (; c > Math.PI / 2;) c -= Math.PI;
            for (; c < -(Math.PI / 2);) c += Math.PI;
            e = {};
            e.layer = b;
            e.text = a;
            e.angle = c;
            e.x = d;
            e.y = f;
            e.width = g;
            e.height = k;
            this._placedLabels.push(e);
            return !0
        },
        _findPlace2: function(b, a, d, f, c, g, k, e) {
            return (b >= c && b <= k || d >= c && d <= k || b <= c && d >= k) && (a >= g && a <= e || f >= g && f <= e || a <= g && f >= e) ? !0 : !1
        }
    })
});