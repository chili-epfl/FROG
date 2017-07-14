// @flow

import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { connect } from './store';
import { Activities, Operators, Connections } from '../../api/activities';
import { activityTypes } from '../../activityTypes';
import { operatorTypes } from '../../operatorTypes';

const checkVal = (obj: Array<any>, isAc) => {
  let valid = true;
  if (obj.length === 0) return true;
  const typeObj = isAc ? activityTypes : operatorTypes;

  for (let i = 0; i < obj.length && valid; i += 1) {
    const t = isAc ? obj[i].activityType : obj[i].operatorType;
    if (t === undefined) return false;
    const conf = typeObj.filter(x => x.id === t)[0].config.properties;
    if (Object.keys(conf).length !== 0) {
      if (obj[i].data === undefined) return false;
      valid =
        valid &&
        Object.keys(conf)
          .map(x => conf[x].type === 'boolean' || obj[i].data[x] !== undefined)
          .reduce((acc, n) => acc && n);
    }
  }
  return valid;
};

const checkConValidity = (cons: Array<any>) => true || cons;

const Validator = (props: {
  activities: Array<any>,
  operators: Array<any>,
  connections: Array<any>
}) => {
  // displayLog() {}
  const a = checkVal(props.activities, true);
  const o = checkVal(props.operators, false);
  const c = checkConValidity(props.connections);
  // console.log(a+' '+o+ ' '+c);
  return (
    <svg>
      <circle
        cx="35"
        cy="35"
        r="30"
        stroke="transparent"
        fill={a && o && c ? 'green' : 'red'}
      />
    </svg>
  );
};
//          onMouseOver={displayLog}

const ValidCC = createContainer(
  props => ({
    acts: Activities.find({ graphId: props.graphId }).fetch(),
    ops: Operators.find({ graphId: props.graphId }).fetch(),
    cons: Connections.find({ graphId: props.graphId }).fetch()
  }),
  props =>
    <Validator
      activities={props.acts}
      operators={props.ops}
      connections={props.cons}
    />
);

export default connect(({ store: { graphId } }) =>
  <ValidCC graphId={graphId} props />
);
