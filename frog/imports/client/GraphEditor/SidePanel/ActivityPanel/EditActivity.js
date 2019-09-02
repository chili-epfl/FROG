// @flow

import * as React from 'react';
import FlexView from 'react-flexview';
import ReactTooltip from 'react-tooltip';
import { FormGroup, FormControl } from 'react-bootstrap';
import { yellow, red, lightGreen } from '@material-ui/core/colors';
import copy from 'copy-to-clipboard';
import { withState, compose } from 'recompose';
import { ChangeableText, A, uuid } from '/imports/frog-utils';
import { compact, isEmpty } from 'lodash';

import { activityTypesObj } from '/imports/activityTypes';
import {
  addActivity,
  removeActivityType,
  setStreamTarget,
  setParticipation,
  storeTemplateData
} from '/imports/api/activities';

import { connect } from '../../store';
import { ErrorList, ValidButton } from '../../Validator';
import { RenameField } from '../../Rename';
import FileForm from '../fileUploader';
import ExportButton from './ExportButton';
import { SelectAttributeWidget } from '../FormUtils';
import ConfigForm from '../ConfigForm';
import DeleteButton from '../DeleteButton';

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

const SelectParticipationMode = ({ activity, onChange }) => (
  <FormGroup controlId="participationGrouping">
    <FormControl
      onChange={e => onChange(e.target.value)}
      componentClass="select"
      value={activity.participationMode || 'everyone'}
    >
      <option value="everyone">Everyone participate equally</option>
      <option value="readonly">
        Only teacher edits, students have read-only views
      </option>
      <option value="projector">
        {"Only displayed in teacher's projector mode"}
      </option>
    </FormControl>
  </FormGroup>
);

const copyURL = activity => {
  const configStr = activity.data
    ? `config=${encodeURIComponent(JSON.stringify(activity.data))}&`
    : '';
  const url = `${window.location.protocol}//${window.location.hostname}${
    window.location.port ? ':' + window.location.port : ''
  }/api/activityType/${activity.activityType}?${configStr}instance_id=1`;
  copy(url);
  // eslint-disable-next-line no-alert
  window.alert(
    'Pre-configured URL for headless FROG has been copied to your clipboard'
  );
};

