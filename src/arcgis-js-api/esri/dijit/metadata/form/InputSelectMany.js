//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/dom-construct", "dojo/has", "../base/InputBase", "../base/OptionsMixin", "dojo/text!./templates/InputSelectMany.html", "../../../kernel"], function(k, g, c, e, q, l, m, n, r) {
    return k([l, m], {
        _supportsMultipleValues: !0,
        checkBoxes: null,
        templateString: n,
        subTarget: null,
        postCreate: function() {
            this.inherited(arguments);
            this.checkBoxes = []
        },
        startup: function() {
            this._started || (this.inherited(arguments), this.initializeOptions())
        },
        addOption: function(a, b) {
            var p =
                this,
                d = this.id + "_chk" + b,
                c = e.create("div", {
                    "class": "gxeOption"
                }, this.optionsNode),
                h = a.label,
                f = {
                    id: d,
                    type: "checkbox",
                    value: a.value
                };
            a.selected && (f.checked = "checked");
            f.onclick = function() {
                p._onClick(this)
            };
            f = e.create("input", f, c);
            f.xtnLabel = h;
            this.checkBoxes.push(f);
            d = e.create("label", {
                "for": d
            }, c);
            this.setNodeText(d, h)
        },
        filterOptions: function(a) {
            if (!this.parentXNode || !this.parentXNode.optionsFilter) return a;
            var b = this.parentXNode.optionsFilter.split(",");
            return c.filter(a, function(a) {
                return c.some(b,
                    function(b) {
                        return a.value === b
                    })
            })
        },
        getDisplayValue: function() {
            var a = [];
            c.forEach(this.checkBoxes, function(b) {
                b.checked && a.push(b.xtnLabel)
            });
            return 1 === a.length ? a[0] : 1 < a.length ? a : null
        },
        getInputValue: function() {
            var a = [];
            c.forEach(this.checkBoxes, function(b) {
                b.checked && a.push(b.value)
            });
            return 1 === a.length ? a[0] : 1 < a.length ? a : null
        },
        importValues: function(a, b) {
            c.forEach(this.checkBoxes, function(a) {
                var d, e = c.some(b, function(b) {
                    if (null != b) return d = g.trim(b), d === a.value
                });
                a.checked = e
            });
            this.applyViewOnly()
        },
        initializeOptions: function() {
            this.fetchOptionWidgets().then(g.hitch(this, function(a) {
                a = this.filterOptions(a);
                this.populateOptions(a)
            }), g.hitch(this, function(a) {
                console.error(a)
            }), g.hitch(this, function(a) {}))
        },
        _onClick: function(a) {
            this.emitInteractionOccurred()
        },
        populateOptions: function(a) {
            c.forEach(a, function(a, b) {
                this.addOption(a, b)
            }, this);
            var b = this.containerNode;
            this.destroyDescendants(!1);
            setTimeout(function() {
                e.destroy(b)
            }, 5E3)
        }
    })
});