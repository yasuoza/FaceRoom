/**
*
*  This is to login our application with facebook id.
*
**/

"use strict";

var url = require('url'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Facebook = require('../lib/facebook'),
    Seq = require('seq');

module.exports = function (options) {
    var app = options.app,
        config = options.config,
        facebook = new Facebook('/me');

    app.get('/login', function (req, res) {
      var login_data,
          login_user,
          user;
      Seq()
      .seq(function () {
        facebook.logIn(req, res, this);
      })
      .seq(function (result, login) {
        login_user = result,
        login_data = login;
        User.findOne({facebook_id: result.id}, this);
      })
      .seq(function(user_indb) {
          user = user_indb;
          // Save user data to DB if new user.
          if (!user_indb) {
            user = new User();
            user.facebook_id = login_user.id;
            user.name = login_user.name;
            user.base_name = login_user.username;
            user.email = login_user.email;
            user.save();
          }
          var get_friends = new Facebook('/me/friends');
          get_friends.redirect_uri = login_data.redirect_uri;
          get_friends.code = login_data.code;
          get_friends.oauthFlow(this);
      })
      .seq(function (result) {
          var friend_fids = [],
              friend_query = User.find({});
          result.data.forEach(function (v) {
            friend_fids.push(v.id);
          });
          // Find friends and reflesh friends list
          user.friends = [];
          friend_query.where('facebook_id').in(friend_fids);
          friend_query.exec(this)
      })
      .seq(function (friends) {
            friends.forEach(function (friend) {
              user.friends.push(friend._id);
            });
            user.save(this);
       })
      .catch(function (err) {
          console.error(err);
          res.send(500);
          return res.render('index', {
              message: 'Login Failed',
              message_more: ''
          });
      })
      .seq(function() {
          req.session.user = user;
          return res.redirect('/');
      })
      ;

   });
};
