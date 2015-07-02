//>>built
define(["dojo/_base/lang", "dojo/_base/array", "dojo/has", "../../../../kernel"], function(f, e, g, h) {
    return {
        nodeTypes: {
            ELEMENT_NODE: 1,
            ATTRIBUTE_NODE: 2,
            TEXT_NODE: 3,
            CDATA_SECTION_NODE: 4,
            ENTITY_REFERENCE_NODE: 5,
            ENTITY_NODE: 6,
            PROCESSING_INSTRUCTION_NODE: 7,
            COMMENT_NODE: 8,
            DOCUMENT_NODE: 9,
            DOCUMENT_TYPE_NODE: 10,
            DOCUMENT_FRAGMENT_NODE: 11,
            NOTATION_NODE: 12
        },
        escape: function(b) {
            if (null === b) return null;
            if (0 === b.length) return b;
            var c, a, d = "";
            for (c = 0; c < b.length; c++) a = b.charAt(c), d = "\x26" === a ? d + "\x26amp;" : "\x3c" === a ? d +
                "\x26lt;" : "\x3e" === a ? d + "\x26gt;" : "'" === a ? d + "\x26apos;" : '"' === a ? d + "\x26quot;" : d + a;
            return d
        },
        getNodeText: function(b) {
            var c, a = null,
                d = this.nodeTypes.TEXT_NODE;
            b.nodeType === this.nodeTypes.ELEMENT_NODE ? e.some(b.childNodes, function(b) {
                if (b.nodeType === d && (c = b.nodeValue, null !== c && (c = f.trim(c), 0 < c.length))) return a = c, !0
            }) : a = b.nodeValue;
            return a
        },
        makeGxePrefixesByUri: function(b) {
            var c = {};
            b && e.forEach(b, function(a) {
                a.prefix && a.uri && (c[a.uri] = a.prefix)
            });
            return c
        },
        makeGxeUrisByPrefix: function(b) {
            var c = {};
            b && e.forEach(b,
                function(a) {
                    a.prefix && a.uri && (c[a.prefix] = a.uri)
                });
            return c
        },
        parseFromString: function(b) {
            var c = null,
                a = null;
            if (window.DOMParser) try {
                a = new DOMParser, c = a.parseFromString(b, "text/xml")
            } catch (d) {}
            return c
        },
        supportsParseFromString: function() {
            return window.DOMParser ? !0 : !1
        }
    }
});