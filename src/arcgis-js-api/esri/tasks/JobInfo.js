//>>built
define(["dojo/_base/declare", "dojo/_base/lang", "dojo/has", "../kernel", "./GPMessage"], function(a, d, f, g, e) {
    a = a(null, {
        declaredClass: "esri.tasks.JobInfo",
        constructor: function(b) {
            this.messages = [];
            d.mixin(this, b);
            b = this.messages;
            var c, a = b.length;
            for (c = 0; c < a; c++) b[c] = new e(b[c])
        },
        jobId: "",
        jobStatus: ""
    });
    d.mixin(a, {
        STATUS_CANCELLED: "esriJobCancelled",
        STATUS_CANCELLING: "esriJobCancelling",
        STATUS_DELETED: "esriJobDeleted",
        STATUS_DELETING: "esriJobDeleting",
        STATUS_EXECUTING: "esriJobExecuting",
        STATUS_FAILED: "esriJobFailed",
        STATUS_NEW: "esriJobNew",
        STATUS_SUBMITTED: "esriJobSubmitted",
        STATUS_SUCCEEDED: "esriJobSucceeded",
        STATUS_TIMED_OUT: "esriJobTimedOut",
        STATUS_WAITING: "esriJobWaiting"
    });
    return a
});