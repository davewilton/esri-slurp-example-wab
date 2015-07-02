//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "./InspireDocumentType", "./DataRoot", "dojo/i18n!../../../nls/i18nInspire", "../../../../../kernel"], function(b, e, f, c, d, a, g) {
    return b(c, {
        caption: a.documentTypes.data.caption,
        description: a.documentTypes.data.description,
        key: "inspire-iso-19115",
        isService: !1,
        metadataStandardName: "INSPIRE Metadata Implementing Rules",
        metadataStandardVersion: "Technical Guidelines based on EN ISO 19115 and EN ISO 19119 (Version 1.2)",
        newRootDescriptor: function() {
            return new d
        }
    })
});