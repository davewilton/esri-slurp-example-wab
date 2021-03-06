//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/connect", "dojo/_base/json", "dojo/has", "dojo/dom-style", "dojox/gfx/Moveable", "dojox/gfx/Mover", "dojox/gfx/matrix", "../kernel", "../geometry/webMercatorUtils", "../geometry/ScreenPoint", "../geometry/Point"], function(l, v, d, m, w, n, r, s, p, x, q, t, u) {
    var g = l(null, {
        declaredClass: "esri.toolbars._GraphicMover",
        constructor: function(a, b, f, c) {
            this.graphic = a;
            this.map = b;
            this.toolbar = f;
            this.tempPt = c;
            this._enableGraphicMover();
            this._moved = !1
        },
        refresh: function(a) {
            var b = this.graphic.getDojoShape();
            if (b && (a || !b._hostGraphic)) this._disableGraphicMover(), this._enableGraphicMover()
        },
        destroy: function() {
            this._disableGraphicMover()
        },
        hasMoved: function() {
            return this._moved
        },
        _enableGraphicMover: function() {
            var a = this.graphic,
                b = a.getDojoShape();
            b && (b._hostGraphic = a, this._moveable = new r(b, {
                mover: g.Mover
            }), this._moveStartHandle = d.connect(this._moveable, "onMoveStart", this, this._moveStartHandler), this._firstMoveHandle = d.connect(this._moveable, "onFirstMove", this, this._firstMoveHandler), this._movingHandle = d.connect(this._moveable,
                "onMoving", this, this._movingHandler), this._moveStopHandle = d.connect(this._moveable, "onMoveStop", this, this._moveStopHandler), (a = b.getEventSource()) && n.set(a, "cursor", this.toolbar._cursors.move))
        },
        _disableGraphicMover: function() {
            var a = this._moveable;
            if (a) {
                d.disconnect(this._moveStartHandle);
                d.disconnect(this._firstMoveHandle);
                d.disconnect(this._movingHandle);
                d.disconnect(this._moveStopHandle);
                var b = a.shape;
                b && (b._hostGraphic = null, (b = b.getEventSource()) && n.set(b, "cursor", null));
                a.destroy()
            }
            this._moveable =
                null
        },
        _moveStartHandler: function() {
            var a = this.graphic,
                b = this.map;
            this._startTx = a.getDojoShape().getTransform();
            "point" === this.graphic.geometry.type && b.snappingManager && b.snappingManager._setUpSnapping();
            this.toolbar.onGraphicMoveStart(a)
        },
        _firstMoveHandler: function() {
            this.toolbar._beginOperation("MOVE");
            this.toolbar.onGraphicFirstMove(this.graphic)
        },
        _movingHandler: function(a) {
            a = a.shape.getTransform();
            this.tempPt && this.tempPt.getDojoShape().setTransform(a);
            this.toolbar.onGraphicMove(this.graphic, a)
        },
        _moveStopHandler: function(a) {
            var b = this.graphic,
                f = this.toolbar,
                c = this.map,
                e = f._geo ? q.geographicToWebMercator(b.geometry) : b.geometry,
                k = e.type,
                d = b.getDojoShape(),
                h = d.getTransform();
            if (m.toJson(h) !== m.toJson(this._startTx)) {
                this._moved = !0;
                switch (k) {
                    case "point":
                        var k = [h, p.invert(this._startTx)],
                            g;
                        c.snappingManager && (g = c.snappingManager._snappingPoint);
                        e = g || c.toMap(p.multiplyPoint(k, c.toScreen(e, !0)));
                        c.snappingManager && c.snappingManager._killOffSnapping();
                        break;
                    case "polyline":
                        e = this._updatePolyGeometry(e,
                            e.paths, h);
                        break;
                    case "polygon":
                        e = this._updatePolyGeometry(e, e.rings, h)
                }
                d.setTransform(null);
                b.setGeometry(f._geo ? q.webMercatorToGeographic(e, !0) : e);
                this.tempPt && this.tempPt.setGeometry(new u(b.geometry.toJson()))
            } else this._moved = !1;
            f._endOperation("MOVE");
            f.onGraphicMoveStop(b, h);
            this._moved || (a = a.__e, c = this.map.position, a = new t(a.pageX - c.x, a.pageY - c.y), f.onGraphicClick(b, {
                screenPoint: a,
                mapPoint: this.map.toMap(a)
            }))
        },
        _updatePolyGeometry: function(a, b, f) {
            var c = this.map,
                e = a.getPoint(0, 0),
                c = c.toMap(c.toScreen(e).offset(f.dx,
                    f.dy));
            f = c.x - e.x;
            for (var e = c.y - e.y, d, g, h, c = 0; c < b.length; c++) {
                g = b[c];
                for (d = 0; d < g.length; d++) h = a.getPoint(c, d), a.setPoint(c, d, h.offset(f, e))
            }
            return a
        }
    });
    g.Mover = l(s, {
        declaredClass: "esri.toolbars._Mover",
        constructor: function(a, b, d) {
            this.__e = b
        }
    });
    return g
});