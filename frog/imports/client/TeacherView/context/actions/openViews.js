// @flow

import { Meteor } from 'meteor/meteor';

import { uuid } from '/imports/frog-utils';

const url = Meteor.absoluteUrl();
const learnUrl =
  url === 'http://localhost:3000/'
    ? 'http://learn.chilifrog-local.com:3000'
    : 'https://learn.chilifrog.ch';

export const openViews = (session: Object) => ({
  open1Student: () =>
    window.open(
      `${learnUrl}/${session.slug}?followLogin=Chen Li&follow=${
        Meteor.user().username
      }`,
      uuid()
    ),
  open4Students: () =>
    window.open(`${learnUrl}/multiFollow/${Meteor.user().username}`, uuid()),
  openProjector: () =>
    window.open(
      `/teacher/projector/${session.slug}`
    )
});
