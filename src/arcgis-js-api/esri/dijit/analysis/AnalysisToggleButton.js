//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/connect", "dojo/has", "dojo/dom-class", "dijit/_Widget", "../../kernel"], function(f, d, g, b, h, c, e, k) {
    return d([e], {
        groupName: "defaultGroup",
        declaredClass: "esri.dijit.analysis.AnalysisToggleButton",
        postMixInProperties: function() {
            this.inherited(arguments);
            this.unselectChannel = "/ButtonGroupCtr/" + this.groupName;
            b.subscribe(this.unselectChannel, this, "doUnselect")
        },
        postCreate: function() {
            this.inherited(arguments);
            c.add(this.domNode, "esriGroupButton")
        },
        doUnselect: function(a) {
            a !== this && this.get("checked") && this.set("checked", !1)
        },
        _getCheckedAttr: function() {
            return this.checked
        },
        _setCheckedAttr: function(a) {
            this.inherited(arguments);
            (this.checked = a) && b.publish(this.unselectChannel, [this]);
            c.toggle(this.domNode, "esriGroupselected", a)
        }
    })
});