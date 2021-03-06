//>>built
define(["dojo/_base/lang", "dojo/_base/array", "dojo/_base/url", "dojo/io-query", "./kernel", "./config", "./sniff", "dojo/i18n!./nls/jsapi"], function(k, r, l, p, s, t, q, u) {
    var e = {},
        m = t.defaults.io,
        n = window.location.protocol;
    "file:" === n && (n = "http:");
    e.urlToObject = function(a) {
        var c = {},
            b = new l(a),
            d = a.indexOf("?");
        null === b.query ? c = {
            path: a,
            query: null
        } : (c.path = a.substring(0, d), c.query = p.queryToObject(b.query));
        b.fragment && (c.hash = b.fragment, null === b.query && (c.path = c.path.substring(0, c.path.length - (b.fragment.length + 1))));
        return c
    };
    e.getProxyUrl = function(a, c) {
        var b = k.isString(a) ? 0 === k.trim(a).toLowerCase().indexOf("https:") : a,
            d = m.proxyUrl,
            f, g, h = u.io.proxyNotSet;
        if (k.isString(a) && (g = e.getProxyRule(a))) d = g.proxyUrl;
        if (!d) throw console.log(h), Error(h);
        b && (!1 !== c && 0 !== window.location.href.toLowerCase().indexOf("https:")) && (b = d, 0 !== b.toLowerCase().indexOf("http") && (b = e.getAbsoluteUrl(b)), b = b.replace(/^http:/i, "https:"), e.canUseXhr(b) && (d = b, f = 1));
        d = e.urlToObject(d);
        d._xo = f;
        return d
    };
    e.addProxy = function(a) {
        var c = e.getProxyRule(a),
            b;
        c ? b = e.urlToObject(c.proxyUrl) : m.alwaysUseProxy && (b = e.getProxyUrl());
        b && (c = e.urlToObject(a), a = b.path + "?" + c.path, (b = p.objectToQuery(k.mixin(b.query || {}, c.query))) && (a += "?" + b));
        return a
    };
    e.addProxyRule = function(a) {
        var c = a.urlPrefix = e.urlToObject(a.urlPrefix).path.replace(/([^\/])$/, "$1/").replace(/^https?:\/\//ig, "").toLowerCase(),
            b = m.proxyRules,
            d, f = b.length,
            g, h = f;
        for (d = 0; d < f; d++)
            if (g = b[d].urlPrefix, 0 === c.indexOf(g)) {
                if (c.length === g) return -1;
                h = d;
                break
            } else 0 === g.indexOf(c) && (h = d + 1);
        b.splice(h, 0, a);
        return h
    };
    e.getProxyRule = function(a) {
        var c = m.proxyRules,
            b = c.length,
            d = e.urlToObject(a).path.replace(/([^\/])$/, "$1/").replace(/^https?:\/\//ig, "").toLowerCase(),
            f;
        for (a = 0; a < b; a++)
            if (0 === d.indexOf(c[a].urlPrefix)) {
                f = c[a];
                break
            }
        return f
    };
    e.hasSameOrigin = function(a, c, b) {
        a = a.toLowerCase();
        c = c.toLowerCase();
        var d = window.location.href.toLowerCase();
        a = 0 === a.indexOf("http") ? new l(a) : d = new l(d);
        c = 0 === c.indexOf("http") ? new l(c) : k.isString(d) ? new l(d) : d;
        return (b || a.scheme === c.scheme) && a.host === c.host && a.port ===
            c.port
    };
    e.canUseXhr = function(a, c) {
        var b = q("esri-phonegap") ? !0 : !1,
            d = e.hasSameOrigin,
            f = m.corsEnabledServers,
            g, h = -1;
        !b && (q("esri-cors") && f && f.length) && (b = r.some(f, function(b, c) {
            g = 0 !== k.trim(b).toLowerCase().indexOf("http");
            return d(a, g ? "http://" + b : b) || g && d(a, "https://" + b) ? (h = c, !0) : !1
        }));
        return c ? h : b
    };
    e.getAbsoluteUrl = function(a) {
        return k.isString(a) && !/^https?:\/\//i.test(a) ? 0 === a.indexOf("//") ? n + a : 0 === a.indexOf("/") ? n + "//" + window.location.host + a : s._appBaseUrl + a : a
    };
    e.fixUrl = function(a) {
        /^\/\//i.test(a) &&
            (a = n + a);
        return a = a.replace(/^(https?:\/\/)(arcgis\.com)/i, "$1www.$2")
    };
    return e
});