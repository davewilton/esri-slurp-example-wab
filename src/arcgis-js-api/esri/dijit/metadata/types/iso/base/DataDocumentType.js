//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "./IsoDocumentType", "./DataRoot", "dojo/i18n!../../../nls/i18nIso", "../../../../../kernel"], function(b, e, f, c, d, a, g) {
    return b(c, {
        caption: a.documentTypes.data.caption,
        description: a.documentTypes.data.description,
        key: "iso-19115",
        isService: !1,
        metadataStandardName: "ISO 19139/19115 Metadata for Datasets",
        metadataStandardVersion: "2003",
        newRootDescriptor: function() {
            return new d
        }
    })
});