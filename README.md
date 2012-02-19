# FaceRoom

This is chat room system using facebook social graph. This system made by node.js.
This uses <a href="http://www.mongodb.org/">MongoDB</a> to store comments and users' information, and <a href="http://redis.io/">Redis</a> to store session data.
Notice this works with express version 2.x.



## How to install

First of all, clone FaceRoom.
Next, install dependencies.

       npm install -d


## How to use

Get your facebook application id from facebook developer site.
Then modify conf/config.js file at line 17 and 18.

```js
oauth: {
    facebook: {
        client_id: 'YOUR APP ID',
        client_secret: 'YOUR APP SECRET',
        graph_url: 'https://graph.facebook.com' // Do not modify this
    },
},
```

## Launch FaceRoom

To launch FaceRoom, you have to run MongoDB and Redis in your server.

         mongo &
         redis-server &

Then, launch application with `use strict` option.

         node app.js --strict

Now access `http://localhost:3000`.


## Screen capture
### Grand top
<img src="http://farm8.staticflickr.com/7068/6896904117_d0dd8041fb_z.jpg">
### Home
<img src="http://farm8.staticflickr.com/7040/6901389195_bf252262f4_z.jpg">
### Room
<img src="http://farm8.staticflickr.com/7039/6901031129_9a3647fab2_z.jpg">

## License

The MIT License (MIT)
Copyright (c) 2012 Yasuharu Ozaki

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
