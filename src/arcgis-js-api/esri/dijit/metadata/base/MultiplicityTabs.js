//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/dom-class", "dojo/dom-construct", "dojo/has", "./Templated", "dojo/text!./templates/MultiplicityTabs.html", "./TabButton", "../../../kernel"], function(e, f, c, d, g, m, h, k, l, n) {
    return e([h], {
        multiplicityHeader: null,
        templateString: k,
        postCreate: function() {
            this.inherited(arguments)
        },
        activateTab: function(a) {
            if (a) {
                this.highlightTab(a);
                var b = a.tabIndex;
                this._setCurrentIndex(b);
                a = this.getElements();
                c.forEach(a, function(a, d) {
                    a.domNode.style.display = d ===
                        b ? "block" : "none"
                });
                this._updateTools(a)
            }
        },
        addTabButton: function() {
            var a = this.getCurrentIndex(),
                b = this.getChildren().length,
                b = new l({
                    label: "" + (b + 1),
                    tabIndex: b,
                    onClick: f.hitch(this, function(a) {
                        this.activateTab(a)
                    })
                });
            g.place(b.domNode, this.containerNode, "last"); - 1 === a && (this._setCurrentIndex(0), d.add(b.domNode, "current"));
            this.updateUI();
            return b
        },
        ensureTabButton: function() {
            0 === this.getChildren().length && this.addTabButton()
        },
        getCurrentIndex: function() {
            return this.multiplicityHeader._currentIndex
        },
        _setCurrentIndex: function(a) {
            this.multiplicityHeader._currentIndex =
                a
        },
        getElements: function() {
            return this.multiplicityHeader.getElements()
        },
        getMultiplicityInfo: function() {
            return this.multiplicityHeader.getMultiplicityInfo(null)
        },
        getTabButton: function(a) {
            return this.getChildren()[a]
        },
        highlightTab: function(a) {
            c.forEach(this.getChildren(), function(a) {
                d.remove(a.domNode, "current")
            });
            d.add(a.domNode, "current")
        },
        initialize: function(a) {
            this.multiplicityHeader = a;
            this.updateUI()
        },
        sync: function() {
            var a = this.getCurrentIndex(),
                b = this.getChildren();
            c.forEach(b, function(b, c) {
                b.tabIndex =
                    c;
                b.setLabel("" + (c + 1));
                c === a ? d.add(b.domNode, "current") : d.remove(b.domNode, "current")
            });
            a < b.length && this.activateTab(this.getTabButton(a));
            this.updateUI()
        },
        _updateTools: function(a) {
            this.multiplicityHeader.tools.updateUI(a)
        },
        updateUI: function() {
            1 < this.getMultiplicityInfo().numElements ? this.domNode.style.display = "inline-block" : this.domNode.style.display = "none"
        }
    })
});