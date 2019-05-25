// @flow
import * as React from 'react';
import jsonSchemaDefaults from 'json-schema-defaults';
import { hideConditional } from 'frog-utils';
import { observer } from 'mobx-react';
import type { OperatorDbT } from 'frog-utils';
import { extendObservable, action } from 'mobx';
import FlexView from 'react-flexview';
import { operatorTypesObj } from '/imports/operatorTypes';
import validateConfig from '/imports/api/validateConfig';
import { ShowErrorsRaw, ValidButtonRaw } from '../Validator';
import Store from '../store/store';
import DeleteButton from './DeleteButton';
import ChooseOperatorTypeComp from './OperatorPanel/ChooseOperator';
import ConfigForm from './ConfigForm';

const store = new Store();

export const check = (
  operatorType: string,
  formData: Object,
  setValid?: Function,
  onConfigChange?: Function
) => {
  const oT = operatorTypesObj[operatorType];
  if (!oT) {
    return;
  }
  const valid = validateConfig(
    'operator',
    '1',
    hideConditional(formData, oT.config, oT.configUI),
    oT.config,
    oT.validateConfig,
    oT.configUI
  );
  if (setValid) {
    setValid(valid);
  }
  if (onConfigChange) {
    onConfigChange({
      operatorType,
      config: { ...formData, invalid: valid.length > 0 },
      errors: valid,
      invalid: valid.length > 0
    });
  }
};

type PropsT = {
  operatorType: string,
  onSelect?: Function,
  onConfigChange: Function,
  operatorTypesList?: Object,
  operatorMappings?: Object,
  categories?: string[]
};

type StateT = {
  operator: OperatorDbT,
  test: boolean
};

class State {
  showErrors: boolean;

  valid: any[];

  setShow: Function;

  setValid: Function;

  constructor() {
    extendObservable(this, {
      showErrors: false,
      valid: [],
      setShow: action(e => {
        this.showErrors = e;
      }),
      setValid: action(e => (this.valid = e))
    });
  }
}

const state = new State();

const OperatorForm = observer(
  class O extends React.Component<PropsT, StateT> {
    constructor(props: PropsT) {
      super(props);
      this.state = {
        operatorType: null,
        deleteOpen: false
      };
    }

    render() {
      const { operatorType } = this.state;
      if (operatorType) {
        return (
          <>
            <div>
              <FlexView
                marginLeft="auto"
                style={{
                  flexDirection: 'column',
                  position: 'absolute',
                  right: '2px'
                }}
              >
                <DeleteButton
                  tooltip="Reset activity"
                  msg="Do you really want to remove the activity type, and loose all the configuration data?"
                  onConfirmation={() => {
                    this.setState({
                      operatorType: null,
                      formData: null
                    });
                  }}
                />
                <Valid noOffset />
              </FlexView>
              <ConfigForm
                node={{
                  _id: 1,
                  operatorType: this.state.operatorType.id,
                  data: {}
                }}
                data={this.state.formData}
                nodeType={this.state.operatorType}
                valid={{ social: {} }}
                store={store}
                connectedActivities={[]}
                connectedSourceActivities={[]}
                connectedTargetActivities={[]}
                refreshValidate={() => null}
                onChange={e => {
                  this.setState(
                    {
                      formData: {
                        ...e.formData
                      }
                    },
                    () => {
                      if (this.state.operatorType) {
                        check(
                          this.state.operatorType.id,
                          this.state.formData,
                          state.setValid,
                          this.props.onConfigChange
                        );
                      }
                    }
                  );
                }}
              />
            </div>
          </>
        );
      } else
        return (
          <ChooseOperatorTypeComp
            operator={{ type: 'product' }}
            store={store}
            operatorTypesList={this.props.operatorTypesList}
            operatorMappings={this.props.operatorMappings}
            categories={this.props.categories}
            onSelect={op => {
              this.setState(
                {
                  operatorType: op,
                  formData: jsonSchemaDefaults(op.config)
                },
                () => {
                  check(
                    this.state.operatorType.id,
                    this.state.formData,
                    state.setValid,
                    this.props.onConfigChange
                  );
                }
              );
            }}
          />
        );
    }
  }
);
const Valid = observer(({ noOffset }) => (
  <ValidButtonRaw
    setShowErrors={state.setShow}
    errorColor={state.valid.length > 0 ? 'red' : 'green'}
    noOffset={noOffset}
  />
));

Valid.displayName = 'Valid';

const Errors = observer(({ noOffset }) => (
  <>
    {state.showErrors ? (
      <div
        style={
          noOffset
            ? {
                position: 'absolute',
                top: '0px',
                left: '0px',
                zIndex: 99
              }
            : {
                position: 'absolute',
                left: '0px',
                top: '120px',
                zIndex: 99
              }
        }
      >
        <ShowErrorsRaw errors={state.valid} />
      </div>
    ) : null}
  </>
));

Errors.displayName = 'Errors';

const Container = (props: PropsT) => (
  <div>
    <OperatorForm {...props} />
    <Errors />
  </div>
);

export default Container;
