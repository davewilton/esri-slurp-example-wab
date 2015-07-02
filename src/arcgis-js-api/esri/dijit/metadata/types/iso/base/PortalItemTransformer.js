//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "../../../base/etc/docUtil", "../../../arcgis/portal/PortalItemTransformer", "../../../../../kernel"], function(k, p, l, q, m, n, r) {
    return k([n], {
        postCreate: function() {
            this.inherited(arguments)
        },
        checkVisibility: function(e, d) {
            this.inherited(arguments);
            var a;
            if (-1 !== d.indexOf("/gmd:resourceConstraints/gmd:MD_Constraints/gmd:useLimitation/gco:CharacterString")) m.findElementChoice(e, !0);
            else if (-1 !== d.indexOf("/gmd:descriptiveKeywords/gmd:MD_Keywords/gmd:keyword")) try {
                a =
                    e.parentXNode.parentElement.parentElement, a.toggleContent && a.toggleContent(!0)
            } catch (b) {
                console.error(b)
            } else if (-1 !== d.indexOf("/gmd:EX_Extent/gmd:geographicElement/gmd:EX_GeographicBoundingBox")) try {
                a = e.parentXNode.parentElement.parentElement.parentElement, a.toggleContent && a.toggleContent(!0)
            } catch (f) {
                console.error(f)
            } else if (-1 != d.indexOf("/gmd:distributionInfo/gmd:MD_Distribution/gmd:transferOptions/gmd:MD_DigitalTransferOptions/gmd:onLine/gmd:CI_OnlineResource/gmd:linkage/gmd:URL")) try {
                a = e.parentXNode.parentElement.parentElement.parentElement,
                    a.toggleContent && a.toggleContent(!0), a = a.parentElement.parentElement.parentElement.parentElement, a.toggleContent && a.toggleContent(!0)
            } catch (g) {
                console.error(g)
            }
        },
        populateTransformationInfo: function(e, d, a) {
            this.inherited(arguments);
            var b = a,
                f = e.documentType.isService,
                g = e.rootElement.gxePath,
                c = g + "/gmd:identificationInfo/gmd:MD_DataIdentification",
                h = c + "/gmd:extent/gmd:EX_Extent/gmd:geographicElement/gmd:EX_GeographicBoundingBox";
            f && (c = g + "/gmd:identificationInfo/srv:SV_ServiceIdentification", h = c + "/srv:extent/gmd:EX_Extent/gmd:geographicElement/gmd:EX_GeographicBoundingBox");
            b.id.path = g + "/gmd:fileIdentifier/gco:CharacterString";
            b.title.path = c + "/gmd:citation/gmd:CI_Citation/gmd:title/gco:CharacterString";
            b.snippet.path = c + "/gmd:purpose/gco:CharacterString";
            b.description.path = c + "/gmd:abstract/gco:CharacterString";
            b.accessInformation.path = c + "/gmd:credit/gco:CharacterString";
            b.licenseInfo.path = c + "/gmd:resourceConstraints/gmd:MD_Constraints/gmd:useLimitation/gco:CharacterString";
            b.tags.path = c + "/gmd:descriptiveKeywords/gmd:MD_Keywords/gmd:keyword";
            b.extent.xmin.path = h + "/gmd:westBoundLongitude/gco:Decimal";
            b.extent.ymin.path = h + "/gmd:southBoundLatitude/gco:Decimal";
            b.extent.xmax.path = h + "/gmd:eastBoundLongitude/gco:Decimal";
            b.extent.ymax.path = h + "/gmd:northBoundLatitude/gco:Decimal";
            f ? (b.url.path = c + "/srv:containsOperations/srv:SV_OperationMetadata/srv:connectPoint/gmd:CI_OnlineResource/gmd:linkage/gmd:URL", d && d.url && (f = this.findInputWidget(null, c + "/srv:containsOperations/srv:SV_OperationMetadata/srv:operationName/gco:CharacterString", !0)) && f.setInputValue("na"), d && d.typeKeywords && l.some(d.typeKeywords,
                function(a) {
                    if ("Service" === a) return b.type.path = c + "/srv:serviceType/gco:LocalName", !0
                })) : b.url.path = g + "/gmd:distributionInfo/gmd:MD_Distribution/gmd:transferOptions/gmd:MD_DigitalTransferOptions/gmd:onLine/gmd:CI_OnlineResource/gmd:linkage/gmd:URL"
        }
    })
});