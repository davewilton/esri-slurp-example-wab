//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../../base/Templated", "dojo/text!./templates/ClickableTool.html", "../../../../kernel"], function(c, f, g, d, e, h) {
    return c([d], {
        _isGxeInputTool: !0,
        templateString: e,
        label: "",
        postCreate: function() {
            this.inherited(arguments)
        },
        findInputWidget: function(b) {
            b = null;
            for (var a = this.getParent(); a;) {
                if (a._isGxeInput) return a;
                if (a._isGxeElement) {
                    b = a;
                    break
                }
                if (a._isGxeAttribute) {
                    b = a;
                    break
                }
                a = a.getParent()
            }
            return b && b.inputWidget ? b.inputWidget : null
        },
        _onToolClick: function(b) {
            var a =
                this.findInputWidget(b);
            this.whenToolClicked(b, a)
        },
        whenToolClicked: function(b, a) {}
    })
});