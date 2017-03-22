// @flow
import React from 'react';

import { connect } from '../store';
import Activity from '../store/activity';
import Operator from '../store/operator';
import ActivityPanel from './ActivityPanel';
import OperatorPanel from './OperatorPanel';

export default connect(({ store: { ui: { selected } } }) => {
  if (!selected) {
    return null;
  }
  if (selected instanceof Activity) {
    return <ActivityPanel id={selected.id} />;
  } else if (selected instanceof Operator) {
    return <OperatorPanel id={selected.id} />;
  }
  return null;
});
