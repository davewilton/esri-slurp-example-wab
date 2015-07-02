//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "dojo/Deferred", "../../../kernel"], function(d, e, f, h, g, k) {
    return d(null, {
        constructor: function(a) {
            e.mixin(this, a)
        },
        fetchOptionWidgets: function() {
            var a = new g,
                b = null,
                c = [];
            f.forEach(this.getChildren(), function(a) {
                a._isGxeOptions ? b = a : a._isGxeOption && c.push(a)
            });
            return null === b ? (a.resolve(c), a) : b.fetchOptionWidgets()
        }
    })
});