// @flow
import * as React from 'react';
import { hideConditional, type ActivityDbT } from 'frog-utils';
import { extendObservable, action } from 'mobx';
import { observer } from 'mobx-react';
import jsonSchemaDefaults from 'json-schema-defaults';

import { activityTypesObj } from '/imports/activityTypes';
import validateConfig from '/imports/api/validateConfig';
import { removeActivity } from '/imports/api/remoteActivities';
import { ShowErrorsRaw, ValidButtonRaw } from '../Validator';
import ConfigForm from './ConfigForm';
import ChooseActivityType from './ActivityPanel/ChooseActivity';
import ModalDelete from '../RemoteControllers/ModalDelete';
import Store from '../store/store';
import DeleteButton from './DeleteButton';

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
        config: { ...formData },
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
    this.aT =
      activityTypesObj[
        typeof props.activity.activityType === 'object'
          ? props.activity.activityType.activity_type
          : props.activity.activityType
      ];
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
            showSubmit={this.props.showSubmit}
            onSubmit={this.props.onSubmit}
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
  reload?: string,
  showDelete?: boolean,
  setActivityTypeId?: string,
  hideLibrary?: boolean,
  whiteList?: string[],
  noOffset?: boolean
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
      activity: Object,
      idRemove: Object,
      deleteOpen: boolean,
      whiteList?: string[]
    }
  > {
    activity: ActivityDbT = {
      _id: '1',
      activityType: this.props.activityType,
      data: this.props.config || {},
      plane: 1,
      startTime: 0,
      length: 5
    };

    constructor(props) {
      super(props);
      this.state = { activity: this.activity, idRemove: {}, deleteOpen: false };
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
      console.log(this.props);
      return (
        <>
          {this.state.activity.activityType ? (
            <div>
              <div style={{ position: 'absolute', right: '0px', top: '0px' }}>
                {!this.props.hideValidator && (
                  <Valid noOffset={this.props.noOffset} />
                )}
                {this.props.showDelete && (
                  <DeleteButton
                    tooltip="Reset activity"
                    msg="Do you really want to remove the activity type, and loose all the configuration data?"
                    onConfirmation={() => {
                      window.parent.postMessage(
                        {
                          type: 'frog-config',
                          activityType: undefined
                        },
                        '*'
                      );
                      this.setState({
                        activity: {
                          _id: '1',
                          data: {},
                          plane: 1,
                          startTime: 0,
                          length: 5
                        },
                        idRemove: {},
                        deleteOpen: false
                      });
                    }}
                  />
                )}
              </div>
              <div
                style={{
                  marginTop: '20px',
                  padding: '0 10px'
                }}
              >
                <Config
                  onConfigChange={this.props.onConfigChange}
                  activity={this.state.activity}
                  setValid={state.setValid}
                  reload={this.props.reload}
                  config={this.props.config || this.state.activity.data || {}}
                  showSubmit={this.props.showSubmit}
                  onSubmit={this.props.onSubmit}
                />
              </div>
            </div>
          ) : (
            <>
              <ModalDelete
                modalOpen={this.state.deleteOpen}
                setModal={x => this.setState({ deleteOpen: x })}
                remove={() =>
                  removeActivity(this.state.idRemove.id, () =>
                    this.forceUpdate()
                  )
                }
              />
              <ChooseActivityType
                hideLibrary={this.props.hideLibrary}
                setDelete={x => this.setState({ deleteOpen: x })}
                setIdRemove={x => this.setState({ idRemove: x })}
                whiteList={this.props.whiteList}
                store={store}
                setActivityTypeId={this.props.setActivityTypeId}
                activity={this.state.activity}
                hidePreview={this.props.hidePreview}
                onPreview={this.props.onPreview}
                onSelect={e => {
                  const obj =
                    typeof e.id === 'object'
                      ? {
                          activityType: e.id.activity_type,
                          config: e.id.config
                        }
                      : {
                          activityType: e.id,
                          config: jsonSchemaDefaults(e.config)
                        };

                  if (this.props.onSelect) {
                    this.props.onSelect(e.id);
                  }
                  this.setState({
                    activity: {
                      _id: '1',
                      activityType: obj.activityType,
                      data: obj.config,
                      plane: 1,
                      startTime: 0,
                      length: 5
                    }
                  });
                }}
              />
            </>
          )}
        </>
      );
    }
  }
);

ApiForm.displayName = 'ApiForm';

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
    <ApiForm {...props} />
    {!props.hideValidator && <Errors noOffset={props.noOffset} />}
  </div>
);

export default Container;
