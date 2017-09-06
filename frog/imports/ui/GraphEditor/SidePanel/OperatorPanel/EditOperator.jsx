// @flow

import React from 'react';

import FlexView from 'react-flexview';
import { ChangeableText } from 'frog-utils';

import { operatorTypesObj } from '/imports/operatorTypes';
import { ErrorList, ValidButton } from '../../Validator';
import { type StoreProp } from '../../store';
import ConfigForm from '../ConfigForm';

const TopPanel = ({ operator, graphOperator, errorColor, operatorType }) =>
  <div style={{ backgroundColor: '#eee' }}>
    <div style={{ position: 'absolute', left: -40 }}>
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
      <FlexView marginLeft="auto">
        <ValidButton activityId={operator._id} errorColor={errorColor} />
      </FlexView>
    </FlexView>
    <font size={-3}>
      <i>
        {`Type: ${operatorType.meta.name}
                 (${operator.operatorType})`}
      </i>
    </font>
    <hr />
  </div>;

export default ({
  store: {
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
  if (!graphOperator || !operatorType) return;

  let errorColor;
  const errors = graphErrors.filter(x => x.id === operator._id);
  const error = errors.filter(x => x.severity === 'error');
  const warning = errors.filter(x => x.severity === 'warning');
  if (error.length > 0) {
    errorColor = 'red';
  } else if (warning.length > 0) {
    errorColor = 'yellow';
  } else {
    errorColor = 'green';
  }

  const connectedNodesIds = connections
    .filter(con => con.source.id === operator._id)
    .map(con => con.target.id);
  const connectedActivities = activities.filter(act =>
    connectedNodesIds.includes(act.id)
  );
  return (
    <div style={{ height: '100%', overflowY: 'scroll', position: 'relative' }}>
      <TopPanel {...{ operator, graphOperator, errorColor, operatorType }} />
      <ConfigForm
        {...{
          operator,
          operatorType,
          valid,
          connectedActivities,
          refreshValidate
        }}
      />
    </div>
  );
};
