// @flow

import { Meteor } from 'meteor/meteor';
import downloadLog from '../../utils/downloadLog';
import { exportSession } from '../../utils/exportComponent';

export const exportActions = (session: Object) => ({
  downloadLog: () => downloadLog(session._id),
  exportSession: () => exportSession(session._id),
  exportWiki: () => () => {
    const whereTo = window.prompt('Which wiki should pages be exported to?');
    if (!whereTo) {
      console.warn('no whereto');
      return;
    }
    Meteor.call(
      'export.session.wiki',
      session._id,
      whereTo,
      Meteor.userId(),
      err =>
        window.alert(err ? 'Oops! something went wrong.' : 'Graph exported')
    );
  }
});
