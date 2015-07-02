//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/dom-class", "dojo/dom-construct", "dojo/dom-style", "dojo/has", "../base/Templated", "dojo/text!./templates/Tabs.html", "../base/TabButton", "../base/TabRadio", "../../../kernel"], function(h, f, e, g, k, d, q, l, m, n, p, r) {
    return h([l], {
        _activeTabButton: null,
        _isGxeTabs: !0,
        _tabButtons: null,
        templateString: m,
        useRadios: !1,
        postCreate: function() {
            this.inherited(arguments);
            this._tabButtons = []
        },
        startup: function() {
            this._started || (this.inherited(arguments), this._buildTabs())
        },
        _activateTab: function(a) {
            var c = this.useRadios;
            e.forEach(this._tabButtons, function(b) {
                b === a ? (g.add(b.domNode, "current"), d.set(b.tabWgt.domNode, "display", "block"), c && (b.tabWgt._isOptionallyOff = !1)) : (g.remove(b.domNode, "current"), d.set(b.tabWgt.domNode, "display", "none"), c && (b.tabWgt._isOptionallyOff = !0))
            })
        },
        _addTab: function(a) {
            var c = this._getLabel(a);
            d.set(a.domNode, "display", "none");
            var b = null,
                b = this.id + "_radios",
                b = this.useRadios ? new p({
                    label: c,
                    tabWgt: a,
                    radioName: b,
                    onClick: f.hitch(this, function(a) {
                        this._activateTab(a)
                    })
                }) :
                new n({
                    label: c,
                    tabWgt: a,
                    onClick: f.hitch(this, function(a) {
                        this._activateTab(a)
                    })
                });
            a.hide && d.set(b.domNode, "display", "none");
            k.place(b.domNode, this.tabsNode, "last");
            this._tabButtons.push(b);
            return b
        },
        _buildTabs: function() {
            var a = null;
            e.forEach(this.getChildren(), function(a) {
                this._addTab(a)
            }, this);
            0 < this._tabButtons.length && (a = this._tabButtons[0], a.radioName && a.setChecked(!0), this._activateTab(a), d.set(this.domNode, "display", "block"))
        },
        ensureActiveTab: function(a) {
            e.some(this._tabButtons, function(c) {
                if (c.tabWgt ===
                    a) return this._activateTab(c), this.useRadios && c.setChecked && c.setChecked(!0), !0
            }, this)
        },
        _getLabel: function(a) {
            return "function" === typeof a.getLabelString ? a.getLabelString() : "string" === typeof a.label ? a.label : "Untitled"
        }
    })
});