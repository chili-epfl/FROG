import bodyParser from 'body-parser';
import { Picker } from 'meteor/meteorhacks:picker';
import { uuid } from 'frog-utils';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import fs from 'fs';

Picker.middleware(bodyParser.urlencoded({ extended: false }));
Picker.middleware(bodyParser.json());

Picker.filter(req => req.method === 'POST').route(
  '/lti/:slug',
  (params, request, response) => {
    let user;
    try {
      user = request.body.lis_person_name_full;
    } catch (e) {
      user = uuid();
    }
    let id;
    try {
      id = JSON.parse(request.body.lis_result_sourcedid).data.userid;
    } catch (e) {
      id = uuid();
    }

    // eslint-disable-next-line no-console
    const { userId } = Accounts.updateOrCreateUserFromExternalService('frog', {
      id: user
    });
    Meteor.users.update(userId, { $set: { username: user, userid: id } });
    response.writeHead(301, {
      Location: `/${params.slug}?login=${encodeURI(user)}`
    });
    response.end();
  }
);

if (process.env.NODE_ENV !== 'production') {
  WebApp.connectHandlers.use('/file', (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', 'PUT');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
    } else if (req.method === 'PUT') {
      req.pipe(fs.createWriteStream('/tmp/' + req.query.name));
      res.writeHead(200);
      res.end();
    } else if (req.method === 'GET') {
      const fname = req.query.name && '/tmp/' + req.query.name.split('?')[0];
      fs.access(fname, err => {
        if (err) {
          res.writeHead(404);
          res.end();
        } else {
          res.writeHead(200);
          const readStream = fs.createReadStream(fname);
          readStream.once('open', () => readStream.pipe(res));
        }
      });
    }
  });
}
