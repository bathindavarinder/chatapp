
(function ($) {

    var chat = undefined;

    $.connection.hub.url = "http://bathindavarinder-001-site1.smarterasp.net/signalr";

    chat = $.connection.chatHub;

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

        $.informMessage(encodedMsg, yourname,false);
        
        if ($('#userList #' + name).length == 0) {
            if (yourname != name)
                $("#userList").append('<li><a href="#" class="icon chat ui-link" id="' + name + '">' + name + '</li>');
        }
    };

    chat.client.confirmLeft = function () {
        $.openRooms();
    };

    $.connection.hub.reconnecting(function () {
        var msg = $('<li> Reconnecting.... </li>');
        $.informMessage(msg, "Gapshap",true);
    });

    $.connection.hub.connectionSlow(function () {
        var msg = $('<li> Connection slow.... </li>');
        $.informMessage(msg, "Gapshap",true);
    });

    $.connection.hub.reconnected(function () {

        var myClientId = $.connection.hub.id;
        var msg = $('<li> Reconnected.... </li>');
        $.informMessage(msg, "Gapshap",true);
        if (myClientId != localStorage.get("ConnId")) {

            var msg = $('<li> updating connection.... </li>');

            $.informMessage(msg, "Gapshap",true);

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

                if (myClientId != localStorage.get("ConnId")) {
                    chat.server.updateConnId(localStorage.get("ConnId"), myClientId, yourname);
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

    chat.client.leftRoom = function (name) {
        $('#userList #' + name).parent().remove();
        $.leftMessage(name + " Left.", name, true);
    };

    chat.client.addChatMessage = function (message) {

        var n = message.indexOf(":");

        var name = message.substring(0, n);

        var encodedMsg = $('<div />').text(message).html();

        
        var msg = $('<li>' + encodedMsg + '</li>');
        $.informMessage(msg, "Gapshap",false);
        //$("#ChatWindow").append(msg);

        msg.focus();

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


