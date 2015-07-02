//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "./IsoDocumentType", "./ServiceRoot", "dojo/i18n!../../../nls/i18nIso", "../../../../../kernel"], function(b, e, f, c, d, a, g) {
    return b(c, {
        caption: a.documentTypes.service.caption,
        description: a.documentTypes.service.description,
        key: "iso-19119",
        isService: !0,
        metadataStandardName: "ISO 19139/19119 Metadata for Web Services",
        metadataStandardVersion: "2005",
        newRootDescriptor: function() {
            return new d
        }
    })
});