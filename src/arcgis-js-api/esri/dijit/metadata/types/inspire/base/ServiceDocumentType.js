//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "./InspireDocumentType", "./ServiceRoot", "dojo/i18n!../../../nls/i18nInspire"], function(b, e, f, c, d, a, g) {
    return b(c, {
        caption: a.documentTypes.service.caption,
        description: a.documentTypes.service.description,
        key: "inspire-iso-19119",
        isService: !0,
        metadataStandardName: "INSPIRE Metadata Implementing Rules",
        metadataStandardVersion: "Technical Guidelines based on EN ISO 19115 and EN ISO 19119 (Version 1.2)",
        newRootDescriptor: function() {
            return new d
        }
    })
});