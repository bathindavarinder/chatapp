
(function ($) {



    var onDeviceReady = function () {                             // called when Cordova is ready
        if (window.Cordova && navigator.splashscreen) {
            readyFunction();
        }
    };
    if (!window.Cordova) {
        $(document).ready(function () {
            readyFunction();

        });
    }


    function readyFunction(){
            window.background = false;

            $.initiateConnection();
            // Cordova API detected
            $.ui.setSideMenuWidth('210px');

            $.ui.launch();

            var room = localStorage.getItem("room");
            var name = localStorage.getItem("Name");

            $(".HeadName").text(room);

            $('#Back').on("click", function () {
                $.leaveRoom(room, name);
            });

            var $body = $('body');
            var scaleSource = $body.width();
            $("#Send").on("click", function () {
                $.SendMessage();
            });

            window.activeUser = "";

            $("#userList").delegate("li a", "click", function (e) {

                var username = $(this).attr("id");
                $.userClick(username);                
            });

            $(".MainComments").scroller({
                vScrollCSS: 'custom_scrollbar',
                lockBounce: true
            });
        }
  



    document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("backbutton", function (e) {
        var name = localStorage.getItem("Name");
        var room = localStorage.getItem("room");
        $.leaveRoom(room, name);

        //  navigator.app.backHistory()
    }, false);

    document.addEventListener("pause", pauseapp, false);
    function pauseapp() {
        window.background = true;
    }

    function resumeapp() {
        window.background = false;
    }

    document.addEventListener("resume", resumeapp, false);




}(jQuery));
