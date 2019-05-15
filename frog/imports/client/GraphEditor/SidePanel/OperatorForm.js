// @flow
import * as React from 'react';
import jsonSchemaDefaults from 'json-schema-defaults';
import { observer } from 'mobx-react';
import ConfigForm from './ConfigForm';
import ChooseOperatorTypeComp from './OperatorPanel/ChooseOperator';
import EditClass from './OperatorPanel/EditOperator';
import type { OperatorDbT } from 'frog-utils';
import Store from '../store/store';
import { connect } from '../store';
const store = new Store();
const EditOperator = connect(EditClass);

type PropsT = {
  operator: OperatorDbT,
  onSelect?: Function,
  onConfigChange: Function
};

type StateT = {
  operator: OperatorDbT
};

const OperatorForm = observer(
  class O extends React.Component<PropsT, StateT> {
    constructor(props: PropsT) {
      super(props);
      this.state = {
        operator: this.props.operator
      };
    }

    render() {
      const { operator } = this.state;
      if (operator._id) return <EditOperator operator={operator} />;
      else return <ChooseOperatorTypeComp store={store} operator={operator} />;
    }
  }
);
export default OperatorForm;
