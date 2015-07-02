//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "./GeminiDocumentType", "./DataRoot", "dojo/i18n!../../../nls/i18nGemini", "../../../../../kernel"], function(b, e, f, c, d, a, g) {
    return b(c, {
        caption: a.documentTypes.data.caption,
        description: a.documentTypes.data.description,
        key: "gemini-iso-19115",
        isService: !1,
        metadataStandardName: "UK GEMINI",
        metadataStandardVersion: "2.2",
        newRootDescriptor: function() {
            return new d
        }
    })
});