import { Meteor } from 'meteor/meteor';
import FileSaver from 'file-saver';

export default sessionId => {
  Meteor.call('session.logs', sessionId, 9999999, (err, succ) => {
    if (err) {
      // eslint-disable-next-line no-alert
      alert('Cannot export logs');
    } else {
      const lines = succ
        .map(x =>
          [
            x.timestamp.toUTCString(),
            x.userId,
            x.instanceId,
            x.activityId,
            x.activityType,
            x.activityPlane,
            x.type,
            x.itemId,
            x.value,
            x.payload ? JSON.stringify(x.payload) : ''
          ].join('\t')
        )
        .join('\n');
      const header = [
        'timestamp',
        'userId',
        'instanceId',
        'activityId',
        'activityType',
        'plane',
        'type',
        'itemId',
        'value',
        'payload'
      ].join('\t');
      const output = [header, lines].join('\n');
      const blob = new Blob([output], {
        type: 'text/plain;charset=utf-8'
      });
      FileSaver.saveAs(blob, sessionId + '.log.tsv', true);
    }
  });
};
