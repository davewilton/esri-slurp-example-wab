//>>built
define(["../../kernel", "dijit/form/Select", "dojo/_base/array", "dojo/_base/declare", "dojo/_base/lang", "dojo/dom-class", "dojo/has"], function(g, e, d, f, h, c, k) {
    return f("esri.dijit.SymbolStyler.IconSelect", [e], {
        baseClass: "esriIconSelect dijitSelect dijitValidationTextBox",
        _extraIconClass: null,
        addIconOptions: function(a, b) {
            b = b || "";
            var c = d.map(a, function(a) {
                return {
                    value: a,
                    iconClass: b + " " + a
                }
            });
            this.addOption(c)
        },
        _getMenuItemForOption: function(a) {
            var b = this.inherited(arguments);
            b.set("iconClass", a.iconClass);
            return b
        },
        _setValueAttr: function(a) {
            this.inherited(arguments);
            var b = this.containerNode;
            c.remove(b, this._getAllIconClasses());
            c.add(b, this.get("selectedOptions").iconClass)
        },
        _getAllIconClasses: function() {
            return d.map(this.options, function(a) {
                return a.iconClass
            })
        }
    })
});