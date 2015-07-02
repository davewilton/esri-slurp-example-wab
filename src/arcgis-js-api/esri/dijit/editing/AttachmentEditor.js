//>>built
define(["require", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/connect", "dojo/_base/array", "dojo/_base/kernel", "dojo/has", "dojo/query", "dojo/io-query", "dojo/dom-attr", "dijit/_Widget", "dijit/_Templated", "../../kernel", "../../lang", "../../domUtils", "dojo/text!./templates/AttachmentEditor.html", "dojo/i18n!../../nls/jsapi", "dojo/NodeList-dom"], function(l, m, b, d, g, k, u, v, n, p, q, r, w, h, e, s, t) {
    return m([q, r], {
        declaredClass: "esri.dijit.editing.AttachmentEditor",
        widgetsInTemplate: !0,
        templateString: s,
        basePath: l.toUrl(".") + "/",
        _listHtml: "\x3cspan id\x3d'node_${oid}_${attid}'\x3e\x3ca href\x3d'${href}' target\x3d'_blank'\x3e${name}\x3c/a\x3e",
        _deleteBtnHtml: "(\x3cspan style\x3d'cursor:pointer;color:red;font-weight:bold;' class\x3d'deleteAttachment' id\x3d'${attid}');'\x3eX\x3c/span\x3e)",
        _endHtml: "\x3cbr/\x3e\x3c/span\x3e",
        _aeConnects: [],
        _layerEditingCapChecked: {},
        _layerEditingCap: {},
        constructor: function(a, c) {
            b.mixin(this, t.widgets.attachmentEditor)
        },
        startup: function() {
            this.inherited(arguments);
            this._uploadField_connect = d.connect(this._uploadField, "onchange", this, function() {
                0 < this._uploadField.value.length && this._addAttachment()
            });
            this._uploadFieldFocus_connect =
                d.connect(this._uploadField, "onfocus", b.hitch(this, function(a) {
                    e.hide(this._attachmentError)
                }))
        },
        destroy: function() {
            g.forEach(this._aeConnects, d.disconnect);
            d.disconnect(this._uploadField_connect);
            d.disconnect(this._uploadFieldFocus_connect);
            this.inherited(arguments)
        },
        showAttachments: function(a, c) {
            this._attachmentList.innerHTML = this.NLS_none;
            this._uploadField.value = "";
            g.forEach(this.domNode.children, function(a, c) {
                e.show(a)
            });
            e.hide(this._attachmentError);
            if (a && (this._featureLayer = a.getLayer() || c)) "esri.layers.FeatureLayer" !==
                this._featureLayer.declaredClass || !this._featureLayer.getEditCapabilities ? (e.hide(this._uploadForm), g.forEach(this.domNode.children, function(a, c) {
                    e.hide(a)
                })) : (this._currentLayerId = this._featureLayer.id, this._layerEditingCapChecked[this._currentLayerId] || (this._layerEditingCap[this._currentLayerId] = this._featureLayer.getEditCapabilities(), this._layerEditingCapChecked[this._currentLayerId] = !0), this._featureCanUpdate = this._featureLayer.getEditCapabilities({
                        feature: a
                    }).canUpdate, this._oid = a.attributes[this._featureLayer.objectIdField],
                    this._getAttachments(a))
        },
        _getAttachments: function(a) {
            this._featureLayer && this._featureLayer.queryAttachmentInfos && this._featureLayer.queryAttachmentInfos(this._oid, b.hitch(this, "_onQueryAttachmentInfosComplete"))
        },
        _addAttachment: function() {
            e.hide(this._attachmentError);
            this._featureLayer && this._featureLayer.addAttachment && this._featureLayer.addAttachment(this._oid, this._uploadForm, b.hitch(this, "_onAddAttachmentComplete"), b.hitch(this, "_onAddAttachmentError"))
        },
        _deleteAttachment: function(a, c) {
            this._featureLayer.deleteAttachments(a, [c], b.hitch(this, "_onDeleteAttachmentComplete"))
        },
        _onQueryAttachmentInfosComplete: function(a) {
            var c = this._listHtml + this._deleteBtnHtml + this._endHtml;
            this._uploadForm.style.display = "block";
            !this._featureCanUpdate && this._layerEditingCap[this._currentLayerId].canUpdate || !this._layerEditingCap[this._currentLayerId].canCreate && !this._layerEditingCap[this._currentLayerId].canUpdate ? (c = this._listHtml + this._endHtml, this._uploadForm.style.display = "none") : this._layerEditingCap[this._currentLayerId].canCreate &&
                !this._layerEditingCap[this._currentLayerId].canUpdate && (c = this._listHtml + this._endHtml);
            var f = this._attachmentList;
            a = g.map(a, b.hitch(this, function(a) {
                return h.substitute({
                    href: a.url,
                    name: a.name,
                    oid: a.objectId,
                    attid: a.id
                }, c)
            }));
            f.innerHTML = a.join("") || this.NLS_none;
            this._updateConnects()
        },
        _onAddAttachmentComplete: function(a) {
            var c = this._uploadField,
                f = c.value,
                b = f.lastIndexOf("\\"); - 1 < b && (f = f.substring(b + 1, f.length));
            var f = f.replace(/\ /g, "_"),
                b = this._attachmentList,
                d = n.objectToQuery({
                    gdbVersion: this._featureLayer.gdbVersion,
                    token: this._featureLayer._getToken()
                }),
                e = this._listHtml + this._deleteBtnHtml + this._endHtml;
            this._layerEditingCap[this._currentLayerId].canCreate && !this._layerEditingCap[this._currentLayerId].canUpdate && (e = this._listHtml + this._endHtml);
            a = h.substitute({
                href: this._featureLayer._url.path + "/" + a.objectId + "/attachments/" + a.attachmentId + (d ? "?" + d : ""),
                name: f,
                oid: a.objectId,
                attid: a.attachmentId
            }, e);
            b.innerHTML = b.innerHTML == this.NLS_none ? a : b.innerHTML + a;
            this._updateConnects();
            c.value = ""
        },
        _onAddAttachmentError: function(a) {
            if (a &&
                h.isDefined(a.code)) {
                var c = this._attachmentError;
                p.set(c, "innerHTML", (400 === a.code ? this.NLS_fileNotSupported : a.message || a.details && a.details.length && a.details[0]) || this.NLS_error);
                e.show(c)
            }
        },
        _onDeleteAttachmentComplete: function(a) {
            var c = g.every(a, function(a) {
                    return a.success
                }),
                b = this._attachmentList;
            if (c && (k.query("#node_" + a[0].objectId + "_" + a[0].attachmentId).orphan(), !b.children || !b.children.length)) b.innerHTML = this.NLS_none
        },
        _updateConnects: function() {
            g.forEach(this._aeConnects, d.disconnect);
            k.query(".deleteAttachment").forEach(function(a) {
                this._aeConnects.push(d.connect(a,
                    "onclick", b.hitch(this, "_deleteAttachment", this._oid, a.id)))
            }, this)
        }
    })
});