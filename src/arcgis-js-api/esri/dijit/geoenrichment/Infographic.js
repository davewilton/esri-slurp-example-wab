//>>built
define(["require", "module", "../../declare", "dojo/_base/lang", "dojo/dom-construct", "dojo/Deferred", "../_EventedWidget", "./DataProvider", "./Geoenrichment", "./config", "dojo/on", "../../tasks/geoenrichment/GeoenrichmentTask", "../../tasks/geoenrichment/RingBuffer", "dojo/dom-class", "./_Invoke", "./utils"], function(d, k, h, c, l, m, n, p, q, f, r, s, t, g, u, v) {
    function w(a, b) {
        var e = new m,
            c = new s(f.server);
        c.token = f.token;
        var d = b[0].split(".");
        c.getDataCollections(null, d[0]).then(function(b) {
            if ("OneVar" == a)
                if ("*" == d[1]) e.resolve(b[0].variables[0].alias);
                else {
                    b = b[0].variables;
                    for (var c = 0; c < b.length; c++)
                        if (b[c].id == d[1]) {
                            e.resolve(b[c].alias);
                            return
                        }
                    e.reject(Error("Variable was not found within the data collection: " + b[0]))
                } else e.resolve(b[0].metadata.title)
        }, function(a) {
            e.reject(a)
        });
        return e.promise
    }
    var x = h([p], {
        _data: null,
        constructor: function(a, b) {
            this._data = a;
            c.mixin(this.metadata, b)
        },
        getData: function() {
            return this._data
        }
    });
    return h("esri.dijit.geoenrichment.Infographic", [n, u], {
        countryID: null,
        levels: f.levels,
        highestLevel: f.highestLevel,
        title: null,
        subtitle: "\x3cdiv\x3e${address}\x3c/div\x3e\x3cdiv\x3e${name}\x3c/div\x3e",
        type: null,
        variables: null,
        studyArea: null,
        studyAreaOptions: null,
        outSR: null,
        expanded: !0,
        returnGeometry: !1,
        dataProvider: null,
        _data: null,
        _ge: null,
        _autoTitle: null,
        _autoTitlePromise: null,
        _eventMap: {
            resize: ["size"],
            "data-request": !0,
            "data-ready": ["provider"],
            "data-load": !0,
            "data-error": ["error"]
        },
        constructor: function() {
            this.studyAreaOptions = new t
        },
        postMixInProperties: function() {
            this._ge = new q;
            this._ge.on("start", c.hitch(this, this._onDataRequest));
            this._ge.on("data", c.hitch(this, this._onDataReady));
            this._ge.on("end", c.hitch(this, this._onDataLoad));
            this._ge.on("error", c.hitch(this, this._onDataError));
            this.dataProvider = this._ge;
            this.type && (this.invoke("_updateAutoTitle"), this._updateReport())
        },
        buildRendering: function() {
            this.inherited(arguments);
            this.domNode = l.create("div");
            this.expanded || g.add(this.domNode, "Collapsed")
        },
        destroy: function() {
            this._destroyReportWidget();
            this._ge.stop();
            this.inherited(arguments)
        },
        _setReturnGeometryAttr: function(a) {
            this._set("returnGeometry",
                a);
            this._ge.returnGeometry = a
        },
        _setTitleAttr: function(a) {
            this._set("title", a);
            this._widget && (this._widget.title = a)
        },
        _setSubtitleAttr: function(a) {
            this._set("subtitle", a);
            this._ge.setReturnAddress(/\$\{address\}/.test(a));
            this._widget && (this._widget.subtitle = a)
        },
        _setTypeAttr: function(a) {
            this.type != a && (this._set("type", a), this._widget && this._widget.setDataProvider(null), this.invoke("_updateAutoTitle"), this._updateReport())
        },
        _updateReport: function() {
            this._updateLevels();
            this.invoke("_requireReport")
        },
        _getAbsMid: function(a) {
            return d.toAbsMid ? d.toAbsMid(a) : k.id.replace(/\/[^\/]*$/ig, "/") + a
        },
        _requireReport: function() {
            this.type && d([this._getAbsMid("./" + this.type)], c.hitch(this, this._createReportWidget, this.type))
        },
        _updateAutoTitle: function() {
            if (!c.isString(this.title) && this.type && this.variables) {
                var a = this;
                this._autoTitlePromise = w(this.type, this.variables);
                this._autoTitlePromise.then(function(b) {
                    a._autoTitle = b
                }, function(b) {
                    a._onDataError(b)
                });
                this._autoTitlePromise.always(function() {
                    a._autoTitlePromise =
                        null
                })
            }
        },
        _setCountryIDAttr: function(a) {
            this._set("countryID", a);
            this._ge.country = a
        },
        _setVariablesAttr: function(a) {
            var b = !0;
            if (c.isArray(a))
                for (var e = 0; e < a.length; e++) {
                    if (0 >= a[e].indexOf(".")) {
                        b = !1;
                        break
                    }
                } else null != a && (b = !1);
            if (!b) throw Error("Invalid value for variables");
            this._set("variables", a);
            this._ge.setVariables(a);
            this.invoke("_updateAutoTitle")
        },
        _setStudyAreaAttr: function(a) {
            this._set("studyArea", a);
            this._ge.setStudyArea(a)
        },
        _setSpatialReference: function(a) {
            this._set("outSR", a);
            this._ge.setOutSR(a)
        },
        _setStudyAreaOptionsAttr: function(a) {
            this._set("studyAreaOptions", a);
            this._ge.setBuffer(a)
        },
        _setExpandedAttr: function(a) {
            this.expanded != a && (this._destroyReportWidget(), this._set("expanded", a), a ? g.remove(this.domNode, "Collapsed") : g.add(this.domNode, "Collapsed"), this._updateReport())
        },
        _setCacheLimitAttr: function(a) {
            this._ge.setCacheLimit(a)
        },
        setData: function(a, b) {
            this.set("dataProvider", new x(a, b))
        },
        _setDataProviderAttr: function(a) {
            this.dataProvider !== a && (this._set("dataProvider", a), this._ge && (this._ge.stop(),
                this._ge = null), this._widget && this._widget.setDataProvider(a))
        },
        _updateLevels: function() {
            v.supportsComparison(this.type, this.expanded) ? this._ge.setGeoLevels(this.levels, this.highestLevel) : this._ge.setGeoLevels(null, null)
        },
        _widget: null,
        _createReportWidget: function(a, b) {
            if (!(this._destroyed || this.type != a))
                if (this._ge && this._ge.isBusy()) r.once(this._ge, "end", c.hitch(this, this._createReportWidget, this.type, b));
                else if (this._autoTitlePromise) this._autoTitlePromise.then(c.hitch(this, this._createReportWidget,
                this.type, b));
            else {
                var e = this._widget ? this._widget.getState("selectedComparison") : NaN;
                this._destroyReportWidget();
                if (this.type) {
                    var d = this._widget = new b(this.domNode);
                    d.title = c.isString(this.title) ? this.title : this._autoTitle;
                    d.subtitle = this.subtitle;
                    d.expanded = this.expanded;
                    d.on("resize", c.hitch(this, this._onResize));
                    isNaN(e) || d.setState({
                        selectedComparison: e
                    });
                    d.setDataProvider(this.dataProvider)
                }
            }
        },
        resize: function() {
            this._widget && this._widget.resize()
        },
        _destroyReportWidget: function() {
            this._widget &&
                (this._widget.destroy(), this._widget = null)
        },
        _onResize: function(a) {
            this.onResize(a)
        },
        onResize: function(a) {},
        _onDataRequest: function() {
            this.onDataRequest()
        },
        onDataRequest: function() {},
        _onDataReady: function() {
            this.onDataReady(this._ge)
        },
        onDataReady: function(a) {},
        _onDataLoad: function() {
            this.onDataLoad()
        },
        onDataLoad: function() {},
        _onDataError: function(a) {
            this.onDataError(a)
        },
        onDataError: function(a) {}
    })
});