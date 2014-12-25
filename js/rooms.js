
(function ($) {

    $.ui.autoLaunch = false;
    $.ui.backButtonText = "Back";


    var onDeviceReady = function () {                             // called when Cordova is ready
        if (window.Cordova && navigator.splashscreen) {
            readyFunction();
        }
    };
    //$(document).ready(function () {
    //    readyFunction();

    //});

    var readyFunction = function () {
       
            $.ui.launch();
            $("li a").on("click", function () {

                var room = $(this).attr("id");
                localStorage.setItem("room", room);
                window.location = "room.html";

            });
    };
    document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("backbutton", function (e) {
        window.location = "index.html";
    }, false);

}(jQuery));
