//>>built
define(["./Credential", "./domUtils", "./lang", "./urlUtils", "dijit/Dialog", "dijit/registry", "dojo/_base/config", "dojo/_base/Deferred", "dojo/_base/kernel", "dojo/dom-attr", "dojo/i18n!esri/nls/jsapi", "dojo/io-query", "dojo/sniff", "dojo/json", "dijit/form/Button", "dojo/query"], function(s, k, n, t, p, q, l, u, e, m, v, r, w, x) {
    return {
        _oAuthDfd: null,
        _oAuthIntervalId: 0,
        _oAuthDialogContent: "\x3cdiv class\x3d'dijitDialogPaneContentArea'\x3e\x3cdiv style\x3d'padding-bottom: 5px; word-wrap: break-word;'\x3e${info}\x3c/div\x3e\x3cdiv style\x3d'margin: 0px; padding: 0px; height: 10px;'\x3e\x3c/div\x3e\x3cdiv class\x3d'esriErrorMsg' style\x3d'display: none; color: white; background-color: #D46464; text-align: center; padding-top: 3px; padding-bottom: 3px;'\x3e${invalidUser}\x3c/div\x3e\x3cdiv style\x3d'margin: 0px; padding: 0px; height: 10px;'\x3e\x3c/div\x3e\x3cdiv class\x3d'dijitDialogPaneActionBar'\x3e\x3cbutton data-dojo-type\x3d'dijit.form.Button' data-dojo-props\x3d'type:\"button\", \"class\":\"esriIdSubmit\"'\x3e${lblOk}\x3c/button\x3e\x3cbutton data-dojo-type\x3d'dijit.form.Button' data-dojo-props\x3d'type:\"button\", \"class\":\"esriIdCancel\"'\x3e${lblCancel}\x3c/button\x3e\x3c/div\x3e",
        setOAuthRedirectionHandler: function(b) {
            this._oAuthRedirectFunc = b
        },
        oAuthSignIn: function(b, c, a, d) {
            var f = this._oAuthDfd = new u;
            f.resUrl_ = b;
            f.sinfo_ = c;
            f.oinfo_ = a;
            var g = !d || !1 !== d.oAuthPopupConfirmation;
            if (!a.popup || !g) return this._doOAuthSignIn(b, c, a), f;
            this._nls || (this._nls = v.identity);
            this.oAuthDialog || (this.oAuthDialog = this._createOAuthDialog());
            a = this.oAuthDialog;
            g = d && d.error;
            d = d && d.token;
            k.hide(a.errMsg_);
            g && (403 == g.code && d) && (m.set(a.errMsg_, "innerHTML", this._nls.forbidden), k.show(a.errMsg_));
            m.set(a.resLink_, {
                title: b,
                innerHTML: "(" + (this.getResourceName(b) || this._nls.lblItem) + ")"
            });
            m.set(a.serverLink_, {
                title: c.server,
                innerHTML: (-1 !== c.server.toLowerCase().indexOf("arcgis.com") ? "ArcGIS Online" : c.server) + " "
            });
            a.show();
            return f
        },
        setOAuthResponseHash: function(b) {
            var c = this._oAuthDfd;
            this._oAuthDfd = null;
            if (c && b)
                if (clearInterval(this._oAuthIntervalId), "#" === b.charAt(0) && (b = b.substring(1)), b = r.queryToObject(b), b.error) b = Error("access_denied" === b.error ? "ABORTED" : "OAuth: " + b.error + " - " + b.error_description), b.code =
                    "IdentityManagerBase.2", b.log = l.isDebug, c.errback(b);
                else {
                    var a = c.oinfo_._oAuthCred,
                        d = new s({
                            userId: b.username,
                            server: c.sinfo_.server,
                            token: b.access_token,
                            expires: (new Date).getTime() + 1E3 * Number(b.expires_in),
                            ssl: "true" === b.ssl,
                            _oAuthCred: a
                        });
                    a.storage = b.persist ? window.localStorage : window.sessionStorage;
                    a.token = d.token;
                    a.expires = d.expires;
                    a.userId = d.userId;
                    a.ssl = d.ssl;
                    a.save();
                    c.callback(d)
                }
        },
        _createOAuthDialog: function() {
            var b = this._nls,
                c = n.substitute(b, this._oAuthDialogContent),
                c = n.substitute({
                    resource: "\x3cspan class\x3d'resLink' style\x3d'word-wrap: break-word;'\x3e\x3c/span\x3e",
                    server: "\x3cspan class\x3d'serverLink' style\x3d'word-wrap: break-word;'\x3e\x3c/span\x3e"
                }, c),
                a = new p({
                    title: b.title,
                    content: c,
                    "class": "esriOAuthSignInDialog",
                    style: "width: 18em;",
                    esriIdMgr_: this,
                    execute_: function() {
                        var b = a.esriIdMgr_._oAuthDfd;
                        a.hide_();
                        a.esriIdMgr_._doOAuthSignIn(b.resUrl_, b.sinfo_, b.oinfo_)
                    },
                    cancel_: function() {
                        var b = a.esriIdMgr_._oAuthDfd;
                        a.esriIdMgr_._oAuthDfd = null;
                        a.hide_();
                        var c = Error("ABORTED");
                        c.code = "IdentityManager.2";
                        c.log = l.isDebug;
                        b.errback(c)
                    },
                    hide_: function() {
                        k.hide(a.errMsg_);
                        a.hide();
                        p._DialogLevelManager.hide(a)
                    }
                }),
                b = a.domNode;
            a.btnSubmit_ = q.byNode(e.query(".esriIdSubmit", b)[0]);
            a.btnCancel_ = q.byNode(e.query(".esriIdCancel", b)[0]);
            a.resLink_ = e.query(".resLink", b)[0];
            a.serverLink_ = e.query(".serverLink", b)[0];
            a.errMsg_ = e.query(".esriErrorMsg", b)[0];
            a.connect(a.btnSubmit_, "onClick", a.execute_);
            a.connect(a.btnCancel_, "onClick", a.onCancel);
            a.connect(a, "onCancel", a.cancel_);
            return a
        },
        _doOAuthSignIn: function(b, c, a) {
            var d = this,
                f = {
                    client_id: a.appId,
                    response_type: "token",
                    state: x.stringify({
                        portalUrl: a.portalUrl
                    }),
                    expiration: a.expiration,
                    locale: a.locale,
                    redirect_uri: a.popup ? t.getAbsoluteUrl(a.popupCallbackUrl) : window.location.href.replace(/#.*$/, "")
                },
                g = a.portalUrl.replace(/^http:/i, "https:") + "/sharing/oauth2/authorize",
                e = g + "?" + r.objectToQuery(f);
            if (a.popup) {
                var h;
                7 === w("ie") ? (h = window.open(a.popupCallbackUrl, "esriJSAPIOAuth", a.popupWindowFeatures), h.location = e) : h = window.open(e, "esriJSAPIOAuth", a.popupWindowFeatures);
                this._oAuthIntervalId = setInterval(function() {
                    if (h.closed) {
                        clearInterval(d._oAuthIntervalId);
                        var a = d._oAuthDfd;
                        if (a) {
                            var b = Error("ABORTED");
                            b.code = "IdentityManager.2";
                            b.log = l.isDebug;
                            a.errback(b)
                        }
                    }
                }, 500)
            } else this._oAuthRedirectFunc ? this._oAuthRedirectFunc({
                authorizeParams: f,
                authorizeUrl: g,
                resourceUrl: b,
                serverInfo: c,
                oAuthInfo: a
            }) : window.location = e
        }
    }
});