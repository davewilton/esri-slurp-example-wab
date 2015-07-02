//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "./DocumentTypes", "./Logger", "../../../kernel"], function(f, e, d, k, g, h, l) {
    return f(null, {
        allowedTypeKeys: "arcgis fgdc iso-19115 iso-19119 iso-19115-2 inspire-iso-19115 inspire-iso-19119 gemini-iso-19115 gemini-iso-19119".split(" "),
        arcgisGeocoder: null,
        basemap: "streets",
        showMapAttribution: !1,
        showMapLogo: !0,
        wrapAround180: !1,
        gemetUrl: "http://www.eionet.europa.eu/gemet",
        gemetConceptThesaurus: "http://www.eionet.europa.eu/gemet/concept/",
        gemetInspireThemeThesaurus: "http://inspire.ec.europa.eu/theme/",
        documentTypes: null,
        logger: null,
        session: null,
        constructor: function(a) {
            e.mixin(this, a);
            this.session = {};
            this.documentTypes = new g;
            this.logger = new h({
                debugEnabled: !0
            })
        },
        filterDocumentTypes: function() {
            var a = [];
            d.forEach(this.documentTypes.list, function(b) {
                d.some(this.allowedTypeKeys, function(c) {
                    if (b.key === c) return a.push(b), !0
                })
            }, this);
            return a
        },
        setAllowedTypeKeys: function(a) {
            var b = [],
                c = [];
            "undefined" === typeof a || null === a || ("string" === typeof a ?
                b = a.split(",") : a.push && (b = a), d.forEach(this.documentTypes.list, function(a) {
                    d.some(b, function(b) {
                        if (a.key === e.trim(b)) return c.push(a.key), !0
                    })
                }), 0 < c.length && (this.allowedTypeKeys = c))
        }
    })
});