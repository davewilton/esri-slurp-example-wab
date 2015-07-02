//>>built
define(["../../declare", "dojo/_base/array", "dojo/_base/lang", "dojo/dom-class", "dojo/dom-construct", "dojo/sniff", "dojo/on", "dojo/Deferred"], function(h, n, l, e, p, s, q, m) {
    var f = function() {
            var a = document.getElementsByTagName("body")[0].style;
            f = void 0 !== a.animationName ? function() {
                return "animationend"
            } : void 0 !== a.webkitAnimationName ? function() {
                return "webkitAnimationEnd"
            } : function() {};
            return f()
        },
        r = h(null, {
            _oldNode: null,
            _targets: null,
            _deferred: null,
            start: function(a, d) {
                this._oldNode = d;
                this._deferred = new m;
                if (!f()) return this.finish(),
                    this._deferred.promise;
                this._targets = a;
                q.once(a[0].node, f(), l.hitch(this, this.finish));
                for (var b = 0; b < a.length; b++) {
                    var c = a[b];
                    e.add(c.node, c.classes);
                    e.add(c.node, "Anim_Common")
                }
                return this._deferred.promise
            },
            finish: function() {
                if (this._targets) {
                    for (var a = 0; a < this._targets.length; a++) {
                        var d = this._targets[a];
                        e.remove(d.node, d.classes);
                        e.remove(d.node, "Anim_Common")
                    }
                    this._targets = null
                }
                this._oldNode && (p.destroy(this._oldNode), this._oldNode = null);
                this._deferred.resolve()
            }
        });
    return h(null, {
        progress: null,
        _items: null,
        _flySurfaceNode: null,
        constructor: function(a) {
            this._flySurfaceNode = a;
            this._items = []
        },
        start: function(a, d) {
            var b = new r;
            this._items.push(b);
            this.progress || (this.progress = new m);
            return b.start(a, d).then(l.hitch(this, this._onItemFinished, b))
        },
        _onItemFinished: function(a) {
            a = n.indexOf(this._items, a);
            0 <= a && (this._items.splice(a, 1), 0 === this._items.length && this.progress && (this.progress.resolve(), this.progress = null))
        },
        finish: function() {
            for (var a = this._items; 0 < a.length;) a[a.length - 1].finish()
        },
        fly: function(a,
            d, b) {
            var c = a.cloneNode(!0);
            b || (b = ["top", "left"]);
            if (!f()) return c;
            a = a.getBoundingClientRect();
            var h = this._flySurfaceNode.getBoundingClientRect();
            e.add(c, "Anim_FlyingObj");
            for (var k = 0; k < b.length; k++) {
                var g = b[k];
                c.style[g] = ("right" === g || "bottom" === g ? -1 : 1) * (a[g] - h[g]) + "px"
            }
            this._flySurfaceNode.appendChild(c);
            this.start([{
                node: c,
                classes: [d]
            }], c);
            return c
        }
    })
});