// @flow
import React, { Component } from 'react';
import { type ActivityPackageT, type ActivityDbT } from 'frog-utils';
import { activityTypes } from '/imports/activityTypes';
import { Activities } from '/imports/api/activities';
import { Button } from 'react-bootstrap';

import ActivityLibrary from './ActivityLibrary';
import ListComponent from '../ListComponent';
import Preview from '../../../Preview/Preview';
import { connect } from '../../store';

type StateT = {
  expanded: ?string,
  searchStr: string,
  showInfo: ?string,
  libraryOpen: boolean
};

type PropsT = {
  store: Object,
  activity: ActivityDbT
};

class ChooseActivityType extends Component<PropsT, StateT> {
  inputRef: any;

  constructor(props) {
    super(props);
    this.state = { expanded: null, searchStr: '', showInfo: null, libraryOpen: false };
    this.inputRef = null;
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

    const filteredList = activityTypes
      .filter(
        x =>
          x.meta.name.toLowerCase().includes(this.state.searchStr) ||
          x.meta.shortDesc.toLowerCase().includes(this.state.searchStr) ||
          x.meta.description.toLowerCase().includes(this.state.searchStr)
      )
      .sort((x: Object, y: Object) => (x.meta.name < y.meta.name ? -1 : 1));

      const closeLibrary = () => this.setState({libraryOpen: false})

    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          transform: 'translateY(-40px)'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '95%',
            height: '35px'
          }}
        >
          <h4>Select activity type</h4>
          <div
            className="input-group"
            style={{ top: '5px', left: '10px', width: '230px' }}
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
          <Button
            style={{
              position: 'relative',
              top: '5px',
              left: '15px',
              width: '70px'
            }}
            onClick={()=> this.setState({libraryOpen: !this.state.libraryOpen})}
          > {this.state.libraryOpen ? 'Create' : 'Library'} </Button>
        </div>
        {this.state.libraryOpen ? <ActivityLibrary {...closeLibrary}/> :
        (<div
          className="list-group"
          style={{
            height: '93%',
            width: '100%',
            overflowY: 'scroll',
            transform: 'translateY(10px)'
          }}
        >
          {filteredList.length === 0 ? (
            <div
              style={{
                marginTop: '20px',
                marginLeft: '10px',
                fontSize: '40px'
              }}
            >
              No result
            </div>
          ) : (
            filteredList.map((x: ActivityPackageT) => (
              <ListComponent
                hasPreview={x.meta.exampleData !== undefined}
                onSelect={() => select(x)}
                showExpanded={this.state.expanded === x.id}
                expand={() => this.setState({ expanded: x.id })}
                key={x.id}
                onPreview={() =>
                  this.props.store.ui.setShowPreview({
                    activityTypeId: x.id
                  })
                }
                object={x}
                searchS={this.state.searchStr}
                eventKey={x.id}
              />
            ))
          )}
        </div>)}
        {this.state.showInfo !== null && (
          <Preview
            activityTypeId={this.state.showInfo}
            dismiss={() => this.setState({ showInfo: null })}
          />
        )}
      </div>
    );
  }
}

export default connect(ChooseActivityType);
