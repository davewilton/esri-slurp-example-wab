//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/Deferred", "dojo/on", "dojo/keys", "dojo/_base/event", "dojo/dom-class", "dojo/dom-construct", "dojo/dom-style", "dojo/has", "dijit/Viewport", "../context/GxeAdaptor", "../context/GxeContext", "../base/etc/viewOnlyUtil", "../base/XDocument", "../base/xml/XmlImporter", "./EditorResizeMixin", "../base/Templated", "dojo/text!./templates/Editor.html", "esri/kernel", "./PrimaryToolbar", "./ValidationPane", "./EditDocumentPane", "./ViewDocumentPane", "./XmlPane", "../../../dijit/Geocoder"], function(k, c, t, m, u, v, w,
    x, f, H, y, z, A, B, C, D, E, F, G, I) {
    return k([F, E], {
        dialogBroker: null,
        gxeAdaptor: null,
        gxeContext: null,
        templateString: G,
        postCreate: function() {
            this.inherited(arguments);
            this.gxeAdaptor || (this.gxeAdaptor = new z);
            this.gxeContext || (this.gxeContext = new A);
            this.primaryToolbar.editor = this;
            this.primaryToolbar.lastSavedXml = this.gxeAdaptor.getOriginalXml();
            this.validationPane.editor = this;
            this.xmlPane.setXml(this.gxeAdaptor.getOriginalXml(), "metadata");
            this.primaryToolbar.initialize();
            this.dialogBroker || this.own(y.on("resize",
                c.hitch(this, "resize")));
            this.isLeftToRight() || w.add(this.domNode, "gxeRtl");
            this.own(m(document, "keydown, keypress", c.hitch(this, function(a) {
                a.keyCode === u.BACKSPACE && void 0 === a.target.size && void 0 === a.target.rows && v.stop(a)
            })))
        },
        destroy: function() {
            try {
                this.viewDocumentPane.gxeDocument && this.viewDocumentPane.gxeDocument.rootDescriptor && this.viewDocumentPane.gxeDocument.rootDescriptor.destroyRecursive(!1)
            } catch (a) {
                console.error(a)
            }
            try {
                this.editDocumentPane.gxeDocument && this.editDocumentPane.gxeDocument.rootDescriptor &&
                    this.editDocumentPane.gxeDocument.rootDescriptor.destroyRecursive(!1)
            } catch (e) {
                console.error(e)
            }
            this.inherited(arguments)
        },
        getEditDocument: function() {
            return this.editDocumentPane.gxeDocument
        },
        getViewDocument: function() {
            return this.viewDocumentPane.gxeDocument
        },
        initializeView: function() {
            this.primaryToolbar.initializeView()
        },
        _loadDocumentPane: function(a, e, d, n, c) {
            var b = null,
                g = !1,
                p = !1,
                l = new t;
            a === this.editDocumentPane ? this.validationPane.clearMessages() : g = !0;
            try {
                var q, h = a.gxeDocument,
                    r = x.create("div", {}, a.rootContainer),
                    b = new C({
                        gxeContext: this.gxeContext,
                        isViewOnly: g
                    });
                b.initialize(e, r);
                d && (q = new D, q.importDocument(b, d, n));
                h && (f.set(h.rootDescriptor.domNode, "display", "none"), h.rootDescriptor && h.rootDescriptor.destroyRecursive(!1));
                p = !0;
                a.gxeDocument = b;
                f.set(r, "display", "");
                f.set(a.domNode, "display", "");
                g && B.applyViewOnly(b);
                try {
                    g ? this.gxeAdaptor.afterViewDocumentLoad(b, c) : this.gxeAdaptor.afterEditDocumentLoad(b, d, n, c)
                } catch (k) {
                    console.error(k)
                }
                l.resolve(b);
                this.primaryToolbar.updateUI()
            } catch (s) {
                try {
                    b &&
                        (b.rootDescriptor && !p) && (f.set(b.rootDescriptor.domNode, "display", "none"), b.rootDescriptor.destroyRecursive(!1))
                } catch (m) {}
                console.error("Error constructing document");
                console.error(s);
                l.reject(s)
            }
            return l
        },
        loadEditor: function(a, e, d, c) {
            return this._loadDocumentPane(this.editDocumentPane, a, e, d, c)
        },
        loadView: function(a, c, d) {
            return this._loadDocumentPane(this.viewDocumentPane, a, c, !1, d)
        }
    })
});