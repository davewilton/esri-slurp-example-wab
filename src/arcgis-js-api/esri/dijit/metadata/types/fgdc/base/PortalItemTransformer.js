//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../../../arcgis/portal/PortalItemTransformer", "../../../../../kernel"], function(b, e, f, c, g) {
    return b([c], {
        postCreate: function() {
            this.inherited(arguments)
        },
        populateTransformationInfo: function(b, c, d) {
            this.inherited(arguments);
            var a = d;
            a.id.path = "/metadata/idinfo/citation/citeinfo/edition";
            a.title.path = "/metadata/idinfo/citation/citeinfo/title";
            a.snippet.path = "/metadata/idinfo/descript/purpose";
            a.description.path = "/metadata/idinfo/descript/abstract";
            a.accessInformation.path = "/metadata/idinfo/datacred";
            a.licenseInfo.path = "/metadata/idinfo/useconst";
            a.tags.path = "/metadata/idinfo/keywords/theme/themekey";
            a.url.path = "/metadata/idinfo/citation/citeinfo/onlink";
            a.extent.xmin.path = "/metadata/idinfo/spdom/bounding/westbc";
            a.extent.ymin.path = "/metadata/idinfo/spdom/bounding/southbc";
            a.extent.xmax.path = "/metadata/idinfo/spdom/bounding/eastbc";
            a.extent.ymax.path = "/metadata/idinfo/spdom/bounding/northbc"
        }
    })
});