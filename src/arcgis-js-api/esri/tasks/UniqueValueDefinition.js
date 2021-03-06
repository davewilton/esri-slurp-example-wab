//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "./ClassificationDefinition"], function(c, b, e, f, d) {
    return c(d, {
        declaredClass: "esri.tasks.UniqueValueDefinition",
        type: "uniqueValueDef",
        attributeField: null,
        attributeField2: null,
        attributeField3: null,
        fieldDelimiter: null,
        toJson: function() {
            var a = this.inherited(arguments);
            this.uniqueValueFields = [];
            this.attributeField && this.uniqueValueFields.push(this.attributeField);
            this.attributeField2 && this.uniqueValueFields.push(this.attributeField2);
            this.attributeField3 && this.uniqueValueFields.push(this.attributeField3);
            b.mixin(a, {
                type: this.type,
                uniqueValueFields: this.uniqueValueFields
            });
            this.fieldDelimiter && b.mixin(a, {
                fieldDelimiter: this.fieldDelimiter
            });
            return a
        }
    })
});