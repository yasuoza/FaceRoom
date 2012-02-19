/**
 *
 *  This is chatroom management code.
 *
 **/

"use strict";

var express = require('express'),
    RedisStore = require('connect-redis')(express),
    sessionStore = new RedisStore,
    socket = require('socket.io'),
    url = require('url'),
    mongoose = require('mongoose'),
    Room = mongoose.model('Room'),
    User = mongoose.model('User'),
    connect = require('connect'),
    parseCookie = connect.utils.parseCookie,
    Session = connect.middleware.session.Session;


module.exports = function (options) {
  var app = options.app,
      config = options.config,
      io = socket.listen(app, {log: false});

  // Room router
  var member_in = [],
      room_id;
  app.get('/room/:id', function (req, res) {
    room_id = req.params.id;
    // No session data. Redirect to login.
    if (!req.session.user) {
      return res.redirect('/');
    }
    Room.findById(room_id, function (err, room) {
      if (err) {
        return res.redirect('/');
      } else {
        if (!room) {
          return res.redirect('/');
        }
        User.findOne({_id: req.session.user._id}, function (err, user) {
          var can_enter =  user.rooms.some(function (v) {
            return room_id == v;
          });
          if (true !== can_enter) {
            return res.redirect('/');
          }
          if (!(member_in[room_id] instanceof Array)) {
            member_in[room_id] = [];
          }
          // Render room member name to h1 elment.
          var h1_members = [];
          room.members.forEach(function (mate) {
            if (mate.name !== req.session.user.name) {
              h1_members.push({name: mate.name});
            }
          });
          return res.render('room', {
              users: h1_members,
              user_fid: req.session.user.facebook_id,
              id: req.session.user.name
          });
        });
      }
    });
  });


  // Socket.io configuration handling express session data
  // Try to get session data using socket.io handshake header data
  io.configure(function () {
    io.set('authorization', function (handshake_data, next) {
      if (handshake_data.headers.cookie) {
        var cookie = handshake_data.headers.cookie;
        var sessionID = parseCookie(cookie)['connect.sid'];

        // Store session data
        handshake_data.cookie = cookie;
        handshake_data.sessionID = sessionID;
        handshake_data.sessionStore = sessionStore;
        sessionStore.get(sessionID, function (err, session) {
          if (err) {
            console.log(err.message);
            return next('could not get session', false);
          } else {
            // Store express session to socket.io session
            handshake_data.session = new Session(handshake_data, session);
            return next(null, true);
          }
        });
      } else {
        return next('no cookie', false);
      }
    });
  });


  // Socket.io function definition
  io.sockets.on('connection', function (client) {
    var handshake = client.handshake;
    if(!(handshake.session.in_room instanceof Array)) {
      handshake.session.in_room = [];
    }
    // emit recent max 20 comments when connected
    Room.findById(room_id, function (err, room) {
      if (room) {
        var load_max = (room.comments.length > 20) ? 20 : room.comments.length;
        var recent_coms = room.comments.slice(0, load_max);
        client.emit('recent_coms', JSON.stringify(recent_coms));
      }
    });

    client.on('init', function (req) {
      // Join user to this room.
      client.join(room_id);
      client.set('room', room_id);
      client.set('author_fb_id', handshake.session.user.facebook_id);
      client.set('author_name', handshake.session.user.name);

      // Validate if user is already in room.
      // If user is already in room do not emit welcome message.
      var in_room = handshake.session.in_room.some(function (v) {
        return v == room_id;
      });
      if (false == in_room) {
        handshake.session.in_room.push(room_id);
        handshake.session.save();
      }

      // Join client to specified room
      User.findById(handshake.session.user._id, function (err, user) {
        if (!user) {
          console.error('user not found');
        } else {
          var new_commer = {
            facebook_id: user.facebook_id,
            name: user.name
          };
          var in_room = member_in[room_id].some(function (user) {
            return user.facebook_id == new_commer.facebook_id;
          });
          if (false == in_room) {
            member_in[room_id].push(new_commer);
            client.in(room_id).broadcast.emit('update_members', new_commer);
          }
          member_in[room_id].forEach(function (member) {
            client.emit('update_members', member);
          });
        }
      });
    });

    client.on('chat', function (msg) {
      var room_id,
      author_fb_id,
      author_name;
    client.get('room', function (err, stored_rid) {
      room_id = stored_rid;
    });
    client.get('author_fb_id', function (err, stored_afbid) {
      author_fb_id = stored_afbid;
    });
    client.get('author_name', function (err, stored_aname) {
      author_name = stored_aname;
    });
    var post = {
      body: msg,
      author_facebook_id: author_fb_id,
      author_name: author_name,
      post_date: Date.now()
    };
    var send_msg = JSON.stringify(post);
    client.emit('message', send_msg);

    // Store data to room.comments
    Room.findById(room_id, function (err, room) {
      if (err) {
        console.log(err);
        client.emit('message', 'ERROR!');
      } else {
        room.comments.push(post);
        room.modified_on = new Date();
        room.save(function (err) {
          client.in(room_id).broadcast.emit('message', send_msg);
        });
      }
    });
    });

    client.on('disconnect', function () {
      var session = this.handshake.session,
      room_id;
    client.get('room', function (err, stored_rid) {
      room_id = stored_rid;
    });
    session.in_room.forEach(function (room, i) {
      if (room_id == room) {
        session.in_room.splice(i, 1);
        handshake.session.save();
        return false;
      }
    });
    member_in[room_id].forEach(function (member, i) {
      if (member.facebook_id == session.user.facebook_id) {
        member_in[room_id].splice(i, 1);
        return false;
      }
    });
    client.in(room_id).broadcast.emit('clear_members');
    member_in[room_id].forEach(function (member) {
      client.in(room_id).broadcast.emit('update_members', member);
    });
    });
  });
}
