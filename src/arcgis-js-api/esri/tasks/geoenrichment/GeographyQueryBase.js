//>>built
define(["../../declare", "../../SpatialReference"], function(b, c) {
    return b("esri.tasks.geoenrichment.GeographyQueryBase", null, {
        countryID: null,
        datasetID: null,
        outSR: null,
        returnGeometry: !1,
        returnCentroids: !1,
        generalizationLevel: null,
        useFuzzySearch: !1,
        featureLimit: null,
        constructor: function(a) {
            a && (this.countryID = a.countryID || a.sourceCountry, this.datasetID = a.datasetID || a.optionalCountryDataset, a.outSR && (this.outSR = new c(a.outSR)), this.returnGeometry = !!a.returnGeometry, this.returnCentroids = !!a.returnCentroids,
                this.generalizationLevel = a.generalizationLevel, this.useFuzzySearch = !!a.useFuzzySearch, this.featureLimit = a.featureLimit)
        },
        toJson: function() {
            var a = {};
            this.countryID && (a.sourceCountry = this.countryID);
            this.datasetID && (a.optionalCountryDataset = this.datasetID);
            this.outSR && (a.outSR = this.outSR.toJson());
            this.returnGeometry && (a.returnGeometry = this.returnGeometry);
            this.returnCentroids && (a.returnCentroids = this.returnCentroids);
            this.generalizationLevel && (a.generalizationLevel = this.generalizationLevel);
            this.useFuzzySearch &&
                (a.useFuzzySearch = this.useFuzzySearch);
            this.featureLimit && (a.featureLimit = this.featureLimit);
            return a
        }
    })
});