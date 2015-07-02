//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/dom-class", "dojo/dom-construct", "dojo/dom-style", "dojo/has", "../base/Templated", "../base/ValidationMessage", "dojo/text!./templates/ValidationPane.html", "../../../kernel"], function(e, m, f, d, g, c, n, h, k, l, p) {
    return e([h], {
        editor: null,
        templateString: l,
        postCreate: function() {
            this.inherited(arguments)
        },
        _addChild: function(b, a, c) {
            var d = g.create("div", {}, this.containerNode);
            new k({
                message: b,
                inputWidget: a,
                isValid: c,
                validationPane: this
            }, d)
        },
        addWarning: function(b,
            a) {
            this._addChild(b, a);
            this._toggleClear(!0);
            this._toggleVisibility(!0);
            this.editor && this.editor.editDocumentPane && d.add(this.editor.editDocumentPane.domNode, "gxeRepairMode")
        },
        clearMessages: function() {
            f.forEach(this.getChildren(), function(a) {
                a._isGxeValidationMessage && a.destroyRecursive(!1)
            });
            this._toggleClear(!1);
            this._toggleVisibility(!1);
            try {
                this.containerNode.scrollTop = 0
            } catch (b) {}
        },
        _onClearClick: function(b) {
            this.clearMessages()
        },
        _toggleClear: function(b) {
            var a = this.clearNode;
            b ? c.set(a, "display",
                "inline-block") : c.set(a, "display", "none")
        },
        _toggleVisibility: function(b) {
            var a = this.domNode;
            b ? c.set(a, "display", "block") : c.set(a, "display", "none");
            this.editor && this.editor.editDocumentPane && (d.remove(this.editor.editDocumentPane.domNode, "gxeRepairMode"), this.editor.resizeDocument(this.editor.editDocumentPane))
        },
        whenComplete: function() {
            this.editor && this.editor.editDocumentPane && d.contains(this.editor.editDocumentPane.domNode, "gxeRepairMode") && this.editor.resizeDocument(this.editor.editDocumentPane)
        }
    })
});