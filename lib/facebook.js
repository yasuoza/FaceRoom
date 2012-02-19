"use strict";

var async = require('async'),
    url = require('url'),
    oauth = require('oauth'),
    config = require('../conf/config');

var Facebook = function (query) {
    this.oauth =  new oauth.OAuth2(
        config.oauth.facebook.client_id,
        config.oauth.facebook.client_secret,
        config.oauth.facebook.graph_url
    ),
    this.get_url = config.oauth.facebook.graph_url + query;
};

Facebook.prototype.logIn = function (req, res, next) {
    this.redirect_uri = config.http.base_uri + url.parse(req.url).pathname;
    this.code = req.param('code');

    if (req.session && req.session.oauth && this.code) {
        this.oauthFlow(next);
    } else {
        req.session.oauth = true;
        return res.redirect(this.oauth.getAuthorizeUrl({
            redirect_uri: this.redirect_uri,
            scope: 'read_friendlists,email'
        }));
    }
};

Facebook.prototype.oauthFlow =  function (next) {
    var that = this;
    async.waterfall([
        function (err_cb) {
            that.oauth.getOAuthAccessToken(
                that.code,
                { redirect_uri: that.redirect_uri },
                err_cb
            );
        },
        function (access_token, refresh_token, err_cb) {
            that.oauth.get(
                that.get_url,
                access_token,
                err_cb
            );
        },
        function (result, response, err_cb) {
          next(null, JSON.parse(result), that);
        }
    ], function (err) {
          console.error(err);
    });
};

module.exports = Facebook;

