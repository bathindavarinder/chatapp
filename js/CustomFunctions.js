(function ($) {


    $.showNotification = function (title, msg) {
        window.plugin.notification.local.add({ message: msg, title: title, autoCancel: true })
    }


    $.buildChatWindow = function (id) {

        var source = $("#personal-template").html();

        var template = Handlebars.compile(source);

        var context = { name: id }

        var html = template(context);

        var parentDiv = $("<div  class='panel chwin' style='display:none;height: 85%;position:static' id='" + id + "'></div>");

        parentDiv.html(html);

        return parentDiv;
    }

    $.informMessage = function (msg, name, addToHeader) {

        if (window.background) {
            $.showNotification(name, msg);
        }

        $("#ChatWindow").append(msg);

        if (addToHeader) {

            var old = $("#HeadName").text();

            $("#HeadName").text(msg);

            setTimeout(function () {
                // Do something after 5 seconds
                $("#HeadName").text(old)
            }, 5000);

        }
    };



    $.userClick = function (clickId) {

        var username = clickId;// $(this).attr("id");

        var room = localStorage.getItem("room");

        var name = localStorage.getItem("Name");

        if (username == name || username == "Back") {
            return;
        }

        if (username == "Home") {

            $.each($('.chwin'), function (name) {
                $(this).css("display", "none");
            });
            $("#HeadName").text(room);
            $('#RoomChatWindow').css("display", "block");
            window.activeUser = "";
            $.ui.toggleSideMenu();
            return;
        }

        if ($('div#' + username).length == 0) {

            var parentDiv = $.buildChatWindow(username);
            $('#content').append(parentDiv);
        }


        $.each($('.chwin'), function (name) {
            $(this).css("display", "none");
        });

        $('#RoomChatWindow').css("display", "none");

        window.activeUser = username;
        $("#HeadName").text(username);
        $('div#' + username).css("display", "block");
        $('#userList #' + username).parent().css("background-color", "#619ef2");

        $.ui.toggleSideMenu();
    }

    $.CheckConnection = function () {
        if (window.Cordova && navigator.splashscreen) {

            if (!navigator.network) {
                // set the parent windows navigator network object to the child window
                navigator.network = window.top.navigator.network;
            }

            // return the type of connection found
            return ((navigator.network.connection.type === "none" || navigator.network.connection.type === null ||
                   navigator.network.connection.type === "unknown") ? false : true);
        }
        else {
            return true;
        }
    }

    $.show = function (id, value) {
        document.getElementById(id).style.display = value ? 'block' : 'none';
    }

    $.openRooms = function () {
        window.location = "rooms.html";
    }

}(jQuery));
