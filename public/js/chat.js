
jQuery(function () {
    var socket = io.connect();
    function onSubmit() {
        var data = $('#message').val();
        socket.emit('chat', data);
        $('#message').val("");
        return false;
    }
    function update(msg) {
        var obj = $('<div class="msg">'),
            date_string = msg.post_date;
        obj
          .append('<p class="date help-block">' + (new Date(date_string)).toString() + "</p>")
          .append('<h4 class="author">' + msg.author_name + '</h4>')
          .append('<img src="http://graph.facebook.com/' + msg.author_facebook_id + '/picture">');

        var child = $('<div class="combody">');
        child.append('<p class="m_body">' + msg.body + '</span>');
        $('#view').prepend(obj.append(child));
    }

    // Bind onSubmit function to 'submit' event.
    $('form').bind('submit', onSubmit);

    socket.on('recent_coms', function (log) {
        var data = JSON.parse(log);
        data.forEach(function (data) {
            update(data);
        });
    });

    socket.on('message', function (data) {
        var msg = JSON.parse(data);
        update(msg);
    });

    socket.on('update_members', function (member) {
      $("#member_list")
             .prepend('<p class="author">' + member.name + '</p>')
             .prepend('<img src="http://graph.facebook.com/' + member.facebook_id + '/picture">');
    });

    socket.on('clear_members', function (member) {
      $("#member_list").html('');
     });
    // Emit initial request.
    socket.emit('init');

});


