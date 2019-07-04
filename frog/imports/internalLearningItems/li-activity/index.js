import * as React from 'react';

import { Fab } from '@material-ui/core';
import { activityTypesObj } from '/imports/activityTypes';
import { type LearningItemT, isBrowser, uuid } from 'frog-utils';

let activityRunners = {};
let ReactiveHOC = () => undefined;
if (isBrowser) {
  activityRunners = require('/imports/client/activityRunners').activityRunners;
  ReactiveHOC = require('/imports/client/StudentView/ReactiveHOC').default;
}

const Viewer = ({ data }) => {
  const activityType = activityTypesObj[data.acType];
  const ActivityToRun = ReactiveHOC(data.rz, undefined)(
    activityRunners[data.acType]
  );

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <ActivityToRun
        activityType={activityType.id}
        activityData={data.activityData || {}}
        activityId={data.rz}
        username={Meteor.user().username}
        userid={Meteor.userId()}
        userInfo={{ name: Meteor.user().username, id: Meteor.userId() }}
        stream={() => undefined}
        logger={() => undefined}
        groupingValue={{}}
        sessionId=""
      />
    </div>
  );
};

const duplicate = async (li, dataFn, meta, instanceId) => {
  const rootRz = li.liDocument.payload.rz;
  const acData = await new Promise(resolve => {
    const ac = dataFn.doc.connection.get('rz', rootRz);
    ac.fetch();
    if (ac.type) {
      resolve(ac.data);
    }
    ac.once('load', () => {
      resolve(ac.data);
    });
  });
  const rz = rootRz + '/' + instanceId;
  const activityPointer = dataFn.doc.connection.get('rz', rz);
  activityPointer.create(acData || {});
  const payload = li.liDocument.payload;
  const res = { ...payload, rz };
  return dataFn.createLearningItem('li-activity', res, meta, true);
};

export default ({
  name: 'FROG Activity',
  id: 'li-activity',
  liDataStructure: {
    acType: '',
    rz: '',
    acTypeTitle: '',
    activityData: undefined,
    title: undefined
  },
  ThumbViewer: ({ data }) => (
    <div>
      <Fab color="primary">
        <i style={{ fontSize: '2em' }} className="fa fa-table" />
      </Fab>
      {data.title || data.acTypeTitle}
    </div>
  ),
  Viewer,
  Editor: Viewer,
  search: (data, search) =>
    data.title.toLowerCase().includes(search) ||
    data.content.toLowerCase().includes(search),
  disableDragging: true,
  duplicate
}: LearningItemT<{ title: string, content: string }>);
