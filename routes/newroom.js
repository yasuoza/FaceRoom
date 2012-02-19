/**
 * This is for / Controller
 */

"use strict";
var mongoose = require('mongoose'),
    Room = mongoose.model('Room'),
    User = mongoose.model('User'),
    Seq = require('seq');

module.exports = function (options) {
    var app = options.app;

    // Prepare new room for user and user's fiend
    app.get('/newroom', function(req, res){
        if (!req.session.user) {
            return res.redirect('/');
        }
        var friend_ids = req.query.friend_id.split(' ');
        friend_ids.forEach(function (f_id) {
          if (req.session.user.friends.indexOf(f_id) === -1) {
            console.log('not user friend');
            return res.redirect('/404');
          }
        });
        var query_uids = friend_ids.concat(req.session.user._id).sort();
        Seq()
          .seq(function () {
            Room.findOne({member_ids: query_uids}, this);
          })
          .seq(function (room) {
            if (!room) {
                room = new Room();
                room.member_ids = query_uids;
                room.save(function(err) {
                  var user_query = User.find();
                  user_query.where('_id').in(room.member_ids);
                  Seq()
                    .seq(function () {
                      user_query.exec(this);
                    })
                    .seq(function (users) {
                      users.forEach(function (user) {
                        var room_mate = {
                          facebook_id: user.facebook_id,
                          name: user.name
                        };
                        room.members.push(room_mate);
                        user.rooms.push(room._id);
                        user.save();
                      });
                      room.save(function () {
                        req.session.user.rooms.push(room._id);
                        return res.redirect('/room/' + room._id);
                      });
                    })
                    ;
                });
            } else {
                req.session.user.rooms.push(room._id);
                return res.redirect('/room/' + room._id);
            }
         })
         ;
    });
};
