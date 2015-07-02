//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/date/locale", "dojo/dom-class", "dojo/dom-construct", "dojo/has", "../base/etc/dateUtil", "./InputText", "dojo/text!./templates/InputDate.html", "dojo/i18n!../nls/i18nBase", "dijit/Dialog", "../editor/util/OkCancelBar", "../../../kernel"], function(n, d, p, l, f, u, m, q, r, c, s, t, v) {
    return n([q], {
        _isGxeInputDate: !0,
        templateString: r,
        allowTime: !1,
        forceTime: !1,
        hint: c.hints.date,
        size: 40,
        useNow: !1,
        postCreate: function() {
            this.inherited(arguments)
        },
        postMixInProperties: function() {
            this.inherited(arguments);
            this.forceTime && this.hint === c.hints.date ? this.hint = c.hints.dateTime : this.allowTime && this.hint === c.hints.date && (this.hint = c.hints.dateOrDateTime)
        },
        connectXNode: function(b, a) {
            this.inherited(arguments);
            !a && this.useNow && this.setInputValue(this.formatDate(new Date))
        },
        formatDate: function(b) {
            return m.formatDate(b)
        },
        _onCalendarClick: function() {
            this.showCalendar()
        },
        _onStampClick: function() {
            this.setInputValue(m.formatDateTime(new Date))
        },
        _getDateForCalendar: function() {
            var b = "yyyy-MM-dd",
                a = this.getInputValue();
            if (null === a) return null;
            a = d.trim(a);
            if (0 === a.length) return null;
            var a = a.split("Z")[0].split("T")[0],
                e = a.split("-");
            1 === e.length ? b = "yyyy" : 2 === e.length && (b = "yyyy-MM");
            return p.parse(a, {
                datePattern: b,
                selector: "date"
            })
        },
        showCalendar: function() {
            var b = null,
                a = c.calendar.title,
                e = this._getDateForCalendar();
            null === e && (e = new Date);
            require(["dijit/Calendar"], d.hitch(this, function(c) {
                var g = f.create("div", {}),
                    h = new c({
                        "class": "gxeCenteredCalendar",
                        value: e,
                        onChange: d.hitch(this, function(a) {
                            a = this.formatDate(a);
                            this.forceTime && (a += "T00:00:00");
                            this.setInputValue(a);
                            b && b.hide()
                        })
                    }, f.create("div", {}, g));
                h.startup();
                var k = new t({
                    onOkClick: d.hitch(this, function() {
                        var a = h.get("value");
                        null !== a && (a = this.formatDate(a), this.forceTime && (a += "T00:00:00"), this.setInputValue(a), b && b.hide())
                    }),
                    onCancelClick: d.hitch(this, function() {
                        b && b.hide()
                    })
                }, f.create("div", {}, g));
                l.add(k.workingNode, "gxeSmallText");
                k.showWorking(this.formatDate(e), !1);
                b = new s({
                    "class": "gxeDialog gxePopupDialog",
                    title: a,
                    content: g
                });
                this.isLeftToRight() ||
                    l.add(b.domNode, "gxeRtl");
                this.own(b.on("hide", d.hitch(this, function() {
                    setTimeout(d.hitch(this, function() {
                        k.destroyRecursive(!1);
                        b.destroyRecursive(!1);
                        h.destroyRecursive(!1)
                    }), 300)
                })));
                b.show()
            }))
        }
    })
});