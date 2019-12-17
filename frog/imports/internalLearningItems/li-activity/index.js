// @flow

import * as React from 'react';
import { Meteor } from 'meteor/meteor';

import { Fab } from '@material-ui/core';
import { activityTypesObj } from '/imports/activityTypes';
import { type LearningItemT, isBrowser } from '/imports/frog-utils';
import { getUsername } from '/imports/api/users';

type liDataT = {
  acType: string,
  rz: string,
  acTypeTitle: string,
  activityData: ?Object,
  title: ?string
};

let activityRunners = {};
let ReactiveHOC;
if (isBrowser) {
  activityRunners = require('/imports/client/activityRunners').activityRunners;
  ReactiveHOC = require('/imports/client/StudentView/ReactiveHOC').default;
}

const Viewer = ({ data }: { data: liDataT }) => {
  if (!data.acType) {
    return <p>No activity type has been selected.</p>;
  }

  if (!ReactiveHOC) {
    return <p>Could not import Reactive Component</p>;
  }

  const acRunnerId = data.acType.startsWith('li-')
    ? 'ac-single-li'
    : data.acType;
  const activityType = activityTypesObj[acRunnerId];
  const ActivityToRun = ReactiveHOC(data.rz, undefined)(
    activityRunners[acRunnerId]
  );

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <ActivityToRun
        activityType={activityType.id}
        activityData={data.activityData || {}}
        activityId={data.rz}
        username={getUsername()}
        userid={Meteor.userId()}
        userInfo={{ name: getUsername(), id: Meteor.userId() }}
        stream={() => undefined}
        logger={() => undefined}
        groupingValue={{}}
        sessionId=""
      />
    </div>
  );
};

export default ({
  name: 'FROG Activity',
  id: 'li-activity',
  dataStructure: {
    acType: '',
    rz: '',
    acTypeTitle: '',
    activityData: undefined,
    title: undefined
  },
  ThumbViewer: ({ data }: { data: liDataT }) => (
    <div>
      <Fab color="primary">
        <i style={{ fontSize: '2em' }} className="fa fa-table" />
      </Fab>
      {data.title || data.acTypeTitle}
    </div>
  ),
  Viewer,
  Editor: Viewer,
  disableDragging: true
}: LearningItemT<liDataT>);
