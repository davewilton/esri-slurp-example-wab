//>>built
define(["../../declare", "dojo/dom-class", "dojo/dom-geometry", "dojo/dom-construct", "dijit/layout/_LayoutWidget"], function(l, h, m, n, p) {
    var f = l("esri.dijit.geoenrichment.Grid", [p], {
        _placeholder: null,
        layout: function() {
            var k = this.getChildren(),
                e = [],
                b, a, c;
            for (b = 0; b < this.rows.length; b++) e.push(0);
            h.add(this.domNode, "Grid_Measure");
            var d = [];
            for (b = 0; b < k.length; b++) {
                a = k[b];
                c = a.row;
                a = a.domNode;
                a.style.position = "absolute";
                h.add(a, "GridCell_Measure");
                var l = a.scrollHeight;
                h.remove(a, "GridCell_Measure");
                a = l;
                d.push(a);
                a > e[c] && (e[c] = a)
            }
            c = m.getContentBox(this.domNode).h;
            h.remove(this.domNode, "Grid_Measure");
            b = this.rows;
            for (a = d = 0; a < e.length; a++) switch (b[a]) {
                case f.AUTO:
                    c -= e[a];
                    break;
                case f.STRETCH:
                case f.STACK:
                    d++
            }
            if (1 < d) throw Error("Multiple rows with flexible heights are not supported");
            d = [0];
            for (a = 0; a < e.length; a++) {
                var g;
                switch (b[a]) {
                    case f.AUTO:
                        g = e[a];
                        break;
                    case f.STRETCH:
                        g = c;
                        break;
                    case f.STACK:
                        g = Math.min(c, e[a])
                }
                d.push(d[a] + g)
            }
            for (b = 0; b < k.length; b++) a = k[b], c = a.row, e = d[c + 1] - d[c], g = a.domNode.style, g.top = d[c] + "px",
                g.height = e + "px";
            this._placeholder || (this._placeholder = n.create("div", null, this.domNode));
            this._placeholder.style.height = d[d.length - 1] + "px"
        }
    });
    f.AUTO = "auto";
    f.STRETCH = "stretch";
    f.STACK = "stack";
    return f
});