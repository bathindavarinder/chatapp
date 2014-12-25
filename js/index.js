

(function ($) {

    $.ui.autoLaunch = false;
    $.ui.backButtonText = "";

    var onDeviceReady = function () {                             // called when Cordova is ready
        if (window.Cordova && navigator.splashscreen) {
            readyFunction();
        }
    }
   //$(document).ready(function () {
   //    readyFunction();

   // });
    

    function readyFunction() {
        if (localStorage.getItem("Name") != undefined && localStorage.getItem("Name") != "") {

            if (window.Cordova && navigator.splashscreen) {
                navigator.splashscreen.hide();
            }
            $("#logname").text(localStorage.getItem("Name"));
            $.ui.launch();
            $.ui.loadContent("signin", null, null, "fade");

        } else {
            if (window.Cordova && navigator.splashscreen) {
                 navigator.splashscreen.hide();
            }
            $.ui.launch();

        }

        $("#register").on("click", function () {
            localStorage.setItem("Name", $("#name").val());

            $.ui.loadContent("main", null, null, "fade");

            setTimeout(window.location = "rooms.html", 5000);
        });

        $("#Submit").on("click", function () {
            localStorage.setItem("Name", $("#changenameText").val());

            $.ui.loadContent("main", null, null, "fade");

            setTimeout(window.location = "rooms.html", 5000);
        });

        $("#GoToRooms").on("click", function () {
            window.location = "rooms.html"
        });
    }


    document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("backbutton", function (e) {
        navigator.app.exitApp();;
    }, false);

}(jQuery));
