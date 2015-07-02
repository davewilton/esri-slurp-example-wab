//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/_base/array", "dojo/dom-attr", "dojo/has", "./etc/docUtil", "./etc/validationUtil", "./Templated", "../../../kernel"], function(g, e, h, f, n, k, l, m, p) {
    return g([m], {
        _isGxeAttribute: !1,
        _isGxeElement: !1,
        _isGxeNode: !0,
        _isOptionallyOff: !1,
        gxeDocument: null,
        gxePath: null,
        inputWidget: null,
        parentElement: null,
        label: null,
        target: null,
        fixed: !1,
        isDocumentTitle: !1,
        optionsFilter: null,
        serializeIfEmpty: !1,
        trim: !0,
        value: null,
        valueType: null,
        alternateValues: null,
        postCreate: function() {
            this.inherited(arguments)
        },
        buildPath: function() {
            var b = function(a, b, c) {
                b._isGxeRootDescriptor && b.gxeDocument && (a.gxeDocument || (a.gxeDocument = b.gxeDocument), !a.gxeDocument.rootElement && c && (a.gxeDocument.rootElement = c))
            };
            "string" !== typeof this.target && (this.target = null);
            null !== this.target && (this.target = e.trim(this.target), 0 === this.target.length && (this.target = null));
            var a = null,
                c = this.getParent(),
                d = this.target;
            this._isGxeAttribute && (d = "@" + d);
            this._isGxeElement && (a = this);
            for (this._isGxeElement && b(this, this, a); c;) {
                if (c._isGxeElement) {
                    this.parentElement ||
                        (this.parentElement = c);
                    if (null !== c.gxePath && null !== c.gxeDocument) {
                        this.gxePath = c.gxePath + "/" + d;
                        this.gxeDocument = c.gxeDocument;
                        f.set(this.domNode, "data-gxe-path", this.gxePath);
                        this._validateTarget();
                        return
                    }
                    d = c.target + "/" + d;
                    a = c
                }
                b(this, c, a);
                c = c.getParent()
            }
            this.gxePath = "/" + d;
            f.set(this.domNode, "data-gxe-path", this.gxePath);
            this._validateTarget()
        },
        _checkOccurs: function(b, a) {
            var c = 1,
                d = typeof a;
            if (this._isGxeAttribute) {
                if (b) return 1;
                c = 0
            }
            if ("undefined" !== d && null !== a) {
                if ("string" === d) {
                    a = e.trim(a).toLowerCase();
                    if (b && "unbounded" === a) return a;
                    0 < a.length && (a = parseInt(a), isNaN(a) || (d = typeof a))
                }
                "number" === d && isFinite(a) && (0 > a && (a = 0), c = a)
            }
            return c
        },
        checkXmlValue: function() {
            var b = this.getXmlValue();
            "undefined" === typeof b && (b = null);
            null !== b && (this.trim && "string" === typeof b && (b = e.trim(b)), b.push || (b = "" + b), !this.serializeIfEmpty && 0 === b.length && (b = null));
            return b
        },
        findInputWidget: function() {
            var b = null;
            h.some(this.getChildren(), function(a) {
                if (a._isGxeInput) return b = a, !0
            });
            return b
        },
        getLabelString: function() {
            var b;
            b = this.label;
            if ("undefined" !== typeof b && null != b) return b;
            b = this.target;
            return "undefined" !== typeof b && null != b ? this.label = b : "No Target"
        },
        getParentElement: function() {
            for (var b = this.getParent(); b;) {
                if (b._isGxeElement) return b;
                b = b.getParent()
            }
            return null
        },
        getXmlValue: function() {
            return this.inputWidget ? this.inputWidget.getXmlValue() : this.value
        },
        getValidationLabel: function() {
            return !this.showHeader && this.parentElement ? this._isGxeElement && this._adoptedForMultiplicity ? this.getLabelString() : this.parentElement.getValidationLabel() :
                this.getLabelString()
        },
        resolveMinOccurs: function() {
            return this.minOccurs
        },
        _validateTarget: function() {
            var b = function(a, b) {
                    console.log("*** ", b);
                    var e = k.findDescriptor(a);
                    e && e.templateString && (console.log(e.templateString), console.log(e))
                },
                a;
            a = this.target;
            this.minOccurs = this._checkOccurs(!1, this.minOccurs);
            this.maxOccurs = this._checkOccurs(!0, this.maxOccurs);
            if (!this.gxeDocument) throw Error("XNode.validateTarget: Unable to connect to gxeDocument " + this.target);
            if ("string" !== typeof a || null === a || 0 === a.length) throw a =
                "XNode.validateTarget: The target is empty: " + this.target, b(this, a), Error(a);
            if (-1 !== this.target.indexOf("/")) throw a = "XNode.validateTarget: The target should not contain a forward slash: " + this.target, b(this, a), Error(a);
            this._isGxeElement && -1 === this.target.indexOf(":") && this.gxeDocument.hasNamespaces() && (a = "XNode.validateTarget: The target has no namespace prefix: " + this.target, b(this, a))
        },
        validateValue: function(b) {
            var a = {
                isValid: !0,
                isRequired: !1,
                label: null,
                message: "",
                xnodeWidget: this,
                inputWidget: this.inputWidget
            };
            if (this.fixed || !this.inputWidget) return a;
            var c = this.resolveMinOccurs();
            a.isRequired = 0 < c;
            a.label = this.getValidationLabel();
            c = this.inputWidget.getInputValue();
            "undefined" === typeof c && (c = null);
            null !== c && this.trim && "string" === typeof c && (c = e.trim(c));
            l.validateValue(a, c);
            !a.isValid && b && b.handleValidationError(this, a.message, this.inputWidget);
            return a
        }
    })
});