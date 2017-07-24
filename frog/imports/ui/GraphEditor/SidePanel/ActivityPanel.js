// @flow
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Form from 'react-jsonschema-form';
import { ChangeableText } from 'frog-utils';

import { Activities, addActivity } from '/imports/api/activities';
import { activityTypes, activityTypesObj } from '/imports/activityTypes';
import { RenameField } from '../Rename';
import { connect } from '../store';
import FileForm from './fileUploader';
import ListComponent from './ListComponent';

class ChooseActivityTypeComp extends Component {
  state: { expanded: number, listObj: Array<any> };

  constructor(props) {
    super(props);
    this.state = { expanded: null, listObj: activityTypes };
  }

  render() {
    const select = activityType => {
      Activities.update(this.props.activity._id, {
        $set: { activityType: activityType.id }
      });
      this.props.store.addHistory();
    };

    const changeSearch = e =>
      this.setState({
        expanded: null,
        listObj: activityTypes.filter(x =>
          x.meta.name.toLowerCase().includes(e.target.value.toLowerCase())
        )
      });

    return (
      <div style={{ height: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <h4>Please select activity type</h4>
          <div
            className="input-group"
            style={{ top: '5px', left: '10px', width: '250px' }}
          >
            <span className="input-group-addon" id="basic-addon1">
              <span className="glyphicon glyphicon-search" aria-hidden="true" />
            </span>
            <input
              type="text"
              onChange={changeSearch}
              className="form-control"
              placeholder="Search for..."
              aria-describedby="basic-addon1"
            />
          </div>
        </div>
        <div
          className="list-group"
          style={{ height: '730px', width: '100%', overflow: 'scroll' }}
        >
          {this.state.listObj.map(x =>
            <ListComponent
              onSelect={() => select(x)}
              showExpanded={this.state.expanded === x.id}
              expand={() => this.setState({ expanded: x.id })}
              key={x.id}
              onPreview={() => {}}
              object={x}
              eventKey={x.id}
            />
          )}
        </div>
      </div>
    );
  }
}

const EditClass = props => {
  const activity = props.activity;
  const graphActivity = props.store.activityStore.all.find(
    act => act.id === activity._id
  );

  return (
    <div>
      <div style={{ backgroundColor: '#eee' }}>
        <h3>
          <ChangeableText
            EditComponent={RenameField}
            activityId={activity._id}
            value={graphActivity.title}
            onChange={grp =>
              addActivity(activity.activityType, null, activity._id, grp)}
          />
        </h3>
        <font size={-3}>
          <i>
            {`Type: ${activityTypesObj[activity.activityType].meta.name}
                     (${activity.activityType})`}
            <br />
            {`Starting after ${graphActivity.startTime} min., running for ${graphActivity.length} min.`}
          </i>
        </font>
        {activity.plane === 2 &&
          <div>
            Group by attribute:{' '}
            <ChangeableText
              value={activity.groupingKey}
              onChange={grp =>
                addActivity(activity.activityType, null, activity._id, grp)}
            />
          </div>}
        <hr />
      </div>
      <Form
        schema={activityTypesObj[activity.activityType].config}
        onChange={data => {
          addActivity(
            activity.activityType,
            data.formData,
            activity._id,
            null,
            data.errors.length > 0
          );
        }}
        formData={activity.data}
        liveValidate
      >
        <div />
      </Form>
      <FileForm />
    </div>
  );
};

const EditActivity = connect(EditClass);
const ChooseActivityType = connect(ChooseActivityTypeComp);

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
