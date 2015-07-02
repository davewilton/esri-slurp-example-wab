//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom-class", "dojo/dom-construct", "dojo/has", "./Templated", "./LabelMixin", "dojo/text!./templates/ElementHeader.html", "../../../kernel"], function(b, h, c, d, k, e, f, g, l) {
    return b([e, f], {
        label: null,
        parentElement: null,
        templateString: g,
        postCreate: function() {
            this.inherited(arguments)
        },
        initialize: function(a) {
            this.parentElement = a;
            d.place(this.domNode, a.containerNode, "before");
            c.add(a.domNode, "single gxeIndent");
            this.label = a.getLabelString();
            this.initializeLabel(this.label,
                0 === a.minOccurs, a.preferOpen, this.labelNode, a.containerNode)
        },
        whenOptionalContentToggled: function(a) {
            this.parentElement._isOptionallyOff = a
        }
    })
});