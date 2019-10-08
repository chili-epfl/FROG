// @flow

import React from 'react';

import FlexView from 'react-flexview';
import { yellow, red, lightGreen } from '@material-ui/core/colors';
import { compact } from 'lodash';

import { ChangeableText } from '/imports/frog-utils';

import { removeOperatorType } from '/imports/api/operators';
import { operatorTypesObj } from '/imports/operatorTypes';
import { ErrorList, ValidButton } from '../../Validator';
import { IconButton } from '../index';
import { type StoreProp } from '../../store';
import ConfigForm from '../ConfigForm';
import DeleteButton from '../DeleteButton';

const TopPanel = ({
  refreshValidate,
  operator,
  graphOperator,
  errorColor,
  operatorType,
  ui,
  canPreview
}) => (
  <div style={{ backgroundColor: '#eee' }}>
    <div style={{ position: 'absolute', left: -40, overflow: 'visible' }}>
      <ErrorList activityId={operator._id} />
    </div>
    <FlexView>
      <div>
        <h3>
          <ChangeableText
            value={graphOperator.title || ''}
            operatorId={operator._id}
            onChange={graphOperator.rename}
          />
        </h3>
      </div>
      <FlexView
        marginLeft="auto"
        style={{
          flexDirection: 'column',
          right: '2px'
        }}
      >
        <ValidButton activityId={operator._id} errorColor={errorColor} />
        {operatorType.meta.preview && canPreview && (
          <IconButton
            icon="glyphicon glyphicon-eye-open"
            tooltip="Preview"
            onClick={() => {
              ui.setShowPreview({
                operatorTypeId: operatorType.id,
                config: operator.data
              });
            }}
          />
        )}
        <DeleteButton
          tooltip="Reset operator"
          msg="Do you really want to remove the operator type, and loose all the configuration data?"
          onConfirmation={() => {
            removeOperatorType(operator._id);
            refreshValidate();
          }}
        />
      </FlexView>
    </FlexView>
    <font size={-3}>
      <i>
        {`Type: ${operatorType.meta.name}
                 (${operator.operatorType})`}
      </i>
    </font>
    <hr />
  </div>
);

export default ({
  store: {
    ui,
    graphErrors,
    refreshValidate,
    valid,
    operatorStore: { all },
    connectionStore: { all: connections },
    activityStore: { all: activities }
  },
  operator
}: StoreProp & {
  operator: Object
}) => {
  const graphOperator = all.find(act => act.id === operator._id);
  const operatorType = operatorTypesObj[operator.operatorType];
  if (!graphOperator || !operatorType) return null;

  let errorColor;
  const errors = graphErrors.filter(x => x.id === operator._id);
  const error = errors.filter(x => x.severity === 'error');
  const warning = errors.filter(x => x.severity === 'warning');
  if (error.length > 0) {
    errorColor = red[500];
  } else if (warning.length > 0) {
    errorColor = yellow[500];
  } else {
    errorColor = lightGreen[500];
  }

  const outgoingConnections = connections.filter(
    conn => conn.source.id === operator._id
  );
  const incomingConnections = connections.filter(
    conn => conn.target.id === operator._id
  );
  const connectedTargetActivities = compact(
    outgoingConnections.map(x => activities.find(act => act.id === x.target.id))
  );
  const connectedSourceActivities = compact(
    incomingConnections.map(
      x =>
        activities.find(act => act.id === x.source.id) ||
        all.find(act => act.id === x.source.id)
    )
  );
  return (
    <div style={{ height: '100%', overflowY: 'scroll', position: 'relative' }}>
      <TopPanel
        {...{
          refreshValidate,
          operator,
          graphOperator,
          errorColor,
          canPreview: error.length === 0,
          operatorType,
          ui
        }}
      />
      <ConfigForm
        key={operator._id}
        node={operator}
        nodeType={operatorType}
        valid={valid}
        connectedActivities={activities}
        connectedSourceActivities={connectedSourceActivities}
        connectedTargetActivities={connectedTargetActivities}
        refreshValidate={refreshValidate}
        reload={
          (connectedSourceActivities || []).map(x => x.id).join('') +
          (connectedTargetActivities || []).map(x => x.id).join('')
        }
      />
    </div>
  );
};
