//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "dojo/Deferred", "dijit/_WidgetBase", "../../../kernel"], function(c, e, f, g, b, d, h) {
    return c([d], {
        postCreate: function() {
            this.inherited(arguments)
        },
        afterEditDocumentLoad: function(a, b, c, d) {},
        afterViewDocumentLoad: function(a, b) {},
        deleteMetadata: function() {
            var a = new b;
            a.resolve();
            return a
        },
        getAllowEditMetadata: function() {
            return !1
        },
        getAllowDeleteMetadata: function() {
            return !1
        },
        getAllowPullItem: function() {
            return !1
        },
        getAllowPushToItem: function() {
            return !1
        },
        getOriginalXml: function() {
            return null
        },
        pullItem: function(a) {
            a = new b;
            a.resolve();
            return a
        },
        saveXml: function(a, c, d) {
            a = new b;
            a.resolve();
            return a
        }
    })
});