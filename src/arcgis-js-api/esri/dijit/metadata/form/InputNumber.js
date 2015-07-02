//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "./InputText", "dojo/i18n!../nls/i18nBase", "../../../kernel"], function(b, d, e, c, a, f) {
    return b([c], {
        _isGxeInputNumber: !0,
        hint: a.hints.number,
        integerOnly: !1,
        minValue: null,
        maxValue: null,
        minValueIsExclusive: !1,
        maxValueIsExclusive: !1,
        small: !0,
        postCreate: function() {
            this.inherited(arguments)
        },
        postMixInProperties: function() {
            this.inherited(arguments);
            this.integerOnly && this.hint === a.hints.number && (this.hint = a.hints.integer)
        }
    })
});