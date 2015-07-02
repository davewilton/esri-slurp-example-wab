//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../base/InputBase", "dojo/text!./templates/InputText.html", "../../../kernel"], function(d, e, h, f, g, k) {
    return d([f], {
        templateString: g,
        size: 60,
        small: !1,
        maxlength: 2048,
        useUniqueId: !1,
        regenerateIfTemplate: !1,
        postCreate: function() {
            this.inherited(arguments)
        },
        postMixInProperties: function() {
            this.inherited(arguments);
            this.small && (this.size = 30)
        },
        connectXNode: function(a, b) {
            this.inherited(arguments);
            var c = a.value;
            !b && this.useUniqueId && this.setInputValue(this._generateId());
            (!b || a.fixed) && "undefined" !== typeof c && null !== c && this.setInputValue(c)
        },
        _generateId: function() {
            var a = null,
                a = "function" === typeof Date.now ? Date.now() : (new Date).getTime(),
                b = ("" + Math.random()).replace("0.", "r");
            return (a + "" + b).replace(/-/g, "")
        },
        getInputValue: function() {
            return this.focusNode.value
        },
        importValue: function(a, b) {
            if (this.useUniqueId) try {
                (!a.asTemplate || !this.regenerateIfTemplate) && null !== b && 0 < e.trim(b).length && this.setInputValue(b)
            } catch (c) {} else this.setInputValue(b)
        },
        _onChange: function(a) {
            this.emitInteractionOccurred()
        },
        _onKeyup: function(a) {
            this.emitInteractionOccurred()
        },
        setInputValue: function(a) {
            "undefined" === typeof a && (a = null);
            this.focusNode.value = a;
            this.emitInteractionOccurred();
            this.applyViewOnly()
        }
    })
});