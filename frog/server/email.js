import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import mailjet from 'node-mailjet';
import { uuid } from '/imports/frog-utils';

let mailjetServer;

const sendReminder = email => {
  const user = Accounts.findUserByEmail(email);
  if (!user) {
    return Meteor.Error('No such user');
  }

  const password = uuid();
  Accounts.setPassword(user._id, password, { logout: true });
  if (!mailjetServer) {
    mailjetServer = mailjet.connect(
      Meteor.settings.mailjet_user,
      Meteor.settings.mailjet_password
    );
  }

  mailjetServer.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'shaklev@gmail.com',
          Name: 'Chilifrog.ch accounts'
        },
        To: [
          {
            Email: email
          }
        ],
        Subject: 'Resetting chilifrog.ch password',
        TextPart: `Your new Chilifrog.ch password is ${password}. Please go to https://chilifrog.ch to log in, and reset your password.`,
        HTMLPart: `<h3>Resetting password</h3><p>Your new <a href="https://chilifrog.ch">Chilifrog.ch</a> password is ${password}. After logging in, you can change your password.</p>`,
        CustomID: 'AppGettingStartedTest'
      }
    ]
  });
};

Meteor.methods({ 'send.password.reminder': sendReminder });
