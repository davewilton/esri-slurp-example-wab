//>>built
require({
    cache: {
        "url:esri/dijit/geoenrichment/templates/NumberSpinner.html": '\x3cdiv class\x3d"dijit dijitReset dijitInline dijitLeft NumberSpinner" id\x3d"widget_${id}" role\x3d"presentation"\x3e\r\n    \x3cdiv class\x3d\'dijitReset dijitValidationContainer\'\x3e\r\n        \x3cinput class\x3d"dijitReset dijitInputField dijitValidationIcon dijitValidationInner" value\x3d"\x26#935; " type\x3d"text" tabIndex\x3d"-1" readonly\x3d"readonly" role\x3d"presentation" /\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"dijitReset dijitInputField dijitInputContainer"\x3e\r\n        \x3cinput class\x3d\'dijitReset dijitInputInner\' data-dojo-attach-point\x3d"textbox,focusNode" type\x3d"${type}" data-dojo-attach-event\x3d"onkeydown:_onKeyDown"\r\n\t\t\trole\x3d"spinbutton" autocomplete\x3d"off" ${!nameAttrSetting}/\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"upArrowNode" class\x3d"NumberSpinner_RadiusButton NumberSpinner_RadiusPlus"\x3e+\x3c/div\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"downArrowNode" class\x3d"NumberSpinner_RadiusButton NumberSpinner_RadiusMinus"\x3e\x26ndash;\x3c/div\x3e\r\n\x3c/div\x3e'
    }
});
define(["../../declare", "dijit/form/NumberSpinner", "dojo/text!./templates/NumberSpinner.html"], function(a, b, c) {
    return a([b], {
        templateString: c,
        cssStateNodes: {},
        required: !0
    })
});