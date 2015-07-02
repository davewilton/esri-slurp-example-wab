//>>built
define(["dijit/popup"], function(e) {
    return {
        bindSliderAndSpinner: function(a, c) {
            a.on("change", function(a) {
                c.set("value", a, !1)
            });
            c.on("change", function(b) {
                var d, c;
                isNaN(b) ? this.set("value", a.get("value"), !1) : (b = Math.round(b), d = this.get("constraints"), c = d.min, d = d.max, b = b > d ? d : b < c ? c : b, this.set("value", b, !1), a.set("value", b, !1))
            })
        },
        silentlyUpdateIntermediateChangingValueWidget: function(a, c) {
            a.intermediateChanges = !1;
            a.set("value", c, !1);
            a.intermediateChanges = !0
        },
        ensureEnabledChildSelection: function(a) {
            var c,
                b;
            if (a.selectedChildWidget.disabled) {
                c = a.getChildren();
                b = c.length;
                for (var d = 0; d < b; d++)
                    if (!c[d].disabled) {
                        a.selectChild(c[d]);
                        break
                    }
            }
        },
        enable: function(a) {
            a.set("disabled", !1)
        },
        disable: function(a) {
            a.set("disabled", !0)
        },
        popUp: function(a, c) {
            var b, d;
            b = a.on("styling-commit", function() {
                b.remove();
                d.remove();
                e.close(a)
            });
            d = a.on("styling-stop", function() {
                b.remove();
                d.remove();
                e.close(a)
            });
            e.open({
                popup: a,
                around: c,
                orient: ["above"]
            })
        }
    }
});