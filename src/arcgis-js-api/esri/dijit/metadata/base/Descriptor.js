//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "./Templated", "../context/DescriptorMixin", "../../../kernel"], function(b, f, c, g, d, e, h) {
    return b([d, e], {
        _isGxeDescriptor: !0,
        _replicas: null,
        postCreate: function() {
            this.inherited(arguments);
            this._replicas = []
        },
        destroy: function() {
            try {
                c.forEach(this._replicas, function(a) {
                    try {
                        a.destroyRecursive(!1)
                    } catch (b) {
                        console.error(b)
                    }
                })
            } catch (a) {
                console.error(a)
            }
            this._replicas = [];
            this.inherited(arguments)
        },
        newInstance: function() {
            var a = new this.constructor;
            this._replicas.push(a);
            return a
        }
    })
});