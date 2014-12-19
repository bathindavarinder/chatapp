
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
        $("#ChatWindow").append('<li>' + encodedMsg + '</li>');

     
        if ($('#' + name).length == 0) {
            if (yourname != name)
                $("#userList").append('<li><a href="#" class="icon chat ui-link" id="' + name + '">' + name + '</li>');
        }
    };

    chat.client.confirmLeft = function () {
        $.openRooms();
    };

    $.connection.hub.disconnected(function () {

        setTimeout(function () {
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
        }, 5000);

    });

    chat.client.leftRoom = function (name) {
        $('#userList #' + name).parent().remove();
        $.leftMessage(name + " Left.", name);
    };

    chat.client.addChatMessage = function (message) {
        var n = message.indexOf(":");
        var name = message.substring(0, n);
        var encodedMsg = $('<div />').text(message).html();


        $("#ChatWindow").append('<li>' + encodedMsg + '</li>');

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

    $.leftMessage = function (message, by) {
        if ($('div#' + by).length == 0) {

            var source = $("#personal-template").html();
            var template = Handlebars.compile(source);
            var context = { name: by }
            var html = template(context);
            var parentDiv = $("<div  class='panel chwin' style='display:none' id='" + by + "'></div>");

            parentDiv.html(html);

            $('#content').append(parentDiv);

            var encodedMsg = $('<div />').text(message).html();

            $('#' + by + ' .ChatWindow').append('<li>' + by + ' : ' + encodedMsg + '</li>');


            if (window.activeUser != by)
                $('#userList #' + by).css("background-color", "orange");
        }
        else {
            if (window.activeUser != by)
                $('#userList #' + by).css("background-color", "orange");

            var encodedMsg = $('<div />').text(message).html();

            $('#' + by + ' .ChatWindow').append('<li>' + by + ' : ' + encodedMsg + '</li>');


        }
    }

    chat.client.recievePersonalChat = function (message, by) {

        $.leftMessage(message, by);
    }


    chat.client.byPersonalChat = function (message, by) {

        var yourname = localStorage.getItem("Name");

        if ($('div#' + by).length == 0) {

            var source = $("#personal-template").html();
            var template = Handlebars.compile(source);
            var context = { name: by }
            var html = template(context);
            var parentDiv = $("<div  class='panel chwin' style='display:none' id='" + by + "'></div>");

            parentDiv.html(html);

            $('#content').append(parentDiv);

            var encodedMsg = $('<div />').text(message).html();

            $('#' + by + ' .ChatWindow').append('<li>' + yourname + ' : ' + encodedMsg + '</li>');


            if (window.activeUser != by)
                $('#userList #' + by).css("background-color", "orange");
        }
        else {
            if (window.activeUser != by)
                $('#userList #' + by).css("background-color", "orange");

            var encodedMsg = $('<div />').text(message).html();

            $('#' + by + ' .ChatWindow').append('<li>' + yourname + ' : ' + encodedMsg + '</li>');


        }
    }

    $.SendPersonalMessage = function (name, message, by) {
        chat.server.sendPersonalMessage(name, message, by);
    }




}(jQuery));


