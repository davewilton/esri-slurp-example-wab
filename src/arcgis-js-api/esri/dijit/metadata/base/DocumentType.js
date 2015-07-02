//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "dijit/_WidgetBase", "../../../kernel"], function(c, e, f, g, d, h) {
    return c([d], {
        caption: null,
        description: null,
        key: null,
        metadataStandardName: null,
        metadataStandardVersion: null,
        namespaces: null,
        postCreate: function() {
            this.inherited(arguments);
            this.namespaces = [];
            this.initialize();
            this.initializeNamespaces()
        },
        addNamespace: function(a, b) {
            this.namespaces.push({
                prefix: a,
                uri: b
            })
        },
        afterInitializeAttribute: function(a, b) {},
        afterInitializeElement: function(a,
            b) {},
        afterTransform: function(a, b) {},
        beforeInitializeAttribute: function(a, b) {},
        beforeInitializeElement: function(a, b) {},
        getCaption: function() {
            return null
        },
        getKey: function() {
            return this.key
        },
        getNamespaces: function() {
            return this.namespaces
        },
        initialize: function() {},
        initializeNamespaces: function() {},
        newPortalItemTransformer: function(a) {
            return null
        },
        newRootDescriptor: function() {
            return null
        }
    })
});