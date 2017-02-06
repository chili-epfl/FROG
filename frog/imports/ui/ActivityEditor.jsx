import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Form from 'react-jsonschema-form';

import {
  Activities,
  addActivity,
  duplicateActivity,
  Operators,
  addOperator
} from '../api/activities';
import { activityTypes, activityTypesObj } from '../activityTypes';
import { OperatorTypeList, OperatorForm, OperatorList } from './EditOperators';

const ActivityList = ({ activities, setFn }) => (
  <div>
    <h3>Activity list</h3>
    <ul>
      {activities.map(activity => (
        <li style={{ listStyle: 'none' }} key={activity._id}>
          <a href="#" onClick={() => Activities.remove({ _id: activity._id })}>
            <i className="fa fa-times" />
          </a>
          <a href="#" onClick={() => setFn(activity.activityType, activity)}>
            <i className="fa fa-pencil" />
          </a>
          <a href="#" onClick={() => duplicateActivity(activity)}>
            <i className="fa fa-copy" />
          </a>
          {activity.data.name} <i>({activity.activityType})</i>
        </li>
      ))}
    </ul>
  </div>
);

const ActivityTypeList = ({ setFn }) => (
  <div>
    <h3>Add activity</h3>
    <ul>
      {activityTypes.map(activityType => (
        <li key={activityType.id} style={{ listStyle: 'none' }}>
          <a href="#" onClick={() => setFn(activityType.id)}>
            <i className="fa fa-plus" />
          </a>
          {activityType.meta.name}
        </li>
      ))}
    </ul>
  </div>
);

const ActivityForm = ({ form, submit, existing }) => {
  const existingId = existing ? existing._id : null;
  return (
    <div>
      {' '}
      {form
        ? <Form
            schema={activityTypesObj[form].config}
            onSubmit={data => submit(form, data.formData, existingId)}
            formData={existing ? existing.data : {}}
            liveValidate
          />
        : <p>
            Please chose an existing activity to edit or an activity type to add a new activity
          </p>}
      {' '}
    </div>
  );
};

class ActivityBody extends Component {
  constructor(props) {
    super(props);
    this.state = { form: null };
  }

  setFn = (type, form, existing) => this.setState({ type, form, existing });
  setActivityFn = (form, existing) => this.setFn('activity', form, existing);
  setOperatorFn = (form, existing) => this.setFn('operator', form, existing);

  submitAddActivity = (type, data, id) => {
    this.setState({ form: null });
    addActivity(type, data, id);
  };

  submitAddOperator = (type, data, id) => {
    this.setState({ form: null, type: null });
    addOperator(type, data, id);
  };

  render() {
    return (
      <div>
        {this.state.type === 'operator'
          ? <OperatorForm
              form={this.state.form}
              existing={this.state.existing}
              submit={this.submitAddOperator}
            />
          : <ActivityForm
              form={this.state.form}
              existing={this.state.existing}
              submit={this.submitAddActivity}
            />}
        <div className="container-fluid">
          <div className="col-md-6">
            <ActivityList
              activities={this.props.activities}
              setFn={this.setActivityFn}
            />
          </div>
          <div className="col-md-6">
            <OperatorList
              operators={this.props.operators}
              activities={this.props.activities}
              setFn={this.setOperatorFn}
            />
          </div>
        </div>
        <div className="container-fluid">
          <div className="col-md-6">
            <ActivityTypeList setFn={this.setActivityFn} />
          </div>
          <div className="col-md-6">
            <OperatorTypeList setFn={this.setOperatorFn} />
          </div>
        </div>
      </div>
    );
  }
}

export default createContainer(
  () => ({
    activities: Activities.find({ graphId: null, sessionId: null }).fetch(),
    operators: Operators.find({ graphId: null, sessionId: null }).fetch()
  }),
  ActivityBody
);
