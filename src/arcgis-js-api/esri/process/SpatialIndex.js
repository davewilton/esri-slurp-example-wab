//>>built
define(["../sniff", "../kernel", "dojo/_base/declare", "dojo/Deferred", "dojo/_base/lang", "./Processor", "../workers/WorkerClient", "../layers/FeatureLayer"], function(t, u, p, l, q, r, m, s) {
    return p([r], {
        declaredClass: "esri.process.SpatialIndex",
        index: null,
        indexType: "rtree",
        workerCallback: ["./scripts/helpers", "./scripts/indexInterface", "./indexWorker"],
        autostart: !1,
        constructor: function(a) {
            a = a || {};
            var b = !1 !== a.autostart;
            q.mixin(this, a);
            if (!this.fetchWithWorker) {
                var c = this;
                this.workerClient = new m("./mutableWorker", !0);
                this.workerCallback.push("./libs/" + this.indexType);
                this.workerClient.importScripts(this.workerCallback).then(function() {
                    c._attachedSystem = !0;
                    b && c.start()
                })
            }
            this._featCache = {}
        },
        addLayer: function(a, b) {
            if (a.graphics && a.graphics.length || b || a.isInstanceOf(s))
                if (this._attachedSystem) this.inherited(arguments, [a]);
                else {
                    var c = this.workerClient,
                        g = this;
                    this.inherited(arguments, [a, !0]);
                    c.importScripts("./libs/" + this.indexType).then(function() {
                        g.runProcess(a.graphics, a.id);
                        g._attachedSystem = !0
                    })
                }
        },
        unsetMap: function() {
            this.stop();
            this.workerClient.terminate();
            this.fetchWithWorker || (this.workerClient = new m(this.workerCallback, !0));
            this.inherited(arguments);
            this.start()
        },
        removeLayer: function(a) {
            this.inherited(arguments)
        },
        runProcess: function(a, b) {
            if (a && a.length) {
                var c = this,
                    g = this.workerClient,
                    d = a[0]._graphicsLayer;
                !b && 0 !== b && (b = d ? d.id : "rawFeatures_" + Object.keys(this._featCache).length);
                this._featCache[b] || (this._featCache[b] = {});
                for (var e, f, h = [], k = a.length, n = d && d.objectIdField; k--;)
                    if (f = a[k], e = f.attributes && n ? f.attributes[n] :
                        f.id, null == e || !this._featCache[b][e]) this._featCache[b][e] = 1, f.declaredClass ? h.push({
                        id: e,
                        geometry: f.geometry,
                        attributes: f.attributes
                    }) : h.push(f);
                g.postMessage({
                    insert: h,
                    system: this.indexType,
                    options: this.indexOptions,
                    idField: d && d.objectIdField,
                    layerId: b
                }).then(function(a) {
                    d && d.emit("process-end", {
                        processor: c,
                        results: {
                            insert: a.insert
                        }
                    })
                });
                d && d.emit("process-start", {
                    processor: this
                })
            }
        },
        _sendFeaturesFromLayer: function(a, b) {
            var c = b.graphic,
                g = this.workerClient,
                d = this,
                e = c.attributes[a.objectIdField];
            this._featCache[a.id] ||
                (this._featCache[a.id] = {});
            this._featCache[a.id][e] || (this._featCache[a.id][e] = 1, g.postMessage({
                insert: [{
                    attributes: c.attributes,
                    geometry: c.geometry
                }],
                system: this.indexType,
                options: this.indexOptions,
                idField: a.objectIdField,
                layerId: a.id
            }).then(function(b) {
                a.emit("process-end", {
                    processor: d,
                    results: {
                        insert: b.insert
                    }
                })
            }), a.emit("process-start", {
                processor: d
            }))
        },
        _notifyProcessStart: function(a, b) {},
        _sendFeaturesFromTask: function(a, b) {
            var c = b.featureSet.features,
                g = [],
                d = this.workerClient,
                e = this,
                f = c.length,
                h, k;
            for (this._featCache[a.id] || (this._featCache[a.id] = {}); f--;) k = c[f], h = k.attributes[a.objectIdField], this._featCache[a.id][h] || (this._featCache[a.id][h] = 1, g.push(k));
            d.postMessage({
                insert: g,
                system: this.indexType,
                options: this.indexOptions,
                idField: a.objectIdField,
                layerId: a.id
            }).then(function(b) {
                a.emit("process-end", {
                    processor: e,
                    results: {
                        insert: b.insert
                    }
                })
            });
            a.emit("process-start", {
                processor: e
            })
        },
        get: function() {},
        intersects: function(a, b, c) {
            return "rtree" != this.indexType ? (console.error("Index.intersects only works with rtree indexes"),
                a = new l, a.reject({
                    message: "Index.intersects only works with rtree indexes"
                }), a.promise) : a = this.workerClient.postMessage({
                search: a,
                layerId: b,
                returnNode: c
            })
        },
        within: function(a, b, c) {
            if ("rtree" != this.indexType) return console.error("Index.within only works with rtree indexes"), a = new l, a.reject({
                message: "Index.within only works with rtree indexes"
            }), a.promise
        },
        nearest: function(a) {
            return "kdtree" != this.indexType ? (console.error("Index.nearest only works with kdtree indexes"), a = new l, a.reject({
                    message: "Index.nearest only works with kdtree indexes"
                }),
                a.promise) : a = this.workerClient.postMessage({
                search: a
            })
        }
    })
});