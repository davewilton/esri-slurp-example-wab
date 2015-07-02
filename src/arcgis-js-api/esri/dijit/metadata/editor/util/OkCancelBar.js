//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom-class", "dojo/has", "../../base/Templated", "dojo/text!./templates/OkCancelBar.html", "dojo/i18n!../../nls/i18nBase", "dijit/form/Button", "../../../../kernel"], function(d, g, c, h, e, f, a, k, l) {
    return d([e], {
        cancelIsProminent: !1,
        cancelLabel: a.general.cancel,
        isWorking: !1,
        okLabel: a.general.ok,
        showCancel: !0,
        showOk: !0,
        templateString: f,
        postCreate: function() {
            this.inherited(arguments);
            this.showOk || (this.okButton.style.display = "none");
            this.showCancel || (this.cancelButton.style.display =
                "none");
            this.cancelIsProminent && (c.remove(this.okButton, "prominent"), c.add(this.cancelButton, "prominent"))
        },
        postMixInProperties: function() {
            this.inherited(arguments);
            null === this.okLabel && (this.okLabel = a.general.ok);
            null === this.cancelLabel && (this.cancelLabel = a.general.cancel)
        },
        disableOk: function() {
            this.okButton.disabled = !0
        },
        enableOk: function() {
            this.showOk && (this.okButton.disabled = !1)
        },
        hideWorking: function(b) {
            this.isWorking = !1;
            this.workingNode.innerHTML = "";
            b && this.enableOk()
        },
        onCancelClick: function(b) {},
        onOkClick: function(b) {},
        showFatalError: function(b, a) {
            this.disableOk();
            this.hideWorking(!1);
            this.setNodeText(this.workingNode, b);
            a ? console.error(b, a) : console.error(b)
        },
        showWorking: function(b, a) {
            this.isWorking = !0;
            a && this.disableOk();
            this.setNodeText(this.workingNode, b)
        }
    })
});