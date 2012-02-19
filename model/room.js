/**
*  This is for User based functions
*
*
**/
"use strict";
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RoomMateSchema = new Schema({
  facebook_id: String,
    name: String
});
var CommentSchema = new Schema({
    body: {type: String, index: true},
    author_facebook_id: String,
    author_name: String,
    post_date: Date
});
var RoomSchema = new Schema({
  member_ids: [String],
    members: [RoomMateSchema],
    comments: [CommentSchema],
    start_date: Date,
    modified_on: Date
});

/**
 * Accessing a specific schema type by key
 */
CommentSchema.path('post_date')
    .default(function () {
        return Date.now();
    })
    .set(function (v) {
        return v === 'now' ? Date().now() : v;
    });
RoomSchema.path('start_date')
    .default(function () {
        return new Date();
    })
    .set(function (v) {
        return v === 'now' ? new Date() : v;
    });
RoomSchema.path('modified_on')
    .default(function () {
        return new Date();
    })
    .set(function (v) {
        return v === 'now' ? new Date() : v;
    });

/**
 * Define model.
 */
mongoose.model('Room', RoomSchema);

module.exports = RoomSchema;
