// @flow
import { Meteor } from 'meteor/meteor';
import FileSaver from 'file-saver';
import { Graphs } from '/imports/api/graphs';

const userIds = {};

const activities = {};
const activityInfo = (graphId: string, id: string): [string, string, string] => {
  if (!id) {
    return ['', '', ''];
  }
  if (activities[id]) {
    return activities[id];
  }
  const act = Graphs.findOne({_id: graphId}).activities.find(x => x.id === id)
  activities[id] = [act.title, act.activityType, act.plane];
  return activities[id];
};

const userLookup = userId => {
  const cache = userIds[userId];
  if (cache) {
    return cache;
  }
  const userobj = Meteor.users.findOne(userId);
  const ret = userobj ? [userobj.userid || '', userobj.username] : [userId, ''];
  userIds[userId] = ret;
  return ret;
};

export default (graphId: string, sessionId: string, callback?: Function) => {
  Meteor.call('session.logs', sessionId, 9999999, (err, succ) => {
    if (err) {
      // eslint-disable-next-line no-alert
      alert('Cannot export logs');
    } else {
      const lines = succ
        .map(x =>
          [
            x.timestamp && x.timestamp.toUTCString(),
            ...userLookup(x.userId),
            x.instanceId,
            x.activityId,
            ...activityInfo(graphId, x.activityId),
            x.type,
            x.itemId,
            JSON.stringify(x.value),
            x.payload ? JSON.stringify(x.payload) : ''
          ].join('\t')
        )
        .join('\n');
      const header = [
        'timestamp',
        'userId',
        'username',
        'instanceId',
        'activityId',
        'activityTitle',
        'activityType',
        'plane',
        'type',
        'itemId',
        'value',
        'payload'
      ].join('\t');
      const output = [header, lines].join('\n');
      if (!callback) {
        const blob = new Blob([output], {
          type: 'text/plain;charset=utf-8'
        });
        FileSaver.saveAs(blob, sessionId + '.log.tsv', true);
      } else {
        callback(output);
      }
    }
  });
};
