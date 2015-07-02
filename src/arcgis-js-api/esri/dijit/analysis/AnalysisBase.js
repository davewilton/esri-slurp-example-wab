//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/_base/json", "dojo/has", "dojo/json", "dojo/Deferred", "dojo/promise/all", "dojo/when", "dojo/data/ItemFileWriteStore", "dojo/string", "dojo/Evented", "dojo/_base/kernel", "dojo/Stateful", "../../kernel", "../../lang", "../../request", "../../tasks/Geoprocessor", "dojo/i18n!../../nls/jsapi", "./utils", "../../IdentityManager"], function(t, v, d, h, k, A, B, n, q, w, C, p, x, y, z, m, g, l, u, r, s) {
    return v([z, x], {
        declaredClass: "esri.dijit.analysis.AnalysisBase",
        isOutputLayerItemUpdated: !1,
        analysisGpServer: null,
        toolName: null,
        portalUrl: null,
        jobParams: null,
        itemParams: null,
        gp: null,
        resultParameter: null,
        signInPromise: null,
        getResultLyrInfos: !1,
        _jobInfo: null,
        _popupInfo: null,
        _toolServiceUrl: null,
        _counter: null,
        constructor: function(a) {
            this.isOutputLayerItemUpdated = !1;
            this._rids = [];
            this._counter = 0;
            this._popupInfo = [];
            a.analysisGpServer ? this._signIn(a.analysisGpServer) : a.portalUrl && (this.portalUrl = a.portalUrl, this._signIn(a.portalUrl, !0));
            this.i18n = {};
            d.mixin(this.i18n, r.common);
            d.mixin(this.i18n,
                r.analysisTools);
            d.mixin(this.i18n, r.analysisMsgCodes)
        },
        execute: function(a) {
            this.jobParams = a.jobParams;
            this.itemParams = this.jobParams.OutputName ? a.itemParams : null;
            this.signInPromise.then(d.hitch(this, this._checkUser))
        },
        _checkUser: function() {
            var a;
            if (a = m.id.findCredential(this.portalUrl).userId) a = this.portalUrl + "/sharing/rest/community/users/" + a, l({
                url: a,
                content: {
                    f: "json"
                }
            }).then(d.hitch(this, this._handleUserProfileResponse), d.hitch(this, function(a) {
                this.emit("job-fail", {
                    message: a.message + (a.details ?
                        a.details.toString() : ""),
                    jobParams: this.jobParams
                })
            }))
        },
        _handleUserProfileResponse: function(a) {
            a.orgId ? "account_admin" === a.role || "account_publisher" === a.role || "org_admin" === a.role || "org_publisher" === a.role ? this.itemParams ? this._checkServiceName(a.orgId) : (this._submitGpJob(), this.emit("start", this.jobParams)) : this.emit("job-fail", {
                message: this.i18n.pubRoleMsg,
                messageCode: "AB_0001",
                jobParams: this.jobParams
            }) : this.emit("job-fail", {
                message: this.i18n.orgUsrMsg,
                jobParams: this.jobParams
            })
        },
        _checkServiceName: function(a) {
            var b;
            m.id.findCredential(this.portalUrl);
            a = this.portalUrl + "/sharing/rest/portals/" + a + "/isServiceNameAvailable";
            b = {
                name: k.fromJson(this.jobParams.OutputName).serviceProperties.name,
                type: "Feature Service",
                f: "json"
            };
            l({
                url: a,
                content: b
            }).then(d.hitch(this, function(a) {
                a.available ? (this._createService(), this.emit("start", this.jobParams)) : this.emit("job-fail", {
                    message: this.i18n.servNameExists,
                    type: "warning",
                    messageCode: "AB_0002",
                    jobParams: this.jobParams
                })
            }), d.hitch(this, function(a) {
                this.emit("job-fail", {
                    message: a.message +
                        (a.details ? a.details.toString() : ""),
                    jobParams: this.jobParams
                })
            }))
        },
        _createService: function() {
            var a, b, e;
            a = m.id.findCredential(this.portalUrl).userId;
            b = k.fromJson(this.jobParams.OutputName);
            a && (e = this.itemParams.folder, a = this.portalUrl + "/sharing/rest/content/users/" + a + (e && "/" !== e ? "/" + e : "") + "/createService", b = {
                createParameters: k.toJson({
                    currentVersion: 10.2,
                    serviceDescription: "",
                    hasVersionedData: !1,
                    supportsDisconnectedEditing: !1,
                    hasStaticData: !0,
                    maxRecordCount: 2E3,
                    supportedQueryFormats: "JSON",
                    capabilities: "Query",
                    description: "",
                    copyrightText: "",
                    allowGeometryUpdates: !1,
                    syncEnabled: !1,
                    editorTrackingInfo: {
                        enableEditorTracking: !1,
                        enableOwnershipAccessControl: !1,
                        allowOthersToUpdate: !0,
                        allowOthersToDelete: !0
                    },
                    xssPreventionInfo: {
                        xssPreventionEnabled: !0,
                        xssPreventionRule: "InputOnly",
                        xssInputRule: "rejectInvalid"
                    },
                    tables: [],
                    name: b.serviceProperties.name
                }),
                outputType: "featureService",
                f: "json"
            }, l({
                url: a,
                content: b
            }, {
                usePost: !0
            }).then(d.hitch(this, this._submitGpJob), d.hitch(this, this._handleCreateServiceError)))
        },
        _handleCreateServiceError: function(a) {
            this.emit("job-fail", {
                message: a.message + (a.details ? a.details.toString() : ""),
                jobParams: this.jobParams
            })
        },
        _getSelf: function(a) {
            return l({
                url: a + "/sharing/rest/portals/self",
                content: {
                    culture: y.locale,
                    f: "json"
                },
                callbackParamName: "callback",
                timeout: 0
            }, {})
        },
        _submitGpJob: function(a) {
            var b;
            this.itemParams && (this.currentGpItemId = a.itemId, b = k.fromJson(this.jobParams.OutputName), b.serviceProperties && (b.serviceProperties.serviceUrl = a.serviceurl), b.itemProperties = {
                itemId: a.itemId
            }, this.jobParams.OutputName = k.toJson(b));
            this.analysisGpServer ?
                ((!this._toolServiceUrl || !this.gp) && this.set("toolServiceUrl", this.analysisGpServer + "/" + this.toolName), this.gp.setUpdateDelay(3E3), this.gp.submitJob(this.jobParams, d.hitch(this, this._gpJobComplete), d.hitch(this, this._gpJobStatus), d.hitch(this, this._gpJobFailed)), this.emit("job-submit", this.jobParams)) : this._getSelf(this.portalUrl).then(d.hitch(this, function(a) {
                    this.analysisGpServer = a.helperServices.analysis && a.helperServices.analysis.url ? a.helperServices.analysis.url : null;
                    this.set("toolServiceUrl",
                        this.analysisGpServer + "/" + this.toolName);
                    this.gp.setUpdateDelay(3E3);
                    this.gp.submitJob(this.jobParams, d.hitch(this, this._gpJobComplete), d.hitch(this, this._gpJobStatus), d.hitch(this, this._gpJobFailed));
                    this.emit("job-submit", this.jobParams)
                }))
        },
        _updateItem: function(a) {
            var b, e, c;
            if (b = m.id.findCredential(this.portalUrl).userId) return e = this.itemParams.folder, b = this.portalUrl + "/sharing/rest/content/users/" + b + (e && "/" !== e ? "/" + e : "") + "/items/" + this.currentGpItemId + "/update", a && (c = a.item.properties), g.isDefined(c) ||
                (c = {}), g.isDefined(c.jobUrl) || (c.jobUrl = this._toolServiceUrl + "/jobs/" + this._jobInfo.jobId, c.jobType = "GPServer", c.jobId = this._jobInfo.jobId, c.jobStatus = "processing", this.itemParams.properties = c), a = d.mixin({
                    f: "json"
                }, this.itemParams), a.properties && (a.properties = k.toJson(a.properties)), c = {}, this._popupInfo && 0 < this._popupInfo.length ? c.layers = h.map(this._popupInfo, function(a, c) {
                        a.description = null;
                        var b = {
                            id: c,
                            popupInfo: a
                        };
                        this._showLabels && this._showLabels[c] && (b.showLabels = this._showLabels[c]);
                        return b
                    },
                    this) : this._showLabels && 0 < this._showLabels.length && (c.layers = h.map(this._showLabels, function(a, c) {
                    var b = {
                        id: c
                    };
                    this._showLabels && this._showLabels[c] && (b.showLabels = this._showLabels[c]);
                    return b
                }, this)), a.text = k.toJson(c), a = l({
                    url: b,
                    content: a
                }, {
                    usePost: !0
                }), a.then(d.hitch(this, this._handleItemUpdate), d.hitch(this, this._handleUpdateItemError)), a
        },
        _handleItemUpdate: function(a) {
            this.isOutputLayerItemUpdated = !0
        },
        _handleItemDataUpdate: function(a) {},
        _handleUpdateItemError: function(a) {
            this.isOutputLayerItemUpdated = !0;
            this.emit("job-fail", {
                message: a.message + (a.details ? a.details.toString() : ""),
                jobParams: this.jobParams
            })
        },
        _handleErrorResponse: function(a) {
            this.emit("job-fail", a)
        },
        _refreshItem: function() {
            var a, b;
            if (a = m.id.findCredential(this.portalUrl).userId) return b = this.itemParams.folder, a = this.portalUrl + "/sharing/rest/content/users/" + a + (b && "/" !== b ? "/" + b : "") + "/items/" + this.currentGpItemId + "/refresh", l({
                url: a,
                content: {
                    f: "json"
                }
            }, {
                usePost: !0
            })
        },
        _handleItemRefresh: function(a) {},
        _readItem: function() {
            var a, b;
            if (a =
                m.id.findCredential(this.portalUrl).userId) return b = this.itemParams.folder, a = this.portalUrl + "/sharing/rest/content/users/" + a + (b && "/" !== b ? "/" + b : "") + "/items/" + this.currentGpItemId, a = l({
                url: a,
                content: {
                    f: "json"
                }
            }), a.then(d.hitch(this, this._updateItem))
        },
        _gpJobStatus: function(a) {
            var b = "",
                e = [],
                c, f;
            a.jobParams = this.jobParams;
            a.resultParameter = this.resultParameter;
            a.returnProcessInfo = this.jobParams.returnProcessInfo;
            a.getResultLyrInfos = this.getResultLyrInfos;
            a.currentGpItemId = this.currentGpItemId;
            a.itemParams =
                this.itemParams;
            if ("esriJobFailed" === a.jobStatus || "esriJobSucceeded" === a.jobStatus) a.message ? b = a.message : a.messages && (e = h.filter(a.messages, function(a) {
                if (("esriJobMessageTypeError" === a.type || "esriJobMessageTypeWarning" === a.type) && a.description && -1 !== a.description.indexOf("messageCode")) return a.description
            }), 0 < e.length && h.forEach(e, function(e) {
                c = k.fromJson(e.description);
                f = "";
                "esriJobMessageTypeWarning" === e.type && (a.type = "warning");
                c.messageCode ? (f = g.isDefined(this.i18n[c.messageCode]) ? this.i18n[c.messageCode] :
                    c.message, f = g.isDefined(c.params) ? p.substitute(f, c.params) : f, b += f + "\x26nbsp;") : c.error && c.error.messageCode && (f = g.isDefined(this.i18n[c.error.messageCode]) ? this.i18n[c.error.messageCode] : c.error.message, f = g.isDefined(c.error.params) ? p.substitute(f, c.error.params) : f, b += f + "\x26nbsp;")
            }, this)), a.message = b, this._checkTimer && (clearInterval(this._checkTimer), this._checkTimer = null, this._gpJobComplete(a)), "esriJobFailed" === a.jobStatus && this._deleteItem(!1);
            this.emit("job-status", a);
            this._jobInfo = a;
            this.itemParams &&
                !this.isOutputLayerItemUpdated && this._readItem()
        },
        _updateRefreshItem: function(a) {
            var b = [],
                e = a[0],
                c = [];
            this.getResultLyrInfos ? (this._lyrInfos = [], this._showLabels = [], h.forEach(a, function(a, b) {
                var e, d;
                if ((d = a.value.url) && -1 !== d.indexOf("/FeatureServer/")) e = d.match(/[0-9]+$/g)[0], c[e] = l({
                    url: d,
                    content: {
                        f: "json"
                    },
                    callbackParamName: "callback"
                })
            }, this), a = q(c)) : (b.push(this._refreshItem()), b.push(this._readItem()), a = "sync");
            w(a, d.hitch(this, function(a) {
                a && (a instanceof Array && 0 < a.length) && (h.forEach(a, function(a,
                    c) {
                    this._lyrInfos[c] = a;
                    a.drawingInfo && a.drawingInfo.labelingInfo && (this._showLabels[c] = !0)
                }, this), b.push(this._refreshItem()), b.push(this._readItem()));
                q(b).then(d.hitch(this, function(a) {
                    e.outputLayerName = k.fromJson(this.jobParams.OutputName).serviceProperties.name;
                    e.value.itemId = this.currentGpItemId;
                    e.analysisInfo = {
                        toolName: this.toolName,
                        jobParams: this.jobParams
                    };
                    this.emit("job-result", e)
                }), d.hitch(this, this._handleDeleteItemError))
            }), d.hitch(this, this._handleDeleteItemError))
        },
        _gpJobComplete: function(a) {
            var b;
            "esriJobSucceeded" === a.jobStatus && (a.jobParams = this.jobParams, this.emit("job-success", a), q(this._getGpResultData(a)).then(d.hitch(this, function(e) {
                e = h.filter(e, function(a) {
                    if (a.value && !a.value.empty) return a
                });
                0 === e.length ? (this.currentGpItemId && this._deleteItem(!1), this.emit("job-fail", {
                    message: this.i18n.emptyResultInfoMsg,
                    type: "warning",
                    jobParams: this.jobParams
                })) : (g.isDefined(this.itemParams) && (this.itemParams.properties && this.itemParams.properties.jobStatus && "processing" === this.itemParams.properties.jobStatus) &&
                    (this.itemParams.properties.jobStatus = "completed"), h.forEach(e, function(a) {
                        if (a.value.featureSet && !a.value.url) a.value.featureSet.spatialReference = a.value.layerDefinition.spatialReference;
                        else if (a.value.url && -1 !== a.value.url.indexOf("/FeatureServer/") && a.value.layerInfo && a.value.layerInfo.popupInfo) {
                            var b = a.value.url.match(/[0-9]+$/g)[0];
                            this._popupInfo[b] = a.value.layerInfo.popupInfo
                        }
                    }, this), b = e[0], this.jobParams.returnProcessInfo ? this.gp.getResultData(a.jobId, "ProcessInfo").then(d.hitch(this, function(a) {
                        var d = [];
                        h.forEach(a.value, function(a) {
                            d.push(k.fromJson(a))
                        }, this);
                        this.currentGpItemId ? (this.itemParams.description = s.buildReport(d), this._updateRefreshItem(e)) : (b.analysisReport = s.buildReport(d), this.emit("job-result", b))
                    })) : this.currentGpItemId ? this._updateRefreshItem(e) : this.emit("job-result", b))
            })))
        },
        _gpJobFailed: function(a) {
            var b = "",
                e = [],
                c, f;
            d.clone(a).jobParams = this.jobParams;
            this._checkTimer && (clearInterval(this._checkTimer), this._checkTimer = null);
            a.message ? b = a.message : a.messages && (e = h.filter(a.messages,
                function(a) {
                    if (("esriJobMessageTypeError" === a.type || "esriJobMessageTypeWarning" === a.type) && a.description && -1 !== a.description.indexOf("messageCode")) return a.description
                }), 0 < e.length && h.forEach(e, function(a) {
                c = k.fromJson(a.description);
                f = "";
                c.messageCode ? (f = g.isDefined(this.i18n[c.messageCode]) ? this.i18n[c.messageCode] : c.message, f = g.isDefined(c.params) ? p.substitute(f, c.params) : f, b += f + "\x26nbsp;") : c.error && c.error.messageCode && (f = g.isDefined(this.i18n[c.error.messageCode]) ? this.i18n[c.error.messageCode] :
                    c.error.message, f = g.isDefined(c.params) ? p.substitute(f, c.error.params) : f, b += f + "\x26nbsp;")
            }, this));
            a.message = b;
            this.emit("job-fail", a)
        },
        _getGpResultData: function(a) {
            var b = [],
                e = [];
            "string" === typeof this.resultParameter ? e.push(this.resultParameter) : this.resultParameter instanceof Array && (e = this.resultParameter);
            h.forEach(e, function(c, e) {
                b.push(this.gp.getResultData(a.jobId, c))
            }, this);
            return b
        },
        cancel: function(a) {
            this.gp.cancelJob(a.jobId).then(d.hitch(this, function(a) {
                "esriJobCancelled" === a.jobStatus &&
                    (this.itemParams ? this._deleteItem(!0) : this.emit("job-cancel", a))
            }), function(a) {})
        },
        checkJobStatus: function(a) {
            this.signInPromise.then(d.hitch(this, function() {
                this.gp.setUpdateDelay(3E3);
                this._checkTimer = setInterval(d.hitch(this, this._checkStatus, a, d.hitch(this, this._gpJobStatus), d.hitch(this, this._gpJobFailed)), 3E3)
            }))
        },
        _checkStatus: function(a, b, e) {
            this.gp.checkJobStatus(a, b, e)
        },
        _deleteItem: function(a) {
            var b, e;
            if ((b = m.id.findCredential(this.portalUrl).userId) && this.itemParams) e = g.isDefined(this.itemParams.folder) ?
                this.itemParams.folder : "", b = this.portalUrl + "/sharing/rest/content/users/" + b + (e && "/" !== e ? "/" + e : "") + "/items/" + this.currentGpItemId + "/delete", l({
                    url: b,
                    content: {
                        f: "json"
                    }
                }, {
                    usePost: !0
                }).then(d.hitch(this, this._handleItemDelete, a), d.hitch(this, this._handleDeleteItemError))
        },
        _handleItemDelete: function(a, b) {
            a && this.emit("job-cancel", b)
        },
        _handleDeleteItemError: function(a) {
            this.emit("job-fail", {
                message: a.message + (a.details ? a.details.toString() : ""),
                jobParams: this.jobParams
            })
        },
        _initFolderStore: function(a, b) {
            this._fportal =
                new a.Portal(this.portalUrl);
            this._fportal.signIn().then(d.hitch(this, function(a) {
                this.portalUser = a;
                this.portalUser.getFolders().then(d.hitch(this, function(a) {
                    a = s.createFolderStore(a, this.portalUser.username);
                    b.resolve(a)
                }))
            }))
        },
        getFolderStore: function() {
            var a = new n,
                b, e, c, f;
            this.folderStore ? a.resolve(this.folderStore) : this.signInPromise.then(d.hitch(this, function(d) {
                m.id.findCredential(this.portalUrl);
                b = ["../../arcgis/Portal"];
                e = this._counter++;
                c = this;
                this._rids && this._rids.push(e);
                t(b, function(b) {
                    f =
                        c._rids ? h.indexOf(c._rids, e) : -1; - 1 !== f && (c._rids.splice(f, 1), c._initFolderStore(b, a))
                })
            }));
            return a
        },
        _checkToolUrl: function() {
            var a = new n;
            this.analysisGpServer ? ((!this._toolServiceUrl || !this.gp) && this.set("toolServiceUrl", this.analysisGpServer + "/" + this.toolName), a.resolve({
                success: !0
            })) : this._getSelf(this.portalUrl).then(d.hitch(this, function(b) {
                (this.analysisGpServer = b.helperServices.analysis && b.helperServices.analysis.url ? b.helperServices.analysis.url : null) && this.set("toolServiceUrl", this.analysisGpServer +
                    "/" + this.toolName);
                a.resolve({
                    success: !0
                })
            }));
            return a
        },
        getCreditsEstimate: function(a, b) {
            var e, c, f, h, g;
            c = new n;
            this._checkToolUrl().then(d.hitch(this, function(k) {
                this._toolServiceUrl ? g = this._toolServiceUrl : (h = this.portalUrl && -1 !== this.portalUrl.indexOf("dev") ? "dev" : this.portalUrl && -1 !== this.portalUrl.indexOf("qa") ? "qa" : "", g = "http://analysis" + h + ".arcgis.com/arcgis/rest/services/tasks/GPServer/" + this.toolName);
                e = g.replace("/" + a, "/exts/Estimate/" + a);
                f = d.mixin({
                    f: "json"
                }, b);
                l({
                    url: e,
                    content: f
                }, {
                    usePost: !0
                }).then(function(a) {
                        c.resolve(a)
                    },
                    function(a) {
                        c.resolve(a)
                    })
            }));
            return c
        },
        _signIn: function(a, b) {
            var e, c, f, g, k;
            this.signInPromise = new n;
            b ? (e = ["../../arcgis/Portal"], c = this._counter++, f = this, this._rids && this._rids.push(c), t(e, d.hitch(this, function(b) {
                g = f._rids ? h.indexOf(f._rids, c) : -1; - 1 !== g && (f._rids.splice(g, 1), this._portal = new b.Portal(a), this._portal.signIn().then(d.hitch(this, function(a) {
                    this.portalUser = a;
                    this._portal.helperServices && this._portal.helperServices.analysis && this._portal.helperServices.analysis.url ? (this.analysisGpServer =
                        this._portal.helperServices.analysis.url, l({
                            url: this.analysisGpServer,
                            content: {
                                f: "json"
                            },
                            callbackParamName: "callback"
                        }).then(d.hitch(this, function(a) {
                            k = m.id.findCredential(this.analysisGpServer);
                            this.signInPromise.resolve(k)
                        }), d.hitch(this, function(a) {
                            this.signInPromise.reject(a)
                        }))) : this.signInPromise.resolve(a)
                }), d.hitch(this, function(a) {
                    this.signInPromise.reject(a)
                })))
            }))) : l({
                url: a,
                content: {
                    f: "json"
                },
                callbackParamName: "callback"
            }).then(d.hitch(this, function(b) {
                b = m.id.findCredential(a);
                this.portalUrl =
                    m.id.findServerInfo(this._toolServiceUrl).owningSystemUrl;
                this.signInPromise.resolve(b)
            }), d.hitch(this, function(a) {
                this.signInPromise.reject(a)
            }));
            return this.signInPromise
        },
        _toolServiceUrlSetter: function(a) {
            this._toolServiceUrl = a;
            this.gp = new u(a)
        },
        _setToolServiceUrlAttr: function(a) {
            this._toolServiceUrl = a;
            this.gp = new u(a)
        }
    })
});