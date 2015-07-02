//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom-style", "dojo/has", "./MandatoryLabel", "./OptionalLabel", "../../../kernel"], function(g, e, b, l, h, k, m) {
    return g(null, {
        _contentIsOptional: !1,
        _contentNode: null,
        _isOptionallyOff: !1,
        labelWidget: null,
        constructor: function(a) {
            e.mixin(this, a)
        },
        initializeLabel: function(a, c, b, f, d) {
            this._contentIsOptional = c;
            this._contentNode = d;
            this._isOptionallyOff = !1;
            d = "";
            c ? (b ? (d = 'checked\x3d"checked"', this.toggleContent(!0)) : this.toggleContent(!1), this.labelWidget = new k({
                label: a,
                checkedAttr: d,
                onClick: e.hitch(this, function(a) {
                    this.toggleContent(a, !0)
                })
            }, f)) : (this.labelWidget = new h({
                label: a
            }, f), this.toggleContent(!0))
        },
        toggleContent: function(a, c) {
            !this.hide && this._contentNode && (a ? b.set(this._contentNode, "display", "block") : b.set(this._contentNode, "display", "none"), this._contentIsOptional && (this._isOptionallyOff = !a, !c && (this.labelWidget && this.labelWidget.checkBoxNode) && (this.labelWidget.checkBoxNode.checked = a), this.whenOptionalContentToggled(!a)))
        },
        whenOptionalContentToggled: function(a) {}
    })
});