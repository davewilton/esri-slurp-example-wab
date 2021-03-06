//>>built
define(["../../declare", "../../units", "./StudyAreaOptions"], function(b, c, d) {
    return b("esri.tasks.geoenrichment.RingBuffer", [d], {
        radii: null,
        units: null,
        constructor: function(a) {
            a && (a.bufferRadii ? this.radii = a.bufferRadii : a.radius ? this.radii = [a.radius] : a.radii && (this.radii = a.radii), this.units = a.bufferUnits || a.units);
            this.radii || (this.radii = [1]);
            this.units || (this.units = c.MILES)
        },
        toJson: function() {
            return {
                areaType: "RingBuffer",
                bufferUnits: this.units,
                bufferRadii: this.radii
            }
        }
    })
});