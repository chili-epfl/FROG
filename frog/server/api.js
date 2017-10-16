import bodyParser from 'body-parser';
import { Picker } from 'meteor/meteorhacks:picker';

Picker.middleware(bodyParser.urlencoded({ extended: false }));
Picker.middleware(bodyParser.json());

Picker.filter(req => req.method === 'POST').route(
  '/lti/:slug',
  (params, request, response) => {
    const user = request.body.user_id;
    response.writeHead(301, { Location: `/${params.slug}?login=${user}` });
    response.end();
  }
);
