import * as React from 'react';
import Form from 'react-jsonschema-form';

import { withStyles } from '@material-ui/core/styles';
import { Fab, Button } from '@material-ui/core';
import { isBrowser } from 'frog-utils';
import { activityTypesObj } from '/imports/activityTypes';

import {
  type LearningItemT,
  ReactiveText,
  HighlightSearchText
} from 'frog-utils';

let activityRunners = {};
let ReactiveHOC = () => undefined;
if (isBrowser) {
  activityRunners = require('/imports/client/activityRunners').activityRunners;
  ReactiveHOC = require('/imports/client/StudentView/ReactiveHOC').default;
}

const styles = () => ({
  button: {
    float: 'right'
  },
  editorContainer: {
    display: 'flex',
    flexDirection: 'column'
  }
});

const Viewer = ({ data, type }) => {
  const activityType = activityTypesObj[data.acType];
  const ActivityToRun = ReactiveHOC(data.rz, undefined, type === 'view')(
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
    data.content.toLowerCase().includes(search)
}: LearningItemT<{ title: string, content: string }>);
