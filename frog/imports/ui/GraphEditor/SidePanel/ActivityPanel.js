// @flow
import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Form from 'react-jsonschema-form';
import Dropdown from 'react-dropdown';

import { Activities, addActivity } from '/imports/api/activities';
import { activityTypes, activityTypesObj } from '/imports/activityTypes';

const ChooseActivityType = ({ activity }) => {
  const options = activityTypes.map(x => ({ value: x.id, label: x.meta.name }));
  const onChange = e => {
    if (activityTypesObj[e.value]) {
      Activities.update(activity._id, { $set: { activityType: e.value } });
    }
  };

  return <Dropdown options={options} onChange={onChange} />;
};

const EditActivity = ({ activity }) => (
  <Form
    schema={activityTypesObj[activity.activityType].config}
    onSubmit={data =>
      addActivity(activity.activityType, data.formData, activity._id)}
    formData={activity.data}
    liveValidate
  />
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
