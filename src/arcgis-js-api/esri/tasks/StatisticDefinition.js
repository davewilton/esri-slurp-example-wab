//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel"], function(a, b, c, d) {
    return a(null, {
        declaredClass: "esri.tasks.StatisticDefinition",
        toJson: function() {
            return {
                statisticType: this.statisticType,
                onStatisticField: this.onStatisticField,
                outStatisticFieldName: this.outStatisticFieldName,
                maxPointCount: this.maxPointCount,
                maxRecordCount: this.maxRecordCount,
                maxVertexCount: this.maxVertexCount
            }
        }
    })
});