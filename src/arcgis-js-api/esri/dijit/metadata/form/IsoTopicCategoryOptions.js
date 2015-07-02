//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "./Option", "dojo/text!./templates/IsoTopicCategoryOptions.html", "dojo/i18n!../nls/i18nIso", "../../../kernel"], function(a, e, f, b, c, d, g) {
    return a([b], {
        i18nIso: d,
        templateString: c,
        postCreate: function() {
            this.inherited(arguments)
        }
    })
});