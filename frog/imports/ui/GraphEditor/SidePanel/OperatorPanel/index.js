// @flow

import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Operators } from 'imports/api/operators';
import { connect } from '../../store';

import EditClass from './EditOperator';
import ChooseOperatorTypeComp from './ChooseOperator';

const EditOperator = connect(EditClass);
const ChooseOperatorType = connect(ChooseOperatorTypeComp);

export default withTracker(({ id }) => ({
  operator: Operators.findOne(id)
}))(({ operator }) => {
  if (!operator) {
    return null;
  }
  if (operator.operatorType) {
    return <EditOperator operator={operator} />;
  } else {
    return <ChooseOperatorType operator={operator} />;
  }
});
