// @flow
import * as React from 'react';
import Form from 'react-jsonschema-form';
import { FormControl } from 'react-bootstrap';
import { activityTypesObj } from '../../activityTypes';
import { Activities } from '../../api/activities';

import { SelectAnyActivityWidget } from '../../ui/GraphEditor/SidePanel/FormUtils';

const SelectDashboard = ({ formContext, onChange, value = '' }: any) => (
  <span>
    {formContext && formContext.names ? (
      <FormControl
        onChange={e => onChange(e.target.value)}
        componentClass="select"
        value={value}
      >
        {['', ...((formContext && formContext.names) || [])].map(x => (
          <option value={x || ''} key={x || 'choose'}>
            {x === '' ? 'Select a dashboard' : x}
          </option>
        ))}
      </FormControl>
    ) : (
      <span style={{ color: 'red' }}>No dashboards available</span>
    )}
  </span>
);

type PropsT = {
  configData: Object,
  setConfigData: Object => void,
  formContext: Object
};

class ConfigComponent extends React.Component<PropsT, { formData: Object }> {
  constructor(props: PropsT) {
    super(props);
    this.state = { formData: this.props.configData };
  }

  render() {
    const activities =
      this.props.formContext && this.props.formContext.connectedActivities;
    const dashAct =
      activities &&
      activities.filter(x => {
        const act = Activities.findOne(x.id);
        return (
          act &&
          act.activityType &&
          activityTypesObj[act.activityType].dashboards
        );
      });

    const currAct =
      this.state.formData.component.activity &&
      Activities.findOne(this.state.formData.component.activity);

    const dash = currAct && activityTypesObj[currAct.activityType].dashboards;
    const names = dash && Object.keys(dash);
    return (
      <div style={{ marginTop: '20px' }}>
        <Form
          formData={this.state.formData.component}
          onChange={e => {
            this.props.setConfigData(e.formData);
            const formData = e.formData;
            if (
              !formData.dashboards ||
              formData.dashboards.length === 0 ||
              formData.activity !== this.state.formData.component.activity
            ) {
              formData.dashboards = [''];
            }
            this.setState({
              formData: { ...this.state.formData, component: formData }
            });
          }}
          schema={{
            type: 'object',
            properties: {
              activity: { type: 'string', title: 'Activity' },
              dashboards: {
                title: 'Dashboards',
                type: 'array',
                items: { type: 'string' }
              }
            }
          }}
          uiSchema={{
            activity: { 'ui:widget': SelectAnyActivityWidget },
            dashboards: { items: { 'ui:widget': SelectDashboard } }
          }}
          formContext={{ names, connectedActivities: dashAct || [] }}
        >
          &nbsp;
        </Form>
      </div>
    );
  }
}

export default ConfigComponent;
