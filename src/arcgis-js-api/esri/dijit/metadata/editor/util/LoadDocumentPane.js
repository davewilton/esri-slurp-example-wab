//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/aspect", "dojo/dom-class", "dojo/dom-construct", "dojo/dom-style", "dojo/has", "../../base/xml/xmlUtil", "../../base/xml/XmlInterrogator", "../../base/Templated", "dojo/text!./templates/LoadDocumentPane.html", "dojo/i18n!../../nls/i18nBase", "../../base/TabButton", "../../../../kernel"], function(k, f, g, l, h, d, c, s, m, n, p, q, e, t, u) {
    return k([p], {
        _inputFileNode: null,
        _working: !1,
        editor: null,
        dialogBroker: null,
        prompt: null,
        templateString: q,
        postCreate: function() {
            this.inherited(arguments);
            this.fileSection.xtnAsTemplate = !1;
            this._initialize()
        },
        onSelect: function(a, b, c) {},
        onSelectPullItem: function() {},
        _addBrowseButton: function() {
            var a = d.create("div", {}, this.importNode);
            this._inputFileNode = d.create("input", {
                "class": "gxeLine",
                type: "file",
                onchange: f.hitch(this, function(a) {
                    this._loadXmlFile(a)
                })
            }, a)
        },
        _addDocType: function(a) {
            var b = d.create("div", {}, this.typesNode),
                b = d.create("div", {
                    "class": "gxeClickableText gxeLine",
                    onclick: f.hitch(this, function() {
                        this._working || this._loadDocType(a)
                    })
                }, b);
            this.setI18nNodeText(b, a.caption)
        },
        _initialize: function() {
            null !== this.prompt && (this.setI18nNodeText(this.promptNode, this.prompt), this.promptNode.style.display = "");
            var a = this.editor.getEditDocument(),
                b = window && window.FileReader,
                a = a && this.editor.gxeAdaptor.getAllowPullItem(),
                r = this.editor.gxeContext.filterDocumentTypes();
            this._setMode("type");
            g.forEach(r, function(a) {
                this._addDocType(a)
            }, this);
            b ? this._addBrowseButton() : (c.set(this.fileTab.domNode, "display", "none"), c.set(this.templateTab.domNode, "display",
                "none"));
            a || c.set(this.itemTab.domNode, "display", "none")
        },
        _loadDocType: function(a) {
            if (!this._working) this.onSelect(a, null, !1)
        },
        _loadXmlFile: function(a) {
            this.importWarningNode.innerHTML = "";
            this.importWarningSection.style.display = "none";
            if (a && (a.target && a.target.files) && FileReader) {
                var b = null;
                (a = a.target.files) && 1 === a.length && (b = a[0]);
                b && (this._showMessage(e.editor.load.loading), a = new FileReader, this.own(l.after(a, "onload", f.hitch(this, function(a) {
                    a && a.target && a.target.result ? this._working || (this._showMessage(e.editor.load.loading),
                        this._parseAndLoad(a.target.result)) : this._showUnrecognizedXml(e.editor.load.warnings.badFile)
                }), !0)), a.readAsText(b))
            }
        },
        _onFileTabClick: function(a) {
            this._working || this._setMode(a.xtnMode)
        },
        _onItemTabClick: function(a) {
            this._working || this._setMode(a.xtnMode)
        },
        _onPullItemClick: function() {
            if (!this._working) this.onSelectPullItem()
        },
        _onTemplateTabClick: function(a) {
            this._working || this._setMode(a.xtnMode)
        },
        _onTypeTabClick: function(a) {
            this._working || this._setMode(a.xtnMode)
        },
        _parseAndLoad: function(a) {
            var b =
                null;
            try {
                b = m.parseFromString(a)
            } catch (c) {
                console.error(c);
                this._showUnrecognizedXml(e.editor.load.warnings.badFile);
                return
            }
            a = this.editor.gxeContext.filterDocumentTypes();
            a = (new n).interrogate(b, a);
            var d = this.fileSection.xtnAsTemplate;
            if (a) this.onSelect(a, b, d);
            else this._showUnrecognizedXml(e.editor.load.warnings.notSupported)
        },
        _setMode: function(a) {
            g.forEach([this.typeTab, this.fileTab, this.templateTab, this.itemTab], function(b) {
                a === b.xtnMode ? h.add(b.domNode, "current") : h.remove(b.domNode, "current")
            });
            this.fileSection.xtnAsTemplate = "template" === a;
            "type" === a ? (c.set(this.fileSection, "display", "none"), c.set(this.itemSection, "display", "none"), c.set(this.typesSection, "display", "")) : "item" === a ? (c.set(this.typesSection, "display", "none"), c.set(this.fileSection, "display", "none"), c.set(this.itemSection, "display", "")) : ("file" === a ? (c.set(this.templatePrompt, "display", "none"), c.set(this.filePrompt, "display", "")) : (c.set(this.filePrompt, "display", "none"), c.set(this.templatePrompt, "display", "")), c.set(this.typesSection,
                "display", "none"), c.set(this.itemSection, "display", "none"), c.set(this.fileSection, "display", ""))
        },
        _showMessage: function(a) {
            if (this.dialogBroker) {
                var b = this.dialogBroker.okCancelBar;
                b && b.showWorking(a)
            }
        },
        _showUnrecognizedXml: function(a) {
            this.setNodeText(this.importWarningNode, e.editor.load.importWarning);
            this.importWarningSection.style.display = "block";
            this.dialogBroker && this.dialogBroker.okCancelBar && this.dialogBroker.okCancelBar.hideWorking()
        }
    })
});