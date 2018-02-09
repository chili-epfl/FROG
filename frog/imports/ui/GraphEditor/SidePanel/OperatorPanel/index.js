// @flow

import * as React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Operators } from '/imports/api/activities';
import { connect } from '../../store';

import EditClass from './EditOperator';
import ChooseOperatorTypeComp from './ChooseOperator';

const EditOperator = connect(EditClass);
const ChooseOperatorType = connect(ChooseOperatorTypeComp);

export default createContainer(
  ({ id }) => ({ operator: Operators.findOne(id) }),
  ({ operator }) => {
    if (operator.operatorType && operator.operatorType !== '') {
      return <EditOperator operator={operator} />;
    } else {
      return <ChooseOperatorType operator={operator} />;
    }
  }
);
