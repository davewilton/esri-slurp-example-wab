//>>built
define(["../../declare", "./StudyAreaOptions", "./DriveUnits"], function(b, c, d) {
    return b("esri.tasks.geoenrichment.DriveBuffer", [c], {
        radii: null,
        units: null,
        constructor: function(a) {
            a && (a.bufferRadii ? this.radii = a.bufferRadii : a.radius ? this.radii = [a.radius] : a.radii && (this.radii = a.radii), this.units = a.bufferUnits || a.units);
            this.radii || (this.radii = [5]);
            this.units || (this.units = d.MINUTES)
        },
        toJson: function() {
            return {
                areaType: "DriveTimeBuffer",
                bufferUnits: this.units,
                bufferRadii: this.radii
            }
        }
    })
});