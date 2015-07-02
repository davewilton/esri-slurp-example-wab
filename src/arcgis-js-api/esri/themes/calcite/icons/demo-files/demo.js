//>>built
define(["dijit", "dojo", "dojox"], function(f, g, h) {
    "boxShadow" in document.body.style || document.body.setAttribute("class", "noBoxShadow");
    document.body.addEventListener("click", function(a) {
        a = a.target;
        "INPUT" === a.tagName && -1 === a.getAttribute("class").indexOf("liga") && a.select()
    });
    (function() {
        function a() {
            b.innerHTML = c.value || String.fromCharCode(160);
            window.icomoonLiga && window.icomoonLiga(b)
        }

        function d() {
            b.style.fontSize = e.value + "px"
        }
        var e = document.getElementById("fontSize"),
            b = document.getElementById("testDrive"),
            c = document.getElementById("testText");
        e.addEventListener("change", d, !1);
        c.addEventListener("input", a, !1);
        c.addEventListener("change", a, !1);
        d()
    })()
});