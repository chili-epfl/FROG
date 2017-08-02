// @flow
import React from 'react';
import { EnhancedForm, ChangeableText } from 'frog-utils';
import { addActivity } from '/imports/api/activities';
import { activityTypesObj } from '/imports/activityTypes';

import { connect } from '../../store';
import { RenameField } from '../../Rename';
import FileForm from '../fileUploader';
import { SelectAttribute } from './SelectWidget';

const EditActivity = props => {
  const activity = props.activity;
  const graphActivity = props.store.activityStore.all.find(
    act => act.id === activity._id
  );

  // if no grouping key, and incoming social role, automatically assign first one
  if (
    !activity.groupingKey ||
    (activity.groupingKey === '' && props.store.valid[activity._id])
  ) {
    addActivity(
      activity.activityType,
      null,
      activity._id,
      props.store.valid[activity._id][0]
    );
  }

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
          <SelectAttribute
            activity={activity}
            onChange={grp =>
              addActivity(activity.activityType, null, activity._id, grp)}
          />}
      </div>
      <EnhancedForm
        schema={activityTypesObj[activity.activityType].config}
        UISchema={activityTypesObj[activity.activityType].configUI}
        onChange={data => {
          addActivity(
            activity.activityType,
            data.formData,
            activity._id,
            null,
            data.errors.length > 0
          );
          props.store.refreshValidate();
        }}
        formData={activity.data}
        liveValidate
      >
        <div />
      </EnhancedForm>
      <FileForm />
    </div>
  );
};

export default connect(EditActivity);
