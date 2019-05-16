// @flow
import * as React from 'react';
import jsonSchemaDefaults from 'json-schema-defaults';
import { observer } from 'mobx-react';
import ConfigForm from './ConfigForm';
import ChooseOperatorTypeComp from './OperatorPanel/ChooseOperator';
import EditOperator from './OperatorPanel/EditOperator';
import type { OperatorDbT } from 'frog-utils';
import Store from '../store/store';
import { connect } from '../store';

const store = new Store();

type PropsT = {
  operatorType: string,
  onSelect?: Function,
  onConfigChange: Function
};

type StateT = {
  operator: OperatorDbT,
  test: boolean
};

const OperatorForm = observer(
  class O extends React.Component<PropsT, StateT> {
    constructor(props: PropsT) {
      super(props);
      this.state = {
        operator: {
          _id: '19872319082371209387',
          type: this.props.operatorType,
          data: this.props
        },
        test: false
      };
    }
    componentWillReceiveProps = nextprop => {
      console.log(nextprop);
    };
    render() {
      console.log(store);
      const { operator, test } = this.state;
      if (test) {
        return <>Yas</>;
      }
      return (
        <ChooseOperatorTypeComp
          operator={operator}
          store={store}
          onSelect={op => {
            console.log('Called back');
            this.setState({ test: true });
          }}
        />
      );
    }
  }
);
export default OperatorForm;
