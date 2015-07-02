//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "./ClickableTool", "../../../../kernel"], function(a, d, e, c, f) {
    return a([c], {
        value: null,
        postCreate: function() {
            this.inherited(arguments)
        },
        whenToolClicked: function(a, b) {
            b && b.setInputValue(this.value)
        }
    })
});