// @flow
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Form from 'react-jsonschema-form';
import { ChangeableText } from 'frog-utils';

import { Activities, addActivity } from '/imports/api/activities';
import { activityTypes, activityTypesObj } from '/imports/activityTypes';
import Preview from '../Preview';
import { RenameField } from '../Rename';
import { connect } from '../store';
import FileForm from './fileUploader';
import ListComponent from './ListComponent';

class ChooseActivityTypeComp extends Component {
  state: { expanded: number, searchStr: string, showInfo: ?string };

  constructor(props) {
    super(props);
    this.state = { expanded: null, searchStr: '', showInfo: null };
  }

  componentDidMount() {
    this.inputRef.focus();
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
        searchStr: e.target.value.toLowerCase()
      });

    const filteredList = activityTypes.filter(
      x =>
        x.meta.name.toLowerCase().includes(this.state.searchStr) ||
        x.meta.shortDesc.toLowerCase().includes(this.state.searchStr) ||
        x.meta.description.toLowerCase().includes(this.state.searchStr)
    );

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
              ref={ref => (this.inputRef = ref)}
              type="text"
              style={{ zIndex: 0 }}
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
          {filteredList.length === 0
            ? <div
                style={{
                  marginTop: '20px',
                  marginLeft: '10px',
                  fontSize: '40px'
                }}
              >
                No result
              </div>
            : filteredList.map(x =>
                <ListComponent
                  onSelect={() => select(x)}
                  showExpanded={this.state.expanded === x.id}
                  expand={() => this.setState({ expanded: x.id })}
                  key={x.id}
                  onPreview={() => this.setState({ showInfo: x.id })}
                  object={x}
                  searchS={this.state.searchStr}
                  eventKey={x.id}
                />
              )}
        </div>
        {this.state.showInfo !== null &&
          <Preview
            activityTypeId={this.state.showInfo}
            dismiss={() => this.setState({ showInfo: null })}
          />}
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
