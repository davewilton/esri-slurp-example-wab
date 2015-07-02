//>>built
require({
    cache: {
        "url:esri/dijit/geoenrichment/DataBrowser/templates/VariableInfo.html": '\x3cdiv\x3e\r\n    \x3cdiv class\x3d"VariableInfo_Header"\x3e${nls.name}\x3c/div\x3e\r\n    \x3cdiv class\x3d"VariableInfo_Value" data-dojo-attach-point\x3d"divDescription"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"VariableInfo_Spacer"\x3e\x26nbsp;\x3c/div\x3e\r\n    \x3cdiv class\x3d"VariableInfo_Header"\x3e${nls.variable}\x3c/div\x3e\r\n    \x3cdiv class\x3d"VariableInfo_Value" data-dojo-attach-point\x3d"divID2"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"VariableInfo_Spacer"\x3e\x26nbsp;\x3c/div\x3e\r\n    \x3cdiv class\x3d"VariableInfo_Header"\x3e${nls.source}\x3c/div\x3e\r\n    \x3cdiv class\x3d"VariableInfo_Value" data-dojo-attach-point\x3d"divSource"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"VariableInfo_Spacer"\x3e\x26nbsp;\x3c/div\x3e\r\n    \x3cdiv class\x3d"VariableInfo_Header"\x3e${nls.vintage}\x3c/div\x3e\r\n    \x3cdiv class\x3d"VariableInfo_Value" data-dojo-attach-point\x3d"divVintage"\x3e\x3c/div\x3e\r\n\x3c/div\x3e'
    }
});
define(["../../../declare", "dojox/mvc/Templated", "dijit/_WidgetBase", "dojo/text!./templates/VariableInfo.html", "dojo/i18n!../../../nls/jsapi"], function(c, d, e, f, b) {
    b = b.geoenrichment.dijit.VariableInfo;
    return c("esri.dijit.geoenrichment.VariableInfo", [e, d], {
        nls: b,
        templateString: f,
        constructor: function() {
            this.inherited(arguments)
        },
        buildRendering: function() {
            this.inherited(arguments)
        },
        _setVariableAttr: function(a) {
            this.divDescription.innerHTML = a.description ? a.description : a.alias;
            this.divID2.innerHTML = a.id2;
            this.divSource.innerHTML = "";
            for (var b in a.filteringTags)
                if ("Source" === a.filteringTags[b].id) {
                    this.divSource.innerHTML = a.filteringTags[b].value;
                    break
                }
            this.divVintage.innerHTML = a.vintage
        }
    })
});