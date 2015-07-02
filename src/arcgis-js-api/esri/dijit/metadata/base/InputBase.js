//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/dom-attr", "dojo/dom-class", "dojo/dom-construct", "dojo/has", "./etc/docUtil", "./Templated", "../../../kernel"], function(d, e, f, b, c, g, m, h, k, n) {
    return d([k], {
        _isGxeInput: !0,
        _supportsMultipleValues: !1,
        parentXNode: null,
        hint: null,
        postCreate: function() {
            this.inherited(arguments)
        },
        applyHint: function() {
            var a = this.hint;
            if (this.hintNode && !("undefined" === typeof a || null === a) && this.parentXNode && this.parentXNode.gxeDocument && !this.parentXNode.gxeDocument.isViewOnly) a =
                e.trim(a), 0 !== a.length && (this.setNodeText(this.hintNode, a), c.add(this.hintNode, "populated"))
        },
        applyViewOnly: function() {
            if (this.viewOnlyNode && this.parentXNode && this.parentXNode.gxeDocument && this.parentXNode.gxeDocument.isViewOnly) {
                var a = this.getDisplayValue();
                "undefined" === typeof a || null === a || (a.push && 1 === a.length && (a = a[0]), a.push ? (this.viewOnlyNode.innerHTML = "", f.forEach(a, function(a) {
                    var b = g.create("div", {
                        "class": "gxeParagraph"
                    }, this.viewOnlyNode);
                    this.setNodeText(b, a)
                }, this)) : this.setNodeText(this.viewOnlyNode,
                    a), c.add(this.viewOnlyNode, "populated"))
            }
        },
        connectXNode: function(a, l) {
            l ? this.focusNode && (this.focusNode.disabled = !0) : this.applyHint();
            this.focusNode && (a && a.fixed) && (this.focusNode.disabled = !0);
            a && a.gxePath && (this.focusNode ? b.set(this.focusNode, "data-gxe-for", a.gxePath) : b.set(this.domNode, "data-gxe-for", a.gxePath))
        },
        emitInteractionOccurred: function(a) {
            a || (a = {
                inputWidget: this
            });
            this.emit("interaction-occurred", a)
        },
        ensureFocus: function() {
            h.ensureVisibility(this);
            this.focusNode && this.focusNode.focus()
        },
        getDisplayValue: function() {
            return this.getInputValue()
        },
        getInputValue: function() {
            return null
        },
        getXmlValue: function() {
            return this.getInputValue()
        },
        importValue: function(a, b) {
            this.setInputValue(b)
        },
        importValues: function(a, b) {},
        setInputValue: function(a) {}
    })
});