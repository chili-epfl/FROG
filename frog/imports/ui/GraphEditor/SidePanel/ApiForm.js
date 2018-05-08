// @flow

import * as React from 'react';
import { hideConditional, type ActivityDbT } from 'frog-utils';
import { extendObservable, action } from 'mobx';
import { observer } from 'mobx-react';

import { activityTypesObj } from '/imports/activityTypes';
import validateConfig from '/imports/api/validateConfig';
import { removeActivity } from '/imports/api/remoteActivities';
import { ShowErrorsRaw, ValidButtonRaw } from '../Validator';
import ConfigForm from './ConfigForm';
import { ChooseActivityType } from './ActivityPanel/ChooseActivity';
import ModalDelete from '../RemoteControllers/ModalDelete';
import Store from '../store/store';

const store = new Store();

const ConfigComponent = ({ activityTypeId, config, setConfig }) => {
  const aT = activityTypesObj[activityTypeId];
  if (!aT || !aT.ConfigComponent) {
    return null;
  }
  return (
    <aT.ConfigComponent
      configData={{ component: {}, invalid: false, ...config }}
      setConfigData={d =>
        setConfig({ ...config, invalid: false, component: d })
      }
      formContext={{}}
    />
  );
};

export const check = (
  activityType: string,
  formData: Object,
  setValid?: Function,
  onConfigChange?: Function
) => {
  const aT = activityTypesObj[activityType];
  const valid = validateConfig(
    'activity',
    '1',
    hideConditional(formData, aT.config, aT.configUI),
    aT.config,
    aT.validateConfig,
    aT.configUI
  );
  if (setValid) {
    setValid(valid);
  }
  if (onConfigChange) {
    onConfigChange({
      activityType,
      config: { ...formData, invalid: valid.length > 0 },
      errors: valid,
      invalid: valid.length > 0
    });
  } else {
    window.parent.postMessage(
      {
        type: 'frog-config',
        activityType,
        config: { ...formData, invalid: valid.length > 0 },
        errors: valid,
        valid: valid.length === 0
      },
      '*'
    );
  }
};

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
    check(
      this.aT.id,
      this.state.formData,
      this.props.setValid,
      this.props.onConfigChange
    );
  }

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
              this.setState(
                {
                  formData: {
                    ...e.formData,
                    component: this.state.formData.component
                  }
                },
                () =>
                  check(
                    this.aT.id,
                    this.state.formData,
                    this.props.setValid,
                    this.props.onConfigChange
                  )
              );
            }}
            nodeType={this.aT}
            valid={{ social: [] }}
            refreshValidate={() => {}}
          />
        </div>
        <ConfigComponent
          activityTypeId={this.aT.id}
          config={this.props.config}
          setConfig={e => {
            this.setState({ formData: { ...this.state.formData, ...e } }, () =>
              check(
                this.aT.id,
                this.state.formData,
                this.props.setValid,
                this.props.onConfigChange
              )
            );
          }}
        />
      </div>
    );
  }
}

type PropsT = {
  activityType: string,
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
    { activity: ActivityDbT, idRemove: string, deleteOpen: boolean }
  > {
    constructor(props) {
      super(props);
      const activity: ActivityDbT = {
        _id: '1',
        activityType: this.props.activityType,
        data: this.props.config || {},
        plane: 1,
        startTime: 0,
        length: 5
      };
      this.state = { activity, idRemove: '', deleteOpen: false };
    }

    componentWillReceiveProps = nextprops => {
      if (
        this.props.activityType !== nextprops.activityType ||
        this.props.config !== nextprops.config
      ) {
        if (nextprops.activityType) {
          check(nextprops.activityType, nextprops.config || {}, state.setValid);
        }
        this.setState({
          activity: {
            _id: '1',
            activityType: nextprops.activityType,
            data: nextprops.config || {},
            plane: 1,
            startTime: 0,
            length: 5
          }
        });
      }
    };

    render() {
      return (
        <div>
          {this.state.activity.activityType ? (
            <div>
              <div
                style={{
                  position: 'relative',
                  marginRight: '20px'
                }}
              >
                <Config
                  onConfigChange={this.props.onConfigChange}
                  activity={this.state.activity}
                  setValid={state.setValid}
                  reload={this.props.reload}
                  config={this.props.config || {}}
                />
              </div>
              {!this.props.hideValidator && (
                <div
                  style={{ position: 'absolute', right: '20px', top: '10px' }}
                >
                  <Valid />
                </div>
              )}
            </div>
          ) : (
            <div style={{ position: 'absolute', marginRight: '20px' }}>
              <ModalDelete
                modalOpen={this.state.deleteOpen}
                setModal={x => this.setState({ deleteOpen: x })}
                remove={() =>
                  removeActivity(this.state.idRemove, () => this.forceUpdate())
                }
              />
              <ChooseActivityType
                setDelete={x => this.setState({ deleteOpen: x })}
                setIdRemove={x => this.setState({ idRemove: x })}
                store={store}
                activity={this.state.activity}
                hidePreview={this.props.hidePreview}
                onPreview={this.props.onPreview}
                onSelect={e => {
                  if (this.props.onSelect) {
                    this.props.onSelect(e.id);
                  }
                  this.setState({
                    activity: {
                      _id: '1',
                      activityType: e.id,
                      data: {},
                      plane: 1,
                      startTime: 0,
                      length: 5
                    }
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

ApiForm.displayName = 'ApiForm';

const Valid = observer(() => (
  <ValidButtonRaw
    setShowErrors={state.setShow}
    errorColor={state.valid.length > 0 ? 'red' : 'green'}
  />
));

const Errors = observer(() => (
  <React.Fragment>
    {state.showErrors ? (
      <div
        style={{
          position: 'absolute',
          top: '25px',
          right: '90px'
        }}
      >
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
