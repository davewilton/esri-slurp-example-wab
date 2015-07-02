//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../../tools/ClickableTool", "../../../base/etc/docUtil", "./ThemeDialog", "../../../../../kernel"], function(d, e, k, f, g, h, l) {
    return d([f], {
        postCreate: function() {
            this.inherited(arguments)
        },
        startup: function() {
            if (!this._started) {
                var c = g.findGxeContext(this);
                if (!c || !c.gemetUrl || !c.gemetInspireThemeThesaurus) this.domNode.style.display = "none"
            }
        },
        whenToolClicked: function(c, b) {
            if (b && b.parentXNode) {
                var a = b.getInputValue();
                null !== a && !a.push && (a = [a]);
                (new h({
                    gxeDocument: b.parentXNode.gxeDocument,
                    initiallySelectedValues: a,
                    onSelect: e.hitch(this, function(a) {
                        b.importValues(null, a)
                    })
                })).show()
            }
        }
    })
});