//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/connect", "dojo/_base/array", "dojo/_base/kernel", "dojo/has", "dojo/query", "dojo/dom", "dojo/dom-construct", "dojo/dom-class", "dojo/dom-geometry", "../kernel", "./_TouchBase", "../Evented"], function(p, q, g, r, s, w, x, t, f, d, k, y, u, v) {
    return p(v, {
        declaredClass: "esri.dijit.Gallery",
        container: null,
        _items: [],
        _currentIndex: 0,
        _left: 0,
        _offset: 10,
        _slideDiv: null,
        _thumbnailStyle: "default",
        _focusedIndex: null,
        _selectedIndex: -1,
        _slideStep: 1,
        _showTitle: !0,
        _eventMap: {
            select: ["item"],
            focus: ["item"]
        },
        constructor: function(a, b) {
            var c;
            this.container = t.byId(b);
            this._touchBase = u(this.container, null);
            this._slideDiv = f.create("div", {
                "class": "slideContainer"
            }, this.container, "first");
            this.events = [g.connect(this._touchBase, "onTouchStart", this, this._onTouchStartHandler), g.connect(this._touchBase, "onTouchMove", this, this._onTouchMoveHandler), g.connect(this._touchBase, "onTouchEnd", this, this._onTouchEndHandler), g.connect(this._touchBase, "onclick", this, this._onClickHandler)];
            this._resizeHandle =
                g.connect(window, "onorientationchange", q.hitch(this, this._onResizeHandler));
            this._items = a.items;
            a.thumbnailStyle && "small" == a.thumbnailStyle ? (this._thumbnailStyle = "small", this._offset = 4, this._slideStep = 3, this._thumbnailWidth = 100) : (this._thumbnailStyle = "default", this._offset = 10, this._slideStep = 1, this._thumbnailWidth = 200);
            !1 == a.showTitle && (this._showTitle = !1);
            this.container.setAttribute(document.all ? "className" : "class", "esriMobileGallery");
            var h, e;
            for (c = 0; c < this._items.length; c++) {
                var m, n, l;
                e = f.create("div", {
                    "class": "thumbnailcontainer"
                }, this._slideDiv);
                l = f.create("img", {
                    "class": "thumbnail",
                    src: this._items[c].thumbnailUrl
                }, e);
                l._index = c;
                l._item = this._items[c];
                m = f.create("div", {
                    "class": "title",
                    innerHTML: this._items[c].title
                }, e);
                n = f.create("div", {
                    "class": "title"
                }, e);
                "small" == this._thumbnailStyle && (d.add(e, "small"), d.add(l, "small"), d.add(m, "small"), d.add(n, "small"), d.add(this._slideDiv, "small"));
                this._showTitle || (m.style.display = "none");
                e = k.getContentBox(e).h;
                h || (h = e);
                e > h && (h = e)
            }
            for (c = 0; c < this._slideDiv.childNodes.length; c++) k.getContentBox(this._slideDiv.childNodes[c], {
                h: h
            });
            this._thumbnailWidth = k.getContentBox(this._slideDiv.childNodes[0]).w;
            this._slideDiv.style.width = this._items.length * (this._thumbnailWidth + this._offset) + "px";
            window.orientation && (90 == window.orientation || -90 == window.orientation) && d.add(this.container, "galleryLandscape");
            this._calculateSlideStep()
        },
        startup: function() {
            this._focusedIndex = 0;
            this.onFocus(this._items[this._focusedIndex])
        },
        destroy: function() {
            r.forEach(this.events, g.disconnect);
            g.disconnect(this._resizeHandle);
            this._touchBase = null;
            s.query("img",
                this.container).forEach(function(a) {
                a._index = null;
                a._item = null;
                f.destroy(a)
            });
            this._items = null;
            f.destroy(this._slideDiv);
            f.destroy(this.container);
            this.container = this._slideDiv = null
        },
        setFocus: function(a) {
            var b, c;
            if (a) {
                b = 0;
                for (c = this._items.length; b < c; b++) this._items[b] == a && (this._setFocus(b), this.onFocus(this._items[this._focusedIndex]))
            }
        },
        select: function(a) {
            var b, c;
            if (a) {
                b = 0;
                for (c = this._items.length; b < c; b++)
                    if (this._items[b] == a) {
                        if (-1 != this._selectedIndex) this.onUnSelect(this._items[this._selectedIndex]);
                        this._select(b);
                        this.onSelect(this._items[this._selectedIndex]);
                        break
                    }
            }
        },
        getFocusedItem: function() {
            return this._items[this._focusedIndex]
        },
        getSelectedItem: function() {
            return this._items[this._selectedIndex]
        },
        next: function() {
            this._next();
            this._startTransition();
            this.onFocus(this._items[this._currentIndex])
        },
        previous: function() {
            this._previous();
            this._startTransition();
            this.onFocus(this._items[this._currentIndex])
        },
        getTitleNode: function(a) {
            var b, c;
            if (a) {
                b = 0;
                for (c = this._items.length; b < c; b++)
                    if (this._items[b] ==
                        a) return this._slideDiv.childNodes[b].childNodes[1]
            }
        },
        getInfoNode: function(a) {
            var b, c;
            if (a) {
                b = 0;
                for (c = this._items.length; b < c; b++)
                    if (this._items[b] == a) return this._slideDiv.childNodes[b].childNodes[2]
            }
        },
        showTitle: function(a) {
            var b, c;
            if (a) {
                b = 0;
                for (c = this._items.length; b < c; b++)
                    if (this._items[b] == a) {
                        this._slideDiv.childNodes[b].childNodes[1].style.display = "block";
                        break
                    }
            }
        },
        hideTitle: function(a) {
            var b, c;
            if (a) {
                b = 0;
                for (c = this._items.length; b < c; b++)
                    if (this._items[b] == a) {
                        this._slideDiv.childNodes[b].childNodes[1].style.display =
                            "none";
                        break
                    }
            }
        },
        onFocus: function(a) {},
        onSelect: function(a) {},
        onUnSelect: function(a) {},
        _onClickHandler: function(a) {
            if (a.target instanceof HTMLImageElement) {
                a = a.target._index;
                if (-1 != this._selectedIndex) this.onUnSelect(this._items[this._selectedIndex]);
                this._select(a);
                this.onSelect(this._items[this._selectedIndex])
            }
        },
        _onTouchStartHandler: function(a) {
            this._moveDirection = null;
            this._left = this._currentIndex * (-this._thumbnailWidth - this._offset);
            this._slideDiv.style.WebkitTransitionDuration = "0s"
        },
        _onTouchMoveHandler: function(a) {
            this._moveDirection ||
                (Math.abs(a.curY) > Math.abs(a.curX) ? this._moveDirection = "vertical" : this._moveDirection = "horizontal");
            "vertical" == this._moveDirection ? !1 == !this._touchBase._preventDefault && (this._touchBase._preventDefault = !1) : "horizontal" == this._moveDirection && (this._touchBase._preventDefault || (this._touchBase._preventDefault = !0), this._slideDiv.style.webkitTransform = "translate3d(" + (this._left + a.curX) + "px, 0, 0)")
        },
        _onTouchEndHandler: function(a) {
            var b = this._currentIndex;
            this._slideDiv.style.WebkitTransitionDuration =
                "0.5s";
            "left" == a.swipeDirection ? this._next() : "right" == a.swipeDirection && this._previous();
            this._left = this._currentIndex * (-this._thumbnailWidth - this._offset);
            this._slideDiv.style.webkitTransform = "translate3d(" + this._left + "px, 0, 0)";
            if (b != this._currentIndex) this.onFocus(this._items[this._currentIndex])
        },
        _onResizeHandler: function(a) {
            switch (window.orientation) {
                case 0:
                    d.remove(this.container, "galleryLandscape");
                    break;
                case 90:
                case -90:
                    d.add(this.container, "galleryLandscape")
            }
            this._calculateSlideStep()
        },
        _startTransition: function() {
            this._slideDiv.style.WebkitTransitionDuration = "0.5s";
            this._left = this._currentIndex * (-this._thumbnailWidth - this._offset);
            this._slideDiv.style.webkitTransform = "translate3d(" + this._left + "px, 0, 0)"
        },
        _markUnSelected: function(a) {
            d.remove(a, "selected");
            d.remove(a.parentNode, "selected");
            d.remove(a.parentNode.childNodes[1], "selected");
            d.remove(a.parentNode.childNodes[2], "selected")
        },
        _markSelected: function(a) {
            d.add(a, "selected");
            d.add(a.parentNode, "selected");
            d.add(a.parentNode.childNodes[1],
                "selected");
            d.add(a.parentNode.childNodes[2], "selected")
        },
        _next: function() {
            this._currentIndex + this._slideStep < this._items.length && (this._focusedIndex = this._currentIndex += this._slideStep)
        },
        _previous: function() {
            0 <= this._currentIndex - this._slideStep && (this._currentIndex -= this._slideStep);
            this._focusedIndex = this._currentIndex
        },
        _setFocus: function(a) {
            this._focusedIndex = a;
            this._currentIndex = Math.floor(a / this._slideStep) * this._slideStep;
            this._startTransition()
        },
        _select: function(a) {
            -1 != this._selectedIndex &&
                this._markUnSelected(this._slideDiv.childNodes[this._selectedIndex].childNodes[0]);
            this._selectedIndex = a;
            this._markSelected(this._slideDiv.childNodes[this._selectedIndex].childNodes[0])
        },
        _calculateSlideStep: function() {
            var a = k.getContentBox(this.container),
                b = Math.floor((a.w + this._offset) / (this._thumbnailWidth + this._offset));
            1 <= b ? (a = a.w - (this._thumbnailWidth + this._offset) * b, this._slideDiv.style.marginLeft = 0 < a ? Math.floor(a / 2) + "px" : "0px", this._slideStep = b) : this._slideStep = 1; - 1 != this._selectedIndex ? this._setFocus(this._selectedIndex) :
                this._setFocus(this._focusedIndex)
        }
    })
});