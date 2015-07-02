//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/dom-class", "dojo/dom-construct", "dojo/has", "./xml/XmlGenerator", "../../../kernel"], function(c, d, h, e, f, k, g, l) {
    return c(null, {
        _hasNamespaces: null,
        documentType: null,
        gxeContext: null,
        isViewOnly: !1,
        originalTitle: null,
        rootDescriptor: null,
        rootElement: null,
        constructor: function(a) {
            d.mixin(this, a)
        },
        afterInitializeAttribute: function(a) {
            this.documentType && this.documentType.afterInitializeAttribute(this, a)
        },
        afterInitializeElement: function(a) {
            this.documentType &&
                this.documentType.afterInitializeElement(this, a)
        },
        beforeInitializeAttribute: function(a) {
            this.documentType && this.documentType.beforeInitializeAttribute(this, a)
        },
        beforeInitializeElement: function(a) {
            this.documentType && this.documentType.beforeInitializeElement(this, a)
        },
        generateXml: function(a, b) {
            return (new g({})).generate(this, this.rootElement, a, b)
        },
        getNamespaces: function() {
            return this.documentType ? this.documentType.getNamespaces() : null
        },
        hasNamespaces: function() {
            var a, b = !1;
            null === this._hasNamespaces &&
                (a = this.getNamespaces(), null !== a && 0 < a.length && (b = !0), this._hasNamespaces = b);
            return this._hasNamespaces
        },
        initialize: function(a, b) {
            this.documentType = a;
            this.rootDescriptor = a.newRootDescriptor();
            this.rootDescriptor._isGxeRootDescriptor = !0;
            this.rootDescriptor.gxeDocument = this;
            b && (f.place(this.rootDescriptor.domNode, b, "replace"), this.rootDescriptor.startup(), this.rootElement && this.rootElement.elementHeader && e.add(this.rootElement.elementHeader.domNode, "gxeRootLabel"))
        }
    })
});