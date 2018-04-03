// @flow

import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Graphs } from '/imports/api/graphs';
import { connect } from '../../store';

import EditClass from './EditOperator';
import ChooseOperatorTypeComp from './ChooseOperator';

const EditOperator = connect(EditClass);
const ChooseOperatorType = connect(ChooseOperatorTypeComp);

export default withTracker(({ graphId, id }) => ({
  operator: Graphs.findOne({ _id: graphId }).operators.find(x => x.id === id)
}))(({ graphId, operator }) => {
  if (!operator) {
    return null;
  }
  if (operator.operatorType) {
    return <EditOperator operator={operator} />;
  } else {
    return <ChooseOperatorType {...{ graphId, operator }} />;
  }
});
