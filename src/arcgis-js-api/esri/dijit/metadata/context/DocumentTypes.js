//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "dijit/_WidgetBase", "../types/fgdc/base/DocumentType", "../types/iso/base/DataDocumentType", "../types/iso/base/ServiceDocumentType", "../types/iso/base/GmiDocumentType", "../types/inspire/base/DataDocumentType", "../types/inspire/base/ServiceDocumentType", "../types/gemini/base/DataDocumentType", "../types/gemini/base/ServiceDocumentType", "../../../kernel"], function(b, n, p, q, c, d, e, f, g, h, k, l, m, r) {
    return b([c], {
        index: null,
        list: null,
        postCreate: function() {
            this.inherited(arguments);
            this._initializeTypes()
        },
        _initializeTypes: function() {
            var b = this.list = [],
                c = this.index = {},
                a = function(a) {
                    c[a.key] = a;
                    b.push(a)
                };
            a(new d({
                interrogationRules: [{
                    path: "/metadata/idinfo/citation/citeinfo/title",
                    must: !0
                }]
            }));
            a(new e({
                interrogationRules: [{
                    path: "/gmd:MD_Metadata/gmd:identificationInfo/gmd:MD_DataIdentification",
                    must: !0
                }]
            }));
            a(new f({
                interrogationRules: [{
                    path: "/gmd:MD_Metadata/gmd:identificationInfo/srv:SV_ServiceIdentification",
                    must: !0
                }]
            }));
            a(new g({
                interrogationRules: [{
                    path: "/gmi:MD_Metadata",
                    must: !0
                }]
            }));
            a(new h({
                interrogationRules: [{
                    path: "/gmd:MD_Metadata/gmd:identificationInfo/gmd:MD_DataIdentification",
                    must: !0
                }, {
                    path: "/gmd:MD_Metadata/gmd:metadataStandardName/gco:CharacterString",
                    value: "INSPIRE Metadata Implementing Rules"
                }, {
                    path: "/gmd:MD_Metadata/gmd:metadataStandardVersion/gco:CharacterString",
                    value: "Technical Guidelines based on EN ISO 19115 and EN ISO 19119 (Version 1.2)"
                }]
            }));
            a(new k({
                interrogationRules: [{
                    path: "/gmd:MD_Metadata/gmd:identificationInfo/srv:SV_ServiceIdentification",
                    must: !0
                }, {
                    path: "/gmd:MD_Metadata/gmd:metadataStandardName/gco:CharacterString",
                    value: "INSPIRE Metadata Implementing Rules"
                }, {
                    path: "/gmd:MD_Metadata/gmd:metadataStandardVersion/gco:CharacterString",
                    value: "Technical Guidelines based on EN ISO 19115 and EN ISO 19119 (Version 1.2)"
                }]
            }));
            a(new l({
                interrogationRules: [{
                    path: "/gmd:MD_Metadata/gmd:identificationInfo/gmd:MD_DataIdentification",
                    must: !0
                }, {
                    path: "/gmd:MD_Metadata/gmd:metadataStandardName/gco:CharacterString",
                    value: "UK GEMINI"
                }, {
                    path: "/gmd:MD_Metadata/gmd:metadataStandardVersion/gco:CharacterString",
                    value: "2.2"
                }]
            }));
            a(new m({
                interrogationRules: [{
                    path: "/gmd:MD_Metadata/gmd:identificationInfo/srv:SV_ServiceIdentification",
                    must: !0
                }, {
                    path: "/gmd:MD_Metadata/gmd:metadataStandardName/gco:CharacterString",
                    value: "UK GEMINI"
                }, {
                    path: "/gmd:MD_Metadata/gmd:metadataStandardVersion/gco:CharacterString",
                    value: "2.2"
                }]
            }))
        }
    })
});