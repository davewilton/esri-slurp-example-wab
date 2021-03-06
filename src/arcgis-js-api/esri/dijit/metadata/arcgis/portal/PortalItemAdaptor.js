//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "dojo/Deferred", "../../context/GxeAdaptor", "../../../../kernel", "../../../../request"], function(m, l, p, q, g, n, r, k) {
    return m([n], {
        itemRequiresRefresh: !1,
        portalItemContext: null,
        postCreate: function() {
            this.inherited(arguments)
        },
        afterEditDocumentLoad: function(b, a, c, d) {
            var e, h = this.getItemContext(),
                f = h.getItem();
            if (f && h.getAutoPullItem() && !d && (!a || a && c)) try {
                (e = b.documentType.newPortalItemTransformer(b)) && e.pull(b, f)
            } catch (g) {
                console.error(g)
            }
        },
        afterViewDocumentLoad: function(b, a) {},
        deleteMetadata: function() {
            var b;
            return !this.getItemContext().getAllowDeleteMetadata() ? (b = new g, b.reject("Metadata Adaptor: Delete metadata in not allowed."), b) : this.writeXml(null)
        },
        getAllowEditMetadata: function() {
            return this.getItemContext().getAllowEditMetadata()
        },
        getAllowDeleteMetadata: function() {
            return this.getItemContext().getAllowDeleteMetadata()
        },
        getAllowPullItem: function() {
            return this.getItemContext().getAllowPullItem()
        },
        getAllowPushToItem: function() {
            return this.getItemContext().getAllowPushToItem()
        },
        getOriginalXml: function() {
            return this.getItemContext().getOriginalXml()
        },
        pullItem: function(b) {
            var a = new g,
                c, d = this.getItemContext(),
                e = d.getItem();
            if (e && d.getAllowPullItem()) try {
                (c = b.documentType.newPortalItemTransformer(b)) && c.pull(b, e)
            } catch (h) {
                console.error(h)
            }
            a.resolve();
            return a
        },
        saveXml: function(b, a, c) {
            var d = new g,
                e = this.getItemContext(),
                h = e.getItem();
            if (!e.getAllowEditMetadata()) return d.reject("Metadata Adaptor: Write XML in not allowed."), d;
            var f = null,
                k;
            if (c && e.getAllowPushToItem() && h && window.FormData) try {
                (k =
                    b.documentType.newPortalItemTransformer(b)) && (f = k.generatePush(b, h))
            } catch (m) {
                f = null, console.error(m)
            }
            if (null === f) return this.writeXml(a);
            this.writeXml(a).then(l.hitch(this, function() {
                this.updateItem(f).then(l.hitch(this, function() {
                    this.itemRequiresRefresh = !0;
                    d.resolve()
                }), l.hitch(this, function(a) {
                    console.error(a);
                    d.resolve()
                }))
            }), l.hitch(this, function(a) {
                d.reject(a)
            }));
            return d
        },
        getItemContext: function() {
            return this.portalItemContext
        },
        makeMultiPartFormData: function(b) {
            if (!window.FormData) return null;
            var a = new FormData,
                c, d = null;
            for (c in b)
                if (b.hasOwnProperty(c)) {
                    d = b[c];
                    if ("snippet" === c || "description" === c || "text" === c) null == d && (d = "");
                    a.append(c, d)
                }
            return a
        },
        readXml: function(b) {
            var a = new g,
                c = this.getItemContext(),
                d = c.getRestBaseUrl(),
                e = c.getToken(),
                c = c.getItemId();
            if (null === d) return a.reject("Metadata Adaptor: Unable to read XML, no restBaseUrl"), a;
            d = d + "content/items/" + encodeURIComponent(c);
            d += "/info/metadata/metadata.xml";
            c = {};
            null !== e && (c.token = e);
            e = {
                url: d,
                content: c,
                handleAs: b,
                preventCache: !0
            };
            "json" === b && (e.callbackParamName = "callback");
            k(e, {
                usePost: !0
            }).then(function(b) {
                a.resolve(b)
            }, function(b) {
                a.resolve(null)
            });
            return a
        },
        updateItem: function(b) {
            var a, c = this.getItemContext(),
                d = c.getRestBaseUrl(),
                e = c.getToken();
            a = c.getItemId();
            var h = c.getItemOwner(),
                f = c.getItemFolderId();
            b.f = "json";
            null !== e && (b.token = e);
            b = this.makeMultiPartFormData(b);
            if (!c.getAllowPushToItem()) return a = new g, a.reject("Metadata Adaptor: Update portal item is not allowed."), a;
            if (null === b) return a = new g, a.reject("Metadata Adaptor: Unable to update portal item, FormData is not supported on this browser."),
                a;
            if (null === d) return a = new g, a.reject("Metadata Adaptor: Unable to update portal item, no restBaseUrl"), a;
            c = d + "content/users/" + encodeURIComponent(h);
            "undefined" !== typeof f && (null !== f && 0 < f.length) && (c += "/" + encodeURIComponent(f));
            c += "/items/" + encodeURIComponent(a) + "/update";
            return k({
                url: c,
                form: b,
                handleAs: "json",
                callbackParamName: "callback",
                preventCache: !0
            }, {
                usePost: !0
            })
        },
        writeXml: function(b) {
            var a = this.getItemContext(),
                c = a.getRestBaseUrl(),
                d = a.getToken(),
                e = a.getItemId(),
                h = a.getItemOwner(),
                f = a.getItemFolderId();
            if (!a.getAllowEditMetadata()) return b = new g, b.reject("Metadata Adaptor: Write XML in not allowed."), b;
            if (null === c) return b = new g, b.reject("Metadata Adaptor: Unable to write XML, no restBaseUrl"), b;
            a = c + "content/users/" + encodeURIComponent(h);
            "undefined" !== typeof f && (null !== f && 0 < f.length) && (a += "/" + encodeURIComponent(f));
            a += "/items/" + encodeURIComponent(e) + "/update";
            a += "/info/metadata/metadata.xml";
            e = [];
            e.push("--387F8C2A-CFAB-443C-863B-B180E79B05F4", 'Content-Disposition: form-data; name\x3d"f"', "", "json");
            e.push("--387F8C2A-CFAB-443C-863B-B180E79B05F4", 'Content-Disposition: form-data; name\x3d"overwrite"', "", "true");
            null != d && e.push("--387F8C2A-CFAB-443C-863B-B180E79B05F4", 'Content-Disposition: form-data; name\x3d"token"', "", d);
            e.push("--387F8C2A-CFAB-443C-863B-B180E79B05F4", 'Content-Disposition: form-data; name\x3d"metadata"; filename\x3d"metadata.xml"', "Content-Type: text/xml", "", b);
            e.push("--387F8C2A-CFAB-443C-863B-B180E79B05F4--", "");
            b = e.join("\r\n");
            return k({
                url: a,
                handleAs: "json",
                callbackParamName: "callback",
                preventCache: !0,
                headers: {
                    "Content-Type": "multipart/form-data; boundary\x3d387F8C2A-CFAB-443C-863B-B180E79B05F4"
                },
                postData: b
            }, {
                usePost: !0
            })
        }
    })
});