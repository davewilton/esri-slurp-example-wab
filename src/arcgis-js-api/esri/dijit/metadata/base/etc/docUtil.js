//>>built
define(["dojo/_base/lang", "dojo/_base/array", "dojo/has", "../../../../kernel"], function(e, f, g, h) {
    return {
        ensureVisibility: function(a) {
            var b = a;
            for (a = a.getParent(); a;) a._isGxeTabs ? a.ensureActiveTab(b) : a._isGxeMultiplicityHeader && a.useTabs && a.ensureActiveTab(b), b = a, a = a.getParent()
        },
        findElementChoice: function(a, b) {
            var d;
            d = a;
            for (var c = a.getParent(); c;) {
                if (c._isGxeElementChoice) return b && (c.ensureActiveTab(d), (d = c.getParent()) && d.toggleContent && d.toggleContent(!0)), c;
                d = c;
                c = c.getParent()
            }
            return null
        },
        findDescriptor: function(a) {
            for (a =
                a.getParent(); a;) {
                if (a._isGxeDescriptor) return a;
                a = a.getParent()
            }
            return null
        },
        findDescriptorAndPath: function(a) {
            var b = {
                descriptor: null,
                path: ""
            };
            a._isGxeNode && (b.path = "" + a.target);
            for (a = a.getParent(); a;) {
                a._isGxeElement && (b.path = a.target + "/" + b.path);
                if (a._isGxeDescriptor) {
                    b.descriptor = a;
                    break
                }
                a = a.getParent()
            }
            return b
        },
        findGxeContext: function(a) {
            if (a.gxeContext) return a.gxeContext;
            for (a = a.getParent(); a;) {
                if (a.gxeContext) return a.gxeContext;
                a = a.getParent()
            }
            return null
        },
        findGxeDocument: function(a) {
            if (a.gxeDocument) return a.gxeDocument;
            for (a = this.getParent(); a;) {
                if (a.gxeDocument) return a.gxeDocument;
                a = a.getParent()
            }
            return null
        },
        setI18nNodeText: function(a, b) {
            "undefined" === typeof b && (b = null);
            a.innerHTML = "";
            null !== b && a.appendChild(document.createTextNode(b))
        },
        setNodeText: function(a, b) {
            "undefined" === typeof b && (b = null);
            a.innerHTML = "";
            null !== b && a.appendChild(document.createTextNode(b))
        }
    }
});