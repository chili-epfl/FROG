import bodyParser from 'body-parser';
import { Picker } from 'meteor/meteorhacks:picker';
import { uuid } from 'frog-utils';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

Picker.middleware(bodyParser.urlencoded({ extended: false }));
Picker.middleware(bodyParser.json());

Picker.filter(
  req => req.method === 'POST'
).route('/lti/:slug', (params, request, response) => {
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
});
