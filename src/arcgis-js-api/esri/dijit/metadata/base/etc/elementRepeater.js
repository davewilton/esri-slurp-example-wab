//>>built
define(["dojo/_base/lang", "dojo/_base/array", "dojo/has", "dojo/Deferred", "./docUtil", "./matchTopNodeUtil", "../../../../kernel"], function(n, h, p, k, l, m, q) {
    return {
        _findClonedElement: function(f, b, e, a) {
            var c = null,
                d = !0,
                g;
            if (b._isGxeElement)
                if (a = null != a ? a + "/" : "", a += b.target, e === a) {
                    if (d = !1, g = m.evaluateXNodeMatch(f, b)) return b
                } else d = !1, 0 === e.indexOf(a) && (d = !0);
            else b._isGxeAttribute ? d = !1 : b._isGxeDescriptor && null != a && (d = !1);
            d && h.some(b.getChildren(), function(b) {
                if (c = this._findClonedElement(f, b, e, a)) return !0
            }, this);
            return c
        },
        repeatElement: function(f, b, e) {
            var a = new k;
            if (!b._isGxeElement) return a.resolve(null), a;
            var c = l.findDescriptorAndPath(b);
            if (!c.descriptor) return console.error("repeatElement: Unable to locate parent Descriptor for: ", b), a.resolve(null), a;
            var d = c.path,
                g = c.descriptor.newInstance();
            if (!g) return console.error("repeatElement: Cannot create a new Descriptor was null: ", b), a.resolve(null), a;
            (c = this._findClonedElement(b, g, c.path, null)) ? (f.adoptElement(c, e), a.resolve(c)) : (console.error("repeatElement: Unable to locate new element instance for: ",
                d, b), a.resolve(null));
            return a
        }
    }
});