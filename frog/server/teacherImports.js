/* eslint-disable func-names */
import { Meteor } from 'meteor/meteor';

import {
  Activities,
  Connections,
  DashboardData
} from '../imports/api/activities.js';
import { UploadList } from '../imports/api/openUploads.js';
import { Operators, ExternalOperators } from '../imports/api/operators.js';
import { Graphs } from '../imports/api/graphs.js';
import { Sessions } from '../imports/api/sessions.js';
import { Products } from '../imports/api/products.js';
import { Objects } from '../imports/api/objects.js';

const teacherPublish = (publish, collection, limitation) => {
  Meteor.publish(publish, function() {
    return limitation ? collection.find({}, limitation) : collection.find({});
  });
};

const teacherPublishOwn = (publish, collection) => {
  Meteor.publish(publish, function() {
    return collection.find({ ownerId: this.userId });
  });
};

export default function() {
  Meteor.publish('teacher.graph', function(graphId) {
    const graph = Graphs.findOne(graphId);
    if (!graph || !graph.ownerId === this.userID) {
      return this.ready();
    }
    return [
      Activities.find({ graphId }),
      Operators.find({ graphId }),
      Connections.find({ graphId })
    ];
  });

  Meteor.publish('session.students', slug =>
    Meteor.users.find(
      { joinedSessions: slug },
      { fields: { username: 1, joinedSessions: 1, role: 1 } }
    )
  );

  teacherPublish('activities', Activities);
  teacherPublish('operators', Operators);
  teacherPublish('externalOperators', ExternalOperators);
  teacherPublish('dashboardData', DashboardData);
  teacherPublish('connections', Connections);
  teacherPublish('uploadList', UploadList);
  teacherPublishOwn('graphs', Graphs, this.userId);
  teacherPublishOwn('sessions', Sessions, this.userId);
}

Meteor.methods({
  'get.object.product': id => [Objects.findOne(id), Products.findOne(id)]
});
