import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import fs from 'fs';
import unzipper from 'unzipper';

export default () => {
  WebApp.connectHandlers.use('/h5pContent', (request, response, next) => {
    if (request.method !== 'GET') next();
    const path = require('url').parse(request.url).pathname;
    const fname = path && '/tmp/h5p/' + path;
    fs.access(fname, err => {
      if (err) {
        response.writeHead(404);
        response.end();
      } else {
        const ext = fname.split('.').pop();
        if (ext === 'css') {
          response.writeHead(200, { 'content-type': 'text/css' });
        } else if (ext === 'html') {
          response.writeHead(200, { 'content-type': 'text/html' });
        }
        const readStream = fs.createReadStream(fname);
        readStream.once('open', () => readStream.pipe(response));
      }
    });
  });

  WebApp.connectHandlers.use('/H5p', (request, response, next) => {
    if (request.method !== 'GET') next();
    const id = require('url').parse(request.url).pathname;
    const res = `
<html>
<head>
<link type="text/css" rel="stylesheet" media="all" href="/h5p/dist/styles/h5p.css" />
<meta charset="utf-8" />
<script type="text/javascript" src="/h5p/dist/js/h5p-standalone-main.js"></script>

<script type="text/javascript">
  (function($) {
    $(function() {
      $('.h5p-container').h5p({
        frameJs: '/h5p/dist/js/h5p-standalone-frame.js',
        frameCss: '/h5p/dist/styles/h5p.css',
        h5pContent: '/h5pContent/${id}'
      });
    });
  })(H5P.jQuery);
H5P.externalDispatcher.on('xAPI', function(event) {
window.parent.postMessage({ msg: event.data.statement, type: 'h5p-log', id: '${id}' }, '*');
});
</script>
</head>
<body>
  <div class="h5p-container"></div>
</body>
</html>`;

    response.writeHead(200);
    response.end(res);
  });
};

Meteor.methods({
  'h5p.unzip': id =>
    Promise.await(
      new Promise(resolve => {
        fs.access('/tmp/' + id, err => {
          if (err) {
            resolve(-1);
          } else {
            fs
              .createReadStream('/tmp/' + id)
              .pipe(unzipper.Extract({ path: '/tmp/h5p/' + id }))
              .on('error', _ => {
                console.error(`Cannot unzip /tmp/${id}`);
                resolve(-1);
              })
              .promise()
              .then(
                () => resolve(1),
                e => {
                  console.error(e);
                  resolve(-1);
                }
              );
          }
        });
      }).catch(() => -1)
    )
});
