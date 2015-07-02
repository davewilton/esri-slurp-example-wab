//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom-geometry", "dojo/dom-style", "dojo/has", "dojo/window", "../../../kernel"], function(f, h, d, e, k, g, l) {
    return f(null, {
        constructor: function(a) {
            h.mixin(this, a)
        },
        _getMaxCanvasHeight: function(a) {
            var b = 0,
                c;
            c = this.validationPane.domNode;
            this.dialogBroker ? (a = d.getMarginBox(this.domNode), b = d.getMarginBox(this.primaryToolbar.domNode), b = a.h - b.h - 75, "none" !== c.style.display && (c = d.getMarginBox(c), b -= c.h)) : (c = g.getBox(this.ownerDocument), a = d.getMarginBox(a), b = c.h - a.t -
                10);
            return b
        },
        resizeDocument: function(a) {
            a = a.domNode;
            var b = this._getMaxCanvasHeight(a);
            10 < b && e.set(a, "maxHeight", b - 10 + "px")
        },
        resizeXmlPane: function(a) {
            a = this.xmlPane.textAreaNode;
            var b = this._getMaxCanvasHeight(a);
            this.dialogBroker || (b -= 10);
            10 < b && e.set(a, "height", b - 10 + "px")
        },
        resize: function() {
            if (this.dialogBroker) {
                var a = g.getBox(this.ownerDocument),
                    b = d.getMarginBox(this.domNode),
                    c = b.l,
                    f = Math.round(0.95 * a.w) - 100,
                    a = a.h - b.t - c - 50;
                e.set(this.domNode, "width", f + "px");
                e.set(this.domNode, "height", a + "px")
            }
            this.resizeDocument(this.editDocumentPane);
            this.resizeDocument(this.viewDocumentPane);
            this.resizeXmlPane()
        }
    })
});