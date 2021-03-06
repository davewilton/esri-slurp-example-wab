//>>built
define(["dojo/_base/lang", "dojo/has", "./kernel"], function(g, h, k) {
    return {
        _dfdCanceller: function(a) {
            a.canceled = !0;
            var b = a._pendingDfd; - 1 === a.fired && (b && -1 === b.fired) && b.cancel();
            a._pendingDfd = null
        },
        _fixDfd: function(a) {
            var b = a.then;
            a.then = function(a, c, f) {
                if (a) {
                    var d = a;
                    a = function(a) {
                        return a && a._argsArray ? d.apply(null, a) : d(a)
                    }
                }
                return b.call(this, a, c, f)
            };
            return a
        },
        _resDfd: function(a, b, e) {
            var c = b.length;
            1 === c ? e ? a.errback(b[0]) : a.callback(b[0]) : 1 < c ? (b._argsArray = !0, a.callback(b)) : a.callback()
        }
    }
});