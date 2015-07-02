//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "dojo/i18n!../nls/i18nFgdc", "dojo/i18n!../nls/i18nIso", "dojo/i18n!../nls/i18nInspire", "dojo/i18n!../nls/i18nGemini", "../../../kernel"], function(a, b, g, c, d, e, f, h) {
    return a(null, {
        i18nFgdc: c,
        i18nIso: d,
        i18nInspire: e,
        i18nGemini: f,
        codeListPrefix: "http://www.isotc211.org/2005/resources/Codelist/gmxCodelists.xml#",
        inspireCodeListPrefix: "http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/Codelist/ML_gmxCodelists.xml#",
        constructor: function(a) {
            b.mixin(this,
                a)
        }
    })
});