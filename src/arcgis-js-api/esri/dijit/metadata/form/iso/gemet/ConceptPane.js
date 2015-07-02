//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/on", "dojo/keys", "dojo/dom-construct", "dojo/has", "../../../base/Templated", "dojo/text!./templates/ConceptPane.html", "dojo/i18n!../../../nls/i18nBase", "dojo/i18n!../../../nls/i18nIso", "../../../base/etc/docUtil", "./gemet", "../../../../../request", "../../../../../kernel"], function(l, e, m, n, p, c, u, q, r, s, h, k, f, t, v) {
    return l([q], {
        dialogBroker: null,
        gxeDocument: null,
        initialValue: null,
        i18nBase: s,
        i18nIso: h,
        templateString: r,
        gemetUrl: null,
        gemetConceptThesaurus: null,
        initialLanguage: null,
        _activePromise: null,
        postCreate: function() {
            this.inherited(arguments);
            this.workingNode.style.display = "none";
            var a = this.gxeDocument.gxeContext;
            this.gemetUrl = a.gemetUrl;
            this.gemetConceptThesaurus = a.gemetConceptThesaurus;
            f.populateLanguages(this.gxeDocument, this.languageSelect);
            this.initialLanguage = f.getSelectedLanguage(this.languageSelect);
            this.searchText.value = f.getSessionConceptQuery();
            this._query();
            this.own(n(this.searchText, "keyup", e.hitch(this, function(a) {
                a.keyCode == p.ENTER &&
                    this._query()
            })))
        },
        _addOption: function(a, b, d) {
            var g = "Unknown";
            b = null;
            a.preferredLabel && "string" === typeof a.preferredLabel.string && (g = e.trim(a.preferredLabel.string));
            a.definition && "string" === typeof a.definition.string && (b = e.trim(a.definition.string), 0 === b.length && (b = null));
            var f = g,
                h = this;
            a = c.create("div", {
                "class": "gxeOption"
            }, d);
            d = c.create("div", {
                "class": "gxeClickableText",
                onclick: function() {
                    h._onSelect(f)
                }
            }, a);
            k.setNodeText(d, g);
            null !== b && 0 < b.length && (g = c.create("div", {
                    "class": "gxeDescription gxeSmallText"
                },
                a), k.setNodeText(g, b))
        },
        _fetch: function(a, b) {
            var d = this.gemetUrl + "/getConceptsMatchingRegexByThesaurus",
                d = d + ("?thesaurus_uri\x3d" + encodeURIComponent(this.gemetConceptThesaurus)),
                d = d + ("\x26language\x3d" + encodeURIComponent(a)),
                d = d + ("\x26regex\x3d" + encodeURIComponent(b));
            return t({
                url: d,
                handleAs: "json",
                callbackParamName: "jsonp"
            }, {})
        },
        _getSearchText: function() {
            return e.trim(this.searchText.value)
        },
        _handleError: function(a) {
            this.workingNode.style.display = "none";
            console.error(a);
            a = h.gemet.ioerror.replace("{url}",
                this.gemetUrl);
            c.empty(this.resultsNode);
            var b = c.create("div", {
                "class": "gxeMessagePane"
            }, this.resultsNode);
            c.create("div", {
                "class": "gxeIcon gxeIconError"
            }, b);
            b = c.create("div", {
                "class": "gxeMessageText"
            }, b);
            k.setNodeText(b, a)
        },
        _onCancelClick: function(a) {
            this.onCancelClick(a)
        },
        onCancelClick: function(a) {},
        _onLanguageChange: function(a) {
            this._query()
        },
        _onSearchClick: function(a) {
            this._query()
        },
        _onSelect: function(a) {
            var b = f.getSelectedLanguage(this.languageSelect);
            this.initialLanguage !== b && f.saveSessionLanguage(b);
            this.onSelect(a)
        },
        onSelect: function(a) {},
        _query: function() {
            var a = f.getSelectedLanguage(this.languageSelect),
                b = this._getSearchText();
            if (!(null === b || 0 === b.length) && null === this._activePromise) this.workingNode.style.display = "inline-block", c.empty(this.resultsNode), (this._activePromise = this._fetch(a, b)).then(e.hitch(this, function(a) {
                this._activePromise = null;
                try {
                    this._render(a, b)
                } catch (c) {
                    this._handleError(c)
                }
            }), e.hitch(this, function(a) {
                this._activePromise = null;
                this._handleError(a)
            }))
        },
        _render: function(a,
            b) {
            var d = 0,
                g = this.resultsNode;
            c.empty(g);
            m.forEach(a, function(a, b) {
                d++;
                this._addOption(a, b, g)
            }, this);
            this.workingNode.style.display = "none";
            var e;
            0 === d ? (c.empty(g), e = c.create("div", {
                "class": "gxeMessagePane"
            }, this.resultsNode), c.create("div", {
                "class": "gxeIcon gxeIconWarning"
            }, e), e = c.create("div", {
                "class": "gxeMessageText"
            }, e), k.setNodeText(e, h.gemet.noMatch)) : f.saveSessionConceptQuery(b)
        }
    })
});