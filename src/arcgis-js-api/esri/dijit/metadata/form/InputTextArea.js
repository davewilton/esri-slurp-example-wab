//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "../base/InputBase", "dojo/text!./templates/InputTextArea.html", "../../../kernel"], function(d, e, f, k, g, h, l) {
    return d([g], {
        templateString: h,
        large: !1,
        cols: 50,
        rows: 4,
        postCreate: function() {
            this.inherited(arguments)
        },
        postMixInProperties: function() {
            this.inherited(arguments);
            this.large && (this.cols = 60, this.rows = 8)
        },
        connectXNode: function(a, b) {
            this.inherited(arguments);
            var c = a.value;
            (!b || a.fixed) && "undefined" !== typeof c && null !== c && this.setInputValue(c)
        },
        getDisplayValue: function() {
            var a = this.focusNode.value,
                b = [];
            if (null === a) return null;
            a = a.replace(/(\r\n|\r|\n|\n\r)/g, "\x3cbr/\x3e");
            a = a.split("\x3cbr/\x3e");
            f.forEach(a, function(a) {
                a = e.trim(a);
                0 < a.length && b.push(a)
            });
            return 1 === b.length ? b[0] : 1 < b.length ? b : null
        },
        getInputValue: function() {
            return this.focusNode.value
        },
        _onChange: function(a) {
            this.emitInteractionOccurred()
        },
        _onKeyup: function(a) {
            this.emitInteractionOccurred()
        },
        setInputValue: function(a) {
            "undefined" === typeof a && (a = null);
            this.focusNode.value =
                a;
            this.emitInteractionOccurred();
            this.applyViewOnly()
        }
    })
});