//>>built
define(["dojo/_base/lang", "dojo/_base/array", "dojo/query", "dojo/has", "dijit/registry", "dojo/i18n!../../../nls/i18nIso", "../../../../../kernel"], function(r, l, m, s, n, p, t) {
    var e = null,
        h = null,
        b = {
            bul: "bg",
            cze: "cs",
            dan: "da",
            dut: "nl",
            eng: "en",
            est: "et",
            fin: "fi",
            fre: "fr",
            ger: "de",
            gre: "el",
            hun: "hu",
            gle: "ga",
            ita: "it",
            lav: "lv",
            lit: "lt",
            mlt: "mt",
            pol: "pl",
            por: "pt",
            rum: "ro",
            slo: "sk",
            slv: "sl",
            spa: "es",
            swe: "sv"
        };
    return {
        getSelectedLanguage: function(f) {
            var b = f.selectedIndex;
            return -1 !== b ? f.options[b].value : "en"
        },
        getSessionConceptQuery: function() {
            return e
        },
        populateLanguages: function(f, e) {
            var a, d = null,
                c = a = null;
            a = h;
            if ("undefined" !== typeof a && null !== a) d = a;
            else if ((a = m("[data-gxe-path\x3d'/gmd:MD_Metadata/gmd:language/gmd:LanguageCode/@codeListValue']", f.rootDescriptor.domNode)) && 1 === a.length)
                if ((a = n.byNode(a[0])) && a.inputWidget)
                    if (a = a.inputWidget.getInputValue(), a in b) d = b[a];
                    else
                        for (c in b)
                            if (b.hasOwnProperty(c) && b[c] === a) {
                                d = a;
                                break
                            }
            if ("undefined" === typeof d || null === d) d = "en";
            var q = e.options;
            a = [];
            var k, g = p.gemet.languages;
            for (c in g) g.hasOwnProperty(c) &&
                (k = c === d, a.push(new Option(g[c], c, !1, k)));
            a.sort(function(a, b) {
                return a.label === b.label ? 0 : a.label > b.label ? 1 : -1
            });
            l.forEach(a, function(a) {
                q.add(a)
            })
        },
        saveSessionConceptQuery: function(b) {
            e = b
        },
        saveSessionLanguage: function(b) {
            h = b
        }
    }
});