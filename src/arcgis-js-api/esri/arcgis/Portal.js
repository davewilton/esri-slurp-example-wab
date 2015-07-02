//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/kernel", "dojo/_base/Deferred", "dojo/_base/array", "dojo/_base/sniff", "require", "../kernel", "../lang", "../request", "../Evented", "../IdentityManager"], function(h, c, w, l, g, B, t, x, y, z, A) {
    var f = {
            options: {
                disableIdentityLookup: !0
            },
            requestParams: {
                f: "json"
            }
        },
        k = function(a) {
            function b(b) {
                a[b] || (a[b] = function() {
                    var c = arguments;
                    return l.when(a, function(a) {
                        Array.prototype.unshift.call(c, a.results || a);
                        return k(g[b].apply(g, c))
                    })
                })
            }
            if (!a) return a;
            a.then && (a = c.delegate(a));
            a.total || (a.total = l.when(a, function(a) {
                return y.isDefined(a.total) ? a.total : a.length || 0
            }));
            b("forEach");
            b("filter");
            b("map");
            b("some");
            b("every");
            return a
        },
        e = {
            useSSL: function(a, b) {
                var d = f && f.self || {};
                if (d && !d.isPortal) return -1 !== a.indexOf("https:") || d.allSSL ? b.replace("http:", "https:") : b;
                var c = e.getLocation(b);
                if (-1 < d.portalHostname.toLowerCase().indexOf(c.hostname.toLowerCase()) && c.port && "80" !== c.port && "443" !== c.port) {
                    var g = c.pathname,
                        g = 0 === g.indexOf("/") ? g : "/" + g;
                    return d.allSSL || -1 < a.indexOf("https:") ?
                        "https://" + c.hostname + (d.httpsPort && "443" !== d.httpsPort ? ":" + d.httpsPort : "") + g + c.search : "http://" + c.hostname + (d.httpPort && "80" !== d.httpPort ? ":" + d.httpPort : "") + g + c.search
                }
                return -1 !== a.indexOf("https:") || d.allSSL ? b.replace("http:", "https:") : b
            },
            formatUrl: function(a) {
                var b = f.currentToken;
                return -1 !== a.indexOf("null") ? null : e.useSSL(window.location.protocol, b ? a + (-1 !== a.indexOf("?") ? "\x26" : "?") + ("token\x3d" + b) : a)
            },
            getLocation: function(a) {
                var b = document.createElement("a");
                b.href = a;
                return {
                    protocol: b.protocol,
                    hostname: b.hostname,
                    port: b.port,
                    pathname: b.pathname,
                    search: b.search,
                    hash: b.hash,
                    host: b.host
                }
            },
            resultsToTypedArray: function(a, b, d) {
                d = d ? d.listings || d.notifications || d.userInvitations || d.tags || d.items || d.groups || d.comments || d.results || d : [];
                return g.map(d, function(d) {
                    d = c.mixin(d, b || {});
                    return a ? new a(d) : d
                })
            },
            clearFieldsFromObject: function(a, b) {
                var d, e = a.length;
                if (c.isArray(a))
                    for (d = 0; d < e; d++) delete b[a[d]];
                else
                    for (d in a) delete b[d];
                return b
            },
            requestToTypedArray: function(a, b, d, f, g) {
                return k(e.request(a,
                    b, d).then(c.partial(e.resultsToTypedArray, f, g)))
            },
            request: function(a, b, d) {
                var g;
                b && b.portal && delete b.portal;
                b && b.form && (g = b.form, delete b.form);
                b = c.mixin(c.mixin({}, b || {}), f.requestParams);
                d = c.mixin(d || {}, f.options);
                return z({
                    url: e.useSSL(window.location.protocol, a.url || a),
                    content: b,
                    callbackParamName: "callback",
                    timeout: d && d.timeout || 0,
                    form: g
                }, d)
            },
            formatQueryParams: function(a, b, d) {
                a = c.mixin(c.mixin({}, a), c.isString(b) ? {
                    q: b
                } : b || {});
                a.q = !d && f.extraQuery ? "(" + a.q + ")" + f.extraQuery : a.q;
                return a
            }
        },
        n = h([], {
            declaredClass: "esri.arcgis.PortalComment",
            constructor: function(a) {
                c.mixin(this, a);
                this.url = this.item.itemUrl + "/comments/" + this.id;
                this.created = this.created ? new Date(this.created) : null
            }
        }),
        p = h([], {
            declaredClass: "esri.arcgis.PortalRating",
            constructor: function(a) {
                c.mixin(this, a);
                this.url = this.item.itemUrl + "/rating";
                this.created = this.created ? new Date(this.created) : null
            }
        }),
        m = h([], {
            declaredClass: "esri.arcgis.PortalItem",
            constructor: function(a) {
                c.mixin(this, a);
                this.folderId = this.ownerFolder || this.folderId;
                this.itemUrl = (this.portal && this.portal.portalUrl) + "content/items/" + this.id;
                this.userItemUrl = this.hasOwnProperty("ownerFolder") ? this.itemUrl.replace("content", "content/users/" + this.owner + (this.folderId ? "/" + this.folderId : "")) : null;
                this.itemDataUrl = e.formatUrl(this.itemUrl + "/data");
                this.thumbnailUrl = e.formatUrl(this.itemUrl + "/info/" + this.thumbnail);
                this.displayName = this._getDisplayName();
                this.iconUrl = this._getIconUrl();
                this.isPremiumContent = this._getIsPremiumContent();
                this.created = this.created ? new Date(this.created) :
                    null;
                this.uploaded = this.uploaded ? new Date(this.uploaded) : null;
                this.modified = this.modified ? new Date(this.modified) : null
            },
            getTypeInfo: function() {
                var a = this.type;
                return {
                    source: -1 < g.indexOf(this.typeKeywords || [], "ArcGIS Server") || "Feature Collection" === a ? a : null,
                    displayName: this.displayName,
                    iconUrl: this.iconUrl,
                    isPremiumContent: this.isPremiumContent,
                    premiumIconUrl: this._getPremiumIconUrl()
                }
            },
            addComment: function(a) {
                var b = c.isString(a) ? {
                    comment: a
                } : a;
                return e.request(this.itemUrl + "/addComment", b, {
                    usePost: !0
                }).then(c.hitch(this,
                    function(a) {
                        return new n(c.mixin(b, {
                            id: a.commentId,
                            item: this
                        }))
                    }))
            },
            updateComment: function(a) {
                if (a && a.url && a.comment) return e.request(a.url + "/update", {
                    comment: a.comment
                }, {
                    usePost: !0
                }).then(function(b) {
                    a.id = b.commentId;
                    return a
                });
                throw Error();
            },
            getComments: function() {
                return e.requestToTypedArray(this.itemUrl + "/comments", null, null, n, {
                    item: this
                })
            },
            deleteComment: function(a) {
                if (a && a.url) return e.request(a.url + "/delete", null, {
                    usePost: !0
                });
                throw Error();
            },
            addRating: function(a) {
                var b = c.isObject(a) ? a : {
                    rating: parseFloat(a)
                };
                return e.request(this.itemUrl + "/addRating", b, {
                    usePost: !0
                }).then(c.hitch(this, function(a) {
                    return new p(c.mixin(b, {
                        id: a.ratingId,
                        item: this
                    }))
                }))
            },
            getRating: function() {
                return e.request(this.itemUrl + "/rating").then(c.hitch(this, function(a) {
                    return new p(c.mixin(a, {
                        item: this
                    }))
                }))
            },
            deleteRating: function() {
                return e.request(this.itemUrl + "/deleteRating", null, {
                    usePost: !0
                })
            },
            _getDisplayName: function() {
                var a = this.type,
                    b = this.typeKeywords || [],
                    d = a;
                "Feature Service" === a || "Feature Collection" === a ? d = -1 < g.indexOf(b,
                    "Table") ? "Table" : "Feature Layer" : "Image Service" === a ? d = -1 < g.indexOf(b, "Elevation 3D Layer") ? "Elevation Layer" : "Imagery Layer" : "Scene Service" === a ? d = "Scene Layer" : "Stream Service" === a ? d = "Feature Layer" : "Microsoft Powerpoint" === a ? d = "Microsoft PowerPoint" : "GeoJson" === a ? this.type = d = "GeoJSON" : "Globe Service" === a ? d = "Globe Layer" : "Map Service" === a && (d = -1 < g.indexOf(b, "Hosted Service") || -1 < g.indexOf(b, "Tiled") ? "Tile Layer" : "Map Image Layer");
                return d
            },
            _getIconUrl: function() {
                var a = this.type && this.type.toLowerCase() ||
                    "",
                    b = this.typeKeywords || [],
                    d = !1,
                    c = !1;
                0 < a.indexOf("service") || "feature collection" === a || "kml" === a || "wms" === a || "wmts" === a ? (d = -1 < g.indexOf(b, "Hosted Service"), a = "feature service" === a || "feature collection" === a || "kml" === a ? (c = -1 < g.indexOf(b, "Table")) ? "table" : d ? "featureshosted" : "features" : "map service" === a || "wms" === a || "wmts" === a ? d || -1 < g.indexOf(b, "Tiled") ? "maptiles" : "mapimages" : "scene service" === a ? "sceneweblayer" : "image service" === a ? -1 < g.indexOf(b, "Elevation 3D Layer") ? "elevationlayer" : "imagery" : "stream service" ===
                        a ? "streamlayer" : "layers") : a = "web map" === a || "cityengine web scene" === a ? "maps" : "web scene" === a ? "webscene" : "web mapping application" === a || "mobile application" === a || "application" === a || "operation view" === a || "desktop application" === a ? "apps" : "map document" === a || "map package" === a || "published map" === a || "scene document" === a || "globe document" === a || "basemap package" === a || "mobile basemap package" === a || "mobile map package" === a || "project package" === a || "project template" === a || "pro map" === a || "layout" === a || "layer" ===
                    a && -1 < g.indexOf(b, "ArcGIS Pro") || "explorer map" === a && g.indexOf(b, "Explorer Document") ? "mapsgray" : "service definition" === a || "csv" === a || "shapefile" === a || "cad drawing" === a || "geojson" === a ? "datafiles" : "explorer add in" === a || "desktop add in" === a || "windows viewer add in" === a || "windows viewer configuration" === a ? "appsgray" : "rule package" === a || "file geodatabase" === a || "csv collection" === a || "kml collection" === a || "windows mobile package" === a || "map template" === a || "desktop application template" === a || "arcpad package" ===
                    a || "code sample" === a || "document link" === a || "tile package" === a || "operations dashboard add in" === a || "rules package" === a || "image" === a || "workflow manager package" === a || "desktop style" === a || "explorer map" === a && -1 < g.indexOf(b, "Explorer Mapping Application") || -1 < g.indexOf(b, "Document") ? "datafilesgray" : "geocoding service" === a || "network analysis service" === a || "geoprocessing service" === a || "geodata service" === a || "geometry service" === a || "geoprocessing package" === a || "locator package" === a || "geoprocessing sample" ===
                    a || "workflow manager service" === a || "raster function template" === a ? "toolsgray" : "layer" === a || "layer package" === a || "explorer layer" === a ? "layersgray" : "task file" === a ? "taskfile" : "maps";
                return a ? t.toUrl("../css/images/item_type_icons/" + a + "16.png") : null
            },
            _getIsPremiumContent: function() {
                var a = this.typeKeywords,
                    b = !1;
                if (-1 < g.indexOf(a, "Service") && (-1 < g.indexOf(a, "Requires Subscription") || -1 < g.indexOf(this.typeKeywords, "Requires Credits"))) b = !0;
                return b
            },
            _getPremiumIconUrl: function() {
                var a = this.typeKeywords,
                    b;
                this.isPremiumContent && (b = -1 < g.indexOf(a, "Requires Credits") ? "premiumcredits" : "premiumitem");
                return b ? t.toUrl("../css/images/item_type_icons/" + b + "16.png") : null
            }
        }),
        q = h([], {
            declaredClass: "esri.arcgis.PortalListing",
            constructor: function(a) {
                c.mixin(this, a);
                this.id = this.itemId;
                this.url = (this.portal && this.portal.portalUrl) + "content/" + (this.userItemUrl ? "items/" : "listings/") + this.itemId;
                this.commentsUrl = this.url + "/comments";
                this.created = this.created ? new Date(this.created) : null;
                this.banner = this.banner ? e.formatUrl(this.url +
                    "/info/" + this.banner) : "";
                this.thumbnail = this.thumbnail ? e.formatUrl(this.url + "/info/" + this.thumbnail) : "";
                this.largeThumbnail = this.largeThumbnail ? e.formatUrl(this.url + "/info/" + this.largeThumbnail) : "";
                this.avgRating = this.avgRating || 0;
                this.numRatings = this.numRatings || 0;
                this.numComments = this.numComments || 0;
                this.listingProperties = this.listingProperties || {
                    priceDesc: "",
                    creditsPerTransaction: 0,
                    licenseType: "free",
                    trialSupported: !1,
                    trialDuration: 0,
                    listingAccess: "private"
                };
                for (var b in this.listingProperties) this[b] &&
                    (this.listingProperties[b] = this[b]);
                this.properties = this.properties || {
                    systemRequirements: "",
                    termsAndConditions: "",
                    version: "1.0"
                };
                this.screenshots = g.map(this.screenshots, c.hitch(this, function(a) {
                    return e.formatUrl(this.url + "/info/" + a)
                }));
                this.vendorName = this.vendor.name;
                this.vendor.thumbnail = this.vendor.thumbnail ? this.userItemUrl ? e.formatUrl(this.portal.portalUrl + "/accounts/self/resources/" + this.vendor.thumbnail) : e.formatUrl(this.url + "/vendorinfo/" + this.vendor.thumbnail) : ""
            },
            getComments: function() {
                return e.requestToTypedArray(this.commentsUrl,
                    null, null, n, {
                        item: this
                    })
            },
            getVendor: function() {
                return this.vendor
            }
        }),
        r = h([], {
            declaredClass: "esri.arcgis.PortalProvision",
            constructor: function(a) {
                c.mixin(this, a);
                this.created = this.created ? new Date(this.created) : null;
                this.startDate = this.startDate ? new Date(this.startDate) : null;
                this.endDate = this.endDate && -1 !== this.endDate ? new Date(this.endDate) : null;
                this.listing = a.listing ? new q(c.mixin(a.listing, {
                    portal: this.portal
                })) : null
            }
        }),
        s = h([], {
            declaredClass: "esri.arcgis.PortalGroup",
            constructor: function(a) {
                c.mixin(this,
                    a);
                this.url = (this.portal && this.portal.portalUrl) + "community/groups/" + this.id;
                this.thumbnailUrl = e.formatUrl(this.url + "/info/" + this.thumbnail);
                this.modified = this.modified ? new Date(this.modified) : null;
                this.created = this.created ? new Date(this.created) : null
            },
            getMembers: function() {
                return e.request(this.url + "/users")
            },
            queryItems: function(a, b) {
                a = e.formatQueryParams({}, a, b);
                a.q = "group:" + this.id + (a.q ? " " + a.q : "");
                return this.portal.queryItems(a)
            }
        }),
        u = h([], {
            declaredClass: "esri.arcgis.PortalFolder",
            constructor: function(a) {
                c.mixin(this,
                    a);
                this.url = (this.portal && this.portal.portalUrl) + "content/users/" + this.username + "/" + this.id;
                this.created = this.created ? new Date(this.created) : null
            },
            getItems: function() {
                return e.requestToTypedArray(this.url, null, null, m, {
                    portal: this.portal,
                    folderId: this.id
                })
            }
        }),
        v = h([], {
            declaredClass: "esri.arcgis.PortalUser",
            constructor: function(a) {
                c.mixin(this, a);
                this.url = (this.portal && this.portal.portalUrl) + "community/users/" + this.username;
                this.userContentUrl = (this.portal && this.portal.portalUrl) + "content/users/" + this.username;
                this.thumbnailUrl = e.formatUrl(this.url + "/info/" + this.thumbnail);
                this.modified = this.modified ? new Date(this.modified) : null;
                this.created = this.created ? new Date(this.created) : null
            },
            getGroups: function() {
                return k(e.request(this.url).then(c.hitch(this, function(a) {
                    return e.resultsToTypedArray(s, {
                        portal: this.portal
                    }, a.groups)
                })))
            },
            getNotifications: function() {
                return e.requestToTypedArray(this.url + "/notifications", null, null, null, {
                    portal: this.portal
                })
            },
            getGroupInvitations: function() {
                return e.requestToTypedArray(this.url +
                    "/invitations", null, null, null, {
                        portal: this.portal
                    })
            },
            getTags: function() {
                return e.requestToTypedArray(this.url + "/tags", null, null, null, {
                    portal: this.portal
                })
            },
            getFolders: function() {
                return k(this.getContent().then(function(a) {
                    return a.folders
                }))
            },
            getItems: function(a) {
                return k(this.getContent(a).then(function(a) {
                    return a.items
                }))
            },
            getItem: function(a) {
                return e.request(this.portal.portalUrl + "content/items/" + a).then(c.hitch(this, function(a) {
                    return new m(c.mixin(a, {
                        portal: this.portal
                    }))
                }))
            },
            getContent: function(a) {
                var b =
                    this.url.replace("community", "content") + (a ? "/" + a : "");
                return e.request(b).then(c.hitch(this, function(b) {
                    b.folders = e.resultsToTypedArray(u, {
                        portal: this.portal
                    }, b.folders);
                    b.items = e.resultsToTypedArray(m, {
                        portal: this.portal,
                        folderId: a
                    }, b.items);
                    return b
                }))
            }
        });
    return {
        Portal: h([A], {
            declaredClass: "esri.arcgis.Portal",
            onLoad: function() {},
            onError: function() {},
            constructor: function(a) {
                a = c.isObject(a) ? a : {
                    url: a
                };
                this.registerConnectEvents();
                f = {
                    options: {
                        disableIdentityLookup: !0
                    },
                    requestParams: {
                        f: "json"
                    }
                };
                a.self ?
                    (f.self = a.self, c.mixin(this, {
                        url: a.url || window.location.protocol + "//" + (a.self.urlKey ? a.self.urlKey + "." + a.self.customBaseUrl : a.self.portalHostname)
                    }), this.portalUrl = -1 !== this.url.indexOf("/sharing") ? this.url + "/" : this.url + "/sharing/rest/", a = a.self.user ? this.signIn() : this.init(this.url)) : (a.url && c.mixin(this, {
                        url: a.url
                    }), a = this.init(this.url));
                a.then(c.hitch(this, function() {
                    this.emit("ready", this);
                    this.onLoad(this)
                }))
            },
            init: function(a, b) {
                a = (a || this.portalUrl).replace(/\/+$/, "");
                this.portalUrl = -1 !== a.indexOf("/sharing") ?
                    a + "/" : a + "/sharing/rest/";
                return this._getSelf(this.portalUrl).then(c.hitch(this, function(a) {
                    f.self = c.mixin({}, a);
                    if ((a = a.user) && b) f.currentToken = b && b.token, f.loggedInUser = new v(c.mixin(a, {
                        portal: this,
                        credential: b
                    }));
                    f.self.id && !1 === f.self.canSearchPublic && (f.extraQuery = " AND orgid:" + f.self.id);
                    c.mixin(this, f.self);
                    this.thumbnailUrl = e.formatUrl(this.portalUrl + "accounts/self/resources/" + this.thumbnail);
                    this.isOrganization = this.access && this.access.length || !1;
                    this.created = this.created ? new Date(this.created) :
                        null;
                    this.modified = this.modified ? new Date(this.modified) : null;
                    return this
                }), c.hitch(this, function(a) {
                    this.onError(a);
                    throw a;
                }))
            },
            signIn: function() {
                var a = new l,
                    b = c.hitch(this, function() {
                        this._onSignIn().then(c.hitch(this, function() {
                            a.resolve(f.loggedInUser)
                        }), c.hitch(this, function(b) {
                            a.reject(b)
                        }))
                    });
                if (!f || !f.self) this.on("load", c.hitch(this, function() {
                    b()
                }));
                else f && f.loggedInUser ? setTimeout(function() {
                    a.resolve(f.loggedInUser)
                }, 0) : b();
                return a
            },
            signOut: function() {
                f.loggedInUser.credential && f.loggedInUser.credential.destroy();
                f.loggedInUser = null;
                f.options.disableIdentityLookup = !0;
                e.clearFieldsFromObject(f.self, this);
                f.self = null;
                return this.init(this.url)
            },
            getPortalUser: function() {
                return f.loggedInUser
            },
            addResource: function(a, b) {
                return e.request(this.portalUrl + "portals/self/addResource", {
                    key: a,
                    text: b
                }, {
                    usePost: !0
                })
            },
            update: function(a) {
                return e.request(this.portalUrl + "portals/self/update", a, {
                    usePost: !0
                })
            },
            queryGroups: function(a, b) {
                return this._queryPortal(this.portalUrl + "community/groups", e.formatQueryParams({}, a, b), s)
            },
            queryItems: function(a, b) {
                return this._queryPortal(this.portalUrl + "search", e.formatQueryParams({}, a, b), m)
            },
            queryListings: function(a) {
                a = e.formatQueryParams({}, a, !0);
                var b = "";
                a.q && -1 < a.q.toLowerCase().indexOf("mylistings:true") ? (a.q = a.q.toLowerCase().replace("mylistings:true", ""), b = "?mylistings\x3dtrue") : a.q || (a.q = '""');
                return this._queryPortal(this.portalUrl + "content/listings" + b, a, q)
            },
            getProvisions: function() {
                return this.getCustomers().then(c.hitch(this, function(a) {
                    return a.purchases
                }))
            },
            getInterests: function() {
                return this.getCustomers().then(c.hitch(this,
                    function(a) {
                        return a.interests
                    }))
            },
            getTrials: function() {
                return this.getCustomers().then(c.hitch(this, function(a) {
                    return a.trials
                }))
            },
            getCustomers: function(a) {
                return e.request(this.portalUrl + "portals/self/customers", {
                    status: a || "all"
                })
            },
            getMyPurchases: function() {
                return this.getPurchases().then(function(a) {
                    return a.purchases
                })
            },
            getMyInterests: function() {
                return this.getPurchases().then(function(a) {
                    return a.interests
                })
            },
            getPurchases: function() {
                return e.request(this.portalUrl + "portals/self/purchases").then(c.hitch(this,
                    function(a) {
                        a.interests = g.map(a.interests, function(a) {
                            return c.mixin(a.provision, {
                                listing: a.listing
                            })
                        });
                        a.purchases = g.map(a.purchases, function(a) {
                            return c.mixin(a.provision, {
                                listing: a.listing
                            })
                        });
                        a.trials = g.map(a.trials, function(a) {
                            return c.mixin(a.provision, {
                                listing: a.listing
                            })
                        });
                        a.interests = e.resultsToTypedArray(r, {
                            portal: this
                        }, a.interests);
                        a.trials = e.resultsToTypedArray(r, {
                            portal: this
                        }, a.trials);
                        a.purchases = e.resultsToTypedArray(r, {
                            portal: this
                        }, a.purchases);
                        return a
                    }))
            },
            queryUsers: function(a, b) {
                return this._queryPortal(this.portalUrl +
                    "community/users", e.formatQueryParams({
                        sortField: "username"
                    }, a, b), v)
            },
            _onSignIn: function() {
                f.options.disableIdentityLookup = !1;
                if (!f.self || !f.self.user) f.self = null;
                return x.id.getCredential(this.portalUrl).then(c.hitch(this, "init", this.url)).then(function() {
                    return f.loggedInUser
                }, c.hitch(this, function(a) {
                    f.options.disableIdentityLookup = !0;
                    this.onError(a);
                    throw a;
                }))
            },
            _getSelf: function(a) {
                var b;
                a = a + "accounts/self?culture\x3d" + w.locale;
                f.self ? (b = new l, setTimeout(function() {
                    b.resolve(f.self)
                }, 0)) : b = e.request(a);
                return b
            },
            _queryPortal: function(a, b, d) {
                var f = c.mixin({
                        num: 10,
                        start: 0,
                        sortField: "title",
                        sortOrder: "asc"
                    }, b),
                    g = ["start", "query", "num", "nextStart"];
                a = e.request(a, f).then(c.hitch(this, function(a) {
                    a.results = e.resultsToTypedArray(d, {
                        portal: this
                    }, a);
                    a.queryParams = c.mixin({}, f);
                    a.nextQueryParams = c.mixin(f, {
                        start: a.nextStart
                    });
                    return e.clearFieldsFromObject(g, a)
                }));
                a = c.delegate(a);
                a.queryParams = c.mixin({}, f);
                a.nextQueryParams = l.when(a, function(a) {
                    return a.nextQueryParams
                });
                return k(a)
            }
        }),
        PortalFolder: u,
        PortalGroup: s,
        PortalItem: m,
        PortalComment: n,
        PortalRating: p,
        PortalUtil: e,
        PortalResult: k,
        PortalListing: q
    }
});