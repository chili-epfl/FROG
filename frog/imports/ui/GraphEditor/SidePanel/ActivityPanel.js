// @flow
import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Form from 'react-jsonschema-form';
import { DropdownButton, MenuItem } from 'react-bootstrap';

import { Activities, addActivity } from '/imports/api/activities';
import { activityTypes, activityTypesObj } from '/imports/activityTypes';

const ChooseActivityType = ({ activity }) => {
  const select = e => {
    if (activityTypesObj[e]) {
      Activities.update(activity._id, { $set: { activityType: e } });
    }
  };

  return (
    <DropdownButton
      title="Select activity type"
      id="selectActivity"
      onSelect={select}
    >
      {activityTypes.map(x => (
        <MenuItem key={x.id} eventKey={x.id}>{x.meta.name}</MenuItem>
      ))}
    </DropdownButton>
  );
};

const EditActivity = ({ activity }) => (
  <Form
    schema={activityTypesObj[activity.activityType].config}
    onChange={data =>
      addActivity(activity.activityType, data.formData, activity._id)}
    formData={activity.data}
    liveValidate
  >
    <div />
  </Form>
);

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
