
(function ($) {

    var chat = undefined;

    $.connection.hub.url = "http://bathindavarinder-001-site1.smarterasp.net/signalr";

    chat = $.connection.chatHub;

    var tryingToReconnect = false;

    $.initiateConnection = function () {

        if ($.CheckConnection()) {

            $.show('afui', false);

            $.show('loading', true);

            $.connection.hub.start().done(function () {
                var myClientId = $.connection.hub.id;
                localStorage.setItem("ConnId", myClientId);
                //chat.server.updateName(myClientId, $('#displayname').val());
                var name = localStorage.getItem("Name");
                var room = localStorage.getItem("room");


                $.JoinRoom(room, name);
                $.show('afui', true);
                $.show('loading', false);
            });

        } else {

            alert("please check your network.");
            $.openRooms();
        }
    };


    $.JoinRoom = function (groupname, name) {
        chat.server.joinRoom(groupname, name);
    }

    $.leaveRoom = function (groupname, name) {

        var myClientId = localStorage.getItem("ConnId");

        chat.server.leaveRoom(groupname, name, myClientId);

        if (tryingToReconnect) {
            $.openRooms();
        }
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

        var msg = $('<li>' + encodedMsg + '</li>');

        $.informMessage(msg, yourname, false);

        if ($('#userList #' + name).length == 0) {
            if (yourname != name)
                $("#userList").append('<li><a href="#" class="icon chat ui-link" id="' + name + '">' + name + '</li>');
        }
    };

    chat.client.leftRoom = function (name) {
        $('#userList #' + name).parent().remove();
        $.Message(name + " Left.", name, true);
    };

    chat.client.confirmLeft = function () {
        $.openRooms();
    };

    $.connection.hub.reconnecting(function () {
        var msg = $('<li> Reconnecting.... </li>');
        $.informMessage("Reconnecting....", "Gapshap", true);
        tryingToReconnect = true;
    });

    $.connection.hub.connectionSlow(function () {
        var msg = $('<li> Connection slow.... </li>');
        $.informMessage(" Connection slow....", "Gapshap", true);

    });

    $.connection.hub.reconnected(function () {
        tryingToReconnect = false;
        var myClientId = $.connection.hub.id;
        var msg = $('<li> Reconnected.... </li>');
        $.informMessage(" Reconnected.... ", "Gapshap", true);
        if (myClientId != localStorage.getItem("ConnId")) {

            var msg = $('<li> updating connection.... </li>');

            $.informMessage("updating connection....", "Gapshap", true);

            var yourname = localStorage.getItem("Name");
            chat.server.updateConnId(localStorage.getItem("ConnId"), myClientId, yourname);
            localStorage.setItem("ConnId", myClientId);
        }
       
    });

    $.connection.hub.disconnected(function () {

        if (!window.background) {

            $.connection.hub.start().done(function () {

                var myClientId = $.connection.hub.id;

                if (myClientId != localStorage.getItem("ConnId")) {
                    chat.server.updateConnId(localStorage.getItem("ConnId"), myClientId, yourname);
                }
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

    

    chat.client.addChatMessage = function (message) {

        var n = message.indexOf(":");

        var name = message.substring(0, n);

        var encodedMsg = $('<div />').text(message).html();


        var msg = $('<li>' + encodedMsg + '</li>');
        $.informMessage(msg, "Gapshap", false);
        
        if (window.background) {
            $.showNotification(name, encodedMsg);
        }

    };



    $.SendGroupMessage = function (grpName, name, message) {
        chat.server.sendGroupMessage(grpName, name, message);
    }

    document.addEventListener("offline", onOffline, false);

    function onOffline() {
        alert("please check your network.")
        $.openRooms();
    }

    $.Message = function (message, by, left) {

        var divExist = true;

        if ($('div#' + by).length == 0) {

            divExist = false;

            if (!left) {
                var parentDiv = $.buildChatWindow(by);

                $('#content').append(parentDiv);

                window.scroller[by] = $("#" + by + " .MainComments").scroller({
                    lockBounce: false
                });
            }
        }

        if (left && !divExist) {
            return;
        }

        if (window.activeUser != by)
            $('#userList #' + by).parent().css("background-color", "orange");

        var encodedMsg = $('<div />').text(message).html();

        var msg = $('<li>' + by + ' : ' + encodedMsg + '</li>');

        $('div#' + by + ' .ChatWindow').append(msg);

        $.scrollOnMessage(by);
       
    }
    // Personal Message from some one.
    chat.client.recievePersonalChat = function (message, by) {

        $.Message(message, by, false);
        if (window.background) {
            $.showNotification(by, message);
        }
    }


     // Add msg sent by me to personal chat window 
    chat.client.byPersonalChat = function (message, by) {

        var yourname = localStorage.getItem("Name");

        if ($('div#' + by).length == 0) {

            var parentDiv = $.buildChatWindow(by);

            $('#content').append(parentDiv);

            window.scroller[by] = $("#" + by + " .MainComments").scroller({
                lockBounce: false
            });
        }

        if (window.activeUser != by)
            $('#userList #' + by).parent().css("background-color", "orange");

        var encodedMsg = $('<div />').text(message).html();

        var msg = $('<li>' + yourname + ' : ' + encodedMsg + '</li>');

        $('div#' + by + ' .ChatWindow').append(msg);

        msg.focus();

        if (window.background) {
            $.showNotification(by, message);
        }

        $.scrollOnMessage(by);
    }


    // Send personal message
    $.SendPersonalMessage = function (name, message, by) {
        chat.server.sendPersonalMessage(name, message, by);
    } 


    // Send group message
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


