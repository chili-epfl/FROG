// @flow

import React from 'react';

import FlexView from 'react-flexview';
import { yellow, red, lightGreen } from '@material-ui/core/colors';
import { ChangeableText } from 'frog-utils';

import { removeOperatorType } from '/imports/api/activities';
import { operatorTypesObj } from '/imports/operatorTypes';
import { IconButton } from '../index';
import { ErrorList, ValidButton } from '../../Validator';
import { type StoreProp } from '../../store';
import ConfigForm from '../ConfigForm';
import DeleteButton from '../DeleteButton';

const TopPanel = ({
  refreshValidate,
  operator,
  graphOperator,
  errorColor,
  operatorType,
  ui
}) => (
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
      <FlexView
        marginLeft="auto"
        style={{
          flexDirection: 'column',
          position: 'absolute',
          right: '2px'
        }}
      >
        <ValidButton activityId={operator._id} errorColor={errorColor} />
        {operatorType.meta.preview && (
          <IconButton
            icon="glyphicon glyphicon-eye-open"
            tooltip="Preview"
            onClick={() => {
              ui.setShowPreview({
                operatorTypeId: operatorType.id,
                config: graphOperator.data
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
    graphErrors,
    refreshValidate,
    valid,
    operatorStore: { all },
    connectionStore: { all: connections },
    activityStore: { all: activities },
    ui
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
    errorColor = red[500];
  } else if (warning.length > 0) {
    errorColor = yellow[500];
  } else {
    errorColor = lightGreen[500];
  }

  return (
    <div style={{ height: '100%', overflowY: 'scroll', position: 'relative' }}>
      <TopPanel
        {...{
          refreshValidate,
          operator,
          graphOperator,
          errorColor,
          operatorType,
          graphOperator,
          ui
        }}
      />
      <ConfigForm
        key={operator._id}
        node={operator}
        type="operator"
        nodeType={operatorType}
        valid={valid}
        refreshValidate={refreshValidate}
      />
    </div>
  );
};
