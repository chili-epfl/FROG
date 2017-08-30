// @flow
import React from 'react';
import { EnhancedForm, ChangeableText } from 'frog-utils';
import { addActivity } from '/imports/api/activities';
import { activityTypesObj } from '/imports/activityTypes';
import FlexView from 'react-flexview';
import { withState } from 'recompose';
import { Button } from 'react-bootstrap';

import { connect } from '../../store';
import Preview from '../../Preview';
import { ErrorList, ValidButton } from '../../Validator';
import { RenameField } from '../../Rename';
import FileForm from '../fileUploader';
import { SelectAttribute, SelectFormWidget } from './SelectWidget';
import addSocialFormSchema from './addSocialSchema';

const EditActivity = props => {
  const activity = props.activity;
  const graphActivity = props.store.activityStore.all.find(
    act => act.id === activity._id
  );

  // if no grouping key, and incoming social role, automatically assign first one
  if (
    (!activity.groupingKey || activity.groupingKey === '') &&
    props.store.valid.social[activity._id] &&
    props.store.valid.social[activity._id].length > 0
  ) {
    addActivity(
      activity.activityType,
      null,
      activity._id,
      props.store.valid.social[activity._id][0]
    );
  }

  let errorColor;
  const errors = props.store.graphErrors.filter(x => x.id === activity._id);
  const error = errors.filter(x => x.severity === 'error');
  const warning = errors.filter(x => x.severity === 'warning');
  if (error.length > 0) {
    errorColor = 'red';
  } else if (warning.length > 0) {
    errorColor = 'yellow';
  } else {
    errorColor = 'green';
  }

  const activityType = activityTypesObj[activity.activityType];

  return (
    <div style={{ height: '100%', overflowY: 'scroll', position: 'relative' }}>
      <div style={{ backgroundColor: '#eee' }}>
        <div style={{ position: 'absolute', left: -40 }}>
          <ErrorList activityId={activity._id} />
        </div>
        <FlexView>
          <div>
            <h3>
              <ChangeableText
                EditComponent={RenameField}
                activityId={activity._id}
                value={graphActivity.title}
                onChange={grp =>
                  addActivity(activity.activityType, null, activity._id, grp)}
              />
            </h3>
          </div>
          <FlexView marginLeft="auto">
            {errorColor === 'green' && (
              <Button
                className="glyphicon glyphicon-eye-open"
                style={{
                  position: 'absolute',
                  right: '2px',
                  top: '39px',
                  width: '9%',
                  height: '34px'
                }}
                onClick={() => props.setShowInfo(true)}
              />
            )}

            <ValidButton activityId={activity._id} errorColor={errorColor} />
          </FlexView>
        </FlexView>
        <font size={-3}>
          <i>
            {`Type: ${activityType.meta.name}
                     (${activity.activityType})`}
            <br />
            {`Starting after ${graphActivity.startTime} min., running for ${graphActivity.length} min.`}
          </i>
        </font>
        {activity.plane === 2 && (
          <SelectAttribute
            activity={activity}
            onChange={grp => {
              addActivity(activity.activityType, null, activity._id, grp);
              props.store.refreshValidate();
            }}
          />
        )}
      </div>
      {activityType.config &&
      activityType.config.properties &&
      activityType.config.properties !== {} && (
        <EnhancedForm
          {...addSocialFormSchema(activityType.config, activityType.configUI)}
          showErrorList={false}
          noHtml5Validate
          widgets={{ socialAttributeWidget: SelectFormWidget }}
          formContext={{
            options: props.store.valid.social[activity._id] || [],
            groupingKey: activity.groupingKey
          }}
          onChange={data => {
            addActivity(
              activity.activityType,
              data.formData,
              activity._id,
              null
            );
            props.store.refreshValidate();
          }}
          formData={activity.data}
        >
          <div />
        </EnhancedForm>
      )}
      <FileForm />
      {props.showInfo && (
        <Preview
          activityTypeId={activity.activityType}
          config={activity.data}
          dismiss={() => props.setShowInfo(false)}
        />
      )}
    </div>
  );
};

export default withState('showInfo', 'setShowInfo', false)(
  connect(EditActivity)
);
