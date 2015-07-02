//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/dom-class", "dojo/dom-construct", "dojo/has", "../base/XNode", "../base/LabelMixin", "dojo/text!./templates/Attribute.html", "./InputText"], function(d, n, p, g, e, q, h, k, l, m, r) {
    return d([h, k], {
        _isGxeAttribute: !0,
        templateString: l,
        label: null,
        target: null,
        fixed: !1,
        minOccurs: 0,
        maxOccurs: 1,
        preferOpen: !1,
        showHeader: !0,
        postCreate: function() {
            this.inherited(arguments)
        },
        startup: function() {
            this._started || (this.buildPath(), this.gxeDocument && this.gxeDocument.beforeInitializeAttribute(this),
                this.initializeAttribute(), this.gxeDocument && this.gxeDocument.afterInitializeAttribute(this), this.inherited(arguments))
        },
        connectInputWidget: function(b) {
            var c = this.gxeDocument && this.gxeDocument.isViewOnly,
                a = this.findInputWidget();
            !a && b && (b = e.create("div", {}, this.containerNode), a = new m({}, b));
            a && (this.inputWidget = a, a.parentXNode = this, a.connectXNode(this, c))
        },
        initializeAttribute: function() {
            var b = this.getLabelString(),
                c = 0 === this.minOccurs,
                a = this.preferOpen,
                d = this.labelNode,
                f = this.containerNode;
            this.showHeader ?
                this.initializeLabel(b, c, a, d, f) : (this.preferOpen = !0, this._contentIsOptional = c, this._contentNode = f, this.toggleContent(this.preferOpen), g.remove(this.domNode, "gxeIndent"), this.headerNode && (e.destroy(this.headerNode), this.labelNode = this.headerNode = null));
            this.connectInputWidget(!0)
        }
    })
});