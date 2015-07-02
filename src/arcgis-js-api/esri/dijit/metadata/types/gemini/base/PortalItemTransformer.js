//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../../inspire/base/PortalItemTransformer", "../../../../../kernel"], function(a, d, e, b, f) {
    return a([b], {
        postCreate: function() {
            this.inherited(arguments)
        },
        populateTransformationInfo: function(a, b, c) {
            this.inherited(arguments);
            c.url.path = a.rootElement.gxePath + "/gmd:distributionInfo/gmd:MD_Distribution/gmd:transferOptions/gmd:MD_DigitalTransferOptions/gmd:onLine/gmd:CI_OnlineResource/gmd:linkage/gmd:URL"
        }
    })
});