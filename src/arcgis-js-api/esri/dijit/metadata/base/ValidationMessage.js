//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/dom-class", "dojo/has", "dojo/window", "./Templated", "dojo/text!./templates/ValidationMessage.html", "../../../kernel"], function(k, l, m, b, q, h, n, p, r) {
    return k([n], {
        _isGxeValidationMessage: !0,
        message: null,
        inputWidget: null,
        isValid: !1,
        templateString: p,
        validationPane: null,
        postCreate: function() {
            this.inherited(arguments);
            this.inputWidget && this.own(this.inputWidget.on("interaction-occurred", l.hitch(this, function(a) {
                this._check()
            })));
            this._updateIcon(this.isValid)
        },
        _check: function() {
            if (this.inputWidget && this.inputWidget.parentXNode) {
                var a = this.inputWidget.parentXNode.validateValue();
                this._updateIcon(a.isValid);
                this.setNodeText(this.messageNode, a.message)
            }
        },
        _ensureInputFocus: function(a) {
            this.inputWidget && this.inputWidget.ensureFocus && (this.inputWidget.ensureFocus(), this._scrollOnClick())
        },
        _onIconClick: function(a) {
            this._ensureInputFocus()
        },
        _onMessageClick: function(a) {
            this._ensureInputFocus()
        },
        _scrollOnClick: function() {
            if (this.validationPane) {
                var a = !1,
                    c = !1,
                    f = null,
                    e = null;
                m.forEach(this.validationPane.getChildren(), function(g) {
                    var d = g.domNode;
                    g === this ? (a = !0, b.add(d, "current")) : g._isGxeValidationMessage && (a ? (e || (e = d), b.contains(d, "current") && a && (c = !0)) : f = d, b.remove(d, "current"))
                }, this);
                c && f ? h.scrollIntoView(f) : e && h.scrollIntoView(e)
            }
        },
        _updateIcon: function(a) {
            var c = this.iconNode;
            a ? (b.remove(c, "gxeIconWarning"), b.add(c, "gxeIconSuccess")) : (b.remove(c, "gxeIconSuccess"), b.add(c, "gxeIconWarning"))
        }
    })
});