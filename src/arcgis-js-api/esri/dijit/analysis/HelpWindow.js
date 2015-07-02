//>>built
define(["require", "dojo/_base/array", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/connect", "dojo/_base/event", "dojo/_base/kernel", "dojo/aspect", "dojo/has", "dojo/dom-construct", "dojo/dom-class", "dojo/dom-attr", "dojo/dom-style", "dojo/query", "dojo/window", "dojo/dom-geometry", "dijit/_Widget", "dijit/TooltipDialog", "dijit/popup", "../../kernel", "../../lang", "../../request", "../_EventedWidget", "dojo/i18n!../../nls/jsapi"], function(n, p, s, e, B, C, f, t, D, E, F, G, u, v, w, x, y, z, k, H, q, A, I, r) {
    return s([y], {
        declaredClass: "esri.dijit.analysis.HelpWindow",
        i18n: null,
        basePath: n.toUrl("."),
        onlineHelpMap: null,
        showLearnMore: !1,
        "class": "esriAnalyisHelpWindow",
        postMixInProperties: function() {
            this.inherited(arguments);
            this.i18n = {};
            e.mixin(this.i18n, r.common);
            e.mixin(this.i18n, r.analysisHelp)
        },
        postCreate: function() {
            this.inherited(arguments);
            var b = ["ar", "he"],
                a, c;
            this.onlineHelpMap = {};
            for (a = 0; a < b.length; a += 1) c = b[a], f.locale && -1 !== f.locale.indexOf(c) && (-1 !== f.locale.indexOf("-") ? -1 !== f.locale.indexOf(c + "-") && (this._isRightToLeft = !0) : this._isRightToLeft = !0);
            b =
                this._getAbsoluteUrl(this.basePath) + "/help/helpmap.json";
            A({
                url: b
            }).then(e.hitch(this, function(a) {
                this.onlineHelpMap = a.map
            }))
        },
        _getAbsoluteUrl: function(b) {
            if (/^https?\:/i.test(b)) return b;
            if (/^\/\//i.test(b)) return window.location.protocol + b;
            if (/^\//i.test(b)) return window.location.protocol + "//" + window.location.host + b
        },
        _computeSize: function(b) {
            var a = {
                w: 400,
                h: 200
            }; - 1 !== b.indexOf("Category") ? (a.w = 400, a.h = 320) : -1 !== b.indexOf("Tool") ? (a.w = 400, a.h = 320) : -1 !== b.indexOf("toolDescription") && (a.w = 400, a.h = 520);
            return a
        },
        _setHelpTopicAttr: function(b) {
            this.tooltipHelpDlg && (k.close(this.tooltipHelpDlg), this.tooltipHelpDlg.destroy(), this.tooltipHelpDlg = null);
            var a, c, d, l, g;
            this.showLearnMore = !1;
            g = this._analysisGpServer && -1 !== this._analysisGpServer.indexOf("dev") ? "dev" : this._analysisGpServer && -1 !== this._analysisGpServer.indexOf("qa") ? "uat" : "";
            a = e.clone(f.locale);
            "nb" === a && (a = "no");
            c = n.toUrl("esri/dijit/analysis/help/");
            d = c + this.helpFileName + ".html";
            q.isDefined(this.onlineHelpMap[this.helpFileName]) && q.isDefined(this.onlineHelpMap[this.helpFileName][b]) &&
                (this.showLearnMore = !0, l = "http://doc" + g + ".arcgis.com/en/arcgis-online/use-maps/" + this.onlineHelpMap[this.helpFileName][b]); - 1 !== p.indexOf("ar cs da de es el et fi fr it ja ko lt lv ru nl no pl pt-br pt-pt ro sv th tr vi zh-cn".split(" "), a) && (-1 !== a.indexOf("-") && (d = a.split("-"), a = d[0] + "-" + d[1].toUpperCase()), d = c + a + "/" + this.helpFileName + ".html"); - 1 !== p.indexOf("ar da de es fr it ja ko ru nl no pl pt-br pt-pt ro zh-cn".split(" "), a) && this.showLearnMore && (l = "http://doc" + g + ".arcgis.com/" + a + "/arcgis-online/use-maps/" +
                this.onlineHelpMap[this.helpFileName][b]);
            this._size = c = this._computeSize(b);
            this.tooltipHelpDlg = new z({
                preload: !0,
                content: "\x3cdiv class\x3d'' style\x3d'position:relative'\x3cdiv class\x3d'sizer content'\x3e\x3cdiv class\x3d'contentPane'\x3e\x3cdiv class\x3d'esriFloatTrailing' style\x3d'padding:0;'\x3e\x3ca href\x3d'#' class\x3d'esriAnalysisCloseIcon' title\x3d'" + this.i18n.close + "'\x3e\x3c/a\x3e\x3c/div\x3e\x3ciframe frameborder\x3d'0'  id\x3d'" + b + "' src\x3d'" + d + "#" + b + "' width\x3d'" + c.w + "' height\x3d'" +
                    c.h + "' marginheight\x3d'0' marginwidth\x3d'0'\x3e\x3c/iframe\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d'sizer'\x3e\x3cdiv class\x3d'actionsPane'\x3e\x3cdiv class\x3d'actionList" + (this.showLearnMore ? "'\x3e" : " hidden'\x3e") + "\x3ca class\x3d'action zoomTo' href\x3d'" + (this.showLearnMore ? l : "#") + "' target\x3d'_help'\x3e" + this.i18n.learnMore + "\x3c/a\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e",
                "class": "esriHelpPopup esriHelpPopupWrapper esriAnalyisHelpWindow"
            });
            this.tooltipHelpDlg.startup()
        },
        show: function(b, a) {
            this.helpFileName = a.helpFileName;
            this._analysisGpServer = a.analysisGpServer;
            this.set("helpTopic", a.helpId);
            var c = t.after(k, "open", e.hitch(this, function() {
                    v(".esriAnalysisCloseIcon", this.tooltipHelpDlg.domNode).on("click", e.hitch(this, this.close));
                    c.remove()
                })),
                d = b.pageX,
                f = w.getBox(),
                g, h, m;
            m = !1;
            a.helpParentNode && (g = a.helpParentNode);
            g && (h = x.position(g));
            h && !this._isRightToLeft && f.w - b.pageX < h.w ? (m = !0, d = h.x - this._size.w - 10) : this._isRightToLeft && d - 40 < this._size.w && (d = h.w + this._size.w +
                80);
            k.open({
                popup: this.tooltipHelpDlg,
                x: !0 === this._isRightToLeft || m ? d - 40 : d + 40,
                y: b.screenY - b.pageY + 10,
                onCancel: e.hitch(this, function() {
                    this.close()
                }),
                onExecute: function() {
                    this.close()
                }
            });
            this.tooltipHelpDlg.domNode.parentNode && u.set(this.tooltipHelpDlg.domNode.parentNode, "overflowY", "hidden")
        },
        close: function(b, a) {
            k.close(this.tooltipHelpDlg)
        }
    })
});