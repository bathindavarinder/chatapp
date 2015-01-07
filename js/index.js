(function ($) {

alert("index loaded");
    $.ui.autoLaunch = false;
    $.ui.backButtonText = "";
  
    var onDeviceReady = function () {
        alert("readu fired");
        // called when Cordova is ready
        if (window.Cordova && navigator.splashscreen) {

            readyFunction();
        }
        else {
            alert("readu not fired");
        }
    }
    if (!window.Cordova) {
        $(document).ready(function () {
            alert("read docu fired");
            readyFunction(); 
        });
    }


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
        alert("registerd");
        $("#register").on("click", function () {
            alert("registered called");
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
