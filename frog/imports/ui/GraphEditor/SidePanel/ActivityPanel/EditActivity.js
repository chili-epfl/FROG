// @flow

import * as React from 'react';
import FlexView from 'react-flexview';
import ReactTooltip from 'react-tooltip';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { yellow, red, lightGreen } from 'material-ui/colors';
import copy from 'copy-to-clipboard';
import { withState, compose } from 'recompose';
import { ChangeableText, A, uuid } from 'frog-utils';

import { activityTypesObj } from '/imports/activityTypes';
import {
  addActivity,
  setStreamTarget,
  setParticipation
} from '/imports/api/activities';
import { connect } from '../../store';
import Modal from '../ModalExport';
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
  modalOpen,
  setModal,
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
    errorColor = red[500];
  } else if (warning.length > 0) {
    errorColor = yellow[500];
  } else {
    errorColor = lightGreen[500];
  }

  const activityType = activityTypesObj[activity.activityType];
  const otherActivityIds = props.store.activityStore.all.filter(
    a => a.id !== activity._id
  );
  return (
    <div style={{ height: '100%', overflowY: 'scroll', position: 'relative' }}>
      <Modal {...{ modalOpen, setModal, activity }} />
      <div style={{ backgroundColor: '#eee', minHeight: '110px' }}>
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
                onChange={grp =>
                  addActivity(activity.activityType, null, activity._id, grp)
                }
              />
            </h3>
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
          </FlexView>
          <FlexView
            marginLeft="auto"
            style={{
              flexDirection: 'column',
              position: 'absolute',
              right: '2px'
            }}
          >
            <ValidButton activityId={activity._id} errorColor={errorColor} />
            {errorColor === lightGreen[500] && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <IconButton
                  icon="glyphicon glyphicon-eye-open"
                  onClick={() => {
                    props.store.ui.setShowPreview({
                      activityTypeId: activity.activityType,
                      config: activity.data
                    });
                  }}
                />
                <IconButton
                  icon="glyphicon glyphicon-share"
                  onClick={() => setModal(true)}
                />
                <IconButton
                  icon="glyphicon glyphicon-link"
                  legend="Embed config in link to headless FROG"
                  onClick={() => copyURL(activity)}
                />
              </div>
            )}
          </FlexView>
        </div>
        {activity.plane === 2 && (
          <SelectAttributeWidget
            activity={activity}
            onChange={grp => {
              addActivity(activity.activityType, null, activity._id, grp);
              props.store.refreshValidate();
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
      <ReactTooltip delayShow={1000} />
    </div>
  );
};

const IconButton = ({ icon, legend, onClick }: Object) => (
  <Button
    style={{ width: '35px', height: '25px' }}
    data-tip={legend}
    onClick={onClick}
  >
    <span className={icon} style={{ verticalAlign: 'top' }} />
  </Button>
);

const EditActivity = compose(
  withState('advancedOpen', 'setAdvancedOpen', false),
  withState('reload', 'setReload', uuid()),
  withState('modalOpen', 'setModal', false)
)(RawEditActivity);
export default connect(EditActivity);
