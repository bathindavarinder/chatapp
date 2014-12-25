
(function ($) {

    var chat = undefined;

    //$.initiateConnection = function () {
    //    $.connection.hub.url = "http://bathindavarinder-001-site1.smarterasp.net/signalr";

    //    // Grab the hub by name, the same name as specified on the server
    //    chat = $.connection.chatHub;
    //};

    //  show('afui', false);


    $.connection.hub.url = "http://bathindavarinder-001-site1.smarterasp.net/signalr";
    chat = $.connection.chatHub;
    $.initiateConnection = function () {

        if (CheckConnection()) {
            show('afui', false);
            show('loading', true);
            // Grab the hub by name, the same name as specified on the server


            $.connection.hub.start().done(function () {
                var myClientId = $.connection.hub.id;
                localStorage.setItem("ConnId", myClientId);
                //chat.server.updateName(myClientId, $('#displayname').val());
                var name = localStorage.getItem("Name");
                var room = localStorage.getItem("room");


                $.JoinRoom(room, name);
                show('afui', true);
                show('loading', false);
            });
        } else {
            alert("please check your network.");
            $.openRooms();
        }
    };

    function CheckConnection() {

        if (!navigator.network) {
            // set the parent windows navigator network object to the child window
            navigator.network = window.top.navigator.network;
        }

        // return the type of connection found
        return ((navigator.network.connection.type === "none" || navigator.network.connection.type === null ||
               navigator.network.connection.type === "unknown") ? false : true);
    }

    function show(id, value) {
        document.getElementById(id).style.display = value ? 'block' : 'none';
    }

    $.openRooms = function () {
        window.location = "rooms.html";

    }

    $.JoinRoom = function (groupname, name) {
        chat.server.joinRoom(groupname, name);
    }

    $.leaveRoom = function (groupname, name) {
        var myClientId = localStorage.getItem("ConnId");
        chat.server.leaveRoom(groupname, name, myClientId);
    }


    chat.client.updateMembers = function (names) {

        var users = names.split(",");
        var yourname = localStorage.getItem("Name");
        $.each(users, function (index, name) {
            if (name != "") {
                if ($('#' + name).length == 0) {
                    if (yourname != name)
                        $("#userList").append('<li><a href="#" class="icon chat ui-link" id="' + name + '">' + name + '</li>');
                }
            }
        });

    };

    chat.client.confirmJoin = function (name) {

        var encodedMsg = $('<div />').text(name + " Joined").html();
        var yourname = localStorage.getItem("Name");
        if (window.background) {
            $.showNotification(name, encodedMsg);
        }
        var msg = $('<li>' + encodedMsg + '</li>');
        $("#ChatWindow").append(msg);
        msg.focus();


        if ($('#userList #' + name).length == 0) {
            if (yourname != name)
                $("#userList").append('<li><a href="#" class="icon chat ui-link" id="' + name + '">' + name + '</li>');
        }
    };

    chat.client.confirmLeft = function () {
        $.openRooms();
    };

    $.connection.hub.reconnecting(function () {
        alert("Reconnecting.......");
        show('afui', false);
        show('loading', true);
    });

    $.connection.hub.reconnected(function () {

        var myClientId = $.connection.hub.id;

        if (myClientId != localStorage.get("ConnId")) {
            var yourname = localStorage.getItem("Name");
            chat.server.updateConnId(localStorage.get("ConnId"), myClientId, yourname);
            localStorage.setItem("ConnId", myClientId);
        }
        show('afui', true);
        show('loading', false);
    });

    $.connection.hub.disconnected(function () {

        if (!window.background) {

            $.connection.hub.start().done(function () {

                var myClientId = $.connection.hub.id;

                localStorage.setItem("ConnId", myClientId);
                //chat.server.updateName(myClientId, $('#displayname').val());

                var name = localStorage.getItem("Name");

                var room = localStorage.getItem("room");


                $.JoinRoom(room, name);

            });

        } else {
            $.showNotification("Timeout", "You have been pulled out of room because of no activity");
            $.openRooms();
        }

    });

    chat.client.leftRoom = function (name) {
        $('#userList #' + name).parent().remove();
        $.leftMessage(name + " Left.", name, true);
    };

    chat.client.addChatMessage = function (message) {

        var n = message.indexOf(":");

        var name = message.substring(0, n);

        var encodedMsg = $('<div />').text(message).html();

        var msg = $('<li>' + encodedMsg + '</li>');

        $("#ChatWindow").append(msg);

        msg.focus();

        if (window.background) {
            $.showNotification(name, encodedMsg);
        }

    };

    $.showNotification = function (title, msg) {
        window.plugin.notification.local.add({ message: msg, title: title, autoCancel: true })
    }

    $.SendGroupMessage = function (grpName, name, message) {
        chat.server.sendGroupMessage(grpName, name, message);
    }

    document.addEventListener("offline", onOffline, false);

    function onOffline() {
        alert("please check your network.")
        $.openRooms();
    }

    $.leftMessage = function (message, by, left) {

        if ($('div#' + by).length == 0) {

            if (!left) {

                var parentDiv = $.buildChatWindow(by);

                $('#content').append(parentDiv);

                var encodedMsg = $('<div />').text(message).html();

                var msg = $('<li>' + by + ' : ' + encodedMsg + '</li>');

                $('div#' + by + ' .ChatWindow').append(msg);

                msg.focus();

                if (window.activeUser != by)
                    $('#userList #' + by).css("background-color", "orange");
            }
        }
        else {

            if (window.activeUser != by)
                $('#userList #' + by).css("background-color", "orange");

            var encodedMsg = $('<div />').text(message).html();

            var msg = $('<li>' + by + ' : ' + encodedMsg + '</li>');

            $('div#' + by + ' .ChatWindow').append(msg);

            msg.focus();

        }
    }

    $.buildChatWindow = function (id) {

        var source = $("#personal-template").html();

        var template = Handlebars.compile(source);

        var context = { name: by }

        var html = template(context);

        var parentDiv = $("<div  class='panel chwin' style='display:none;height: 85%;position:static' id='" + id + "'></div>");

        parentDiv.html(html);

        return parentDiv;
    }
    chat.client.recievePersonalChat = function (message, by) {

        $.leftMessage(message, by, false);
        if (window.background) {
            $.showNotification(by, message);
        }
    }


    chat.client.byPersonalChat = function (message, by) {

        var yourname = localStorage.getItem("Name");

        if ($('div#' + by).length == 0) {

            var parentDiv = $.buildChatWindow(by);

            $('#content').append(parentDiv);

            var encodedMsg = $('<div />').text(message).html();
            var msg = $('<li>' + yourname + ' : ' + encodedMsg + '</li>');
            $('div#' + by + ' .ChatWindow').append(msg);

            msg.focus();

            if (window.activeUser != by)
                $('#userList #' + by).parent().css("background-color", "orange");

        }
        else {

            if (window.activeUser != by)
                $('#userList #' + by).parent().css("background-color", "orange");

            var encodedMsg = $('<div />').text(message).html();

            var msg = $('<li>' + yourname + ' : ' + encodedMsg + '</li>');

            $('div#' + by + ' .ChatWindow').append(msg);

            msg.focus();

        }

        if (window.background) {
            $.showNotification(by, message);
        }
    }

    $.SendPersonalMessage = function (name, message, by) {
        chat.server.sendPersonalMessage(name, message, by);
    }


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
            return;
        }

        if ($('div#' + username).length == 0) {

            var parentDiv = $.buildChatWindow(username);

            $('#RoomChatWindow').css("display", "none");

            $("#HeadName").text(username);

            $.each($('.chwin'), function (name) {
                $(this).css("display", "none");
            });
            parentDiv.html(html);
            window.activeUser = username;
            $('#content').append(parentDiv);

            $('#userList #' + username).css("background-color", "#619ef2");
        }
        else {

            $.each($('.chwin'), function (name) {
                $(this).css("display", "none");
            });

            $('#RoomChatWindow').css("display", "none");

            window.activeUser = username;
            $("#HeadName").text(username);
            $('div#' + username).css("display", "block");
            $('#userList #' + username).css("background-color", "#619ef2");
        }
        $.ui.toggleSideMenu();
    }


    $.SendMessage = function () {
        var name = localStorage.getItem("Name");
        var Message = $("#HomeMessage").val();

        if (Message == "") {
            return;
        }

        var room = localStorage.getItem("room");
        if (window.activeUser == "") {
            $.SendGroupMessage(room, name, Message);
        } else {
            $.SendPersonalMessage(window.activeUser, Message, name);
        }

        $("#HomeMessage").val("");
    }

}(jQuery));


