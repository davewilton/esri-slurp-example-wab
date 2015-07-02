//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "dojo/query", "dijit/registry", "../../../types/iso/base/PortalItemTransformer", "../../../../../kernel"], function(b, e, g, d, f, c, h) {
    return b([c], {
        postCreate: function() {
            this.inherited(arguments)
        },
        findInputWidget: function(b, c, e) {
            if ("tags" !== b) return this.inherited(arguments);
            var a;
            if ((a = d(".gxeOtherKeywords", this.gxeDocument.rootDescriptor.domNode)) && 0 < a.length)
                if ((a = d("[data-gxe-path\x3d'" + c + "']", a[0])) && 1 === a.length)
                    if (a = f.byNode(a[0])) return a.inputWidget;
            return null
        }
    })
});