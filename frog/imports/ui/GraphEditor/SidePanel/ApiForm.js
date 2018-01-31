// @flow

import React, { Component } from 'react';
import { hideConditional, type ActivityDbT } from 'frog-utils';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

import { activityTypesObj } from '/imports/activityTypes';
import validateConfig from '/imports/api/validateConfig';
import { ShowErrorsRaw, ValidButtonRaw } from '../Validator';
import ConfigForm from './ConfigForm';
import { ChooseActivityType } from './ActivityPanel/ChooseActivity';

class Config extends Component {
  state: { formData: Object, valid: Object[] };
  aT: any;

  constructor(props: {
    activity: ActivityDbT,
    setValid: Function,
    config: Object
  }) {
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
            onChange={e => {
              this.setState({ formData: e.formData });
              this.check();
            }}
            nodeType={this.aT}
            valid={{ social: [] }}
          />
        </div>
      </div>
    );
  }
}

type PropsT = {
  activityType?: string,
  config?: Object,
  hideValidator?: boolean
};

class State {
  @observable showErrors: boolean = false;
  @observable valid: Object[] = [];
  setShow = action(e => {
    this.showErrors = e;
  });
  setValid = action(e => (this.valid = e));
}

const state = new State();

@observer
class ApiForm extends Component {
  props: PropsT;

  state: {
    activity: {
      id: string,
      activityType?: string
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      activity: {
        id: '1',
        activityType: this.props.activityType,
        data: this.props.config
      }
    };
  }

  render() {
    return (
      <div style={{ margin: '10px' }}>
        {this.state.activity.activityType ? (
          <div>
            <div style={{ position: 'absolute', top: '10px' }}>
              <Config
                activity={this.state.activity}
                setValid={state.setValid}
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
              activity={this.state.activity}
              hidePreview
              onSelect={e =>
                this.setState({
                  activity: { id: '1', activityType: e.id, config: {} }
                })
              }
            />
          </div>
        )}
      </div>
    );
  }
}

@observer
class Valid extends Component {
  render() {
    return (
      <ValidButtonRaw
        setShowErrors={state.setShow}
        errorColor={state.valid.length > 0 ? 'red' : 'green'}
      />
    );
  }
}

@observer
class Errors extends Component {
  render() {
    if (state.showErrors) {
      return (
        <div style={{ position: 'absolute', top: '20px', right: '200px' }}>
          <ShowErrorsRaw errors={state.valid} />
        </div>
      );
    } else {
      return null;
    }
  }
}

const Container = (props: PropsT) => (
  <div>
    <ApiForm {...props} />
    {!props.hideValidator && <Errors />}
  </div>
);

export default Container;
