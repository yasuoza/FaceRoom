/*
* This is for / Controller
*/

"use strict";
var mongoose = require('mongoose'),
    Room = mongoose.model('Room'),
    User = mongoose.model('User'),
    Seq = require('seq');

module.exports = function (app) {

  function logIn(req, res) {
    if (!req.session || !req.session.user) {
      return res.render('index');
    } else {
      var rooms = [],
          friends = [],
          room_query = Room.find(),
          user_query = User.find();
      Seq()
       .seq(function () {
          User.findOne({_id: req.session.user._id}, this);
        })
        .seq(function (user) {
          req.session.user = user;
          room_query.where('_id').in(req.session.user.rooms);
          room_query.exec(this);
        })
        .seq(function (stored_rooms) {
           if (stored_rooms && stored_rooms.length > 0) {
             stored_rooms.forEach(function (stored_room) {
               rooms.push({
                 _id : stored_room._id,
                 members: stored_room.members,
                 modified_on: stored_room.modified_on
               });
             });
           }
           user_query.where('_id').in(req.session.user.friends);
           user_query.exec(this);
        })
        .seq(function (user_friends) {
           user_friends.forEach(function (friend) {
             friends.push({
               name: friend.name,
               _id: friend._id,
               fb_id: friend.facebook_id
             });
           });
           return res.render('home', {
             id: req.session.user.name,
             user_fid: req.session.user.facebook_id,
             rooms: rooms,
             friends: friends
        });
      })
      ;
    }
  }

  function logOut(req, res) {
    req.session.destroy();
    res.render('logout');
  };


  app.get('/', function (req, res) {
    logIn(req, res);
  });

  app.get('/logout', function (req, res) {
    logOut(req, res);
  });
};