const RawEditActivity = ({
  advancedOpen,
  setAdvancedOpen,
  reload,
  setReload,
  activity,
  madeChanges,
  store
}) => {
  const graphActivity = store.activityStore.all.find(
    act => act.id === activity._id
  );
  const outgoingConnections = store.connectionStore.all.filter(
    conn => conn.source.id === activity._id
  );
  const incomingConnections = store.connectionStore.all.filter(
    conn => conn.target.id === activity._id
  );
  const connectedTargetActivities = compact(
    outgoingConnections.map(x =>
      store.activityStore.all.find(act => act.id === x.target.id)
    )
  );
  const connectedSourceActivities = compact(
    incomingConnections.map(
      x =>
        store.activityStore.all.find(act => act.id === x.source.id) ||
        store.operatorStore.all.find(act => act.id === x.source.id)
    )
  );

  // if no grouping key, and incoming social role, automatically assign first one
  if (
    (!activity.groupingKey || activity.groupingKey === '') &&
    store.valid.social[activity._id] &&
    store.valid.social[activity._id].length > 0 &&
    activity.plane === 2
  ) {
    addActivity(
      activity.activityType,
      null,
      activity._id,
      null,
      store.valid.social[activity._id][0]
    );
  }

  let errorColor;
  const errors = store.graphErrors.filter(x => x.id === activity._id);
  const error = errors.filter(x => x.severity === 'error');
  const warning = errors.filter(x => x.severity === 'warning');
  if (error.length > 0) {
    errorColor = red[500];
  } else if (warning.length > 0) {
    errorColor = yellow[500];
  } else {
    errorColor = lightGreen[500];
  }

  const activityType = activityTypesObj[activity.activityType];
  if (!activityType) {
    return <h3>No such installed activity type {activity.activityType}</h3>;
  }
  const otherActivityIds = store.activityStore.all.filter(
    a => a.id !== activity._id
  );
  return (
    // $FlowFixMe
    <div className="bootstrap" style={{ height: '100%', overflowY: 'scroll' }}>
      <div
        style={{
          backgroundColor: '#eee',
          minHeight: '110px',
          padding: '0 10px'
        }}
      >
        <div style={{ position: 'absolute', left: -40 }}>
          <ErrorList activityId={activity._id} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <FlexView style={{ flexDirection: 'column' }}>
            <h3>
              <ChangeableText
                EditComponent={RenameField}
                activityId={activity._id}
                value={graphActivity.title}
              />
            </h3>
            <font size={-3}>
              <i>
                {`Type: ${activityType.meta.name}
                         (${activity.activityType})`}
                <br />
                {`Starting after ${graphActivity.startTime} min., running for ${graphActivity.length} min.`}
              </i>
              {activity.template && !isEmpty(activity.template) && (
                <>
                  <br />
                  Activity has data template.{' '}
                  <A
                    onClick={() => {
                      store.ui.setShowPreview({
                        activityTypeId: activity.activityType,
                        activityId: activity._id,
                        config: activity.data,
                        template: activity.template
                      });
                    }}
                  >
                    Show
                  </A>{' '}
                  -{' '}
                  {!isEmpty(activity.template.lis) && (
                    <>
                      <A
                        onClick={() => {
                          storeTemplateData(activity._id, {
                            ...activity.template,
                            duplicate: !activity.template.duplicate
                          });
                        }}
                      >
                        {activity.template.duplicate
                          ? 'Duplicate LIs'
                          : 'LIs are shared'}
                      </A>{' '}
                      (click to toggle) -
                    </>
                  )}
                  <A
                    onClick={() => {
                      storeTemplateData(activity._id, {});
                    }}
                  >
                    Remove
                  </A>
                </>
              )}
            </font>
          </FlexView>
          <FlexView
            marginLeft="auto"
            style={{
              flexDirection: 'column',
              right: '2px'
            }}
          >
            <div style={{ zIndex: '1000', position: 'relative', left: '5px' }}>
              <ValidButton activityId={activity._id} errorColor={errorColor} />
            </div>
            {errorColor === lightGreen[500] && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <ExportButton {...{ activity, madeChanges }} />
              </div>
            )}
            <DeleteButton
              tooltip="Reset activity"
              msg="Do you really want to remove the activity type, and loose all the configuration data?"
              onConfirmation={() => {
                removeActivityType(activity._id);
                store.refreshValidate();
              }}
            />
          </FlexView>
        </div>
        {activity.plane === 2 && (
          <SelectAttributeWidget
            activity={activity}
            onChange={grp => {
              addActivity(activity.activityType, null, activity._id, null, grp);
              store.refreshValidate();
            }}
          />
        )}
        {activity.plane === 3 && (
          <SelectParticipationMode
            activity={activity}
            onChange={e => setParticipation(activity._id, e)}
          />
        )}
      </div>
      <ConfigForm
        key={'conf' + activity._id}
        node={activity}
        nodeType={activityType}
        valid={store.valid}
        refreshValidate={store.refreshValidate}
        connectedActivities={otherActivityIds}
        connectedSourceActivities={connectedSourceActivities}
        connectedTargetActivities={connectedTargetActivities}
        reload={
          reload +
          (connectedSourceActivities || []).map(x => x.id).join('') +
          (connectedTargetActivities || []).map(x => x.id).join('')
        }
      />
      {activityType.ConfigComponent && (
        <activityType.ConfigComponent
          key={activity._id}
          formContext={{
            connectedActivities: otherActivityIds,
            connectedSourceActivities,
            connectedTargetActivities
          }}
          configData={{ component: {}, ...activity.data }}
          setConfigData={d => {
            addActivity(
              activity.activityType,
              { ...activity.data, component: d },
              activity._id,
              null
            );
            store.refreshValidate();
            setReload(uuid());
          }}
        />
      )}
      <A onClick={() => setAdvancedOpen(!advancedOpen)}>Advanced...</A>
      {(advancedOpen || activity.streamTarget) && (
        <React.Fragment>
          <div>
            <A onClick={() => copyURL(activity)}>
              Copy link for headless FROG to clipboard
            </A>
            <br />
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
      <ReactTooltip />
    </div>
  );
};

const EditActivity = compose(
  withState('advancedOpen', 'setAdvancedOpen', false),
  withState('reload', 'setReload', uuid()),
  withState('modalOpen', 'setModal', false)
)(RawEditActivity);
export default connect(EditActivity);
