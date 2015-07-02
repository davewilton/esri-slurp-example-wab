//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/has", "dojo/query", "dijit/registry", "dijit/_WidgetBase", "../../../../kernel"], function(m, n, h, r, p, l, q, s) {
    return m([q], {
        gxeDocument: null,
        isPull: !0,
        portal: null,
        portalItem: null,
        portalUser: null,
        portalUrl: null,
        itemPropertiesToPush: null,
        postCreate: function() {
            this.inherited(arguments)
        },
        afterPullValue: function(a, c) {},
        checkCoordinate: function(a) {
            var c = typeof a;
            if ("undefined" === c && null === a) return null;
            if ("string" === c) {
                a = parseFloat(a);
                if (isNaN(a)) return null;
                c = typeof a
            }
            return "number" === c ? !isFinite(a) ? null : a : null
        },
        checkVisibility: function(a, c) {},
        findInputValue: function(a, c, b) {
            c = this.findInputWidget(a, c, b);
            if (null !== c)
                for (a = c.getParent(); a;) {
                    if (a._isOptionallyOff) {
                        c = null;
                        break
                    }
                    a = a.getParent()
                }
            if (null !== c) return c.getInputValue()
        },
        findInputWidget: function(a, c, b) {
            if ((a = p("[data-gxe-path\x3d'" + c + "']", this.gxeDocument.rootDescriptor.domNode)) && 1 === a.length) {
                if (b = l.byNode(a[0])) return b.inputWidget
            } else if (a && (0 < a.length && b) && (b = l.byNode(a[0]))) return b.inputWidget;
            return null
        },
        generatePush: function(a, c) {
            this.isPull = !1;
            this.gxeDocument = a;
            this.portalItem = c;
            this.itemPropertiesToPush = null;
            var b = {},
                d = this.newTransformationInfo(a);
            this.populateTransformationInfo(a, c, d);
            var e = null,
                g = !1;
            for (e in d) d.hasOwnProperty(e) && this.pushValue(b, d, e);
            for (e in b) b.hasOwnProperty(e) && (g = !0);
            g && (this.itemPropertiesToPush = b);
            return this.itemPropertiesToPush
        },
        pull: function(a, c) {
            this.isPull = !0;
            this.gxeDocument = a;
            this.portalItem = c;
            var b = this.newTransformationInfo(a);
            this.populateTransformationInfo(a,
                c, b);
            var d = null;
            for (d in b) b.hasOwnProperty(d) && this.pullValue(c, b, d, !1)
        },
        newTransformationInfo: function(a) {
            a = function(a) {
                return {
                    path: null,
                    canPull: !0,
                    canPush: a,
                    isSelected: !0,
                    valueToPush: null
                }
            };
            return {
                id: a(!1),
                title: a(!1),
                snippet: a(!0),
                description: a(!0),
                accessInformation: a(!1),
                licenseInfo: a(!1),
                thumbnail: a(!1),
                culture: a(!1),
                url: a(!1),
                created: a(!1),
                modified: a(!1),
                type: a(!1),
                tags: a(!0),
                typeKeywords: a(!1),
                extent: {
                    xmin: a(!0),
                    ymin: a(!0),
                    xmax: a(!0),
                    ymax: a(!0)
                },
                spatialReference: a(!1),
                name: a(!1),
                owner: a(!1)
            }
        },
        populateTransformationInfo: function(a, c, b) {},
        pullValue: function(a, c, b, d) {
            var e = null,
                g = e = null,
                f = null,
                k = null,
                h = null;
            if (b in a && b in c) {
                f = a[b];
                e = c[b];
                if ("undefined" === typeof f || "undefined" === typeof e) return;
                if ("extent" === b) {
                    if (f && f.push && 2 === f.length && 2 === f[0].length && 2 === f[1].length)
                        for (h in k = {
                                xmin: f[0][0],
                                ymin: f[0][1],
                                xmax: f[1][0],
                                ymax: f[1][1]
                            }, k) k.hasOwnProperty(h) && this.pullValue(k, e, h, !0);
                    return
                }
                null !== e && (e.canPull && e.isSelected) && (g = e.path, "undefined" === typeof g && (g = null));
                "id" === b && null !== f &&
                    (f = "itemid" + f);
                "tags" === b && null !== f && 0 === f.length && (f = null)
            }
            null !== f && null !== g && (e = this.findInputWidget(b, g, !d), null !== e && (e.setInputValue(f), e.parentXNode && e.parentXNode.toggleContent && e.parentXNode.toggleContent(!0), this.checkVisibility(e, g), this.afterPullValue(e, g)))
        },
        pushExtent: function(a, c, b, d, e) {
            c = this.checkCoordinate(c);
            b = this.checkCoordinate(b);
            d = this.checkCoordinate(d);
            e = this.checkCoordinate(e);
            if (!(null === c || null === d))
                if (!(null === b || null === e))
                    if (!(-180 > c || 180 < c))
                        if (!(-180 > d || 180 < d))
                            if (!(-90 >
                                    b || 90 < b))
                                if (!(-90 > e || 90 < e) && !(d < c) && !(e < b)) {
                                    var g = !0,
                                        f = this.portalItem.extent;
                                    f && f.push && 2 === f.length && 2 === f[0].length && 2 === f[1].length && c === f[0][0] && (b === f[0][1] && d === f[1][0] && e === f[1][1]) && (g = !1);
                                    g && (a.extent = c + "," + b + "," + d + "," + e)
                                }
        },
        pushString: function(a, c, b) {
            if (!("undefined" === typeof b || null === b) && "string" === typeof b)
                if (b = n.trim(b), 0 !== b.length) {
                    var d = this.portalItem[c];
                    if ("undefined" === typeof d || b !== d) a[c] = b
                }
        },
        pushTags: function(a, c) {
            if (!("undefined" === typeof c || null === c) && c.push && 0 < c.length) {
                var b =
                    this.portalItem.tags,
                    d = [],
                    e = !0,
                    g = 0;
                "undefined" !== typeof b && null !== b && b.push ? (h.forEach(b, function(a) {
                    d.push(a)
                }), h.forEach(c, function(a) {
                    h.some(b, function(b) {
                        return a === b
                    }) || d.push(a)
                }), d.length === b.length && (h.forEach(d, function(a) {
                    h.some(b, function(b) {
                        return a === b
                    }) && g++
                }), g === d.length && (e = !1)), e && (a.tags = d.join(","))) : a.tags = c.join(",")
            }
        },
        pushValue: function(a, c, b) {
            var d = null,
                e = null,
                g = {};
            c = c[b];
            if ("undefined" !== typeof c)
                if ("extent" === b) {
                    for (e in c) c.hasOwnProperty(e) && this.pushValue(g, c, e);
                    this.pushExtent(a,
                        g.xmin, g.ymin, g.xmax, g.ymax)
                } else c.canPush && c.isSelected && (d = c.path, "undefined" === typeof d && (d = null)), null !== d && (d = this.findInputValue(b, d, "tags" === b), "undefined" !== typeof d && null !== d && ("string" === typeof d ? this.pushString(a, b, d) : d.push && 0 < d.length && "tags" === b && this.pushTags(a, d)))
        }
    })
});