// @flow
import React, { Component } from 'react';
import { type ActivityPackageT } from 'frog-utils';
import { activityTypes } from '/imports/activityTypes';
import { Activities } from '/imports/api/activities';

import ListComponent from '../ListComponent';
import Preview from '../../Preview';
import { connect } from '../../store';

class ChooseActivityType extends Component {
  state: { expanded: ?string, searchStr: string, showInfo: ?string };
  inputRef: any;

  constructor(props) {
    super(props);
    this.state = { expanded: null, searchStr: '', showInfo: null };
    this.inputRef = null;
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
            : filteredList.map((x: ActivityPackageT) =>
                <ListComponent
                  hasPreview={x.meta.exampleData !== undefined}
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

export default connect(ChooseActivityType);
