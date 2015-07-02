//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "./InputTextArea", "dojo/i18n!../nls/i18nBase", "../../../kernel"], function(f, g, h, m, k, l, n) {
    return f([k], {
        _supportsMultipleValues: !0,
        delimiter: ",",
        hint: l.hints.delimitedTextArea,
        subTarget: null,
        postCreate: function() {
            this.inherited(arguments)
        },
        getDisplayValue: function() {
            var b = [],
                c, a = "";
            this._mergeTokens(b, this.focusNode.value);
            if (0 < b.length)
                for (c = 0; c < b.length; c++) 0 < a.length && (a += this.delimiter), a += b[c];
            return 0 < a.length ? a : null
        },
        getInputValue: function() {
            var b = [];
            this._mergeTokens(b, this.focusNode.value);
            return 1 === b.length ? b[0] : 1 < b.length ? b : null
        },
        importValues: function(b, c) {
            var a, e = [],
                d = "";
            for (a = 0; a < c.length; a++) this._mergeTokens(e, c[a]);
            for (a = 0; a < e.length; a++) 0 < d.length && (d += this.delimiter), d += e[a];
            this.setInputValue(d)
        },
        _mergeTokens: function(b, c) {
            var a;
            null != c && (c = c.replace(/(\r\n|\r|\n|\n\r)/g, this.delimiter), a = c.split(this.delimiter), h.forEach(a, function(a) {
                a = g.trim(a);
                0 < a.length && b.push(a)
            }))
        }
    })
});