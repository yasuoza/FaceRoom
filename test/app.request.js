var express = require('express'),
    request = require('request'),
    util = require('util');

var app = express.createServer();

function testUrl(path) {
  if (path.substr(0, 1) !== '/') {
    path = '/' + path;
  }
  return util.format('http://localhost:%d%s', 3000, path);
}

describe('app', function() {
    describe('GET root', function() {

        it('should return 200 statusCode', function(done) {
            request.get({
                url: testUrl('/')
            }, function(err, res, body) {
                if (err) return done(err);
                res.statusCode.should.equal(200);
                done();
            });
        });
        
        
      it('sould return \'text/html; charset=utf-8\'  header', function(done) {
          request.get({
              url: testUrl('/')
          }, function (err, res, body) {
              if (err) return done(err);
              res.header('content-type').
                  should.equal('text/html; charset=utf-8');
              done();
          });
      });


  });
});
