/**
*  This is for User based functions
*
*
**/
"use strict";
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var UserSchema = new Schema({
    facebook_id: {type: String, index: true},
    name: String,
    base_name: String,
    email: {type: String, lowercase: true, unique: true},
    friends: [String],
    rooms: [String],
    created_on: Date,
    modified_on: Date
});

/**
 * Accessing a specific schema type by key
 */
UserSchema.path('created_on')
    .default(function () {
        return new Date();
    })
    .set(function (v) {
        return v === 'now' ? new Date() : v;
    });
UserSchema.path('modified_on')
    .default(function () {
        return new Date();
    })
    .set(function (v) {
        return v === 'now' ? new Date() : v;
    });

/**
 * Define model.
 */
mongoose.model('User', UserSchema);

module.exports = UserSchema;
