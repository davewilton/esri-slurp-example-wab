//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/dom-class", "dojo/dom-style", "dojo/has", "../../base/Templated", "dojo/text!./templates/SaveDocumentPane.html", "dojo/i18n!../../nls/i18nBase", "../../../../kernel"], function(a, e, f, g, b, h, c, d, k, l) {
    return a([c], {
        _disabled: !1,
        dialogBroker: null,
        editor: null,
        gxeDocument: null,
        templateString: d,
        postCreate: function() {
            this.inherited(arguments);
            this._initialize()
        },
        _getPushToItem: function() {
            return !0
        },
        _initialize: function() {
            (!this.editor || !this.editor.dialogBroker) &&
            b.set(this.saveAndCloseButton, "display", "none")
        },
        onCancel: function() {},
        onSave: function(a, b) {},
        _onCancelClick: function() {
            if (!this._disabled) this.onCancel()
        },
        _onSaveClick: function() {
            if (!this._disabled) this.onSave(!1, this._getPushToItem())
        },
        _onSaveAndCloseClick: function() {
            if (!this._disabled) this.onSave(!0, this._getPushToItem())
        }
    })
});