// @flow

import React from 'react';

import FlexView from 'react-flexview';
import { ChangeableText, EnhancedForm } from 'frog-utils';

import { addOperator } from '/imports/api/activities';
import { operatorTypesObj } from '/imports/operatorTypes';
import { ErrorList, ValidButton } from '../../Validator';
import { SelectFormWidget } from '../ActivityPanel/SelectWidget';
import addSocialFormSchema from '../ActivityPanel/addSocialSchema';
import { SelectActivityWidget } from '../SelectActivityWidget';
import { type StoreProp } from '../../store';

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
      </div>
      {operatorType.config &&
        operatorType.config.properties &&
        operatorType.config.properties !== {} &&
        <EnhancedForm
          {...addSocialFormSchema(operatorType.config, operatorType.configUI)}
          widgets={{
            socialAttributeWidget: SelectFormWidget,
            activityWidget: SelectActivityWidget
          }}
          formContext={{
            options: valid.social[operator._id] || [],
            connectedActivities
          }}
          onChange={data => {
            addOperator(operator.operatorType, data.formData, operator._id);
            refreshValidate();
          }}
          formData={operator.data}
        >
          <div />
        </EnhancedForm>}
    </div>
  );
};
