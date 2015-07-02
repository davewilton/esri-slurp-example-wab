//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/dom-class", "dojo/dom-construct", "dojo/has", "./Templated", "dojo/text!./templates/MultiplicityTools.html", "../../../kernel"], function(h, m, g, e, f, n, k, l, p) {
    return h([k], {
        _isGxeMultiplicityTools: !0,
        multiplicityHeader: null,
        templateString: l,
        postCreate: function() {
            this.inherited(arguments)
        },
        getCurrentIndex: function(a) {
            return this.multiplicityHeader.getCurrentIndex(a)
        },
        _setCurrentIndex: function(a) {
            this.multiplicityHeader.useTabs && (this.multiplicityHeader._currentIndex =
                a)
        },
        getElements: function() {
            return this.multiplicityHeader.getElements()
        },
        getMultiplicityInfo: function(a) {
            return this.multiplicityHeader.getMultiplicityInfo(a)
        },
        getSiblings: function(a) {
            if (this.multiplicityHeader.useTabs) return [];
            var b = [];
            a || (a = this.getElements());
            g.forEach(a, function(a) {
                var d = null;
                a.multiplicityHeader && (d = a.multiplicityHeader.tools) && d !== this && b.push(d)
            }, this);
            return b
        },
        getTabs: function() {
            return this.multiplicityHeader.tabs
        },
        initialize: function(a) {
            this.multiplicityHeader = a;
            this.isRepeatable() ?
                this.domNode.style.display = "inline-block" : this.domNode.style.display = "none";
            this.updateUI(null)
        },
        isRepeatable: function() {
            return this.multiplicityHeader.isElementRepeatable()
        },
        moveElementDownClicked: function() {
            var a = this.getMultiplicityInfo();
            if (a.canMoveDown) {
                var b = this.getTabs(),
                    c = a.elements,
                    a = a.currentIndex;
                f.place(c[a].domNode, c[a + 1].domNode, "after");
                b && (a++, this._setCurrentIndex(a), b.highlightTab(b.getTabButton(a)));
                c = this.getElements();
                this.updateUI(c);
                b || this.updateSiblings(c)
            }
        },
        moveElementUpClicked: function() {
            var a =
                this.getMultiplicityInfo();
            if (a.canMoveUp) {
                var b = this.getTabs(),
                    c = a.elements,
                    a = a.currentIndex;
                f.place(c[a].domNode, c[a - 1].domNode, "before");
                b && (a--, this._setCurrentIndex(a), b.highlightTab(b.getTabButton(a)));
                c = this.getElements();
                this.updateUI(c);
                b || this.updateSiblings(c)
            }
        },
        removeElementClicked: function() {
            var a = this.getMultiplicityInfo();
            if (a.canRemove) {
                var b = null,
                    c = this.getTabs(),
                    d = a.elements,
                    a = a.currentIndex,
                    e = a === d.length - 1,
                    f = d[a];
                c || (b = this.getSiblings(d));
                f.destroyRecursive(!1);
                c ? (c.getTabButton(a).destroyRecursive(!1),
                    e && this._setCurrentIndex(a - 1), c.sync(), this.updateUI(null)) : g.forEach(b, function(a) {
                    a.updateUI(null)
                })
            }
        },
        repeatElementClicked: function() {
            var a = this.getMultiplicityInfo();
            if (a.canAdd) {
                var b = a.currentIndex; - 1 === b && (b = 0);
                this.multiplicityHeader.repeatElement(a.elements[b], !0)
            }
        },
        updateSiblings: function(a) {
            if (!this.multiplicityHeader.useTabs) {
                var b = this.getSiblings(a);
                g.forEach(b, function(b) {
                    b.updateUI(a)
                })
            }
        },
        updateUI: function(a) {
            var b = function(a, b) {
                b ? (a.disabled = !1, e.remove(a, "gxeDisabledIcon")) : (a.disabled = !0, e.add(a, "gxeDisabledIcon"))
            };
            a = this.getMultiplicityInfo(a);
            b(this.repeatElementNode, a.canAdd);
            b(this.removeElementNode, a.canRemove);
            b(this.moveElementUpNode, a.canMoveUp);
            b(this.moveElementDownNode, a.canMoveDown)
        }
    })
});