// @flow
import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Form from 'react-jsonschema-form';
import { ChangeableText } from 'frog-utils';
import { withState, compose } from 'recompose';

import { Activities, addActivity } from '/imports/api/activities';
import Preview from '../Preview';
import { activityTypes, activityTypesObj } from '/imports/activityTypes';
import { RenameField } from '../Rename';
import { connect } from '../store';
import FileForm from './fileUploader';
import ListComponent from './ListComponent';

const ChooseActivityTypeComp = compose(
  withState('expanded', 'setExpand', null),
  withState('showInfo', 'setShowInfo', null)
)(
  ({
    activity,
    store: { addHistory },
    expanded,
    setExpand,
    showInfo,
    setShowInfo
  }) => {
    const select = activityType => {
      Activities.update(activity._id, {
        $set: { activityType: activityType.id }
      });
      addHistory();
    };

    return (
      <div style={{ height: '100%' }}>
        <h4>Please select activity type</h4>
        <div
          className="list-group"
          style={{ height: '730px', width: '100%', overflow: 'scroll' }}
        >
          {activityTypes.map(x =>
            <ListComponent
              onSelect={() => select(x)}
              showExpanded={expanded === x.id}
              expand={() => setExpand(x.id)}
              key={x.id}
              onPreview={() => setShowInfo(x.id)}
              object={x}
              eventKey={x.id}
            />
          )}
        </div>
        {showInfo !== null &&
          <Preview
            activityTypeId={showInfo}
            dismiss={() => setShowInfo(null)}
          />}
      </div>
    );
  }
);

const EditClass = props => {
  const activity = props.activity;
  const graphActivity = props.store.activityStore.all.find(
    act => act.id === activity._id
  );

  return (
    <div>
      <div style={{ backgroundColor: '#eee' }}>
        <h3>
          <ChangeableText
            EditComponent={RenameField}
            activityId={activity._id}
            value={graphActivity.title}
            onChange={grp =>
              addActivity(activity.activityType, null, activity._id, grp)}
          />
        </h3>
        <font size={-3}>
          <i>
            {`Type: ${activityTypesObj[activity.activityType].meta.name}
                     (${activity.activityType})`}
            <br />
            {`Starting after ${graphActivity.startTime} min., running for ${graphActivity.length} min.`}
          </i>
        </font>
        {activity.plane === 2 &&
          <div>
            Group by attribute:{' '}
            <ChangeableText
              value={activity.groupingKey}
              onChange={grp =>
                addActivity(activity.activityType, null, activity._id, grp)}
            />
          </div>}
        <hr />
      </div>
      <Form
        schema={activityTypesObj[activity.activityType].config}
        onChange={data => {
          addActivity(
            activity.activityType,
            data.formData,
            activity._id,
            null,
            data.errors.length > 0
          );
        }}
        formData={activity.data}
        liveValidate
      >
        <div />
      </Form>
      <FileForm />
    </div>
  );
};

const EditActivity = connect(EditClass);
const ChooseActivityType = connect(ChooseActivityTypeComp);

export default createContainer(
  ({ id }) => ({ activity: Activities.findOne(id) }),
  ({ activity }) => {
    if (activity.activityType && activity.activityType !== '') {
      return <EditActivity activity={activity} />;
    } else {
      return <ChooseActivityType activity={activity} />;
    }
  }
);
