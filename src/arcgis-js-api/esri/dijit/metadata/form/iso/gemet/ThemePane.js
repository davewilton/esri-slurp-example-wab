//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/dom-construct", "dojo/has", "../../../base/Templated", "dojo/text!./templates/ThemePane.html", "dojo/i18n!../../../nls/i18nBase", "dojo/i18n!../../../nls/i18nIso", "../../../base/etc/docUtil", "./gemet", "../../../../../request", "../../../../../kernel"], function(n, k, m, d, t, p, q, r, f, l, e, s, u) {
    return n([p], {
        checkBoxes: null,
        dialogBroker: null,
        gxeDocument: null,
        initiallySelectedValues: null,
        i18nBase: r,
        i18nIso: f,
        templateString: q,
        gemetUrl: null,
        gemetInspireThemeThesaurus: null,
        initialLanguage: null,
        _activePromise: null,
        postCreate: function() {
            this.inherited(arguments);
            this.workingNode.style.display = "none";
            this.checkBoxes = [];
            var a = this.gxeDocument.gxeContext;
            this.gemetUrl = a.gemetUrl;
            this.gemetInspireThemeThesaurus = a.gemetInspireThemeThesaurus;
            e.populateLanguages(this.gxeDocument, this.languageSelect);
            this.initialLanguage = e.getSelectedLanguage(this.languageSelect);
            this._query()
        },
        _addOption: function(a, c, b) {
            var h = "Unknown",
                g = null;
            a.preferredLabel && "string" === typeof a.preferredLabel.string &&
                (h = k.trim(a.preferredLabel.string));
            a.definition && "string" === typeof a.definition.string && (g = k.trim(a.definition.string), 0 === g.length && (g = null));
            a = this.id + "_chk" + c;
            b = d.create("div", {
                "class": "gxeOption"
            }, b);
            var e = h;
            c = m.some(this.initiallySelectedValues, function(a) {
                if (a === e) return !0
            });
            var f = {
                id: a,
                type: "checkbox",
                value: e
            };
            c && (f.checked = "checked");
            c = d.create("input", f, b);
            this.checkBoxes.push(c);
            a = d.create("label", {
                "for": a
            }, b);
            l.setNodeText(a, h);
            null !== g && 0 < g.length && (h = d.create("div", {
                    "class": "gxeDescription gxeSmallText"
                },
                b), l.setNodeText(h, g))
        },
        _fetch: function(a, c) {
            var b = this.gemetUrl + "/getConceptsMatchingRegexByThesaurus",
                b = b + ("?thesaurus_uri\x3d" + encodeURIComponent(this.gemetInspireThemeThesaurus)),
                b = b + ("\x26language\x3d" + encodeURIComponent(a)),
                b = b + ("\x26regex\x3d" + encodeURIComponent(c));
            return s({
                url: b,
                handleAs: "json",
                callbackParamName: "jsonp"
            }, {})
        },
        _handleError: function(a) {
            this.workingNode.style.display = "none";
            console.error(a);
            a = f.gemet.ioerror.replace("{url}", this.gemetUrl);
            d.empty(this.resultsNode);
            var c = d.create("div", {
                "class": "gxeMessagePane"
            }, this.resultsNode);
            d.create("div", {
                "class": "gxeIcon gxeIconError"
            }, c);
            c = d.create("div", {
                "class": "gxeMessageText"
            }, c);
            l.setNodeText(c, a)
        },
        _onCancelClick: function(a) {
            this.onCancelClick(a)
        },
        onCancelClick: function(a) {},
        _onLanguageChange: function(a) {
            this._query()
        },
        _onOkClick: function(a) {
            var c = [];
            a = null;
            m.forEach(this.checkBoxes, function(a) {
                a.checked && c.push(a.value)
            });
            0 < c.length && (a = e.getSelectedLanguage(this.languageSelect), this.initialLanguage !== a && e.saveSessionLanguage(a));
            this.onOkClick(c)
        },
        onOkClick: function(a) {},
        _query: function() {
            var a = e.getSelectedLanguage(this.languageSelect);
            null === this._activePromise && (this.workingNode.style.display = "inline-block", d.empty(this.resultsNode), (this._activePromise = this._fetch(a, ".")).then(k.hitch(this, function(a) {
                this._activePromise = null;
                try {
                    this._render(a)
                } catch (b) {
                    this._handleError(b)
                }
            }), k.hitch(this, function(a) {
                this._activePromise = null;
                this._handleError(a)
            })))
        },
        _render: function(a) {
            var c = 0,
                b = this.resultsNode;
            d.empty(b);
            this.checkBoxes = [];
            m.forEach(a, function(a, d) {
                c++;
                this._addOption(a, d, b)
            }, this);
            this.workingNode.style.display = "none";
            0 === c && (d.empty(b), a = d.create("div", {
                "class": "gxeMessagePane"
            }, b), d.create("div", {
                "class": "gxeIcon gxeIconWarning"
            }, a), a = d.create("div", {
                "class": "gxeMessageText"
            }, a), l.setNodeText(a, f.gemet.noMatch))
        }
    })
});