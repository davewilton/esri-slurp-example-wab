//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../../../base/DocumentType", "./Root", "./PortalItemTransformer", "dojo/i18n!../../../nls/i18nFgdc", "../../../../../kernel"], function(d, h, k, e, f, g, b, l) {
    return d(e, {
        caption: b.documentTypes.fgdc.caption,
        description: b.documentTypes.fgdc.description,
        key: "fgdc",
        metadataStandardName: "FGDC Content Standard for Digital Geospatial Metadata",
        metadataStandardVersion: "FGDC-STD-001-1998",
        beforeInitializeElement: function(d, a) {
            var c = a.gxePath;
            "/metadata/idinfo/ptcontac/cntinfo" ===
            c ? a.label = b.idinfo.ptcontac : "/metadata/dataqual/lineage/srcinfo/srccite/citeinfo" === c ? a.label = b.dataqual.srcinfo.srccite : "/metadata/dataqual/lineage/procstep/proccont/cntinfo" === c ? a.minOccurs = 1 : "/metadata/distinfo/distrib/cntinfo" === c ? a.minOccurs = 1 : "/metadata/metainfo/metc/cntinfo" === c ? a.minOccurs = 1 : this.inherited(arguments)
        },
        newPortalItemTransformer: function(b) {
            return new g
        },
        newRootDescriptor: function() {
            return new f
        }
    })
});