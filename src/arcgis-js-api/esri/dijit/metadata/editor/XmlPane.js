//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom-style", "dojo/has", "../base/Templated", "dojo/text!./templates/XmlPane.html", "dojo/i18n!../nls/i18nBase", "../../../kernel"], function(c, d, b, h, e, f, g, k) {
    return c([e], {
        templateString: f,
        xmlString: null,
        xmlTitle: null,
        postCreate: function() {
            this.inherited(arguments)
        },
        setXml: function(a, c) {
            "undefined" === typeof a ? a = null : null !== a && (a = d.trim(a), 0 === a.length && (a = null));
            null === a ? (b.set(this.textAreaNode, "display", "none"), this.setNodeText(this.messageNode, g.editor.noMetadata),
                b.set(this.messageNode, "display", "")) : (this.messageNode.innerHTML = "", b.set(this.messageNode, "display", "none"), b.set(this.textAreaNode, "display", ""));
            this.xmlString = a;
            this.xmlTitle = c;
            this.textAreaNode.value = a
        }
    })
});