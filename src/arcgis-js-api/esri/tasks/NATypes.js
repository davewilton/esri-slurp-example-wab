//>>built
define(["dojo/_base/lang", "dojo/has", "../kernel"], function(a, b, c) {
    return {
        LengthUnit: {
            esriFeet: "esriNAUFeet",
            esriKilometers: "esriNAUKilometers",
            esriMeters: "esriNAUMeters",
            esriMiles: "esriNAUMiles",
            esriNauticalMiles: "esriNAUNauticalMiles",
            esriYards: "esriNAUYards"
        },
        OutputLine: {
            NONE: "esriNAOutputLineNone",
            STRAIGHT: "esriNAOutputLineStraight",
            TRUE_SHAPE: "esriNAOutputLineTrueShape",
            TRUE_SHAPE_WITH_MEASURE: "esriNAOutputLineTrueShapeWithMeasure"
        },
        UTurn: {
            ALLOW_BACKTRACK: "esriNFSBAllowBacktrack",
            AT_DEAD_ENDS_ONLY: "esriNFSBAtDeadEndsOnly",
            NO_BACKTRACK: "esriNFSBNoBacktrack",
            AT_DEAD_ENDS_AND_INTERSECTIONS: "esriNFSBAtDeadEndsAndIntersections"
        },
        OutputPolygon: {
            NONE: "esriNAOutputPolygonNone",
            SIMPLIFIED: "esriNAOutputPolygonSimplified",
            DETAILED: "esriNAOutputPolygonDetailed"
        },
        TravelDirection: {
            FROM_FACILITY: "esriNATravelDirectionFromFacility",
            TO_FACILITY: "esriNATravelDirectionToFacility"
        }
    }
});