//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "dijit/_WidgetBase", "../../../../kernel"], function(b, d, e, c, f) {
    return b([c], {
        allowEditMetadata: !1,
        allowPullItem: !0,
        allowPushToItem: !1,
        autoPullItem: !0,
        originalXml: null,
        portal: null,
        isForPortalItemPage: !1,
        portalItem: null,
        restBaseUrl: null,
        token: null,
        postCreate: function() {
            this.inherited(arguments)
        },
        getAllowEditMetadata: function() {
            return this.allowEditMetadata
        },
        getAllowDeleteMetadata: function() {
            return this.getAllowEditMetadata()
        },
        getAllowPullItem: function() {
            return !this.getItem() ?
                !1 : this.allowPullItem
        },
        getAllowPushToItem: function() {
            return this.allowPushToItem
        },
        getAutoPullItem: function() {
            return this.autoPullItem
        },
        getItem: function() {
            return this.portalItem
        },
        getItemFolderId: function() {
            var a = this.getItem();
            return !a || "undefined" === typeof a.folderId ? null : a.folderId
        },
        getItemId: function() {
            var a = this.getItem();
            return !a || "undefined" === typeof a.id ? null : a.id
        },
        getItemOwner: function() {
            var a = this.getItem();
            return !a || "undefined" === typeof a.owner ? null : a.owner
        },
        getOriginalXml: function() {
            return this.originalXml
        },
        getPortal: function() {
            return this.portal
        },
        getRestBaseUrl: function() {
            return this.restBaseUrl
        },
        getToken: function() {
            return this.token
        }
    })
});