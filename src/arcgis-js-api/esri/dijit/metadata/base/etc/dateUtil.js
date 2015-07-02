//>>built
define(["dojo/_base/lang", "dojo/_base/array", "dojo/has", "dojo/date/locale", "dojo/date", "dojo/date/stamp", "../../../../kernel"], function(e, f, g, b, h, k, l) {
    return {
        formatDate: function(a) {
            return b.format(a, {
                datePattern: "yyyy-MM-dd",
                selector: "date"
            })
        },
        formatDateTime: function(a) {
            var c = b.format(a, {
                    datePattern: "yyyy-MM-dd",
                    selector: "date"
                }),
                d = b.format(a, {
                    timePattern: "hh:mm:ss.SSS",
                    selector: "time"
                });
            a = b.format(a, {
                timePattern: "ZZZZ",
                selector: "time"
            });
            a = a.replace("GMT", "");
            return c + "T" + d + a
        }
    }
});