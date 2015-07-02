//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/aspect", "dojo/dom-class", "dojo/dom-construct", "dojo/has", "dijit/_WidgetBase", "dojo/i18n!../nls/i18nBase", "dijit/Dialog", "./Editor", "../../../kernel"], function(d, c, e, f, m, n, g, h, k, l, p) {
    return d([g], {
        _checkForChanges: !0,
        dialog: null,
        editor: null,
        gxeAdaptor: null,
        gxeContext: null,
        title: null,
        postCreate: function() {
            this.inherited(arguments)
        },
        hide: function() {
            this._checkForChanges = !1;
            this.dialog && this.dialog.hide()
        },
        onDialogClose: function() {},
        show: function() {
            null === this.title &&
                (this.title = h.editor.editorDialog.caption);
            var b = this.editor = new l({
                    dialogBroker: this,
                    gxeAdaptor: this.gxeAdaptor,
                    gxeContext: this.gxeContext
                }),
                a = this.dialog = new k({
                    "class": "gxeDialog gxeEditorDialog",
                    title: this.title,
                    content: b,
                    autofocus: !1
                });
            this.isLeftToRight() || f.add(a.domNode, "gxeRtl");
            var d = this;
            this.own(e.around(a, "hide", c.hitch(this, function(e) {
                return function() {
                    d._checkForChanges && b.getEditDocument() ? b.primaryToolbar._onCloseClick() : c.hitch(a, e)()
                }
            })));
            this.own(a.on("hide", c.hitch(this, function() {
                setTimeout(c.hitch(this,
                    function() {
                        b.destroyRecursive(!1);
                        a.destroyRecursive(!1);
                        this.destroyRecursive(!1)
                    }), 2E3);
                this.onDialogClose()
            })));
            a.show().then(function() {
                b.initializeView()
            })
        }
    })
});