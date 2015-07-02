//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/Deferred", "dojo/_base/fx", "dojo/dom-class", "dojo/dom-style", "dojo/has", "dojo/query", "../base/Templated", "./PrimaryToolbarMixin", "dojo/text!./templates/PrimaryToolbar.html", "dojo/i18n!../nls/i18nBase", "../base/TabButton", "../base/ValidationTracker", "./util/MessageDialog", "../../../kernel"], function(n, e, p, q, l, c, b, w, r, s, t, u, f, x, m, v, y) {
    return n([s, t], {
        _disabled: !0,
        _mode: null,
        editor: null,
        lastSavedXml: null,
        templateString: u,
        canDownloadFiles: !1,
        postCreate: function() {
            this.inherited(arguments)
        },
        initialize: function() {
            this.editor.gxeAdaptor.getAllowEditMetadata() || b.set(this.editButton.domNode, "display", "none");
            this.updateUI()
        },
        initializeView: function() {
            this._initializeView()
        },
        _checkForChanges: function(a, b) {
            var d = new q,
                c = this.editor.getEditDocument();
            if (!c) return d.resolve(!0), d;
            var h = new m({
                ignoreErrors: !0
            });
            if (c.generateXml(h) === this.lastSavedXml) return d.resolve(!0), d;
            (new v({
                title: a,
                okLabel: b,
                cancelIsProminent: !0,
                onOkClick: function(a) {
                    d.resolve(!0)
                },
                onCancelClick: function(a) {
                    d.resolve(!1)
                }
            })).show(f.editor.changesNotSaved.prompt);
            return d
        },
        _close: function() {
            this.editor.dialogBroker && this.editor.dialogBroker.dialog && this.editor.dialogBroker.hide()
        },
        _fadeIn: function(a) {
            b.set(this.messageArea, "display", "none");
            b.set(this.workingIcon, "display", "none");
            this.workingNode.innerHTML = "";
            l.fadeIn({
                node: this.editor.canvasNode,
                onEnd: e.hitch(this, function() {
                    this._disabled = !1;
                    this.updateUI();
                    a && a()
                })
            }).play()
        },
        _fadeOut: function(a, c) {
            this._disabled = !0;
            b.set(this.messageArea, "display", "inline-block");
            this.setNodeText(this.workingNode, a);
            p.forEach(r("button",
                this.domNode), function(a) {
                a.disabled = !0
            });
            l.fadeOut({
                node: this.editor.canvasNode,
                onEnd: e.hitch(this, function() {
                    c && c()
                })
            }).play()
        },
        _onCloseClick: function() {
            this._disabled || this._checkForChanges(f.editor.changesNotSaved.dialogTitle, f.editor.changesNotSaved.closeButton).then(e.hitch(this, function(a) {
                a && this._close()
            }))
        },
        _onDeleteClick: function() {
            this._disabled || this._confirmAndDelete()
        },
        _onDownloadClick: function() {
            if (!this._disabled) {
                var a = this.editor.xmlPane.xmlString,
                    b = this.editor.xmlPane.xmlTitle;
                null != a && this._download(a, b, !1)
            }
        },
        _onEditClick: function(a) {
            this._disabled || (a = this.editor.getEditDocument(), this._setMode("edit"), a || this._loadEditor())
        },
        _onLoadClick: function() {
            this._disabled || this._showLoadDialog(null)
        },
        _onSaveClick: function() {
            if (!this._disabled) {
                var a = {
                    isSaveAsDraft: !1,
                    isSaveAndClose: !1,
                    bPushToItem: !1,
                    showDialog: !1
                };
                this.editor.gxeAdaptor.getAllowPushToItem() && (a.bPushToItem = !0);
                this._save(a)
            }
        },
        _onSaveAndCloseClick: function() {
            if (!this._disabled) {
                var a = {
                    isSaveAsDraft: !1,
                    isSaveAndClose: !0,
                    bPushToItem: !1,
                    showDialog: !1
                };
                this.editor.gxeAdaptor.getAllowPushToItem() && (a.bPushToItem = !0);
                this._save(a)
            }
        },
        _onSaveDraftClick: function() {
            this._disabled || this._save({
                isSaveAsDraft: !0,
                isSaveAndClose: !1,
                bPushToItem: !1,
                showDialog: !1
            })
        },
        _onTransformClick: function() {
            if (!this._disabled) {
                var a = this.editor.getEditDocument();
                if (a) {
                    var b = this._getTransformationTypes(a);
                    0 < b.length && this._showTransformDialog(a, b)
                }
            }
        },
        _onViewClick: function() {
            this._disabled || this._loadView()
        },
        _onViewXmlClick: function() {
            if (!this._disabled) {
                var a =
                    this.editor.getEditDocument();
                if (a) {
                    var b = new m({
                            ignoreErrors: !0
                        }),
                        a = a.generateXml(b);
                    this.editor.xmlPane.setXml(a, b.documentTitle);
                    this._setMode("viewXml");
                    this.updateUI()
                } else this._setMode("viewXml")
            }
        },
        _setMode: function(a) {
            "view" === a ? (c.add(this.viewButton.domNode, "current"), c.remove(this.viewXmlButton.domNode, "current"), c.remove(this.editButton.domNode, "current"), b.set(this.editToolset, "display", "none"), b.set(this.viewToolset, "display", ""), this.editor.validationPane.clearMessages(), b.set(this.editor.xmlPane.domNode,
                "display", "none"), b.set(this.editor.editDocumentPane.domNode, "display", "none"), b.set(this.editor.viewDocumentPane.domNode, "display", ""), this.editor.resizeDocument(this.editor.viewDocumentPane)) : "viewXml" === a ? (c.add(this.viewXmlButton.domNode, "current"), c.remove(this.viewButton.domNode, "current"), c.remove(this.editButton.domNode, "current"), b.set(this.editToolset, "display", "none"), b.set(this.viewToolset, "display", ""), this.editor.validationPane.clearMessages(), b.set(this.editor.viewDocumentPane.domNode,
                "display", "none"), b.set(this.editor.editDocumentPane.domNode, "display", "none"), b.set(this.editor.xmlPane.domNode, "display", ""), this.editor.resizeXmlPane()) : "edit" === a && (c.add(this.editButton.domNode, "current"), c.remove(this.viewButton.domNode, "current"), c.remove(this.viewXmlButton.domNode, "current"), b.set(this.viewToolset, "display", "none"), b.set(this.editToolset, "display", ""), b.set(this.editor.viewDocumentPane.domNode, "display", "none"), b.set(this.editor.xmlPane.domNode, "display", "none"), b.set(this.editor.editDocumentPane.domNode,
                "display", ""), this.editor.resizeDocument(this.editor.editDocumentPane));
            this._mode = a;
            this.updateUI()
        },
        updateUI: function() {
            var a = function(a, c) {
                    a.disabled = !c;
                    c ? b.set(a, "display", "") : b.set(a, "display", "none")
                },
                c = this.editor.xmlPane.xmlString,
                d = this.editor.xmlPane.xmlTitle,
                g = this.editor.getEditDocument(),
                h = this._getTransformationTypes(g),
                g = null !== g,
                k = this.editor.gxeAdaptor.getAllowEditMetadata(),
                e = this.editor.gxeAdaptor.getAllowDeleteMetadata(),
                k = k && g,
                h = 0 < h.length,
                e = e && null !== this.lastSavedXml,
                f = this.editor &&
                this.editor.dialogBroker;
            a(this.downloadButton, null !== c && null !== d);
            a(this.saveButton, k);
            a(this.saveAndCloseButton, k && f);
            a(this.saveDraftButton, g);
            a(this.loadButton, !0);
            a(this.transformButton, h);
            a(this.deleteButton, e);
            a(this.closeButton, f)
        }
    })
});