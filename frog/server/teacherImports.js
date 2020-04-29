/* eslint-disable func-names */
import { Meteor } from 'meteor/meteor';

import {
  Activities,
  Connections,
  DashboardData
} from '../imports/api/activities';
import { UploadList } from '../imports/api/openUploads';
import { Operators, ExternalOperators } from '../imports/api/operators';
import { Graphs } from '../imports/api/graphs';
import { Templates } from '../imports/api/templates';
import { Sessions } from '../imports/api/sessions';
import { Products } from '../imports/api/products';
import { Objects } from '../imports/api/objects';

const teacherPublish = (publish, collection, limitation) => {
  Meteor.publish(publish, function() {
    return limitation ? collection.find({}, limitation) : collection.find({});
  });
};

const teacherPublishOwn = (publish, collection) => {
  Meteor.publish(publish, function() {
    return collection.find({
      ownerId: this.userId,
      uiStatus: { $ne: 'deleted' }
    });
  });
};

export default function() {
  Meteor.publish('teacher.graph', function(graphId) {
    const graph = Graphs.findOne(graphId);
    if (!graph || !graph.ownerId === this.userID) {
      return this.ready();
    }
    const act = Activities.find({ graphId });
    return [
      Activities.find({ graphId }),
      Operators.find({ graphId }),
      Connections.find({ graphId }),
      Objects.find({ _id: { $in: act.map(x => x._id) } })
    ];
  });

  Meteor.publish('session.students', slug =>
    Meteor.users.find(
      { joinedSessions: slug },
      {
        fields: {
          username: 1,
          joinedSessions: 1,
          role: 1,
          'profile.displayName': 1
        }
      }
    )
  );

  teacherPublish('activities', Activities);
  teacherPublish('operators', Operators);
  teacherPublish('externalOperators', ExternalOperators);
  teacherPublish('dashboardData', DashboardData);
  teacherPublish('connections', Connections);
  teacherPublish('uploadList', UploadList);
  teacherPublishOwn('graphs', Graphs, this.userId);
  teacherPublishOwn('templates', Templates, this.userId);
  teacherPublishOwn('sessions', Sessions, this.userId);
}

Meteor.methods({
  'get.object.product': id => [Objects.findOne(id), Products.findOne(id)]
});
