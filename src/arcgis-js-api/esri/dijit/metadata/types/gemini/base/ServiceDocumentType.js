//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "./GeminiDocumentType", "./ServiceRoot", "dojo/i18n!../../../nls/i18nGemini", "../../../../../kernel"], function(b, e, f, c, d, a, g) {
    return b(c, {
        caption: a.documentTypes.service.caption,
        description: a.documentTypes.service.description,
        key: "gemini-iso-19119",
        isService: !0,
        metadataStandardName: "UK GEMINI",
        metadataStandardVersion: "2.2",
        newRootDescriptor: function() {
            return new d
        }
    })
});