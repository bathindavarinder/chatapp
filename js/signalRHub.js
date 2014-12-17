
(function ($) {

    var chat = undefined;

    //$.initiateConnection = function () {
    //    $.connection.hub.url = "http://bathindavarinder-001-site1.smarterasp.net/signalr";

    //    // Grab the hub by name, the same name as specified on the server
    //    chat = $.connection.chatHub;
    //};

    $.connection.hub.url = "http://bathindavarinder-001-site1.smarterasp.net/signalr";
    chat = $.connection.chatHub;
    $.initiateConnection = function () {

        // Grab the hub by name, the same name as specified on the server

     
        $.connection.hub.start().done(function () {
            var myClientId = $.connection.hub.id;
            localStorage.setItem("ConnId", myClientId);
            //chat.server.updateName(myClientId, $('#displayname').val());
            var name = localStorage.getItem("Name");
            var room = localStorage.getItem("room");


            $.JoinRoom(room, name);
        });
    };

    $.openRooms = function () {
        window.location = "rooms.html";

    }

    $.JoinRoom = function (groupname, name) {
        chat.server.joinRoom(groupname, name);
    }

    $.leaveRoom = function (groupname, name) {
        chat.server.leaveRoom(groupname, name);
    }

    chat.client.confirmJoin = function (name) {

        var encodedMsg = $('<div />').text(name + " Joined").html();

        setTimeout(function () {
            $("#ChatWindow").append('<li>' + encodedMsg + '</li>');

        }, 2000);

        $("#userList").append('<li id="' + name + '">' + name + '</li>')

    };

    chat.client.leftRoom = function (name) {
        $('#' + name).remove();
    };

    chat.client.addChatMessage = function (message) {

        var encodedMsg = $('<div />').text(message).html();


        $("#ChatWindow").append('<li>' + encodedMsg + '</li>');


    };

    setTimeout(function () {
        $.connection.hub.start();
    }, 5000);
    $.SendGroupMessage = function (grpName, name, message) {
        chat.server.sendGroupMessage(grpName, name, message);
    }

}(jQuery));


