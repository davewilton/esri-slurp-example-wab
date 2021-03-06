//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "../Color", "./ColorRamp"], function(c, e, f, g, b, d) {
    return c(d, {
        declaredClass: "esri.tasks.AlgorithmicColorRamp",
        type: "algorithmic",
        fromColor: null,
        toColor: null,
        algorithm: null,
        toJson: function() {
            var a;
            switch (this.algorithm.toLowerCase()) {
                case "cie-lab":
                    a = "esriCIELabAlgorithm";
                    break;
                case "hsv":
                    a = "esriHSVAlgorithm";
                    break;
                case "lab-lch":
                    a = "esriLabLChAlgorithm"
            }
            a = {
                type: "algorithmic",
                algorithm: a
            };
            a.fromColor = b.toJsonColor(this.fromColor);
            a.toColor =
                b.toJsonColor(this.toColor);
            return a
        }
    })
});