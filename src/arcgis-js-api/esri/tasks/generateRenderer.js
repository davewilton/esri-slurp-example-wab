//>>built
define(["dojo/_base/array", "dojo/_base/lang", "dojo/has", "dojo/number", "dojo/_base/Color", "../kernel", "../lang", "../renderers/ClassBreaksRenderer", "../renderers/UniqueValueRenderer", "../symbols/SimpleMarkerSymbol", "../symbols/SimpleLineSymbol", "../symbols/SimpleFillSymbol"], function(t, v, O, u, q, P, E, x, F, y, z, A) {
    function w(a) {
        return t.filter(G, function(b) {
            return b.name === a
        })[0]
    }

    function B(a, b, e) {
        var g, c, d;
        e && (a = v.clone(a), a.reverse());
        e = function(a, b, e) {
            var f = [];
            if (2 == e) f = [a, b];
            else
                for (g = 0; g < e; g++) c = 1 / (e - 1) * g, d = new q([Math.round(a.r +
                    c * (b.r - a.r)), Math.round(a.g + c * (b.g - a.g)), Math.round(a.b + c * (b.b - a.b))]), f.push(d);
            return f
        };
        if (1 == b) a = [a[0]];
        else if (2 == a.length)
            if (2 == b) a = [a[0], a[1]];
            else {
                var k = new q(a[0]);
                a = new q(a[1]);
                a = e(k, a, b)
            } else {
            var l = a[0],
                k = a[1],
                f = a[2];
            5 == a.length && (k = a[2], f = a[4]);
            if (2 == b) a = [l, f];
            else if (3 == b) a = [new q(l), new q(k), new q(f)];
            else {
                var p = b;
                0 === b % 2 && (p = 2 * b - 1);
                a = e(new q(l), new q(k), Math.ceil(p / 2));
                e = e(new q(k), new q(f), Math.ceil(p / 2));
                e.splice(0, 1);
                a = a.concat(e);
                if (p != b) {
                    b = [];
                    for (g = 0; g < a.length; g++) 0 === g % 2 && b.push(a[g]);
                    a = b
                }
            }
        }
        return a
    }

    function H(a, b, e, g, c) {
        a = Math.max(g - a, b - g) / c / e;
        return 1 <= a ? 1 : 0.5 <= a ? 0.5 : 0.25
    }

    function I(a) {
        var b, e = 0;
        for (b = 0; b < a.length; b++) e += a[b];
        return e /= a.length
    }

    function J(a, b) {
        var e, g = 0,
            c;
        for (e = 0; e < a.length; e++) c = a[e], g += (c - b) * (c - b);
        g /= a.length;
        return Math.sqrt(g)
    }

    function s(a, b, e, g) {
        var c = 0,
            d = 0,
            k, l;
        for (k = b[a] + 1; k <= b[a + 1]; k++) l = g[k], c += e[k] * l, d += l;
        0 >= d && console.log("Exception in Natural Breaks calculation");
        c /= d;
        d = 0;
        for (k = b[a] + 1; k <= b[a + 1]; k++) d += g[k] * Math.pow(e[k] - c, 2);
        return {
            sbMean: c,
            sbSdcm: d
        }
    }

    function C(a, b, e, g) {
        var c = [],
            d = [],
            k = [],
            l = 0,
            f = [],
            p = [],
            h, n;
        for (h = 0; h < g; h++) n = s(h, a, b, e), f.push(n.sbMean), p.push(n.sbSdcm), l += p[h];
        for (var m = l, r = !0; r || l < m;) {
            r = !1;
            c = [];
            for (h = 0; h < g; h++) c.push(a[h]);
            for (h = 0; h < g; h++)
                for (d = a[h] + 1; d <= a[h + 1]; d++)
                    if (k = b[d], 0 < h && d != a[h + 1] && Math.abs(k - f[h]) > Math.abs(k - f[h - 1])) a[h] = d;
                    else if (h < g - 1 && a[h] != d - 1 && Math.abs(k - f[h]) > Math.abs(k - f[h + 1])) {
                a[h + 1] = d - 1;
                break
            }
            m = l;
            l = 0;
            d = [];
            k = [];
            for (h = 0; h < g; h++) d.push(f[h]), k.push(p[h]), n = s(h, a, b, e), f[h] = n.sbMean, p[h] = n.sbSdcm, l += p[h]
        }
        if (l > m)
            for (h =
                0; h < g; h++) a[h] = c[h], f[h] = d[h], p[h] = k[h];
        return {
            mean: f,
            sdcm: p
        }
    }

    function K(a, b, e) {
        var g = a.length,
            c, d = [];
        e > g && (e = g);
        for (c = 0; c < e; c++) d.push(Math.round(c * g / e - 1));
        d.push(g - 1);
        c = C(d, a, b, e);
        g = c.mean;
        c = c.sdcm;
        var k = e,
            l = 0,
            f = 0,
            p = 0,
            h = 0,
            n = !0,
            m, r;
        for (r = 0; 2 > r && n; r++) {
            0 == r && (n = !1);
            for (m = 0; m < k - 1; m++)
                for (; d[m + 1] + 1 != d[m + 2];)
                    if (d[m + 1] += 1, f = s(m, d, a, b), p = f.sbMean, l = f.sbSdcm, f = s(m + 1, d, a, b), h = f.sbMean, f = f.sbSdcm, l + f < c[m] + c[m + 1]) c[m] = l, c[m + 1] = f, g[m] = p, g[m + 1] = h, n = !0;
                    else {
                        d[m + 1] -= 1;
                        break
                    }
            for (m = k - 1; 0 < m; m--)
                for (; d[m] != d[m - 1] +
                    1;)
                    if (d[m] -= 1, f = s(m - 1, d, a, b), p = f.sbMean, l = f.sbSdcm, f = s(m, d, a, b), h = f.sbMean, f = f.sbSdcm, l + f < c[m - 1] + c[m]) c[m - 1] = l, c[m] = f, g[m - 1] = p, g[m] = h, n = !0;
                    else {
                        d[m] += 1;
                        break
                    }
        }
        n && C(d, a, b, e);
        return d
    }

    function D(a) {
        var b = [],
            e = [],
            g = Number.MIN_VALUE,
            c = 1,
            d = -1,
            k;
        for (k = 0; k < a.length; k++) a[k] == g ? (c++, e[d] = c) : null !== a[k] && (b.push(a[k]), g = a[k], c = 1, e.push(c), d++);
        return {
            uniqueValues: b,
            valueFrequency: e
        }
    }

    function L(a, b, e, g, c, d, k, l) {
        var f, p, h, n = [];
        if (!b) {
            b = [];
            for (f = 0; f < a.length; f++)
                if (p = a[f], h = p.attributes[e], g && (!c || "field" ===
                        c) ? h /= p.attributes[g] : "log" === c ? h = Math.log(h) / Math.log(10) : "percent-of-total" === c && l && (h *= 100, h /= l), E.isDefined(h)) {
                    if (isNaN(h)) return null;
                    b.push(parseFloat(h))
                }
        }
        if (0 == b.length) return [];
        b = b.sort(function(a, b) {
            return a - b
        });
        if ("equal-interval" == d.toLowerCase())
            if (b.length >= k) {
                g = b[0];
                a = b[b.length - 1];
                l = (a - g) / k;
                e = g;
                for (f = 1; f < k; f++) c = u.round(g + f * l, 6), n.push({
                    minValue: e,
                    maxValue: c
                }), e = c;
                n.push({
                    minValue: e,
                    maxValue: a
                })
            } else t.forEach(b, function(a) {
                n.push({
                    minValue: a,
                    maxValue: a
                })
            }, this);
        else if ("natural-breaks" ==
            d.toLowerCase()) {
            if (0 < b.length) {
                g = b[0];
                a = b[b.length - 1];
                b = D(b);
                d = K(b.uniqueValues, b.valueFrequency, k);
                e = g;
                for (f = 1; f < k; f++) b.uniqueValues.length > f && (c = u.round(b.uniqueValues[d[f]], 6), n.push({
                    minValue: e,
                    maxValue: c
                }), e = c);
                n.push({
                    minValue: e,
                    maxValue: a
                })
            }
        } else if ("quantile" == d.toLowerCase()) {
            if (0 < b.length)
                if (g = b[0], a = b[b.length - 1], b.length >= k && g !== a) {
                    e = g;
                    g = Math.ceil(b.length / k);
                    c = 0;
                    for (f = 1; f < k; f++) d = g + c - 1, d > b.length && (d = b.length - 1), 0 > d && (d = 0), n.push({
                        minValue: e,
                        maxValue: b[d]
                    }), e = b[d], c += g, g = Math.ceil((b.length -
                        c) / (k - f));
                    n.push({
                        minValue: e,
                        maxValue: a
                    })
                } else {
                    e = -1;
                    for (f = 0; f < b.length; f++) c = b[f], c != e && (e = c, n.push({
                        minValue: e,
                        maxValue: c
                    }), e = c)
                }
        } else if ("standard-deviation" == d.toLowerCase())
            if (d = I(b), f = J(b, d), 0 == f) n.push({
                minValue: b[0],
                maxValue: b[0]
            });
            else {
                g = b[0];
                a = b[b.length - 1];
                l = H(g, a, k, d, f);
                b = 0;
                l *= f;
                e = g;
                for (f = k; 1 <= f; f--) c = u.round(d - (f - 0.5) * l, 6), n.push({
                    minValue: e,
                    maxValue: c
                }), e = c, b++;
                c = u.round(d + 0.5 * l, 6);
                n.push({
                    minValue: e,
                    maxValue: c
                });
                e = c;
                b++;
                for (f = 1; f <= k; f++) c = b == 2 * k ? a : u.round(d + (f + 0.5) * l, 6), n.push({
                    minValue: e,
                    maxValue: c
                }), e = c, b++
            }
        return n
    }
    var M = {
            field: "esriNormalizeByField",
            log: "esriNormalizeByLog",
            "percent-of-total": "esriNormalizeByPercentOfTotal"
        },
        N = {
            "natural-breaks": "esriClassifyNaturalBreaks",
            "equal-interval": "esriClassifyEqualInterval",
            quantile: "esriClassifyQuantile",
            "standard-deviation": "esriClassifyStandardDeviation",
            "geometrical-interval": "esriClassifyGeometricalInterval"
        },
        G = [{
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQFQnwNSnwJRoARToAZVogVXowhXpAlYpQhapgpcpgxeqA5gqQ9hqhFjrBNlrhNnrxVprxdrsRltsxputBxxtBxztiB1uCF2uSN4uSV6uyd8vSh9vSl+viuAwC2DwC6EwTCGwTGHwjSIxDaKxjeMxTiNxjyOxj2Px0CTyUGUykSVzEWWzUeYzUmZzkubzkycz1Cd0VGf0FSg0Vai01ej1Ful1F2l1V+o1WGo1mOq1mes1mit12qv2W2w2nCx2XOy23W123m223643YC73YO73oa83om+3oy+35DB4ZPC4JbD4JjG4JrG4Z7I4aHJ4qTK4abM46nN46vO4q/P5LHQ5LPS5LbT5brV5rnU573X6L7Y58LZ6cTZ6sXb6cfd6sve7M3f7c/h79Li79Hh8NTk8djm89vn9d3p9dzo9uDq9uHr9+Pt+eXt+Oft++bu+eju+unv++vx/e7y/u/z/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF/G9xsAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAp0lEQVRIS2MoLioqLCzIz83Lyc7KTM9IS01NSUpOTIiPi42JjooMjwgLDQkOCgzw9/P18fby9HB3c3VxdnJ0dLC3s7WxtrK0MDczNTE2MjTQ19PV0dbS1FBXU1VRVlJUkJeTlZGWkpQQFxMVERYSFODn4+Xh5uLkYGdjZWFmZGJgIMtip4GyeMB8PGAWjwb1aKqmWT4eTdV0S1yjQT0a1MMvHw/lVA0A5Hsn8l6gwUsAAAAASUVORK5CYII\x3d",
            colors: [
                [239, 243, 255, 255],
                [189, 215, 231, 255],
                [107, 174, 214, 255],
                [49, 130, 189, 255],
                [8, 81, 156, 255]
            ],
            name: "Blues",
            url: "http://static.arcgis.com/images/ColorSets/Sequential/Single/Blues.png"
        }, {
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQFuKgFwKwJxLANyLQJ0LgR2MAV3MQd7MgZ6Mwh+NAl/NQmBNwuDOQyEOg2HOg6IOw6LPRCNPxKPQROSQxWURReWRReYRhmaSBqbSRydSx6fTSChTyGiUCOkUiWlUienVCmnVSupVy2rVzCsWDKuWjSuWTivWzqxXTyyXD+zXkK0X0S0YEa2YEm3YUy4Y0+4ZFK6ZVW7Z1a8aFq9aly+a2C/a2LAbGTCbmbCb2rDcW3Ec3DFdHLHdnTHd3fIeXrJenzLfH7MgIHNgoTOg4bQhYjQh4vRiYzSipDTjJPVjpXWkpjWk5rYlZvZmJ7amqDbm6Lcn6beoajeoqnfpa3gp67hqbHiq7LjrLXksLblsbnlsrvltb3nt77ouMLpvMTpvcbpv8jrwcnsxM3txs3tyNDuytHvy9Xwz9fw0Njx09ny1Nvy1t7y19/z2uD02+P13+L23eT24OX24+j35Or35er35uv45+z56AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF1mF4AAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAmklEQVRIS2MoLystKS4qzC/Iy83JzsrMSE9LTUlOSkyIj4uNiY6KjAgPCw0JDgoM8Pfz9fH28vRwd3N1cXZydLC3s7WxtrK0MDczNTE2MjTQ19PV0dbS1FBXU1VRVlJUkJeTlZGWkpQQFxMVERYSFODn4+Xh5uJk52BjZWFmYmRgGLV4NKhHE9dodhotQEaLzNFKYrRaHDktEAAguy3vIPRqYQAAAABJRU5ErkJggg\x3d\x3d",
            colors: [
                [237, 248, 233, 255],
                [186, 228, 179, 255],
                [116, 196, 118, 255],
                [49, 163, 84, 255],
                [0, 109, 44, 255]
            ],
            name: "Greens",
            url: "http://static.arcgis.com/images/ColorSets/Sequential/Single/Greens.png"
        }, {
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURSYmJicnJykpKSoqKiwsLC4uLi8vLzExMTMzMzU1NTg4ODo6Ojw8PD4+PkFBQUNDQ0VFRUhISEpKSk1NTU9PT1JSUlRUVFZWVlhYWFtbW11dXV9fX2FhYWNjY2VlZWdnZ2hoaGpqamxsbG5ubnBwcHFxcXNzc3V1dXZ2dnh4eHp6ent7e319fX9/f4CAgIKCgoSEhIWFhYeHh4mJiYqKioyMjI6Ojo+Pj5GRkZOTk5WVlZaWlpiYmJqampubm52dnZ+fn6GhoaOjo6SkpKampqioqKqqqqysrK6urq+vr7GxsbOzs7W1tbe3t7i4uLq6ury8vL6+vr+/v8HBwcPDw8XFxcbGxsjIyMrKysvLy83Nzc7OztDQ0NLS0tTU1NXV1dfX19nZ2dra2tzc3N7e3uDg4OHh4ePj4+Tk5Obm5ujo6Onp6evr6+zs7O3t7e/v7/Dw8PHx8fLy8vPz8/T09PX19fb29vf39wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL4u1joAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAmklEQVRIS2MoLystKS4qLMjPy83JzsrMSE9LTUlOSkyIj4uNiY6KjAgPCw0JDgoM8Pfz9fH28vRwd3N1cXZydLC3s7WxtrK0MDczNTE2MjTQ19PV0dbS1FBXU1VRVlJUkJeTlZGWkpQQFxMVERYSFODn4+Xh5uLkYGdjZWFmYmRgGLV4NKhHE9dodhotQEaLzNFKYrRaHDktEAAg4y3vhfnM7QAAAABJRU5ErkJggg\x3d\x3d",
            colors: [
                [247, 247, 247, 255],
                [204, 204, 204, 255],
                [150, 150, 150, 255],
                [99, 99, 99, 255],
                [37, 37, 37, 255]
            ],
            name: "Grays",
            url: "http://static.arcgis.com/images/ColorSets/Sequential/Single/Grays.png"
        }, {
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURao3AKw3Aas4Aa05ALE5ALM7ALc8Abs9ALk9Ab4+AMA+AMJBAMVBAMlDAM5FAc9GANRHANVIANhKANlLAdtMAN9NAONQAOFQAeVTAOhTAOlUAOpWAOtXAe1ZA+5aAvBcBPBfBvJhBvFgB/RjCPRlCfRnC/ZpDfZrDvhtEPhvEflwEvlyFvl0F/t2Gfp4Gvt6HPt8Hf1+If2AI/2CJP2EJ/6FKP6JKv+KK/6LLv+NMP+PM/6RNP+SN/+UOf+VPf+XPv6ZP/+bQ/+cRv+dSP+gTP+jUP+lVP+mVv+oWf+qWv6rXf+tYf+uZP6wZv+yav+za/+1bv+2cf64c/65dv+7ev69ff6+gP/Ag//BhP/Cif/Fjf/Gj//Ikv/Klv/MnP/Onf/RoP/Rpf7TqP/Vq//Ysf/ZtP7atv7cuf/evf7fwP/hxP7jyP/kyf/lzv/o0P7p1P/q1//r2v/s2//u3gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKQPJI0AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAmklEQVRIS2MoLiosyM/Py83JzsrMSE9LTUlOSkyIj4uNiY6KjAgPCw0JDgoM8Pfz9fH28vRwd3N1cXF2cnSwt7O1sbaytDA3MzUxNjI00NfT1dHW0tRQV1NVUVZUUpCXk5WRlpKUEBMXFREWEhTg5+Pl5eHm4mTnYGNlYWFmZGJgGLV4NKhHE9dodhotQEaLzNFKYrRaHDktEAD6ohiHxH0ErQAAAABJRU5ErkJggg\x3d\x3d",
            colors: [
                [254, 237, 222, 255],
                [253, 190, 133, 255],
                [253, 141, 60, 255],
                [230, 85, 13, 255],
                [166, 54, 3, 255]
            ],
            name: "Oranges",
            url: "http://static.arcgis.com/images/ColorSets/Sequential/Single/Oranges.png"
        }, {
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURVcjkVcmk1gkklkolVkqlFotllsul10wmV0zmV41m2A4m2A6nWE9nWJAn2RCoWRFomZHpGdKpGhOpWpQp2tTqWxWq2xZq25brHBdrnFgsHNisHNlsnVnsnZos3drs3hstHputntwtXxyt351uH92uYB3uoJ5uoR7vIZ9vIV8vYd+vYmAv4qCvoyEv4uGwIyHwZCIwZGJwpCLw5KNw5WOxJeQxJeTxpiRxZmVyJqWyJ6YyJ+ZyaGby6Gey6KczKOgy6agzKiizqmjz6ul0a2o0a6p0q+q0rGs1LKt1bSw1bWx1rez2Li02bq22by42by727+73L++3cPA38LC3sXC38fE4cjF4srH4svI48zK4s7M5M/N5dDO5tLQ5tPR59XT6NbU6djW69nY6tva7Nzb697d7d/e7uHf7ePh7+Ti8Ofl8unn8ujm8+ro8+zr8+7t9fDu9fLv9gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACFC72IAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAmklEQVRIS2MoLCgoyM/Py8vNzsnKzMxIT0tNSU5KTIiPi42JjoqMCA8LDQkOCgzw9/Pz9fH28vRwd3N1cXZydLC3tbOxtrK0MDM3NTE2MjTQ19PV0dbS0FRXU1VRVlJUkJeTlZGWkpQQFxMVERYSFODn4+Xh5uLkYGdjZWFmZGJgGLV4NKhHE9dodhotQEaLzNFKYrRaHDktEADl/ShjZ65IoQAAAABJRU5ErkJggg\x3d\x3d",
            colors: [
                [242, 240, 247, 255],
                [203, 201, 226, 255],
                [158, 154, 200, 255],
                [117, 107, 177, 255],
                [84, 39, 143, 255]
            ],
            name: "Purples",
            url: "http://static.arcgis.com/images/ColorSets/Sequential/Single/Purples.png"
        }, {
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURakQC6oRDKwRDbATDrITD7YUD7MUELoXELgWEbwXEcAZEcIaEsUdFMgdE8oeFM0fFs4gFdIiFdMjFtUjF9clF9knGdwoGd0pGuAqHOAsHeMvHuIuH+YzH+YxIOc0IOk2Ius4Iuo6I+w8Je4+Ju8/J+9BKPJEKfJHK/NILPRJLfVML/dOL/dQMPlSMvhTM/lWM/tYNftbN/tdOPxgOv5iPPxkPf5mP/9oQf9qQv9tRv9wSP9xSf5zSv91Tv94UP95U/98Vv9+V/+BWf+EW/+FYP+IYP+KZP6MZ/+Paf+RbP+Tbf6Wcf+Ydf6adv+deP+ffP+hf/+jgf+mhP6oh/+rif+sjP+vjv+wkf+ylP+0lf+2lv+6m/67nv++ov+/o/7Bpf/Dqf/Frf/Ir/7Ksv/Ntv7OuP/Ruv/Svf7Uwf7Yxf7Zx//cyf/czP/ez//f0P7h0f/i1P/j1//k2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVrB1IAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAmklEQVRIS2MoKiosyM/LzcnOyszISE9LTUlOSkyIj4uNiY6KjAgPCw0JDgoM8Pfz9fH28vRwd3N1cXZydLC3s7WxtrK0MDczNTE2MjTQ19PV0dbS1FBXU1VRVlJUkJeTkZWSlpQQFxMVERYSFODn4+Xh5ubiZOdgZWNhZmZiYmRgGLV4NKhHE9dodhotQEaLzNFKYrRaHDktEADnBBKDA4jPhQAAAABJRU5ErkJggg\x3d\x3d",
            colors: [
                [254, 229, 217, 255],
                [252, 174, 145, 255],
                [251, 106, 74, 255],
                [222, 45, 38, 255],
                [165, 15, 21, 255]
            ],
            name: "Reds",
            url: "http://static.arcgis.com/images/ColorSets/Sequential/Single/Reds.png"
        }, {
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQBtKgFuKwFwKwNyLQFzLgN1MAN2MQR3MgV6NAV9NgV+NweAOQiBOgiEPAiGPQqIPwuKQw2MRQ2PRQ6SSQ+TShGVTBGXThGZTxObUxScVBaeVhifWhmgWxuiXR2kXx6lYCCnZCGoZSOqaCaraiesayqsbiyucC6wdDCwdzKyeTWyejizfTm0fjy1gj63hEG3h0S4iUa6jUm6j0u6kE67kk+8lVO9l1W/m1e/nFvAnl3AoV/Co2PDp2TEqGfFqmnFrGvHrm/JsHHLsnTMtnfMt3rNu3zNvH7PvoLQwoXRxInTxorUx43VypDWzJPWzZXYz5jZ0ZvZ1J7b1qDd2KLd26be3aff3qrg4K3g4a/i47Hh47Pj5bbj5rjl6Lrm6b7n68Do6sLq7Mbp7cfq7snq78vs8c7t8NHu8tXw9Nnx9dzx9t/y9t3y9+Hz9+L0+OP1+ef1+Ob1+uj2+en3+uz3+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAziPmAAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAo0lEQVRIS2MoKSkuKijMz8vNzsnKzMhIT09LTUlOSkyIj4uNiY6KjAgPCw0JDgoM8Pfz9fH28vRwd3N1cXZydLC3s7WxtrK0MDczNTE2MjTQ19PV0dbS1FBXU1VRVlJUkJeTlZGWkpQQFxMVERYSFODn4+Xh5uLkYGdjZWFmYmRgQLE4c6AsHvXxaByPpurRfDxaco2W1aO1E7whMFof07BaBABcqSuN/1JadgAAAABJRU5ErkJggg\x3d\x3d",
            colors: [
                [237, 248, 251, 255],
                [178, 226, 226, 255],
                [102, 194, 164, 255],
                [44, 162, 95, 255],
                [0, 109, 44, 255]
            ],
            name: "BuGn",
            url: "http://static.arcgis.com/images/ColorSets/Sequential/Multi/BuGn.png"
        }, {
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURYMGfoMHf4MJgIMMgIQNgYUQg4QShIUUhoUXh4YaiYUei4YgjYUijoYlkIcnkocqlIYulIcxloc1mYg4mYg7m4g+nYhBn4lEoYlHoYlIoohMpIpQp4lRqIpUqIpWqYpZq4pbrIpdrotgsItisIpksYtms4lptItrtItttYtwt4l0t4lyuIt2uYt4uop6u4p7vIl/vIuBvomDv4qEwIqHwIqJwoqLw4mPw4qNxIqRxYmTxouXx4uVyI2ZyY2byo6fy4+dzJChzZKjzpKlz5Om0JWo0peq0pir05iu1Zmv1pux1puz152115+32aC42qK63KO826W+3KfA3qjB36nD3qvF4KzG4a7I4bDK47HL5LPN5LXN5bbR5rnU57jT6LzV6cDX6cDa68bb7MTb7cjd7srg7szi79Dj8dHl8NTo89bo9Nrr89jq9Nzt9d/u9eHw9+Tx9+Lx+Obz+ef0+ur1+ev2+uz3++34+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABiMTKYAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAmklEQVRIS2MoLystKS4qKMzPy83OycrMSE9LTUlKTkyIj42LiY6KjAgPCw0JDgoM8Pfz9fH28vRwd3N1cXZytHews7W2sbI0tzAzNTE2MjTQ19PV0dLW1FBXU1VRVlJUkJeTlZGWkpQQFxMVERYSFODn4+Xh5uLkYGdjZWFmYmRgGLV4NKhHE9dodhotQEaLzNFKYrRaHDktEAAgQy3vh51XnwAAAABJRU5ErkJggg\x3d\x3d",
            colors: [
                [237, 248, 251, 255],
                [179, 205, 227, 255],
                [140, 150, 198, 255],
                [136, 86, 167, 255],
                [129, 15, 124, 255]
            ],
            name: "BuPu",
            url: "http://static.arcgis.com/images/ColorSets/Sequential/Multi/BuPu.png"
        }, {
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQFnrwNqrwRrsAZtsgduswpvswxxtQ50thB2uBJ4uBN7uhZ+vRh+vBqBvB2Evx+GwCGIwiOLwiWNxCePxCqSxyyUxy6XxzCZyTSayjadyjifzDuiyzqhzD+lyz6kzEGnzUWpzUaqzEiszEmuzEuuzU2xy0+xzFGzzFK1zFa2zFe4y1i5ylu7y129yVy8ymG/yWLAyGTByGbDyGnEx2zGxmrFyG7IyHDJxXHKxnbLxHTLxXvOxHjOxX/Pwn3Pw5HXv5LYvpTZvZrbu5jYvZnavJ7bvKDbu6Hdu6beu6TdvKrfu63hu6/hvLPhurHhu7Xkurfku7nju7vlvb3mvL7nvYHSw4TSxIXUwYfUworVwYzVwY7WwMLov8TpwMbpwcfqwsvrxMzsx8/tydLtytPuzdXuztfw0Nnw09rx1N3x1d/z2OHz2eL02uP13eb13uf23+n34Or34+z45O355e345+756AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB2AYEAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAmklEQVRIS2MoLSkuKizIz8vNyc7KzEhPS01JTkpMiI+LjQkJDgoM8Pf18/H28vLwdHdzdXJxdnSwj46KjAgPC7W1s7axtLIwNzMxNTYyNNDX1dPR1tLUUFdTVVFWUlSQl5WTlpGSlBAXExURFhIU4Ofj5eHm4uRgZ2NlYWZiZGBgGLV4NKhHE9dodhotQEaLzNFKYrRaHDktEACuVyEzBHiHxAAAAABJRU5ErkJggg\x3d\x3d",
            colors: [
                [240, 249, 232, 255],
                [186, 228, 188, 255],
                [123, 204, 196, 255],
                [67, 162, 202, 255],
                [8, 104, 172, 255]
            ],
            name: "GnBu",
            url: "http://static.arcgis.com/images/ColorSets/Sequential/Multi/GnBu.png"
        }, {
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURbgCAbkDArgEA7kFBLwJBb0KBr8MB8APCcIRC8UUDMQWDccZEMkbEMseEM0hE88jFdEnFtMpGNYtGtcwHdkyH9o1H9w3Id07It8+IuFCJeNEJ+RGKedIKuZLLOhNLulQMOtSMOxTMe1XMu5YM+9bNfBeN/JgOfFiOPNkOvRnPPRqPPVrPfZtP/hvQfhxQfh0RPh2RPp4Rvl7SPt9Svx+S/uCS/6CTP2GTv+IUP6KUf+MU/+OVP+RVv+TWP+VWf+XWv+ZW/+bXf+eX/+gYP+hYf+kY/+mZP+pZv6rZ/+taf+vav+wa/+zbf+1bv64cP66cf+8df6+dv/AeP/Aef/De//FfP/HgP/Jgf/KhP7Mhf/Ph/7Pif/Rjf/Sj//Tkv/WlP/Yl//Zmv7anv/cov7epf/eqP/gqv/hrf/js//ktf/kt//nu//mvf/nwf/qxf/ryP/sy/7tz//u0v/w0//w1v/x1wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABVZPSYAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAmklEQVRIS2MoLS0pLiosKMjPy83JzsrMSE9LTUlOSkyIj4uNiY6KjAgPCw0JDgoM8Pfz9fH28vRwd3N1cXZydLC3s7WxtrK0MDczNTE2MjTQ19PV0dbS1FBXU1VRVlJUkJeTlZGWkpQQFxMVERYSFODn4+Xh5uLkYGdjZWFmYmRgGLV4NKhHE9dodhotQEaLzNFKYrRaHDktEAAI6i1Pk7ksEgAAAABJRU5ErkJggg\x3d\x3d",
            colors: [
                [254, 240, 217, 255],
                [253, 204, 138, 255],
                [252, 141, 89, 255],
                [227, 74, 51, 255],
                [179, 0, 0, 255]
            ],
            name: "OrRd",
            url: "http://static.arcgis.com/images/ColorSets/Sequential/Multi/OrRd.png"
        }, {
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQFbkAJckQJdkgRflgNhlwRimAVjmQZlmwdmnAhpoAlqoQlsowptpAtwpg1yqA90qg52qxB4rRJ6sRN8sxR/tRWAthiBuBiDuRqFuxyHvR2Ivh+KviGLvyONwSWNwiePwiiQwyyRxS+TxS6SxjOUxzWVxzuXyDiWyT6YykGZyUSayUebykmbykucy0+dy1OdzFWfzFqhy1ihzF6jzWKizmSjzmqlz2ek0Gum0HGoz3Cn0HSp0Xaq0Xmq0nys0n2t04Gv04Ov1Iax1Iqx1Y+z15G02JW22Zm32Zu42py52aK72qC626W83Ke+3aq/3qvA3a7B36/D3rLD37TE3rfF4LnG4b3J47/L48HL5MTL5cbO5cjO5MrQ5s3U58zS6NDV6dLX6tXY69fa7djb7Nvd7N3f7t7g79/h8OPi8OTj8eXl8efn8+nn9Oro8+vp9O3r9u7t9e/u9vHu9wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKXXUKMAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAp0lEQVRIS2MoKiwsyM/LzcnOysxIT0tNSU5KTIiPjYuJjoqMCA8LDQ0JDgoM8Pfz9fHy9vRwd3N1dXF2dnJ0sLeztbG2tLIwMzc1MTY0MtDX09XR1tLUUFNXVVFSVlSQl5OVkZaSlBAXExURFhIU4Ofj5eHm4uRgZ2NlYWZiZGBgwG9xGLrFbnSyeNTHo3E8mqpH8/FoyTVaVuOsFkdrJ7fR+pjspg8APNUaZ4VrFPMAAAAASUVORK5CYII\x3d",
            colors: [
                [241, 238, 246, 255],
                [189, 201, 225, 255],
                [116, 169, 207, 255],
                [43, 140, 190, 255],
                [4, 90, 141, 255]
            ],
            name: "PuBu",
            url: "http://static.arcgis.com/images/ColorSets/Sequential/Multi/PuBu.png"
        }, {
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQBtWgFtXQBvXwBwYABwYgByYwBzZgB0ZwB2agB3bQB4bwB5cAB7cwB8dgB+egF/ewCBfQCCgACEgwCEhgCGhwGIiwCJjACKjwCLkACNlAGOlwKPmAOQmQeRnAiSnQqUoQyUohCVpBGUphOWqBaXqhqZrByZrSGZsSOasiebtCybti6ctzGdujWevDeevTyfvz+gwUShw0mhxUyhxk+jx1KkyVamy1qlzF2nzl+nz2Oo0Waq0Wqp0m2r0nGs1HOt1Xeu1Xmu1nyw14Cx2YKy2oaz2oi02Y2024+325G325W525q73Ji63Z+83KC93aS/3aa/3qnA36zB3rXF36/C4LPE4LfH4bnH4bzI4r7K4sHL5MTM48XN5MjO5MrQ5s7T583S6NLV6NXW6tfY7NjZ69rb7d3c7ODe7OHf7ePh7+Ti8Ojl8Orn8uvo8+7o8vDq9PHr9fPu9fTu9vbv9wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB+/pSgAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAmklEQVRIS2MoLioqLCjIz8vNyc7KysxIT0tNSU5KjE+Ii42JjoqMCA8LDg0JCgzw9/P19vHy9HB3c3VxdnJ0sLeztbG2srQwNzM1MTYyNNDX09XR1tLUUFdTVVFWUlSQl5OVkZaSlBAXExURFhIU4Ofj5eHm4uRgZ2NlYWZiZGBgGLV4NKhHE9dodhotQEaLzNFKYrRaHDktEADRLyMnFmHrqwAAAABJRU5ErkJggg\x3d\x3d",
            colors: [
                [246, 239, 247, 255],
                [189, 201, 225, 255],
                [103, 169, 207, 255],
                [28, 144, 153, 255],
                [1, 108, 89, 255]
            ],
            name: "PuBuGn",
            url: "http://static.arcgis.com/images/ColorSets/Sequential/Multi/PuBuGn.png"
        }, {
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURZwAQp4BRqEBR6MCSKYCSagCSqsDTq4DT68EULMEUbYFVbcGVrwHWL4HWcIIW8MJXcYKX8gKYMwMYs4MZdINZ9UOadYPatgRbNkSb9wTcd4Vc98WdOEYduIaeuMdfuIff+IggOEkguImhOEohuIriOItiuIvjeMxj+I1keE2kuI5lOI+l+I/mN94veJCmuJFnOJInuNLouFNo+JQpeJSp+FWqeJZq+NbreNer+JhseJjsuNmsuJqtOFrteJut+FxueFzuuB3vOB7v959wN2BwN6EwtyHwtqPx92JxdyNx9uSydqUytqXzNmbzNidzdmfz9mh0Nik0tio0tip09ms1diu1Niw1diy19i02Nm32tm62tm829q/3trB3tzD4N3G4tzI497K49/N5eHP5+DR5uLT6OTV6uXY7Ofa7Ofc7ene7ujg7+nh8Ovj8uvl8ezm8u7o9O/p9e7r9O/s9fDt9vHu9wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGQpPq0AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAmklEQVRIS2MoLSkuKizIz8vNyc7KzEhPS01JTkpMiI+LjYmOiowIDwsNCQ4KDPD38/Xx9nL39HBzdXF20nV0sLeztbG2srQwNzM1MTYyNNDX09HW0tRQV1NVUVZSVJCXk5WVkZaSlBAXExURFhIU4Ofj5eHm4uRgZ2NlYWZiZGRgGLV4NKhHE9dodhotQEaLzNFKYrRaHDktEAAmxh3DTvEEcAAAAABJRU5ErkJggg\x3d\x3d",
            colors: [
                [241, 238, 246, 255],
                [215, 181, 216, 255],
                [223, 101, 176, 255],
                [221, 28, 119, 255],
                [152, 0, 67, 255]
            ],
            name: "PuRd",
            url: "http://static.arcgis.com/images/ColorSets/Sequential/Multi/PuRd.png"
        }, {
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURX0AeIEAeoMBe4UBeYgCe4oDfI0CfJEDfZMDfpcDf5kDfpwDf58FgaMEgqUFgasHgqkGg68Gg7MJhLEIhbYKhLkLhr8Nh7wMiMEPicMQiMUSiskTissWi8wXis4ZjNAbjNIejNQgjtcjkNklkNsokN0qkOAtkeAwk+IylOQ2leY5lek8lupAmOtDmO1GmO9Kme9NmfJQm/NTm/VVnfZZnPdcnvhfn/phofpkoftnof1qof1so/1uo/5xpf11pfx3pv16pv59pv1+p/6Cp/yEqP2Hqf2Kq/2Mqv2PrP2Rq/6Trf2VrPyZrv2cr/yesP2hsP6jsv2ls/2nsv2qtP2stf6vtf2wtv6zuP21uf22uv66u/27vPy/vv3Av/3Dwf/Fw/7HxP7Jxf7Lx/7Oyv3Qy/7RzP3Uzv7Vz/7X0P3b0v3c1f/e1//h2f7j2v/l3P/n3f/p3v7q3//r4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALDvh70AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAmklEQVRIS2MoKiosyM/Py83Jyc7KzEhPS01JTkpMiI+LjYmOiowIDwsNCQ4KDPD38/Xx9vL0cHdzdXF2cnSwt7O1sbaytDA3MzUxNjI00NfT1dHW0tRQV1NVUVZSVJCXk5WRlpKUEBMXFRESFuQX4OPl4ebi5GBnY2NlYWZiZGRgGLV4NKhHE9dodhotQEaLzNFKYrRaHDktEAA00BrLQ2cpwgAAAABJRU5ErkJggg\x3d\x3d",
            colors: [
                [254, 235, 226, 255],
                [251, 180, 185, 255],
                [247, 104, 161, 255],
                [197, 27, 138, 255],
                [122, 1, 119, 255]
            ],
            name: "RdPu",
            url: "http://static.arcgis.com/images/ColorSets/Sequential/Multi/RdPu.png"
        }, {
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQFqNQJtNwNuOANwNwRxOAZzOgV1OgV3Owd5PQh6PAl9PgmAQAuCQAyFQA6HQg+LQxCJRBGNRRKQRhSSSBaVSBeXShiZSRqbSxydTR6fTSChTyGiUCOkUSWlUienVCmpVCupVS2rVzGtWTOvWTWvWjivWzqxXT2zXUC0X0O1YEa2Yke3Y0u4ZU66ZVG6ZlS7aFe9alu+a12/bGHAbmTBcGbBcWfDcGvEdG7FdHHGdXTHdXfJd3XIeHvKeX7LeYDNe4POfIbPfYjQforSgI3SgZDUgZPUgpbVhJfWhZrYhZ3Yhp/ahqHbh6Xciafciqnfi6vfjK/gjrHgj7Pjj7bjkLjjkbrlk7zmlMDmlsPomMbpmcnpncvrn83soNHtotLuo9Xvpdjvp9rxqdzyqt/zrOD0r+T1sef2tej3tuv3ue35u+/5vPH5vfL6v/b7wff8wvr9xvv+x/39x///yQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGhSaj0AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAmklEQVRIS2MoLi4qLMjPz8vNyc7KzEhPS01JTkpMiI+LjYmOioyICA8LDQkOCgzw9/P18fby9HB3c3VxdnJ0sLeztbaxsrQwNzM1MTYyNNDX09XR1tLUUFdTVVFWUlSQl5OVkZaSlBAXExURFhLkF+Dj5eHm4uRgZ2NlYWZiZGBgGLV4NKhHE9dodhotQEaLzNFKYrRaHDktEAD06iG/9AC/yAAAAABJRU5ErkJggg\x3d\x3d",
            colors: [
                [255, 255, 204, 255],
                [194, 230, 153, 255],
                [120, 198, 121, 255],
                [49, 163, 84, 255],
                [0, 104, 55, 255]
            ],
            name: "YlGn",
            url: "http://static.arcgis.com/images/ColorSets/Sequential/Multi/YlGn.png"
        }, {
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURSUxlyUzliY2mCU3mSU5miQ7myU9nSU/niVCniZFoCVHoSVKoyVNpCZQpiVTqCZWqiVaqiVcrCZfriRiryVlryVnsSVrsyVttSVwtCVytiV2tyV5uSV6uiV/uyV9vCSBvCaDvCaFvSeIvyaKviaLvyaPvyaQwCaSwSWUwSaVwieYwiaawSacwiefxCeixCigwymkxSmmxCqnxSypxS2qxi6sxS2uxC+wxjCxxDKzxjO1xTW3xTm4xT66xEO9wkC8xEW/xE/Cv1LDv1bFv1jGvV3Hu2DIvWTJu2jKu23Lu3XNt3DLuXrOt37Rt0nAwYPStYjTtIvUto/UtZPWs5XXs5rYs53Zs6Hbs6Pcs6bds6rfta/ftbLhtbXjtbnktr7ltsHnuMXpucnqu87ru9DuvNTuvtjwvtvyvt/zwOL0wuX2wun1w+33w+/5xfL6x/T7x/j8yfn+yPv+yf7+yv//ywAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEhfv20AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAp0lEQVRIS2MoKS4qLMjPy83JzsrMSE9LTUlOSkyIj4uNiY6KjAgPCw0JDgoM8Pf18fHy9vRwd3N1cXZy9PNzsLO3tbGxtrK0MDczNTE2MjTQ09fV0dbS1FBXU1VRVlJUkJeVk5GWkpQQFxMVERYSFODn4+Xh5uLkYGdjZWFmYmRgIN9i24GyeMB8PGAWjwb1aKqmWT4eTdV0S1yjQT0a1MMvHw/RVA0A9AYjBtAQ5pYAAAAASUVORK5CYII\x3d",
            colors: [
                [255, 255, 204, 255],
                [161, 218, 180, 255],
                [65, 182, 196, 255],
                [44, 127, 184, 255],
                [37, 52, 148, 255]
            ],
            name: "YlGnBu",
            url: "http://static.arcgis.com/images/ColorSets/Sequential/Multi/YlGnBu.png"
        }, {
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURZ83AJ42AaE3AKM4AKQ6AKg7AKk9AK0/AKw+AbFBAbJCALRDALdFALlHAL9JAL1IAsFLAcVNAMZOAMtQAMlQAc1TAM9VANJWANRYANZaANlcANxfAt1hAd5iAOJkAOJnAONoAOVqAOhrAelsAOlvAOtyAexzAO51AO93APF5APF7APN9AfV/AfaAAvaDAveFAfiHA/mKBfyOBfyRB/ySCv6UCv2WDf6YD/+aEf+cEv+dFP6gGP+jHP+lIP+nIv+pJv+sKv+uLv+vMv6yOP+1PP64P/+6Rf67SP+9Tf+/U//CV//EXP/HYP7IZP/KaP7Mbf/Ocf/Qdv/Re/7Ufv/WgP7Yhf/ZiP/bi//ckP/dk//glf/hmf/jmv/loP/nof/opP7ppv/qqf/srf/tr//vs//wtf/xuP/zuf/0vP/2v//2wf73w//4xP/5x//6yv/7y/78zP/9zf/+zv/+0P//0wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPGTcscAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAmklEQVRIS2MoKS4qLMjPy83JzsrMSE9LTUlOSkyIj4uNiY6KjAgPCw0JDgoM8Pfz9fH28vRwd3N1cXZydLC3s7WxtrK0MDczNTE2MjQ00NfT1dHW0tRQV1NVUVZSVJCXk5WRlpKSlBAXExUWERIU4OPn5eHm4mTnYGNlYWZiYmBkGLV4NKhHE9dodhotQEaLzNFKYrRaHDktEADU3RhLaZ335gAAAABJRU5ErkJggg\x3d\x3d",
            colors: [
                [255, 255, 212, 255],
                [254, 217, 142, 255],
                [254, 153, 41, 255],
                [217, 95, 14, 255],
                [153, 52, 4, 255]
            ],
            name: "YlOrBr",
            url: "http://static.arcgis.com/images/ColorSets/Sequential/Multi/YlOrBr.png"
        }, {
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURccFHcYGH8kHH8oJHMwLHM8MHNANG9YTF9IQGdQSGtgWF9oYFtwbFt0cE98fFMIBIMMCIcQDIO0vD+IhEuQjEuYmEegoEeorEewtEe4yD/A0D/M4D/Q7D/Y9D/I2EPZCD/ZAEPlFEvhHEflKE/pNE/pQE/tTFftWFvtXGP1bGv1eGvthG/1kHv1mHfxqH/1uIv1wIf9zJP12Jf15J/58KP9+Kv2BK/2DLf+ILv+JL/+MMf+OMP+RMv+SM/+VNf+YNf+aNv+cN/+eN/+gOf+iOv+lOv+nO/+pPP+rPv+tP/+vPv6xP/+0Qf62QP63Qf+4Qv+7RP+9Rf+/R//BSP/DSf/FSv7GTf/IT/7KUP/LUf/OVf7QVv/TWv7UXP/WYP/YYf/aZf/caP/ea//fcP/idP/ld/7mev/ofv/pg/7rhf/tif/vjf/xkP/ykv/0mP71mv73nf/4oP/5o//7p/78qf/9qv/+rP//rQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACdJGU4AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAmklEQVRIS2MoLystKS4qLMjPy83JzsrMSE9LTUlOSkyIj4uNiY6KjAgPCw0JDgoM8Pfz9fH28vRwd3N1cXZydLC3s7WxtrK0MDczNTE2MjTQ19PV0dbS1FBXU1VRVlKUV5CVkZaTkhSSEBcTFRHm4+Xh5mLn5GBjZWFmYmAUFOBnGLV4NKhHE9dodhotQEaLzNFKYrRaHDktEAD+sC3vPCU/bgAAAABJRU5ErkJggg\x3d\x3d",
            colors: [
                [255, 255, 178, 255],
                [254, 204, 92, 255],
                [253, 141, 60, 255],
                [240, 59, 32, 255],
                [189, 0, 38, 255]
            ],
            name: "YlOrRd",
            url: "http://static.arcgis.com/images/ColorSets/Sequential/Multi/YlOrRd.png"
        }, {
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQOHcgWJdAeLdguMeA2OehGQfRSSfReVgByXgyCZhiOciSifjC2ikDGkkzamljqrmT+rm0Svn0myo061pFK5qFa7q1y8rmG/sWXDtWjEt2/Hu3PJvHfLvnvNwX/PwqlhDaljDqllEKtnEq5qFa5sGLBvG7NyHrR2I7Z5Jrd9KbqALLyEMb+INcCMOMORPMeUQciYRMqbSc2gTc+lU9CnV9SrW9WuX9eyYtm1Z9u6bdy8cd+/dN/BeODEe4PRxIfTx4zUyZDWzJbXz5va0p/c1aXe2Kng267i3rPk4bjk473n5uLHgOTJhOTLiOfOjujQkujSluvVnOzXoO7ZpO/bqfLdrvLftPPhufXjvcHp6MTr6srs7c/t79Lu79fx8tzx9N/z9PXlw/bnyPbozfXpz/br1fXt2vXu3OPy9eb09er09e/19ez09vXv4fXx5fby5/Xy6/Tz7vP19PH19vX08PX08vX18/X19QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFYS6uAAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAmklEQVRIS2OQV1BUUlZRVVPX0NTS1tHV0zcwNDI2MTUzt7C0srax9fbx9fMPCAwKDgkNC49ITEpOSU1Lz83LLygsKS0rLyrOzsnKzEiIj4uNiY6K9PL0cHdzdXF2cnSwt5OTlZGWkpQQFxMVERYSFODn4+Xh5uLkYGdjZWFmYmRgGLV4NKhHE9dodhotQEaLzNFKYrRaHDktEACZ8S3vri0YGgAAAABJRU5ErkJggg\x3d\x3d",
            colors: [
                [166, 97, 26, 255],
                [223, 194, 125, 255],
                [245, 245, 245, 255],
                [128, 205, 193, 255],
                [1, 133, 113, 255]
            ],
            name: "BrBG",
            url: "http://static.arcgis.com/images/ColorSets/Diverging/BrBG.png"
        }, {
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURUauG0mvHUyvHk+yIVK0I1a1J1m2KV24LF+6L2S8Mmi+N2y/OXHCP3TEQXnGRn3ISdIVi9QXjdMbjdUekNYkktgoldgtl9kym9o4nds9nt1Dod5Jpd9QqOBWq+JdsONisuRqteZxuOZ3vOh+wILKTYbMUIvPVpDRW5TTXpnVY5zWZqDYa6TZbafccq3dd6/febPhfrbigbrjhb3kib/ljuqEw+yKxeuRx+2Wy+6cze+h0e+m0/Cr1/Kv2PK02fS43PS73vW/38HnksPplsjrm8rqn8zso8/sqdLvrdPvstbyt9nyu9zywd70xfXC4fbF4vbK5ffM5/fP6vfR6vfU7PfX7vfa8Pfb8ffe8+D1yuL30OX20ub31+j32ur23uv34+735u/36Pfg9Pfh9vfk9/fm+Pbo9/fr9/bv9/fp+Pft+PH37fL38Pfw9/T28fX38vb09/f39fb29vf39/fy+Pf1+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAProToEAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAmklEQVRIS2MQEBQSFhEVE5eQlJKWkZWTV1BUUjY1M7ewtLK2sbWzd3D08w8IDAoOCQ0Lj0hKTklNy0zPysgtKSkoKC0qLszPy8lOTIiPi42Jjor09fH28vRwd3N1cXYyMTYyNNDX09XR1tLUUFdTVeHn4+Xh5uLkYGdjZWFmYmRgGLV4NKhHE9dodhotQEaLzNFKYrRaHDktEAC6hi07rQ0VPgAAAABJRU5ErkJggg\x3d\x3d",
            colors: [
                [208, 28, 139, 255],
                [241, 182, 218, 255],
                [247, 247, 247, 255],
                [184, 225, 134, 255],
                [77, 172, 38, 255]
            ],
            name: "PiYG",
            url: "http://static.arcgis.com/images/ColorSets/Diverging/PiYG.png"
        }, {
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURXwtln4wlgSJNgaMNwqOOg+QPROTQBeVQxyYRCGbSCecTS2hUDOkUjqnWD+qXEatXkyxY1K0Z1m3a1+7bma+cmvBeHLEfHjIf3/Lg4A0mYQ4nIY8nYY/nYlEoYtGoY1LpZBOppNTqZVXqplcrJthrp5lsp9ptKNutqZzuKl4uqt9va6Cv7KGwbWKwraPxrmSx7yXyr2bzYTNiIrPjJDTkJTVk5rYl57amqLdnajeoqrgpLDhqbLjrLblr7vntL7otsCfzsKjz8Wm0Maq08is1Mqw182z2M+32dK63NW938Pqu8brv9bB4NnF4drH497M5sruwszvxdHvydPxzdjz0Nv01N712N/22uDO6OPR6ebU7ObX7Ona7+vc7+P33u3g8u/i8+X34ej35Or35uz36e/37PHl8/Ln9fTp9/bs9/Xu9vD47fL38PT28fb29Pf39fb29vf39/bx+Pfy+Pf1+Pjz9wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOYSDPUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAmklEQVRIS2NgYJSUlJKWkZWTV1BUUlZRVVPX0NTS1tHV0zcwdHB0cnZxdXP38PTx9fOPiIyKjomNT0hLz8jMKiouLSkoLMzPy83JTk1JTkqMCw8LDQkOCgzw9rK3s7WxtrK0MDczNTE2khAXExURFhIU4Ofj5eHm4uRgZ2NlYWZiGLV4NKhHE9dodhotQEaLzNFKYrRaHDktEAAkzyYztoPC0wAAAABJRU5ErkJggg\x3d\x3d",
            colors: [
                [123, 50, 148, 255],
                [194, 165, 207, 255],
                [247, 247, 247, 255],
                [166, 219, 160, 255],
                [0, 136, 55, 255]
            ],
            name: "PRGn",
            url: "http://static.arcgis.com/images/ColorSets/Diverging/PRGn.png"
        }, {
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURWA7m2I9nWNAnmZDn2hFoWpJom1MpXFQp3JVqXVYqnlcrHtgrX9ksetjAOpkAetlAutnBexqCO1rCe1vC+9xDfB0EvF3FPF6FvF9GIBosoRttYhxt4p1uI55upF/vfKAHfOHIvSEIPWLJ/aPKveRLfiVMPmXNPqcOPufOvujP/ymQ/2pR/6rS/6vUP6yUv61Vv+4XP+6X/+9ZP+/aP/Cbf/Fc//IeP/KfJOEv5aHwpqLxJ6PxqGUyaSYyqiczKmgz6yj0K+m0bKq07Su1Law1rq02L232b+528K/3v/Ogv/Qiv/Sj/7Vlf/Ym//bof7dp//frP/js/7muv7nvsXC4cjF5MnJ5czM6M/P69LS7NTW7dbY79nb8tze89/h9v7qxf/sy//u0P/v1f/w2f7z3+Hk9+Tn+Ofr9ubp+Oru9+zv+O7x+P304/z05/r26/r37vT19/f39/Dz+PH1+Pj38vj39QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKCutMkAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAmklEQVRIS2Pg5eMXEBQSFhEVE5eQV1RQUlZRVVPX0NTS1tHV0zcwNDI2MTUz9/Ty9vH18w8IDAqOT0hMSk7Jyc3LLyktLCwoKC7KzspMz0hLjYuNiY6KjAgPCw3xcHdzdXF2cnSwt7O1sbaytJCTlZGWkuTh5uLkYGdjZWFmYmRgGLV4NKhHE9dodhotQEaLzNFKYrRaHDktEAAMdCz/hFjpvAAAAABJRU5ErkJggg\x3d\x3d",
            colors: [
                [230, 97, 1, 255],
                [253, 184, 99, 255],
                [247, 247, 247, 255],
                [178, 171, 210, 255],
                [94, 60, 153, 255]
            ],
            name: "PuOR",
            url: "http://static.arcgis.com/images/ColorSets/Diverging/PuOR.png"
        }, {
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQRxsgVyswh0tQx1thF5uBN7uBp+uh2BvCGEvSeIvyyKwDGMwTaQxDyUxkGXyEebyk2ey1KhzFekzl6n0GOr02iu0m2x1HO113m42X672swBF84DGc8KHtAGHNIPINITI9MZJtYeKtcjLNgpMNkvMts1N948Ot9CPeBJQuJPReRWSuVcTOZjUehqVOpwWe13Xex9YfCDZvCJavKQbfKUcPSadfaeevejfoK924fA3YvD3o/F35TG35fJ4JzM46DO5aTR5qnU563W6LHX6rbb7bjd7bzg7vamgfarhPevifezjPe3k/e7lva+mfjCnvbFpPfJqPfMrPfQsfbTt/bXu/fZv8Hi8cTk88nm9M3p9dDr9tXt99fu9tzw99/y+Pfbw/jfyfbhzPfk0/fm1Pfq2vfr3eHz9+f19uX09+v2+O33+O/49/ft4ffv5Pfw6Pfy7Pf07/H39/fz8Pb18/X29vf39/P3+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANZ/5QsAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAmklEQVRIS2OQkpaVkZNXUFRSVlFVU9fQ1NLW0dXTNzA0MjYxNTN39/D08vbx9fMPCAwKDgmNT0hMSk5JzcnNyy8oKi4pLSkrzM7KTM9Ii4uNiY6KjAgPc3N1cXZydLC3s7WxtrK0kJQQFxMVERYSFODn4+Xh5uLkYGdjZWFmYmRgGLV4NKhHE9dodhotQEaLzNFKYrRaHDktEACKdC2z407jNAAAAABJRU5ErkJggg\x3d\x3d",
            colors: [
                [202, 0, 32, 255],
                [244, 165, 130, 255],
                [247, 247, 247, 255],
                [146, 197, 222, 255],
                [5, 113, 176, 255]
            ],
            name: "RdBu",
            url: "http://static.arcgis.com/images/ColorSets/Diverging/RdBu.png"
        }, {
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURUJCQkVFRUdHR0tLS05OTlFRUVVVVVlZWV1dXWFhYWZmZmtra29vb3R0dHl5eX19fc4AF84DGc8FG88KHNIPINITItIYJdUdKdYjKdgpLtkvMts1Nds8ON1CPeBJQOFORONVR+VcTOZjT+hqVOpwWOx2XOx9Ye6CZfCJavGObvKUcPOZdvSfevejfoKCgoeHh4yMjJGRkZWVlZqamp6enqOjo6enp6urq6+vr7Ozs7a2trq6ur29vfamgfeshfevifi0jfm4kvy8mPrAm/zEof7Ipv7Mq/3Qsf/Ttv7XusDAwMTExMbIx8nLyszNz9DR09LT1dbX2dfb3Nre4d3h5P/awP/exf/gy//k0f/m1f/q2f/u3uDk5+Pn6uXq7efs7+rv8uzx9e/0+P7w4/7y5v706v/27fH2+fP4+/T5/Pb7/vf8///58//69v/89/n9//r+///8+f/+/P3+/v///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHGffe8AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAmklEQVRIS2MQEBQSFhEVE5eQlJKWkZWTV1BUUlZRVVPX0NTS1tG1tbN3cHRydnF1c/fwDA0Lj4iMik5OSU3Lyc0rLCouKSkuKMjPzsrMSE9KTIiPi40JCQ4KDPD38/Xx9rKxtrK0MDczNTE2MjTQ1+Pn4+Xh5uLkYGdjZWFmYmRgGLV4NKhHE9dodhotQEaLzNFKYrRaHDktEACeCS0TTIUxbgAAAABJRU5ErkJggg\x3d\x3d",
            colors: [
                [202, 0, 32, 255],
                [244, 165, 130, 255],
                [255, 255, 255, 255],
                [186, 186, 186, 255],
                [64, 64, 64, 255]
            ],
            name: "RdGy",
            url: "http://static.arcgis.com/images/ColorSets/Diverging/RdGy.png"
        }, {
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURSh8uix+ui6AujKCvTWGvjmIwTyLw0GOxEWRxUmVyU+Yy1Sczlig0Fyj0WKm02es1myv2XGy2ne33Xy639sZD9wcEd0fE90iE90mFOArGOAwGeI0G+M5H+U9IOZDIudJJOlQJ+pVK+xbLO1hMPBnM/BtNfFzOPN5OvV/P/aFQfmKQ/iQR/qWS/ubT/2gUv2kVP6pWP+tW/+xXv+1YP64Yv+8Zf/Aaf/Da//HcP/Kcv/Od//Ref/UfYG94YXB44rF44/I5ZTM55jO6J3R6aHU6abW6qna663b6q/d6rPf6rfi6b7m5rvk6P/XgP7ahP/eh//hi//jj//nkf/plP/ql//unP/wn//yo//0pf/2p//3rP/5rf/7sf/9s//9uP/+u/7/vdn13t333N/428Ho58Xp5cns5c3u5dDw4dPy4tf04O//zuX71+L62Ov90+j91u3+0ff/xPb/xvH/zPX/yvv/wPr/xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFkrM94AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAmklEQVRIS2MQERUTl5CUkpaRlZNXUFRSVlFVU9fQ1NLW0dXTNzA0MjYxNTO3sLSytvH18w8IDAoOCQ0Lj4iMio6JjYuPTygtKywqKc4uyMvPyU1OSszKzEhPS03x9vHy9HB3c3VxdnJ0sLezFRYSFODn4+Xh5uLkYGdjZWFmYmRgGLV4NKhHE9dodhotQEaLzNFKYrRaHDktEABiuCwPJEmTtwAAAABJRU5ErkJggg\x3d\x3d",
            colors: [
                [215, 25, 28, 255],
                [253, 174, 97, 255],
                [255, 255, 191, 255],
                [171, 217, 233, 255],
                [44, 123, 182, 255]
            ],
            name: "RdYlBu",
            url: "http://static.arcgis.com/images/ColorSets/Diverging/RdYlBu.png"
        }, {
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQOYPgWaPgqbPg6dQRSfQhehQhyjRCKlRSeoRC2qRjOrRzquST6xSUW0S023S1K5TFm8T1+/UWXBUmzEU3LGVHnJVn/MWNkZDtsdEdsfE9wiE90mFt8vGOArGOI0G+I4HuM+IOZDIudJJOlPKepVK+xbLu1hMO1nMvBtNfFzOPN5OvV/P4POWIrRW4/TXJXUX5rXYp7ZY6LcZKjdZ6zea6/gbbPicLjkc7vldb7oevaFQfeKRfqPR/uVS/ubTvyfUf6lVf6pWP+tW/+xXv+2Yf+5Y/+7ZsPqff/Aaf/Cb//Hcv7KdP7Oev/QfsfsgsruhM/vitHxjNXzkdf1ldv2md74nf7Ugv/Xh//aiv7djv/fkv/kl//mm//onuH5oeT7o+b8qer9q+3+rv/rov/tpf7wqf/yrP70rfD+sfL/tfX/uP/2sf/4tP75t/j/ufr/vP/6uP/8uf79vPz+vP7+vQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAK04bYQAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAmklEQVRIS2MQl5CUkpaVkZNXUFRSVlFVU9fQ1NK2sraxtbN3cHRydnF18/D08vbxDQuPiIyKjolNTklNS8/OyS0oLCopKSnOz8vKzMxISkyIjwsNCQ4KDPD3c7e0MDczNTE2MjTQ19PVERMVERYSFODn4+Xh5uLkYGdjZWFmYmRgGLV4NKhHE9dodhotQEaLzNFKYrRaHDktEABS7SybEIbE3wAAAABJRU5ErkJggg\x3d\x3d",
            colors: [
                [215, 25, 28, 255],
                [253, 174, 97, 255],
                [255, 255, 191, 255],
                [166, 217, 106, 255],
                [26, 150, 65, 255]
            ],
            name: "RdYlGn",
            url: "http://static.arcgis.com/images/ColorSets/Diverging/RdYlGn.png"
        }, {
            imageData: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAUCAMAAABxjAnBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURSSDuyeFuyuHui2JuDaPtzGMuTmRtT+VtkKXs0aaskyes1uqr1+trVGjsVamsWWxrWm1q3C4qnW8qnrAqNsZD9wcEd0fE90iE90mFN8qF+AwGeI0G+M5H+U9IOZDIudJJOlQJ+pVKuxbLu1hMPBnM/BtNfFzOPN5OvV/P/aFQfmKQ/iQR/uVSvubTvyfUf6lVf6pWP+tW/+xXv+2Yf+3Y/68Zv/Aaf/Dbf/HcP/KdP/NeP/RfIHDp4bHp4nLp4/NpJPQpJnUpJ3XpKDZoqXco6jeoq3ho7Dio7Pko7jmprvop8DqqMPsqMXuqsnxq83yrdD0rtT1sNb3stn4tNz6tP7UgP/WhP/aif7djP/gjv7jkv/mlv/omv7rnuD7tuP8uOT9uej/u+r/vO7+vf/tof/vpP7yqP71qv/2r/P/vfD/vvb/vPT/vf/3sv/5s//6tvj/vPr/vf/8uf79uv7+vf7/vgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANoNbRUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAmklEQVRIS2MQERUTl5CUkpaRlZNXUFRSVlFVU9fQ1NLW0dXTNzA0MjYxNTO3sLSyDg0Lj4iMio6JTUlNS8/IzcsvKi4pLSktLMjOycxKTkpMiI8LCQ4KDPD38/Xx9vL0cHdzdXF2cnSwt7O1ERYSFODn4ebj5eLkYGdjYWVmYmRgGLV4NKhHE9dodhotQEaLzNFKYrRaHDktEAAxYi2fMjiTMAAAAABJRU5ErkJggg\x3d\x3d",
            colors: [
                [215, 25, 28, 255],
                [253, 174, 97, 255],
                [255, 255, 191, 255],
                [171, 221, 164, 255],
                [43, 131, 186, 255]
            ],
            name: "Spectral",
            url: "http://static.arcgis.com/images/ColorSets/Diverging/Spectral.png"
        }];
    return {
        createClassBreaksRenderer: function(a) {
            var b = a.features,
                e = a.definition.classificationField,
                g = a.definition.normalizationField,
                c = a.definition.normalizationType,
                d = a.definition.classificationMethod,
                k = a.definition.breakCount,
                l, f = a.definition.colorRamp || "BuGn";
            if (a.definition.baseSymbol) l = a.definition.baseSymbol;
            else switch (b[0].geometry.type) {
                case "point":
                case "multipoint":
                    l =
                        new y;
                    break;
                case "polyline":
                    l = new z;
                    break;
                case "polygon":
                    l = new A
            }
            var p = 0;
            "percent-of-total" === c && t.forEach(b, function(a) {
                p += a.attributes[e]
            });
            a = L(b, a.values, e, g, c, d, k, p);
            var h = new x(l, e);
            c && (h.normalizationType = M[c]);
            h.classificationMethod = N[d];
            var d = w(f),
                n;
            if (d) {
                n = B(d.colors, k);
                var m;
                t.forEach(a, function(a, b) {
                    m = a.minValue === a.maxValue ? c && "percent-of-total" === c ? a.minValue + "%" : a.minValue.toString() : c && "percent-of-total" === c ? a.minValue + "% - " + a.maxValue + "%" : a.minValue + " - " + a.maxValue;
                    h.addBreak({
                        minValue: a.minValue,
                        maxValue: a.maxValue,
                        symbol: v.clone(l).setColor(n[b]),
                        label: m
                    })
                });
                "percent-of-total" === c && (h.normalizationTotal = p, h = new x(h.toJson()));
                h.setMaxInclusive(!0);
                return h
            }
        },
        createUniqueValueRenderer: function(a) {
            var b = a.features,
                e = a.definition.attributeField,
                g, c = a.definition.colorRamp || "BuGn";
            if (a.definition.baseSymbol) g = a.definition.baseSymbol;
            else switch (b[0].geometry.type) {
                case "point":
                case "multipoint":
                    g = new y;
                    break;
                case "polyline":
                    g = new z;
                    break;
                case "polygon":
                    g = new A
            }
            a = [];
            var d, k;
            for (d = 0; d < b.length; d++) k =
                b[d], k = k.attributes[e], a.push(k);
            if (0 != a.length) {
                a = a.sort();
                b = D(a).uniqueValues;
                a = b.length;
                var l = new F(g, e),
                    e = w(c),
                    f;
                if (e) return f = B(e.colors, a), t.forEach(b, function(a, b) {
                    l.addValue({
                        value: a,
                        symbol: v.clone(g).setColor(f[b]),
                        label: a
                    })
                }), l
            }
        },
        getColorRamp: w
    }
});