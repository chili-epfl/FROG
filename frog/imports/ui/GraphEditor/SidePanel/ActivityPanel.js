// @flow
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Form from 'react-jsonschema-form';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { A } from 'frog-utils';

import { Activities, addActivity } from '/imports/api/activities';
import { activityTypes, activityTypesObj } from '/imports/activityTypes';
import { RenameField } from '../Rename';
import { connect } from '../store';

const ChooseActivityType = ({ activity }) => {
  const select = e => {
    if (activityTypesObj[e]) {
      Activities.update(activity._id, { $set: { activityType: e } });
    }
  };

  return (
    <div>
      <h3>Please select activity type</h3>
      <DropdownButton title="Select" id="selectActivity" onSelect={select}>
        {activityTypes.map(x => (
          <MenuItem key={x.id} eventKey={x.id}>{x.meta.name}</MenuItem>
        ))}
      </DropdownButton>
    </div>
  );
};

class EditClass extends Component {
  state: { editTitle: boolean };

  constructor(props) {
    super(props);
    this.state = { editTitle: false };
  }

  render() {
    const activity = this.props.activity;
    const graphActivity = this.props.store.activityStore.all.find(
      act => act.id === activity._id
    );

    return (
      <div>
        <div style={{ backgroundColor: '#eee' }}>
          {this.state.editTitle
            ? <h3>
                <RenameField
                  activityId={activity._id}
                  onSubmit={() => {
                    this.setState({ editTitle: false });
                  }}
                />
              </h3>
            : <h3>
                <A onClick={() => this.setState({ editTitle: true })}>
                  <i className="fa fa-pencil" />
                </A>
                &nbsp;{graphActivity.title}
              </h3>}
          <font size={-3}>
            <i>
              {
                `Type: ${activityTypesObj[activity.activityType].meta.name}
                     (${activity.activityType})`
              }
              <br />
              {
                `Starting after ${graphActivity.startTime} min., running for ${graphActivity.length} min.`
              }
            </i>
          </font>
          <hr />
        </div>
        <Form
          schema={activityTypesObj[activity.activityType].config}
          onChange={data =>
            addActivity(activity.activityType, data.formData, activity._id)}
          formData={activity.data}
          liveValidate
        >
          <div />
        </Form>
      </div>
    );
  }
}

const EditActivity = connect(EditClass);

export default createContainer(
  ({ id }) => ({ activity: Activities.findOne(id) }),
  ({ activity }) => {
    if (activity.activityType && activity.activityType !== '') {
      return <EditActivity activity={activity} />;
    } else {
      return <ChooseActivityType activity={activity} />;
    }
  }
);
