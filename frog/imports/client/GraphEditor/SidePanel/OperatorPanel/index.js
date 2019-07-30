// @flow

import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Operators } from '/imports/api/operators';
import { connect } from '../../store';

import EditClass from './EditOperator';
import ChooseOperatorTypeComp from './ChooseOperator';

export default connect(
  withTracker(({ id }) => ({
    operator: Operators.findOne(id)
  }))(({ operator, store }) => {
    if (!operator) {
      return null;
    }
    if (operator.operatorType) {
      return <EditClass operator={operator} store={store} />;
    } else {
      return <ChooseOperatorTypeComp operator={operator} store={store} />;
    }
  })
);
