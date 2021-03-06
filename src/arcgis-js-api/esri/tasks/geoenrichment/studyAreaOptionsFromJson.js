//>>built
define(["./RingBuffer", "./DriveBuffer", "./IntersectingGeographies", "../../extend"], function(b, c, d, f) {
    var e = function(a) {
        if (a) {
            switch (a.areaType) {
                case "DriveTimeBuffer":
                    return new c(a);
                case "StandardGeography":
                    return new d(a)
            }
            switch (a.type) {
                case "DriveTime":
                    return new c(a);
                case "StdGeo":
                    return new d(a)
            }
            return new b(a)
        }
        return new b
    };
    f("esri.tasks.geoenrichment.studyAreaOptionsFromJson", e);
    return e
});