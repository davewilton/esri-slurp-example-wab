//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "./Transformer", "../../../../kernel"], function(c, e, f, d, g, h) {
    return c([d], {
        postCreate: function() {
            this.inherited(arguments)
        },
        checkTarget: function(c, a) {
            var b = c.gxePath;
            if ("gmd:MD_Metadata" === a) {
                if (this.toDocumentType.isGmi) return "gmi:MI_Metadata"
            } else if ("gmi:MI_Metadata" === a) {
                if (!this.toDocumentType.isGmi) return "gmd:MD_Metadata"
            } else if (this.toDocumentType.isService) {
                if ("gmd:MD_DataIdentification" === a) return "srv:SV_ServiceIdentification";
                if (-1 !==
                    b.indexOf("gmd:MD_DataIdentification/gmd:extent", b.length - 36)) return "srv:extent"
            } else {
                if ("srv:SV_ServiceIdentification" === a) return "gmd:MD_DataIdentification";
                if (-1 !== b.indexOf("srv:SV_ServiceIdentification/srv:extent", b.length - 39)) return "gmd:extent"
            }
            return a
        }
    })
});