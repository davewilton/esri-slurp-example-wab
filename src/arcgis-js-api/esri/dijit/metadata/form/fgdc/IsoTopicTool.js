//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/query", "dojo/has", "dijit/registry", "../tools/ClickableTool", "./IsoTopicDialog", "../../../../kernel"], function(e, f, m, g, n, h, k, l, p) {
    return e([k], {
        thesaurus: "http://www.isotc211.org/2005/resources/Codelist/gmxCodelists.xml#MD_KeywordTypeCode",
        postCreate: function() {
            this.inherited(arguments)
        },
        whenToolClicked: function(e, c) {
            if (c && c.parentXNode) {
                var a, b, d = null;
                a = null;
                if (b = c.parentXNode.getParentElement())
                    if ((b = g("[data-gxe-path\x3d'/metadata/idinfo/keywords/theme/themekey']",
                            b.domNode)) && 1 === b.length)
                        if (b = h.byNode(b[0])) d = b.inputWidget, a = d.getInputValue(), null !== a && !a.push && (a = [a]);
                d && (a = new l({
                    values: a,
                    onChange: f.hitch(this, function(a) {
                        c.setInputValue(this.thesaurus);
                        d.importValues(null, a)
                    })
                }), a.show())
            }
        }
    })
});