// @flow

import * as React from 'react';
import FlexView from 'react-flexview';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { withState, compose } from 'recompose';
import { ChangeableText, A, uuid } from 'frog-utils';

import { activityTypesObj } from '/imports/activityTypes';
import { addActivity, setStreamTarget } from '/imports/api/activities';
import { connect } from '../../store';
import { ErrorList, ValidButton } from '../../Validator';
import { RenameField } from '../../Rename';
import FileForm from '../fileUploader';
import { SelectAttributeWidget } from '../FormUtils';
import ConfigForm from '../ConfigForm';

const StreamSelect = ({ activity, targets, onChange }) => (
  <FormGroup controlId="selectGrouping">
    <FormControl
      onChange={e => onChange(e.target.value)}
      componentClass="select"
      value={activity.streamTarget || 'undefined'}
    >
      {[{ id: 'undefined', title: 'Choose a target' }, ...targets].map(x => (
        <option value={x.id} key={x.id}>
          {x.title}
        </option>
      ))}
    </FormControl>
  </FormGroup>
);

const RawEditActivity = ({
  advancedOpen,
  setAdvancedOpen,
  reload,
  setReload,
  activity,
  ...props
}) => {
  const graphActivity = props.store.activityStore.all.find(
    act => act.id === activity._id
  );
  const outgoingConnections = props.store.connectionStore.all.filter(
    conn => conn.source.id === activity._id
  );

  // if no grouping key, and incoming social role, automatically assign first one
  if (
    (!activity.groupingKey || activity.groupingKey === '') &&
    props.store.valid.social[activity._id] &&
    props.store.valid.social[activity._id].length > 0 &&
    activity.plane === 2
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
  const otherActivityIds = props.store.activityStore.all.filter(
    a => a.id !== activity._id
  );
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
                  addActivity(activity.activityType, null, activity._id, grp)
                }
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
                onClick={() =>
                  props.store.ui.setShowPreview({
                    activityTypeId: activity.activityType,
                    config: activity.data
                  })
                }
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
            {`Starting after ${graphActivity.startTime} min., running for ${
              graphActivity.length
            } min.`}
          </i>
        </font>
        {activity.plane === 2 && (
          <SelectAttributeWidget
            activity={activity}
            onChange={grp => {
              addActivity(activity.activityType, null, activity._id, grp);
              props.store.refreshValidate();
            }}
          />
        )}
      </div>
      <ConfigForm
        node={activity}
        nodeType={activityType}
        valid={props.store.valid}
        refreshValidate={props.store.refreshValidate}
        connectedActivities={otherActivityIds}
        reload={reload + (outgoingConnections || []).map(x => x.id).join('')}
      />
      {activityType.ConfigComponent && (
        <activityType.ConfigComponent
          configData={{ component: {}, ...activity.data }}
          setConfigData={d => {
            addActivity(
              activity.activityType,
              { ...activity.data, component: d },
              activity._id,
              null
            );
            props.store.refreshValidate();
            setReload(uuid());
          }}
        />
      )}
      <A onClick={() => setAdvancedOpen(!advancedOpen)}>Advanced...</A>
      {advancedOpen && (
        <React.Fragment>
          <div>
            Select streaming target
            <StreamSelect
              activity={activity}
              targets={otherActivityIds}
              onChange={streamTarget =>
                setStreamTarget(activity._id, streamTarget)
              }
            />
          </div>
          <FileForm />
        </React.Fragment>
      )}
    </div>
  );
};

const EditActivity = compose(
  withState('advancedOpen', 'setAdvancedOpen', false),
  withState('reload', 'setReload', uuid())
)(RawEditActivity);
export default connect(EditActivity);
