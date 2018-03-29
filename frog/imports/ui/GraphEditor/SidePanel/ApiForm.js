// @flow

import * as React from 'react';
import { hideConditional, type ActivityDbT } from 'frog-utils';
import { extendObservable, action } from 'mobx';
import { observer } from 'mobx-react';

import { activityTypesObj } from '/imports/activityTypes';
import validateConfig from '/imports/api/validateConfig';
import { ShowErrorsRaw, ValidButtonRaw } from '../Validator';
import ConfigForm from './ConfigForm';
import { ChooseActivityType } from './ActivityPanel/ChooseActivity';
import Store from '../store/store';

const store = new Store();

type ConfigPropsT = {
  config: Object,
  activity: ActivityDbT,
  onConfigChange?: Function,
  setValid: Function,
  reload?: string
};

class Config extends React.Component<
  ConfigPropsT,
  { formData: Object, valid: any[] }
> {
  aT: any;

  constructor(props: ConfigPropsT) {
    super(props);
    this.state = {
      formData: this.props.config,
      valid: []
    };
    this.aT = activityTypesObj[this.props.activity.activityType || ''];
  }

  componentDidMount() {
    this.check();
  }

  check = _formData => {
    const formData = _formData || this.state.formData;
    const valid = validateConfig(
      'activity',
      '1',
      hideConditional(formData, this.aT.config, this.aT.configUI),
      this.aT.config,
      this.aT.validateConfig,
      this.aT.configUI
    );
    this.props.setValid(valid);
    if (this.props.onConfigChange) {
      this.props.onConfigChange({
        activityType: this.aT.id,
        config: formData,
        errors: valid
      });
    } else {
      window.parent.postMessage(
        {
          type: 'frog-config',
          activityType: this.aT.id,
          config: formData,
          errors: valid,
          valid: valid.length === 0
        },
        '*'
      );
    }
  };

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div>
          <ConfigForm
            node={this.props.activity}
            data={this.props.config}
            reload={this.props.reload}
            onChange={e => {
              this.setState({ formData: e.formData });
              this.check();
            }}
            nodeType={this.aT}
            valid={{ social: [] }}
            refreshValidate={() => {}}
          />
        </div>
      </div>
    );
  }
}

type PropsT = {
  activityType?: string,
  config?: Object,
  hideValidator?: boolean,
  onSelect?: Function,
  onPreview?: Function,
  onConfigChange?: Function,
  hidePreview?: boolean,
  reload?: string
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

const ApiForm = observer(
  class A extends React.Component<
    PropsT,
    {
      activity: {
        _id: string,
        activityType?: string,
        data?: Object
      }
    }
  > {
    constructor(props) {
      super(props);
      this.state = {
        activity: {
          _id: '1',
          activityType: this.props.activityType,
          data: this.props.config
        }
      };
    }

    componentWillReceiveProps = nextprops => {
      if (
        this.props.activityType !== nextprops.activityType ||
        this.props.config !== nextprops.config
      ) {
        this.setState({
          activity: {
            _id: '1',
            activityType: nextprops.activityType,
            data: nextprops.config
          }
        });
      }
    };

    render() {
      return (
        <div style={{ margin: '10px' }}>
          {this.state.activity.activityType ? (
            <div>
              <div style={{ position: 'absolute', top: '10px' }}>
                <Config
                  onConfigChange={this.props.onConfigChange}
                  activity={this.state.activity}
                  setValid={state.setValid}
                  reload={this.props.reload}
                  config={this.props.config || {}}
                />
              </div>
              {!this.props.hideValidator && (
                <div style={{ position: 'absolute', right: '20px' }}>
                  <Valid />
                </div>
              )}
            </div>
          ) : (
            <div style={{ position: 'absolute', top: '30px' }}>
              <ChooseActivityType
                store={store}
                activity={this.state.activity}
                hidePreview={this.props.hidePreview}
                onPreview={this.props.onPreview}
                onSelect={e => {
                  if (this.props.onSelect) {
                    this.props.onSelect(e.id);
                  }
                  this.setState({
                    activity: { _id: '1', activityType: e.id, config: {} }
                  });
                }}
              />
            </div>
          )}
        </div>
      );
    }
  }
);

const Valid = observer(() => (
  <ValidButtonRaw
    setShowErrors={state.setShow}
    errorColor={state.valid.length > 0 ? 'red' : 'green'}
  />
));

const Errors = observer(() => (
  <React.Fragment>
    {state.showErrors ? (
      <div style={{ position: 'absolute', top: '20px', right: '200px' }}>
        <ShowErrorsRaw errors={state.valid} />
      </div>
    ) : null}
  </React.Fragment>
));

const Container = (props: PropsT) => (
  <div>
    <ApiForm {...props} />
    {!props.hideValidator && <Errors />}
  </div>
);

export default Container;
