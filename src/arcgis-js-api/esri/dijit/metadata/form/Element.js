//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/dom-class", "dojo/dom-construct", "dojo/has", "../base/XNode", "dojo/text!./templates/Element.html", "../base/ElementHeader", "../base/MultiplicityHeader", "../base/etc/viewOnlyUtil", "./InputText", "../../../kernel"], function(d, n, e, p, f, q, g, h, k, l, r, m, s) {
    return d([g], {
        _isGxeElement: !0,
        elementHeader: null,
        multiplicityHeader: null,
        templateString: h,
        label: null,
        target: null,
        minOccurs: 1,
        maxOccurs: 1,
        matchTopNode: null,
        preferOpen: !1,
        showHeader: !0,
        trackMultiplicity: !0,
        useTabs: !0,
        postCreate: function() {
            this.inherited(arguments)
        },
        startup: function() {
            this._started || (this.buildPath(), this.gxeDocument && this.gxeDocument.beforeInitializeElement(this), this.initializeElement(), this.gxeDocument && this.gxeDocument.afterInitializeElement(this), this.inherited(arguments))
        },
        connectInputWidget: function(a) {
            var c = this.gxeDocument && this.gxeDocument.isViewOnly,
                b = this.findInputWidget();
            !b && a && 0 === this.getChildren().length && (a = f.create("div", {}, this.containerNode), b = new m({}, a));
            b && (this.inputWidget =
                b, b.parentXNode = this, b.connectXNode(this, c))
        },
        findAttributes: function() {
            var a = [];
            this._findAttributes(this, a);
            return a
        },
        _findAttributes: function(a, c) {
            var b = !0;
            a._isGxeElement ? b = a === this : a._isGxeAttribute && (b = !1, c.push(a));
            b && e.forEach(a.getChildren(), function(a) {
                this._findAttributes(a, c)
            }, this)
        },
        initializeElement: function() {
            var a;
            this.getLabelString();
            var c = this.gxeDocument && this.gxeDocument.isViewOnly;
            a = this.findInputWidget();
            "unbounded" !== this.maxOccurs && 1 >= this.maxOccurs ? this.trackMultiplicity = !1 : a && a._supportsMultipleValues && (this.trackMultiplicity = !1);
            this.showHeader && this.trackMultiplicity ? (this.multiplicityHeader = a = new l({
                label: this.getLabelString(),
                target: this.target,
                minOccurs: this.minOccurs,
                maxOccurs: this.maxOccurs,
                preferOpen: this.preferOpen,
                showHeader: this.showHeader,
                useTabs: this.useTabs
            }), a.initialize(this), this.connectInputWidget(!0), c && this.multiplicityHeader.tools && (this.multiplicityHeader.tools.domNode.style.display = "none")) : (this.showHeader && (this.elementHeader = a = new k, a.initialize(this)),
                this.connectInputWidget(!0))
        },
        toggleContent: function(a) {
            this.hide || (this.elementHeader && this.elementHeader.toggleContent ? this.elementHeader.toggleContent(a) : this.multiplicityHeader && this.multiplicityHeader.toggleContent && this.multiplicityHeader.toggleContent(a))
        }
    })
});