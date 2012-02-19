/**
 * This configuration is template.
 * You shoud overwrite these config by "development.js" or "deployment.js"
 **/

"use strict";

module.exports = Object.freeze({
    http: {
        base_uri: 'http://localhost:3000',
        host: 'localhost',
        front_port: 3000,
        back_port: 3000,
    },
    oauth: {
        facebook: {
            client_id: 'YOUR APP ID',
            client_secret: 'YOUR APP SECRET',
            graph_url: 'https://graph.facebook.com'
        },
    },
    cookie: {
        secret: 'Xw88CgrqcUEoLmwowuSZ3lu86qZzmBWX',
        maxAge : 9999 * 60 * 60 * 1000, //pseudo Infinity,
        httpOnly : false
    },
    db: {
        type: 'mongodb',
        host:'localhost',
        port: 27017,
        dbname: 'faceroom'
    }
});
